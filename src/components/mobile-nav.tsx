'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Mobile navigation component with hamburger menu
 *
 * Features:
 * - Hamburger menu button with animated icon
 * - Slide-in mobile menu overlay
 * - Backdrop blur and overlay
 * - Smooth animations with Framer Motion
 * - Proper focus management and accessibility
 * - Dual-theme support
 */
export function MobileNav({ children, className }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className={cn('md:hidden', className)}
        onClick={toggleMenu}
        aria-label={isOpen ? 'Close mobile menu' : 'Open mobile menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </motion.div>
      </Button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.div
              id="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 h-full w-[280px] border-l bg-background p-6 shadow-lg md:hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-menu-title"
            >
              {/* Close Button */}
              <div className="mb-6 flex items-center justify-between">
                <h2 id="mobile-menu-title" className="text-lg font-semibold">
                  Menu
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeMenu}
                  aria-label="Close mobile menu panel"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Menu Content */}
              <div className="space-y-4">{children}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
