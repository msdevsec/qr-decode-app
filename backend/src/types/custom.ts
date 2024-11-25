import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  userId?: number;  // Make userId optional
}
