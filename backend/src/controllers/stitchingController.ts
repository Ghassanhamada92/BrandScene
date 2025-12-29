import { Request, Response } from 'express';
import StitchingService from '../services/StitchingService';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types/shared';
import logger from '../utils/logger';

/**
 * Generate transitions for a script
 */
export const generateTransitions = asyncHandler(async (req: Request, res: Response) => {
  const { scriptId } = req.params;

  logger.info('Generating transitions', {
    ...logger.requestContext(req),
    scriptId,
  });

  const transitions = await StitchingService.generateTransitions(scriptId);

  const response: ApiResponse = {
    success: true,
    data: transitions,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.json(response);
});

/**
 * Calculate video timeline
 */
export const calculateTimeline = asyncHandler(async (req: Request, res: Response) => {
  const { scriptId } = req.params;

  const timeline = await StitchingService.calculateTimeline(scriptId);

  const response: ApiResponse = {
    success: true,
    data: timeline,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.json(response);
});

/**
 * Start video rendering
 */
export const startRendering = asyncHandler(async (req: Request, res: Response) => {
  const { scriptId } = req.params;
  const settings = req.body;

  logger.info('Starting video rendering', {
    ...logger.requestContext(req),
    scriptId,
    settings,
  });

  const video = await StitchingService.startRendering(scriptId, settings);

  const response: ApiResponse = {
    success: true,
    data: video,
    message: 'Video rendering started successfully',
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.json(response);
});

/**
 * Get rendering status
 */
export const getRenderingStatus = asyncHandler(async (req: Request, res: Response) => {
  const { scriptId } = req.params;

  const status = await StitchingService.getRenderingStatus(scriptId);

  const response: ApiResponse = {
    success: true,
    data: status,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.json(response);
});

/**
 * Get render presets
 */
export const getRenderPresets = asyncHandler(async (req: Request, res: Response) => {
  const presets = StitchingService.getRenderPresets();

  const response: ApiResponse = {
    success: true,
    data: presets,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.json(response);
});
