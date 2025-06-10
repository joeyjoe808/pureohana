/*
  # Fix newsletter subscribers table policies
  
  1. Changes
     - Checks for existing policies and drops them if they already exist
     - Recreates the policies with the same definitions
  
  2. Security
     - Maintains the same security policies for the newsletter_subscribers table
*/

-- Check if policies exist first and drop them if they do
DO $$ 
BEGIN
  -- Check and drop the SELECT policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'newsletter_subscribers' 
    AND policyname = 'Authenticated users can view all subscribers'
  ) THEN
    DROP POLICY "Authenticated users can view all subscribers" ON newsletter_subscribers;
  END IF;
  
  -- Check and drop the INSERT policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'newsletter_subscribers' 
    AND policyname = 'Service role and authenticated users can add subscribers'
  ) THEN
    DROP POLICY "Service role and authenticated users can add subscribers" ON newsletter_subscribers;
  END IF;
  
  -- Check and drop the UPDATE policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'newsletter_subscribers' 
    AND policyname = 'Service role and authenticated users can update subscribers'
  ) THEN
    DROP POLICY "Service role and authenticated users can update subscribers" ON newsletter_subscribers;
  END IF;
END $$;

-- Recreate RLS Policies
-- Allow authenticated users to read all subscribers
CREATE POLICY "Authenticated users can view all subscribers"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow service role and authenticated users to insert new subscribers
CREATE POLICY "Service role and authenticated users can add subscribers"
  ON newsletter_subscribers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow service role and authenticated users to update subscribers
CREATE POLICY "Service role and authenticated users can update subscribers"
  ON newsletter_subscribers
  FOR UPDATE
  TO authenticated
  USING (true);