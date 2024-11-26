import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import {
  AppError,
  isAppError,
  createError,
  ValidationError,
  DatabaseError,
  AuthenticationError,
  CacheError
} from '../utils/errors';

// Prisma error codes and messages
const prismaErrorMap = {
  P2002: { message: 'Unique constraint violation', status: 400 },
  P2014: { message: 'Invalid ID or reference', status: 400 },
  P2003: { message: 'Foreign key constraint failed', status: 400 },
  P2025: { message: 'Record not found', status: 404 },
  P2021: { message: 'Table does not exist', status: 500 },
  P2022: { message: 'Column does not exist', status: 500 }
};

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Convert unknown errors to AppError
  const error = isAppError(err) ? err : createError(err);

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      details: error.details
    });
  }

  // Handle specific error types
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = prismaErrorMap[err.code as keyof typeof prismaErrorMap];
    const dbError = new DatabaseError(
      prismaError?.message || 'Database error',
      {
        code: err.code,
        meta: err.meta
      }
    );
    sendErrorResponse(res, dbError);
    return;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    const validationError = new ValidationError(
      'Invalid data provided',
      { details: err.message }
    );
    sendErrorResponse(res, validationError);
    return;
  }

  if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
    const authError = new AuthenticationError(
      err instanceof TokenExpiredError ? 'Token expired' : 'Invalid token'
    );
    sendErrorResponse(res, authError);
    return;
  }

  // Handle Redis errors
  if (err.name?.includes('Redis') || err.message?.includes('Redis')) {
    const cacheError = new CacheError(
      'Cache service error',
      { details: err.message }
    );
    sendErrorResponse(res, cacheError);
    return;
  }

  // Send default error response
  sendErrorResponse(res, error);
};

// Helper function to send error response
const sendErrorResponse = (res: Response, error: AppError): void => {
  const response = {
    error: error.name,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && {
      details: error.details,
      stack: error.stack
    })
  };

  res.status(error.statusCode).json(response);
};
