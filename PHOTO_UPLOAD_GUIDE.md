# 📸 PURE OHANA TREASURES - Photo Upload Guide

## Quick Start (Admin Panel)

1. **Access the Admin Panel**
   - Go to: `http://localhost:5174/admin` (local) or `https://yoursite.com/admin` (live)
   - Password: `ohana2024`

2. **Upload Photos**
   - Click on any section (Hero, Portfolio, Featured)
   - Click "Choose File" and select your photo
   - Photo uploads instantly to Supabase

---

## Method 1: Using the Admin Panel (Easiest)

### Step 1: Login to Admin
```
URL: yourwebsite.com/admin
Password: ohana2024
```

### Step 2: Choose Section
- **Hero Section**: Main landing page image
- **Portfolio Grid**: 4 showcase images
- **Featured Section**: Recent wedding showcase

### Step 3: Upload
1. Click "Choose File"
2. Select your photo (JPG, PNG, WEBP)
3. Photo uploads automatically
4. Refresh the main site to see changes

---

## Method 2: Direct Supabase Upload

### Step 1: Login to Supabase
```
URL: https://supabase.com/dashboard/project/ujpvlaaitdudcawgcyik/storage/buckets/pureohanatreasures
```

### Step 2: Upload Files
1. Click "Upload files" button
2. Select multiple photos at once
3. Keep original filenames or rename to:
   - `hero-main.jpg` (for hero section)
   - `portfolio-1.jpg`, `portfolio-2.jpg`, etc.
   - `featured-wedding.jpg`

### Step 3: Get Public URLs
1. Click on uploaded file
2. Click "Get URL"
3. Copy the public URL

---

## Method 3: Bulk Upload via Code

### For Developers: Update Image URLs in Code

1. **Open the homepage file**:
   ```
   src/pages/HomePageLuxury.tsx
   ```

2. **Update Hero Image** (Line 21):
   ```tsx
   src="https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/hero-main.jpg"
   ```

3. **Update Portfolio Grid** (Lines 60-63):
   ```tsx
   [
     "https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/portfolio-1.jpg",
     "https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/portfolio-2.jpg",
     "https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/portfolio-3.jpg",
     "https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/portfolio-4.jpg"
   ]
   ```

4. **Update Featured Section** (Line 128):
   ```tsx
   src="https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/featured-wedding.jpg"
   ```

---

## 📝 Image Guidelines

### Recommended Sizes
- **Hero Image**: 1920x1080px (landscape)
- **Portfolio Images**: 1200x800px (3:2 ratio)
- **Featured Image**: 1000x1000px (square)

### File Formats
- **Best**: WEBP (smallest file size)
- **Good**: JPG/JPEG (universal support)
- **Okay**: PNG (larger files)

### Optimization Tips
1. Keep images under 500KB each
2. Use online compressor: https://tinypng.com
3. Name files descriptively: `maui-beach-wedding.jpg`

---

## 🚨 Troubleshooting

### Images Not Showing?
1. Check file extension (use lowercase: `.jpg` not `.JPG`)
2. Ensure bucket is public in Supabase settings
3. Clear browser cache (Cmd+Shift+R)

### Upload Failed?
1. Check file size (max 50MB)
2. Check internet connection
3. Try different browser

### Wrong Image Showing?
1. Clear browser cache
2. Check filename matches exactly
3. Wait 30 seconds for CDN to update

---

## 🎯 Quick Commands

### See your site locally:
```bash
cd ~/pureohana_website
npm run dev
# Open: http://localhost:5174
```

### Push changes to live site:
```bash
git add .
git commit -m "Updated photos"
git push
# Netlify auto-deploys in 2-3 minutes
```

### Access Supabase Dashboard:
```
https://supabase.com/dashboard/project/ujpvlaaitdudcawgcyik
```

---

## 📱 Mobile Upload

1. Email photos to yourself
2. Open admin panel on phone browser
3. Upload directly from phone gallery

---

## 🔐 Security Notes

- Admin password: `ohana2024` (change in `AdminBasic.tsx` line 8)
- Keep admin URL secret
- Photos in Supabase are public by default

---

## Need Help?

1. **Check console**: Right-click → Inspect → Console tab
2. **Check network**: Network tab shows if images are loading
3. **Contact support**: Your developer can help debug

---

Last Updated: August 2025