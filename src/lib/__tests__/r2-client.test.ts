// Mock AWS SDK before any imports
const mockS3Client = {
  send: jest.fn(),
};

const MockS3ClientConstructor = jest
  .fn()
  .mockImplementation(() => mockS3Client);

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: MockS3ClientConstructor,
}));

describe('R2 Client', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset modules to clear singleton cache
    jest.resetModules();

    // Clear all mocks
    jest.clearAllMocks();
    MockS3ClientConstructor.mockClear();

    // Reset environment variables
    process.env = { ...originalEnv };
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

      // Import after setting environment variables
      const { getR2Client } = require('../r2-client');

      // Act
      const client = getR2Client();

      // Assert
      expect(client).toBeDefined();
      expect(client).toBe(mockS3Client);
      expect(MockS3ClientConstructor).toHaveBeenCalledTimes(1);
      expect(MockS3ClientConstructor).toHaveBeenCalledWith({
        region: 'auto',
        endpoint: 'https://test-account-id.r2.cloudflarestorage.com',
        credentials: {
          accessKeyId: 'test-access-key',
          secretAccessKey: 'test-secret-key',
        },
      });
    });

    it('should return the same instance on subsequent calls (singleton pattern)', () => {
      // Arrange
      process.env.R2_ACCOUNT_ID = 'test-account-id';
      process.env.R2_ACCESS_KEY_ID = 'test-access-key';
      process.env.R2_SECRET_ACCESS_KEY = 'test-secret-key';

      // Import after setting environment variables
      const { getR2Client } = require('../r2-client');

      // Act
      const client1 = getR2Client();
      const client2 = getR2Client();

      // Assert
      expect(client1).toBe(client2);
      expect(client1).toBe(mockS3Client);
      expect(MockS3ClientConstructor).toHaveBeenCalledTimes(1); // Should only be called once
    });

    it('should throw error when R2_ACCOUNT_ID is missing', () => {
      // Arrange
      delete process.env.R2_ACCOUNT_ID;
      process.env.R2_ACCESS_KEY_ID = 'test-access-key';
      process.env.R2_SECRET_ACCESS_KEY = 'test-secret-key';

      // Import after setting environment variables
      const { getR2Client } = require('../r2-client');

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

      // Import after setting environment variables
      const { getR2Client } = require('../r2-client');

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

      // Import after setting environment variables
      const { getR2Client } = require('../r2-client');

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

      // Import after setting environment variables
      const { getR2Client } = require('../r2-client');

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

      // Import after setting environment variables
      const { getR2Client } = require('../r2-client');

      // Act & Assert
      expect(() => getR2Client()).toThrow(
        'Missing required R2 environment variables: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY'
      );
    });
  });
});
