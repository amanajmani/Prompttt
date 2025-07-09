// Core application types

export interface User {
  id: string
  username: string
  email: string
  avatar_url?: string
  bio?: string
  website?: string
  github_url?: string
  twitter_url?: string
  created_at: string
  updated_at: string
}

export interface Video {
  id: string
  title: string
  description?: string
  video_url: string
  thumbnail_url: string
  prompt: string
  model: string
  seed?: string
  tags: string[]
  user_id: string
  user?: User
  likes_count: number
  views_count: number
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  content: string
  video_id: string
  user_id: string
  user?: User
  created_at: string
  updated_at: string
}

export interface Like {
  id: string
  video_id: string
  user_id: string
  created_at: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types
export interface VideoUploadForm {
  title: string
  description?: string
  prompt: string
  model: string
  seed?: string
  tags: string[]
  video: File
  thumbnail?: File
}

export interface UserProfileForm {
  username: string
  bio?: string
  website?: string
  github_url?: string
  twitter_url?: string
  avatar?: File
}

// UI Component types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}
