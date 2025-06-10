/*
  # Check and update RLS policies for pureohanatreasures table
  
  1. Policies
    - Check if RLS policies exist for the table before creating them
    - Create policies for authenticated users (SELECT, INSERT, UPDATE, DELETE)
    - Create policy for public users (SELECT only)
    
  This migration ensures the table has proper RLS policies without causing errors
  if the policies already exist.
*/

-- Check if the policy exists before creating it (SELECT for authenticated)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'pureohanatreasures' 
        AND policyname = 'Authenticated users can read pureohanatreasures'
    ) THEN
        CREATE POLICY "Authenticated users can read pureohanatreasures"
          ON pureohanatreasures
          FOR SELECT
          TO authenticated
          USING (true);
    END IF;
END $$;

-- Check if the policy exists before creating it (INSERT for authenticated)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'pureohanatreasures' 
        AND policyname = 'Authenticated users can insert pureohanatreasures'
    ) THEN
        CREATE POLICY "Authenticated users can insert pureohanatreasures"
          ON pureohanatreasures
          FOR INSERT
          TO authenticated
          WITH CHECK (true);
    END IF;
END $$;

-- Check if the policy exists before creating it (UPDATE for authenticated)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'pureohanatreasures' 
        AND policyname = 'Authenticated users can update pureohanatreasures'
    ) THEN
        CREATE POLICY "Authenticated users can update pureohanatreasures"
          ON pureohanatreasures
          FOR UPDATE
          TO authenticated
          USING (true);
    END IF;
END $$;

-- Check if the policy exists before creating it (DELETE for authenticated)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'pureohanatreasures' 
        AND policyname = 'Authenticated users can delete pureohanatreasures'
    ) THEN
        CREATE POLICY "Authenticated users can delete pureohanatreasures"
          ON pureohanatreasures
          FOR DELETE
          TO authenticated
          USING (true);
    END IF;
END $$;

-- Check if the policy exists before creating it (SELECT for public)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'pureohanatreasures' 
        AND policyname = 'Public users can read pureohanatreasures'
    ) THEN
        CREATE POLICY "Public users can read pureohanatreasures"
          ON pureohanatreasures
          FOR SELECT
          TO public
          USING (true);
    END IF;
END $$;