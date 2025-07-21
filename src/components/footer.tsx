'use client';

import Link from 'next/link';
import { Container } from '@/components';

/**
 * Site footer component
 *
 * Features:
 * - Responsive layout with proper spacing
 * - Navigation links organized by category
 * - Copyright and legal information
 * - Social media links (placeholder for future)
 * - Dual-theme support
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <Container>
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Brand Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">AI VideoHub</h3>
              <p className="text-sm text-muted-foreground">
                The definitive, curated gallery for the world&apos;s best
                AI-generated video art.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/gallery"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Account</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/login"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 border-t pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-muted-foreground">
                &copy; {currentYear} AI VideoHub. All rights reserved.
              </p>
              <p className="text-sm text-muted-foreground">
                Built with obsessive craft, layer by layer.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
