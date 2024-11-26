import { Request, Response } from 'express';
import { scanController } from '../../../controllers/scanController';
import { prisma } from '../../../lib/prisma';
import { redisClient } from '../../../lib/redis';

// Mock Prisma
jest.mock('../../../lib/prisma', () => ({
  prisma: {
    scan: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn()
    }
  }
}));

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

describe('Scan Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockRequest = {
      userId: 1,
      body: {
        content: 'https://example.com',
        type: 'URL'
      }
    };
    mockResponse = {
      json: mockJson,
      status: mockStatus
    };

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('createScan', () => {
    it('should create a new scan', async () => {
      const mockScan = {
        id: 1,
        content: 'https://example.com',
        type: 'URL',
        user_id: 1,
        created_at: new Date()
      };

      (prisma.scan.create as jest.Mock).mockResolvedValue(mockScan);

      await scanController.createScan(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockScan);
    });

    it('should require authentication', async () => {
      mockRequest.userId = undefined;

      await scanController.createScan(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Authentication required' });
    });

    it('should validate required fields', async () => {
      mockRequest.body = {};

      await scanController.createScan(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Content and type are required' });
    });
  });

  describe('getScanHistory', () => {
    it('should return scan history', async () => {
      const mockScans = [
        {
          id: 1,
          content: 'https://example.com',
          type: 'URL',
          user_id: 1,
          created_at: new Date()
        }
      ];

      (prisma.scan.findMany as jest.Mock).mockResolvedValue(mockScans);

      await scanController.getScanHistory(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockJson).toHaveBeenCalledWith(mockScans);
      expect(prisma.scan.findMany).toHaveBeenCalledWith({
        where: { user_id: 1 },
        orderBy: { created_at: 'desc' }
      });
    });

    it('should require authentication', async () => {
      mockRequest.userId = undefined;

      await scanController.getScanHistory(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Authentication required' });
    });
  });

  describe('getStats', () => {
    it('should return scan statistics', async () => {
      (prisma.scan.count as jest.Mock).mockResolvedValue(10);
      (redisClient.get as jest.Mock).mockResolvedValue('3');

      await scanController.getStats(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockJson).toHaveBeenCalledWith({
        totalScans: 10,
        remainingToday: 2
      });
    });

    it('should handle no scans today', async () => {
      (prisma.scan.count as jest.Mock).mockResolvedValue(5);
      (redisClient.get as jest.Mock).mockResolvedValue(null);

      await scanController.getStats(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockJson).toHaveBeenCalledWith({
        totalScans: 5,
        remainingToday: 5
      });
    });

    it('should require authentication', async () => {
      mockRequest.userId = undefined;

      await scanController.getStats(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Authentication required' });
    });
  });
});
