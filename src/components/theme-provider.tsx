'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { useTheme as useNextTheme } from 'next-themes';

/**
 * Enhanced Theme Provider that syncs theme preferences with user account.
 * Provides server-side theme persistence and cross-device synchronization.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="prompttt-ui-theme"
      {...props}
    >
      <ThemeSyncManager>{children}</ThemeSyncManager>
    </NextThemesProvider>
  );
}

/**
 * Internal component that manages theme synchronization with user account
 */
function ThemeSyncManager({ children }: { children: React.ReactNode }) {
  const { setTheme } = useNextTheme();
  const user = useUser();

  // Fetch user's theme preference ONCE when they log in (MILESTONE-11 correct implementation)
  useEffect(() => {
    if (!user) return;

    // Only fetch theme once per user session
    const hasAlreadyFetched = sessionStorage.getItem(`theme-fetched-${user.id}`);
    if (hasAlreadyFetched) return;

    const fetchUserTheme = async () => {
      try {
        const response = await fetch('/api/user/theme');
        
        if (response.ok) {
          const data = await response.json();
          if (data.theme) {
            setTheme(data.theme);
          }
          // Mark as fetched for this session
          sessionStorage.setItem(`theme-fetched-${user.id}`, 'true');
        } else if (response.status === 500) {
          // Server error - likely database schema issue, continue with local theme
          console.warn(
            'Theme preference service unavailable, using local theme preference'
          );
        }
      } catch (error) {
        console.warn('Failed to fetch user theme preference:', error);
      }
    };

    // Small delay to avoid race conditions with auth state
    const timeoutId = setTimeout(fetchUserTheme, 500);

    return () => clearTimeout(timeoutId);
  }, [user?.id, setTheme]);

  return <>{children}</>;
}

/**
 * Enhanced useTheme hook that includes database synchronization
 */
export function useTheme() {
  const themeContext = useNextTheme();
  const user = useUser();

  const setTheme = async (theme: string) => {
    // Update theme locally first for immediate UI response
    themeContext.setTheme(theme);

    // Sync with database if user is authenticated
    if (user) {
      try {
        const response = await fetch('/api/user/theme', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ theme }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.warning) {
            console.warn('Theme sync warning:', data.warning);
          }
        } else {
          console.warn(
            'Failed to sync theme preference to database - server returned:',
            response.status
          );
        }
      } catch (error) {
        console.warn('Failed to sync theme preference to database:', error);
      }
    }
  };

  return {
    ...themeContext,
    setTheme,
  };
}
