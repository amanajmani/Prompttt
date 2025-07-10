import {
  APP_NAME,
  APP_DESCRIPTION,
  API_ENDPOINTS,
  PAGINATION,
  UPLOAD_LIMITS,
  AI_MODELS,
  GRID_SETTINGS,
  ANIMATION_DURATION,
  BREAKPOINTS,
} from '../index'

describe('Constants', () => {
  describe('App Constants', () => {
    it('has app name', () => {
      expect(APP_NAME).toBe('PROMPTTT')
      expect(typeof APP_NAME).toBe('string')
    })

    it('has app description', () => {
      expect(APP_DESCRIPTION).toBe('The definitive gallery for AI-generated video art')
      expect(typeof APP_DESCRIPTION).toBe('string')
    })
  })

  describe('API_ENDPOINTS', () => {
    it('has all required API endpoints', () => {
      expect(API_ENDPOINTS).toHaveProperty('AUTH')
      expect(API_ENDPOINTS).toHaveProperty('VIDEOS')
      expect(API_ENDPOINTS).toHaveProperty('USERS')
      expect(API_ENDPOINTS).toHaveProperty('COMMENTS')
      expect(API_ENDPOINTS).toHaveProperty('LIKES')
      expect(API_ENDPOINTS).toHaveProperty('UPLOAD')
    })

    it('has correct endpoint paths', () => {
      expect(API_ENDPOINTS.AUTH).toBe('/api/auth')
      expect(API_ENDPOINTS.VIDEOS).toBe('/api/videos')
      expect(API_ENDPOINTS.USERS).toBe('/api/users')
      expect(API_ENDPOINTS.COMMENTS).toBe('/api/comments')
      expect(API_ENDPOINTS.LIKES).toBe('/api/likes')
      expect(API_ENDPOINTS.UPLOAD).toBe('/api/upload')
    })
  })

  describe('PAGINATION', () => {
    it('has default limit', () => {
      expect(PAGINATION.DEFAULT_LIMIT).toBe(25)
      expect(typeof PAGINATION.DEFAULT_LIMIT).toBe('number')
    })

    it('has max limit', () => {
      expect(PAGINATION.MAX_LIMIT).toBe(100)
      expect(typeof PAGINATION.MAX_LIMIT).toBe('number')
    })

    it('has valid limit values', () => {
      expect(PAGINATION.DEFAULT_LIMIT).toBeLessThan(PAGINATION.MAX_LIMIT)
      expect(PAGINATION.DEFAULT_LIMIT).toBeGreaterThan(0)
      expect(PAGINATION.MAX_LIMIT).toBeGreaterThan(0)
    })
  })

  describe('UPLOAD_LIMITS', () => {
    it('has video max size', () => {
      expect(UPLOAD_LIMITS.VIDEO_MAX_SIZE).toBe(100 * 1024 * 1024)
      expect(typeof UPLOAD_LIMITS.VIDEO_MAX_SIZE).toBe('number')
    })

    it('has image max size', () => {
      expect(UPLOAD_LIMITS.IMAGE_MAX_SIZE).toBe(5 * 1024 * 1024)
      expect(typeof UPLOAD_LIMITS.IMAGE_MAX_SIZE).toBe('number')
    })

    it('has supported video formats', () => {
      expect(Array.isArray(UPLOAD_LIMITS.SUPPORTED_VIDEO_FORMATS)).toBe(true)
      expect(UPLOAD_LIMITS.SUPPORTED_VIDEO_FORMATS).toContain('mp4')
      expect(UPLOAD_LIMITS.SUPPORTED_VIDEO_FORMATS).toContain('mov')
      expect(UPLOAD_LIMITS.SUPPORTED_VIDEO_FORMATS).toContain('avi')
      expect(UPLOAD_LIMITS.SUPPORTED_VIDEO_FORMATS).toContain('webm')
    })

    it('has supported image formats', () => {
      expect(Array.isArray(UPLOAD_LIMITS.SUPPORTED_IMAGE_FORMATS)).toBe(true)
      expect(UPLOAD_LIMITS.SUPPORTED_IMAGE_FORMATS).toContain('jpg')
      expect(UPLOAD_LIMITS.SUPPORTED_IMAGE_FORMATS).toContain('jpeg')
      expect(UPLOAD_LIMITS.SUPPORTED_IMAGE_FORMATS).toContain('png')
      expect(UPLOAD_LIMITS.SUPPORTED_IMAGE_FORMATS).toContain('webp')
    })
  })

  describe('AI_MODELS', () => {
    it('is an array', () => {
      expect(Array.isArray(AI_MODELS)).toBe(true)
    })

    it('contains expected models', () => {
      expect(AI_MODELS).toContain('Sora')
      expect(AI_MODELS).toContain('Runway Gen-3')
      expect(AI_MODELS).toContain('Runway Gen-2')
      expect(AI_MODELS).toContain('Pika Labs')
      expect(AI_MODELS).toContain('Stable Video Diffusion')
      expect(AI_MODELS).toContain('AnimateDiff')
      expect(AI_MODELS).toContain('Zeroscope')
      expect(AI_MODELS).toContain('ModelScope')
      expect(AI_MODELS).toContain('Other')
    })

    it('has reasonable length', () => {
      expect(AI_MODELS.length).toBeGreaterThan(0)
      expect(AI_MODELS.length).toBeLessThan(20)
    })
  })

  describe('GRID_SETTINGS', () => {
    it('has columns configuration', () => {
      expect(GRID_SETTINGS).toHaveProperty('COLUMNS')
      expect(GRID_SETTINGS.COLUMNS).toHaveProperty('MOBILE')
      expect(GRID_SETTINGS.COLUMNS).toHaveProperty('TABLET')
      expect(GRID_SETTINGS.COLUMNS).toHaveProperty('DESKTOP')
      expect(GRID_SETTINGS.COLUMNS).toHaveProperty('LARGE')
    })

    it('has ascending column counts', () => {
      expect(GRID_SETTINGS.COLUMNS.MOBILE).toBeLessThanOrEqual(GRID_SETTINGS.COLUMNS.TABLET)
      expect(GRID_SETTINGS.COLUMNS.TABLET).toBeLessThanOrEqual(GRID_SETTINGS.COLUMNS.DESKTOP)
      expect(GRID_SETTINGS.COLUMNS.DESKTOP).toBeLessThanOrEqual(GRID_SETTINGS.COLUMNS.LARGE)
    })

    it('has aspect ratio', () => {
      expect(GRID_SETTINGS.ASPECT_RATIO).toBe('16/9')
    })
  })

  describe('ANIMATION_DURATION', () => {
    it('has all duration values', () => {
      expect(ANIMATION_DURATION).toHaveProperty('FAST')
      expect(ANIMATION_DURATION).toHaveProperty('NORMAL')
      expect(ANIMATION_DURATION).toHaveProperty('SLOW')
    })

    it('has ascending duration values', () => {
      expect(ANIMATION_DURATION.FAST).toBeLessThan(ANIMATION_DURATION.NORMAL)
      expect(ANIMATION_DURATION.NORMAL).toBeLessThan(ANIMATION_DURATION.SLOW)
    })

    it('has reasonable duration values', () => {
      expect(ANIMATION_DURATION.FAST).toBeGreaterThan(0)
      expect(ANIMATION_DURATION.SLOW).toBeLessThan(1000)
    })
  })

  describe('BREAKPOINTS', () => {
    it('has all required breakpoint values', () => {
      expect(BREAKPOINTS).toHaveProperty('SM')
      expect(BREAKPOINTS).toHaveProperty('MD')
      expect(BREAKPOINTS).toHaveProperty('LG')
      expect(BREAKPOINTS).toHaveProperty('XL')
      expect(BREAKPOINTS).toHaveProperty('2XL')
    })

    it('has correct breakpoint values', () => {
      expect(BREAKPOINTS.SM).toBe(640)
      expect(BREAKPOINTS.MD).toBe(768)
      expect(BREAKPOINTS.LG).toBe(1024)
      expect(BREAKPOINTS.XL).toBe(1280)
      expect(BREAKPOINTS['2XL']).toBe(1536)
    })

    it('has ascending breakpoint values', () => {
      expect(BREAKPOINTS.SM).toBeLessThan(BREAKPOINTS.MD)
      expect(BREAKPOINTS.MD).toBeLessThan(BREAKPOINTS.LG)
      expect(BREAKPOINTS.LG).toBeLessThan(BREAKPOINTS.XL)
      expect(BREAKPOINTS.XL).toBeLessThan(BREAKPOINTS['2XL'])
    })
  })

  describe('Constants integration', () => {
    it('exports all constants', () => {
      expect(APP_NAME).toBeDefined()
      expect(APP_DESCRIPTION).toBeDefined()
      expect(API_ENDPOINTS).toBeDefined()
      expect(PAGINATION).toBeDefined()
      expect(UPLOAD_LIMITS).toBeDefined()
      expect(AI_MODELS).toBeDefined()
      expect(GRID_SETTINGS).toBeDefined()
      expect(ANIMATION_DURATION).toBeDefined()
      expect(BREAKPOINTS).toBeDefined()
    })

    it('has consistent structure', () => {
      expect(typeof API_ENDPOINTS).toBe('object')
      expect(typeof PAGINATION).toBe('object')
      expect(typeof UPLOAD_LIMITS).toBe('object')
      expect(typeof GRID_SETTINGS).toBe('object')
      expect(typeof ANIMATION_DURATION).toBe('object')
      expect(typeof BREAKPOINTS).toBe('object')
    })
  })
})