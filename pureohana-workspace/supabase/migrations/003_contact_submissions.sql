-- Create contact_submissions table for inquiry management
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Client Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  -- Event Details
  event_type TEXT NOT NULL,
  event_date DATE,
  vision TEXT NOT NULL,
  referral TEXT,

  -- Tracking
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  contacted_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

-- Create indexes (drop first if they exist)
DROP INDEX IF EXISTS idx_contact_submissions_status;
DROP INDEX IF EXISTS idx_contact_submissions_created_at;
DROP INDEX IF EXISTS idx_contact_submissions_email;

CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Photographers can view all submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Photographers can update submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;

-- Policy: Only authenticated users (photographers) can view submissions
CREATE POLICY "Photographers can view all submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only authenticated users can update submissions
CREATE POLICY "Photographers can update submissions"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Anyone can insert (public contact form)
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Add comment for documentation
COMMENT ON TABLE contact_submissions IS 'Stores client inquiry submissions from the contact form';
