import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middlewares/validate.js';

const router = Router();

// GET /api/health
router.get('/', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'lms-api',
  });
});

// POST /api/health/validate-test (for testing validation middleware rejection)
const echoSchema = {
  body: z.object({
    message: z.string().min(1, 'Message cannot be empty'),
    count: z.number().int().positive('Count must be a positive integer'),
  }).strict(),
};

router.post('/validate-test', validate(echoSchema), (req, res) => {
  res.status(200).json({
    received: req.body,
  });
});

export default router;
