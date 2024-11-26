import request from 'supertest';
import { app } from '../../../index';
import { prisma } from '../../../lib/prisma';
import { redisClient } from '../../../lib/redis';
import jwt from 'jsonwebtoken';

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

describe('Scans API', () => {
  let authToken: string;

  beforeEach(() => {
    jest.clearAllMocks();
    // Create a test token
    authToken = jwt.sign({ userId: 1 }, process.env.JWT_SECRET || 'secret');
  });

  describe('POST /api/scans', () => {
    it('should create a new scan', async () => {
      const mockScan = {
        id: 1,
        content: 'https://example.com',
        type: 'URL',
        user_id: 1,
        created_at: new Date()
      };

      // Mock Redis rate limit check
      (redisClient.get as jest.Mock).mockResolvedValue('3');
      // Mock scan creation
      (prisma.scan.create as jest.Mock).mockResolvedValue(mockScan);

      const response = await request(app)
        .post('/api/scans')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'https://example.com',
          type: 'URL'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('content', 'https://example.com');
    });

    it('should return error when rate limit exceeded', async () => {
      // Mock Redis rate limit exceeded
      (redisClient.get as jest.Mock).mockResolvedValue('5');
      (redisClient.ttl as jest.Mock).mockResolvedValue(3600);

      const response = await request(app)
        .post('/api/scans')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'https://example.com',
          type: 'URL'
        });

      expect(response.status).toBe(429);
      expect(response.body).toHaveProperty('error', 'Rate limit exceeded');
    });
  });

  describe('GET /api/scans/history', () => {
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

      const response = await request(app)
        .get('/api/scans/history')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/scans/stats', () => {
    it('should return scan statistics', async () => {
      (prisma.scan.count as jest.Mock).mockResolvedValue(10);
      (redisClient.get as jest.Mock).mockResolvedValue('3');

      const response = await request(app)
        .get('/api/scans/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalScans', 10);
      expect(response.body).toHaveProperty('remainingToday', 2);
    });
  });

  it('should require authentication', async () => {
    const response = await request(app)
      .get('/api/scans/history');

    expect(response.status).toBe(401);
  });
});
