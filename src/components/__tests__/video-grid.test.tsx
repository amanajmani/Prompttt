import { render, screen } from '@testing-library/react';
import { VideoGrid, type VideoItem } from '../video-grid';

const mockVideos: VideoItem[] = [
  {
    id: '1',
    title: 'Amazing AI Animation',
    thumbnail_url: 'https://example.com/thumb1.jpg',
    video_url: 'https://example.com/video1.mp4',
    prompt: 'A beautiful sunset over mountains',
    model: 'Runway ML',
    view_count: 1250,
    created_at: '2024-01-01T00:00:00Z',
    user: {
      id: 'user1',
      username: 'creator1',
      avatar_url: 'https://example.com/avatar1.jpg',
    },
  },
  {
    id: '2',
    title: 'Futuristic City Scene',
    thumbnail_url: 'https://example.com/thumb2.jpg',
    video_url: 'https://example.com/video2.mp4',
    prompt: 'A cyberpunk cityscape at night',
    model: 'Stable Video',
    view_count: 890,
    created_at: '2024-01-02T00:00:00Z',
    user: {
      id: 'user2',
      username: 'artist2',
    },
  },
];

describe('VideoGrid', () => {
  it('renders videos correctly', () => {
    render(<VideoGrid videos={mockVideos} />);

    expect(screen.getByText('Amazing AI Animation')).toBeInTheDocument();
    expect(screen.getByText('Futuristic City Scene')).toBeInTheDocument();
    expect(
      screen.getByText('A beautiful sunset over mountains')
    ).toBeInTheDocument();
    expect(
      screen.getByText('A cyberpunk cityscape at night')
    ).toBeInTheDocument();
  });

  it('displays video metadata correctly', () => {
    render(<VideoGrid videos={mockVideos} />);

    expect(screen.getByText('creator1')).toBeInTheDocument();
    expect(screen.getByText('artist2')).toBeInTheDocument();
    expect(screen.getByText('Runway ML')).toBeInTheDocument();
    expect(screen.getByText('Stable Video')).toBeInTheDocument();
    expect(screen.getByText('1,250 views')).toBeInTheDocument();
    expect(screen.getByText('890 views')).toBeInTheDocument();
  });

  it('renders loading state with skeletons', () => {
    render(<VideoGrid isLoading={true} />);

    const grid = screen.getByRole('grid');
    expect(grid).toHaveAttribute('aria-label', 'Loading AI video gallery');

    // Should render 12 skeleton items
    const skeletonItems = screen.getAllByRole('gridcell');
    expect(skeletonItems).toHaveLength(12);
  });

  it('renders empty state when no videos', () => {
    render(<VideoGrid videos={[]} />);

    expect(screen.getByText('No videos found')).toBeInTheDocument();
    expect(
      screen.getByText('Be the first to share your AI-generated video art!')
    ).toBeInTheDocument();
  });

  it('applies correct ARIA labels', () => {
    render(<VideoGrid videos={mockVideos} />);

    const grid = screen.getByRole('grid');
    expect(grid).toHaveAttribute(
      'aria-label',
      'AI video gallery with 2 videos'
    );
  });

  it('renders video thumbnails with correct alt text', () => {
    render(<VideoGrid videos={mockVideos} />);

    const thumbnail1 = screen.getByAltText(
      'Thumbnail for Amazing AI Animation'
    );
    const thumbnail2 = screen.getByAltText(
      'Thumbnail for Futuristic City Scene'
    );

    expect(thumbnail1).toBeInTheDocument();
    expect(thumbnail2).toBeInTheDocument();
    expect(thumbnail1).toHaveAttribute('src', 'https://example.com/thumb1.jpg');
    expect(thumbnail2).toHaveAttribute('src', 'https://example.com/thumb2.jpg');
  });

  it('renders user avatars correctly', () => {
    render(<VideoGrid videos={mockVideos} />);

    const avatar1 = screen.getByAltText("creator1's avatar");
    expect(avatar1).toBeInTheDocument();
    expect(avatar1).toHaveAttribute('src', 'https://example.com/avatar1.jpg');

    // Second user has no avatar, should show initials
    expect(screen.getByText('A')).toBeInTheDocument(); // First letter of 'artist2'
  });

  it('applies custom className', () => {
    render(<VideoGrid videos={mockVideos} className="custom-grid-class" />);

    const grid = screen.getByRole('grid');
    expect(grid).toHaveClass('custom-grid-class');
  });

  it('handles lazy loading attributes', () => {
    render(<VideoGrid videos={mockVideos} />);

    const thumbnails = screen.getAllByRole('img');
    thumbnails.forEach((img) => {
      if (img.getAttribute('alt')?.includes('Thumbnail')) {
        expect(img).toHaveAttribute('loading', 'lazy');
      }
    });
  });
});
