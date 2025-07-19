import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    console.log('Test auth endpoint called');
    
    // Test Supabase connection
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    console.log('Auth check result:', { session: !!session, error: authError });

    if (authError) {
      return NextResponse.json({ error: 'Auth error', details: authError.message }, { status: 500 });
    }

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json({ 
      message: 'Authentication working',
      userId: session.user.id,
      email: session.user.email 
    });

  } catch (error) {
    console.error('Test auth error:', error);
    return NextResponse.json({ 
      error: 'Server error', 
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}