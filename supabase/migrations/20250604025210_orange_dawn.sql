/*
  # Hero Slideshow Management System

  1. New Tables
    - `hero_slides` - Stores all slideshow slides with complete customization options
  
  2. Fields Include
    - Content fields (image URL, video URL, subtitle, title, description)
    - Styling options (colors, sizes, positions, animations)
    - Timing controls (duration, transition type, transition speed)
    - Display order and active status
  
  3. Security
    - Enable RLS with appropriate policies
*/

-- Create the hero slides table with comprehensive customization options
CREATE TABLE IF NOT EXISTS hero_slides (
  id SERIAL PRIMARY KEY,
  
  -- Content
  image_url TEXT,
  video_url TEXT,
  subtitle TEXT,
  title TEXT,
  description TEXT,
  
  -- Styling
  subtitle_color TEXT DEFAULT '#FACC15',
  title_color TEXT DEFAULT '#FFFFFF',
  description_color TEXT DEFAULT '#E5E7EB',
  subtitle_size TEXT DEFAULT 'text-sm',
  title_size TEXT DEFAULT 'heading-xl',
  description_size TEXT DEFAULT 'text-lg',
  overlay_color TEXT DEFAULT 'from-slate-900/90 to-slate-900/40',
  overlay_opacity INTEGER DEFAULT 70,
  
  -- Timing and Animation
  display_duration INTEGER DEFAULT 6000, -- milliseconds to display this slide
  transition_duration INTEGER DEFAULT 1500, -- milliseconds for fade transition
  entrance_animation TEXT DEFAULT 'fade', -- animation type: fade, slide-up, slide-down, etc.
  
  -- Call to Action
  primary_btn_text TEXT,
  primary_btn_link TEXT,
  secondary_btn_text TEXT,
  secondary_btn_link TEXT,
  
  -- Organization
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create a hero settings table for global slideshow settings
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

-- Seed with default hero settings
INSERT INTO hero_settings (id, autoplay, loop, pause_on_hover, show_indicators, show_controls) 
VALUES (1, true, true, true, true, true)
ON CONFLICT (id) DO NOTHING;

-- Add initial sample slides based on the existing hero section
INSERT INTO hero_slides (
  image_url, 
  subtitle, 
  title, 
  description, 
  display_order
)
VALUES 
  (
    'https://images.pexels.com/photos/3894874/pexels-photo-3894874.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'EXTRAORDINARY MOMENTS',
    'CAPTURING THE AUTHENTIC SPIRIT OF YOUR OHANA',
    'Beautiful family photography and films that preserve your most precious Hawaiian memories for generations to come.',
    0
  ),
  (
    '/IMG_8209.jpg',
    'HEARTFELT MOMENTS, ISLAND ROOTS',
    'CREATING TIMELESS FAMILY TREASURES',
    'Our signature approach blends artistic vision with the natural beauty of Hawaii to tell your family''s unique story.',
    1
  ),
  (
    'https://lh3.googleusercontent.com/pw/ADCreHfQYSBVl5hWYgG5Uz0HUL0a_jnGCDIX-YzPbjywYYQXOEpBfjQ6K46C1XEiGdZaHgD03ErZRZrdymKmGCdvz9YKTnfD-UHfCg-5MwFsSKGl4uj_l2s-hGmr9f1bpZhGKQyDzXVVLJJKPSl1UlmADUdr=w1920',
    'PURE OHANA MOMENTS',
    'PRESERVING YOUR LEGACY ACROSS GENERATIONS',
    'From keiki to kupuna, we document the deep connections and joy that make your family unique against Hawaii''s stunning landscapes.',
    2
  );

-- Enable RLS
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Hero Slides
CREATE POLICY "Authenticated users can read hero slides"
  ON hero_slides
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert hero slides"
  ON hero_slides
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update hero slides"
  ON hero_slides
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete hero slides"
  ON hero_slides
  FOR DELETE
  TO authenticated
  USING (true);

-- Public can read active hero slides
CREATE POLICY "Public users can read active hero slides"
  ON hero_slides
  FOR SELECT
  TO public
  USING (is_active = true);

-- Hero Settings
CREATE POLICY "Authenticated users can read hero settings"
  ON hero_settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update hero settings"
  ON hero_settings
  FOR UPDATE
  TO authenticated
  USING (true);

-- Public can read hero settings
CREATE POLICY "Public users can read hero settings"
  ON hero_settings
  FOR SELECT
  TO public
  USING (true);