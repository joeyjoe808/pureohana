-- Fix RLS policy for anonymous public access to active promotions
-- The existing policy doesn't explicitly grant access to anon role

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Anyone can view active promotions" ON promotions;

-- Create a new policy that explicitly allows anon (public) access
CREATE POLICY "Public can view active promotions"
  ON promotions
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Add a comment
COMMENT ON POLICY "Public can view active promotions" ON promotions IS
  'Allows both anonymous users and authenticated users to view active promotions';
