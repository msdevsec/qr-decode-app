import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { prisma } from '../lib/prisma';

// Mock Prisma
jest.mock('../lib/prisma', () => ({
  prisma: mockDeep<PrismaClient>()
}));

// Mock Redis
jest.mock('../lib/redis', () => ({
  redisClient: {
    get: jest.fn(),
    set: jest.fn(),
    incr: jest.fn(),
    expire: jest.fn()
  }
}));

// Get the mocked prisma instance
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

// Reset mocks before each test
beforeEach(() => {
  mockReset(prismaMock);
});

// Add a simple test to avoid "no tests" error
describe('Test Setup', () => {
  it('should setup test environment', () => {
    expect(prismaMock).toBeDefined();
  });
});
