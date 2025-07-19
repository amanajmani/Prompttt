-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create videos table
CREATE TABLE videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  model TEXT NOT NULL,
  seed INTEGER,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  view_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create likes table (join table between profiles and videos)
CREATE TABLE likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, video_id)
);

-- Create comments table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Videos policies
CREATE POLICY "Videos are viewable by everyone" ON videos
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create videos" ON videos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own videos" ON videos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own videos" ON videos
  FOR DELETE USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Likes are viewable by everyone" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create likes" ON likes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own likes" ON likes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON likes
  FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX videos_user_id_idx ON videos(user_id);
CREATE INDEX videos_created_at_idx ON videos(created_at DESC);
CREATE INDEX likes_user_id_idx ON likes(user_id);
CREATE INDEX likes_video_id_idx ON likes(video_id);
CREATE INDEX comments_user_id_idx ON comments(user_id);
CREATE INDEX comments_video_id_idx ON comments(video_id);
CREATE INDEX comments_created_at_idx ON comments(created_at DESC);