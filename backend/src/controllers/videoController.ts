import { Request, Response } from 'express';
import VideoService from '../services/VideoService';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '@brandscene/shared';
import logger from '../utils/logger';

/**
 * Search stock videos for a scene
 */
export const searchStockVideos = asyncHandler(async (req: Request, res: Response) => {
  const { sceneId } = req.params;
  const { query, count = 5 } = req.body;

  logger.info('Searching stock videos', {
    ...logger.requestContext(req),
    sceneId,
    query,
  });

  const videoClips = await VideoService.searchStockVideos(sceneId, query, count);

  const response: ApiResponse = {
    success: true,
    data: videoClips,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.json(response);
});

/**
 * Generate narration for script
 */
export const generateNarration = asyncHandler(async (req: Request, res: Response) => {
  const { scriptId } = req.params;
  const { voiceId } = req.body;

  logger.info('Generating narration', {
    ...logger.requestContext(req),
    scriptId,
    voiceId,
  });

  const audioTrack = await VideoService.generateNarration(scriptId, voiceId);

  const response: ApiResponse = {
    success: true,
    data: audioTrack,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.json(response);
});

/**
 * Generate scene-specific narration
 */
export const generateSceneNarration = asyncHandler(async (req: Request, res: Response) => {
  const { sceneId } = req.params;
  const { voiceId } = req.body;

  logger.info('Generating scene narration', {
    ...logger.requestContext(req),
    sceneId,
  });

  const audio = await VideoService.generateSceneNarration(sceneId, voiceId);

  const response: ApiResponse = {
    success: true,
    data: audio,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.json(response);
});

/**
 * Get music suggestions
 */
export const suggestMusic = asyncHandler(async (req: Request, res: Response) => {
  const { scriptId } = req.params;

  logger.info('Getting music suggestions', {
    ...logger.requestContext(req),
    scriptId,
  });

  const suggestions = await VideoService.suggestBackgroundMusic(scriptId);

  const response: ApiResponse = {
    success: true,
    data: suggestions,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.json(response);
});

/**
 * Select video clip
 */
export const selectVideoClip = asyncHandler(async (req: Request, res: Response) => {
  const { clipId } = req.params;

  logger.info('Selecting video clip', {
    ...logger.requestContext(req),
    clipId,
  });

  const clip = await VideoService.selectVideoClip(clipId);

  const response: ApiResponse = {
    success: true,
    data: clip,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.json(response);
});

/**
 * Get video assets for script
 */
export const getVideoAssets = asyncHandler(async (req: Request, res: Response) => {
  const { scriptId } = req.params;

  const assets = await VideoService.getVideoAssetsByScript(scriptId);

  const response: ApiResponse = {
    success: true,
    data: assets,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.json(response);
});
