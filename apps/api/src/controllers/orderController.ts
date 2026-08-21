import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { ApiError } from '../utils/apiError.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { createRazorpayOrder } from '../services/razorpayService.js';

const prisma = new PrismaClient();

const createOrderSchema = z.object({
  offeringId: z.string(),
  quantity: z.number().int().positive().default(1),
  bookingDate: z.string(),
  notes: z.string().optional()
});

export async function createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const data = createOrderSchema.parse(req.body);

    const offering = await prisma.offering.findUnique({
      where: { id: data.offeringId },
      include: { vendor: true }
    });

    if (!offering || !offering.isActive || offering.vendor.status !== 'APPROVED') {
      throw new ApiError(400, 'Offering is not available for booking');
    }

    const totalAmount = offering.price * data.quantity;
    const orderNumber = `SETU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create Razorpay Payment Order
    const rzpOrder = await createRazorpayOrder(totalAmount, orderNumber);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user.userId,
        vendorId: offering.vendorId,
        offeringId: offering.id,
        quantity: data.quantity,
        bookingDate: new Date(data.bookingDate),
        amount: totalAmount,
        currency: 'INR',
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING',
        razorpayOrderId: rzpOrder.id,
        notes: data.notes || null
      },
      include: {
        offering: true,
        vendor: { select: { businessName: true, phone: true } }
      }
    });

    // Auto-create Notification for vendor
    await prisma.notification.create({
      data: {
        vendorId: offering.vendorId,
        type: 'booking_new',
        title: 'New Booking Order',
        message: `New booking order #${orderNumber} received for "${offering.title}".`,
        relatedOrderId: order.id
      }
    }).catch(() => {});

    return res.status(201).json({
      success: true,
      data: order,
      razorpay: {
        orderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_setu_bihar_demo_key'
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ApiError(400, error.errors.map(e => e.message).join(', ')));
    }
    next(error);
  }
}

export async function getTouristOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      include: {
        offering: true,
        vendor: { select: { id: true, businessName: true, phone: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
}

export async function getOrderById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        offering: true,
        vendor: { select: { id: true, businessName: true, phone: true, email: true } }
      }
    });

    if (!order) throw new ApiError(404, 'Order not found');

    if (order.userId !== req.user.userId && req.user.role !== 'ADMIN' && order.vendorId !== req.user.userId) {
      throw new ApiError(403, 'Forbidden: Cannot view another user order');
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

export async function cancelOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const { id } = req.params;
    const order = await prisma.order.findUnique({ where: { id } });

    if (!order || order.userId !== req.user.userId) {
      throw new ApiError(404, 'Order not found or permission denied');
    }

    if (order.orderStatus === 'COMPLETED' || order.orderStatus === 'CANCELLED') {
      throw new ApiError(400, `Cannot cancel order in ${order.orderStatus} state`);
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { orderStatus: 'CANCELLED' }
    });

    return res.json({ success: true, data: updated, message: 'Booking order cancelled successfully' });
  } catch (error) {
    next(error);
  }
}
