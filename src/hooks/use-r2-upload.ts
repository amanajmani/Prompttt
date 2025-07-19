import { useState, useCallback } from 'react';

export interface UploadState {
  isLoading: boolean;
  error: string | null;
  publicUrl: string | null;
  progress: number;
}

export interface UploadOptions {
  bucketType?: 'videos' | 'images';
  onProgress?: (progress: number) => void;
}

interface PresignedUrlResponse {
  presignedUrl: string;
  publicUrl: string;
  key: string;
}

export function useR2Upload() {
  const [state, setState] = useState<UploadState>({
    isLoading: false,
    error: null,
    publicUrl: null,
    progress: 0,
  });

  const uploadFile = useCallback(async (
    file: File,
    options: UploadOptions = {}
  ): Promise<string | null> => {
    const { bucketType = 'videos', onProgress } = options;

    setState({
      isLoading: true,
      error: null,
      publicUrl: null,
      progress: 0,
    });

    try {
      // Step 1: Get pre-signed URL from our API
      const presignedResponse = await fetch('/api/upload/presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          bucketType,
        }),
      });

      if (!presignedResponse.ok) {
        const errorData = await presignedResponse.json();
        throw new Error(errorData.error || 'Failed to get upload URL');
      }

      const { presignedUrl, publicUrl }: PresignedUrlResponse = await presignedResponse.json();

      setState(prev => ({ ...prev, progress: 25 }));
      onProgress?.(25);

      // Step 2: Upload file directly to R2 using pre-signed URL
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
      }

      setState(prev => ({ ...prev, progress: 100 }));
      onProgress?.(100);

      // Step 3: Update state with success
      setState({
        isLoading: false,
        error: null,
        publicUrl,
        progress: 100,
      });

      return publicUrl;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      setState({
        isLoading: false,
        error: errorMessage,
        publicUrl: null,
        progress: 0,
      });

      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      publicUrl: null,
      progress: 0,
    });
  }, []);

  return {
    uploadFile,
    reset,
    isLoading: state.isLoading,
    error: state.error,
    publicUrl: state.publicUrl,
    progress: state.progress,
  };
}