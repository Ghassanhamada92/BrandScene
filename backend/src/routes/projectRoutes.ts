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
import { validate } from '../middleware/validator';
import {
  createProjectSchema,
  createCampaignSchema,
  updateCampaignSchema,
  generateScriptsSchema,
  uuidSchema,
} from '@brandscene/shared';

const router = Router();

// Project routes
router.post('/', validate(createProjectSchema), createProject);
router.get('/', getProjects);
router.get('/:id', validate(uuidSchema, 'params'), getProject);

// Campaign routes
router.post('/:projectId/campaigns', validate(createCampaignSchema), createCampaign);
router.get('/campaigns/:campaignId', validate(uuidSchema, 'params'), getCampaign);
router.put('/campaigns/:campaignId', validate(updateCampaignSchema), updateCampaign);

// Research routes
router.post('/campaigns/:campaignId/research', validate(uuidSchema, 'params'), conductResearch);

// Script generation routes
router.post('/campaigns/:campaignId/scripts', validate(generateScriptsSchema), generateScripts);
router.put('/scripts/:scriptId/approve', validate(uuidSchema, 'params'), approveScript);

export default router;
