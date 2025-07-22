'use client';

import { forwardRef, useState, useRef } from 'react';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

interface TouchOptimizedButtonProps extends ButtonProps {
  hapticFeedback?: boolean;
  touchDelay?: number;
  preventDoubleClick?: boolean;
}

/**
 * Enterprise-grade TouchOptimizedButton component
 *
 * Features:
 * - Optimized for mobile touch interactions
 * - Haptic feedback support (where available)
 * - Prevents accidental double-clicks
 * - Enhanced touch target size (minimum 44px)
 * - Improved visual feedback for touch states
 * - Performance optimized with minimal re-renders
 */
const TouchOptimizedButton = forwardRef<
  HTMLButtonElement,
  TouchOptimizedButtonProps
>(
  (
    {
      children,
      className,
      hapticFeedback = true,
      touchDelay = 0,
      preventDoubleClick = true,
      onClick,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const lastClickTime = useRef(0);
    const touchStartTime = useRef(0);

    // Haptic feedback function
    const triggerHapticFeedback = () => {
      if (!hapticFeedback || typeof window === 'undefined') return;

      try {
        // Use Vibration API for haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(10); // Short vibration
        }

        // Use Gamepad API haptic actuators if available
        if ('getGamepads' in navigator) {
          const gamepads = navigator.getGamepads();
          for (const gamepad of gamepads) {
            if (gamepad?.vibrationActuator) {
              gamepad.vibrationActuator.playEffect('dual-rumble', {
                duration: 10,
                strongMagnitude: 0.1,
                weakMagnitude: 0.1,
              });
            }
          }
        }
      } catch {
        // Haptic feedback not supported, fail silently
      }
    };

    // Handle touch start
    const handleTouchStart = () => {
      touchStartTime.current = performance.now();
      setIsPressed(true);
      triggerHapticFeedback();
    };

    // Handle touch end
    const handleTouchEnd = () => {
      setIsPressed(false);
    };

    // Handle click with optimizations
    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isProcessing) return;

      // Prevent double-click if enabled
      if (preventDoubleClick) {
        const now = Date.now();
        if (now - lastClickTime.current < 300) {
          event.preventDefault();
          return;
        }
        lastClickTime.current = now;
      }

      // Add processing state for async operations
      if (touchDelay > 0) {
        setIsProcessing(true);
        await new Promise((resolve) => setTimeout(resolve, touchDelay));
        setIsProcessing(false);
      }

      // Measure touch response time
      if (touchStartTime.current > 0) {
        const responseTime = performance.now() - touchStartTime.current;

        // Log slow touch responses in development
        if (process.env.NODE_ENV === 'development' && responseTime > 100) {
          console.warn(`Slow touch response: ${responseTime.toFixed(2)}ms`);
        }

        touchStartTime.current = 0;
      }

      onClick?.(event);
    };

    // Enhanced visual feedback classes
    const touchOptimizedClasses = cn(
      // Minimum touch target size (44px)
      'min-h-[44px] min-w-[44px]',

      // Enhanced touch feedback
      'active:scale-95 transition-transform duration-75',

      // Improved focus states for keyboard navigation
      'focus-visible:ring-2 focus-visible:ring-offset-2',

      // Touch-specific states
      isPressed && 'scale-95 brightness-90',
      isProcessing && 'opacity-70 cursor-wait',

      // Prevent text selection on touch
      'select-none',

      // Optimize for touch scrolling
      'touch-manipulation',

      className
    );

    return (
      <Button
        ref={ref}
        className={touchOptimizedClasses}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        disabled={disabled || isProcessing}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

TouchOptimizedButton.displayName = 'TouchOptimizedButton';

export { TouchOptimizedButton, type TouchOptimizedButtonProps };
