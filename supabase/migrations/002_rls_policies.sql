-- PROMPTTT Row Level Security Policies
-- Milestone 7: Supabase Integration & Schema
-- Created: 2025-01-10

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PROFILES POLICIES
-- =============================================

-- Anyone can view public profile information
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (TRUE);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete their own profile" ON profiles
    FOR DELETE USING (auth.uid() = id);

-- =============================================
-- VIDEOS POLICIES
-- =============================================

-- Anyone can view published public videos
CREATE POLICY "Published public videos are viewable by everyone" ON videos
    FOR SELECT USING (
        status = 'published' AND is_public = TRUE
    );

-- Creators can view their own videos (all statuses)
CREATE POLICY "Creators can view their own videos" ON videos
    FOR SELECT USING (auth.uid() = creator_id);

-- Authenticated users can insert videos
CREATE POLICY "Authenticated users can insert videos" ON videos
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND auth.uid() = creator_id
    );

-- Creators can update their own videos
CREATE POLICY "Creators can update their own videos" ON videos
    FOR UPDATE USING (auth.uid() = creator_id);

-- Creators can delete their own videos
CREATE POLICY "Creators can delete their own videos" ON videos
    FOR DELETE USING (auth.uid() = creator_id);

-- =============================================
-- VIDEO LIKES POLICIES
-- =============================================

-- Anyone can view likes count (aggregated in videos table)
-- Users can view their own likes
CREATE POLICY "Users can view their own likes" ON video_likes
    FOR SELECT USING (auth.uid() = user_id);

-- Video creators can view likes on their videos
CREATE POLICY "Creators can view likes on their videos" ON video_likes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM videos 
            WHERE videos.id = video_likes.video_id 
            AND videos.creator_id = auth.uid()
        )
    );

-- Authenticated users can like videos
CREATE POLICY "Authenticated users can like videos" ON video_likes
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND auth.uid() = user_id
    );

-- Users can unlike their own likes
CREATE POLICY "Users can delete their own likes" ON video_likes
    FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- VIDEO VIEWS POLICIES
-- =============================================

-- Only video creators can view detailed view analytics
CREATE POLICY "Creators can view analytics for their videos" ON video_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM videos 
            WHERE videos.id = video_views.video_id 
            AND videos.creator_id = auth.uid()
        )
    );

-- Anyone can insert views (for analytics)
CREATE POLICY "Anyone can insert video views" ON video_views
    FOR INSERT WITH CHECK (TRUE);

-- =============================================
-- COMMENTS POLICIES
-- =============================================

-- Anyone can view comments on published public videos
CREATE POLICY "Comments on public videos are viewable" ON comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM videos 
            WHERE videos.id = comments.video_id 
            AND videos.status = 'published' 
            AND videos.is_public = TRUE
        )
    );

-- Video creators can view all comments on their videos
CREATE POLICY "Creators can view comments on their videos" ON comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM videos 
            WHERE videos.id = comments.video_id 
            AND videos.creator_id = auth.uid()
        )
    );

-- Authenticated users can comment on published public videos
CREATE POLICY "Users can comment on public videos" ON comments
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' 
        AND auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM videos 
            WHERE videos.id = comments.video_id 
            AND videos.status = 'published' 
            AND videos.is_public = TRUE
        )
    );

-- Users can update their own comments
CREATE POLICY "Users can update their own comments" ON comments
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments" ON comments
    FOR DELETE USING (auth.uid() = user_id);

-- Video creators can delete comments on their videos
CREATE POLICY "Creators can delete comments on their videos" ON comments
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM videos 
            WHERE videos.id = comments.video_id 
            AND videos.creator_id = auth.uid()
        )
    );

-- =============================================
-- COLLECTIONS POLICIES
-- =============================================

-- Anyone can view public collections
CREATE POLICY "Public collections are viewable" ON collections
    FOR SELECT USING (is_public = TRUE);

-- Users can view their own collections
CREATE POLICY "Users can view their own collections" ON collections
    FOR SELECT USING (auth.uid() = user_id);

-- Authenticated users can create collections
CREATE POLICY "Users can create collections" ON collections
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND auth.uid() = user_id
    );

-- Users can update their own collections
CREATE POLICY "Users can update their own collections" ON collections
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own collections
CREATE POLICY "Users can delete their own collections" ON collections
    FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- COLLECTION VIDEOS POLICIES
-- =============================================

-- Anyone can view videos in public collections
CREATE POLICY "Videos in public collections are viewable" ON collection_videos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM collections 
            WHERE collections.id = collection_videos.collection_id 
            AND collections.is_public = TRUE
        )
    );

-- Users can view videos in their own collections
CREATE POLICY "Users can view their own collection videos" ON collection_videos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM collections 
            WHERE collections.id = collection_videos.collection_id 
            AND collections.user_id = auth.uid()
        )
    );

-- Users can add videos to their own collections
CREATE POLICY "Users can add videos to their collections" ON collection_videos
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM collections 
            WHERE collections.id = collection_videos.collection_id 
            AND collections.user_id = auth.uid()
        )
    );

-- Users can remove videos from their own collections
CREATE POLICY "Users can remove videos from their collections" ON collection_videos
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM collections 
            WHERE collections.id = collection_videos.collection_id 
            AND collections.user_id = auth.uid()
        )
    );

-- =============================================
-- FOLLOWS POLICIES
-- =============================================

-- Anyone can view follow relationships (for public profiles)
CREATE POLICY "Follow relationships are viewable" ON follows
    FOR SELECT USING (TRUE);

-- Authenticated users can follow others
CREATE POLICY "Users can follow others" ON follows
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND auth.uid() = follower_id
    );

-- Users can unfollow (delete their own follow relationships)
CREATE POLICY "Users can unfollow others" ON follows
    FOR DELETE USING (auth.uid() = follower_id);

-- =============================================
-- TRIGGERS FOR MAINTAINING COUNTS
-- =============================================

-- Function to update video likes count
CREATE OR REPLACE FUNCTION update_video_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE videos SET likes_count = likes_count + 1 WHERE id = NEW.video_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE videos SET likes_count = likes_count - 1 WHERE id = OLD.video_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update video comments count
CREATE OR REPLACE FUNCTION update_video_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE videos SET comments_count = comments_count + 1 WHERE id = NEW.video_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE videos SET comments_count = comments_count - 1 WHERE id = OLD.video_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply triggers
CREATE TRIGGER video_likes_count_trigger
    AFTER INSERT OR DELETE ON video_likes
    FOR EACH ROW EXECUTE FUNCTION update_video_likes_count();

CREATE TRIGGER video_comments_count_trigger
    AFTER INSERT OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_video_comments_count();

-- =============================================
-- SECURITY FUNCTIONS
-- =============================================

-- Function to check if user can access video
CREATE OR REPLACE FUNCTION can_access_video(video_id UUID, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM videos v
        WHERE v.id = video_id
        AND (
            (v.status = 'published' AND v.is_public = TRUE) -- Public published videos
            OR v.creator_id = user_id -- Creator's own videos
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can moderate content
CREATE OR REPLACE FUNCTION can_moderate_content(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = user_id
        AND p.is_verified = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;