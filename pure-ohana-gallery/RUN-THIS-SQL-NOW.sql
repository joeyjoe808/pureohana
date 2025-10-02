-- ============================================
-- 🔥 RUN THIS ENTIRE FILE IN SUPABASE
-- This will fix the "mark as read" issue
-- ============================================

-- STEP 1: Add missing columns (if they don't exist)
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS photographer_reply TEXT,
ADD COLUMN IF NOT EXISTS is_liked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;

-- STEP 2: Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_comments_is_read ON comments(is_read);
CREATE INDEX IF NOT EXISTS idx_comments_photographer ON comments(gallery_id, created_at DESC);

-- STEP 3: Drop old policy if exists
DROP POLICY IF EXISTS "Photographers can update own gallery comments" ON comments;

-- STEP 4: Create UPDATE policy for photographers
CREATE POLICY "Photographers can update own gallery comments" ON comments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM galleries
      WHERE galleries.id = comments.gallery_id
      AND galleries.photographer_id = auth.uid()
    )
  );

-- ============================================
-- VERIFICATION - Run these separately to check
-- ============================================

-- Check if columns were added (should return 4 rows)
-- SELECT column_name FROM information_schema.columns 
-- WHERE table_name = 'comments' 
-- AND column_name IN ('is_read', 'photographer_reply', 'is_liked', 'replied_at');

-- Check if policy exists (should return 1 row)
-- SELECT policyname FROM pg_policies 
-- WHERE tablename = 'comments' 
-- AND policyname = 'Photographers can update own gallery comments';

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
-- If no errors appeared above, you're done!
-- Now:
-- 1. Go back to browser
-- 2. Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
-- 3. Try marking comment as read
-- 4. Should work now!
-- ============================================
