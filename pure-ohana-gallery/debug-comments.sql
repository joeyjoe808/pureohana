-- ============================================
-- DEBUG: Check if comments exist
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Check total comments in database
SELECT COUNT(*) as total_comments FROM comments;

-- 2. See all comments with their relationships
SELECT 
  c.id,
  c.comment,
  c.is_read,
  c.created_at,
  p.filename as photo_filename,
  g.title as gallery_title,
  g.photographer_id
FROM comments c
LEFT JOIN photos p ON c.photo_id = p.id
LEFT JOIN galleries g ON c.gallery_id = g.id
ORDER BY c.created_at DESC
LIMIT 10;

-- 3. Check if any comments have null gallery_id or photo_id
SELECT 
  COUNT(*) as comments_with_null_refs
FROM comments
WHERE photo_id IS NULL OR gallery_id IS NULL;

-- 4. Check if photos table has the comments' photo_ids
SELECT 
  c.id as comment_id,
  c.photo_id,
  p.id as photo_exists
FROM comments c
LEFT JOIN photos p ON c.photo_id = p.id
WHERE p.id IS NULL;

-- 5. Check if galleries table has the comments' gallery_ids
SELECT 
  c.id as comment_id,
  c.gallery_id,
  g.id as gallery_exists
FROM comments c
LEFT JOIN galleries g ON c.gallery_id = g.id
WHERE g.id IS NULL;
