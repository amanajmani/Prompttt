import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    console.log('Simple upload test called');

    // Test auth
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Test request parsing
    const body = await request.json();
    console.log('Request body:', body);

    // Test environment variables
    const envCheck = {
      hasR2AccountId: !!process.env.R2_ACCOUNT_ID,
      hasR2AccessKey: !!process.env.R2_ACCESS_KEY_ID,
      hasR2SecretKey: !!process.env.R2_SECRET_ACCESS_KEY,
      hasR2BucketName: !!process.env.R2_BUCKET_NAME,
      hasR2PublicUrl: !!process.env.R2_PUBLIC_URL,
    };

    console.log('Environment check:', envCheck);

    return NextResponse.json({
      message: 'Simple test successful',
      userId: session.user.id,
      requestBody: body,
      environment: envCheck
    });

  } catch (error) {
    console.error('Simple test error:', error);
    return NextResponse.json({
      error: 'Simple test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}