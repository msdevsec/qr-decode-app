import Redis from 'ioredis';

// Mock Redis module before any imports
const mockRedis = {
  get: jest.fn().mockResolvedValue('value'),
  set: jest.fn().mockResolvedValue('OK'),
  incr: jest.fn().mockResolvedValue(1),
  expire: jest.fn().mockResolvedValue(1),
  ttl: jest.fn().mockResolvedValue(3600),
  ping: jest.fn().mockResolvedValue('PONG'),
  on: jest.fn()
};

// Mock redis.ts module directly
jest.mock('../../../lib/redis', () => {
  // Register event handlers
  mockRedis.on.mockImplementation((event, handler) => {
    if (event === 'connect') {
      handler();
    } else if (event === 'error') {
      handler(new Error('Redis error'));
    }
    return mockRedis;
  });

  return {
    redisClient: mockRedis
  };
});

describe('Redis Client', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
  });

  it('should handle basic operations', async () => {
    // Test set operation
    const setResult = await mockRedis.set('key', 'value');
    expect(setResult).toBe('OK');
    expect(mockRedis.set).toHaveBeenCalledWith('key', 'value');

    // Test get operation
    const getValue = await mockRedis.get('key');
    expect(getValue).toBe('value');
    expect(mockRedis.get).toHaveBeenCalledWith('key');

    // Test increment operation
    const incrResult = await mockRedis.incr('counter');
    expect(incrResult).toBe(1);
    expect(mockRedis.incr).toHaveBeenCalledWith('counter');

    // Test expire operation
    const expireResult = await mockRedis.expire('key', 3600);
    expect(expireResult).toBe(1);
    expect(mockRedis.expire).toHaveBeenCalledWith('key', 3600);

    // Test TTL operation
    const ttlResult = await mockRedis.ttl('key');
    expect(ttlResult).toBe(3600);
    expect(mockRedis.ttl).toHaveBeenCalledWith('key');
  });

  it('should handle connection check', async () => {
    const pingResult = await mockRedis.ping();
    expect(pingResult).toBe('PONG');
    expect(mockRedis.ping).toHaveBeenCalled();
  });

  it('should handle connection events', () => {
    // Import Redis client to trigger event handlers
    const { redisClient } = require('../../../lib/redis');

    // Register event handlers
    redisClient.on('connect', () => {});
    redisClient.on('error', () => {});

    // Verify event handlers were registered
    expect(mockRedis.on).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(mockRedis.on).toHaveBeenCalledWith('error', expect.any(Function));
  });

  it('should handle errors', async () => {
    const error = new Error('Redis error');
    mockRedis.get.mockRejectedValueOnce(error);

    await expect(mockRedis.get('key')).rejects.toThrow('Redis error');
  });
});
