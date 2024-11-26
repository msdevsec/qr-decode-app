import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { 
  UnauthorizedError, 
  AuthenticatedRequest,
  asyncHandler 
} from '../utils/errors';

interface JwtPayload {
  userId: number;
}

export const auth = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Get token from header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new UnauthorizedError('Authentication required');
  }

  // Check token format
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new UnauthorizedError('Invalid token format');
  }

  const token = parts[1];

  try {
    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'secret'
    ) as JwtPayload;

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true }
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Set user ID on request
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid token');
    } else {
      throw error;
    }
  }
});
