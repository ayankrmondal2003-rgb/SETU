import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/apiError.js';

const prisma = new PrismaClient();

function parseJsonField(val: any, fallback: any = []) {
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return val || fallback;
}

export async function getPublicOfferings(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, search } = req.query;

    const where: any = {
      isActive: true,
      vendor: { status: 'APPROVED' }
    };

    if (category) {
      where.category = { contains: String(category) };
    }

    if (search) {
      where.OR = [
        { title: { contains: String(search) } },
        { description: { contains: String(search) } },
        { location: { contains: String(search) } }
      ];
    }

    const offerings = await prisma.offering.findMany({
      where,
      include: {
        vendor: {
          select: { id: true, businessName: true, logo: true, city: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = offerings.map(o => ({
      ...o,
      gallery: parseJsonField(o.gallery, [])
    }));

    return res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    next(error);
  }
}

export async function getPublicOfferingBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;

    const offering = await prisma.offering.findUnique({
      where: { slug },
      include: {
        vendor: {
          select: {
            id: true,
            businessName: true,
            description: true,
            logo: true,
            phone: true,
            email: true,
            city: true
          }
        }
      }
    });

    if (!offering || !offering.isActive) {
      throw new ApiError(404, 'Offering not found');
    }

    const formatted = {
      ...offering,
      gallery: parseJsonField(offering.gallery, [])
    };

    return res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
}
