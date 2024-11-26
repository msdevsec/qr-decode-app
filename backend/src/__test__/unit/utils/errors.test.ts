import {
  ValidationError,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  DatabaseError,
  formatError,
  isCustomError
} from '../../../utils/errors';

describe('Error Utils', () => {
  describe('Custom Error Classes', () => {
    it('should create ValidationError', () => {
      const error = new ValidationError('Invalid input');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe('Invalid input');
      expect(error.status).toBe(400);
    });

    it('should create AuthenticationError', () => {
      const error = new AuthenticationError('Invalid token');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.message).toBe('Invalid token');
      expect(error.status).toBe(401);
    });

    it('should create NotFoundError', () => {
      const error = new NotFoundError('User not found');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe('User not found');
      expect(error.status).toBe(404);
    });

    it('should create RateLimitError', () => {
      const error = new RateLimitError('Too many requests');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(RateLimitError);
      expect(error.message).toBe('Too many requests');
      expect(error.status).toBe(429);
    });

    it('should create DatabaseError', () => {
      const error = new DatabaseError('Database connection failed');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(DatabaseError);
      expect(error.message).toBe('Database connection failed');
      expect(error.status).toBe(500);
    });
  });

  describe('Error Utilities', () => {
    it('should identify custom errors', () => {
      const customError = new ValidationError('Invalid input');
      const standardError = new Error('Standard error');

      expect(isCustomError(customError)).toBe(true);
      expect(isCustomError(standardError)).toBe(false);
    });

    it('should format custom errors', () => {
      const error = new ValidationError('Invalid input');
      const formatted = formatError(error);

      expect(formatted).toEqual({
        error: 'Invalid input',
        status: 400
      });
    });

    it('should format standard errors', () => {
      const error = new Error('Unknown error');
      const formatted = formatError(error);

      expect(formatted).toEqual({
        error: 'Internal server error',
        status: 500
      });
    });

    it('should format errors with additional data', () => {
      const error = new RateLimitError('Too many requests');
      (error as any).resetTime = 3600;
      const formatted = formatError(error);

      expect(formatted).toEqual({
        error: 'Too many requests',
        status: 429,
        resetTime: 3600
      });
    });

    it('should handle null or undefined errors', () => {
      expect(formatError(null)).toEqual({
        error: 'Internal server error',
        status: 500
      });

      expect(formatError(undefined)).toEqual({
        error: 'Internal server error',
        status: 500
      });
    });
  });
});
