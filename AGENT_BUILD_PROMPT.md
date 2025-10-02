# 🤖 AGENT BUILD PROMPT - Pure Ohana Treasures Gallery

**Project**: Professional Photography Gallery Platform  
**Target**: AI Development Agents (Claude, GPT-4, etc.)  
**Purpose**: Systematic, phase-by-phase build instructions

---

## 📋 PROMPT ENGINEERING STRUCTURE

This document provides a systematic prompting system for AI agents to build the Pure Ohana Treasures gallery from scratch. Each phase has a complete prompt that can be used independently.

---

## 🎯 PROJECT CONTEXT (Include in Every Prompt)

```

- Beautiful UI (Pixieset quality + Google Photos layout)
- Mobile-first responsive design
- Print ordering via WHCC API integration
- Fast loading, professional polish
- Simple photographer workflow

TECH STACK (MANDATORY):
- Next.js 15 + TypeScript
- Tailwind CSS + shadcn/ui components
- Supabase (auth, database, storage)
- Framer Motion for animationsYou are building a professional photography gallery platform for Pure Ohana Treasures LLC, 
a Hawaiian portrait photography business. The owner (Joe) currently uses Google Drive to 
share photos but needs a professional solution with beautiful UI, client favorites, 
comments, and print ordering integration.

REQUIREMENTS:
- Handle 300-500 photos per gallery
- Stripe for payments
- WHCC for print fulfillment

DESIGN PHILOSOPHY:
- Professional, not amateur
- Fast and smooth, not janky
- Simple workflow, not complex
- Photo-focused, not UI-heavy
```

---

## 🚀 PHASE 1 PROMPT: Foundation & Core Gallery

### Complete Prompt for Agents:

```markdown
# PHASE 1: Build Pure Ohana Treasures Gallery Foundation

## OBJECTIVE
Create a working Next.js 15 app with authentication, database schema, and basic gallery viewing.

## DELIVERABLES
1. ✅ Next.js 15 project with TypeScript + Tailwind
2. ✅ Supabase integration (auth, database, storage)
3. ✅ Authentication system (photographer login)
4. ✅ Database schema (tables for galleries, photos, users)
5. ✅ Basic gallery creation and viewing
6. ✅ Photo upload (single photo to test)
7. ✅ Beautiful landing page

## DETAILED REQUIREMENTS

### 1. Project Setup
```bash
# Initialize Next.js 15 with TypeScript
npx create-next-app@latest pure-ohana-gallery --typescript --tailwind --app

# Install required dependencies
npm install @supabase/supabase-js @supabase/ssr
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install framer-motion
npm install lucide-react
npm install zustand
npm install date-fns
```

### 2. Supabase Setup

**Create these tables in Supabase:**

```sql
-- Users/Photographers table
CREATE TABLE photographers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  business_name TEXT DEFAULT 'Pure Ohana Treasures',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Galleries table
CREATE TABLE galleries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photographer_id UUID REFERENCES photographers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_photo_url TEXT,
  password_hash TEXT,
  is_public BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photos table
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  web_url TEXT NOT NULL,
  original_url TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  file_size BIGINT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE photographers ENABLE ROW LEVEL SECURITY;
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Photographers can view own data" ON photographers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Photographers can update own data" ON photographers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Photographers can manage own galleries" ON galleries
  FOR ALL USING (auth.uid() = photographer_id);

CREATE POLICY "Public can view public galleries" ON galleries
  FOR SELECT USING (is_public = true);

CREATE POLICY "Photographers can manage photos in own galleries" ON photos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM galleries 
      WHERE galleries.id = photos.gallery_id 
      AND galleries.photographer_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view photos in public galleries" ON photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM galleries 
      WHERE galleries.id = photos.gallery_id 
      AND galleries.is_public = true
    )
  );

-- Storage bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-photos', 'gallery-photos', true);

-- Storage policies
CREATE POLICY "Authenticated users can upload photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'gallery-photos' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Anyone can view photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery-photos');
```

### 3. File Structure

```
/app
  /(auth)
    /login
      page.tsx
    /signup
      page.tsx
  /(dashboard)
    /dashboard
      page.tsx
    /galleries
      /new
        page.tsx
      /[id]
        page.tsx
  /(public)
    /gallery
      /[slug]
        page.tsx
  /api
    /auth
      /callback
        route.ts
    /galleries
      /create
        route.ts
    /photos
      /upload
        route.ts
  layout.tsx
  page.tsx

/components
  /ui (shadcn components)
  /gallery
    GalleryGrid.tsx
    PhotoCard.tsx
    Lightbox.tsx
  /upload
    PhotoUploader.tsx

/lib
  /supabase
    client.ts
    server.ts
  /utils
    image-utils.ts

/types
  database.ts
  gallery.ts
```

### 4. Key Components to Build

**Landing Page (/app/page.tsx):**
- Hero section with beautiful photos
- "Sign In" / "View Demo Gallery" buttons
- Features showcase
- Professional typography and spacing

**Authentication (/app/(auth)/login/page.tsx):**
- Email/password login
- Google OAuth (optional for Phase 1)
- Clean, centered form
- Redirect to /dashboard after login

**Dashboard (/app/(dashboard)/dashboard/page.tsx):**
- Show photographer's galleries (grid view)
- "Create New Gallery" button
- Recent uploads
- Quick stats (total galleries, total photos)

**Gallery Creation (/app/(dashboard)/galleries/new/page.tsx):**
- Form: Title, Description, Password (optional), Public/Private toggle
- Auto-generate slug from title
- Save to database
- Redirect to gallery page

**Gallery Viewer (/app/(public)/gallery/[slug]/page.tsx):**
- Check password if required
- Display photos in quilted grid (Google Photos style)
- Click photo → fullscreen lightbox
- Navigation with arrow keys
- Mobile-responsive

### 5. Upload System (Basic)

**Photo Uploader Component:**
- Drag-and-drop zone
- File input
- Preview thumbnails
- Progress bar
- Upload to Supabase storage
- Save metadata to database

**Image Processing (Phase 1 - Simple):**
- Accept JPG/PNG
- Store original in Supabase
- Use Next.js Image for automatic optimization
- (Phase 2 will add server-side thumbnail generation)

### 6. Styling Guidelines

**Colors:**
```css
:root {
  --brand-blue: #0E4C92;
  --brand-orange: #FF6B35;
  --bg-cream: #FAF9F6;
  --text-dark: #1A1A1A;
}
```

**Typography:**
- Headings: font-family: 'Inter', sans-serif
- Body: system fonts
- Photo captions: 'Georgia', serif

**Components:**
- Use shadcn/ui for buttons, dialogs, dropdowns
- Smooth transitions (200-300ms)
- Hover effects on interactive elements
- Loading states for everything

### 7. Critical Success Criteria

BY END OF PHASE 1, YOU MUST HAVE:
✅ Working login (email/password)
✅ Dashboard showing galleries
✅ Create new gallery (with password protection)
✅ Upload 1-5 photos to gallery
✅ View gallery (password-protected or public)
✅ Photos display in grid
✅ Click photo → lightbox view
✅ Mobile-responsive
✅ Professional UI (looks like real product, not MVP)

### 8. Quality Standards

**Performance:**
- Page load < 2 seconds
- No layout shift (CLS)
- Smooth animations

**UI/UX:**
- No ugly default buttons
- Loading states everywhere
- Error messages friendly
- Success feedback (toasts)

**Code Quality:**
- TypeScript types for everything
- Consistent naming
- Comments on complex logic
- Clean file structure

## TESTING CHECKLIST

Before marking Phase 1 complete, test:
- [ ] Sign up new account
- [ ] Log in
- [ ] Create gallery with password
- [ ] Upload 5 photos
- [ ] View gallery in new browser (incognito)
- [ ] Enter password correctly
- [ ] View photos in grid
- [ ] Click photo → lightbox opens
- [ ] Use arrow keys to navigate
- [ ] Close lightbox
- [ ] Test on mobile (Chrome DevTools)

## NEXT PHASE PREVIEW

Phase 2 will add:
- Bulk photo upload (300-500 at once)
- Client favorites (heart button)
- Comments on photos
- Download high-res
- Gallery settings page
- Better image optimization

---

**IMPORTANT NOTES:**
- Do NOT over-engineer
- Focus on core workflow
- Make it beautiful first, optimize later
- Test as you build
- Use Supabase for everything (don't build custom auth)
```

---

## 🎨 PHASE 2 PROMPT: Client Features & Bulk Upload

### Complete Prompt for Agents:

```markdown
# PHASE 2: Add Client Interaction Features

## OBJECTIVE
Enhance gallery with bulk upload, favorites, comments, and downloads.

## DELIVERABLES
1. ✅ Bulk photo upload (300-500 photos at once)
2. ✅ Server-side image optimization (thumbnails, web-sized)
3. ✅ Client favorites (heart button)
4. ✅ Comments on photos
5. ✅ Download high-res option
6. ✅ Gallery settings page
7. ✅ Share gallery link

## DETAILED REQUIREMENTS

### 1. Bulk Upload System

**New Database Tables:**
```sql
-- Upload sessions (track progress)
CREATE TABLE upload_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
  photographer_id UUID REFERENCES photographers(id) ON DELETE CASCADE,
  total_photos INTEGER NOT NULL,
  completed_photos INTEGER DEFAULT 0,
  failed_photos INTEGER DEFAULT 0,
  status TEXT DEFAULT 'processing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Upload Flow:**
1. User selects 300 photos
2. Show upload progress (per-file and overall)
3. Upload to Supabase storage in parallel (10 at a time)
4. Generate thumbnails server-side
5. Save to database
6. Update progress bar
7. Show success message

**Image Optimization API Route:**
```typescript
// /app/api/photos/process/route.ts
// Use Sharp library to generate:
// - Thumbnail: 400px wide
// - Web: 1920px wide
// - Original: stored as-is
```

### 2. Favorites System

**Database:**
```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
  client_identifier TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(photo_id, client_identifier)
);
```

**UI:**
- Heart icon on each photo (outline when not favorited)
- Click → fills red, saves to database
- Click again → unfills, removes from database
- Show favorite count on photo
- Gallery owner sees who favorited what

**Client Identification:**
- Use localStorage + UUID for anonymous clients
- Or email if they provide it (optional)

### 3. Comments System

**Database:**
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
  client_name TEXT,
  client_email TEXT,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**UI:**
- Comment icon on each photo
- Click → modal opens with comment form
- Submit → saves to database
- Show comment count
- Photographer can see all comments in dashboard

### 4. Download System

**API Route:**
```typescript
// /app/api/photos/[id]/download/route.ts
// Stream original file from Supabase
// Track download in analytics
```

**UI:**
- Download icon on each photo (if enabled by photographer)
- Click → downloads original high-res file
- Show file size before download
- Progress indicator

### 5. Gallery Settings Page

**Features:**
- Edit title, description
- Change password
- Toggle public/private
- Enable/disable downloads
- Enable/disable comments
- Delete gallery (with confirmation)

## TESTING CHECKLIST

- [ ] Upload 100 photos at once
- [ ] All thumbnails generated correctly
- [ ] Favorite a photo (heart fills)
- [ ] Unfavorite (heart empties)
- [ ] Add comment to photo
- [ ] Comment appears in dashboard
- [ ] Download high-res photo
- [ ] Change gallery password
- [ ] Gallery settings save correctly
```

---

## 🛒 PHASE 3 PROMPT: Print Ordering & E-Commerce

### Complete Prompt for Agents:

```markdown
# PHASE 3: Add Print Ordering Integration

## OBJECTIVE
Integrate WHCC print lab API and Stripe checkout for seamless print ordering.

## DELIVERABLES
1. ✅ WHCC API integration
2. ✅ Product catalog (prints, canvas, frames, etc.)
3. ✅ Shopping cart
4. ✅ Stripe checkout
5. ✅ Order management dashboard
6. ✅ Email notifications

## DETAILED REQUIREMENTS

### 1. WHCC Integration

**Research WHCC API:**
- Sign up for WHCC pro account
- Get API credentials
- Review product catalog API
- Review order submission API

**Database:**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_type TEXT NOT NULL,
  size TEXT NOT NULL,
  lab_product_id TEXT NOT NULL,
  base_price NUMERIC(10,2) NOT NULL,
  photographer_markup NUMERIC(10,2) DEFAULT 0,
  final_price NUMERIC(10,2) GENERATED ALWAYS AS (base_price + photographer_markup) STORED,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID REFERENCES galleries(id),
  photographer_id UUID REFERENCES photographers(id),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  tax NUMERIC(10,2) DEFAULT 0,
  shipping NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  stripe_payment_intent_id TEXT,
  whcc_order_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Shopping Cart

**UI Flow:**
1. Client views photo
2. Clicks "Order Prints"
3. Modal shows product options:
   - Photo Prints (4×6, 5×7, 8×10, 11×14, 16×20)
   - Canvas (11×14, 16×20, 20×30, 24×36)
   - Framed (multiple frame styles + sizes)
   - Metal, Acrylic (premium options)
4. Select size, quantity
5. Add to cart
6. Cart icon shows count
7. Click cart → review items
8. Proceed to checkout

### 3. Stripe Integration

**Checkout Flow:**
```typescript
// /app/api/checkout/route.ts
import Stripe from 'stripe'

// Create checkout session
// Redirect to Stripe hosted checkout
// Handle success/cancel webhooks
```

**Webhook Handler:**
```typescript
// /app/api/webhooks/stripe/route.ts
// Listen for payment_intent.succeeded
// Create order in database
// Submit order to WHCC
// Send confirmation email
```

### 4. Order Management

**Photographer Dashboard:**
- View all orders
- Filter by status
- See order details
- Track WHCC fulfillment
- Mark as completed
- Export to CSV

**Client Email:**
- Order confirmation
- Shipping notification (when WHCC ships)
- Tracking number

## TESTING CHECKLIST

- [ ] Add product to cart
- [ ] Cart updates correctly
- [ ] Checkout with Stripe (test mode)
- [ ] Order appears in dashboard
- [ ] WHCC receives order (test API)
- [ ] Confirmation email sent
- [ ] Can track order status
```

---

## 🎨 PHASE 4 PROMPT: Portfolio & Polish

### Complete Prompt for Agents:

```markdown
# PHASE 4: Portfolio, Videos, and Final Polish

## OBJECTIVE
Add portfolio showcase, video support, and professional finishing touches.

## DELIVERABLES
1. ✅ Public portfolio page
2. ✅ Video upload and streaming
3. ✅ Watermark system
4. ✅ Gallery analytics
5. ✅ SEO optimization
6. ✅ Performance optimization
7. ✅ Final UI polish

## DETAILED REQUIREMENTS

### 1. Portfolio Page

**Features:**
- Curated best-of gallery
- Masonry grid layout
- Filter by category (portraits, events, landscapes)
- Full-screen previews
- Social sharing

### 2. Video System

**Upload:**
- Support MP4, MOV
- Max 5GB per video
- Progress bar

**Storage:**
- Store in Supabase/R2
- Generate thumbnail from first frame

**Playback:**
- HTML5 video player
- Custom controls
- 1080p streaming
- Download 4K option (if enabled)

### 3. Watermark System

**Implementation:**
- Upload watermark image (PNG with transparency)
- Position: center, corners, custom
- Opacity: 20-80%
- Apply on-the-fly (not permanently)
- Toggle per gallery

### 4. Analytics

**Track:**
- Gallery views
- Photo views
- Favorites count
- Downloads count
- Most popular photos

**Dashboard:**
- Charts (using Recharts)
- Date range filters
- Export reports

### 5. SEO

**Optimizations:**
- Meta tags for each gallery
- Open Graph images
- Sitemap generation
- Robots.txt
- Structured data (schema.org)

### 6. Performance

**Optimizations:**
- Image CDN (Cloudflare)
- Lazy loading
- Prefetching
- Service worker (PWA)
- Lighthouse score 90+

## TESTING CHECKLIST

- [ ] Portfolio page looks stunning
- [ ] Upload video, plays smoothly
- [ ] Watermark appears correctly
- [ ] Analytics tracking works
- [ ] Lighthouse score > 90
- [ ] SEO meta tags present
- [ ] Mobile performance good
```

---

## 🎯 SYSTEMATIC BUILD PROCESS

### How to Use These Prompts:

**Step 1: Start with Phase 1**
```
Copy the entire Phase 1 prompt → Give to AI agent → Build foundation
```

**Step 2: Review Phase 1 Output**
```
Test thoroughly → Ensure all checklist items pass → Fix any issues
```

**Step 3: Move to Phase 2**
```
Copy Phase 2 prompt → Give to AI agent → Build on top of Phase 1
```

**Step 4: Iterate**
```
Continue through all phases systematically
```

---

## ✅ QUALITY GATES

**Before Moving to Next Phase:**

1. **Code Quality:**
   - [ ] No TypeScript errors
   - [ ] No console errors
   - [ ] Proper error handling
   - [ ] Loading states everywhere

2. **UI Quality:**
   - [ ] Looks professional (not MVP-ish)
   - [ ] Smooth animations
   - [ ] Responsive design
   - [ ] Accessible (keyboard navigation)

3. **Functionality:**
   - [ ] All features work as specified
   - [ ] Edge cases handled
   - [ ] Mobile tested
   - [ ] Fast performance

---

## 🚨 COMMON PITFALLS TO AVOID

1. **Over-Engineering:**
   - Don't add features not in requirements
   - Don't build complex state management (Zustand is enough)
   - Don't optimize prematurely

2. **Under-Engineering:**
   - Don't skip error handling
   - Don't ignore loading states
   - Don't forget mobile design

3. **Database Issues:**
   - Always use RLS policies
   - Index frequently queried columns
   - Use transactions for critical operations

4. **UI Issues:**
   - Don't use default browser inputs
   - Don't skip animations
   - Don't forget dark mode (optional)

---

**Document Version:** 1.0  
**Last Updated:** 2025-09-30  
**Status:** Ready for Development  
**Usage:** Copy-paste each phase prompt to AI agents
