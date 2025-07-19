import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getR2Client } from '@/lib/r2-client';
import { presignedUrlSchema } from '@/lib/validations';
import type { Database } from '@/types/database';

interface PresignedUrlResponse {
  presignedUrl: string;
  publicUrl: string;
  key: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('Presigned URL endpoint called');

    // Verify user authentication
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json(
        { error: 'Authentication required to upload files' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    console.log('Request body:', body);

    const validationResult = presignedUrlSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validationResult.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const { fileName, fileType, bucketType } = validationResult.data;

    // Generate unique key for the file
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = fileName.split('.').pop();
    const key = `${bucketType}/${session.user.id}/${timestamp}-${randomString}.${fileExtension}`;

    // Get bucket configuration
    const bucketName =
      bucketType === 'videos'
        ? process.env.R2_BUCKET_NAME
        : process.env.R2_IMAGES_BUCKET_NAME;

    const publicBaseUrl =
      bucketType === 'videos'
        ? process.env.R2_PUBLIC_URL
        : process.env.R2_IMAGES_PUBLIC_URL;

    if (!bucketName || !publicBaseUrl) {
      return NextResponse.json(
        { error: 'Storage configuration error' },
        { status: 500 }
      );
    }

    console.log('Creating PutObject command for bucket:', bucketName);

    // Create the PutObject command
    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: fileType,
      Metadata: {
        'uploaded-by': session.user.id,
        'original-name': fileName,
      },
    });

    console.log('Generating presigned URL...');

    // Get R2 client instance (lazy initialization)
    const r2Client = getR2Client();

    // Generate pre-signed URL (expires in 5 minutes)
    const presignedUrl = await getSignedUrl(r2Client, putObjectCommand, {
      expiresIn: 300, // 5 minutes
    });

    // Construct public URL
    const publicUrl = `${publicBaseUrl}/${key}`;

    const response: PresignedUrlResponse = {
      presignedUrl,
      publicUrl,
      key,
    };

    console.log('Presigned URL generated successfully');

    return NextResponse.json(response);
  } catch (error) {
    console.error('Presigned URL error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
