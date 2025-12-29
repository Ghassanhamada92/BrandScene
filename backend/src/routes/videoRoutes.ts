import { Router } from 'express';
import {
  searchStockVideos,
  generateNarration,
  generateSceneNarration,
  suggestMusic,
  selectVideoClip,
  getVideoAssets,
} from '../controllers/videoController';
import { validate } from '../middleware/validator';
import { z } from 'zod';

const uuidSchema = z.string().uuid();

const router = Router();

// Stock video search
router.post('/scenes/:sceneId/videos/search', validate(uuidSchema, 'params'), searchStockVideos);
router.put('/videos/:clipId/select', validate(uuidSchema, 'params'), selectVideoClip);

// Narration generation
router.post('/scripts/:scriptId/narration', validate(uuidSchema, 'params'), generateNarration);
router.post('/scenes/:sceneId/narration', validate(uuidSchema, 'params'), generateSceneNarration);

// Music
router.get('/scripts/:scriptId/music/suggest', validate(uuidSchema, 'params'), suggestMusic);

// Assets
router.get('/scripts/:scriptId/assets', validate(uuidSchema, 'params'), getVideoAssets);

export default router;
