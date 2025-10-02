# 🐛 FIX: Comments "Mark as Read" Not Working

## Issue
Comments marked as "read" were still showing as unread on the dashboard.

## Root Causes
1. **RLS Policy Missing** - No UPDATE policy for photographers on comments table
2. **No Cache Revalidation** - Dashboard showing stale data
3. **Silent Errors** - Errors not being displayed to user

## Fixes Applied

### 1. RLS Policy Update
**File:** `supabase-comments-rls-fix.sql`

Added UPDATE policy allowing photographers to update comments in their galleries:
```sql
CREATE POLICY "Photographers can update own gallery comments" ON comments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM galleries
      WHERE galleries.id = comments.gallery_id
      AND galleries.photographer_id = auth.uid()
    )
  );
```

### 2. Better Error Handling
**File:** `src/components/dashboard/CommentsList.tsx`

- Added error alerts to show when update fails
- Added console.error logging
- Added router.refresh() to update data

### 3. Cache Revalidation
**Files:** 
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/comments/page.tsx`

Added `export const revalidate = 0` to disable caching on these pages.

## How to Apply Fix

### Step 1: Run SQL Update
1. Go to Supabase SQL Editor
2. Run the contents of `supabase-comments-rls-fix.sql`
3. Verify policy created

### Step 2: Test the Fix
1. Refresh your browser (clear cache: Cmd+Shift+R)
2. Go to Comments page
3. Click "Mark as Read" on a comment
4. Should update immediately
5. Go back to Dashboard
6. Unread count should decrease

## Testing Checklist
- [ ] Click "Mark as Read" button
- [ ] NEW badge disappears immediately
- [ ] No error alerts appear
- [ ] Go back to dashboard
- [ ] Unread count decreases
- [ ] Click "View Photo" link
- [ ] Comment auto-marks as read
- [ ] Dashboard updates correctly

## If Still Not Working

Check browser console (F12) for errors. The error message will tell you exactly what's wrong:
- Permission denied → RLS policy issue
- Network error → Supabase connection issue
- No error but not working → Cache issue (try hard refresh)

---

**Status:** ✅ Fixed
**Date:** October 2, 2025
