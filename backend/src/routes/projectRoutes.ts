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
import { z } from 'zod';

const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
});

const createCampaignSchema = z.object({
  brandName: z.string().min(1).max(255),
  productName: z.string().min(1).max(255),
  productDescription: z.string().min(10),
  targetAudience: z.string().min(10),
  keyBenefits: z.array(z.string()).optional(),
  brandVoice: z.string().max(100).optional(),
  tone: z.string().max(100).optional(),
  additionalContext: z.string().optional(),
  videoLength: z.number().int().min(10).max(180).default(30),
  videoStyle: z.string().max(100).optional(),
});

const updateCampaignSchema = createCampaignSchema.partial();

const generateScriptsSchema = z.object({
  variantCount: z.number().int().min(1).max(5).default(3),
});

const uuidSchema = z.string().uuid();

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
