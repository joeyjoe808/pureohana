-- ============================================
-- ABOUT PAGE CONTENT MANAGEMENT
-- Allows editing About page content from admin
-- ============================================

-- Create about_content table
CREATE TABLE IF NOT EXISTS about_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photographer_id UUID REFERENCES photographers(id) ON DELETE CASCADE,

  -- Content fields
  page_title TEXT NOT NULL DEFAULT 'About Pure Ohana Treasures',
  story_heading TEXT NOT NULL DEFAULT 'Our Story',
  story_text TEXT NOT NULL,
  philosophy_heading TEXT NOT NULL DEFAULT 'Our Philosophy',
  philosophy_text TEXT NOT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for photographer
CREATE INDEX IF NOT EXISTS idx_about_content_photographer
  ON about_content(photographer_id);

-- Enable RLS
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view about content
CREATE POLICY "Public can view about content"
  ON about_content FOR SELECT
  USING (true);

-- Policy: Photographers can manage their own about content
CREATE POLICY "Photographers can manage own about content"
  ON about_content FOR ALL
  USING (auth.uid() = photographer_id);

-- Success!
SELECT '✅ About page content management installed successfully!' AS status;
