-- ============================================
-- HOMEPAGE CONTENT MANAGEMENT
-- Allows editing Homepage content from admin
-- ============================================

-- Create homepage_content table
CREATE TABLE IF NOT EXISTS homepage_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photographer_id UUID REFERENCES photographers(id) ON DELETE CASCADE,

  -- Hero Section
  hero_title TEXT NOT NULL DEFAULT 'PURE OHANA TREASURES',
  hero_subtitle TEXT NOT NULL DEFAULT 'Hawaii Luxury Wedding • Photography & Cinematography',
  hero_button_text TEXT NOT NULL DEFAULT 'INQUIRE',

  -- About Section (Timeless Elegance)
  about_heading TEXT NOT NULL DEFAULT 'TIMELESS ELEGANCE',
  about_text TEXT NOT NULL DEFAULT 'For discerning couples & ohanas seeking extraordinary photography across the Hawaiian islands. We preserve your family''s unfolding story, capturing keepsake memories that deepen in meaning as your ohana grows.',

  -- Experience Section
  experience_1_title TEXT NOT NULL DEFAULT 'EXCLUSIVE ACCESS',
  experience_1_text TEXT NOT NULL DEFAULT 'Private estates, secluded beaches, and Hawaii''s most coveted locations',
  experience_2_title TEXT NOT NULL DEFAULT 'ARTISAN APPROACH',
  experience_2_text TEXT NOT NULL DEFAULT 'Each image meticulously crafted, never mass-produced',
  experience_3_title TEXT NOT NULL DEFAULT 'WHITE GLOVE SERVICE',
  experience_3_text TEXT NOT NULL DEFAULT 'Concierge-level attention from first contact through delivery',

  -- Contact Section
  contact_heading TEXT NOT NULL DEFAULT 'BEGIN YOUR STORY',
  contact_button_text TEXT NOT NULL DEFAULT 'INQUIRE',
  contact_location TEXT NOT NULL DEFAULT 'Aiea, Oahu • Serving all Hawaiian Islands',
  contact_email TEXT NOT NULL DEFAULT 'pureohanatreasures@gmail.com',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for photographer
CREATE INDEX IF NOT EXISTS idx_homepage_content_photographer
  ON homepage_content(photographer_id);

-- Enable RLS
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view homepage content
CREATE POLICY "Public can view homepage content"
  ON homepage_content FOR SELECT
  USING (true);

-- Policy: Photographers can manage their own homepage content
CREATE POLICY "Photographers can manage own homepage content"
  ON homepage_content FOR ALL
  USING (auth.uid() = photographer_id);

-- Success!
SELECT '✅ Homepage content management installed successfully!' AS status;
