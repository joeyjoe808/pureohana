/*
  # Create newsletter subscribers table

  1. New Tables
    - `newsletter_subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `source` (text)
      - `subscribed_at` (timestamptz)
      - `unsubscribed_at` (timestamptz)
      - `active` (boolean)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `newsletter_subscribers` table
    - Add policies for authenticated users
*/

-- Create the newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  source text,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  unsubscribed_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS newsletter_subscribers_email_idx ON newsletter_subscribers (email);
CREATE INDEX IF NOT EXISTS newsletter_subscribers_active_idx ON newsletter_subscribers (active);

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist to avoid the "policy already exists" error
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

-- RLS Policies
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