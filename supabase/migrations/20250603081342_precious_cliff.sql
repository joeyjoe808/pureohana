/*
  # Enhance Security with RLS and Validation

  1. Updates
    - Adding more secure RLS policies
    - Adding email validation check
    - Adding security for public access
    - Fixing newsletter subscription permissions
  
  2. Security
    - Strengthen RLS policies for all tables
    - Add validation function for email format
*/

-- Create email validation function
CREATE OR REPLACE FUNCTION is_valid_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$';
END;
$$ LANGUAGE plpgsql;

-- Add validation trigger for newsletter_subscribers
CREATE OR REPLACE FUNCTION validate_subscriber_email()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT is_valid_email(NEW.email) THEN
    RAISE EXCEPTION 'Invalid email format: %', NEW.email;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'validate_subscriber_email_trigger'
  ) THEN
    CREATE TRIGGER validate_subscriber_email_trigger
    BEFORE INSERT OR UPDATE ON newsletter_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION validate_subscriber_email();
  END IF;
END
$$;

-- Strengthen permissions for newsletter_subscribers
-- First, check if our policy for anon users exists
DO $$
BEGIN
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
      WITH CHECK (is_valid_email(email));
  ELSE
    -- Update the existing policy
    ALTER POLICY "Anyone can subscribe to newsletter" 
      ON newsletter_subscribers 
      WITH CHECK (is_valid_email(email));
  END IF;
END
$$;

-- Ensure service_role can manage subscribers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'newsletter_subscribers' 
    AND policyname = 'Service role can manage all subscribers'
  ) THEN
    CREATE POLICY "Service role can manage all subscribers" 
      ON newsletter_subscribers
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;

-- Increase security for authenticated users managing posts
ALTER POLICY "Authenticated users can insert posts" 
  ON posts 
  WITH CHECK (auth.uid() IS NOT NULL);

ALTER POLICY "Authenticated users can update posts" 
  ON posts 
  USING (auth.uid() IS NOT NULL);

ALTER POLICY "Authenticated users can delete posts" 
  ON posts 
  USING (auth.uid() IS NOT NULL);

-- Ensure all tables have RLS enabled
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl);
  END LOOP;
END
$$;