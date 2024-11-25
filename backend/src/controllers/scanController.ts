import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { redisClient } from '../lib/redis';
import { AuthenticatedRequest } from '../types/custom';

export const scanController = {
  // Create scan
  createScan: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      const { content, type } = req.body;

      // Check rate limit
      const scanCount = await redisClient.get(`scan_count:${userId}`);
      if (scanCount && parseInt(scanCount) >= 5) {
        res.status(429).json({ error: 'Rate limit exceeded' });
        return;
      }

      // Create scan
      const scan = await prisma.scan.create({
        data: {
          content,
          type,
          user: { connect: { id: userId } }
        }
      });

      // Update rate limit
      await redisClient.incr(`scan_count:${userId}`);
      await redisClient.expire(`scan_count:${userId}`, 43200);

      res.status(201).json(scan);
    } catch (error) {
      console.error('Create scan error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Get scan history
  getScanHistory: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;

      const scans = await prisma.scan.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' }
      });

      res.json(scans);
    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Get scan statistics
  getStats: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      
      const totalScans = await prisma.scan.count({
        where: { user_id: userId }
      });

      const scanCount = await redisClient.get(`scan_count:${userId}`);
      const remainingScans = 5 - (scanCount ? parseInt(scanCount) : 0);

      res.json({
        totalScans,
        remainingToday: remainingScans
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
};
