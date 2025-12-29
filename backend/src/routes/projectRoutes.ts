import { Router } from 'express';
import {
  createProject,
  getProject,
  getProjects,
  createCampaign,
  updateCampaign,
  getCampaign,
  conductResearch,
  generateScripts,
  approveScript,
} from '../controllers/projectController';

const router = Router();

// Project routes
router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProject);

// Campaign routes
router.post('/:projectId/campaigns', createCampaign);
router.get('/campaigns/:campaignId', getCampaign);
router.put('/campaigns/:campaignId', updateCampaign);

// Research routes
router.post('/campaigns/:campaignId/research', conductResearch);

// Script generation routes
router.post('/campaigns/:campaignId/scripts', generateScripts);
router.put('/scripts/:scriptId/approve', approveScript);

export default router;
