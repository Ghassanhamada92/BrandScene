// ============================================================================
// Base Types
// ============================================================================

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

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// User & Authentication Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// ============================================================================
// Project Types
// ============================================================================

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  currentStage: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProjectStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export interface CreateProjectDto {
  name: string;
  description?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

// ============================================================================
// Campaign Types
// ============================================================================

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

// ============================================================================
// Research Types
// ============================================================================

export interface ResearchData {
  id: string;
  campaignId: string;
  researchType: ResearchType;
  query: string;
  results: ResearchResult;
  sources?: string[];
  confidenceScore?: number;
  createdAt: Date;
}

export enum ResearchType {
  COMPREHENSIVE = 'comprehensive',
  AUDIENCE = 'audience',
  COMPETITOR = 'competitor',
  TRENDS = 'trends',
}

export interface ResearchResult {
  insights: string[];
  trends: string[];
  competitorAnalysis: string[];
  recommendations: string[];
  sources: string[];
  confidenceScore: number;
}

export interface ResearchQuery {
  topic: string;
  context: string;
  targetAudience: string;
}

// ============================================================================
// Script Types
// ============================================================================

export interface Script {
  id: string;
  campaignId: string;
  variantNumber: number;
  title: string;
  content: string;
  durationSeconds?: number;
  tone?: string;
  style?: string;
  metadata?: ScriptMetadata;
  status: ScriptStatus;
  approved: boolean;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScriptMetadata {
  hooks: string[];
  keyMessages: string[];
  callToAction: string;
}

export enum ScriptStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  GENERATED = 'generated',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface GenerateScriptsDto {
  variantCount?: number;
}

// ============================================================================
// Scene Types (Stage 2)
// ============================================================================

export interface Scene {
  id: string;
  scriptId: string;
  sceneNumber: number;
  narrationText: string;
  visualDescription: string;
  durationSeconds: number;
  mood?: string;
  cameraAngle?: string;
  transitionType?: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSceneDto {
  scriptId: string;
  sceneNumber: number;
  narrationText: string;
  visualDescription: string;
  durationSeconds: number;
  mood?: string;
  cameraAngle?: string;
  transitionType?: string;
}

export interface ImageVariation {
  id: string;
  sceneId: string;
  variationNumber: number;
  prompt: string;
  imageUrl: string;
  generationParams?: any;
  selected: boolean;
  createdAt: Date;
}

// ============================================================================
// Video Types (Stage 3)
// ============================================================================

export interface VideoClip {
  id: string;
  sceneId: string;
  sourceType: VideoSourceType;
  sourceUrl: string;
  durationSeconds: number;
  resolution?: string;
  fileSizeMb?: number;
  thumbnailUrl?: string;
  metadata?: any;
  processingStatus: ProcessingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum VideoSourceType {
  STOCK = 'stock',
  GENERATED = 'generated',
  UPLOADED = 'uploaded',
}

export enum ProcessingStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface AudioTrack {
  id: string;
  scriptId: string;
  trackType: AudioTrackType;
  audioUrl: string;
  durationSeconds: number;
  voiceId?: string;
  fileSizeMb?: number;
  metadata?: any;
  createdAt: Date;
}

export enum AudioTrackType {
  NARRATION = 'narration',
  MUSIC = 'music',
  SFX = 'sfx',
}

// ============================================================================
// Stitching Types (Stage 4)
// ============================================================================

export interface Video {
  id: string;
  scriptId: string;
  videoUrl: string;
  thumbnailUrl?: string;
  durationSeconds: number;
  resolution?: string;
  fileSizeMb?: number;
  renderSettings?: RenderSettings;
  status: VideoStatus;
  createdAt: Date;
  completedAt?: Date;
}

export enum VideoStatus {
  PENDING = 'pending',
  RENDERING = 'rendering',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface RenderSettings {
  resolution: string;
  fps: number;
  codec: string;
  bitrate: string;
  format: string;
}

export interface Transition {
  id: string;
  videoId: string;
  fromSceneId: string;
  toSceneId: string;
  transitionType: TransitionType;
  durationSeconds: number;
  parameters?: any;
  createdAt: Date;
}

export enum TransitionType {
  FADE = 'fade',
  DISSOLVE = 'dissolve',
  CUT = 'cut',
  WIPE = 'wipe',
  ZOOM = 'zoom',
  SLIDE = 'slide',
}

export interface Timeline {
  totalDuration: number;
  scenes: TimelineScene[];
  narration?: AudioTrack;
}

export interface TimelineScene {
  sceneNumber: number;
  startTime: number;
  endTime: number;
  duration: number;
  videoClip?: VideoClip;
  imageVariation?: ImageVariation;
  narration: string;
}

// ============================================================================
// Asset Types
// ============================================================================

export interface Asset {
  id: string;
  campaignId: string;
  assetType: AssetType;
  fileName: string;
  fileUrl: string;
  fileSizeMb: number;
  mimeType: string;
  metadata?: any;
  createdAt: Date;
}

export enum AssetType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  LOGO = 'logo',
}

// ============================================================================
// Activity Log Types
// ============================================================================

export interface ActivityLog {
  id: string;
  userId?: string;
  projectId?: string;
  action: string;
  details?: any;
  ipAddress?: string;
  createdAt: Date;
}

// ============================================================================
// Error Types
// ============================================================================

export enum ErrorCode {
  // General
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  
  // Authentication
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  
  // Resource
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  
  // AI Service
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
  AI_RATE_LIMIT = 'AI_RATE_LIMIT',
  AI_TIMEOUT = 'AI_TIMEOUT',
  
  // Database
  DATABASE_ERROR = 'DATABASE_ERROR',
  DATABASE_CONNECTION_ERROR = 'DATABASE_CONNECTION_ERROR',
  
  // External Service
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  EXTERNAL_SERVICE_TIMEOUT = 'EXTERNAL_SERVICE_TIMEOUT',
}

// ============================================================================
// Request Extensions
// ============================================================================

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
      requestId?: string;
    }
  }
}
