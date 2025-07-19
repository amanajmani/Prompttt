import { getR2Client } from '../r2-client';

// Mock AWS SDK
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
  })),
}));

describe('R2 Client', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    // Clear any cached client instance
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getR2Client', () => {
    it('should create R2 client with valid environment variables', () => {
      // Arrange
      process.env.R2_ACCOUNT_ID = 'test-account-id';
      process.env.R2_ACCESS_KEY_ID = 'test-access-key';
      process.env.R2_SECRET_ACCESS_KEY = 'test-secret-key';

      // Act
      const client = getR2Client();

      // Assert
      expect(client).toBeDefined();
      expect(client.constructor.name).toBe('S3Client');
    });

    it('should return the same instance on subsequent calls (singleton pattern)', () => {
      // Arrange
      process.env.R2_ACCOUNT_ID = 'test-account-id';
      process.env.R2_ACCESS_KEY_ID = 'test-access-key';
      process.env.R2_SECRET_ACCESS_KEY = 'test-secret-key';

      // Act
      const client1 = getR2Client();
      const client2 = getR2Client();

      // Assert
      expect(client1).toBe(client2);
    });

    it('should throw error when R2_ACCOUNT_ID is missing', () => {
      // Arrange
      delete process.env.R2_ACCOUNT_ID;
      process.env.R2_ACCESS_KEY_ID = 'test-access-key';
      process.env.R2_SECRET_ACCESS_KEY = 'test-secret-key';

      // Act & Assert
      expect(() => getR2Client()).toThrow(
        'Missing required R2 environment variables: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY'
      );
    });

    it('should throw error when R2_ACCESS_KEY_ID is missing', () => {
      // Arrange
      process.env.R2_ACCOUNT_ID = 'test-account-id';
      delete process.env.R2_ACCESS_KEY_ID;
      process.env.R2_SECRET_ACCESS_KEY = 'test-secret-key';

      // Act & Assert
      expect(() => getR2Client()).toThrow(
        'Missing required R2 environment variables: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY'
      );
    });

    it('should throw error when R2_SECRET_ACCESS_KEY is missing', () => {
      // Arrange
      process.env.R2_ACCOUNT_ID = 'test-account-id';
      process.env.R2_ACCESS_KEY_ID = 'test-access-key';
      delete process.env.R2_SECRET_ACCESS_KEY;

      // Act & Assert
      expect(() => getR2Client()).toThrow(
        'Missing required R2 environment variables: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY'
      );
    });

    it('should throw error when all environment variables are missing', () => {
      // Arrange
      delete process.env.R2_ACCOUNT_ID;
      delete process.env.R2_ACCESS_KEY_ID;
      delete process.env.R2_SECRET_ACCESS_KEY;

      // Act & Assert
      expect(() => getR2Client()).toThrow(
        'Missing required R2 environment variables: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY'
      );
    });

    it('should throw error when environment variables are empty strings', () => {
      // Arrange
      process.env.R2_ACCOUNT_ID = '';
      process.env.R2_ACCESS_KEY_ID = '';
      process.env.R2_SECRET_ACCESS_KEY = '';

      // Act & Assert
      expect(() => getR2Client()).toThrow(
        'Missing required R2 environment variables: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY'
      );
    });
  });
});