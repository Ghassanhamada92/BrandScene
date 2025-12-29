import { Router } from 'express';
import {
  generateTransitions,
  calculateTimeline,
  startRendering,
  getRenderingStatus,
  getRenderPresets,
} from '../controllers/stitchingController';
import { validate } from '../middleware/validator';
import { z } from 'zod';

const uuidSchema = z.string().uuid();

const router = Router();

// Transitions
router.post('/scripts/:scriptId/transitions', validate(uuidSchema, 'params'), generateTransitions);

// Timeline
router.get('/scripts/:scriptId/timeline', validate(uuidSchema, 'params'), calculateTimeline);

// Rendering
router.post('/scripts/:scriptId/render', validate(uuidSchema, 'params'), startRendering);
router.get('/scripts/:scriptId/render/status', validate(uuidSchema, 'params'), getRenderingStatus);
router.get('/presets', getRenderPresets);

export default router;
