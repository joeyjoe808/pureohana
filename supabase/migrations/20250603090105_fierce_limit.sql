-- Make sure we have a proper policy for anonymous users to subscribe
DO $$
BEGIN
  -- First check if the policy already exists
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'newsletter_subscribers' 
    AND policyname = 'Anyone can subscribe to newsletter'
  ) THEN
    -- Create the policy if it doesn't exist
    CREATE POLICY "Anyone can subscribe to newsletter" 
      ON newsletter_subscribers
      FOR INSERT 
      TO anon
      WITH CHECK (true);
  END IF;
  
  -- Make sure RLS is enabled
  ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
  
  -- Make sure we have policies for authenticated users too
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'newsletter_subscribers' 
    AND policyname = 'Authenticated users can view all subscribers'
  ) THEN
    CREATE POLICY "Authenticated users can view all subscribers"
      ON newsletter_subscribers
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'newsletter_subscribers' 
    AND policyname = 'Service role and authenticated users can add subscribers'
  ) THEN
    CREATE POLICY "Service role and authenticated users can add subscribers"
      ON newsletter_subscribers
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'newsletter_subscribers' 
    AND policyname = 'Service role and authenticated users can update subscribers'
  ) THEN
    CREATE POLICY "Service role and authenticated users can update subscribers"
      ON newsletter_subscribers
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'newsletter_subscribers' 
    AND policyname = 'Service role can manage all subscribers'
  ) THEN
    CREATE POLICY "Service role can manage all subscribers"
      ON newsletter_subscribers
      FOR ALL
      TO public
      WITH CHECK (true);
  END IF;
END
$$;