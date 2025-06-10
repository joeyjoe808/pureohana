/*
  # Hero Section Tables and Policies
  
  1. New Tables
    - `hero_slides` - For storing homepage hero slide content
    - `hero_settings` - For global hero slideshow settings
  
  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for both authenticated and public users
    - Add sample data
*/

-- Hero Slides Table
CREATE TABLE IF NOT EXISTS hero_slides (
  id SERIAL PRIMARY KEY,
  image_url TEXT,
  video_url TEXT,
  subtitle TEXT,
  title TEXT,
  description TEXT,
  subtitle_color TEXT DEFAULT '#FACC15',
  title_color TEXT DEFAULT '#FFFFFF',
  description_color TEXT DEFAULT '#E5E7EB',
  subtitle_size TEXT DEFAULT 'text-sm',
  title_size TEXT DEFAULT 'heading-xl',
  description_size TEXT DEFAULT 'text-lg',
  overlay_color TEXT DEFAULT 'from-slate-900/90 to-slate-900/40',
  overlay_opacity INTEGER DEFAULT 70,
  display_duration INTEGER DEFAULT 6000,
  transition_duration INTEGER DEFAULT 1500,
  entrance_animation TEXT DEFAULT 'fade',
  primary_btn_text TEXT,
  primary_btn_link TEXT,
  secondary_btn_text TEXT,
  secondary_btn_link TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Hero Settings Table
CREATE TABLE IF NOT EXISTS hero_settings (
  id SERIAL PRIMARY KEY,
  autoplay BOOLEAN DEFAULT true,
  loop BOOLEAN DEFAULT true,
  pause_on_hover BOOLEAN DEFAULT true,
  show_indicators BOOLEAN DEFAULT true,
  show_controls BOOLEAN DEFAULT true,
  default_transition_type TEXT DEFAULT 'fade',
  default_display_duration INTEGER DEFAULT 6000,
  default_transition_duration INTEGER DEFAULT 1500,
  mobile_height TEXT DEFAULT 'h-screen',
  desktop_height TEXT DEFAULT 'h-screen',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for hero_slides - only if they don't exist
DO $$
BEGIN
  -- Check if the SELECT policy exists for authenticated users
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'hero_slides' 
    AND policyname = 'Authenticated users can read hero slides'
  ) THEN
    CREATE POLICY "Authenticated users can read hero slides"
      ON hero_slides
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
  
  -- Check if the INSERT policy exists for authenticated users
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'hero_slides' 
    AND policyname = 'Authenticated users can insert hero slides'
  ) THEN
    CREATE POLICY "Authenticated users can insert hero slides"
      ON hero_slides
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
  
  -- Check if the UPDATE policy exists for authenticated users
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'hero_slides' 
    AND policyname = 'Authenticated users can update hero slides'
  ) THEN
    CREATE POLICY "Authenticated users can update hero slides"
      ON hero_slides
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
  
  -- Check if the DELETE policy exists for authenticated users
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'hero_slides' 
    AND policyname = 'Authenticated users can delete hero slides'
  ) THEN
    CREATE POLICY "Authenticated users can delete hero slides"
      ON hero_slides
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
  
  -- Check if the SELECT policy exists for public users
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'hero_slides' 
    AND policyname = 'Public users can read active hero slides'
  ) THEN
    CREATE POLICY "Public users can read active hero slides"
      ON hero_slides
      FOR SELECT
      TO public
      USING (is_active = true);
  END IF;
END $$;

-- Create RLS Policies for hero_settings - only if they don't exist
DO $$
BEGIN
  -- Check if the SELECT policy exists for authenticated users
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'hero_settings' 
    AND policyname = 'Authenticated users can read hero settings'
  ) THEN
    CREATE POLICY "Authenticated users can read hero settings"
      ON hero_settings
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
  
  -- Check if the UPDATE policy exists for authenticated users
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'hero_settings' 
    AND policyname = 'Authenticated users can update hero settings'
  ) THEN
    CREATE POLICY "Authenticated users can update hero settings"
      ON hero_settings
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
  
  -- Check if the SELECT policy exists for public users
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'hero_settings' 
    AND policyname = 'Public users can read hero settings'
  ) THEN
    CREATE POLICY "Public users can read hero settings"
      ON hero_settings
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

-- Insert default hero settings
INSERT INTO hero_settings (
  autoplay, 
  loop, 
  pause_on_hover, 
  show_indicators, 
  show_controls, 
  default_transition_type, 
  default_display_duration, 
  default_transition_duration, 
  mobile_height, 
  desktop_height
) VALUES (
  true, 
  true, 
  true, 
  true, 
  true, 
  'fade', 
  6000, 
  1500, 
  'h-screen', 
  'h-screen'
) ON CONFLICT DO NOTHING;

-- Insert sample hero slide
INSERT INTO hero_slides (
  image_url,
  subtitle,
  title,
  description,
  primary_btn_text,
  primary_btn_link,
  secondary_btn_text,
  secondary_btn_link,
  display_order,
  is_active
) VALUES (
  'https://images.pexels.com/photos/3894874/pexels-photo-3894874.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'EXTRAORDINARY MOMENTS',
  'CAPTURING THE AUTHENTIC SPIRIT OF YOUR OHANA',
  'Beautiful family photography and films that preserve your most precious Hawaiian memories for generations to come.',
  'OUR EXPERIENCES',
  '#services-section',
  'VIEW OUR WORK',
  '#portfolio-section',
  0,
  true
) ON CONFLICT DO NOTHING;