import { Request, Response, NextFunction } from 'express';
import { AppError, handleError } from '../utils/errors';
import { ApiResponse, ErrorCode } from '@brandscene/shared';
import logger from '../utils/logger';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let appError: AppError;

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    appError = handlePrismaError(error);
  } else {
    appError = handleError(error);
  }

  // Log error
  logger.error(
    appError.message,
    error,
    {
      ...logger.requestContext(req),
      errorCode: appError.code,
      statusCode: appError.statusCode,
    }
  );

  // Send error response
  const response: ApiResponse = {
    success: false,
    error: {
      code: appError.code,
      message: appError.message,
      ...(appError.details && { details: appError.details }),
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && !appError.isOperational) {
    response.error!.message = 'An unexpected error occurred';
    delete response.error!.details;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    (response.error as any).stack = error.stack;
  }

  res.status(appError.statusCode).json(response);
};

// Handle Prisma-specific errors
const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError): AppError => {
  switch (error.code) {
    case 'P2002':
      return new AppError(
        'A record with this value already exists',
        409,
        ErrorCode.RESOURCE_ALREADY_EXISTS,
        true,
        { field: error.meta?.target }
      );
    case 'P2025':
      return new AppError(
        'Record not found',
        404,
        ErrorCode.RESOURCE_NOT_FOUND,
        true
      );
    case 'P2003':
      return new AppError(
        'Foreign key constraint failed',
        400,
        ErrorCode.VALIDATION_ERROR,
        true
      );
    default:
      return new AppError(
        'Database operation failed',
        500,
        ErrorCode.DATABASE_ERROR,
        false,
        { code: error.code }
      );
  }
};

// Async error wrapper
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
