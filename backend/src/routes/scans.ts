import { Router, RequestHandler } from 'express';
import { scanController } from '../controllers/scanController';
import { auth } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';

const router = Router();

// Protected routes (require authentication)
router.use(auth as RequestHandler);

/**
 * @swagger
 * /api/scans:
 *   post:
 *     tags:
 *       - Scans
 *     summary: Create a new scan
 *     description: Create a new QR code scan. Rate limited to 5 scans per 24 hours.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - type
 *             properties:
 *               content:
 *                 type: string
 *                 example: https://example.com
 *               type:
 *                 type: string
 *                 example: URL
 *     responses:
 *       201:
 *         description: Scan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Scan'
 *       429:
 *         description: Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 resetTime:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 remaining:
 *                   type: integer
 */
router.post('/', 
  (rateLimit as unknown as RequestHandler),
  (scanController.createScan as unknown as RequestHandler)
);

/**
 * @swagger
 * /api/scans/history:
 *   get:
 *     tags:
 *       - Scans
 *     summary: Get scan history
 *     description: Retrieve user's scan history
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of scans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Scan'
 */
router.get('/history', 
  (scanController.getScanHistory as unknown as RequestHandler)
);

/**
 * @swagger
 * /api/scans/stats:
 *   get:
 *     tags:
 *       - Scans
 *     summary: Get scan statistics
 *     description: Get user's scan statistics and rate limit info
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Scan statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalScans:
 *                   type: integer
 *                 remainingToday:
 *                   type: integer
 */
router.get('/stats', 
  (scanController.getStats as unknown as RequestHandler)
);

export default router;
