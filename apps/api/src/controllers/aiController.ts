import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateBiharTravelRecommendation } from '../services/geminiService.js';
import { ApiError } from '../utils/apiError.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();

export async function getAiRecommendation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    // SETU AI Companion is a customer (TOURIST) feature — vendors/admins get an explicit auth response,
    // not the free customer tier.
    if (req.user.role !== 'TOURIST') {
      throw new ApiError(403, 'SETU AI Companion is available to SETU customer accounts only');
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) throw new ApiError(404, 'User not found');

    const isPremium = user.isPremium;

    const { interests, durationDays, startingCity, travelerType } = req.body;

    if (interests && !Array.isArray(interests)) {
      throw new ApiError(400, 'Interests must be an array of strings');
    }

    // Reuse the existing generation implementation unchanged — free tier just requests
    // a capped duration; premium tier requests exactly what the user asked for.
    const recommendation = await generateBiharTravelRecommendation({
      interests: interests || ['Buddhist heritage', 'culture', 'food'],
      durationDays: isPremium ? (Number(durationDays) || 3) : 1,
      startingCity: startingCity || 'Patna',
      travelerType: travelerType || 'Solo/Family'
    });

    if (isPremium) {
      return res.json({ success: true, tier: 'premium', data: recommendation });
    }

    // Free tier: constrain the existing result — basic suggestions only, no insider
    // tips or food recommendations (those are explicit SETU Plus benefits).
    const basicRecommendation = {
      ...recommendation,
      recommendedCircuits: (recommendation.recommendedCircuits || []).slice(0, 1),
      highlightDestinations: (recommendation.highlightDestinations || []).slice(0, 3),
      dayByDayItinerary: (recommendation.dayByDayItinerary || []).slice(0, 1).map((day: any) => ({
        day: day.day,
        title: day.title,
        activities: day.activities
      })),
      insiderTips: []
    };

    return res.json({
      success: true,
      tier: 'free',
      upgradeAvailable: true,
      data: basicRecommendation
    });
  } catch (error) {
    next(error);
  }
}
