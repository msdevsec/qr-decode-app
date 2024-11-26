import { Request, Response, NextFunction } from 'express';
import { rateLimit } from '../../../middleware/rateLimit';
import { redisClient } from '../../../lib/redis';

// Mock Redis
jest.mock('../../../lib/redis', () => ({
  redisClient: {
    get: jest.fn(),
    set: jest.fn(),
    incr: jest.fn(),
    expire: jest.fn(),
    ttl: jest.fn()
  }
}));

describe('Rate Limit Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      userId: 1
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should allow request when under limit', async () => {
    // Mock Redis getting current count
    (redisClient.get as jest.Mock).mockResolvedValue('3');

    await rateLimit(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(redisClient.incr).toHaveBeenCalledWith('rate_limit:1');
  });

  it('should block request when over limit', async () => {
    // Mock Redis getting current count and TTL
    (redisClient.get as jest.Mock).mockResolvedValue('5');
    (redisClient.ttl as jest.Mock).mockResolvedValue(3600);

    await rateLimit(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(429);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Rate limit exceeded',
      resetTime: 3600,
      limit: 5,
      remaining: 0
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should initialize count for new users', async () => {
    // Mock Redis no existing count
    (redisClient.get as jest.Mock).mockResolvedValue(null);

    await rateLimit(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(redisClient.set).toHaveBeenCalledWith(
      'rate_limit:1',
      '1',
      'EX',
      expect.any(Number)
    );
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should require authentication', async () => {
    mockRequest.userId = undefined;

    await rateLimit(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Authentication required'
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should handle Redis errors gracefully', async () => {
    // Mock Redis error
    (redisClient.get as jest.Mock).mockRejectedValue(new Error('Redis error'));

    await rateLimit(mockRequest as Request, mockResponse as Response, nextFunction);

    // Should fail open (allow request)
    expect(nextFunction).toHaveBeenCalled();
  });
});
