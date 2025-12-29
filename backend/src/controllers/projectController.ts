import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import AIService from '../services/AIService';
import { NotFoundError, ValidationError } from '../utils/errors';
import { asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { ApiResponse } from '../types/shared';
// Type definitions
type Project = {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  status: string;
  currentStage: number;
  createdAt: Date;
  updatedAt: Date;
};

type Campaign = {
  id: string;
  projectId: string;
  brandName: string;
  productName: string;
  productDescription: string;
  targetAudience: string;
  keyBenefits: any;
  brandVoice: string | null;
  tone: string | null;
  additionalContext: string | null;
  videoLength: number;
  videoStyle: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type ResearchData = {
  id: string;
  campaignId: string;
  researchType: string;
  query: string;
  results: any;
  sources: any;
  confidenceScore: number | null;
  createdAt: Date;
};

interface CreateProjectDto {
  name: string;
  description?: string;
}

interface CreateCampaignDto {
  brandName: string;
  productName: string;
  productDescription: string;
  targetAudience: string;
  keyBenefits?: string[];
  brandVoice?: string;
  tone?: string;
  additionalContext?: string;
  videoLength?: number;
  videoStyle?: string;
}

interface UpdateCampaignDto extends Partial<CreateCampaignDto> {}

interface GenerateScriptsDto {
  variantCount?: number;
}

type Script = {
  id: string;
  campaignId: string;
  variantNumber: number;
  title: string;
  content: string;
  durationSeconds: number | null;
  tone: string | null;
  style: string | null;
  metadata: any;
  status: string;
  approved: boolean;
  approvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Create a new project
 */
export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body as CreateProjectDto;
  const userId = req.user?.id || 'demo-user-id';

  logger.info('Creating project', {
    ...logger.requestContext(req),
    projectName: name,
  });

  const project = await prisma.project.create({
    data: {
      userId,
      name,
      description,
      status: 'draft',
      currentStage: 1,
    },
  });

  const response: ApiResponse<Project> = {
    success: true,
    data: project as Project,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.status(201).json(response);
});

/**
 * Get a specific project with all related data
 */
export const getProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      campaigns: {
        include: {
          researchData: true,
          scripts: {
            include: {
              scenes: true,
            },
            orderBy: { variantNumber: 'asc' },
          },
        },
      },
    },
  });

  if (!project) {
    throw new NotFoundError('Project', id);
  }

  const response: ApiResponse = {
    success: true,
    data: project,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.json(response);
});

/**
 * Get all projects for the current user
 */
export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id || 'demo-user-id';

  const projects = await prisma.project.findMany({
    where: { userId },
    include: {
      campaigns: {
        select: {
          id: true,
          brandName: true,
          productName: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const response: ApiResponse<Project[]> = {
    success: true,
    data: projects as Project[],
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.json(response);
});

/**
 * Create a new campaign
 */
export const createCampaign = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const campaignData = req.body as CreateCampaignDto;

  logger.info('Creating campaign', {
    ...logger.requestContext(req),
    projectId,
    brandName: campaignData.brandName,
  });

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new NotFoundError('Project', projectId);
  }

  const campaign = await prisma.campaign.create({
    data: {
      projectId,
      ...campaignData,
    },
  });

  const response: ApiResponse<Campaign> = {
    success: true,
    data: campaign as Campaign,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.status(201).json(response);
});

/**
 * Update an existing campaign
 */
export const updateCampaign = asyncHandler(async (req: Request, res: Response) => {
  const { campaignId } = req.params;
  const campaignData = req.body as UpdateCampaignDto;

  logger.info('Updating campaign', {
    ...logger.requestContext(req),
    campaignId,
  });

  const campaign = await prisma.campaign.update({
    where: { id: campaignId },
    data: campaignData,
  });

  const response: ApiResponse<Campaign> = {
    success: true,
    data: campaign as Campaign,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.json(response);
});

/**
 * Get a specific campaign
 */
export const getCampaign = asyncHandler(async (req: Request, res: Response) => {
  const { campaignId } = req.params;

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      researchData: {
        orderBy: { createdAt: 'desc' },
      },
      scripts: {
        include: {
          scenes: true,
        },
        orderBy: { variantNumber: 'asc' },
      },
    },
  });

  if (!campaign) {
    throw new NotFoundError('Campaign', campaignId);
  }

  const response: ApiResponse<Campaign> = {
    success: true,
    data: campaign as any,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.json(response);
});

/**
 * Conduct AI-powered research for a campaign
 */
export const conductResearch = asyncHandler(async (req: Request, res: Response) => {
  const { campaignId } = req.params;

  logger.info('Conducting research', {
    ...logger.requestContext(req),
    campaignId,
  });

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
  });

  if (!campaign) {
    throw new NotFoundError('Campaign', campaignId);
  }

  // Conduct research using AI
  const researchResult = await AIService.conductResearch({
    brand: campaign.brandName,
    product: campaign.productName,
    audience: campaign.targetAudience,
    context: campaign.additionalContext || campaign.productDescription,
  });

  // Save research data
  const researchData = await prisma.researchData.create({
    data: {
      campaignId,
      researchType: 'comprehensive',
      query: `Research for ${campaign.brandName} - ${campaign.productName}`,
      results: researchResult as any,
      sources: researchResult.sources as any,
      confidenceScore: researchResult.confidenceScore,
    },
  });

  logger.info('Research completed', {
    ...logger.requestContext(req),
    campaignId,
    researchId: researchData.id,
    confidenceScore: researchData.confidenceScore,
  });

  const response: ApiResponse<ResearchData> = {
    success: true,
    data: researchData as ResearchData,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.json(response);
});

/**
 * Generate script variants for a campaign
 */
export const generateScripts = asyncHandler(async (req: Request, res: Response) => {
  const { campaignId } = req.params;
  const { variantCount = 3 } = req.body as GenerateScriptsDto;

  if (variantCount < 1 || variantCount > 5) {
    throw new ValidationError('Variant count must be between 1 and 5');
  }

  logger.info('Generating scripts', {
    ...logger.requestContext(req),
    campaignId,
    variantCount,
  });

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      researchData: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!campaign) {
    throw new NotFoundError('Campaign', campaignId);
  }

  const latestResearch = campaign.researchData[0];

  // Generate script variants
  const scriptVariants = await AIService.generateScriptVariants(
    {
      brandName: campaign.brandName,
      productName: campaign.productName,
      productDescription: campaign.productDescription,
      targetAudience: campaign.targetAudience,
      keyBenefits: (campaign.keyBenefits as string[]) || [],
      brandVoice: campaign.brandVoice || undefined,
      tone: campaign.tone || undefined,
      research: latestResearch?.results as any,
    },
    variantCount
  );

  // Save scripts to database
  const scripts = await Promise.all(
    scriptVariants.map((variant, index) =>
      prisma.script.create({
        data: {
          campaignId,
          variantNumber: index + 1,
          title: variant.title,
          content: variant.content,
          durationSeconds: variant.durationSeconds,
          tone: variant.tone,
          style: variant.style,
          metadata: variant.metadata as any,
          status: 'generated',
        },
      })
    )
  );

  logger.info('Scripts generated', {
    ...logger.requestContext(req),
    campaignId,
    scriptCount: scripts.length,
  });

  const response: ApiResponse<Script[]> = {
    success: true,
    data: scripts as Script[],
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.json(response);
});

/**
 * Approve a script and advance to next stage
 */
export const approveScript = asyncHandler(async (req: Request, res: Response) => {
  const { scriptId } = req.params;

  logger.info('Approving script', {
    ...logger.requestContext(req),
    scriptId,
  });

  const script = await prisma.script.update({
    where: { id: scriptId },
    data: {
      approved: true,
      approvedAt: new Date(),
      status: 'approved',
    },
    include: {
      campaign: true,
    },
  });

  // Update project stage
  await prisma.project.update({
    where: { id: script.campaign.projectId },
    data: { currentStage: 2 },
  });

  logger.info('Script approved', {
    ...logger.requestContext(req),
    scriptId,
    projectId: script.campaign.projectId,
  });

  const response: ApiResponse<Script> = {
    success: true,
    data: script as Script,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    },
  };

  res.json(response);
});
