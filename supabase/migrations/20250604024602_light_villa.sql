/*
  # Enhanced Email Validation for Newsletter Subscribers
  
  1. Security Improvements
    - Create a more robust email validation function
    - Update the trigger to use this enhanced validation
    - Add constraints to prevent SQL injection attempts via email field
  
  2. Changes
    - Replace simple regex with comprehensive email validation
    - Add length validation to prevent buffer overflow attacks
    - Normalize email addresses for consistency
*/

-- Create a more robust email validation function
CREATE OR REPLACE FUNCTION is_valid_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Basic format check
  IF email !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
    RETURN FALSE;
  END IF;
  
  -- Length check to prevent attacks
  IF length(email) > 255 THEN
    RETURN FALSE;
  END IF;
  
  -- Prevent SQL injection patterns
  IF email ~* '(''|;|--|/\*|\*/|@@|char|nchar|varchar|nvarchar|alter|begin|cast|create|cursor|declare|delete|drop|exec|execute|fetch|insert|kill|open|select|sys|sysobjects|syscolumns|table|update)' THEN
    RETURN FALSE;
  END IF;
  
  -- Basic structure checks
  IF email !~ '\..' AND  -- No consecutive dots
     email !~ '@\.' AND  -- No dot after @
     email !~ '\.$' AND  -- No dot at the end
     email ~ '@.*\.' THEN -- Has @ followed by domain with dot
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update the validation trigger function
CREATE OR REPLACE FUNCTION validate_subscriber_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Trim whitespace and convert to lowercase for consistency
  NEW.email := lower(trim(NEW.email));
  
  -- Validate the email format
  IF NOT is_valid_email(NEW.email) THEN
    RAISE EXCEPTION 'Invalid email format: %. Please provide a valid email address.', NEW.email;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Make sure the trigger exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'validate_subscriber_email_trigger' 
    AND tgenabled = 'O'
  ) THEN
    DROP TRIGGER IF EXISTS validate_subscriber_email_trigger ON newsletter_subscribers;
    
    CREATE TRIGGER validate_subscriber_email_trigger
    BEFORE INSERT OR UPDATE ON newsletter_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION validate_subscriber_email();
  END IF;
END
$$;

-- Update the policy for anonymous subscribers to use the enhanced validation
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'newsletter_subscribers' 
    AND policyname = 'Anyone can subscribe to newsletter'
  ) THEN
    DROP POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers;
  END IF;
  
  CREATE POLICY "Anyone can subscribe to newsletter" 
    ON newsletter_subscribers
    FOR INSERT 
    TO anon
    WITH CHECK (is_valid_email(email));
END
$$;