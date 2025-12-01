-- Migration: Homepage Videos
-- Description: Stores YouTube video embeds for homepage display

-- Create homepage_videos table
CREATE TABLE IF NOT EXISTS homepage_videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    photographer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    youtube_url TEXT NOT NULL,
    title TEXT NOT NULL,
    video_type TEXT NOT NULL DEFAULT 'Highlight reel', -- e.g., "Highlight reel", "Short feature", "Full film"
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_homepage_videos_photographer ON homepage_videos(photographer_id);
CREATE INDEX IF NOT EXISTS idx_homepage_videos_display_order ON homepage_videos(display_order);
CREATE INDEX IF NOT EXISTS idx_homepage_videos_active ON homepage_videos(is_active);

-- Enable RLS
ALTER TABLE homepage_videos ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow public read access for active videos
CREATE POLICY "Anyone can view active homepage videos"
    ON homepage_videos
    FOR SELECT
    USING (is_active = true);

-- Allow authenticated users to manage their own videos
CREATE POLICY "Users can insert their own videos"
    ON homepage_videos
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = photographer_id);

CREATE POLICY "Users can update their own videos"
    ON homepage_videos
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = photographer_id)
    WITH CHECK (auth.uid() = photographer_id);

CREATE POLICY "Users can delete their own videos"
    ON homepage_videos
    FOR DELETE
    TO authenticated
    USING (auth.uid() = photographer_id);

-- Grant permissions
GRANT SELECT ON homepage_videos TO anon;
GRANT ALL ON homepage_videos TO authenticated;
