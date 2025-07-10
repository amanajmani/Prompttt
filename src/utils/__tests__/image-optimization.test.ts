import {
  generateDensityVariants,
  generateResponsiveSizes,
  generateSrcSet,
  getOptimalImageSize,
  shouldLoadWithPriority,
  generateImageProps,
  imageConfigs
} from '../image-optimization'

describe('Image Optimization Utilities', () => {
  describe('generateDensityVariants', () => {
    it('generates correct density variants for PNG', () => {
      const variants = generateDensityVariants('/images/logo', 'png')
      
      expect(variants).toEqual({
        '1x': '/images/logo.png',
        '2x': '/images/logo@2x.png',
        '3x': '/images/logo@3x.png'
      })
    })

    it('generates correct density variants for JPG', () => {
      const variants = generateDensityVariants('/images/photo', 'jpg')
      
      expect(variants).toEqual({
        '1x': '/images/photo.jpg',
        '2x': '/images/photo@2x.jpg',
        '3x': '/images/photo@3x.jpg'
      })
    })

    it('handles paths with existing extensions', () => {
      const variants = generateDensityVariants('/images/logo.png', 'webp')
      
      expect(variants).toEqual({
        '1x': '/images/logo.webp',
        '2x': '/images/logo@2x.webp',
        '3x': '/images/logo@3x.webp'
      })
    })
  })

  describe('generateResponsiveSizes', () => {
    it('generates correct responsive sizes string', () => {
      const config = {
        mobile: { width: 32, quality: 90 },
        tablet: { width: 48, quality: 90 },
        desktop: { width: 64, quality: 90 }
      }
      
      const sizes = generateResponsiveSizes(config)
      expect(sizes).toBe('(max-width: 640px) 32px, (max-width: 768px) 48px, 64px')
    })

    it('handles different width values', () => {
      const config = {
        mobile: { width: 100, quality: 80 },
        tablet: { width: 200, quality: 85 },
        desktop: { width: 400, quality: 90 }
      }
      
      const sizes = generateResponsiveSizes(config)
      expect(sizes).toBe('(max-width: 640px) 100px, (max-width: 768px) 200px, 400px')
    })
  })

  describe('generateSrcSet', () => {
    it('generates srcSet for all densities by default', () => {
      const srcSet = generateSrcSet('/images/logo', [1, 2, 3], 'png')
      expect(srcSet).toBe('/images/logo.png 1x, /images/logo@2x.png 2x, /images/logo@3x.png 3x')
    })

    it('generates srcSet for specific densities', () => {
      const srcSet = generateSrcSet('/images/logo', [1, 2], 'png')
      expect(srcSet).toBe('/images/logo.png 1x, /images/logo@2x.png 2x')
    })

    it('handles single density', () => {
      const srcSet = generateSrcSet('/images/logo', [1], 'png')
      expect(srcSet).toBe('/images/logo.png 1x')
    })
  })

  describe('getOptimalImageSize', () => {
    const config = {
      mobile: { width: 32, quality: 80 },
      tablet: { width: 48, quality: 85 },
      desktop: { width: 64, quality: 90 }
    }

    it('returns mobile config for small viewports', () => {
      const result = getOptimalImageSize(320, config)
      expect(result).toEqual({ width: 32, quality: 80 })
    })

    it('returns tablet config for medium viewports', () => {
      const result = getOptimalImageSize(700, config)
      expect(result).toEqual({ width: 48, quality: 85 })
    })

    it('returns desktop config for large viewports', () => {
      const result = getOptimalImageSize(1200, config)
      expect(result).toEqual({ width: 64, quality: 90 })
    })

    it('handles edge cases correctly', () => {
      expect(getOptimalImageSize(640, config)).toEqual({ width: 32, quality: 80 }) // Mobile
      expect(getOptimalImageSize(641, config)).toEqual({ width: 48, quality: 85 }) // Tablet
      expect(getOptimalImageSize(768, config)).toEqual({ width: 48, quality: 85 }) // Tablet
      expect(getOptimalImageSize(769, config)).toEqual({ width: 64, quality: 90 }) // Desktop
    })
  })

  describe('shouldLoadWithPriority', () => {
    it('returns true for priority image types', () => {
      expect(shouldLoadWithPriority('logo')).toBe(true)
      expect(shouldLoadWithPriority('hero')).toBe(true)
      expect(shouldLoadWithPriority('above-fold')).toBe(true)
    })

    it('returns false for non-priority image types', () => {
      expect(shouldLoadWithPriority('below-fold')).toBe(false)
    })
  })

  describe('generateImageProps', () => {
    it('generates correct props for logo images', () => {
      const props = generateImageProps('/logo.png', 'Company Logo', 'logo')
      
      expect(props).toEqual({
        src: '/logo.png',
        alt: 'Company Logo',
        sizes: '(max-width: 640px) 32px, (max-width: 768px) 40px, 48px',
        quality: 90,
        priority: true,
        className: undefined,
        width: 48,
        height: 48
      })
    })

    it('generates correct props for icon images', () => {
      const props = generateImageProps('/icon.png', 'Menu Icon', 'icon', { 
        className: 'custom-icon' 
      })
      
      expect(props).toEqual({
        src: '/icon.png',
        alt: 'Menu Icon',
        sizes: '(max-width: 640px) 16px, (max-width: 768px) 20px, 24px',
        quality: 95,
        priority: false,
        className: 'custom-icon',
        width: 24,
        height: 24
      })
    })

    it('allows custom quality override', () => {
      const props = generateImageProps('/thumb.png', 'Thumbnail', 'thumbnail', { 
        quality: 70 
      })
      
      expect(props.quality).toBe(70)
    })

    it('allows priority override', () => {
      const props = generateImageProps('/icon.png', 'Critical Icon', 'icon', { 
        priority: true 
      })
      
      expect(props.priority).toBe(true)
    })
  })

  describe('imageConfigs', () => {
    it('contains all expected image type configurations', () => {
      expect(imageConfigs).toHaveProperty('logo')
      expect(imageConfigs).toHaveProperty('icon')
      expect(imageConfigs).toHaveProperty('avatar')
      expect(imageConfigs).toHaveProperty('thumbnail')
      expect(imageConfigs).toHaveProperty('cardImage')
      expect(imageConfigs).toHaveProperty('heroImage')
    })

    it('has proper structure for each config', () => {
      Object.values(imageConfigs).forEach(config => {
        expect(config).toHaveProperty('mobile')
        expect(config).toHaveProperty('tablet')
        expect(config).toHaveProperty('desktop')
        
        expect(config.mobile).toHaveProperty('width')
        expect(config.tablet).toHaveProperty('width')
        expect(config.desktop).toHaveProperty('width')
      })
    })

    it('has increasing sizes from mobile to desktop', () => {
      Object.values(imageConfigs).forEach(config => {
        expect(config.mobile.width).toBeLessThanOrEqual(config.tablet.width)
        expect(config.tablet.width).toBeLessThanOrEqual(config.desktop.width)
      })
    })
  })

  describe('Performance considerations', () => {
    it('uses appropriate quality settings for different image types', () => {
      // Icons should have high quality (small file size anyway)
      expect(imageConfigs.icon.mobile.quality).toBeGreaterThanOrEqual(90)
      
      // Large images can have lower quality for performance
      expect(imageConfigs.heroImage.mobile.quality).toBeLessThanOrEqual(85)
    })

    it('provides reasonable size progressions', () => {
      // Logo sizes should be reasonable for UI elements
      expect(imageConfigs.logo.mobile.width).toBeGreaterThanOrEqual(24)
      expect(imageConfigs.logo.desktop.width).toBeLessThanOrEqual(64)
      
      // Hero images should span viewport appropriately
      expect(imageConfigs.heroImage.mobile.width).toBeGreaterThanOrEqual(320)
      expect(imageConfigs.heroImage.desktop.width).toBeGreaterThanOrEqual(1200)
    })
  })
})