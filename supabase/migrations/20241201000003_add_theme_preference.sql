-- Add theme_preference column to profiles table
-- This allows users to sync their theme choice across devices

ALTER TABLE profiles 
ADD COLUMN theme_preference TEXT CHECK (theme_preference IN ('light', 'dark', 'system'));

-- Add comment for documentation
COMMENT ON COLUMN profiles.theme_preference IS 'User theme preference: light, dark, or system. Syncs across devices when user is authenticated.';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_theme_preference ON profiles(theme_preference);