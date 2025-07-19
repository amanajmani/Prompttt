// Mock Supabase before any imports
const mockSupabaseClient = {
  auth: {
    signIn: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
  },
  from: jest.fn(),
  rpc: jest.fn(),
};

const MockSupabaseCreateClient = jest
  .fn()
  .mockImplementation(() => mockSupabaseClient);

jest.mock('@supabase/supabase-js', () => ({
  createClient: MockSupabaseCreateClient,
}));

describe('Supabase Client', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset modules to clear singleton cache
    jest.resetModules();

    // Clear all mocks
    jest.clearAllMocks();
    MockSupabaseCreateClient.mockClear();

    // Reset environment variables
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getSupabaseClient', () => {
    it('should create Supabase client with valid environment variables', () => {
      // Arrange
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

      // Import after setting environment variables
      const { getSupabaseClient } = require('../supabase');

      // Act
      const client = getSupabaseClient();

      // Assert
      expect(client).toBeDefined();
      expect(client).toBe(mockSupabaseClient);
      expect(MockSupabaseCreateClient).toHaveBeenCalledTimes(1);
      expect(MockSupabaseCreateClient).toHaveBeenCalledWith(
        'https://test.supabase.co',
        'test-anon-key'
      );
    });

    it('should return the same instance on subsequent calls (singleton pattern)', () => {
      // Arrange
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

      // Import after setting environment variables
      const { getSupabaseClient } = require('../supabase');

      // Act
      const client1 = getSupabaseClient();
      const client2 = getSupabaseClient();

      // Assert
      expect(client1).toBe(client2);
      expect(client1).toBe(mockSupabaseClient);
      expect(MockSupabaseCreateClient).toHaveBeenCalledTimes(1); // Should only be called once
    });

    it('should throw error when NEXT_PUBLIC_SUPABASE_URL is missing', () => {
      // Arrange
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

      // Import after setting environment variables
      const { getSupabaseClient } = require('../supabase');

      // Act & Assert
      expect(() => getSupabaseClient()).toThrow(
        'Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY'
      );
    });

    it('should throw error when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing', () => {
      // Arrange
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      // Import after setting environment variables
      const { getSupabaseClient } = require('../supabase');

      // Act & Assert
      expect(() => getSupabaseClient()).toThrow(
        'Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY'
      );
    });

    it('should throw error when all environment variables are missing', () => {
      // Arrange
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      // Import after setting environment variables
      const { getSupabaseClient } = require('../supabase');

      // Act & Assert
      expect(() => getSupabaseClient()).toThrow(
        'Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY'
      );
    });

    it('should throw error when environment variables are empty strings', () => {
      // Arrange
      process.env.NEXT_PUBLIC_SUPABASE_URL = '';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '';

      // Import after setting environment variables
      const { getSupabaseClient } = require('../supabase');

      // Act & Assert
      expect(() => getSupabaseClient()).toThrow(
        'Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY'
      );
    });
  });

  describe('legacy supabase export', () => {
    it('should work with legacy supabase.client getter', () => {
      // Arrange
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

      // Import after setting environment variables
      const { supabase } = require('../supabase');

      // Act
      const client = supabase.client;

      // Assert
      expect(client).toBeDefined();
      expect(client).toBe(mockSupabaseClient);
      expect(MockSupabaseCreateClient).toHaveBeenCalledTimes(1);
    });
  });
});
