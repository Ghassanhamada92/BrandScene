// API types for frontend

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  status: string;
  currentStage: number;
  createdAt: Date;
  updatedAt: Date;
  campaigns?: Campaign[];
}

export interface Campaign {
  id: string;
  projectId: string;
  brandName: string;
  productName: string;
  productDescription: string;
  targetAudience: string;
  keyBenefits?: string[];
  brandVoice?: string;
  tone?: string;
  additionalContext?: string;
  videoLength: number;
  videoStyle?: string;
  createdAt: Date;
  updatedAt: Date;
  scripts?: Script[];
  researchData?: ResearchData[];
}

export interface ResearchData {
  id: string;
  campaignId: string;
  researchType: string;
  query: string;
  results: any;
  sources?: string[];
  confidenceScore?: number;
  createdAt: Date;
}

export interface Script {
  id: string;
  campaignId: string;
  variantNumber: number;
  title: string;
  content: string;
  durationSeconds?: number;
  tone?: string;
  style?: string;
  metadata?: any;
  status: string;
  approved: boolean;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
}

export interface CreateCampaignDto {
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

export interface UpdateCampaignDto extends Partial<CreateCampaignDto> {}

export interface GenerateScriptsDto {
  variantCount?: number;
}
