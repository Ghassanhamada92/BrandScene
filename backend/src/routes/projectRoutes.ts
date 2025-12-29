import { Router } from 'express';
import {
  createProject,
  getProject,
  getProjects,
  updateBrandInfo,
  conductResearch,
  generateScripts,
  approveScript,
} from '../controllers/projectController';

const router = Router();

// Project routes
router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProject);

// Brand info routes
router.put('/:projectId/brand-info', updateBrandInfo);

// Research routes
router.post('/:projectId/research', conductResearch);

// Script generation routes
router.post('/:projectId/scripts', generateScripts);
router.put('/scripts/:scriptId/approve', approveScript);

export default router;
