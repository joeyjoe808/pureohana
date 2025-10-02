export interface Gallery {
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
  photos?: Photo[]
}

export interface Photo {
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

export interface Photographer {
  id: string
  email: string
  full_name: string
  business_name: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}
