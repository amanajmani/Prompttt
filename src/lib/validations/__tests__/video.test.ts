import {
  createVideoSchema,
  updateVideoSchema,
  videoMetadataSchema,
  videoQuerySchema,
} from '../video';

describe('Video Validation Schemas', () => {
  describe('createVideoSchema', () => {
    it('should accept valid video creation data', () => {
      const validData = {
        title: 'Amazing AI Video',
        prompt: 'A beautiful sunset over mountains with flowing water',
        model: 'runway-gen2',
        seed: 12345,
        video_url: 'https://example.com/video.mp4',
        thumbnail_url: 'https://example.com/thumbnail.jpg',
      };

      const result = createVideoSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should accept null seed', () => {
      const validData = {
        title: 'Amazing AI Video',
        prompt: 'A beautiful sunset over mountains',
        model: 'runway-gen2',
        seed: null,
        video_url: 'https://example.com/video.mp4',
        thumbnail_url: 'https://example.com/thumbnail.jpg',
      };

      const result = createVideoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const invalidData = {
        title: '',
        prompt: 'A beautiful sunset',
        model: 'runway-gen2',
        seed: 12345,
        video_url: 'https://example.com/video.mp4',
        thumbnail_url: 'https://example.com/thumbnail.jpg',
      };

      const result = createVideoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Title is required');
      }
    });

    it('should reject title that is too long', () => {
      const invalidData = {
        title: 'A'.repeat(101),
        prompt: 'A beautiful sunset',
        model: 'runway-gen2',
        seed: 12345,
        video_url: 'https://example.com/video.mp4',
        thumbnail_url: 'https://example.com/thumbnail.jpg',
      };

      const result = createVideoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Title must not exceed 100 characters'
        );
      }
    });

    it('should reject prompt that is too long', () => {
      const invalidData = {
        title: 'Valid Title',
        prompt: 'A'.repeat(2001),
        model: 'runway-gen2',
        seed: 12345,
        video_url: 'https://example.com/video.mp4',
        thumbnail_url: 'https://example.com/thumbnail.jpg',
      };

      const result = createVideoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Prompt must not exceed 2000 characters'
        );
      }
    });

    it('should reject invalid URLs', () => {
      const invalidData = {
        title: 'Valid Title',
        prompt: 'Valid prompt',
        model: 'runway-gen2',
        seed: 12345,
        video_url: 'not-a-valid-url',
        thumbnail_url: 'https://example.com/thumbnail.jpg',
      };

      const result = createVideoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Must be a valid URL');
      }
    });

    it('should reject negative seed', () => {
      const invalidData = {
        title: 'Valid Title',
        prompt: 'Valid prompt',
        model: 'runway-gen2',
        seed: -1,
        video_url: 'https://example.com/video.mp4',
        thumbnail_url: 'https://example.com/thumbnail.jpg',
      };

      const result = createVideoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Seed must be a positive number'
        );
      }
    });

    it('should reject seed that is too large', () => {
      const invalidData = {
        title: 'Valid Title',
        prompt: 'Valid prompt',
        model: 'runway-gen2',
        seed: 2147483648, // Max int32 + 1
        video_url: 'https://example.com/video.mp4',
        thumbnail_url: 'https://example.com/thumbnail.jpg',
      };

      const result = createVideoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Seed value is too large');
      }
    });
  });

  describe('updateVideoSchema', () => {
    it('should accept valid update data with all fields', () => {
      const validData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Updated Title',
        prompt: 'Updated prompt',
        model: 'updated-model',
        seed: 54321,
        video_url: 'https://example.com/updated-video.mp4',
        thumbnail_url: 'https://example.com/updated-thumbnail.jpg',
      };

      const result = updateVideoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept partial update data', () => {
      const validData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Updated Title Only',
      };

      const result = updateVideoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID', () => {
      const invalidData = {
        id: 'not-a-valid-uuid',
        title: 'Updated Title',
      };

      const result = updateVideoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid video ID');
      }
    });

    it('should require id field', () => {
      const invalidData = {
        title: 'Updated Title',
      };

      const result = updateVideoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('videoMetadataSchema', () => {
    it('should accept valid metadata', () => {
      const validData = {
        title: 'Video Title',
        prompt: 'Video prompt',
        model: 'ai-model',
        seed: 12345,
      };

      const result = videoMetadataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept metadata without seed', () => {
      const validData = {
        title: 'Video Title',
        prompt: 'Video prompt',
        model: 'ai-model',
        seed: null,
      };

      const result = videoMetadataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('videoQuerySchema', () => {
    it('should accept valid query parameters', () => {
      const validData = {
        limit: '10',
        offset: '20',
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        search: 'sunset',
      };

      const result = videoQuerySchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(10);
        expect(result.data.offset).toBe(20);
      }
    });

    it('should use default values for missing parameters', () => {
      const validData = {};

      const result = videoQuerySchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(20);
        expect(result.data.offset).toBe(0);
      }
    });

    it('should reject limit that is too high', () => {
      const invalidData = {
        limit: '101',
      };

      const result = videoQuerySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject negative offset', () => {
      const invalidData = {
        offset: '-1',
      };

      const result = videoQuerySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid UUID for user_id', () => {
      const invalidData = {
        user_id: 'not-a-uuid',
      };

      const result = videoQuerySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject search query that is too long', () => {
      const invalidData = {
        search: 'A'.repeat(101),
      };

      const result = videoQuerySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
