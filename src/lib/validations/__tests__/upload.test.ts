import { presignedUrlSchema, fileSizeSchema, uploadCompletionSchema } from '../upload';

describe('Upload Validation Schemas', () => {
  describe('presignedUrlSchema', () => {
    it('should accept valid video upload request', () => {
      const validData = {
        fileName: 'my-video.mp4',
        fileType: 'video/mp4',
        bucketType: 'videos' as const,
      };

      const result = presignedUrlSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should accept valid image upload request', () => {
      const validData = {
        fileName: 'my-image.jpg',
        fileType: 'image/jpeg',
        bucketType: 'images' as const,
      };

      const result = presignedUrlSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should default to videos bucket type', () => {
      const validData = {
        fileName: 'my-video.mp4',
        fileType: 'video/mp4',
      };

      const result = presignedUrlSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.bucketType).toBe('videos');
      }
    });

    it('should reject empty file name', () => {
      const invalidData = {
        fileName: '',
        fileType: 'video/mp4',
        bucketType: 'videos' as const,
      };

      const result = presignedUrlSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('File name is required');
      }
    });

    it('should reject file name that is too long', () => {
      const invalidData = {
        fileName: 'A'.repeat(256),
        fileType: 'video/mp4',
        bucketType: 'videos' as const,
      };

      const result = presignedUrlSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('File name is too long');
      }
    });

    it('should reject file name with invalid characters', () => {
      const invalidData = {
        fileName: 'my<video>.mp4',
        fileType: 'video/mp4',
        bucketType: 'videos' as const,
      };

      const result = presignedUrlSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('File name contains invalid characters');
      }
    });

    it('should reject invalid video file type for videos bucket', () => {
      const invalidData = {
        fileName: 'document.pdf',
        fileType: 'application/pdf',
        bucketType: 'videos' as const,
      };

      const result = presignedUrlSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('File type does not match the selected bucket type');
      }
    });

    it('should reject invalid image file type for images bucket', () => {
      const invalidData = {
        fileName: 'video.mp4',
        fileType: 'video/mp4',
        bucketType: 'images' as const,
      };

      const result = presignedUrlSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('File type does not match the selected bucket type');
      }
    });

    it('should reject invalid bucket type', () => {
      const invalidData = {
        fileName: 'file.mp4',
        fileType: 'video/mp4',
        bucketType: 'invalid' as any,
      };

      const result = presignedUrlSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Bucket type must be either "videos" or "images"');
      }
    });

    it('should accept all allowed video types', () => {
      const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
      
      videoTypes.forEach(fileType => {
        const validData = {
          fileName: `video.${fileType.split('/')[1]}`,
          fileType,
          bucketType: 'videos' as const,
        };

        const result = presignedUrlSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    it('should accept all allowed image types', () => {
      const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      
      imageTypes.forEach(fileType => {
        const validData = {
          fileName: `image.${fileType.split('/')[1]}`,
          fileType,
          bucketType: 'images' as const,
        };

        const result = presignedUrlSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('fileSizeSchema', () => {
    it('should accept valid video file size', () => {
      const validData = {
        size: 50 * 1024 * 1024, // 50MB
        type: 'video' as const,
      };

      const result = fileSizeSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept valid image file size', () => {
      const validData = {
        size: 5 * 1024 * 1024, // 5MB
        type: 'image' as const,
      };

      const result = fileSizeSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject video file that is too large', () => {
      const invalidData = {
        size: 150 * 1024 * 1024, // 150MB
        type: 'video' as const,
      };

      const result = fileSizeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('File size exceeds the maximum allowed limit');
      }
    });

    it('should reject image file that is too large', () => {
      const invalidData = {
        size: 15 * 1024 * 1024, // 15MB
        type: 'image' as const,
      };

      const result = fileSizeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('File size exceeds the maximum allowed limit');
      }
    });

    it('should reject negative file size', () => {
      const invalidData = {
        size: -1,
        type: 'video' as const,
      };

      const result = fileSizeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('File size must be positive');
      }
    });

    it('should reject zero file size', () => {
      const invalidData = {
        size: 0,
        type: 'video' as const,
      };

      const result = fileSizeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('File size must be positive');
      }
    });
  });

  describe('uploadCompletionSchema', () => {
    it('should accept valid upload completion data', () => {
      const validData = {
        key: 'videos/user-id/123456-abc.mp4',
        publicUrl: 'https://example.com/videos/user-id/123456-abc.mp4',
        originalFileName: 'my-video.mp4',
        fileSize: 50 * 1024 * 1024,
        fileType: 'video/mp4',
        bucketType: 'videos' as const,
      };

      const result = uploadCompletionSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject empty key', () => {
      const invalidData = {
        key: '',
        publicUrl: 'https://example.com/video.mp4',
        originalFileName: 'video.mp4',
        fileSize: 1024,
        fileType: 'video/mp4',
        bucketType: 'videos' as const,
      };

      const result = uploadCompletionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('File key is required');
      }
    });

    it('should reject invalid public URL', () => {
      const invalidData = {
        key: 'videos/user-id/file.mp4',
        publicUrl: 'not-a-valid-url',
        originalFileName: 'video.mp4',
        fileSize: 1024,
        fileType: 'video/mp4',
        bucketType: 'videos' as const,
      };

      const result = uploadCompletionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid public URL');
      }
    });

    it('should reject negative file size', () => {
      const invalidData = {
        key: 'videos/user-id/file.mp4',
        publicUrl: 'https://example.com/video.mp4',
        originalFileName: 'video.mp4',
        fileSize: -1,
        fileType: 'video/mp4',
        bucketType: 'videos' as const,
      };

      const result = uploadCompletionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('File size must be positive');
      }
    });
  });
});