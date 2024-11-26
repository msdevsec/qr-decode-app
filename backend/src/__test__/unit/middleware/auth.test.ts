import { Request, Response, NextFunction } from 'express';
import { auth } from '../../../middleware/auth';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      headers: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('should pass with valid token', () => {
    const mockToken = 'valid.jwt.token';
    const mockDecodedToken = { userId: 1 };
    mockRequest.headers = {
      authorization: `Bearer ${mockToken}`
    };

    (jwt.verify as jest.Mock).mockReturnValue(mockDecodedToken);

    auth(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.userId).toBe(mockDecodedToken.userId);
  });

  it('should fail without authorization header', () => {
    auth(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Authentication required'
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should fail with invalid token format', () => {
    mockRequest.headers = {
      authorization: 'InvalidFormat'
    };

    auth(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Invalid token format'
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should fail with invalid token', () => {
    mockRequest.headers = {
      authorization: 'Bearer invalid.token'
    };

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    auth(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Invalid token'
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
