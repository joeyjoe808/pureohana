-- Pure Ohana Treasures Gallery - Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Photographers table
CREATE TABLE IF NOT EXISTS photographers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  business_name TEXT DEFAULT 'Pure Ohana Treasures',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Galleries table
CREATE TABLE IF NOT EXISTS galleries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photographer_id UUID REFERENCES photographers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_photo_url TEXT,
  password_hash TEXT,
  is_public BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  web_url TEXT NOT NULL,
  original_url TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  file_size BIGINT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_galleries_photographer_id ON galleries(photographer_id);
CREATE INDEX IF NOT EXISTS idx_galleries_slug ON galleries(slug);
CREATE INDEX IF NOT EXISTS idx_photos_gallery_id ON photos(gallery_id);
CREATE INDEX IF NOT EXISTS idx_photos_position ON photos(gallery_id, position);

-- Enable Row Level Security
ALTER TABLE photographers ENABLE ROW LEVEL SECURITY;
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Photographers can view own data" ON photographers;
DROP POLICY IF EXISTS "Photographers can update own data" ON photographers;
DROP POLICY IF EXISTS "Photographers can insert own data" ON photographers;
DROP POLICY IF EXISTS "Photographers can manage own galleries" ON galleries;
DROP POLICY IF EXISTS "Public can view public galleries" ON galleries;
DROP POLICY IF EXISTS "Photographers can manage photos in own galleries" ON photos;
DROP POLICY IF EXISTS "Anyone can view photos in public galleries" ON photos;

-- RLS Policies for photographers
CREATE POLICY "Photographers can view own data" ON photographers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Photographers can update own data" ON photographers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Photographers can insert own data" ON photographers
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for galleries
CREATE POLICY "Photographers can manage own galleries" ON galleries
  FOR ALL USING (auth.uid() = photographer_id);

CREATE POLICY "Public can view public galleries" ON galleries
  FOR SELECT USING (is_public = true);

-- RLS Policies for photos
CREATE POLICY "Photographers can manage photos in own galleries" ON photos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM galleries
      WHERE galleries.id = photos.gallery_id
      AND galleries.photographer_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view photos in public galleries" ON photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM galleries
      WHERE galleries.id = photos.gallery_id
      AND galleries.is_public = true
    )
  );

-- Storage bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-photos', 'gallery-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view photos" ON storage.objects;
DROP POLICY IF EXISTS "Photographers can delete own photos" ON storage.objects;

CREATE POLICY "Authenticated users can upload photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'gallery-photos'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Anyone can view photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery-photos');

CREATE POLICY "Photographers can delete own photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'gallery-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_photographers_updated_at ON photographers;
CREATE TRIGGER update_photographers_updated_at BEFORE UPDATE ON photographers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_galleries_updated_at ON galleries;
CREATE TRIGGER update_galleries_updated_at BEFORE UPDATE ON galleries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_photos_updated_at ON photos;
CREATE TRIGGER update_photos_updated_at BEFORE UPDATE ON photos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create photographer profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.photographers (id, email, full_name, business_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'Pure Ohana Treasures'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create photographer profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Done!
SELECT 'Database schema created successfully!' AS status;
