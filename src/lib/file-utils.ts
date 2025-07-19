export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo', // .avi
] as const;

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

export const MAX_FILE_SIZE = {
  VIDEO: 100 * 1024 * 1024, // 100MB
  IMAGE: 10 * 1024 * 1024,  // 10MB
} as const;

export function isValidVideoType(fileType: string): boolean {
  return ALLOWED_VIDEO_TYPES.includes(fileType as any);
}

export function isValidImageType(fileType: string): boolean {
  return ALLOWED_IMAGE_TYPES.includes(fileType as any);
}

export function isValidFileSize(file: File, type: 'video' | 'image'): boolean {
  const maxSize = type === 'video' ? MAX_FILE_SIZE.VIDEO : MAX_FILE_SIZE.IMAGE;
  return file.size <= maxSize;
}

export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

export function generateUniqueFileName(originalName: string, userId: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = getFileExtension(originalName);
  return `${userId}/${timestamp}-${randomString}.${extension}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function detectBucketType(file: File): 'videos' | 'images' {
  if (file.type.startsWith('image/')) {
    return 'images';
  } else if (file.type.startsWith('video/')) {
    return 'videos';
  }
  
  // Fallback based on file extension
  const extension = getFileExtension(file.name);
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const videoExtensions = ['mp4', 'webm', 'mov', 'avi'];
  
  if (imageExtensions.includes(extension)) {
    return 'images';
  } else if (videoExtensions.includes(extension)) {
    return 'videos';
  }
  
  return 'videos'; // Default fallback
}