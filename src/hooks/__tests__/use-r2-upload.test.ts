import { renderHook, act } from '@testing-library/react';
import { useR2Upload } from '../use-r2-upload';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('useR2Upload', () => {
  const mockFile = new File(['test content'], 'test.mp4', {
    type: 'video/mp4',
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useR2Upload());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.publicUrl).toBe(null);
    expect(result.current.progress).toBe(0);
    expect(typeof result.current.uploadFile).toBe('function');
    expect(typeof result.current.reset).toBe('function');
  });

  it('should handle successful upload flow', async () => {
    const { result } = renderHook(() => useR2Upload());

    // Mock successful API responses
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          presignedUrl: 'https://presigned-url.example.com',
          publicUrl: 'https://public-url.example.com/test.mp4',
          key: 'videos/user-id/test.mp4',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
      });

    let uploadResult: string | null = null;

    await act(async () => {
      uploadResult = await result.current.uploadFile(mockFile);
    });

    // Verify final state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.publicUrl).toBe(
      'https://public-url.example.com/test.mp4'
    );
    expect(result.current.progress).toBe(100);
    expect(uploadResult).toBe('https://public-url.example.com/test.mp4');

    // Verify API calls
    expect(mockFetch).toHaveBeenCalledTimes(2);

    // First call to get presigned URL
    expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/upload/presigned-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: 'test.mp4',
        fileType: 'video/mp4',
        bucketType: 'videos',
      }),
    });

    // Second call to upload file
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      'https://presigned-url.example.com',
      {
        method: 'PUT',
        body: mockFile,
        headers: {
          'Content-Type': 'video/mp4',
        },
      }
    );
  });

  it('should handle API error when getting presigned URL', async () => {
    const { result } = renderHook(() => useR2Upload());

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Unauthorized' }),
    });

    let uploadResult: string | null = null;

    await act(async () => {
      uploadResult = await result.current.uploadFile(mockFile);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Unauthorized');
    expect(result.current.publicUrl).toBe(null);
    expect(result.current.progress).toBe(0);
    expect(uploadResult).toBe(null);
  });

  it('should handle upload error to R2', async () => {
    const { result } = renderHook(() => useR2Upload());

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          presignedUrl: 'https://presigned-url.example.com',
          publicUrl: 'https://public-url.example.com/test.mp4',
          key: 'videos/user-id/test.mp4',
        }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      });

    let uploadResult: string | null = null;

    await act(async () => {
      uploadResult = await result.current.uploadFile(mockFile);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Upload failed: 403 Forbidden');
    expect(result.current.publicUrl).toBe(null);
    expect(result.current.progress).toBe(0);
    expect(uploadResult).toBe(null);
  });

  it('should handle network errors', async () => {
    const { result } = renderHook(() => useR2Upload());

    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    let uploadResult: string | null = null;

    await act(async () => {
      uploadResult = await result.current.uploadFile(mockFile);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Network error');
    expect(result.current.publicUrl).toBe(null);
    expect(result.current.progress).toBe(0);
    expect(uploadResult).toBe(null);
  });

  it('should support custom bucket type', async () => {
    const { result } = renderHook(() => useR2Upload());

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          presignedUrl: 'https://presigned-url.example.com',
          publicUrl: 'https://public-url.example.com/test.jpg',
          key: 'images/user-id/test.jpg',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
      });

    const imageFile = new File(['image content'], 'test.jpg', {
      type: 'image/jpeg',
    });

    await act(async () => {
      await result.current.uploadFile(imageFile, { bucketType: 'images' });
    });

    expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/upload/presigned-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: 'test.jpg',
        fileType: 'image/jpeg',
        bucketType: 'images',
      }),
    });
  });

  it('should call progress callback', async () => {
    const { result } = renderHook(() => useR2Upload());
    const onProgress = jest.fn();

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          presignedUrl: 'https://presigned-url.example.com',
          publicUrl: 'https://public-url.example.com/test.mp4',
          key: 'videos/user-id/test.mp4',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
      });

    await act(async () => {
      await result.current.uploadFile(mockFile, { onProgress });
    });

    expect(onProgress).toHaveBeenCalledWith(25);
    expect(onProgress).toHaveBeenCalledWith(100);
  });

  it('should reset state correctly', () => {
    const { result } = renderHook(() => useR2Upload());

    // Manually set some state
    act(() => {
      result.current.reset();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.publicUrl).toBe(null);
    expect(result.current.progress).toBe(0);
  });
});
