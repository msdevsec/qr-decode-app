import { Response, NextFunction } from 'express';
import { redisClient } from '../lib/redis';
import { 
  UnauthorizedError, 
  RateLimitError, 
  CacheError,
  AuthenticatedRequest,
  asyncHandler
} from '../utils/errors';
import { getRateLimitKey, rateLimitConfig } from '../utils/rateLimit';

interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: number;
}

export const rateLimit = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check authentication
  if (!req.userId) {
    throw new UnauthorizedError('Authentication required');
  }

  const key = getRateLimitKey(req.userId);
  console.log('Rate limit check:', { userId: req.userId, key });

  try {
    // Use MULTI to make operations atomic
    const multi = redisClient.multi();

    // Get current count and increment in one atomic operation
    const result = await multi
      .incr(key)
      .expire(key, rateLimitConfig.WINDOW)
      .exec();

    // Get the new count from the INCR result
    const newCount = result?.[0]?.[1] as number;
    console.log('Rate limit counter:', { userId: req.userId, count: newCount });

    if (newCount > rateLimitConfig.RATE_LIMIT) {
      // If over limit, decrement the counter back
      await redisClient.decr(key);
      
      const ttl = await redisClient.ttl(key);
      console.log('Rate limit exceeded:', { userId: req.userId, count: newCount - 1, ttl });
      
      throw new RateLimitError('Rate limit exceeded', {
        limit: rateLimitConfig.RATE_LIMIT,
        remaining: 0,
        resetTime: ttl,
        retryAfter: ttl
      });
    }

    // Calculate remaining scans
    const remaining = Math.max(0, rateLimitConfig.RATE_LIMIT - newCount);
    const ttl = await redisClient.ttl(key);

    // Set rate limit headers
    res.set({
      'X-RateLimit-Limit': rateLimitConfig.RATE_LIMIT.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': Math.floor(Date.now() / 1000 + ttl).toString()
    });

    console.log('Rate limit updated:', {
      userId: req.userId,
      count: newCount,
      remaining,
      ttl,
      headers: {
        limit: res.get('X-RateLimit-Limit'),
        remaining: res.get('X-RateLimit-Remaining'),
        reset: res.get('X-RateLimit-Reset')
      }
    });

    next();
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }
    console.error('Rate limit error:', error);
    throw new CacheError('Rate limiting service unavailable');
  }
});

// Helper function to get current rate limit info
export const getRateLimitInfo = async (userId: number): Promise<RateLimitInfo> => {
  try {
    const key = getRateLimitKey(userId);
    console.log('Getting rate limit info:', { userId, key });
    
    const [count, ttl] = await Promise.all([
      redisClient.get(key),
      redisClient.ttl(key)
    ]);

    const currentCount = count ? parseInt(count) : 0;
    const resetTime = ttl > 0 ? ttl : rateLimitConfig.WINDOW;

    console.log('Rate limit info:', { userId, currentCount, resetTime });

    return {
      limit: rateLimitConfig.RATE_LIMIT,
      remaining: Math.max(0, rateLimitConfig.RATE_LIMIT - currentCount),
      resetTime
    };
  } catch (error) {
    console.error('Rate limit info error:', error);
    throw new CacheError('Rate limiting service unavailable');
  }
};
