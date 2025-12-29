import { Request, Response } from 'express';
import { Project, BrandInfo, Script, ResearchData } from '../models';
import AIService from '../services/AIService';

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const userId = req.user?.id; // Assuming auth middleware sets req.user

    const project = await Project.create({
      userId,
      name,
      description,
      status: 'draft',
      currentStage: 1,
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

    const project = await Project.findByPk(id, {
      include: [
        { model: BrandInfo },
        { model: Script },
        { model: ResearchData },
      ],
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

export const updateBrandInfo = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const brandData = req.body;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const [brandInfo] = await BrandInfo.upsert({
      projectId,
      ...brandData,
    });

    res.json({
      success: true,
      data: brandInfo,
    });
  } catch (error) {
    console.error('Error updating brand info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update brand info',
    });
  }
};

export const conductResearch = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findByPk(projectId, {
      include: [BrandInfo],
    });

    if (!project || !project.brandInfo) {
      return res.status(404).json({
        success: false,
        message: 'Project or brand info not found',
      });
    }

    const brandInfo = project.brandInfo;

    // Conduct research using AI
    const researchResult = await AIService.conductResearch({
      topic: `${brandInfo.productName} - ${brandInfo.productDescription}`,
      context: brandInfo.additionalContext || '',
      targetAudience: brandInfo.targetAudience,
    });

    // Save research data
    const researchData = await ResearchData.create({
      projectId,
      researchType: 'comprehensive',
      query: `Research for ${brandInfo.brandName} - ${brandInfo.productName}`,
      results: researchResult,
      sources: researchResult.sources,
      confidenceScore: researchResult.confidenceScore,
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
    const { projectId } = req.params;
    const { variantCount = 3 } = req.body;

    const project = await Project.findByPk(projectId, {
      include: [BrandInfo, ResearchData],
    });

    if (!project || !project.brandInfo) {
      return res.status(404).json({
        success: false,
        message: 'Project or brand info not found',
      });
    }

    const brandInfo = project.brandInfo;
    const latestResearch = project.researchData?.[0];

    // Generate script variants
    const scriptVariants = await AIService.generateScriptVariants(
      {
        brandName: brandInfo.brandName,
        productName: brandInfo.productName,
        productDescription: brandInfo.productDescription,
        targetAudience: brandInfo.targetAudience,
        keyBenefits: (brandInfo.keyBenefits as string[]) || [],
        brandVoice: brandInfo.brandVoice,
        tone: brandInfo.tone,
        research: latestResearch?.results as any,
      },
      variantCount
    );

    // Save scripts to database
    const scripts = await Promise.all(
      scriptVariants.map((variant, index) =>
        Script.create({
          projectId,
          variantNumber: index + 1,
          title: variant.title,
          content: variant.content,
          durationSeconds: variant.durationSeconds,
          tone: variant.tone,
          style: variant.style,
          metadata: variant.metadata,
          status: 'generated',
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

    const script = await Script.findByPk(scriptId);
    if (!script) {
      return res.status(404).json({
        success: false,
        message: 'Script not found',
      });
    }

    script.approved = true;
    script.approvedAt = new Date();
    script.status = 'approved';
    await script.save();

    // Update project stage
    await Project.update(
      { currentStage: 2 },
      { where: { id: script.projectId } }
    );

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

export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const projects = await Project.findAll({
      where: { userId },
      include: [BrandInfo],
      order: [['updatedAt', 'DESC']],
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
