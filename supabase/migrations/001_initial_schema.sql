-- PROMPTTT Database Schema
-- Milestone 7: Supabase Integration & Schema
-- Created: 2025-01-10

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE video_status AS ENUM ('processing', 'published', 'draft', 'archived');

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    location TEXT,
    twitter_handle TEXT,
    instagram_handle TEXT,
    youtube_handle TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_creator BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
    CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]+$'),
    CONSTRAINT bio_length CHECK (char_length(bio) <= 500),
    CONSTRAINT website_format CHECK (website ~ '^https?://.*' OR website IS NULL)
);

-- =============================================
-- VIDEOS TABLE
-- =============================================
CREATE TABLE videos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    prompt TEXT NOT NULL,
    model TEXT NOT NULL,
    seed INTEGER,
    steps INTEGER,
    guidance_scale DECIMAL(4,2),
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration INTEGER, -- in seconds
    width INTEGER,
    height INTEGER,
    fps INTEGER,
    file_size BIGINT, -- in bytes
    status video_status DEFAULT 'processing',
    is_featured BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT title_length CHECK (char_length(title) >= 1 AND char_length(title) <= 200),
    CONSTRAINT description_length CHECK (char_length(description) <= 2000),
    CONSTRAINT prompt_length CHECK (char_length(prompt) >= 1 AND char_length(prompt) <= 1000),
    CONSTRAINT positive_counts CHECK (views_count >= 0 AND likes_count >= 0 AND comments_count >= 0),
    CONSTRAINT valid_dimensions CHECK ((width > 0 AND height > 0) OR (width IS NULL AND height IS NULL)),
    CONSTRAINT valid_duration CHECK (duration > 0 OR duration IS NULL),
    CONSTRAINT valid_fps CHECK (fps > 0 OR fps IS NULL),
    CONSTRAINT valid_file_size CHECK (file_size > 0 OR file_size IS NULL)
);

-- =============================================
-- VIDEO LIKES TABLE
-- =============================================
CREATE TABLE video_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint to prevent duplicate likes
    UNIQUE(video_id, user_id)
);

-- =============================================
-- VIDEO VIEWS TABLE
-- =============================================
CREATE TABLE video_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- COMMENTS TABLE
-- =============================================
CREATE TABLE comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT content_length CHECK (char_length(content) >= 1 AND char_length(content) <= 1000),
    CONSTRAINT no_self_parent CHECK (id != parent_id)
);

-- =============================================
-- COLLECTIONS TABLE
-- =============================================
CREATE TABLE collections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
    CONSTRAINT description_length CHECK (char_length(description) <= 500)
);

-- =============================================
-- COLLECTION VIDEOS TABLE
-- =============================================
CREATE TABLE collection_videos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE NOT NULL,
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint to prevent duplicate videos in same collection
    UNIQUE(collection_id, video_id)
);

-- =============================================
-- FOLLOWS TABLE
-- =============================================
CREATE TABLE follows (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT no_self_follow CHECK (follower_id != following_id),
    UNIQUE(follower_id, following_id)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Profiles indexes
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);
CREATE INDEX idx_profiles_is_verified ON profiles(is_verified) WHERE is_verified = TRUE;

-- Videos indexes
CREATE INDEX idx_videos_creator_id ON videos(creator_id);
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX idx_videos_published_at ON videos(published_at DESC) WHERE published_at IS NOT NULL;
CREATE INDEX idx_videos_is_featured ON videos(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_videos_is_public ON videos(is_public);
CREATE INDEX idx_videos_views_count ON videos(views_count DESC);
CREATE INDEX idx_videos_likes_count ON videos(likes_count DESC);

-- Video likes indexes
CREATE INDEX idx_video_likes_video_id ON video_likes(video_id);
CREATE INDEX idx_video_likes_user_id ON video_likes(user_id);
CREATE INDEX idx_video_likes_created_at ON video_likes(created_at DESC);

-- Video views indexes
CREATE INDEX idx_video_views_video_id ON video_views(video_id);
CREATE INDEX idx_video_views_user_id ON video_views(user_id);
CREATE INDEX idx_video_views_created_at ON video_views(created_at DESC);
CREATE INDEX idx_video_views_ip_address ON video_views(ip_address);

-- Comments indexes
CREATE INDEX idx_comments_video_id ON comments(video_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- Collections indexes
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_collections_is_public ON collections(is_public);
CREATE INDEX idx_collections_created_at ON collections(created_at DESC);

-- Collection videos indexes
CREATE INDEX idx_collection_videos_collection_id ON collection_videos(collection_id);
CREATE INDEX idx_collection_videos_video_id ON collection_videos(video_id);

-- Follows indexes
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
CREATE INDEX idx_follows_created_at ON follows(created_at DESC);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- =============================================

-- Function to increment video views with deduplication
CREATE OR REPLACE FUNCTION increment_video_views(
    video_id UUID,
    user_id UUID DEFAULT NULL,
    ip_address INET DEFAULT NULL,
    user_agent TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    view_exists BOOLEAN := FALSE;
BEGIN
    -- Check if view already exists (prevent spam)
    IF user_id IS NOT NULL THEN
        SELECT EXISTS(
            SELECT 1 FROM video_views 
            WHERE video_views.video_id = increment_video_views.video_id 
            AND video_views.user_id = increment_video_views.user_id
            AND created_at > NOW() - INTERVAL '1 hour'
        ) INTO view_exists;
    ELSIF ip_address IS NOT NULL THEN
        SELECT EXISTS(
            SELECT 1 FROM video_views 
            WHERE video_views.video_id = increment_video_views.video_id 
            AND video_views.ip_address = increment_video_views.ip_address
            AND created_at > NOW() - INTERVAL '1 hour'
        ) INTO view_exists;
    END IF;

    -- Only insert if view doesn't exist recently
    IF NOT view_exists THEN
        INSERT INTO video_views (video_id, user_id, ip_address, user_agent)
        VALUES (increment_video_views.video_id, increment_video_views.user_id, increment_video_views.ip_address, increment_video_views.user_agent);
        
        -- Update the counter
        UPDATE videos SET views_count = views_count + 1 
        WHERE id = increment_video_views.video_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get video feed with user-specific data
CREATE OR REPLACE FUNCTION get_video_feed(
    user_id UUID DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    prompt TEXT,
    model TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    duration INTEGER,
    creator_id UUID,
    creator_username TEXT,
    creator_avatar_url TEXT,
    views_count INTEGER,
    likes_count INTEGER,
    comments_count INTEGER,
    is_liked BOOLEAN,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id,
        v.title,
        v.description,
        v.prompt,
        v.model,
        v.video_url,
        v.thumbnail_url,
        v.duration,
        v.creator_id,
        p.username as creator_username,
        p.avatar_url as creator_avatar_url,
        v.views_count,
        v.likes_count,
        v.comments_count,
        CASE 
            WHEN user_id IS NOT NULL THEN EXISTS(
                SELECT 1 FROM video_likes vl 
                WHERE vl.video_id = v.id AND vl.user_id = get_video_feed.user_id
            )
            ELSE FALSE
        END as is_liked,
        v.created_at
    FROM videos v
    JOIN profiles p ON v.creator_id = p.id
    WHERE v.status = 'published' AND v.is_public = TRUE
    ORDER BY v.created_at DESC
    LIMIT limit_count OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;