// Re-export database types
export type { Database } from './database';

// Import Database type for use in type aliases
import type { Database } from './database';

// Common type aliases for easier use
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Video = Database['public']['Tables']['videos']['Row'];
export type Like = Database['public']['Tables']['likes']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];

export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type VideoInsert = Database['public']['Tables']['videos']['Insert'];
export type LikeInsert = Database['public']['Tables']['likes']['Insert'];
export type CommentInsert = Database['public']['Tables']['comments']['Insert'];

export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type VideoUpdate = Database['public']['Tables']['videos']['Update'];
export type LikeUpdate = Database['public']['Tables']['likes']['Update'];
export type CommentUpdate = Database['public']['Tables']['comments']['Update'];
