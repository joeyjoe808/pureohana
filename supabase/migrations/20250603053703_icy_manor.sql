/*
  # Content Management System Tables

  1. New Tables
    - `homepage_content` - For managing homepage content
    - `about_content` - For managing about page content
    - `service_pages` - For managing service page content
    - `galleries` - For managing portfolio galleries
    - `gallery_items` - For storing gallery media items
    - `navigation_items` - For managing site navigation
    - `media_library` - Central media storage
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Homepage Content Table
CREATE TABLE IF NOT EXISTS homepage_content (
  id SERIAL PRIMARY KEY,
  banner_image TEXT,
  banner_video TEXT,
  headline TEXT NOT NULL,
  intro_text TEXT,
  cta_primary_text TEXT,
  cta_primary_link TEXT,
  cta_secondary_text TEXT,
  cta_secondary_link TEXT,
  behind_scenes_text TEXT,
  behind_scenes_link TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- About Page Content Table
CREATE TABLE IF NOT EXISTS about_content (
  id SERIAL PRIMARY KEY,
  banner_image TEXT,
  headline TEXT NOT NULL,
  main_narrative TEXT NOT NULL,
  mission_statement TEXT,
  vision_statement TEXT,
  team_intro TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Service Pages Table
CREATE TABLE IF NOT EXISTS service_pages (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  headline TEXT NOT NULL,
  description TEXT NOT NULL,
  banner_image TEXT,
  content TEXT NOT NULL,
  features JSONB,
  cta_text TEXT,
  cta_link TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio Galleries Table
CREATE TABLE IF NOT EXISTS galleries (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Items Table
CREATE TABLE IF NOT EXISTS gallery_items (
  id SERIAL PRIMARY KEY,
  gallery_id INT REFERENCES galleries(id) ON DELETE CASCADE,
  media_type TEXT CHECK (media_type IN ('image', 'video')) DEFAULT 'image',
  file_path TEXT NOT NULL,
  thumbnail_path TEXT,
  title TEXT,
  caption TEXT,
  alt_text TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Media Library Table
CREATE TABLE IF NOT EXISTS media_library (
  id SERIAL PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INT,
  width INT,
  height INT,
  alt_text TEXT,
  title TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Navigation Menu Items Table
CREATE TABLE IF NOT EXISTS navigation_items (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  parent_id INT REFERENCES navigation_items(id) ON DELETE SET NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Insert default homepage content
INSERT INTO homepage_content (headline, intro_text, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link)
VALUES (
  'CAPTURING THE AUTHENTIC SPIRIT OF YOUR OHANA',
  'Beautiful family photography and films that preserve your most precious Hawaiian memories for generations to come.',
  'OUR EXPERIENCES',
  '/services',
  'VIEW OUR WORK',
  '/portfolio'
)
ON CONFLICT DO NOTHING;

-- Insert default about page content
INSERT INTO about_content (headline, main_narrative, mission_statement, vision_statement)
VALUES (
  'WE ARE STORYTELLERS & VISUAL ARTISTS',
  'With a passion for photography and a deep appreciation for Hawaiian culture, we craft visual stories that capture the essence of your ohana.',
  'To create authentic visual stories that capture the true essence of ohana. We believe every family deserves beautiful imagery that reflects their unique connections, cultural heritage, and island lifestyle.',
  'To be Hawaii''s most trusted family photography and videography studio, known for capturing authentic moments across all islands.'
)
ON CONFLICT DO NOTHING;

-- Insert default service pages
INSERT INTO service_pages (title, slug, headline, description, content, features, cta_text, cta_link)
VALUES 
  ('Luxury Portrait Sessions', 'luxury-portrait-sessions', 'LUXURY PORTRAIT SESSIONS', 'Bespoke portrait experiences at Hawaii''s most exclusive locations', 'Our luxury portrait sessions are meticulously crafted to capture your essence against paradise backdrops. Each session is tailored to your unique story and preferences.', '["Professional lighting and composition", "Multiple outfit changes", "Access to exclusive locations", "High-resolution digital images", "Print options available"]', 'BOOK A SESSION', '/contact'),
  ('Cinematic Storytelling', 'cinematic-storytelling', 'CINEMATIC STORYTELLING', 'Artfully crafted films that transcend ordinary videography', 'We blend narrative techniques with cinematic visuals to immortalize your Hawaiian experience. Our films tell compelling stories that evoke emotion and capture the essence of your time in paradise.', '["Professional cinematography", "Custom soundtrack options", "Drone aerial footage", "Professional editing and color grading", "Multiple delivery formats"]', 'DISCUSS YOUR VISION', '/contact'),
  ('Destination Weddings & Events', 'destination-weddings-events', 'DESTINATION WEDDINGS & EVENTS', 'From intimate ceremonies to grand celebrations', 'Our team documents every emotional moment and exquisite detail of your Hawaiian gathering. We understand the unique challenges and opportunities of destination events.', '["Comprehensive coverage", "Multiple photographer options", "Custom timeline planning", "Same-day preview images", "Destination expertise"]', 'START PLANNING', '/contact'),
  ('Bespoke Heirloom Collections', 'bespoke-heirloom-collections', 'BESPOKE HEIRLOOM COLLECTIONS', 'Preserve your memories in museum-quality albums and prints', 'Your memories deserve preservation in formats that will stand the test of time. Our heirloom collections combine artisanal craftsmanship with modern archival techniques.', '["Fine art albums", "Archival prints", "Custom presentation boxes", "Digital preservation", "Family legacy planning"]', 'EXPLORE OPTIONS', '/contact')
ON CONFLICT DO NOTHING;

-- Insert default galleries
INSERT INTO galleries (title, slug, description, is_featured)
VALUES 
  ('Family Beach Portraits', 'family-beach-portraits', 'Capturing ohana connections against Hawaii''s pristine beaches', true),
  ('Luxury Wedding Collection', 'luxury-wedding-collection', 'Sophisticated celebrations in paradise', true),
  ('Island Adventure Films', 'island-adventure-films', 'Cinematic family adventures across Hawaii', true)
ON CONFLICT DO NOTHING;

-- Insert default navigation items
INSERT INTO navigation_items (label, url, display_order)
VALUES 
  ('HOME', '/', 1),
  ('ABOUT', '/about', 2),
  ('SERVICES', '/services', 3),
  ('PORTFOLIO', '/portfolio', 4),
  ('BLOG', '/blog', 5),
  ('CONTACT', '/contact', 6)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security on all tables
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for authenticated users

-- Homepage Content Policies
CREATE POLICY "Authenticated users can read homepage content"
  ON homepage_content
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update homepage content"
  ON homepage_content
  FOR UPDATE
  TO authenticated
  USING (true);

-- About Content Policies
CREATE POLICY "Authenticated users can read about content"
  ON about_content
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update about content"
  ON about_content
  FOR UPDATE
  TO authenticated
  USING (true);

-- Service Pages Policies
CREATE POLICY "Authenticated users can read service pages"
  ON service_pages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert service pages"
  ON service_pages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update service pages"
  ON service_pages
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete service pages"
  ON service_pages
  FOR DELETE
  TO authenticated
  USING (true);

-- Galleries Policies
CREATE POLICY "Authenticated users can read galleries"
  ON galleries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert galleries"
  ON galleries
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update galleries"
  ON galleries
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete galleries"
  ON galleries
  FOR DELETE
  TO authenticated
  USING (true);

-- Gallery Items Policies
CREATE POLICY "Authenticated users can read gallery items"
  ON gallery_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert gallery items"
  ON gallery_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update gallery items"
  ON gallery_items
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete gallery items"
  ON gallery_items
  FOR DELETE
  TO authenticated
  USING (true);

-- Media Library Policies
CREATE POLICY "Authenticated users can read media library"
  ON media_library
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert media library items"
  ON media_library
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update media library items"
  ON media_library
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete media library items"
  ON media_library
  FOR DELETE
  TO authenticated
  USING (true);

-- Navigation Items Policies
CREATE POLICY "Authenticated users can read navigation items"
  ON navigation_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert navigation items"
  ON navigation_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update navigation items"
  ON navigation_items
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete navigation items"
  ON navigation_items
  FOR DELETE
  TO authenticated
  USING (true);

-- Add Public Read Policies for published content

-- Public can read published service pages
CREATE POLICY "Public users can read published service pages"
  ON service_pages
  FOR SELECT
  TO public
  USING (is_published = true);

-- Public can read published galleries
CREATE POLICY "Public users can read published galleries"
  ON galleries
  FOR SELECT
  TO public
  USING (is_published = true);

-- Public can read gallery items for published galleries
CREATE POLICY "Public users can read gallery items for published galleries"
  ON gallery_items
  FOR SELECT
  TO public
  USING ((SELECT is_published FROM galleries WHERE id = gallery_id) = true);

-- Public can read homepage content
CREATE POLICY "Public users can read homepage content"
  ON homepage_content
  FOR SELECT
  TO public
  USING (true);

-- Public can read about content
CREATE POLICY "Public users can read about content"
  ON about_content
  FOR SELECT
  TO public
  USING (true);

-- Public can read navigation items
CREATE POLICY "Public users can read navigation items"
  ON navigation_items
  FOR SELECT
  TO public
  USING (is_active = true);