import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt.js';
import { ApiError } from '../utils/apiError.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    let token = req.cookies?.setu_token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired authentication token'));
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `Forbidden: Requires ${roles.join(' or ')} access`));
    }

    next();
  };
}

export async function requireApprovedVendor(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user || req.user.role !== 'VENDOR') {
      return next(new ApiError(403, 'Access denied: Vendor account required'));
    }

    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.userId }
    });

    if (!vendor) {
      return next(new ApiError(404, 'Vendor profile not found'));
    }

    if (vendor.status !== 'APPROVED') {
      return next(new ApiError(403, `Vendor account status is ${vendor.status}. Only APPROVED vendors can perform this action.`));
    }

    next();
  } catch (error) {
    next(error);
  }
}
