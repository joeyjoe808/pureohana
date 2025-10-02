# 🚀 START NEW SESSION - Quick Reference

**Last Session:** October 1, 2025  
**Status:** Phase 1 Complete ✅  
**Next:** Phase 2

---

## ⚡ Quick Start Checklist

### Before You Begin
1. [ ] Read `PHASE_1_COMPLETE.md` (10 min)
2. [ ] Read `PHASE_2_GUIDE.md` (15 min)
3. [ ] Set up Git repo (see `GIT_SETUP.md`)
4. [ ] Verify everything works (run dev server)

---

## 🏃 Start Development

```bash
# Navigate to project
cd /Users/joemedina/PURE_OHANA_TREASURES/website-gallery/pure-ohana-gallery

# Check git status
git status

# Start dev server
npm run dev

# Open in browser
open http://localhost:3000
```

---

## 📁 Project Structure (Quick Reference)

```
src/
├── app/                        # Pages
│   ├── page.tsx               # Landing page
│   ├── login/                 # Auth
│   ├── signup/
│   ├── dashboard/             # Photographer dashboard
│   ├── galleries/[id]/        # Gallery management
│   └── gallery/[slug]/        # Public viewer
│
├── components/
│   ├── gallery/               # GalleryGrid, Lightbox
│   └── upload/                # PhotoUploader
│
├── lib/supabase/              # DON'T MODIFY
│   ├── client.ts
│   ├── server.ts
│   └── middleware.ts
│
└── types/                     # TypeScript types
```

---

## 🔑 Critical Files - DON'T BREAK

### Never Modify These:
- `src/lib/supabase/*` - Supabase connection
- `src/middleware.ts` - Route protection
- `.env.local` - Secrets (also DON'T commit!)
- `supabase-schema.sql` - Already applied

### Modify Carefully:
- `src/app/galleries/[id]/page.tsx` - Gallery detail
- `src/components/gallery/GalleryGrid.tsx` - Photo grid
- `src/components/upload/PhotoUploader.tsx` - Upload logic

---

## 🎨 Design System (Keep Consistent!)

### Fonts
```typescript
// Headings
className="font-serif font-light tracking-tight"

// Body text  
className="font-light"

// Buttons
className="font-medium uppercase tracking-wider text-xs"
```

### Colors
```typescript
// Buttons
className="bg-gray-900 text-white hover:bg-gray-800"

// Borders
className="border border-gray-100"

// Backgrounds
className="bg-white" // or "bg-gray-50"
```

### Spacing
```typescript
// Containers
className="max-w-7xl mx-auto px-6 py-12"

// Photo grids
className="gap-1" // 4px gaps

// Cards
className="p-6" // or p-8
```

---

## 🗄️ Database Patterns

### Client-side
```typescript
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
```

### Server-side
```typescript
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient() // Note: await!
```

### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/login')
```

### Query Pattern
```typescript
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('field', value)
  .order('created_at', { ascending: false })
```

---

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Check for TypeScript errors

# Git
git status              # See what changed
git add .               # Stage all changes
git commit -m "msg"     # Commit
git push                # Push to GitHub

# Supabase (if needed)
# Go to: https://app.supabase.com
# Project: tyizffskwhhrekrxbjnr
```

---

## 🎯 Phase 2 Priority Order

1. **Add database tables** (SQL in `PHASE_2_GUIDE.md`)
2. **Favorites system** - Easiest, good warmup
3. **Comments** - Similar to favorites
4. **Download button** - Simple feature
5. **Gallery settings** - Edit/delete galleries
6. **Bulk upload** - More complex
7. **Image optimization** - Most complex (Sharp)

---

## ⚠️ Red Flags (Stop if you see these!)

### TypeScript Errors
```bash
npm run build
# If errors, fix before continuing!
```

### Can't See Button Text
```typescript
// Use inline styles for visibility
style={{ color: '#ffffff' }}
```

### Photos Not Loading
```typescript
// Check you're using correct URL field
photo.thumbnail_url  // For grid
photo.web_url        // For lightbox
photo.original_url   // For download
```

### Auth Not Working
```typescript
// Make sure using await with server client!
const supabase = await createClient() // ← await!
```

---

## 💡 Pro Tips for Next Session

1. **Make small changes** - Test after each change
2. **Commit frequently** - After each working feature
3. **Read existing code first** - Understand before modifying
4. **Copy existing patterns** - Don't reinvent the wheel
5. **Test on mobile** - Use Chrome DevTools device mode
6. **Check .env.local** - Make sure Supabase keys loaded

---

## 🆘 Emergency Contacts

### Documentation Files
- `PHASE_1_COMPLETE.md` - What was built
- `PHASE_2_GUIDE.md` - What to build next
- `GIT_SETUP.md` - Version control
- `PROJECT_ROADMAP.md` - Overall plan

### External Docs
- **Supabase:** https://supabase.com/docs
- **Next.js 15:** https://nextjs.org/docs
- **Tailwind:** https://tailwindcss.com/docs

### Supabase Project
- **URL:** https://app.supabase.com/project/tyizffskwhhrekrxbjnr
- **Project ID:** tyizffskwhhrekrxbjnr

---

## ✅ Pre-Session Verification

Run these before starting:

```bash
# 1. Check git is set up
git status

# 2. Check dependencies installed
npm list --depth=0

# 3. Check .env.local exists
cat .env.local

# 4. Start dev server
npm run dev

# 5. Test in browser
open http://localhost:3000

# 6. Can log in?
# Go to /login

# 7. Can view gallery?
# Go to dashboard, click gallery, click "View Gallery"
```

All working? ✅ **You're ready to start Phase 2!**

---

## 🎬 Session Starter Script

Copy-paste this into your terminal to start:

```bash
cd /Users/joemedina/PURE_OHANA_TREASURES/website-gallery/pure-ohana-gallery
git status
npm run dev
```

Then tell your AI assistant:

> "I'm ready to start Phase 2. I've read PHASE_1_COMPLETE.md and PHASE_2_GUIDE.md. Let's start with [favorites/comments/bulk-upload/etc]. Please read those documentation files first to understand what we've built."

---

**✅ Ready to build Phase 2! Good luck! 🌺✨**
