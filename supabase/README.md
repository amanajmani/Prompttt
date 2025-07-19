# Supabase Database Schema

This directory contains the database migrations and schema for the AI VideoHub (PROMPTTT) application.

## Database Structure

### Tables

#### `profiles`
User profile information linked to Supabase Auth users.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, references `auth.users.id` |
| `username` | TEXT | Unique username for the user |
| `avatar_url` | TEXT | Optional URL to user's avatar image |
| `bio` | TEXT | Optional user biography |
| `created_at` | TIMESTAMP | Account creation timestamp |

#### `videos`
AI-generated video content uploaded by users.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to `profiles.id` |
| `title` | TEXT | Video title |
| `prompt` | TEXT | AI prompt used to generate the video |
| `model` | TEXT | AI model used for generation |
| `seed` | INTEGER | Optional seed value for reproducibility |
| `video_url` | TEXT | URL to the video file |
| `thumbnail_url` | TEXT | URL to the video thumbnail |
| `view_count` | INTEGER | Number of times video has been viewed |
| `created_at` | TIMESTAMP | Video upload timestamp |

#### `likes`
Join table for user likes on videos.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to `profiles.id` |
| `video_id` | UUID | Foreign key to `videos.id` |
| `created_at` | TIMESTAMP | Like timestamp |

**Constraints:**
- Unique constraint on `(user_id, video_id)` to prevent duplicate likes

#### `comments`
User comments on videos.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to `profiles.id` |
| `video_id` | UUID | Foreign key to `videos.id` |
| `content` | TEXT | Comment content |
| `created_at` | TIMESTAMP | Comment timestamp |

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### Profiles
- **SELECT**: Public read access to all profiles
- **INSERT**: Users can only create their own profile
- **UPDATE**: Users can only update their own profile

### Videos
- **SELECT**: Public read access to all videos
- **INSERT**: Authenticated users can create videos (must match `auth.uid()`)
- **UPDATE**: Users can only update their own videos
- **DELETE**: Users can only delete their own videos

### Likes
- **SELECT**: Public read access to all likes
- **INSERT**: Authenticated users can create likes (must match `auth.uid()`)
- **UPDATE**: Users can only update their own likes
- **DELETE**: Users can only delete their own likes

### Comments
- **SELECT**: Public read access to all comments
- **INSERT**: Authenticated users can create comments (must match `auth.uid()`)
- **UPDATE**: Users can only update their own comments
- **DELETE**: Users can only delete their own comments

## Database Functions

### `increment_view_count(video_id UUID)`
Safely increments the view count for a video. This function is security definer to ensure proper access control.

## Indexes

Performance indexes are created on:
- `videos.user_id`
- `videos.created_at` (descending)
- `likes.user_id`
- `likes.video_id`
- `comments.user_id`
- `comments.video_id`
- `comments.created_at` (descending)

## Migration Files

- `20241201000000_initial_schema.sql`: Creates all tables, RLS policies, and indexes
- `20241201000001_functions.sql`: Creates database functions

## Environment Variables

Required environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## TypeScript Integration

The database schema is fully typed with TypeScript definitions in `src/types/database.ts`. This ensures type safety when interacting with the database through the Supabase client.

## Database Operations

Abstracted database operations are available in `src/lib/database.ts` with methods for:
- Profile management
- Video CRUD operations
- Like toggling
- Comment management

All operations include proper error handling and return type-safe results.