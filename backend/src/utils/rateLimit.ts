// Rate limit configuration
export const rateLimitConfig = {
  RATE_LIMIT: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5'),
  WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '86400'), // 24 hours in seconds
  KEY_PREFIX: 'qrdecode:ratelimit:'
};

// Helper function to get rate limit key
export const getRateLimitKey = (userId: number): string => {
  return `${rateLimitConfig.KEY_PREFIX}user:${userId}:scans`;
};
