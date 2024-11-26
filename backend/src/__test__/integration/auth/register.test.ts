import request from 'supertest';
import { app } from '../../../index';
import { prisma } from '../../../lib/prisma';

// Mock Prisma
jest.mock('../../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn()
    }
  }
}));

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  it('should register a new user', async () => {
    // Mock user not existing
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    // Mock user creation
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password_hash: 'hashedpassword',
      created_at: new Date()
    });

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('email', 'test@example.com');
  });

  it('should return error for existing email', async () => {
    // Mock user already exists
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@example.com'
    });

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Email already registered');
  });

  it('should validate required fields', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
