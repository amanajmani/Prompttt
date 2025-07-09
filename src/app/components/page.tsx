'use client'

import { 
  Button, 
  PrimaryButton, 
  SecondaryButton, 
  OutlineButton, 
  GhostButton,
  Input,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  VideoCard,
  LoadingSpinner,
  Skeleton,
  VideoCardSkeleton,
  ProfileSkeleton,
  VideoGridSkeleton,
  ThemeToggle
} from '@/components/ui'
import { Search, Heart, Upload, Download } from 'lucide-react'

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
            <div className="text-center sm:text-left">
              <h1 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-high mb-2">
                Component Library
              </h1>
              <p className="text-medium text-sm sm:text-base lg:text-lg">
                Milestone 5: Mobile-First Component Foundation
              </p>
            </div>
            <div className="flex justify-center sm:justify-end">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="space-y-8 sm:space-y-12 lg:space-y-16">
          {/* Button Components */}
          <section>
            <h2 className="font-heading font-bold text-2xl text-high mb-6">
              Button Components
            </h2>
            
            <div className="space-y-8">
              {/* Button Variants */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-high mb-4">Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <PrimaryButton>Primary</PrimaryButton>
                  <SecondaryButton>Secondary</SecondaryButton>
                  <OutlineButton>Outline</OutlineButton>
                  <GhostButton>Ghost</GhostButton>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>

              {/* Button Sizes */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-high mb-4">Sizes</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </div>

              {/* Button States */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-high mb-4">States</h3>
                <div className="flex flex-wrap gap-4">
                  <Button leftIcon={<Upload size={16} />}>With Icon</Button>
                  <Button rightIcon={<Download size={16} />}>Right Icon</Button>
                  <Button isLoading loadingText="Uploading...">Loading</Button>
                  <Button disabled>Disabled</Button>
                  <Button fullWidth>Full Width</Button>
                </div>
              </div>
            </div>
          </section>

          {/* Input Components */}
          <section>
            <h2 className="font-heading font-bold text-2xl text-high mb-6">
              Input Components
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  hint="We'll never share your email"
                />
                
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                />
                
                <Input
                  label="Search"
                  placeholder="Search videos..."
                  leftIcon={<Search size={16} />}
                />
                
                <Input
                  label="With Error"
                  placeholder="Invalid input"
                  error="This field is required"
                />
                
                <Input
                  label="Success State"
                  placeholder="Valid input"
                  success="Looks good!"
                />
              </div>
              
              <div className="space-y-6">
                <Textarea
                  label="Video Description"
                  placeholder="Describe your AI-generated video..."
                  hint="Include details about the prompt and model used"
                />
                
                <Input
                  label="Loading State"
                  placeholder="Processing..."
                  isLoading
                />
              </div>
            </div>
          </section>

          {/* Card Components */}
          <section>
            <h2 className="font-heading font-bold text-2xl text-high mb-6">
              Card Components
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Basic Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Card</CardTitle>
                  <CardDescription>
                    A simple card with header and content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-medium">
                    This is the card content area where you can put any information.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm">Action</Button>
                </CardFooter>
              </Card>

              {/* Elevated Card */}
              <Card variant="elevated" interactive>
                <CardHeader>
                  <CardTitle>Interactive Card</CardTitle>
                  <CardDescription>
                    Click me! I have hover effects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-medium">
                    This card responds to user interaction with smooth animations.
                  </p>
                </CardContent>
              </Card>

              {/* Outlined Card */}
              <Card variant="outlined">
                <CardHeader>
                  <CardTitle>Outlined Card</CardTitle>
                  <CardDescription>
                    Minimal style with border
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-medium">
                    <Heart size={16} />
                    <span>Liked by 1,234 users</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Video Cards */}
            <div>
              <h3 className="font-heading font-semibold text-lg text-high mb-4">Video Cards</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <VideoCard
                  title="Cyberpunk City at Night"
                  creator="AI_Artist_Pro"
                  thumbnail="https://picsum.photos/400/225?random=1"
                  duration="0:45"
                  views={12500}
                  likes={892}
                  onPlay={() => console.log('Play video')}
                  onLike={() => console.log('Like video')}
                />
                
                <VideoCard
                  title="Abstract Fluid Dynamics"
                  creator="CreativeAI"
                  thumbnail="https://picsum.photos/400/225?random=2"
                  duration="1:20"
                  views={8300}
                  likes={654}
                  isLiked
                  onPlay={() => console.log('Play video')}
                  onLike={() => console.log('Unlike video')}
                />
                
                <VideoCard
                  title="Dreamy Landscape Morphing"
                  creator="DigitalDreamer"
                  thumbnail="https://picsum.photos/400/225?random=3"
                  duration="2:15"
                  views={15600}
                  likes={1203}
                  onPlay={() => console.log('Play video')}
                  onLike={() => console.log('Like video')}
                />
              </div>
            </div>
          </section>

          {/* Loading Components */}
          <section>
            <h2 className="font-heading font-bold text-2xl text-high mb-6">
              Loading Components
            </h2>
            
            <div className="space-y-8">
              {/* Loading Spinners */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-high mb-4">Loading Spinners</h3>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <LoadingSpinner size="sm" />
                    <p className="text-xs text-medium mt-2">Small</p>
                  </div>
                  <div className="text-center">
                    <LoadingSpinner size="md" />
                    <p className="text-xs text-medium mt-2">Medium</p>
                  </div>
                  <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="text-xs text-medium mt-2">Large</p>
                  </div>
                  <div className="text-center">
                    <LoadingSpinner size="xl" />
                    <p className="text-xs text-medium mt-2">Extra Large</p>
                  </div>
                </div>
              </div>

              {/* Skeleton Loading */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-high mb-4">Skeleton Loading</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-medium mb-3">Video Card Skeleton</h4>
                    <VideoCardSkeleton />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-medium mb-3">Profile Skeleton</h4>
                    <Card>
                      <CardContent>
                        <ProfileSkeleton />
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-medium mb-3">Text Skeleton</h4>
                    <Card>
                      <CardContent>
                        <div className="space-y-4">
                          <Skeleton variant="text" lines={3} />
                          <div className="flex gap-2">
                            <Skeleton variant="rectangular" width="80px" height="32px" />
                            <Skeleton variant="rectangular" width="100px" height="32px" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Grid Skeleton */}
              <div>
                <h3 className="font-heading font-semibold text-lg text-high mb-4">Grid Skeleton</h3>
                <VideoGridSkeleton count={6} columns={3} />
              </div>
            </div>
          </section>

          {/* Status */}
          <section className="pt-8 border-t border-border">
            <div className="text-center">
              <h2 className="font-heading font-bold text-accent mb-2">
                Milestone 5: Component Library Foundation - COMPLETE
              </h2>
              <p className="text-medium">
                Professional, mobile-first component library ready for AI VideoHub features
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}