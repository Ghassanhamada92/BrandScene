/**
 * Application-wide constants
 */

// API Configuration
export const API_CONFIG = {
  VERSION: '2.0.0',
  TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Rate Limits
export const RATE_LIMITS = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
  AI_REQUESTS_PER_MINUTE: 10,
} as const;

// AI Service Configuration
export const AI_CONFIG = {
  GPT_MODEL: 'gpt-4-turbo-preview',
  DALLE_MODEL: 'dall-e-3',
  MAX_TOKENS: {
    RESEARCH: 2000,
    SCRIPT: 1500,
    SCENES: 2000,
    TRANSITIONS: 1500,
  },
  TEMPERATURE: {
    RESEARCH: 0.7,
    SCRIPT: 0.8,
    SCENES: 0.7,
    TRANSITIONS: 0.7,
  },
  IMAGE_SIZE: '1792x1024' as const,
  IMAGE_QUALITY: 'hd' as const,
} as const;

// Video Configuration
export const VIDEO_CONFIG = {
  PEXELS_PER_PAGE: 5,
  DEFAULT_FPS: 30,
  DEFAULT_BITRATE: '5000k',
  RESOLUTIONS: {
    '1080p': '1920x1080',
    '4k': '3840x2160',
    'social_square': '1080x1080',
    'social_vertical': '1080x1920',
    'web': '1280x720',
  },
} as const;

// Audio Configuration
export const AUDIO_CONFIG = {
  DEFAULT_VOICE_ID: 'EXAVITQu4vr4xnSDxMaL',
  ELEVENLABS_MODEL: 'eleven_monolingual_v1',
  VOICE_STABILITY: 0.5,
  SIMILARITY_BOOST: 0.75,
} as const;

// Database Configuration
export const DB_CONFIG = {
  POOL_MIN: 0,
  POOL_MAX: 10,
  ACQUIRE_TIMEOUT: 30000,
  IDLE_TIMEOUT: 10000,
} as const;

// Validation Limits
export const VALIDATION_LIMITS = {
  PROJECT_NAME_MAX: 255,
  PROJECT_DESCRIPTION_MAX: 1000,
  BRAND_NAME_MAX: 255,
  PRODUCT_NAME_MAX: 255,
  PRODUCT_DESCRIPTION_MIN: 10,
  TARGET_AUDIENCE_MIN: 10,
  VIDEO_LENGTH_MIN: 10,
  VIDEO_LENGTH_MAX: 180,
  SCRIPT_VARIANTS_MIN: 1,
  SCRIPT_VARIANTS_MAX: 5,
  IMAGE_VARIATIONS_MIN: 1,
  IMAGE_VARIATIONS_MAX: 5,
} as const;

// Transition Types
export const TRANSITION_TYPES = [
  'fade',
  'dissolve',
  'cut',
  'wipe',
  'zoom',
  'slide',
] as const;

// Scene Moods
export const SCENE_MOODS = [
  'energetic',
  'calm',
  'inspiring',
  'professional',
  'playful',
  'dramatic',
  'upbeat',
  'serious',
] as const;

// Camera Angles
export const CAMERA_ANGLES = [
  'close-up',
  'medium shot',
  'wide shot',
  'overhead',
  'low angle',
  'high angle',
  'eye level',
] as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// Log Levels
export const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
} as const;

// Default Values
export const DEFAULTS = {
  VIDEO_LENGTH: 30,
  SCRIPT_VARIANTS: 3,
  IMAGE_VARIATIONS: 3,
  STOCK_VIDEO_COUNT: 5,
  TRANSITION_DURATION: 0.5,
} as const;

// Regex Patterns
export const PATTERNS = {
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Feature Flags (for future use)
export const FEATURE_FLAGS = {
  ENABLE_AUTHENTICATION: false,
  ENABLE_RATE_LIMITING: false,
  ENABLE_CACHING: false,
  ENABLE_WEBSOCKETS: false,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_UUID: 'Invalid UUID format',
  INVALID_EMAIL: 'Invalid email format',
  RESOURCE_NOT_FOUND: 'Resource not found',
  VALIDATION_FAILED: 'Validation failed',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Access forbidden',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  AI_SERVICE_ERROR: 'AI service error',
  DATABASE_ERROR: 'Database operation failed',
  EXTERNAL_SERVICE_ERROR: 'External service error',
} as const;
