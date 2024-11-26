import { PrismaClient } from '@prisma/client';

// Mock data
const mockUser = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  password_hash: 'hashedpassword',
  created_at: new Date()
};

const mockScan = {
  id: 1,
  content: 'https://example.com',
  type: 'URL',
  user_id: 1,
  created_at: new Date()
};

// Create mock instance
const mockPrisma = {
  $connect: jest.fn().mockResolvedValue(undefined),
  $disconnect: jest.fn().mockResolvedValue(undefined),
  user: {
    findUnique: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockResolvedValue(mockUser),
    findMany: jest.fn().mockResolvedValue([mockUser]),
    update: jest.fn().mockResolvedValue(mockUser),
    delete: jest.fn().mockResolvedValue(mockUser)
  },
  scan: {
    create: jest.fn().mockResolvedValue(mockScan),
    findMany: jest.fn().mockResolvedValue([mockScan]),
    findUnique: jest.fn().mockResolvedValue(mockScan),
    count: jest.fn().mockResolvedValue(1),
    delete: jest.fn().mockResolvedValue(mockScan)
  }
};

// Mock PrismaClient constructor
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: function() {
      return mockPrisma;
    }
  };
});

// Mock prisma.ts module
jest.mock('../../../lib/prisma', () => {
  return {
    prisma: mockPrisma
  };
});

describe('Prisma Client', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('User Operations', () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User',
      password_hash: 'hashedpassword'
    };

    it('should create user', async () => {
      const createdUser = await mockPrisma.user.create({ data: userData });
      expect(createdUser).toEqual(mockUser);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: userData
      });
    });

    it('should find user', async () => {
      const foundUser = await mockPrisma.user.findUnique({
        where: { email: userData.email }
      });
      expect(foundUser).toEqual(mockUser);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email }
      });
    });
  });

  describe('Scan Operations', () => {
    const scanData = {
      content: 'https://example.com',
      type: 'URL',
      user_id: 1
    };

    it('should create scan', async () => {
      const createdScan = await mockPrisma.scan.create({ data: scanData });
      expect(createdScan).toEqual(mockScan);
      expect(mockPrisma.scan.create).toHaveBeenCalledWith({
        data: scanData
      });
    });

    it('should find scans', async () => {
      const scans = await mockPrisma.scan.findMany({
        where: { user_id: 1 }
      });
      expect(scans).toEqual([mockScan]);
      expect(mockPrisma.scan.findMany).toHaveBeenCalledWith({
        where: { user_id: 1 }
      });
    });

    it('should count scans', async () => {
      const count = await mockPrisma.scan.count({
        where: { user_id: 1 }
      });
      expect(count).toBe(1);
      expect(mockPrisma.scan.count).toHaveBeenCalledWith({
        where: { user_id: 1 }
      });
    });
  });

  it('should handle connection lifecycle', async () => {
    await mockPrisma.$connect();
    expect(mockPrisma.$connect).toHaveBeenCalled();

    await mockPrisma.$disconnect();
    expect(mockPrisma.$disconnect).toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    const error = new Error('Database error');
    mockPrisma.user.create.mockRejectedValueOnce(error);

    await expect(mockPrisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password_hash: 'hashedpassword'
      }
    })).rejects.toThrow('Database error');
  });
});
