import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { ApiError } from '../utils/apiError.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import {
  verifyRazorpaySignature,
  createSubscription,
  fetchSubscription,
  verifyRazorpaySubscriptionSignature
} from '../services/razorpayService.js';

const prisma = new PrismaClient();

const verifyPaymentSchema = z.object({
  orderId: z.string(), // Local DB Order ID
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string()
});

export async function verifyPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const data = verifyPaymentSchema.parse(req.body);

    const order = await prisma.order.findUnique({
      where: { id: data.orderId }
    });

    if (!order) {
      throw new ApiError(404, 'Booking order not found');
    }

    const isValidSignature = verifyRazorpaySignature(
      data.razorpayOrderId,
      data.razorpayPaymentId,
      data.razorpaySignature
    );

    if (!isValidSignature) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'FAILED', orderStatus: 'CANCELLED' }
      });
      throw new ApiError(400, 'Invalid payment signature. Verification failed.');
    }

    // Payment Signature Verified! Compute SETU commission server-side (never trust client values)
    const commissionAmount = Math.round(order.amount * 0.07 * 100) / 100;
    const vendorEarnings = Math.round((order.amount - commissionAmount) * 100) / 100;

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'PAID',
        orderStatus: 'CONFIRMED',
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
        razorpaySignature: data.razorpaySignature,
        commissionAmount,
        vendorEarnings
      },
      include: {
        offering: true,
        vendor: { select: { businessName: true, phone: true } }
      }
    });

    // Auto-create Notification for vendor on payment credit
    await prisma.notification.create({
      data: {
        vendorId: order.vendorId,
        type: 'payment_credited',
        title: 'Payment Credited',
        message: `Payment of ₹${vendorEarnings.toLocaleString('en-IN')} confirmed for order #${order.orderNumber}.`,
        relatedOrderId: order.id
      }
    }).catch(() => {});

    return res.json({
      success: true,
      message: 'Payment verified successfully. Booking confirmed!',
      data: updatedOrder
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ApiError(400, error.errors.map(e => e.message).join(', ')));
    }
    next(error);
  }
}

// SETU Plus — create a ₹99/month Razorpay Subscription using the manually-created Plan ID
export async function createPremiumSubscription(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');
    if (req.user.role !== 'TOURIST') {
      throw new ApiError(403, 'SETU Plus is available to customer (TOURIST) accounts only');
    }

    const subscription = await createSubscription(req.user.userId);

    return res.status(201).json({
      success: true,
      razorpay: {
        subscriptionId: subscription.id,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_setu_bihar_demo_key'
      }
    });
  } catch (error) {
    next(error);
  }
}

const verifyPremiumSchema = z.object({
  razorpaySubscriptionId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string()
});

// SETU Plus — verify subscription signature + confirm live state with Razorpay before activating premium
export async function verifyPremiumSubscription(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const data = verifyPremiumSchema.parse(req.body);

    const isValidSignature = verifyRazorpaySubscriptionSignature(
      data.razorpaySubscriptionId,
      data.razorpayPaymentId,
      data.razorpaySignature
    );

    if (!isValidSignature) {
      throw new ApiError(400, 'Invalid subscription payment signature. Verification failed.');
    }

    // Never trust the frontend alone — confirm subscription state directly with Razorpay
    const subscription = await fetchSubscription(data.razorpaySubscriptionId);

    if (subscription.status !== 'active' && subscription.status !== 'authenticated') {
      throw new ApiError(400, `Subscription is not active (status: ${subscription.status})`);
    }

    const premiumExpiresAt = subscription.currentEnd
      ? new Date(subscription.currentEnd * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const existing = await prisma.user.findUnique({ where: { id: req.user.userId } });

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        isPremium: true,
        premiumSince: existing?.premiumSince || new Date(),
        premiumExpiresAt,
        razorpaySubscriptionId: data.razorpaySubscriptionId
      }
    });

    return res.json({
      success: true,
      message: 'SETU Plus activated successfully!',
      data: {
        isPremium: updatedUser.isPremium,
        premiumSince: updatedUser.premiumSince,
        premiumExpiresAt: updatedUser.premiumExpiresAt
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ApiError(400, error.errors.map(e => e.message).join(', ')));
    }
    next(error);
  }
}
