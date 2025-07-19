import { z } from 'zod';

// Video title validation schema
const titleSchema = z
  .string()
  .min(1, 'Title is required')
  .max(100, 'Title must not exceed 100 characters')
  .trim();

// Video prompt validation schema
const promptSchema = z
  .string()
  .min(1, 'Prompt is required')
  .max(2000, 'Prompt must not exceed 2000 characters')
  .trim();

// AI model validation schema
const modelSchema = z
  .string()
  .min(1, 'Model is required')
  .max(50, 'Model name is too long')
  .trim();

// Seed validation schema (optional)
const seedSchema = z
  .number()
  .int('Seed must be an integer')
  .min(0, 'Seed must be a positive number')
  .max(2147483647, 'Seed value is too large')
  .optional()
  .nullable();

// Video URL validation schema
const urlSchema = z
  .string()
  .url('Must be a valid URL')
  .max(500, 'URL is too long');

// Video creation schema
export const createVideoSchema = z.object({
  title: titleSchema,
  prompt: promptSchema,
  model: modelSchema,
  seed: seedSchema,
  video_url: urlSchema,
  thumbnail_url: urlSchema,
});

// Video update schema (all fields optional except id)
export const updateVideoSchema = z.object({
  id: z.string().uuid('Invalid video ID'),
  title: titleSchema.optional(),
  prompt: promptSchema.optional(),
  model: modelSchema.optional(),
  seed: seedSchema,
  video_url: urlSchema.optional(),
  thumbnail_url: urlSchema.optional(),
});

// Video metadata schema for upload
export const videoMetadataSchema = z.object({
  title: titleSchema,
  prompt: promptSchema,
  model: modelSchema,
  seed: seedSchema,
});

// Video query parameters schema
export const videoQuerySchema = z.object({
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(100))
    .optional()
    .default('20'),
  offset: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(0))
    .optional()
    .default('0'),
  user_id: z.string().uuid().optional(),
  search: z.string().max(100).optional(),
});

// Export types for TypeScript
export type CreateVideoInput = z.infer<typeof createVideoSchema>;
export type UpdateVideoInput = z.infer<typeof updateVideoSchema>;
export type VideoMetadataInput = z.infer<typeof videoMetadataSchema>;
export type VideoQueryInput = z.infer<typeof videoQuerySchema>;
