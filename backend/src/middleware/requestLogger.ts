import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log request
  logger.info('Incoming request', {
    ...logger.requestContext(req),
    body: req.body,
    query: req.query,
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      ...logger.requestContext(req),
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};
