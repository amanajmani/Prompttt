import { z } from 'zod';

// Password validation schema with complexity requirements
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must not exceed 128 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );

// Username validation schema
const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters long')
  .max(30, 'Username must not exceed 30 characters')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Username can only contain letters, numbers, underscores, and hyphens'
  );

// Email validation schema
const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .max(254, 'Email address is too long');

// Signup validation schema
export const signupSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

// Login validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, 'Password is required')
    .max(128, 'Password is too long'),
});

// Password reset request schema
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

// Password reset schema
export const passwordResetSchema = z.object({
  password: passwordSchema,
  token: z.string().min(1, 'Reset token is required'),
});

// Export types for TypeScript
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;