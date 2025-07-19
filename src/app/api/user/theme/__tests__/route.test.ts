import { NextRequest } from 'next/server';
import { PUT, GET } from '../route';

// Mock dependencies
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn(),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('@/lib/error-handler', () => ({
  withErrorHandler: (handler: any) => handler,
}));

jest.mock('@/lib/rate-limit', () => ({
  withRateLimit: jest.fn(),
  authRateLimit: {},
}));

const mockSupabase = {
  auth: {
    getSession: jest.fn(),
  },
  from: jest.fn(),
};

const mockWithRateLimit = require('@/lib/rate-limit').withRateLimit;
const mockCreateRouteHandlerClient = require('@supabase/auth-helpers-nextjs').createRouteHandlerClient;

describe('/api/user/theme', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateRouteHandlerClient.mockReturnValue(mockSupabase);
    mockWithRateLimit.mockResolvedValue({
      success: true,
      headers: {},
    });
  });

  describe('PUT /api/user/theme', () => {
    it('should update theme preference for authenticated user', async () => {
      // Arrange
      const mockSession = {
        user: { id: 'user-123' },
      };
      
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const mockUpdate = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      });
      mockSupabase.from.mockReturnValue({
        update: mockUpdate,
      });

      const request = new NextRequest('http://localhost:3000/api/user/theme', {
        method: 'PUT',
        body: JSON.stringify({ theme: 'dark' }),
      });

      // Act
      const response = await PUT(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.message).toBe('Theme preference updated successfully');
      expect(data.theme).toBe('dark');
      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      expect(mockUpdate).toHaveBeenCalledWith({ theme_preference: 'dark' });
    });

    it('should return 401 for unauthenticated user', async () => {
      // Arrange
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const request = new NextRequest('http://localhost:3000/api/user/theme', {
        method: 'PUT',
        body: JSON.stringify({ theme: 'dark' }),
      });

      // Act
      const response = await PUT(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required to update theme preference');
    });

    it('should return 400 for invalid theme value', async () => {
      // Arrange
      const mockSession = {
        user: { id: 'user-123' },
      };
      
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const request = new NextRequest('http://localhost:3000/api/user/theme', {
        method: 'PUT',
        body: JSON.stringify({ theme: 'invalid-theme' }),
      });

      // Act
      const response = await PUT(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid theme preference');
    });

    it('should return 429 when rate limited', async () => {
      // Arrange
      mockWithRateLimit.mockResolvedValue({
        success: false,
        headers: { 'X-RateLimit-Remaining': '0' },
      });

      const request = new NextRequest('http://localhost:3000/api/user/theme', {
        method: 'PUT',
        body: JSON.stringify({ theme: 'dark' }),
      });

      // Act
      const response = await PUT(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(429);
      expect(data.error).toBe('Too many requests. Please try again later.');
    });
  });

  describe('GET /api/user/theme', () => {
    it('should return theme preference for authenticated user', async () => {
      // Arrange
      const mockSession = {
        user: { id: 'user-123' },
      };
      
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { theme_preference: 'dark' },
            error: null,
          }),
        }),
      });
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      });

      const request = new NextRequest('http://localhost:3000/api/user/theme');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.theme).toBe('dark');
      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSelect).toHaveBeenCalledWith('theme_preference');
    });

    it('should return default theme when user has no preference', async () => {
      // Arrange
      const mockSession = {
        user: { id: 'user-123' },
      };
      
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { theme_preference: null },
            error: null,
          }),
        }),
      });
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      });

      const request = new NextRequest('http://localhost:3000/api/user/theme');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.theme).toBe('system');
    });

    it('should return 401 for unauthenticated user', async () => {
      // Arrange
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const request = new NextRequest('http://localhost:3000/api/user/theme');

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required to get theme preference');
    });
  });
});