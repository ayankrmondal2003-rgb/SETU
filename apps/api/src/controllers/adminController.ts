import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/apiError.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();

// Stats Overview
export async function getAdminStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const totalUsers = await prisma.user.count();
    const totalVendors = await prisma.vendor.count();
    const pendingVendors = await prisma.vendor.count({ where: { status: 'PENDING' } });
    const approvedVendors = await prisma.vendor.count({ where: { status: 'APPROVED' } });
    const totalOfferings = await prisma.offering.count();
    const totalOrders = await prisma.order.count();
    const paidOrders = await prisma.order.count({ where: { paymentStatus: 'PAID' } });

    const totalRevenueResult = await prisma.order.aggregate({
      _sum: { amount: true },
      where: { paymentStatus: 'PAID' }
    });

    return res.json({
      success: true,
      data: {
        totalUsers,
        totalVendors,
        pendingVendors,
        approvedVendors,
        totalOfferings,
        totalOrders,
        paidOrders,
        totalRevenue: totalRevenueResult._sum.amount || 0
      }
    });
  } catch (error) {
    next(error);
  }
}

// Vendor Management
export async function getAllVendors(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { status } = req.query;

    const where: any = {};
    if (status) {
      where.status = String(status);
    }

    const vendors = await prisma.vendor.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        offerings: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, count: vendors.length, data: vendors });
  } catch (error) {
    next(error);
  }
}

export async function updateVendorStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['APPROVED', 'REJECTED', 'SUSPENDED', 'PENDING'].includes(status)) {
      throw new ApiError(400, 'Invalid vendor status. Must be APPROVED, REJECTED, SUSPENDED, or PENDING.');
    }

    const vendor = await prisma.vendor.update({
      where: { id },
      data: { status },
      include: { user: { select: { name: true, email: true } } }
    });

    // Auto-create Notification for vendor on status change
    await prisma.notification.create({
      data: {
        vendorId: vendor.id,
        type: status === 'APPROVED' ? 'offering_approved' : 'offering_rejected',
        title: status === 'APPROVED' ? 'Vendor Status Approved' : 'Vendor Status Updated',
        message: status === 'APPROVED'
          ? 'Your SETU vendor profile has been approved! You can now publish and manage live offerings.'
          : `Your vendor account status has been updated to ${status}.`
      }
    }).catch(() => {});

    return res.json({
      success: true,
      message: `Vendor status updated to ${status}`,
      data: vendor
    });
  } catch (error) {
    next(error);
  }
}

// User Management
export async function getAllUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
}

// All Platform Orders
export async function getAllOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        vendor: { select: { businessName: true } },
        offering: { select: { title: true, price: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
}
