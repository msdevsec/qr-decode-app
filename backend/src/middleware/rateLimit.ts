import { Response, NextFunction } from 'express';
import { redisClient } from '../lib/redis';
import { AuthenticatedRequest } from '../types/custom';

export const rateLimit = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;

    // Get current count from Redis
    const key = `scan_count:${userId}`;
    const count = await redisClient.get(key);
    
    if (count) {
      const currentCount = parseInt(count);
      
      // Check if limit exceeded
      if (currentCount >= 5) {
        // Get remaining time
        const ttl = await redisClient.ttl(key);
        
        res.status(429).json({
          error: 'Rate limit exceeded',
          resetTime: ttl,
          limit: 5,
          remaining: 0
        });
        return;
      }
    }

    // Allow request to proceed
    next();
  } catch (error) {
    console.error('Rate limit middleware error:', error);
    // On error, allow request (fail open for better UX)
    next();
  }
};
