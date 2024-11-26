import { Response, NextFunction } from 'express';
import { redisClient } from '../lib/redis';
import { 
  UnauthorizedError, 
  RateLimitError, 
  CacheError,
  AuthenticatedRequest,
  asyncHandler
} from '../utils/errors';

// Rate limit configuration
const config = {
  RATE_LIMIT: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5'),
  WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '43200'), // 12 hours in seconds
  KEY_PREFIX: 'rate_limit:'
};

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

  const key = `${config.KEY_PREFIX}${req.userId}`;

  // Get current count and TTL
  const [count, ttl] = await Promise.all([
    redisClient.get(key),
    redisClient.ttl(key)
  ]);

  // Prepare rate limit info
  const rateLimitInfo: RateLimitInfo = {
    limit: config.RATE_LIMIT,
    remaining: config.RATE_LIMIT,
    resetTime: config.WINDOW
  };

  if (!count || ttl < 0) {
    // First request or expired key
    await Promise.all([
      redisClient.set(key, '1'),
      redisClient.expire(key, config.WINDOW)
    ]);

    rateLimitInfo.remaining = config.RATE_LIMIT - 1;
  } else {
    const currentCount = parseInt(count);
    rateLimitInfo.remaining = Math.max(0, config.RATE_LIMIT - currentCount);
    rateLimitInfo.resetTime = ttl;

    if (currentCount >= config.RATE_LIMIT) {
      throw new RateLimitError('Rate limit exceeded', {
        limit: config.RATE_LIMIT,
        remaining: 0,
        resetTime: ttl,
        retryAfter: ttl
      });
    }

    // Increment count
    await redisClient.incr(key);
  }

  // Set rate limit headers
  res.set({
    'X-RateLimit-Limit': config.RATE_LIMIT.toString(),
    'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
    'X-RateLimit-Reset': Math.floor(Date.now() / 1000 + rateLimitInfo.resetTime).toString()
  });

  next();
});

// Helper function to get current rate limit info
export const getRateLimitInfo = async (userId: number): Promise<RateLimitInfo> => {
  try {
    const key = `${config.KEY_PREFIX}${userId}`;
    const [count, ttl] = await Promise.all([
      redisClient.get(key),
      redisClient.ttl(key)
    ]);

    if (!count || ttl < 0) {
      return {
        limit: config.RATE_LIMIT,
        remaining: config.RATE_LIMIT,
        resetTime: config.WINDOW
      };
    }

    return {
      limit: config.RATE_LIMIT,
      remaining: Math.max(0, config.RATE_LIMIT - parseInt(count)),
      resetTime: ttl
    };
  } catch (error) {
    throw new CacheError('Error getting rate limit info', { original: error });
  }
};
