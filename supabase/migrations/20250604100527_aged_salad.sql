/*
  # Create storage bucket and policies for media uploads
  
  1. Storage
     - Creates a 'media' bucket for file uploads
     - Sets up proper security policies
  
  2. Security
     - Authenticated users can upload, view, update, and delete files
     - Anonymous users can view files (for public display)
*/

-- Create the media bucket if it doesn't exist
DO $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT FROM storage.buckets WHERE name = 'media'
  ) INTO bucket_exists;
  
  IF NOT bucket_exists THEN
    PERFORM storage.create_bucket('media'::text, 'Public media bucket for the website'::text);
  END IF;
END $$;

-- Policy for authenticated users to upload files
DO $$
BEGIN
  PERFORM storage.create_policy(
    'media',
    'authenticated_upload',
    'INSERT',
    'authenticated',
    storage.foldername(name) = 'media',
    true
  );
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Policy already exists or could not be created: %', SQLERRM;
END $$;

-- Policy for authenticated users to view files
DO $$
BEGIN
  PERFORM storage.create_policy(
    'media',
    'authenticated_select',
    'SELECT',
    'authenticated',
    true,
    true
  );
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Policy already exists or could not be created: %', SQLERRM;
END $$;

-- Policy for authenticated users to update files
DO $$
BEGIN
  PERFORM storage.create_policy(
    'media',
    'authenticated_update',
    'UPDATE',
    'authenticated',
    true,
    true
  );
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Policy already exists or could not be created: %', SQLERRM;
END $$;

-- Policy for authenticated users to delete files
DO $$
BEGIN
  PERFORM storage.create_policy(
    'media',
    'authenticated_delete',
    'DELETE',
    'authenticated',
    true,
    true
  );
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Policy already exists or could not be created: %', SQLERRM;
END $$;

-- Policy for anonymous users to view files
DO $$
BEGIN
  PERFORM storage.create_policy(
    'media',
    'public_select',
    'SELECT',
    'anon',
    true,
    true
  );
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Policy already exists or could not be created: %', SQLERRM;
END $$;