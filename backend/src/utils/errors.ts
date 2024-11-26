import { Request, Response, NextFunction } from 'express';

// Custom error class with status code
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// HTTP error classes
export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request', details?: any) {
    super(message, 400, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', details?: any) {
    super(message, 401, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden', details?: any) {
    super(message, 403, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Not found', details?: any) {
    super(message, 404, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict', details?: any) {
    super(message, 409, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', details?: any) {
    super(message, 429, details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details?: any) {
    super(message, 400, details);
  }
}

// Database error handler
export class DatabaseError extends AppError {
  constructor(message: string = 'Database error', details?: any) {
    super(message, 500, details);
  }
}

// Cache error handler
export class CacheError extends AppError {
  constructor(message: string = 'Cache error', details?: any) {
    super(message, 500, details);
  }
}

// Authentication error handler
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', details?: any) {
    super(message, 401, details);
  }
}

// Helper function to determine if an error is a known AppError
export const isAppError = (error: any): error is AppError => {
  return error instanceof AppError;
};

// Helper function to create error from unknown error
export const createError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  return new AppError('An unknown error occurred');
};

// Request handler types
export interface AuthenticatedRequest extends Request {
  userId?: number;
}

export type AsyncRequestHandler<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> = (
  req: AuthenticatedRequest & Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next: NextFunction
) => Promise<any>;

// Helper function to handle async errors in routes
export const asyncHandler = <P = any, ResBody = any, ReqBody = any, ReqQuery = any>(
  fn: AsyncRequestHandler<P, ResBody, ReqBody, ReqQuery>
) => {
  return (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction
  ) => {
    Promise.resolve(fn(req as AuthenticatedRequest & typeof req, res, next)).catch(next);
  };
};

// Helper function to create validation error
export const createValidationError = (errors: Record<string, string[]>) => {
  return new ValidationError('Validation failed', errors);
};

// Helper function to create rate limit error
export const createRateLimitError = (resetTime: number, limit: number) => {
  return new RateLimitError('Rate limit exceeded', {
    resetTime,
    limit,
    message: `Too many requests. Try again in ${Math.ceil(resetTime / 60)} minutes.`
  });
};
