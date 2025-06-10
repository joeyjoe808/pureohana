/*
  # Set up Admin Authentication and Schema

  1. New Tables
    - `authors` table to store blog post authors
    - `posts` table to store blog posts
    - `categories` table to store blog post categories
    
  2. Security
    - Enable RLS on all tables
    - Create policies to control access
*/

-- Create authors table
CREATE TABLE IF NOT EXISTS authors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  category TEXT REFERENCES categories(name),
  author_id INTEGER REFERENCES authors(id),
  read_time TEXT DEFAULT '5 min read',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on tables
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authors
CREATE POLICY "Authenticated users can read authors"
  ON authors
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert authors"
  ON authors
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update authors"
  ON authors
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete authors"
  ON authors
  FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for categories
CREATE POLICY "Authenticated users can read categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for posts
CREATE POLICY "Anyone can read published posts"
  ON posts
  FOR SELECT
  USING (is_published = true OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default categories
INSERT INTO categories (name, label)
VALUES
  ('weddings', 'Weddings'),
  ('venues', 'Venues'),
  ('planning', 'Planning'),
  ('photography', 'Photography'),
  ('culture', 'Cultural Elements')
ON CONFLICT (name) DO NOTHING;

-- Insert a default author
INSERT INTO authors (name, image_url, bio)
VALUES
  ('Leilani Kealoha', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100', 'Luxury wedding photographer and creative director specializing in sophisticated celebrations across the Hawaiian islands.')
ON CONFLICT DO NOTHING;