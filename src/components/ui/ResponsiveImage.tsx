'use client'

import Image from 'next/image'
import { cn } from '@/utils'

export interface ResponsiveImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  sizes?: string
  fill?: boolean
  // Custom responsive breakpoints
  breakpoints?: {
    mobile?: string
    tablet?: string
    desktop?: string
  }
  // Screen density variants
  densityVariants?: {
    '1x'?: string
    '2x'?: string
    '3x'?: string
  }
}

// Default responsive sizes for different use cases
const defaultSizes = {
  logo: '(max-width: 640px) 32px, (max-width: 768px) 40px, 48px',
  icon: '(max-width: 640px) 16px, (max-width: 768px) 20px, 24px',
  avatar: '(max-width: 640px) 32px, (max-width: 768px) 40px, 48px',
  thumbnail: '(max-width: 640px) 120px, (max-width: 768px) 160px, 200px',
  hero: '(max-width: 640px) 100vw, (max-width: 768px) 90vw, 80vw',
  card: '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw',
}

export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 85,
  sizes,
  fill = false,
  breakpoints,
  densityVariants,
  ...props
}: ResponsiveImageProps) {
  // Build srcSet for different screen densities
  const buildSrcSet = () => {
    if (!densityVariants) return undefined
    
    const srcSetArray = []
    if (densityVariants['1x']) srcSetArray.push(`${densityVariants['1x']} 1x`)
    if (densityVariants['2x']) srcSetArray.push(`${densityVariants['2x']} 2x`)
    if (densityVariants['3x']) srcSetArray.push(`${densityVariants['3x']} 3x`)
    
    return srcSetArray.length > 0 ? srcSetArray.join(', ') : undefined
  }

  // Build responsive sizes string
  const buildSizes = () => {
    if (sizes) return sizes
    if (breakpoints) {
      const sizeArray = []
      if (breakpoints.mobile) sizeArray.push(`(max-width: 640px) ${breakpoints.mobile}`)
      if (breakpoints.tablet) sizeArray.push(`(max-width: 768px) ${breakpoints.tablet}`)
      if (breakpoints.desktop) sizeArray.push(breakpoints.desktop)
      return sizeArray.join(', ')
    }
    return undefined
  }

  const srcSet = buildSrcSet()
  const responsiveSizes = buildSizes()

  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      className={cn(
        'object-cover',
        fill && 'absolute inset-0',
        className
      )}
      priority={priority}
      quality={quality}
      sizes={responsiveSizes}
      {...(srcSet && { 'data-srcset': srcSet })}
      {...props}
    />
  )
}

// Specialized components for common UI patterns
export function LogoImage({
  src,
  alt = 'Logo',
  className,
  ...props
}: Omit<ResponsiveImageProps, 'sizes'>) {
  return (
    <ResponsiveImage
      src={src}
      alt={alt}
      sizes={defaultSizes.logo}
      className={cn('h-auto w-auto', className)}
      {...props}
    />
  )
}

export function IconImage({
  src,
  alt = 'Icon',
  className,
  ...props
}: Omit<ResponsiveImageProps, 'sizes'>) {
  return (
    <ResponsiveImage
      src={src}
      alt={alt}
      sizes={defaultSizes.icon}
      className={cn('h-auto w-auto', className)}
      {...props}
    />
  )
}

export function AvatarImage({
  src,
  alt = 'Avatar',
  className,
  ...props
}: Omit<ResponsiveImageProps, 'sizes'>) {
  return (
    <ResponsiveImage
      src={src}
      alt={alt}
      sizes={defaultSizes.avatar}
      className={cn('rounded-full object-cover', className)}
      {...props}
    />
  )
}

export function ThumbnailImage({
  src,
  alt = 'Thumbnail',
  className,
  ...props
}: Omit<ResponsiveImageProps, 'sizes'>) {
  return (
    <ResponsiveImage
      src={src}
      alt={alt}
      sizes={defaultSizes.thumbnail}
      className={cn('rounded-lg object-cover', className)}
      {...props}
    />
  )
}

export function HeroImage({
  src,
  alt = 'Hero image',
  className,
  ...props
}: Omit<ResponsiveImageProps, 'sizes'>) {
  return (
    <ResponsiveImage
      src={src}
      alt={alt}
      sizes={defaultSizes.hero}
      className={cn('w-full object-cover', className)}
      priority={true}
      {...props}
    />
  )
}

export function CardImage({
  src,
  alt = 'Card image',
  className,
  ...props
}: Omit<ResponsiveImageProps, 'sizes'>) {
  return (
    <ResponsiveImage
      src={src}
      alt={alt}
      sizes={defaultSizes.card}
      className={cn('aspect-video w-full object-cover', className)}
      {...props}
    />
  )
}