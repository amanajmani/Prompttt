import { signupSchema, loginSchema, passwordResetRequestSchema, passwordResetSchema } from '../auth';

describe('Auth Validation Schemas', () => {
  describe('signupSchema', () => {
    it('should accept valid signup data', () => {
      const validData = {
        username: 'testuser123',
        email: 'test@example.com',
        password: 'SecurePass123!',
      };

      const result = signupSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject invalid username - too short', () => {
      const invalidData = {
        username: 'ab',
        email: 'test@example.com',
        password: 'SecurePass123!',
      };

      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Username must be at least 3 characters long');
      }
    });

    it('should reject invalid username - too long', () => {
      const invalidData = {
        username: 'a'.repeat(31),
        email: 'test@example.com',
        password: 'SecurePass123!',
      };

      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Username must not exceed 30 characters');
      }
    });

    it('should reject invalid username - special characters', () => {
      const invalidData = {
        username: 'test@user',
        email: 'test@example.com',
        password: 'SecurePass123!',
      };

      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Username can only contain letters, numbers, underscores, and hyphens');
      }
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'SecurePass123!',
      };

      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address');
      }
    });

    it('should reject weak password - too short', () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'weak',
      };

      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 8 characters long');
      }
    });

    it('should reject weak password - missing complexity', () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'simplepassword',
      };

      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Password must contain at least one uppercase letter');
      }
    });

    it('should accept valid username with underscores and hyphens', () => {
      const validData = {
        username: 'test_user-123',
        email: 'test@example.com',
        password: 'SecurePass123!',
      };

      const result = signupSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('loginSchema', () => {
    it('should accept valid login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'anypassword',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address');
      }
    });

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password is required');
      }
    });

    it('should reject missing fields', () => {
      const invalidData = {};

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(2);
      }
    });
  });

  describe('passwordResetRequestSchema', () => {
    it('should accept valid email', () => {
      const validData = {
        email: 'test@example.com',
      };

      const result = passwordResetRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
      };

      const result = passwordResetRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('passwordResetSchema', () => {
    it('should accept valid reset data', () => {
      const validData = {
        password: 'NewSecurePass123!',
        token: 'valid-reset-token',
      };

      const result = passwordResetSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject weak password', () => {
      const invalidData = {
        password: 'weak',
        token: 'valid-token',
      };

      const result = passwordResetSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing token', () => {
      const invalidData = {
        password: 'NewSecurePass123!',
        token: '',
      };

      const result = passwordResetSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Reset token is required');
      }
    });
  });
});