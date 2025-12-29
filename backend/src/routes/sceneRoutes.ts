import { Router } from 'express';
import {
  generateScenes,
  getScenes,
  generateImageVariations,
  selectImageVariation,
} from '../controllers/sceneController';
import { validate } from '../middleware/validator';
import { uuidSchema } from '@brandscene/shared';

const router = Router();

// Scene generation
router.post('/scripts/:scriptId/scenes', validate(uuidSchema, 'params'), generateScenes);
router.get('/scripts/:scriptId/scenes', validate(uuidSchema, 'params'), getScenes);

// Image variations
router.post('/scenes/:sceneId/images', validate(uuidSchema, 'params'), generateImageVariations);
router.put('/images/:variationId/select', validate(uuidSchema, 'params'), selectImageVariation);

export default router;
