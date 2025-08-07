# How to Upload Your Photos to Your Website

## Option 1: Quick Manual Upload (Easiest)

### Step 1: Upload to Supabase Storage
1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/ujpvlaaitdudcawgcyik/storage/buckets
2. Click on "pureohanatreasures" bucket (or create it if it doesn't exist)
3. Click "Upload files" button
4. Select your wedding photos
5. Wait for upload to complete

### Step 2: Get the Public URL
1. After uploading, click on any photo
2. Click "Get URL" button
3. Choose "Public URL"
4. Copy the URL (it will look like: https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/your-photo.jpg)

### Step 3: Update Your Website
1. Open the file: `/src/pages/HomePageLuxury.tsx`
2. Find the image sections and replace the URLs:

```javascript
// Hero image (main background)
src="YOUR_SUPABASE_URL_HERE"

// Portfolio grid (4 images)
[
  "YOUR_PHOTO_1_URL",
  "YOUR_PHOTO_2_URL", 
  "YOUR_PHOTO_3_URL",
  "YOUR_PHOTO_4_URL"
]

// Featured wedding section
src="YOUR_FEATURED_PHOTO_URL"
```

---

## Option 2: Automatic Upload System (I'll Build This)

I can create a simple admin panel where you can:
- Drag and drop photos
- They automatically upload to Supabase
- Website updates instantly
- No code editing needed

Would you like me to build this for you?

---

## Option 3: Use Google Drive/Dropbox (Alternative)

If Supabase is tricky, you can:
1. Upload photos to Google Drive
2. Make them public
3. Get the direct link
4. Use those URLs instead

---

## Current Image Locations in Your Site:

1. **Hero Background** (main image when you land on site)
   - Line 21 in HomePageLuxury.tsx

2. **Portfolio Grid** (4 images in grid)
   - Lines 63-66 in HomePageLuxury.tsx

3. **Featured Wedding** (image with "Four Seasons Maui" text)
   - Line 127 in HomePageLuxury.tsx

---

## Need Help?

Tell me which option you prefer:
1. "Help me upload manually" - I'll walk you through it step by step
2. "Build me an upload system" - I'll create an admin panel
3. "Use my existing photos" - If you have photos already online somewhere