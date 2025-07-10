// Image optimization utilities for responsive images

export interface ImageDensitySet {
  '1x': string
  '2x': string
  '3x'?: string
}

export interface ResponsiveImageConfig {
  mobile: {
    width: number
    quality?: number
  }
  tablet: {
    width: number
    quality?: number
  }
  desktop: {
    width: number
    quality?: number
  }
}

// Generate image URLs for different screen densities
export function generateDensityVariants(
  basePath: string,
  extension: string = 'png'
): ImageDensitySet {
  const baseUrl = basePath.replace(/\.[^/.]+$/, '') // Remove existing extension
  
  return {
    '1x': `${baseUrl}.${extension}`,
    '2x': `${baseUrl}@2x.${extension}`,
    '3x': `${baseUrl}@3x.${extension}`,
  }
}

// Generate responsive sizes string for different breakpoints
export function generateResponsiveSizes(config: ResponsiveImageConfig): string {
  return [
    `(max-width: 640px) ${config.mobile.width}px`,
    `(max-width: 768px) ${config.tablet.width}px`,
    `${config.desktop.width}px`
  ].join(', ')
}

// Common responsive configurations for UI elements
export const imageConfigs = {
  logo: {
    mobile: { width: 32, quality: 90 },
    tablet: { width: 40, quality: 90 },
    desktop: { width: 48, quality: 90 },
  },
  icon: {
    mobile: { width: 16, quality: 95 },
    tablet: { width: 20, quality: 95 },
    desktop: { width: 24, quality: 95 },
  },
  avatar: {
    mobile: { width: 32, quality: 85 },
    tablet: { width: 40, quality: 85 },
    desktop: { width: 48, quality: 85 },
  },
  thumbnail: {
    mobile: { width: 120, quality: 80 },
    tablet: { width: 160, quality: 80 },
    desktop: { width: 200, quality: 80 },
  },
  cardImage: {
    mobile: { width: 320, quality: 75 },
    tablet: { width: 400, quality: 80 },
    desktop: { width: 500, quality: 85 },
  },
  heroImage: {
    mobile: { width: 640, quality: 75 },
    tablet: { width: 1024, quality: 80 },
    desktop: { width: 1920, quality: 85 },
  },
} as const

// Generate srcSet string for an image
export function generateSrcSet(
  basePath: string,
  densities: (1 | 2 | 3)[] = [1, 2, 3],
  extension: string = 'png'
): string {
  const variants = generateDensityVariants(basePath, extension)
  
  return densities
    .map(density => {
      const key = `${density}x` as keyof ImageDensitySet
      return variants[key] ? `${variants[key]} ${density}x` : null
    })
    .filter(Boolean)
    .join(', ')
}

// Optimize image loading based on viewport
export function getOptimalImageSize(
  viewportWidth: number,
  config: ResponsiveImageConfig
): { width: number; quality: number } {
  if (viewportWidth <= 640) {
    return config.mobile
  } else if (viewportWidth <= 768) {
    return config.tablet
  } else {
    return config.desktop
  }
}

// Check if image should be loaded with priority
export function shouldLoadWithPriority(
  imageType: 'logo' | 'hero' | 'above-fold' | 'below-fold'
): boolean {
  return ['logo', 'hero', 'above-fold'].includes(imageType)
}

// Generate Next.js Image component props
export function generateImageProps(
  src: string,
  alt: string,
  type: keyof typeof imageConfigs,
  options: {
    priority?: boolean
    quality?: number
    className?: string
  } = {}
) {
  const config = imageConfigs[type]
  const sizes = generateResponsiveSizes(config)
  
  return {
    src,
    alt,
    sizes,
    quality: options.quality || config.desktop.quality || 85,
    priority: options.priority || shouldLoadWithPriority(type as any),
    className: options.className,
    // Suggested dimensions for the largest size
    width: config.desktop.width,
    height: config.desktop.width, // Assuming square for most UI elements
  }
}

// Performance monitoring for images
export function trackImagePerformance(imageSrc: string, loadTime: number) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Track image loading performance
    console.log(`Image loaded: ${imageSrc} in ${loadTime}ms`)
    
    // Could integrate with analytics here
    // analytics.track('image_load_time', { src: imageSrc, loadTime })
  }
}

// Preload critical images
export function preloadCriticalImages(imagePaths: string[]) {
  if (typeof window !== 'undefined') {
    imagePaths.forEach(path => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = path
      document.head.appendChild(link)
    })
  }
}