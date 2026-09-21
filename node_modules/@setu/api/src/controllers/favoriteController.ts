import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/apiError.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();

export async function getFavorites(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.userId },
      include: {
        destination: {
          include: { district: true }
        },
        event: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, count: favorites.length, data: favorites });
  } catch (error) {
    next(error);
  }
}

export async function addFavorite(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const { destinationId, eventId } = req.body;
    if ((!destinationId && !eventId) || (destinationId && eventId)) {
      throw new ApiError(400, 'Must provide exactly one of destinationId or eventId');
    }

    if (destinationId) {
      const existing = await prisma.favorite.findUnique({
        where: {
          userId_destinationId: {
            userId: req.user.userId,
            destinationId
          }
        }
      });
      if (existing) {
        return res.json({ success: true, message: 'Already in favorites', data: existing });
      }

      const favorite = await prisma.favorite.create({
        data: {
          userId: req.user.userId,
          destinationId
        },
        include: {
          destination: { include: { district: true } }
        }
      });
      return res.status(201).json({ success: true, data: favorite });
    }

    if (eventId) {
      const existing = await prisma.favorite.findUnique({
        where: {
          userId_eventId: {
            userId: req.user.userId,
            eventId
          }
        }
      });
      if (existing) {
        return res.json({ success: true, message: 'Already in favorites', data: existing });
      }

      const favorite = await prisma.favorite.create({
        data: {
          userId: req.user.userId,
          eventId
        },
        include: {
          event: true
        }
      });
      return res.status(201).json({ success: true, data: favorite });
    }
  } catch (error) {
    next(error);
  }
}

export async function removeFavorite(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const { type, id } = req.params;
    const legacyId = req.params.destinationId;

    if (type === 'event' || type === 'events') {
      await prisma.favorite.deleteMany({
        where: {
          userId: req.user.userId,
          eventId: id
        }
      });
    } else if (type === 'destination' || type === 'destinations') {
      await prisma.favorite.deleteMany({
        where: {
          userId: req.user.userId,
          destinationId: id
        }
      });
    } else {
      const targetId = id || legacyId;
      await prisma.favorite.deleteMany({
        where: {
          userId: req.user.userId,
          OR: [
            { destinationId: targetId },
            { eventId: targetId }
          ]
        }
      });
    }

    return res.json({ success: true, message: 'Favorite removed' });
  } catch (error) {
    next(error);
  }
}
