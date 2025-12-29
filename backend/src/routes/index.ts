import { Router } from 'express';
import projectRoutes from './projectRoutes';
import sceneRoutes from './sceneRoutes';
import videoRoutes from './videoRoutes';

const router = Router();

router.use('/projects', projectRoutes);
router.use('/scenes', sceneRoutes);
router.use('/videos', videoRoutes);

// Health check for API
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
