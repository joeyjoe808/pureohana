# 🚀 PHASE 2 GUIDE - Pure Ohana Treasures Gallery

**Prerequisites:** Phase 1 Complete ✅  
**Estimated Time:** 1-2 weeks  
**Difficulty:** Medium

---

## 📋 Phase 2 Goals

### Features to Add
1. **Bulk Upload** - Upload 300-500 photos at once
2. **Server-side Image Optimization** - Generate thumbnails with Sharp
3. **Client Favorites** - Heart button on photos
4. **Comments System** - Clients can comment on photos
5. **Download High-Res** - Optional download button
6. **Gallery Settings** - Edit/delete galleries

---

## 🗄️ Database Changes Needed

### New Tables to Create

Run this SQL in Supabase:

```sql
-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
  client_identifier TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(photo_id, client_identifier)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
  client_name TEXT,
  client_email TEXT,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Upload sessions (for tracking bulk uploads)
CREATE TABLE IF NOT EXISTS upload_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
  photographer_id UUID REFERENCES photographers(id) ON DELETE CASCADE,
  total_photos INTEGER NOT NULL,
  completed_photos INTEGER DEFAULT 0,
  failed_photos INTEGER DEFAULT 0,
  status TEXT DEFAULT 'processing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view favorites" ON favorites
  FOR SELECT USING (true);

CREATE POLICY "Anyone can add favorites" ON favorites
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can remove own favorites" ON favorites
  FOR DELETE USING (true);

CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Anyone can add comments" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Photographers can view own upload sessions" ON upload_sessions
  FOR SELECT USING (auth.uid() = photographer_id);

CREATE POLICY "Photographers can create upload sessions" ON upload_sessions
  FOR INSERT WITH CHECK (auth.uid() = photographer_id);

CREATE POLICY "Photographers can update own sessions" ON upload_sessions
  FOR UPDATE USING (auth.uid() = photographer_id);
```

### Update TypeScript Types

Add to `src/types/database.ts`:

```typescript
favorites: {
  Row: {
    id: string
    photo_id: string
    gallery_id: string
    client_identifier: string
    created_at: string
  }
  Insert: {
    id?: string
    photo_id: string
    gallery_id: string
    client_identifier: string
    created_at?: string
  }
  Update: {
    id?: string
    photo_id?: string
    gallery_id?: string
    client_identifier?: string
    created_at?: string
  }
}
comments: {
  Row: {
    id: string
    photo_id: string
    gallery_id: string
    client_name: string | null
    client_email: string | null
    comment: string
    created_at: string
  }
  Insert: {
    id?: string
    photo_id: string
    gallery_id: string
    client_name?: string | null
    client_email?: string | null
    comment: string
    created_at?: string
  }
  Update: {
    id?: string
    photo_id?: string
    gallery_id?: string
    client_name?: string | null
    client_email?: string | null
    comment?: string
    created_at?: string
  }
}
```

---

## 🔧 1. Bulk Upload Implementation

### Update PhotoUploader Component

**File:** `src/components/upload/PhotoUploader.tsx`

**Changes Needed:**
1. Increase file limit handling
2. Add parallel upload (10 files at a time)
3. Add upload session tracking
4. Better error recovery

**Key Code Snippet:**

```typescript
// Parallel upload with batching
const batchSize = 10
for (let i = 0; i < selectedFiles.length; i += batchSize) {
  const batch = selectedFiles.slice(i, i + batchSize)
  
  await Promise.all(batch.map(async (file) => {
    // Upload logic here
    const filePath = `${user.id}/${galleryId}/${fileName}`
    await supabase.storage.from('gallery-photos').upload(filePath, file)
    
    // Update progress
    completed++
    setProgress(Math.round((completed / selectedFiles.length) * 100))
  }))
}
```

---

## 🖼️ 2. Image Optimization with Sharp

### Create Image Processing API Route

**File:** `src/app/api/photos/optimize/route.ts` (NEW)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  
  if (!file) {
    return NextResponse.json({ error: 'No file' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  
  // Generate thumbnail (400px wide)
  const thumbnail = await sharp(buffer)
    .resize(400, null, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer()
  
  // Generate web version (1920px wide)
  const web = await sharp(buffer)
    .resize(1920, null, { withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer()
  
  return NextResponse.json({ 
    thumbnail: thumbnail.toString('base64'),
    web: web.toString('base64')
  })
}
```

**Update PhotoUploader to use this:**
```typescript
// Before uploading to Supabase, optimize
const formData = new FormData()
formData.append('file', file)

const response = await fetch('/api/photos/optimize', {
  method: 'POST',
  body: formData
})

const { thumbnail, web } = await response.json()

// Upload optimized versions
await supabase.storage.from('gallery-photos').upload(
  `${user.id}/${galleryId}/thumb_${fileName}`,
  Buffer.from(thumbnail, 'base64')
)
```

---

## ❤️ 3. Favorites System

### Create Favorites Component

**File:** `src/components/gallery/FavoriteButton.tsx` (NEW)

```typescript
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface FavoriteButtonProps {
  photoId: string
  galleryId: string
}

export default function FavoriteButton({ photoId, galleryId }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [count, setCount] = useState(0)
  const supabase = createClient()
  
  // Get or create client identifier
  const getClientId = () => {
    let clientId = localStorage.getItem('client_id')
    if (!clientId) {
      clientId = crypto.randomUUID()
      localStorage.setItem('client_id', clientId)
    }
    return clientId
  }

  useEffect(() => {
    loadFavorites()
  }, [photoId])

  const loadFavorites = async () => {
    const clientId = getClientId()
    
    // Check if favorited
    const { data: favorite } = await supabase
      .from('favorites')
      .select('id')
      .eq('photo_id', photoId)
      .eq('client_identifier', clientId)
      .single()
    
    setIsFavorited(!!favorite)
    
    // Get count
    const { count } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('photo_id', photoId)
    
    setCount(count || 0)
  }

  const toggleFavorite = async () => {
    const clientId = getClientId()
    
    if (isFavorited) {
      await supabase
        .from('favorites')
        .delete()
        .eq('photo_id', photoId)
        .eq('client_identifier', clientId)
      
      setIsFavorited(false)
      setCount(count - 1)
    } else {
      await supabase
        .from('favorites')
        .insert({
          photo_id: photoId,
          gallery_id: galleryId,
          client_identifier: clientId
        })
      
      setIsFavorited(true)
      setCount(count + 1)
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      className="absolute top-2 right-2 bg-white/90 backdrop-blur p-2 hover:bg-white transition"
      style={{ color: isFavorited ? '#ef4444' : '#6b7280' }}
    >
      <svg 
        className="w-5 h-5" 
        fill={isFavorited ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  )
}
```

### Add to GalleryGrid.tsx

```typescript
import FavoriteButton from './FavoriteButton'

// Inside the photo div:
<div className="relative">
  <img src={photo.thumbnail_url} alt={photo.filename} />
  <FavoriteButton photoId={photo.id} galleryId={galleryId} />
</div>
```

---

## 💬 4. Comments System

**File:** `src/components/gallery/CommentButton.tsx` (NEW)

Similar pattern to FavoriteButton, but opens a modal for text input.

**Key Features:**
- Click comment icon → Modal opens
- Form: Name (optional), Email (optional), Comment (required)
- Submit → Save to database
- Show comment count on button

---

## ⬇️ 5. Download Button

**File:** `src/components/gallery/DownloadButton.tsx` (NEW)

```typescript
'use client'

export default function DownloadButton({ photoUrl, filename }: { photoUrl: string, filename: string }) {
  const handleDownload = async () => {
    const response = await fetch(photoUrl)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <button onClick={handleDownload} className="...">
      <svg>...</svg>
      Download
    </button>
  )
}
```

Add to Lightbox or GalleryGrid as needed.

---

## ⚙️ 6. Gallery Settings Page

**File:** `src/app/galleries/[id]/settings/page.tsx` (NEW)

**Features:**
- Edit title, description
- Change password
- Toggle public/private
- Toggle download enabled
- Delete gallery (with confirmation)

---

## ⚠️ SAFETY CHECKLIST

Before starting Phase 2:

### 1. Backup Your Work
```bash
# Create git repo (instructions below)
```

### 2. Test Current State
- [ ] Everything from Phase 1 still works
- [ ] No TypeScript errors: `npm run build`
- [ ] Dev server runs: `npm run dev`

### 3. Read Existing Code
- [ ] Read `PHASE_1_COMPLETE.md`
- [ ] Understand file structure
- [ ] Review database schema
- [ ] Check Supabase connection patterns

### 4. Make Small Changes
- [ ] Add ONE feature at a time
- [ ] Test after each feature
- [ ] Commit after each working feature

### 5. Don't Break These
- [ ] Authentication system
- [ ] Existing routes
- [ ] Design system (fonts, colors, spacing)
- [ ] Supabase connection files

---

## 🎯 Recommended Order

1. **Start with SQL** - Add new tables first
2. **Update types** - Add TypeScript interfaces
3. **Favorites** - Easiest feature, good starting point
4. **Comments** - Similar to favorites
5. **Download** - Simple feature
6. **Bulk upload** - More complex
7. **Image optimization** - Most complex
8. **Gallery settings** - Final polish

---

## 🆘 If Something Breaks

### Common Issues

**1. TypeScript Errors**
```bash
npm run build
# Fix any type errors shown
```

**2. Supabase Connection Issues**
```typescript
// Always use await with server client
const supabase = await createClient()

// Check .env.local has correct keys
```

**3. CSS Not Working**
```typescript
// Use inline styles for important overrides
style={{ color: '#ffffff' }}

// Follow existing patterns from Phase 1
```

**4. Photos Not Loading**
```typescript
// Check storage bucket: gallery-photos
// Check RLS policies allow public read
// Verify publicUrl is being generated
```

### Rollback Strategy
```bash
# If you mess up, use git to revert:
git status
git diff
git checkout -- <file>  # Revert single file
git reset --hard HEAD    # Revert everything (dangerous!)
```

---

## 📚 Additional Resources

- **Supabase Docs:** https://supabase.com/docs
- **Next.js 15 Docs:** https://nextjs.org/docs
- **Sharp Image Processing:** https://sharp.pixelplumbing.com
- **Tailwind CSS:** https://tailwindcss.com/docs

---

## ✅ Success Criteria for Phase 2

You'll know Phase 2 is complete when:
- [ ] Can upload 300 photos at once
- [ ] Thumbnails are generated server-side
- [ ] Can favorite photos (heart button works)
- [ ] Can add comments to photos
- [ ] Can download high-res photos
- [ ] Can edit gallery settings
- [ ] Can delete galleries
- [ ] All Phase 1 features still work
- [ ] No TypeScript errors
- [ ] Mobile responsive

---

**Ready to start? Create your git repo first! See instructions below.** ⬇️
