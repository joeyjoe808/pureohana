/*
  # Add newsletter subscriber policy for anonymous users
  
  1. Security Changes
     - Add RLS policy to allow anonymous users to insert into newsletter_subscribers table
     - This is necessary for the public newsletter subscription form to work
  
  This migration fixes the "new row violates row-level security policy for table newsletter_subscribers"
  error that occurs when anonymous users try to subscribe to the newsletter.
*/

-- Add policy to allow anonymous users to insert new subscribers
CREATE POLICY "Anyone can subscribe to newsletter" 
ON public.newsletter_subscribers
FOR INSERT 
TO anon
WITH CHECK (true);

-- Ensure RLS is enabled (should already be, but just to be safe)
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;