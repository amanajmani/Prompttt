-- Function to increment view count for a video
CREATE OR REPLACE FUNCTION increment_view_count(video_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE videos 
  SET view_count = view_count + 1 
  WHERE id = video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO authenticated;