'use client';

import { useTheme } from './theme-provider';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ThemeAwareImageProps {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

/**
 * ThemeAwareImage component that displays different images based on the current theme.
 * Useful for logos, illustrations, or any assets that need different styles for light and dark backgrounds.
 * 
 * @param lightSrc - Image source for light theme
 * @param darkSrc - Image source for dark theme
 * @param alt - Alt text for accessibility
 * @param ...props - Additional Next.js Image component props
 */
export function ThemeAwareImage({
  lightSrc,
  darkSrc,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  placeholder,
  blurDataURL,
}: ThemeAwareImageProps) {
  const { resolvedTheme } = useTheme();
  const [isThemeResolved, setIsThemeResolved] = useState(false);

  // Wait for theme to be resolved to avoid flash of wrong image
  useEffect(() => {
    if (resolvedTheme) {
      setIsThemeResolved(true);
    }
  }, [resolvedTheme]);

  // Don't render anything until theme is resolved to prevent flash
  if (!isThemeResolved) {
    return (
      <div 
        className={className}
        style={{ 
          width: fill ? '100%' : width, 
          height: fill ? '100%' : height,
          backgroundColor: 'transparent'
        }}
        aria-hidden="true"
      />
    );
  }

  const imageSrc = resolvedTheme === 'dark' ? darkSrc : lightSrc;

  const imageProps = {
    src: imageSrc,
    alt,
    className,
    priority,
    sizes,
    placeholder,
    blurDataURL,
    ...(fill ? { fill: true } : { width, height }),
  };

  return <Image {...imageProps} />;
}