-- ============================================
-- VERIFY COMMENTS TABLE STRUCTURE
-- Run this to check if columns exist
-- ============================================

-- Check what columns exist in comments table
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'comments'
ORDER BY ordinal_position;

-- If you DON'T see is_read, photographer_reply, is_liked, replied_at
-- Then you need to run: supabase-comments-dashboard-update.sql first!

-- Check RLS policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'comments';

-- Expected policies:
-- - Anyone can view comments
-- - Anyone can add comments  
-- - Photographers can delete own gallery comments
-- - Photographers can update own gallery comments (NEW - needs to exist!)
