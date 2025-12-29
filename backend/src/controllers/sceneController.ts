import { Request, Response } from 'express';
import SceneService from '../services/SceneService';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types/shared';
import logger from '../utils/logger';

/**
 * Generate scenes from an approved script
 */
export const generateScenes = asyncHandler(async (req: Request, res: Response) => {
  const { scriptId } = req.params;

  logger.info('Generating scenes', {
    ...logger.requestContext(req),
    scriptId,
  });

  const scenes = await SceneService.generateScenes(scriptId);

  const response: ApiResponse = {
    success: true,
    data: scenes,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.json(response);
});

/**
 * Get all scenes for a script
 */
export const getScenes = asyncHandler(async (req: Request, res: Response) => {
  const { scriptId } = req.params;

  const scenes = await SceneService.getScenesByScript(scriptId);

  const response: ApiResponse = {
    success: true,
    data: scenes,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.json(response);
});

/**
 * Generate image variations for a scene
 */
export const generateImageVariations = asyncHandler(async (req: Request, res: Response) => {
  const { sceneId } = req.params;
  const { count = 3 } = req.body;

  logger.info('Generating image variations', {
    ...logger.requestContext(req),
    sceneId,
    count,
  });

  const variations = await SceneService.generateImageVariations(sceneId, count);

  const response: ApiResponse = {
    success: true,
    data: variations,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.json(response);
});

/**
 * Select an image variation
 */
export const selectImageVariation = asyncHandler(async (req: Request, res: Response) => {
  const { variationId } = req.params;

  logger.info('Selecting image variation', {
    ...logger.requestContext(req),
    variationId,
  });

  const selected = await SceneService.selectImageVariation(variationId);

  const response: ApiResponse = {
    success: true,
    data: selected,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.json(response);
});
