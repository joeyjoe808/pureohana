/**
 * Pure Ohana Treasures - Database Type Definitions
 * Generated from schema.sql
 *
 * These types provide full type safety for all database operations
 * across the unified platform (marketing site + gallery app).
 */

// ============================================
// BASE TYPES
// ============================================

/**
 * Photographer profile linked to Supabase Auth
 */
export interface Photographer {
  id: string // UUID from auth.users
  email: string
  full_name: string
  business_name: string
  avatar_url: string | null
  created_at: string // ISO timestamp
  updated_at: string // ISO timestamp
}

/**
 * Gallery container for photo collections
 * Supports both public portfolios and private client galleries
 */
export interface Gallery {
  id: string // UUID
  photographer_id: string // UUID

  // Basic info
  title: string
  slug: string // URL-friendly identifier
  description: string | null
  cover_photo_url: string | null

  // Access control
  password_hash: string | null // bcrypt hash (optional)
  access_key: string // UUID for link-based access
  is_public: boolean // Show in public portfolio

  // Analytics
  view_count: number

  // Timestamps
  created_at: string // ISO timestamp
  updated_at: string // ISO timestamp
}

/**
 * Individual photo in a gallery
 * Includes multiple sizes for responsive serving
 */
export interface Photo {
  id: string // UUID
  gallery_id: string // UUID

  // File info
  filename: string
  thumbnail_url: string // 400px WebP
  web_url: string // 1920px WebP
  original_url: string // Full resolution

  // Metadata
  width: number | null
  height: number | null
  file_size: number | null // bytes
  position: number // For manual ordering

  // Public portfolio flag
  is_public_portfolio: boolean // Show in /portfolio page

  // Timestamps
  created_at: string // ISO timestamp
  updated_at: string // ISO timestamp
}

/**
 * Client "hearts" on photos
 */
export interface Favorite {
  id: string // UUID
  photo_id: string // UUID
  gallery_id: string // UUID
  client_identifier: string // Hashed IP or cookie ID
  client_name: string | null // Client's name (optional)
  client_email: string | null // Client's email (optional)
  created_at: string // ISO timestamp
}

/**
 * Client comments on photos
 */
export interface Comment {
  id: string // UUID
  photo_id: string // UUID
  gallery_id: string // UUID

  // Client info (optional)
  client_name: string | null
  client_email: string | null

  // Comment content
  comment: string

  // Photographer interaction
  is_read: boolean
  photographer_reply: string | null
  replied_at: string | null // ISO timestamp
  is_liked: boolean // Photographer can "like" a comment

  // Timestamp
  created_at: string // ISO timestamp
}

/**
 * Track bulk upload progress (300-500 photos)
 */
export interface UploadSession {
  id: string // UUID
  gallery_id: string // UUID
  photographer_id: string // UUID

  // Progress tracking
  total_photos: number
  completed_photos: number
  failed_photos: number
  status: 'processing' | 'completed' | 'failed'

  // Timestamp
  created_at: string // ISO timestamp
}

/**
 * Contact form submissions from marketing site
 */
export interface ContactSubmission {
  id: string // UUID

  // Contact info
  name: string
  email: string
  phone: string | null

  // Event details
  event_type: string | null
  event_date: string | null // ISO date
  vision: string | null
  referral_source: string | null

  // Status tracking
  is_read: boolean
  photographer_notes: string | null
  status: 'new' | 'contacted' | 'booked' | 'declined'

  // Timestamps
  created_at: string // ISO timestamp
  responded_at: string | null // ISO timestamp
}

/**
 * Blog posts for marketing site CMS
 */
export interface BlogPost {
  id: string // UUID
  photographer_id: string // UUID

  // Post content
  title: string
  slug: string // URL-friendly identifier
  excerpt: string | null
  content: string // Markdown
  cover_image_url: string | null

  // SEO
  meta_description: string | null
  meta_keywords: string[] | null

  // Publishing
  is_published: boolean
  published_at: string | null // ISO timestamp

  // Timestamps
  created_at: string // ISO timestamp
  updated_at: string // ISO timestamp
}

// ============================================
// INSERT TYPES (for creating new records)
// ============================================

export type PhotographerInsert = Omit<Photographer, 'created_at' | 'updated_at'>
export type GalleryInsert = Omit<Gallery, 'id' | 'created_at' | 'updated_at' | 'view_count'>
export type PhotoInsert = Omit<Photo, 'id' | 'created_at' | 'updated_at'>
export type FavoriteInsert = Omit<Favorite, 'id' | 'created_at'> & {
  client_name?: string | null
  client_email?: string | null
}
export type CommentInsert = Omit<Comment, 'id' | 'created_at' | 'is_read' | 'photographer_reply' | 'replied_at' | 'is_liked'>
export type UploadSessionInsert = Omit<UploadSession, 'id' | 'created_at' | 'completed_photos' | 'failed_photos' | 'status'>
export type ContactSubmissionInsert = Omit<ContactSubmission, 'id' | 'created_at' | 'is_read' | 'photographer_notes' | 'status' | 'responded_at'>
export type BlogPostInsert = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>

// ============================================
// UPDATE TYPES (for partial updates)
// ============================================

export type PhotographerUpdate = Partial<Omit<Photographer, 'id' | 'created_at' | 'updated_at'>>
export type GalleryUpdate = Partial<Omit<Gallery, 'id' | 'created_at' | 'updated_at'>>
export type PhotoUpdate = Partial<Omit<Photo, 'id' | 'created_at' | 'updated_at'>>
export type CommentUpdate = Partial<Omit<Comment, 'id' | 'created_at'>>
export type UploadSessionUpdate = Partial<Omit<UploadSession, 'id' | 'created_at'>>
export type ContactSubmissionUpdate = Partial<Omit<ContactSubmission, 'id' | 'created_at'>>
export type BlogPostUpdate = Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>

// ============================================
// JOINED TYPES (for common queries)
// ============================================

/**
 * Gallery with photographer details
 */
export interface GalleryWithPhotographer extends Gallery {
  photographer: Photographer
}

/**
 * Photo with gallery context
 */
export interface PhotoWithGallery extends Photo {
  gallery: Gallery
}

/**
 * Photo with favorite count
 */
export interface PhotoWithStats extends Photo {
  favorite_count: number
  comment_count: number
}

/**
 * Gallery with photo count and cover photo
 */
export interface GalleryWithStats extends Gallery {
  photo_count: number
  favorite_count: number
  comment_count: number
}

/**
 * Comment with photo context
 */
export interface CommentWithPhoto extends Comment {
  photo: Photo
}

// ============================================
// DATABASE HELPER TYPES
// ============================================

/**
 * Database table names (type-safe)
 */
export type TableName =
  | 'photographers'
  | 'galleries'
  | 'photos'
  | 'favorites'
  | 'comments'
  | 'upload_sessions'
  | 'contact_submissions'
  | 'blog_posts'

/**
 * Storage bucket names (type-safe)
 */
export type BucketName = 'gallery-photos'

/**
 * Database schema type map
 */
export interface Database {
  public: {
    Tables: {
      photographers: {
        Row: Photographer
        Insert: PhotographerInsert
        Update: PhotographerUpdate
      }
      galleries: {
        Row: Gallery
        Insert: GalleryInsert
        Update: GalleryUpdate
      }
      photos: {
        Row: Photo
        Insert: PhotoInsert
        Update: PhotoUpdate
      }
      favorites: {
        Row: Favorite
        Insert: FavoriteInsert
        Update: never // Favorites are insert-only or delete
      }
      comments: {
        Row: Comment
        Insert: CommentInsert
        Update: CommentUpdate
      }
      upload_sessions: {
        Row: UploadSession
        Insert: UploadSessionInsert
        Update: UploadSessionUpdate
      }
      contact_submissions: {
        Row: ContactSubmission
        Insert: ContactSubmissionInsert
        Update: ContactSubmissionUpdate
      }
      blog_posts: {
        Row: BlogPost
        Insert: BlogPostInsert
        Update: BlogPostUpdate
      }
    }
  }
}
