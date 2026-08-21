import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/apiError.js';

const prisma = new PrismaClient();

function parseJsonField(val: any, fallback: any = []) {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return val || fallback;
}

export async function getCityHubs(req: Request, res: Response, next: NextFunction) {
  try {
    const hubs = await prisma.cityHub.findMany();
    const formatted = hubs.map(h => ({
      ...h,
      touristPlaces: parseJsonField(h.touristPlaces, [])
    }));
    return res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    next(error);
  }
}

export async function getCityHubBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    const hub = await prisma.cityHub.findUnique({
      where: { slug }
    });

    if (!hub) {
      throw new ApiError(404, 'City hub not found');
    }

    const formatted = {
      ...hub,
      touristPlaces: parseJsonField(hub.touristPlaces, [])
    };

    return res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
}
