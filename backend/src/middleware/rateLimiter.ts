import rateLimit from 'express-rate-limit';
import { RATE_LIMITS, HTTP_STATUS } from '../utils/constants';
import logger from '../utils/logger';
import { ApiResponse } from '../types/shared';

/**
 * Rate limiting middleware
 */

export const generalLimiter = rateLimit({
  windowMs: RATE_LIMITS.WINDOW_MS,
  max: RATE_LIMITS.MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });

    const response: ApiResponse = {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later.',
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.requestId,
      },
    };

    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json(response);
  },
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: RATE_LIMITS.AI_REQUESTS_PER_MINUTE,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    logger.warn('AI rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });

    const response: ApiResponse = {
      success: false,
      error: {
        code: 'AI_RATE_LIMIT',
        message: 'Too many AI requests, please slow down.',
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.requestId,
      },
    };

    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json(response);
  },
});
