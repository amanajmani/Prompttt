import { profileOperations, videoOperations, likeOperations, commentOperations } from '../database';

// Mock the supabase client
jest.mock('../supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
          order: jest.fn(() => ({
            range: jest.fn()
          }))
        })),
        order: jest.fn(() => ({
          range: jest.fn()
        })),
        range: jest.fn(),
        single: jest.fn()
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn()
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn()
          }))
        }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn()
      }))
    })),
    rpc: jest.fn()
  }
}));

describe('Database Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('profileOperations', () => {
    it('should have getProfile method', () => {
      expect(typeof profileOperations.getProfile).toBe('function');
    });

    it('should have updateProfile method', () => {
      expect(typeof profileOperations.updateProfile).toBe('function');
    });

    it('should have createProfile method', () => {
      expect(typeof profileOperations.createProfile).toBe('function');
    });

    it('should handle getProfile with valid userId', async () => {
      const mockProfile = {
        id: 'test-user-id',
        username: 'testuser',
        avatar_url: null,
        bio: null,
        created_at: '2024-01-01T00:00:00Z'
      };

      const { supabase } = require('../supabase');
      supabase.from().select().eq().single.mockResolvedValue({
        data: mockProfile,
        error: null
      });

      const result = await profileOperations.getProfile('test-user-id');
      expect(result).toEqual(mockProfile);
    });

    it('should handle getProfile with error', async () => {
      const { supabase } = require('../supabase');
      supabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'Profile not found' }
      });

      const result = await profileOperations.getProfile('invalid-id');
      expect(result).toBeNull();
    });
  });

  describe('videoOperations', () => {
    it('should have all required methods', () => {
      expect(typeof videoOperations.getVideos).toBe('function');
      expect(typeof videoOperations.getVideoById).toBe('function');
      expect(typeof videoOperations.getUserVideos).toBe('function');
      expect(typeof videoOperations.createVideo).toBe('function');
      expect(typeof videoOperations.updateVideo).toBe('function');
      expect(typeof videoOperations.deleteVideo).toBe('function');
      expect(typeof videoOperations.incrementViewCount).toBe('function');
    });

    it('should handle getVideos with default parameters', async () => {
      const mockVideos = [
        {
          id: 'video-1',
          user_id: 'user-1',
          title: 'Test Video',
          prompt: 'Test prompt',
          model: 'test-model',
          seed: null,
          video_url: 'https://example.com/video.mp4',
          thumbnail_url: 'https://example.com/thumb.jpg',
          view_count: 0,
          created_at: '2024-01-01T00:00:00Z'
        }
      ];

      const { supabase } = require('../supabase');
      supabase.from().select().order().range.mockResolvedValue({
        data: mockVideos,
        error: null
      });

      const result = await videoOperations.getVideos();
      expect(result).toEqual(mockVideos);
    });

    it('should handle incrementViewCount', async () => {
      const { supabase } = require('../supabase');
      supabase.rpc.mockResolvedValue({
        error: null
      });

      const result = await videoOperations.incrementViewCount('video-id');
      expect(result).toBe(true);
      expect(supabase.rpc).toHaveBeenCalledWith('increment_view_count', {
        video_id: 'video-id'
      });
    });
  });

  describe('likeOperations', () => {
    it('should have all required methods', () => {
      expect(typeof likeOperations.getLikesForVideo).toBe('function');
      expect(typeof likeOperations.getUserLike).toBe('function');
      expect(typeof likeOperations.toggleLike).toBe('function');
    });

    it('should handle getLikesForVideo', async () => {
      const mockLikes = [
        {
          id: 'like-1',
          user_id: 'user-1',
          video_id: 'video-1',
          created_at: '2024-01-01T00:00:00Z'
        }
      ];

      const { supabase } = require('../supabase');
      supabase.from().select().eq.mockResolvedValue({
        data: mockLikes,
        error: null
      });

      const result = await likeOperations.getLikesForVideo('video-1');
      expect(result).toEqual(mockLikes);
    });
  });

  describe('commentOperations', () => {
    it('should have all required methods', () => {
      expect(typeof commentOperations.getCommentsForVideo).toBe('function');
      expect(typeof commentOperations.createComment).toBe('function');
      expect(typeof commentOperations.updateComment).toBe('function');
      expect(typeof commentOperations.deleteComment).toBe('function');
    });

    it('should handle getCommentsForVideo', async () => {
      const mockComments = [
        {
          id: 'comment-1',
          user_id: 'user-1',
          video_id: 'video-1',
          content: 'Great video!',
          created_at: '2024-01-01T00:00:00Z'
        }
      ];

      const { supabase } = require('../supabase');
      supabase.from().select().eq().order.mockResolvedValue({
        data: mockComments,
        error: null
      });

      const result = await commentOperations.getCommentsForVideo('video-1');
      expect(result).toEqual(mockComments);
    });

    it('should handle createComment', async () => {
      const newComment = {
        user_id: 'user-1',
        video_id: 'video-1',
        content: 'New comment'
      };

      const createdComment = {
        id: 'comment-2',
        ...newComment,
        created_at: '2024-01-01T00:00:00Z'
      };

      const { supabase } = require('../supabase');
      supabase.from().insert().select().single.mockResolvedValue({
        data: createdComment,
        error: null
      });

      const result = await commentOperations.createComment(newComment);
      expect(result).toEqual(createdComment);
    });
  });
});