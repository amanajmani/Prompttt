import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { withErrorHandler } from '@/lib/error-handler';
import type { Database } from '@/types/database';

// Validation schema for theme preference update
const themePreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
});

/**
 * PUT /api/user/theme
 * Updates the authenticated user's theme preference in their profile
 */
export const PUT = withErrorHandler(async (request: NextRequest) => {
  // Skip rate limiting for theme API - it's not a sensitive endpoint
  // Theme changes are user-initiated and don't need strict rate limiting

  // Verify user authentication
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();

  if (authError || !session) {
    return NextResponse.json(
      { error: 'Authentication required to update theme preference' },
      { status: 401 }
    );
  }

  // Parse and validate request body
  const body = await request.json();
  const validationResult = themePreferenceSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: 'Invalid theme preference',
        details: validationResult.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
      { status: 400 }
    );
  }

  const { theme } = validationResult.data;

  // Update user's theme preference in the database
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      theme_preference: theme,
    })
    .eq('id', session.user.id);

  if (updateError) {
    // Check if the error is due to missing column (schema not migrated yet)
    if (updateError.code === '42703') {
      // Column doesn't exist yet - gracefully degrade (acknowledge but don't persist)
      console.warn(
        'Theme preference column not found, theme not persisted. Database migration may be pending.'
      );
      return NextResponse.json(
        {
          message:
            'Theme preference updated locally (database persistence pending migration)',
          theme,
          warning:
            'Theme preference not persisted to database - migration required',
        },
        {
          status: 200,
        }
      );
    }

    // Other database errors should be logged and handled
    console.error('Error updating theme preference:', updateError);
    return NextResponse.json(
      { error: 'Failed to update theme preference' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: 'Theme preference updated successfully',
      theme,
    },
    {
      status: 200,
    }
  );
});

/**
 * GET /api/user/theme
 * Retrieves the authenticated user's theme preference
 */
export const GET = withErrorHandler(async (request: NextRequest) => {
  // Skip rate limiting for theme API - it's not a sensitive endpoint
  // Theme fetching is infrequent and doesn't need strict rate limiting

  // Verify user authentication
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();

  if (authError || !session) {
    return NextResponse.json(
      { error: 'Authentication required to get theme preference' },
      { status: 401 }
    );
  }

  // Get user's theme preference from the database
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('theme_preference')
    .eq('id', session.user.id)
    .single();

  if (fetchError) {
    // Check if the error is due to missing column (schema not migrated yet)
    if (fetchError.code === '42703') {
      // Column doesn't exist yet - gracefully degrade to default theme
      console.warn(
        'Theme preference column not found, using default theme. Database migration may be pending.'
      );
      return NextResponse.json(
        {
          theme: 'system', // Default theme when schema is not ready
        },
        {
          status: 200,
        }
      );
    }

    // Other database errors should be logged and handled
    console.error('Error fetching theme preference:', fetchError);
    return NextResponse.json(
      { error: 'Failed to fetch theme preference' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      theme:
        profile?.theme_preference || 'system',
    },
    {
      status: 200,
    }
  );
});
