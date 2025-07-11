import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Mobile-First Container */}
      <div className="container-mobile spacing-mobile">
        {/* Header */}
        <header className="mb-8 sm:mb-12">
          <div className="flex-mobile-col justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="font-heading font-bold text-high mb-2">
                PROMPTTT
              </h1>
              <p className="text-medium">
                Design System Preview - Milestone 4
              </p>
            </div>
            <div className="flex justify-center sm:justify-end">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Design System Showcase */}
        <main className="space-y-8 sm:space-y-12">
          {/* Mobile-First Responsive Demo */}
          <section>
            <h2 className="font-heading font-bold text-high mb-4 sm:mb-6">
              Mobile-First Responsive Design
            </h2>
            <div className="grid-mobile gap-4 mb-6 sm:mb-8">
              <div className="card-mobile">
                <h3 className="font-heading font-semibold text-high mb-2">Touch-Friendly</h3>
                <p className="text-medium">44px+ touch targets for perfect mobile interaction</p>
              </div>
              <div className="card-mobile">
                <h3 className="font-heading font-semibold text-high mb-2">Responsive Typography</h3>
                <p className="text-medium">Scales from 14px mobile to 16px+ desktop</p>
              </div>
              <div className="card-mobile">
                <h3 className="font-heading font-semibold text-high mb-2">Adaptive Layout</h3>
                <p className="text-medium">1 column mobile to 4 columns desktop</p>
              </div>
            </div>
          </section>

          {/* Typography Section */}
          <section>
            <h2 className="font-heading font-bold text-high mb-4 sm:mb-6">
              Responsive Typography System
            </h2>
            <div className="space-y-4">
              <div>
                <h1 className="font-heading">H1 - Scales 30px → 40px (Satoshi Bold)</h1>
                <h2 className="font-heading">H2 - Scales 18px → 24px (Satoshi Bold)</h2>
                <h3 className="font-heading">H3 - Scales 16px → 18px (Satoshi Semibold)</h3>
                <p className="font-body text-high">Body Text - Scales 14px → 16px (Inter Normal)</p>
                <code className="font-mono text-accent">
                  Code text (JetBrains Mono, 14px → 16px)
                </code>
              </div>
            </div>
          </section>

          {/* Theme System Section */}
          <section>
            <h2 className="font-heading font-bold text-high mb-4 sm:mb-6">
              Dark/Light Theme System
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="card-mobile">
                <h3 className="font-heading font-semibold text-high mb-4">Dark Mode</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#1A1D21' }}></div>
                    <span className="font-mono text-sm text-medium">#1A1D21 - Primary BG</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#00A9FF' }}></div>
                    <span className="font-mono text-sm text-medium">#00A9FF - Accent</span>
                  </div>
                </div>
              </div>
              <div className="card-mobile">
                <h3 className="font-heading font-semibold text-high mb-4">Light Mode</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded border" style={{ backgroundColor: '#FFFFFF' }}></div>
                    <span className="font-mono text-sm text-medium">#FFFFFF - Primary BG</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#0066CC' }}></div>
                    <span className="font-mono text-sm text-medium">#0066CC - Accent</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Responsive Features */}
          <section>
            <h2 className="font-heading font-bold text-high mb-4 sm:mb-6">
              Responsive Features
            </h2>
            <div className="space-y-4">
              <div className="mobile-only card-mobile">
                <h3 className="font-heading font-semibold text-high mb-2">Mobile Only</h3>
                <p className="text-medium">This card only shows on mobile devices</p>
              </div>
              <div className="tablet-up card-mobile">
                <h3 className="font-heading font-semibold text-high mb-2">Tablet & Up</h3>
                <p className="text-medium">This card shows on tablet and desktop</p>
              </div>
              <div className="desktop-only card-mobile">
                <h3 className="font-heading font-semibold text-high mb-2">Desktop Only</h3>
                <p className="text-medium">This card only shows on desktop</p>
              </div>
            </div>
          </section>

          {/* Responsive Images System */}
          <section>
            <h2 className="font-heading font-bold text-high mb-4 sm:mb-6">
              Responsive Images System
            </h2>
            <div className="space-y-6">
              <div className="card-mobile">
                <h3 className="font-heading font-semibold text-high mb-4">Multi-Density Support</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">1x</span>
                    </div>
                    <span className="text-medium text-sm">Standard density (48×48px)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">2x</span>
                    </div>
                    <span className="text-medium text-sm">High-DPI displays (96×96px)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">3x</span>
                    </div>
                    <span className="text-medium text-sm">Ultra high-DPI (144×144px)</span>
                  </div>
                </div>
              </div>
              
              <div className="card-mobile">
                <h3 className="font-heading font-semibold text-high mb-4">Responsive Breakpoints</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-secondary-surface rounded border border-border flex items-center justify-center">
                      <span className="text-high font-mono text-xs">📱</span>
                    </div>
                    <span className="text-medium text-sm">Mobile: 320px-640px (optimized sizes)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-secondary-surface rounded border border-border flex items-center justify-center">
                      <span className="text-high font-mono text-xs">📟</span>
                    </div>
                    <span className="text-medium text-sm">Tablet: 641px-768px (medium sizes)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-secondary-surface rounded border border-border flex items-center justify-center">
                      <span className="text-high font-mono text-xs">🖥️</span>
                    </div>
                    <span className="text-medium text-sm">Desktop: 769px+ (full resolution)</span>
                  </div>
                </div>
              </div>

              <div className="card-mobile">
                <h3 className="font-heading font-semibold text-high mb-4">Image Components</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white font-bold">L</span>
                    </div>
                    <div className="text-sm font-medium text-high">LogoImage</div>
                    <div className="text-xs text-medium">Brand logos</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-secondary-surface rounded-full mx-auto mb-2 flex items-center justify-center border border-border">
                      <span className="text-high font-bold">A</span>
                    </div>
                    <div className="text-sm font-medium text-high">AvatarImage</div>
                    <div className="text-xs text-medium">User avatars</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-8 bg-secondary-surface rounded mx-auto mb-2 flex items-center justify-center border border-border">
                      <span className="text-high font-bold text-xs">🖼️</span>
                    </div>
                    <div className="text-sm font-medium text-high">CardImage</div>
                    <div className="text-xs text-medium">Content cards</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Current Theme Colors */}
          <section>
            <h2 className="font-heading font-bold text-high mb-4 sm:mb-6">
              Current Theme Colors
            </h2>
            <div className="grid-mobile gap-4">
              <div className="card-mobile" style={{ backgroundColor: 'var(--color-primary-bg)' }}>
                <div className="text-high font-mono text-sm">Primary BG</div>
                <div className="text-medium text-xs">Background</div>
              </div>
              <div className="card-mobile" style={{ backgroundColor: 'var(--color-secondary-surface)' }}>
                <div className="text-high font-mono text-sm">Secondary</div>
                <div className="text-medium text-xs">Surface</div>
              </div>
              <div className="card-mobile" style={{ backgroundColor: 'var(--color-accent)' }}>
                <div className="text-white font-mono text-sm">Accent</div>
                <div className="text-white text-xs">Interactive</div>
              </div>
              <div className="card-mobile border" style={{ borderColor: 'var(--color-border)' }}>
                <div className="text-high font-mono text-sm">Border</div>
                <div className="text-medium text-xs">Dividers</div>
              </div>
            </div>
          </section>

          {/* Status */}
          <section className="pt-6 sm:pt-8 border-t border-border">
            <div className="text-center">
              <h2 className="font-heading font-bold text-accent mb-2">
                Milestone 4: Mobile-First Responsive Foundation - COMPLETE
              </h2>
              <p className="text-medium mb-4">
                Perfect responsive design that works beautifully on every device
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-accent text-sm font-medium">Including Responsive Images Strategy</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}