# How to Manage Your Photos with Supabase

## Quick Overview

Your site uses **Supabase** (a cloud database + storage service) to store and manage your photography portfolio. This lets you easily swap photos, create galleries, and update your site without touching code.

## Step 1: Set Up Supabase (One-Time Setup)

### 1.1 Create Supabase Account
1. Go to https://supabase.com
2. Sign up for a free account
3. Create a new project (name it "pureohana" or whatever you like)
4. **SAVE** your Project URL and API Key (you'll need these)

### 1.2 Add Credentials to Your Site
1. Open your project folder
2. Create a file called `.env.local` in the root folder (next to package.json)
3. Add these lines (replace with YOUR actual values):
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 1.3 Create Database Tables
1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy and paste this SQL:

```sql
-- Create galleries table
CREATE TABLE galleries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create photos table
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  width INTEGER NOT NULL DEFAULT 0,
  height INTEGER NOT NULL DEFAULT 0,
  file_size INTEGER NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_galleries_slug ON galleries(slug);
CREATE INDEX idx_galleries_published ON galleries(is_published);
CREATE INDEX idx_photos_gallery ON photos(gallery_id);
CREATE INDEX idx_photos_published ON photos(is_published);

-- Enable Row Level Security
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Allow public to VIEW published content
CREATE POLICY "Public can view published galleries"
  ON galleries FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can view published photos"
  ON photos FOR SELECT
  USING (is_published = true);

-- Allow authenticated users (you) to manage everything
CREATE POLICY "Authenticated users can manage galleries"
  ON galleries FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage photos"
  ON photos FOR ALL
  USING (auth.role() = 'authenticated');
```

4. Click **RUN** (bottom right)

### 1.4 Create Storage Buckets
1. In Supabase dashboard, click **Storage** (left sidebar)
2. Click **New Bucket**
3. Create bucket named: `photos`
   - Public: **Yes** (so your site can display them)
   - File size limit: 50MB
   - Allowed file types: image/jpeg, image/png, image/webp

## Step 2: Upload Photos (Your Daily Workflow)

### Option A: Upload via Supabase Dashboard (Easy Way)

1. **Go to Storage**
   - Click **Storage** in left sidebar
   - Click on the `photos` bucket

2. **Create Folder Structure** (organize by event/session)
   ```
   photos/
   ├── weddings/
   │   ├── smith-wedding-2024/
   │   ├── jones-wedding-2024/
   ├── portraits/
   │   ├── family-session-jan/
   ├── featured/
   ```

3. **Upload Photos**
   - Click **Upload file**
   - Select your best photos (already edited/exported)
   - They'll get a URL like: `https://your-project.supabase.co/storage/v1/object/public/photos/weddings/smith-wedding-2024/photo1.jpg`

4. **Add Photos to Database**
   - Go to **Table Editor** > **galleries**
   - Click **Insert row**
   - Fill in:
     - `title`: "Smith Wedding 2024"
     - `slug`: "smith-wedding-2024" (URL-friendly, no spaces)
     - `description`: "A beautiful beach wedding at sunset..."
     - `category`: "weddings"
     - `is_published`: true (to show on site)
     - `display_order`: 1 (controls order on homepage)

5. **Link Photos to Gallery**
   - Go to **Table Editor** > **photos**
   - Click **Insert row** for EACH photo
   - Fill in:
     - `gallery_id`: (select the gallery you just created)
     - `title`: "First Kiss"
     - `description`: "The couple's first kiss as husband and wife"
     - `url`: (paste the full URL from storage)
     - `thumbnail_url`: (same URL for now, or create smaller version)
     - `storage_key`: "weddings/smith-wedding-2024/photo1.jpg"
     - `width`: 4000 (your photo width)
     - `height`: 3000 (your photo height)
     - `file_size`: 5242880 (in bytes)
     - `is_published`: true
     - `display_order`: 1

### Option B: Upload via Admin Panel (Once You Build It)

Your site has an admin panel at `/admin` where you can:
- Create galleries
- Upload photos with drag & drop
- Reorder photos
- Publish/unpublish content
- All in a nice UI!

## Step 3: Swap Photos (Easy!)

### To Replace a Photo in a Gallery:

**Method 1: Replace the file in Storage**
1. Go to **Storage** > `photos`
2. Navigate to the photo
3. Click the **...** menu > **Delete**
4. Upload new photo with **same filename**
5. Your site automatically shows the new one!

**Method 2: Update the database**
1. Go to **Table Editor** > **photos**
2. Find the photo row you want to change
3. Click to edit
4. Change the `url` to point to your new photo
5. Click **Save**

### To Reorder Photos:
1. Go to **Table Editor** > **photos**
2. Find photos in the gallery
3. Change their `display_order` numbers
   - Lower numbers = shown first
   - Example: 1, 2, 3, 4...

### To Add a Photo to "Featured":
1. Upload photo to Storage
2. Add row in **photos** table
3. Set `is_published` to **true**
4. Your homepage will show it!

### To Remove a Photo:
1. Go to **Table Editor** > **photos**
2. Find the photo
3. Set `is_published` to **false** (hides it, keeps it in database)
   - OR click **Delete** to remove completely

## Step 4: How Your Site Displays Photos

Your site uses these files to fetch and display photos:

- **Homepage**: Shows photos with `category = 'featured'` and `is_published = true`
- **Portfolio Page**: Shows all published galleries ordered by `display_order`
- **Gallery Page**: Shows all published photos in that gallery

The magic happens in `src/hooks/useSupabaseData.ts` which automatically:
- Fetches published content only
- Caches it for fast loading
- Updates when you change data
- Handles errors gracefully

## Pro Tips for Your Workflow

### 1. Organize by Session/Event
```
photos/
├── featured/            ← Your BEST hero shots
├── weddings/
│   ├── 2024-01-smith/
│   ├── 2024-02-jones/
├── portraits/
│   ├── 2024-01-family-beach/
├── engagement/
```

### 2. Photo Naming Convention
Use descriptive names:
- ✅ `bride-groom-sunset-kiss.jpg`
- ✅ `family-portrait-beach-golden-hour.jpg`
- ❌ `DSC_0001.jpg`
- ❌ `IMG_4532.jpg`

### 3. Export Settings (Recommended)
- **Format**: JPEG (best compatibility)
- **Size**: 2000-3000px on longest side (good balance of quality/speed)
- **Quality**: 85% (looks great, loads fast)
- **Color Space**: sRGB (for web)

### 4. Create Thumbnails (Optional but Recommended)
- Export a smaller version (800px) for faster loading
- Upload to `photos/thumbnails/same-name.jpg`
- Use in `thumbnail_url` field

### 5. Featured Gallery Strategy
Create a gallery called "featured" with your absolute BEST 6-12 photos:
- Mix of different types (wedding, portrait, detail)
- Showcase your range and style
- Update seasonally or after amazing shoots

## Quick Commands

### To Switch to This New Architecture:
```bash
cd pureohana/src
cp main.tsx.backup-luxury main.tsx.backup-old
cp main.tsx.backup-new main.tsx
# (Note: We need to find the right "new" version)
```

### To Start Development Server:
```bash
cd pureohana
npm run dev
```

### To Check Supabase Connection:
Open browser console and look for:
- ✅ "Supabase client initialized"
- ❌ "Supabase error" or CORS issues

## Troubleshooting

### Photos Not Showing?
1. Check `is_published` is **true** in database
2. Check photo URL is publicly accessible
3. Check browser console for errors
4. Verify `.env.local` has correct credentials

### "Access Denied" Error?
1. Check Row Level Security policies
2. Make sure bucket is **Public**
3. Check authentication status

### Slow Loading?
1. Reduce photo file sizes
2. Use thumbnails for gallery views
3. Enable caching in Supabase settings

## Next Steps

1. ✅ Set up Supabase account
2. ✅ Create database tables
3. ✅ Create storage bucket
4. ✅ Upload your first 6 featured photos
5. ✅ Create "featured" gallery
6. ✅ Test on your site!

---

**Questions?** Check `DATA_ARCHITECTURE_SETUP.md` for technical details.
