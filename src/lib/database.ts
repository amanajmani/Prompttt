import { supabase } from './supabase';
import type { Database } from '@/types/database';

type Tables = Database['public']['Tables'];
type Profile = Tables['profiles']['Row'];
type Video = Tables['videos']['Row'];
type Like = Tables['likes']['Row'];
type Comment = Tables['comments']['Row'];

// Profile operations
export const profileOperations = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  },

  async updateProfile(
    userId: string,
    updates: Tables['profiles']['Update']
  ): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    return data;
  },

  async createProfile(
    profile: Tables['profiles']['Insert']
  ): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }

    return data;
  },
};

// Video operations
export const videoOperations = {
  async getVideos(limit = 20, offset = 0): Promise<Video[]> {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching videos:', error);
      return [];
    }

    return data || [];
  },

  async getVideoById(videoId: string): Promise<Video | null> {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();

    if (error) {
      console.error('Error fetching video:', error);
      return null;
    }

    return data;
  },

  async getUserVideos(userId: string): Promise<Video[]> {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user videos:', error);
      return [];
    }

    return data || [];
  },

  async createVideo(video: Tables['videos']['Insert']): Promise<Video | null> {
    const { data, error } = await supabase
      .from('videos')
      .insert(video)
      .select()
      .single();

    if (error) {
      console.error('Error creating video:', error);
      return null;
    }

    return data;
  },

  async updateVideo(
    videoId: string,
    updates: Tables['videos']['Update']
  ): Promise<Video | null> {
    const { data, error } = await supabase
      .from('videos')
      .update(updates)
      .eq('id', videoId)
      .select()
      .single();

    if (error) {
      console.error('Error updating video:', error);
      return null;
    }

    return data;
  },

  async deleteVideo(videoId: string): Promise<boolean> {
    const { error } = await supabase.from('videos').delete().eq('id', videoId);

    if (error) {
      console.error('Error deleting video:', error);
      return false;
    }

    return true;
  },

  async incrementViewCount(videoId: string): Promise<boolean> {
    const { error } = await supabase.rpc('increment_view_count', {
      video_id: videoId,
    });

    if (error) {
      console.error('Error incrementing view count:', error);
      return false;
    }

    return true;
  },
};

// Like operations
export const likeOperations = {
  async getLikesForVideo(videoId: string): Promise<Like[]> {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('video_id', videoId);

    if (error) {
      console.error('Error fetching likes:', error);
      return [];
    }

    return data || [];
  },

  async getUserLike(userId: string, videoId: string): Promise<Like | null> {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', userId)
      .eq('video_id', videoId)
      .single();

    if (error) {
      return null;
    }

    return data;
  },

  async toggleLike(userId: string, videoId: string): Promise<boolean> {
    const existingLike = await this.getUserLike(userId, videoId);

    if (existingLike) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id);

      if (error) {
        console.error('Error removing like:', error);
        return false;
      }
    } else {
      const { error } = await supabase.from('likes').insert({
        user_id: userId,
        video_id: videoId,
      });

      if (error) {
        console.error('Error adding like:', error);
        return false;
      }
    }

    return true;
  },
};

// Comment operations
export const commentOperations = {
  async getCommentsForVideo(videoId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('video_id', videoId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return [];
    }

    return data || [];
  },

  async createComment(
    comment: Tables['comments']['Insert']
  ): Promise<Comment | null> {
    const { data, error } = await supabase
      .from('comments')
      .insert(comment)
      .select()
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      return null;
    }

    return data;
  },

  async updateComment(
    commentId: string,
    content: string
  ): Promise<Comment | null> {
    const { data, error } = await supabase
      .from('comments')
      .update({ content })
      .eq('id', commentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating comment:', error);
      return null;
    }

    return data;
  },

  async deleteComment(commentId: string): Promise<boolean> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Error deleting comment:', error);
      return false;
    }

    return true;
  },
};
