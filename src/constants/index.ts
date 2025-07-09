// Application constants

export const APP_NAME = 'PROMPTTT'
export const APP_DESCRIPTION =
  'The definitive gallery for AI-generated video art'

// API endpoints
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  VIDEOS: '/api/videos',
  USERS: '/api/users',
  COMMENTS: '/api/comments',
  LIKES: '/api/likes',
  UPLOAD: '/api/upload',
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 25,
  MAX_LIMIT: 100,
} as const

// File upload limits
export const UPLOAD_LIMITS = {
  VIDEO_MAX_SIZE: 100 * 1024 * 1024, // 100MB
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_VIDEO_FORMATS: ['mp4', 'mov', 'avi', 'webm'],
  SUPPORTED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],
} as const

// AI Models
export const AI_MODELS = [
  'Sora',
  'Runway Gen-3',
  'Runway Gen-2',
  'Pika Labs',
  'Stable Video Diffusion',
  'AnimateDiff',
  'Zeroscope',
  'ModelScope',
  'Other',
] as const

// Video grid settings
export const GRID_SETTINGS = {
  COLUMNS: {
    MOBILE: 1,
    TABLET: 2,
    DESKTOP: 3,
    LARGE: 4,
  },
  ASPECT_RATIO: '16/9',
} as const

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 400,
} as const

// Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const
