import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { 
  BadRequestError, 
  UnauthorizedError,
  asyncHandler 
} from '../utils/errors';

interface RegisterRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

class AuthController {
  register = asyncHandler(async (req: RegisterRequest, res: Response) => {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new BadRequestError('Email already registered');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash: hashedPassword
      }
    });

    // Create token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    // Return user and token
    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  });

  login = asyncHandler(async (req: LoginRequest, res: Response) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Create token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    // Return user and token
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  });

  verify = asyncHandler(async (req: Request, res: Response) => {
    // If we get here, the token is valid (checked by auth middleware)
    res.json({ valid: true });
  });
}

export const authController = new AuthController();
