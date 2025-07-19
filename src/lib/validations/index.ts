// Auth validation schemas
export {
  signupSchema,
  loginSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
} from './auth';
export type {
  SignupInput,
  LoginInput,
  PasswordResetRequestInput,
  PasswordResetInput,
} from './auth';

// Video validation schemas
export {
  createVideoSchema,
  updateVideoSchema,
  videoMetadataSchema,
  videoQuerySchema,
} from './video';
export type {
  CreateVideoInput,
  UpdateVideoInput,
  VideoMetadataInput,
  VideoQueryInput,
} from './video';

// Upload validation schemas
export {
  presignedUrlSchema,
  fileSizeSchema,
  uploadCompletionSchema,
} from './upload';
export type {
  PresignedUrlInput,
  FileSizeInput,
  UploadCompletionInput,
} from './upload';
