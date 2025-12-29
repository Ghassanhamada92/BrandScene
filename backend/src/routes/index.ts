import { Router } from 'express';
import projectRoutes from './projectRoutes';
import sceneRoutes from './sceneRoutes';
import videoRoutes from './videoRoutes';
import stitchingRoutes from './stitchingRoutes';

const router = Router();

router.use('/projects', projectRoutes);
router.use('/scenes', sceneRoutes);
router.use('/videos', videoRoutes);
router.use('/stitching', stitchingRoutes);

// Health check for API
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
