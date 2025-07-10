'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

export function useSupabase() {
  const [supabase] = useState(() => createSupabaseClient())
  return supabase
}

export function useUser() {
  const supabase = useSupabase()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  return { user, loading }
}

export function useProfile(userId?: string) {
  const supabase = useSupabase()
  const { user } = useUser()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const targetUserId = userId || user?.id

  useEffect(() => {
    if (!targetUserId) {
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', targetUserId)
          .single()

        if (error) throw error
        setProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile')
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [supabase, targetUserId])

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!targetUserId) throw new Error('No user ID available')

    try {
      setError(null)
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', targetUserId)
        .select()
        .single()

      if (error) throw error
      setProfile(data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return { profile, loading, error, updateProfile }
}

export function useVideos(options?: {
  creatorId?: string
  limit?: number
  offset?: number
}) {
  const supabase = useSupabase()
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const { creatorId, limit = 20, offset = 0 } = options || {}

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        setError(null)

        let query = supabase
          .from('videos')
          .select(`
            *,
            profiles:creator_id (
              id,
              username,
              full_name,
              avatar_url,
              is_verified
            )
          `)
          .eq('status', 'published')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1)

        if (creatorId) {
          query = query.eq('creator_id', creatorId)
        }

        const { data, error } = await query

        if (error) throw error

        if (offset === 0) {
          setVideos(data || [])
        } else {
          setVideos(prev => [...prev, ...(data || [])])
        }

        setHasMore((data || []).length === limit)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch videos')
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [supabase, creatorId, limit, offset])

  return { videos, loading, error, hasMore }
}

export function useVideoLikes(videoId: string) {
  const supabase = useSupabase()
  const { user } = useUser()
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        // Get likes count
        const { data: video } = await supabase
          .from('videos')
          .select('likes_count')
          .eq('id', videoId)
          .single()

        if (video) {
          setLikesCount(video.likes_count)
        }

        // Check if user has liked this video
        if (user) {
          const { data } = await supabase
            .from('video_likes')
            .select('id')
            .eq('video_id', videoId)
            .eq('user_id', user.id)
            .single()

          setIsLiked(!!data)
        }
      } catch (err) {
        // Ignore errors for like status
      } finally {
        setLoading(false)
      }
    }

    fetchLikeStatus()
  }, [supabase, videoId, user])

  const toggleLike = async () => {
    if (!user) throw new Error('Must be logged in to like videos')

    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from('video_likes')
          .delete()
          .eq('video_id', videoId)
          .eq('user_id', user.id)

        setIsLiked(false)
        setLikesCount(prev => prev - 1)
      } else {
        // Like
        await supabase
          .from('video_likes')
          .insert({
            video_id: videoId,
            user_id: user.id
          })

        setIsLiked(true)
        setLikesCount(prev => prev + 1)
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to toggle like')
    }
  }

  return { isLiked, likesCount, loading, toggleLike }
}

export function useVideoViews() {
  const supabase = useSupabase()
  const { user } = useUser()

  const recordView = async (videoId: string) => {
    try {
      // Use the database function for view tracking
      await supabase.rpc('increment_video_views', {
        video_id: videoId,
        user_id: user?.id || null,
        ip_address: null, // Will be handled by server
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : null
      })
    } catch (err) {
      // Silently fail for view tracking
      console.warn('Failed to record video view:', err)
    }
  }

  return { recordView }
}