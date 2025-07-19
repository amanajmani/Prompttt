import { NextRequest } from 'next/server';
import { POST } from '../route';

// Mock the Supabase auth helpers
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn(),
}));

// Mock Next.js cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

// Mock AWS SDK
jest.mock('@aws-sdk/client-s3', () => ({
  PutObjectCommand: jest.fn(),
}));

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(),
}));

// Mock R2 client
jest.mock('@/lib/r2-client', () => ({
  r2Client: {},
}));

describe('/api/upload/presigned-url', () => {
  const mockSession = {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up environment variables
    process.env.R2_BUCKET_NAME = 'test-videos-bucket';
    process.env.R2_IMAGES_BUCKET_NAME = 'test-images-bucket';
    process.env.R2_PUBLIC_URL = 'https://videos.example.com';
    process.env.R2_IMAGES_PUBLIC_URL = 'https://images.example.com';
  });

  it('should return 401 when user is not authenticated', async () => {
    const { createRouteHandlerClient } = require('@supabase/auth-helpers-nextjs');
    createRouteHandlerClient.mockReturnValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: null },
          error: null,
        }),
      },
    });

    const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
      method: 'POST',
      body: JSON.stringify({
        fileName: 'test.mp4',
        fileType: 'video/mp4',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 400 when fileName or fileType is missing', async () => {
    const { createRouteHandlerClient } = require('@supabase/auth-helpers-nextjs');
    createRouteHandlerClient.mockReturnValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: mockSession },
          error: null,
        }),
      },
    });

    const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
      method: 'POST',
      body: JSON.stringify({
        fileName: 'test.mp4',
        // Missing fileType
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid request data');
    expect(data.details).toBeDefined();
    expect(Array.isArray(data.details)).toBe(true);
  });

  it('should return 400 for invalid video file type', async () => {
    const { createRouteHandlerClient } = require('@supabase/auth-helpers-nextjs');
    createRouteHandlerClient.mockReturnValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: mockSession },
          error: null,
        }),
      },
    });

    const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
      method: 'POST',
      body: JSON.stringify({
        fileName: 'test.txt',
        fileType: 'text/plain',
        bucketType: 'videos',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid request data');
    expect(data.details).toBeDefined();
  });

  it('should return 400 for invalid image file type', async () => {
    const { createRouteHandlerClient } = require('@supabase/auth-helpers-nextjs');
    createRouteHandlerClient.mockReturnValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: mockSession },
          error: null,
        }),
      },
    });

    const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
      method: 'POST',
      body: JSON.stringify({
        fileName: 'test.txt',
        fileType: 'text/plain',
        bucketType: 'images',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid request data');
    expect(data.details).toBeDefined();
  });

  it('should generate presigned URL for valid video upload', async () => {
    const { createRouteHandlerClient } = require('@supabase/auth-helpers-nextjs');
    const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
    
    createRouteHandlerClient.mockReturnValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: mockSession },
          error: null,
        }),
      },
    });

    getSignedUrl.mockResolvedValue('https://presigned-url.example.com');

    const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
      method: 'POST',
      body: JSON.stringify({
        fileName: 'test-video.mp4',
        fileType: 'video/mp4',
        bucketType: 'videos',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.presignedUrl).toBe('https://presigned-url.example.com');
    expect(data.publicUrl).toContain('https://videos.example.com/videos/test-user-id/');
    expect(data.publicUrl).toContain('.mp4');
    expect(data.key).toContain('videos/test-user-id/');
    expect(data.key).toContain('.mp4');
  });

  it('should generate presigned URL for valid image upload', async () => {
    const { createRouteHandlerClient } = require('@supabase/auth-helpers-nextjs');
    const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
    
    createRouteHandlerClient.mockReturnValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: mockSession },
          error: null,
        }),
      },
    });

    getSignedUrl.mockResolvedValue('https://presigned-url.example.com');

    const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
      method: 'POST',
      body: JSON.stringify({
        fileName: 'test-image.jpg',
        fileType: 'image/jpeg',
        bucketType: 'images',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.presignedUrl).toBe('https://presigned-url.example.com');
    expect(data.publicUrl).toContain('https://images.example.com/images/test-user-id/');
    expect(data.publicUrl).toContain('.jpg');
    expect(data.key).toContain('images/test-user-id/');
    expect(data.key).toContain('.jpg');
  });

  it('should handle server errors gracefully', async () => {
    const { createRouteHandlerClient } = require('@supabase/auth-helpers-nextjs');
    
    createRouteHandlerClient.mockReturnValue({
      auth: {
        getSession: jest.fn().mockRejectedValue(new Error('Database error')),
      },
    });

    const request = new NextRequest('http://localhost:3000/api/upload/presigned-url', {
      method: 'POST',
      body: JSON.stringify({
        fileName: 'test.mp4',
        fileType: 'video/mp4',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});