import { Grid } from '@/components/ui/grid';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface VideoItem {
  id: string;
  title: string;
  thumbnail_url: string;
  video_url: string;
  prompt: string;
  model: string;
  view_count: number;
  created_at: string;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

interface VideoGridProps {
  videos?: VideoItem[];
  isLoading?: boolean;
  className?: string;
}

/**
 * Enterprise-grade VideoGrid component for AI video gallery
 *
 * Features:
 * - Responsive masonry-style layout optimized for video content
 * - Mobile-first design with optimal viewing on all devices
 * - Loading states with skeleton placeholders
 * - Accessibility support with proper ARIA labels
 * - Performance optimized with lazy loading ready structure
 */
export function VideoGrid({
  videos = [],
  isLoading = false,
  className,
}: VideoGridProps) {
  // Responsive grid configuration optimized for video content
  const gridConfig = {
    cols: {
      sm: 1, // Single column on mobile for optimal viewing
      md: 2, // Two columns on tablet
      lg: 3, // Three columns on desktop
      xl: 4, // Four columns on large desktop
      '2xl': 5, // Five columns on ultra-wide displays
    },
    gap: {
      sm: 4, // Smaller gap on mobile
      md: 6, // Medium gap on tablet
      lg: 6, // Consistent gap on desktop
      xl: 8, // Larger gap on large screens
      '2xl': 8, // Maintain gap on ultra-wide
    },
  };

  if (isLoading) {
    return (
      <Grid
        cols={gridConfig.cols}
        gap={gridConfig.gap}
        className={cn('w-full', className)}
        role="grid"
        aria-label="Loading AI video gallery"
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <VideoGridSkeleton key={index} />
        ))}
      </Grid>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 text-6xl opacity-20">🎬</div>
        <h3 className="mb-2 text-lg font-semibold">No videos found</h3>
        <p className="text-muted-foreground">
          Be the first to share your AI-generated video art!
        </p>
      </div>
    );
  }

  return (
    <Grid
      cols={gridConfig.cols}
      gap={gridConfig.gap}
      className={cn('w-full', className)}
      role="grid"
      aria-label={`AI video gallery with ${videos.length} videos`}
    >
      {videos.map((video) => (
        <VideoGridItem key={video.id} video={video} />
      ))}
    </Grid>
  );
}

/**
 * Individual video item component with optimized layout
 */
function VideoGridItem({ video }: { video: VideoItem }) {
  return (
    <Card
      className="group overflow-hidden transition-all duration-200 hover:shadow-lg"
      role="gridcell"
    >
      <CardContent className="p-0">
        {/* Video Thumbnail with Aspect Ratio */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={video.thumbnail_url}
            alt={`Thumbnail for ${video.title}`}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="rounded-full bg-white/90 p-3 shadow-lg">
              <svg
                className="h-6 w-6 text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* View Count Badge */}
          <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
            {video.view_count.toLocaleString()} views
          </div>
        </div>

        {/* Video Metadata */}
        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 font-semibold leading-tight">
            {video.title}
          </h3>

          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {video.prompt}
          </p>

          {/* Creator Info */}
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-muted">
              {video.user.avatar_url ? (
                <img
                  src={video.user.avatar_url}
                  alt={`${video.user.username}'s avatar`}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {video.user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {video.user.username}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{video.model}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Loading skeleton for video grid items
 */
function VideoGridSkeleton() {
  return (
    <Card
      className="overflow-hidden"
      role="gridcell"
      aria-label="Loading video"
    >
      <CardContent className="p-0">
        {/* Thumbnail Skeleton */}
        <Skeleton className="aspect-video w-full" />

        {/* Content Skeleton */}
        <div className="p-4">
          <Skeleton className="mb-2 h-5 w-3/4" />
          <Skeleton className="mb-3 h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />

          {/* Creator Info Skeleton */}
          <div className="mt-3 flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export {
  VideoGridItem,
  VideoGridSkeleton,
  type VideoItem,
  type VideoGridProps,
};
