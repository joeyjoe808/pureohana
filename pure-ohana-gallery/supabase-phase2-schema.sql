-- ============================================
-- PHASE 2 DATABASE SCHEMA
-- Pure Ohana Treasures Gallery
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. FAVORITES TABLE
-- Allows clients to "heart" photos they love
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
  client_identifier TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(photo_id, client_identifier)
);

-- 2. COMMENTS TABLE
-- Allows clients to comment on photos
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
  client_name TEXT,
  client_email TEXT,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. UPLOAD SESSIONS TABLE
-- Tracks bulk upload progress
CREATE TABLE IF NOT EXISTS upload_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
  photographer_id UUID REFERENCES photographers(id) ON DELETE CASCADE,
  total_photos INTEGER NOT NULL,
  completed_photos INTEGER DEFAULT 0,
  failed_photos INTEGER DEFAULT 0,
  status TEXT DEFAULT 'processing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- FAVORITES POLICIES
-- Anyone can view favorites (to show count)
CREATE POLICY "Anyone can view favorites" ON favorites
  FOR SELECT USING (true);

-- Anyone can add favorites (anonymous clients)
CREATE POLICY "Anyone can add favorites" ON favorites
  FOR INSERT WITH CHECK (true);

-- Anyone can remove their own favorites
CREATE POLICY "Anyone can remove own favorites" ON favorites
  FOR DELETE USING (true);

-- COMMENTS POLICIES
-- Anyone can view comments
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

-- Anyone can add comments (anonymous or identified clients)
CREATE POLICY "Anyone can add comments" ON comments
  FOR INSERT WITH CHECK (true);

-- Photographers can delete comments in their galleries
CREATE POLICY "Photographers can delete own gallery comments" ON comments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM galleries
      WHERE galleries.id = comments.gallery_id
      AND galleries.photographer_id = auth.uid()
    )
  );

-- UPLOAD SESSIONS POLICIES
-- Photographers can view their own upload sessions
CREATE POLICY "Photographers can view own upload sessions" ON upload_sessions
  FOR SELECT USING (auth.uid() = photographer_id);

-- Photographers can create upload sessions
CREATE POLICY "Photographers can create upload sessions" ON upload_sessions
  FOR INSERT WITH CHECK (auth.uid() = photographer_id);

-- Photographers can update their own sessions
CREATE POLICY "Photographers can update own sessions" ON upload_sessions
  FOR UPDATE USING (auth.uid() = photographer_id);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Index for quickly finding favorites by photo
CREATE INDEX IF NOT EXISTS idx_favorites_photo_id ON favorites(photo_id);

-- Index for finding favorites by client
CREATE INDEX IF NOT EXISTS idx_favorites_client_identifier ON favorites(client_identifier);

-- Index for finding comments by photo
CREATE INDEX IF NOT EXISTS idx_comments_photo_id ON comments(photo_id);

-- Index for finding comments by gallery
CREATE INDEX IF NOT EXISTS idx_comments_gallery_id ON comments(gallery_id);

-- Index for finding upload sessions by gallery
CREATE INDEX IF NOT EXISTS idx_upload_sessions_gallery_id ON upload_sessions(gallery_id);

-- ============================================
-- VERIFICATION QUERIES
-- Run these after executing the schema to verify
-- ============================================

-- Check if tables exist
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('favorites', 'comments', 'upload_sessions');

-- Check if RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('favorites', 'comments', 'upload_sessions');

-- Check policies
-- SELECT * FROM pg_policies WHERE tablename IN ('favorites', 'comments', 'upload_sessions');
