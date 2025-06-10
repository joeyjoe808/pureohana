// Blog post interfaces

// Base author type
export interface Author {
  id: number;
  name: string;
  image_url: string;
  bio?: string;
}

// Blog post type from Supabase
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  featured_image: string;
  created_at: string;
  updated_at?: string;
  read_time: string;
  is_published: boolean;
  author: Author;
}

// Category type
export interface Category {
  id: number;
  name: string;
  label: string;
}