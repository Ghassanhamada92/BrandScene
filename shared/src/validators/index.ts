import { z } from 'zod';

// ============================================================================
// Project Validators
// ============================================================================

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  status: z.enum(['draft', 'active', 'completed', 'archived']).optional(),
});

// ============================================================================
// Campaign Validators
// ============================================================================

export const createCampaignSchema = z.object({
  brandName: z.string().min(1, 'Brand name is required').max(255),
  productName: z.string().min(1, 'Product name is required').max(255),
  productDescription: z.string().min(10, 'Product description must be at least 10 characters'),
  targetAudience: z.string().min(10, 'Target audience must be at least 10 characters'),
  keyBenefits: z.array(z.string()).optional(),
  brandVoice: z.string().max(100).optional(),
  tone: z.string().max(100).optional(),
  additionalContext: z.string().optional(),
  videoLength: z.number().int().min(10).max(180).default(30),
  videoStyle: z.string().max(100).optional(),
});

export const updateCampaignSchema = createCampaignSchema.partial();

// ============================================================================
// Script Validators
// ============================================================================

export const generateScriptsSchema = z.object({
  variantCount: z.number().int().min(1).max(5).default(3),
});

// ============================================================================
// UUID Validator
// ============================================================================

export const uuidSchema = z.string().uuid('Invalid UUID format');

// ============================================================================
// Type Exports
// ============================================================================

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
export type GenerateScriptsInput = z.infer<typeof generateScriptsSchema>;
