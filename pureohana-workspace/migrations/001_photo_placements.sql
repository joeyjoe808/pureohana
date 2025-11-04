-- ============================================
-- PHOTO PLACEMENT SYSTEM
-- Allows mapping photos to different website sections
-- ============================================

-- Create photo_placements table
CREATE TABLE IF NOT EXISTS photo_placements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,

  -- Where this photo should appear
  section_key TEXT NOT NULL,  -- e.g., 'homepage_hero', 'homepage_grid_1', 'portfolio', 'about_hero'

  -- Ordering within that section
  sort_order INTEGER DEFAULT 0,

  -- Active/inactive (allows hiding without deleting)
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one photo can only appear once per section
  UNIQUE(photo_id, section_key)
);

-- Add index for fast lookups by section
CREATE INDEX IF NOT EXISTS idx_photo_placements_section ON photo_placements(section_key, sort_order) WHERE is_active = true;

-- Add index for fast lookups by photo
CREATE INDEX IF NOT EXISTS idx_photo_placements_photo ON photo_placements(photo_id);

-- Add RLS (Row Level Security)
ALTER TABLE photo_placements ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active placements (for public pages)
CREATE POLICY "Public can view active placements"
  ON photo_placements
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated photographers can manage all placements
CREATE POLICY "Photographers can manage placements"
  ON photo_placements
  FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- AVAILABLE SECTIONS (Documentation)
-- ============================================

COMMENT ON TABLE photo_placements IS 'Maps photos to website sections for dynamic content management';

COMMENT ON COLUMN photo_placements.section_key IS
'Available sections:
  - homepage_hero: Main hero image on homepage
  - homepage_grid_1: First image in homepage grid
  - homepage_grid_2: Second image in homepage grid
  - homepage_grid_3: Third image in homepage grid
  - homepage_grid_4: Fourth image in homepage grid
  - portfolio: Public portfolio page
  - about_hero: About page header
  - about_grid: About page photo grid
  - services_hero: Services page header
  - blog_default: Default blog post cover image
';

-- ============================================
-- HELPER FUNCTION: Get photos for a section
-- ============================================

CREATE OR REPLACE FUNCTION get_section_photos(section TEXT)
RETURNS TABLE (
  photo_id UUID,
  filename TEXT,
  thumbnail_url TEXT,
  web_url TEXT,
  original_url TEXT,
  sort_order INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.filename,
    p.thumbnail_url,
    p.web_url,
    p.original_url,
    pp.sort_order
  FROM photos p
  INNER JOIN photo_placements pp ON p.id = pp.photo_id
  WHERE pp.section_key = section
    AND pp.is_active = true
  ORDER BY pp.sort_order ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_section_photos(TEXT) TO anon, authenticated;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Photo Placement System installed successfully!';
  RAISE NOTICE '📸 You can now assign photos to website sections';
  RAISE NOTICE '🎨 Available sections: homepage_hero, homepage_grid_*, portfolio, about_*, services_hero';
END $$;
