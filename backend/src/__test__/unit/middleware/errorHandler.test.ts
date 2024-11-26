import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../../middleware/errorHandler';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockRequest = {};
    mockResponse = {
      status: mockStatus,
      json: mockJson
    };
    nextFunction = jest.fn();
  });

  it('should handle Prisma errors', () => {
    const error = new Error('Prisma error');
    (error as any).code = 'P2002'; // Unique constraint violation

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Database error: Unique constraint violation'
    });
  });

  it('should handle JWT errors', () => {
    const error = new Error('jwt expired');
    error.name = 'JsonWebTokenError';

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Invalid or expired token'
    });
  });

  it('should handle validation errors', () => {
    const error = new Error('Validation failed');
    error.name = 'ValidationError';

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Validation failed'
    });
  });

  it('should handle Redis errors', () => {
    const error = new Error('Redis connection failed');
    error.name = 'RedisError';

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Cache service error'
    });
  });

  it('should handle unknown errors', () => {
    const error = new Error('Unknown error');

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Internal server error'
    });
  });

  it('should log errors in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const error = new Error('Test error');
    
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(consoleSpy).toHaveBeenCalled();
    
    // Cleanup
    process.env.NODE_ENV = originalEnv;
    consoleSpy.mockRestore();
  });
});
