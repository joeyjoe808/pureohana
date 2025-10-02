-- ============================================
-- FIX COMMENTS RLS - Allow photographers to update
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop existing update policy if it exists
DROP POLICY IF EXISTS "Photographers can update own gallery comments" ON comments;

-- Create new policy allowing photographers to update comments in their galleries
CREATE POLICY "Photographers can update own gallery comments" ON comments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM galleries
      WHERE galleries.id = comments.gallery_id
      AND galleries.photographer_id = auth.uid()
    )
  );

-- Verify policy was created
-- SELECT * FROM pg_policies WHERE tablename = 'comments' AND policyname = 'Photographers can update own gallery comments';
