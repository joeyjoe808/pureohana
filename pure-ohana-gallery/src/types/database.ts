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
      photographers: {
        Row: {
          id: string
          email: string
          full_name: string
          business_name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          business_name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          business_name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      galleries: {
        Row: {
          id: string
          photographer_id: string
          title: string
          slug: string
          description: string | null
          cover_photo_url: string | null
          password_hash: string | null
          is_public: boolean
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          photographer_id: string
          title: string
          slug: string
          description?: string | null
          cover_photo_url?: string | null
          password_hash?: string | null
          is_public?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          photographer_id?: string
          title?: string
          slug?: string
          description?: string | null
          cover_photo_url?: string | null
          password_hash?: string | null
          is_public?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      photos: {
        Row: {
          id: string
          gallery_id: string
          filename: string
          thumbnail_url: string
          web_url: string
          original_url: string
          width: number | null
          height: number | null
          file_size: number | null
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gallery_id: string
          filename: string
          thumbnail_url: string
          web_url: string
          original_url: string
          width?: number | null
          height?: number | null
          file_size?: number | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gallery_id?: string
          filename?: string
          thumbnail_url?: string
          web_url?: string
          original_url?: string
          width?: number | null
          height?: number | null
          file_size?: number | null
          position?: number
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          photo_id: string
          gallery_id: string
          client_identifier: string
          created_at: string
        }
        Insert: {
          id?: string
          photo_id: string
          gallery_id: string
          client_identifier: string
          created_at?: string
        }
        Update: {
          id?: string
          photo_id?: string
          gallery_id?: string
          client_identifier?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          photo_id: string
          gallery_id: string
          client_name: string | null
          client_email: string | null
          comment: string
          is_read: boolean
          photographer_reply: string | null
          is_liked: boolean
          replied_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          photo_id: string
          gallery_id: string
          client_name?: string | null
          client_email?: string | null
          comment: string
          is_read?: boolean
          photographer_reply?: string | null
          is_liked?: boolean
          replied_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          photo_id?: string
          gallery_id?: string
          client_name?: string | null
          client_email?: string | null
          comment?: string
          is_read?: boolean
          photographer_reply?: string | null
          is_liked?: boolean
          replied_at?: string | null
          created_at?: string
        }
      }
      upload_sessions: {
        Row: {
          id: string
          gallery_id: string
          photographer_id: string
          total_photos: number
          completed_photos: number
          failed_photos: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          gallery_id: string
          photographer_id: string
          total_photos: number
          completed_photos?: number
          failed_photos?: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          gallery_id?: string
          photographer_id?: string
          total_photos?: number
          completed_photos?: number
          failed_photos?: number
          status?: string
          created_at?: string
        }
      }
    }
  }
}
