-- ============================================
-- COMMENTS DASHBOARD - DATABASE UPDATE
-- Run this in Supabase SQL Editor
-- ============================================

-- Add new columns to comments table
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS photographer_reply TEXT,
ADD COLUMN IF NOT EXISTS is_liked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;

-- Add index for efficient querying of unread comments
CREATE INDEX IF NOT EXISTS idx_comments_is_read ON comments(is_read);

-- Add index for photographer queries (find comments in their galleries)
CREATE INDEX IF NOT EXISTS idx_comments_photographer 
ON comments(gallery_id, created_at DESC);

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if columns were added
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'comments' 
-- AND column_name IN ('is_read', 'photographer_reply', 'is_liked', 'replied_at');
