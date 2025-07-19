import {
  isValidVideoType,
  isValidImageType,
  isValidFileSize,
  getFileExtension,
  generateUniqueFileName,
  formatFileSize,
  detectBucketType,
} from '../file-utils';

describe('file-utils', () => {
  describe('isValidVideoType', () => {
    it('should return true for valid video types', () => {
      expect(isValidVideoType('video/mp4')).toBe(true);
      expect(isValidVideoType('video/webm')).toBe(true);
      expect(isValidVideoType('video/quicktime')).toBe(true);
      expect(isValidVideoType('video/x-msvideo')).toBe(true);
    });

    it('should return false for invalid video types', () => {
      expect(isValidVideoType('image/jpeg')).toBe(false);
      expect(isValidVideoType('text/plain')).toBe(false);
      expect(isValidVideoType('application/pdf')).toBe(false);
    });
  });

  describe('isValidImageType', () => {
    it('should return true for valid image types', () => {
      expect(isValidImageType('image/jpeg')).toBe(true);
      expect(isValidImageType('image/png')).toBe(true);
      expect(isValidImageType('image/webp')).toBe(true);
      expect(isValidImageType('image/gif')).toBe(true);
    });

    it('should return false for invalid image types', () => {
      expect(isValidImageType('video/mp4')).toBe(false);
      expect(isValidImageType('text/plain')).toBe(false);
      expect(isValidImageType('application/pdf')).toBe(false);
    });
  });

  describe('isValidFileSize', () => {
    it('should validate video file sizes correctly', () => {
      const smallFile = new File([''], 'test.mp4', { type: 'video/mp4' });
      Object.defineProperty(smallFile, 'size', { value: 50 * 1024 * 1024 }); // 50MB

      const largeFile = new File([''], 'test.mp4', { type: 'video/mp4' });
      Object.defineProperty(largeFile, 'size', { value: 150 * 1024 * 1024 }); // 150MB

      expect(isValidFileSize(smallFile, 'video')).toBe(true);
      expect(isValidFileSize(largeFile, 'video')).toBe(false);
    });

    it('should validate image file sizes correctly', () => {
      const smallFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(smallFile, 'size', { value: 5 * 1024 * 1024 }); // 5MB

      const largeFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(largeFile, 'size', { value: 15 * 1024 * 1024 }); // 15MB

      expect(isValidFileSize(smallFile, 'image')).toBe(true);
      expect(isValidFileSize(largeFile, 'image')).toBe(false);
    });
  });

  describe('getFileExtension', () => {
    it('should extract file extensions correctly', () => {
      expect(getFileExtension('test.mp4')).toBe('mp4');
      expect(getFileExtension('image.jpeg')).toBe('jpeg');
      expect(getFileExtension('document.pdf')).toBe('pdf');
      expect(getFileExtension('file.with.multiple.dots.txt')).toBe('txt');
    });

    it('should handle files without extensions', () => {
      expect(getFileExtension('filename')).toBe('');
      expect(getFileExtension('')).toBe('');
    });

    it('should return lowercase extensions', () => {
      expect(getFileExtension('TEST.MP4')).toBe('mp4');
      expect(getFileExtension('Image.JPEG')).toBe('jpeg');
    });
  });

  describe('generateUniqueFileName', () => {
    it('should generate unique filenames with correct format', () => {
      const originalName = 'test-video.mp4';
      const userId = 'user-123';

      const fileName1 = generateUniqueFileName(originalName, userId);
      const fileName2 = generateUniqueFileName(originalName, userId);

      expect(fileName1).toMatch(/^user-123\/\d+-[a-z0-9]+\.mp4$/);
      expect(fileName2).toMatch(/^user-123\/\d+-[a-z0-9]+\.mp4$/);
      expect(fileName1).not.toBe(fileName2);
    });

    it('should preserve file extensions', () => {
      expect(generateUniqueFileName('test.jpg', 'user-1')).toMatch(/\.jpg$/);
      expect(generateUniqueFileName('video.webm', 'user-1')).toMatch(/\.webm$/);
    });
  });

  describe('formatFileSize', () => {
    it('should format file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });
  });

  describe('detectBucketType', () => {
    it('should detect video files correctly', () => {
      const videoFile = new File([''], 'test.mp4', { type: 'video/mp4' });
      expect(detectBucketType(videoFile)).toBe('videos');
    });

    it('should detect image files correctly', () => {
      const imageFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      expect(detectBucketType(imageFile)).toBe('images');
    });

    it('should fallback to extension detection', () => {
      const videoFile = new File([''], 'test.mp4', { type: '' });
      const imageFile = new File([''], 'test.jpg', { type: '' });

      expect(detectBucketType(videoFile)).toBe('videos');
      expect(detectBucketType(imageFile)).toBe('images');
    });

    it('should default to videos for unknown types', () => {
      const unknownFile = new File([''], 'test.unknown', {
        type: 'application/unknown',
      });
      expect(detectBucketType(unknownFile)).toBe('videos');
    });
  });
});
