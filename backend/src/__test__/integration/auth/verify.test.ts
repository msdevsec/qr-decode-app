import request from 'supertest';
import { app } from '../../../index';
import { prisma } from '../../../lib/prisma';
import jwt from 'jsonwebtoken';

// Mock Prisma
jest.mock('../../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn()
    }
  }
}));

describe('GET /api/auth/verify', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should verify valid token successfully', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      created_at: new Date()
    };

    // Create a valid token
    const token = jwt.sign(
      { userId: mockUser.id },
      process.env.JWT_SECRET || 'qrdecode-super-secret-key-2024',
      { expiresIn: '24h' }
    );

    // Mock user exists
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ valid: true });
  });

  it('should reject expired token', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      created_at: new Date()
    };

    // Create an expired token
    const token = jwt.sign(
      { userId: mockUser.id },
      process.env.JWT_SECRET || 'qrdecode-super-secret-key-2024',
      { expiresIn: '0s' }
    );

    const response = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Token expired');
  });

  it('should reject invalid token format', async () => {
    const response = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', 'InvalidToken');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid token format');
  });

  it('should reject missing token', async () => {
    const response = await request(app)
      .get('/api/auth/verify');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Authentication required');
  });

  it('should reject token for non-existent user', async () => {
    // Create a token for a non-existent user
    const token = jwt.sign(
      { userId: 999 },
      process.env.JWT_SECRET || 'qrdecode-super-secret-key-2024',
      { expiresIn: '24h' }
    );

    // Mock user not found
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  it('should reject token with invalid signature', async () => {
    // Create a token with different secret
    const token = jwt.sign(
      { userId: 1 },
      'different-secret',
      { expiresIn: '24h' }
    );

    const response = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid token');
  });
});
