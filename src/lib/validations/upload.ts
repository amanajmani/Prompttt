import { z } from 'zod';
import { ALLOWED_VIDEO_TYPES, ALLOWED_IMAGE_TYPES } from '@/lib/file-utils';

// File name validation schema
const fileNameSchema = z
  .string()
  .min(1, 'File name is required')
  .max(255, 'File name is too long')
  .regex(/^[^<>:"/\\|?*]+$/, 'File name contains invalid characters');

// File type validation schemas
const videoFileTypeSchema = z
  .string()
  .refine(
    (type) => ALLOWED_VIDEO_TYPES.includes(type as any),
    'Invalid video file type. Supported formats: MP4, WebM, QuickTime, AVI'
  );

const imageFileTypeSchema = z
  .string()
  .refine(
    (type) => ALLOWED_IMAGE_TYPES.includes(type as any),
    'Invalid image file type. Supported formats: JPEG, PNG, WebP, GIF'
  );

// Bucket type validation schema
const bucketTypeSchema = z.enum(['videos', 'images'], {
  errorMap: () => ({ message: 'Bucket type must be either "videos" or "images"' }),
});

// Pre-signed URL request schema
export const presignedUrlSchema = z.object({
  fileName: fileNameSchema,
  fileType: z.string().min(1, 'File type is required'),
  bucketType: bucketTypeSchema.default('videos'),
}).refine(
  (data) => {
    if (data.bucketType === 'videos') {
      return ALLOWED_VIDEO_TYPES.includes(data.fileType as any);
    } else {
      return ALLOWED_IMAGE_TYPES.includes(data.fileType as any);
    }
  },
  {
    message: 'File type does not match the selected bucket type',
    path: ['fileType'],
  }
);

// File size validation schema
export const fileSizeSchema = z.object({
  size: z.number().positive('File size must be positive'),
  type: z.enum(['video', 'image']),
}).refine(
  (data) => {
    const maxSize = data.type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB for videos, 10MB for images
    return data.size <= maxSize;
  },
  {
    message: 'File size exceeds the maximum allowed limit',
    path: ['size'],
  }
);

// Upload completion schema
export const uploadCompletionSchema = z.object({
  key: z.string().min(1, 'File key is required'),
  publicUrl: z.string().url('Invalid public URL'),
  originalFileName: fileNameSchema,
  fileSize: z.number().positive('File size must be positive'),
  fileType: z.string().min(1, 'File type is required'),
  bucketType: bucketTypeSchema,
});

// Export types for TypeScript
export type PresignedUrlInput = z.infer<typeof presignedUrlSchema>;
export type FileSizeInput = z.infer<typeof fileSizeSchema>;
export type UploadCompletionInput = z.infer<typeof uploadCompletionSchema>;