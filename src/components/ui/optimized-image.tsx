'use client';

import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { forwardRef, useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  showPlaceholder?: boolean;
  placeholderClassName?: string;
  onLoadComplete?: () => void;
  onError?: () => void;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

/**
 * Enterprise-grade OptimizedImage component
 *
 * Features:
 * - Next.js Image optimization with modern formats (WebP, AVIF)
 * - Automatic lazy loading for below-the-fold images
 * - Fallback image support for broken/missing images
 * - Loading placeholder with smooth transitions
 * - Accessibility support with proper alt text
 * - Performance optimized with proper sizing
 */
const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  (
    {
      src,
      alt,
      fallbackSrc,
      showPlaceholder = true,
      placeholderClassName,
      className,
      onLoadComplete,
      onError,
      placeholder = 'blur',
      blurDataURL,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);

    const handleLoad = () => {
      setIsLoading(false);
      onLoadComplete?.();
    };

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);

      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setHasError(false);
        setIsLoading(true);
      }

      onError?.();
    };

    return (
      <div className={cn('relative overflow-hidden', className)}>
        {/* Loading Placeholder */}
        {isLoading && showPlaceholder && (
          <div
            className={cn(
              'absolute inset-0 animate-pulse bg-muted',
              placeholderClassName
            )}
            aria-hidden="true"
          />
        )}

        {/* Optimized Image */}
        <Image
          ref={ref}
          src={currentSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            hasError && !fallbackSrc ? 'opacity-50' : ''
          )}
          // Enable blur placeholder for better UX only when specified
          placeholder={placeholder}
          blurDataURL={placeholder === 'blur' ? blurDataURL : undefined}
          {...props}
        />

        {/* Error State */}
        {hasError && !fallbackSrc && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="text-center text-muted-foreground">
              <svg
                className="mx-auto mb-2 h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs">Image unavailable</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';

export { OptimizedImage, type OptimizedImageProps };
