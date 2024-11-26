import Redis, { RedisOptions, Redis as RedisClient } from 'ioredis';

// Create Redis client
const createRedisClient = (): RedisClient => {
  // Parse Redis URL if provided
  const redisUrl = process.env.REDIS_URL;
  let options: RedisOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: 3,
    enableOfflineQueue: true,
    showFriendlyErrorStack: true,
    retryStrategy: (times: number): number | null => {
      const maxRetryDelay = 5000; // 5 seconds
      const minRetryDelay = 1000; // 1 second
      const delay = Math.min(times * 1000, maxRetryDelay);
      
      if (times > 10) {
        console.error('Max Redis connection retries reached');
        return null; // Stop retrying
      }

      console.log(`Retrying Redis connection in ${delay}ms... (Attempt ${times})`);
      return Math.max(delay, minRetryDelay);
    },
    reconnectOnError: (err: Error): boolean => {
      const targetError = 'READONLY';
      if (err.message.includes(targetError)) {
        console.log('Redis reconnecting due to READONLY error');
        return true; // Reconnect for READONLY error
      }
      return false;
    }
  };

  // If REDIS_URL is provided, use it instead of individual options
  if (redisUrl) {
    try {
      options = {
        ...options,
        ...parseRedisUrl(redisUrl)
      };
    } catch (error) {
      console.error('Error parsing Redis URL:', error);
    }
  }

  const client = new Redis(options);

  // Handle connection events
  client.on('connect', () => {
    console.log('Connected to Redis');
    // Test Redis connection and persistence
    testRedisConnection(client).catch(console.error);
  });

  client.on('ready', () => {
    console.log('Redis client is ready');
  });

  client.on('error', (error: Error) => {
    console.error('Redis connection error:', error);
  });

  client.on('close', () => {
    console.log('Redis connection closed');
  });

  client.on('reconnecting', (delay: number) => {
    console.log(`Redis reconnecting in ${delay}ms`);
  });

  // Monitor Redis commands in development
  if (process.env.NODE_ENV === 'development') {
    client.monitor((err, monitorClient) => {
      if (err) {
        console.error('Redis monitor error:', err);
        return;
      }

      if (monitorClient) {
        console.log('Redis monitoring started');
        monitorClient.on('monitor', (time, args) => {
          console.log('Redis command:', args);
        });
      }
    });
  }

  // Handle cleanup on shutdown
  const cleanup = async () => {
    try {
      await client.quit();
      console.log('Redis connection closed gracefully');
    } catch (error) {
      console.error('Error during Redis disconnect:', error);
      process.exit(1);
    }
  };

  // Register cleanup handlers
  process.on('beforeExit', cleanup);
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  return client;
};

// Helper function to parse Redis URL
const parseRedisUrl = (url: string): RedisOptions => {
  const parsedUrl = new URL(url);
  return {
    host: parsedUrl.hostname,
    port: parseInt(parsedUrl.port || '6379'),
    username: parsedUrl.username || undefined,
    password: parsedUrl.password || undefined,
    db: parseInt(parsedUrl.pathname?.slice(1) || '0'),
    tls: parsedUrl.protocol === 'rediss:' ? {} : undefined
  };
};

// Test Redis connection and persistence
const testRedisConnection = async (client: RedisClient): Promise<void> => {
  try {
    // Test basic set/get
    const testKey = 'test:connection';
    await client.set(testKey, 'test');
    const value = await client.get(testKey);
    console.log('Redis test value:', value);

    // Test expiry
    await client.expire(testKey, 10);
    const ttl = await client.ttl(testKey);
    console.log('Redis test TTL:', ttl);

    // Test persistence configuration
    const config = await client.config('GET', 'appendonly');
    console.log('Redis persistence config:', config);

    // Clean up test key
    await client.del(testKey);
  } catch (error) {
    console.error('Redis connection test failed:', error);
    throw error;
  }
};

// Export Redis client instance
export const redisClient = createRedisClient();
