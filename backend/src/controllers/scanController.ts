import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { redisClient } from '../lib/redis';
import { 
  BadRequestError, 
  UnauthorizedError, 
  ValidationError,
  asyncHandler,
  AuthenticatedRequest
} from '../utils/errors';
import { getRateLimitKey, rateLimitConfig } from '../utils/rateLimit';

// Request body types
interface CreateScanBody {
  content: string;
  type: string;
}

const VALID_SCAN_TYPES = ['URL', 'TEXT', 'EMAIL', 'PHONE', 'WIFI', 'VCARD'] as const;
type ScanType = typeof VALID_SCAN_TYPES[number];

// Helper function to ensure request is authenticated
const ensureAuthenticated = (req: AuthenticatedRequest): number => {
  if (!req.userId) {
    throw new UnauthorizedError('Authentication required');
  }
  return req.userId;
};

export const scanController = {
  // Create new scan
  createScan: asyncHandler(async (req: Request, res: Response) => {
    const userId = ensureAuthenticated(req as AuthenticatedRequest);
    const { content, type } = req.body as CreateScanBody;

    // Validate input
    if (!content || !type) {
      throw new ValidationError('Content and type are required');
    }

    // Validate scan type
    if (!VALID_SCAN_TYPES.includes(type.toUpperCase() as ScanType)) {
      throw new ValidationError('Invalid scan type', {
        validTypes: VALID_SCAN_TYPES
      });
    }

    // Create scan
    const scan = await prisma.scan.create({
      data: {
        content,
        type: type.toUpperCase(),
        user_id: userId
      }
    });

    res.status(201).json(scan);
  }),

  // Get scan history
  getScanHistory: asyncHandler(async (req: Request, res: Response) => {
    const userId = ensureAuthenticated(req as AuthenticatedRequest);

    // Get pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get scans with pagination
    const [scans, total] = await Promise.all([
      prisma.scan.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          content: true,
          type: true,
          created_at: true
        }
      }),
      prisma.scan.count({
        where: { user_id: userId }
      })
    ]);

    res.json({
      scans,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  }),

  // Get scan statistics
  getStats: asyncHandler(async (req: Request, res: Response) => {
    const userId = ensureAuthenticated(req as AuthenticatedRequest);

    // Get statistics
    const [totalScans, scansByType, currentScans, ttl] = await Promise.all([
      // Get total scans
      prisma.scan.count({
        where: { user_id: userId }
      }),
      // Get scans grouped by type
      prisma.$queryRaw<Array<{ type: string; count: number }>>`
        SELECT type, COUNT(*) as count
        FROM "Scan"
        WHERE user_id = ${userId}
        GROUP BY type
      `,
      // Get current period scans
      redisClient.get(getRateLimitKey(userId)),
      // Get TTL for rate limit key
      redisClient.ttl(getRateLimitKey(userId))
    ]);

    // Calculate remaining scans
    const scansToday = currentScans ? parseInt(currentScans) : 0;
    const remaining = Math.max(0, rateLimitConfig.RATE_LIMIT - scansToday);

    // Format scan types
    const scanTypes = scansByType.reduce((acc, curr) => ({
      ...acc,
      [curr.type]: Number(curr.count)
    }), {} as Record<string, number>);

    res.json({
      totalScans,
      scanTypes,
      remainingToday: remaining,
      rateLimit: rateLimitConfig.RATE_LIMIT,
      resetTime: ttl > 0 ? ttl : rateLimitConfig.WINDOW
    });
  })
};
