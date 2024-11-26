import { PrismaClient } from '@prisma/client';

// Create Prisma client with logging in development
const createPrismaClient = () => {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'info', 'warn', 'error']
      : ['error'],
  });

  // Connection retry logic
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 5000; // 5 seconds

  const connectWithRetry = async (retries = MAX_RETRIES) => {
    try {
      await client.$connect();
      console.log('Successfully connected to database');
    } catch (error) {
      console.error(`Database connection error (${MAX_RETRIES - retries + 1}/${MAX_RETRIES}):`, error);
      
      if (retries > 0) {
        console.log(`Retrying in ${RETRY_DELAY/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return connectWithRetry(retries - 1);
      } else {
        console.error('Max retries reached. Exiting...');
        process.exit(1);
      }
    }
  };

  // Initial connection attempt
  connectWithRetry();

  // Handle cleanup on shutdown
  const cleanup = async () => {
    try {
      await client.$disconnect();
      console.log('Disconnected from database');
    } catch (error) {
      console.error('Error during database disconnect:', error);
      process.exit(1);
    }
  };

  // Register cleanup handlers
  process.on('beforeExit', cleanup);
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('uncaughtException', async (error) => {
    console.error('Uncaught exception:', error);
    await cleanup();
    process.exit(1);
  });

  return client;
};

// Export Prisma client instance
export const prisma = createPrismaClient();
