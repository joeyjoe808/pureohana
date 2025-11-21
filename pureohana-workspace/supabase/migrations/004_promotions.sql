-- Create promotions table
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Info
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,

  -- Content
  description TEXT NOT NULL,
  terms_conditions TEXT,
  highlights TEXT[], -- Array of key selling points

  -- Pricing
  original_price TEXT,
  promotional_price TEXT NOT NULL,
  savings_text TEXT, -- e.g., "Save $500" or "30% Off"

  -- Images
  hero_image_url TEXT,
  secondary_image_url TEXT,

  -- Dates
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,

  -- Status & Settings
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  service_category TEXT, -- e.g., "Wedding", "Family", "Maternity"

  -- Tracking
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Foreign Keys
  photographer_id UUID REFERENCES photographers(id) ON DELETE CASCADE
);

-- Create index for slug lookups
CREATE INDEX idx_promotions_slug ON promotions(slug);

-- Create index for active promotions
CREATE INDEX idx_promotions_active ON promotions(is_active, valid_from, valid_until);

-- Create index for photographer
CREATE INDEX idx_promotions_photographer ON promotions(photographer_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_promotions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER set_promotions_updated_at
  BEFORE UPDATE ON promotions
  FOR EACH ROW
  EXECUTE FUNCTION update_promotions_updated_at();

-- Row Level Security (RLS)
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active promotions (for public access)
CREATE POLICY "Anyone can view active promotions"
  ON promotions
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated photographers can view all their promotions
CREATE POLICY "Photographers can view all their promotions"
  ON promotions
  FOR SELECT
  TO authenticated
  USING (photographer_id = auth.uid());

-- Policy: Authenticated photographers can insert their own promotions
CREATE POLICY "Photographers can insert their own promotions"
  ON promotions
  FOR INSERT
  TO authenticated
  WITH CHECK (photographer_id = auth.uid());

-- Policy: Authenticated photographers can update their own promotions
CREATE POLICY "Photographers can update their own promotions"
  ON promotions
  FOR UPDATE
  TO authenticated
  USING (photographer_id = auth.uid())
  WITH CHECK (photographer_id = auth.uid());

-- Policy: Authenticated photographers can delete their own promotions
CREATE POLICY "Photographers can delete their own promotions"
  ON promotions
  FOR DELETE
  TO authenticated
  USING (photographer_id = auth.uid());

-- Add comment to table
COMMENT ON TABLE promotions IS 'Stores seasonal promotions and special offers for photography services';
