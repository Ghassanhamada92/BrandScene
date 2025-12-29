import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import AIService from '../services/AIService';

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const userId = req.user?.id || 'demo-user-id'; // Replace with actual auth

    const project = await prisma.project.create({
      data: {
        userId,
        name,
        description,
        status: 'draft',
        currentStage: 1,
      },
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
    });
  }
};

export const getProject = async (req: Request, res: Response) => {
  try {
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
            },
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
    });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || 'demo-user-id';

    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        campaigns: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
    });
  }
};

export const createCampaign = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const campaignData = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const campaign = await prisma.campaign.create({
      data: {
        projectId,
        ...campaignData,
      },
    });

    res.status(201).json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create campaign',
    });
  }
};

export const updateCampaign = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;
    const campaignData = req.body;

    const campaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: campaignData,
    });

    res.json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update campaign',
    });
  }
};

export const conductResearch = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found',
      });
    }

    // Conduct research using AI
    const researchResult = await AIService.conductResearch({
      topic: `${campaign.productName} - ${campaign.productDescription}`,
      context: campaign.additionalContext || '',
      targetAudience: campaign.targetAudience,
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

    res.json({
      success: true,
      data: researchData,
    });
  } catch (error) {
    console.error('Error conducting research:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to conduct research',
    });
  }
};

export const generateScripts = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;
    const { variantCount = 3 } = req.body;

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
      return res.status(404).json({
        success: false,
        message: 'Campaign not found',
      });
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

    res.json({
      success: true,
      data: scripts,
    });
  } catch (error) {
    console.error('Error generating scripts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate scripts',
    });
  }
};

export const approveScript = async (req: Request, res: Response) => {
  try {
    const { scriptId } = req.params;

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

    res.json({
      success: true,
      data: script,
    });
  } catch (error) {
    console.error('Error approving script:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve script',
    });
  }
};

export const getCampaign = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        researchData: true,
        scripts: {
          include: {
            scenes: true,
          },
        },
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found',
      });
    }

    res.json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch campaign',
    });
  }
};
