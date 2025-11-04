-- ============================================
-- SERVICES MANAGEMENT SYSTEM
-- Allows creating and managing photography services
-- ============================================

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photographer_id UUID REFERENCES photographers(id) ON DELETE CASCADE,

  -- Service details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  features JSONB DEFAULT '[]'::jsonb, -- Array of feature strings
  starting_price TEXT NOT NULL,
  cover_image_url TEXT,

  -- Ordering
  display_order INTEGER DEFAULT 0,

  -- Active/inactive
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for ordering
CREATE INDEX IF NOT EXISTS idx_services_display_order
  ON services(display_order, created_at)
  WHERE is_active = true;

-- Add index for photographer
CREATE INDEX IF NOT EXISTS idx_services_photographer
  ON services(photographer_id);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active services
CREATE POLICY "Public can view active services"
  ON services FOR SELECT
  USING (is_active = true);

-- Policy: Photographers can manage their own services
CREATE POLICY "Photographers can manage own services"
  ON services FOR ALL
  USING (auth.uid() = photographer_id);

-- Success!
SELECT '✅ Services management system installed successfully!' AS status;
