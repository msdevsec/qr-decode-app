import request from 'supertest';
import { app } from '../../../index';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  compare: jest.fn().mockResolvedValue(true)
}));

// Mock Prisma
jest.mock('../../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn()
    }
  }
}));

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully with valid credentials', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password_hash: 'hashedpassword',
      name: 'Test User',
      created_at: new Date()
    };

    // Mock user exists
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('email', 'test@example.com');
  });

  it('should return error for non-existent user', async () => {
    // Mock user not found
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid credentials');
  });

  it('should return error for invalid password', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password_hash: 'hashedpassword',
      name: 'Test User',
      created_at: new Date()
    };

    // Mock user exists
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    // Mock password comparison fails
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid credentials');
  });

  it('should validate required fields', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Email and password are required');
  });
});
