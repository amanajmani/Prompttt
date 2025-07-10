export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          website: string | null
          location: string | null
          twitter_handle: string | null
          instagram_handle: string | null
          youtube_handle: string | null
          is_verified: boolean
          is_creator: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          twitter_handle?: string | null
          instagram_handle?: string | null
          youtube_handle?: string | null
          is_verified?: boolean
          is_creator?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          twitter_handle?: string | null
          instagram_handle?: string | null
          youtube_handle?: string | null
          is_verified?: boolean
          is_creator?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      videos: {
        Row: {
          id: string
          title: string
          description: string | null
          prompt: string
          model: string
          seed: number | null
          steps: number | null
          guidance_scale: number | null
          video_url: string
          thumbnail_url: string | null
          duration: number | null
          width: number | null
          height: number | null
          fps: number | null
          file_size: number | null
          status: 'processing' | 'published' | 'draft' | 'archived'
          is_featured: boolean
          is_public: boolean
          creator_id: string
          views_count: number
          likes_count: number
          comments_count: number
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          prompt: string
          model: string
          seed?: number | null
          steps?: number | null
          guidance_scale?: number | null
          video_url: string
          thumbnail_url?: string | null
          duration?: number | null
          width?: number | null
          height?: number | null
          fps?: number | null
          file_size?: number | null
          status?: 'processing' | 'published' | 'draft' | 'archived'
          is_featured?: boolean
          is_public?: boolean
          creator_id: string
          views_count?: number
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          prompt?: string
          model?: string
          seed?: number | null
          steps?: number | null
          guidance_scale?: number | null
          video_url?: string
          thumbnail_url?: string | null
          duration?: number | null
          width?: number | null
          height?: number | null
          fps?: number | null
          file_size?: number | null
          status?: 'processing' | 'published' | 'draft' | 'archived'
          is_featured?: boolean
          is_public?: boolean
          creator_id?: string
          views_count?: number
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      video_likes: {
        Row: {
          id: string
          video_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          video_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          video_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_likes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      video_views: {
        Row: {
          id: string
          video_id: string
          user_id: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          video_id: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          video_id?: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_views_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          id: string
          content: string
          video_id: string
          user_id: string
          parent_id: string | null
          is_edited: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          video_id: string
          user_id: string
          parent_id?: string | null
          is_edited?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          video_id?: string
          user_id?: string
          parent_id?: string | null
          is_edited?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          }
        ]
      }
      collections: {
        Row: {
          id: string
          name: string
          description: string | null
          is_public: boolean
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_public?: boolean
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_public?: boolean
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      collection_videos: {
        Row: {
          id: string
          collection_id: string
          video_id: string
          created_at: string
        }
        Insert: {
          id?: string
          collection_id: string
          video_id: string
          created_at?: string
        }
        Update: {
          id?: string
          collection_id?: string
          video_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_videos_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_videos_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          }
        ]
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_video_views: {
        Args: {
          video_id: string
          user_id?: string
          ip_address?: string
          user_agent?: string
        }
        Returns: void
      }
      get_video_feed: {
        Args: {
          user_id?: string
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          id: string
          title: string
          description: string | null
          prompt: string
          model: string
          video_url: string
          thumbnail_url: string | null
          duration: number | null
          creator_id: string
          creator_username: string
          creator_avatar_url: string | null
          views_count: number
          likes_count: number
          comments_count: number
          is_liked: boolean
          created_at: string
        }[]
      }
    }
    Enums: {
      video_status: 'processing' | 'published' | 'draft' | 'archived'
    }
  }
}