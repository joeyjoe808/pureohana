# 🌺 PURE OHANA TREASURES - Gallery Requirements

**Project**: Professional Photography Gallery Platform  
**Business**: Pure Ohana Treasures LLC  
**Owner**: Joe Medina  
**Purpose**: All-in-one gallery for delivering photos, enabling client selection, and selling prints

---

## 📋 EXECUTIVE SUMMARY

**What You Do:**
- Island portrait sessions (candid family photography)
- Adventure films & story videos
- Events, luaus, special days
- Custom memory treasures (albums, keepsakes)

**Current Workflow:**
1. Shoot → Transfer to SSD
2. Edit in Lightroom (photos) / Final Cut Pro (videos)
3. Upload best shots to Google Drive
4. Share link with clients
5. Manually handle print orders

**The Problem:**
- Not professional
- No print ordering integration
- Labor-intensive manual process
- Videos limited to YouTube quality

**The Goal:**
Build a beautiful, professional gallery where clients can view, favorite, comment, download, and order prints - all in one place.

---

## 🎯 CORE REQUIREMENTS

### 1. Gallery Management (Photographer Side)

**Upload & Organization:**
- ✅ Upload 300-500 photos per gallery
- ✅ Bulk upload with drag-and-drop
- ✅ Auto-generate thumbnails and optimized versions
- ✅ Organize by date, event, client
- ✅ Sort photos within gallery (manual reordering)
- ✅ Add watermarks (toggle on/off per gallery)

**Gallery Settings:**
- ✅ Password protection (unique code per gallery)
- ✅ Public galleries (portfolio showcase)
- ✅ Permanent URLs (never expire)
- ✅ Gallery descriptions/titles
- ✅ Cover photo selection

**Video Integration:**
- ✅ Upload videos (1080p minimum)
- ✅ Stream in gallery
- ✅ Offer 4K downloads
- ✅ Video thumbnails/previews

---

### 2. Client Experience

**Viewing Experience:**
Based on research: Combine Pixieset's beautiful UI + Google Photos' quilted layout + Pic-Time's modern features

**Gallery Layout Options:**
- ✅ **Quilted Grid** (Google Photos style) - Emphasizes hero shots
- ✅ **Masonry Grid** (Pinterest style) - Optimizes space, varying heights
- ✅ **Uniform Grid** (Classic) - Clean, organized look
- ✅ **Fullscreen Lightbox** - Immersive viewing

**Client Actions:**
- ✅ View password-protected or public galleries
- ✅ Click photos for fullscreen view
- ✅ Navigate with arrow keys / swipe gestures
- ✅ Zoom in/out on photos
- ✅ Favorite/heart photos
- ✅ Comment on specific photos
- ✅ Download high-res versions (if enabled)
- ✅ Share gallery link
- ✅ Mobile-optimized experience

**Performance:**
- ✅ Fast loading (progressive image loading)
- ✅ Lazy loading (load images as you scroll)
- ✅ Optimized thumbnails for speed
- ✅ Smooth animations (Framer Motion)

---

### 3. Print Ordering & E-Commerce

**Research Finding:** Best photographers use WHCC or Printful for print fulfillment

**Print Products to Offer:**
Based on industry standards:
- ✅ **Photo Prints** (4×6" to 30×40")
- ✅ **Canvas Prints** (gallery-wrapped)
- ✅ **Framed Prints** (multiple frame options)
- ✅ **Metal Prints** (modern, vibrant)
- ✅ **Acrylic Prints** (high-end)
- ✅ **Photo Books / Albums**
- ✅ **Custom Products** (mugs, puzzles, t-shirts, blankets)

**Ordering Flow:**
1. Client views gallery
2. Selects photo
3. Clicks "Order Prints"
4. Chooses product type (print, canvas, frame, etc.)
5. Selects size
6. Adds to cart
7. Checkout via Stripe
8. Order auto-sent to print lab (WHCC or Printful)
9. Lab ships directly to client
10. You get notified + commission

**Pricing Strategy:**
- ✅ Lab base price + your markup (15-40% industry standard)
- ✅ Set prices per product type/size
- ✅ Package deals (ex: "20 prints for $X")
- ✅ Digital download pricing

**Payment:**
- ✅ Stripe integration
- ✅ Secure checkout
- ✅ Order confirmation emails
- ✅ Track order status

---

### 4. Portfolio Integration

**Website Integration:**
- ✅ Each photo has permanent URL
- ✅ Embed galleries in your website
- ✅ Showcase best work in portfolio section
- ✅ Gallery URLs shareable on social media

**Portfolio Features:**
- ✅ Curated "best of" galleries
- ✅ Public showcase page
- ✅ SEO-optimized (Google can find your work)
- ✅ Custom branding (Pure Ohana Treasures style)

---

## 📊 SCALE REQUIREMENTS

**Volume:**
- 5 galleries per month
- 300-500 photos per gallery
- 50+ galleries active at once
- Galleries stay online forever

**Storage Calculation:**
- 5 galleries/month × 400 photos avg = 2,000 photos/month
- At 10MB per photo raw + thumbnails = ~25GB/month
- Annual: 300GB+
- **Recommendation:** Supabase Pro plan (100GB) + R2 overflow storage

---

## 🎨 UI/UX DESIGN REQUIREMENTS

**Design Philosophy:**
"Rich, detailed, professional - like Pixieset, but with Google Photos' clean interface"

**Priority Rankings (ALL rated 5/5 - everything matters!):**
1. ⭐⭐⭐⭐⭐ Beautiful, professional look
2. ⭐⭐⭐⭐⭐ Easy for YOU to upload/manage
3. ⭐⭐⭐⭐⭐ Easy for CLIENTS to view/order
4. ⭐⭐⭐⭐⭐ Mobile-friendly
5. ⭐⭐⭐⭐⭐ Fast photo loading

**Visual Design:**
Based on research-backed best practices:

**Color Palette:**
- Primary: Deep ocean blue (trust, professional)
- Secondary: Warm sunset orange (Hawaiian warmth)
- Accent: White/cream (clean, photo-focused)
- Dark mode option

**Typography:**
- Headings: Modern sans-serif (Inter, Outfit)
- Body: Readable sans-serif (system fonts)
- Photo captions: Elegant serif option

**Layout Features:**
- ✅ Quilted grid (Google Photos style) - hero shots stand out
- ✅ White space (photos breathe)
- ✅ Smooth animations (not jarring)
- ✅ Glass-morphism effects (modern, premium feel)
- ✅ Micro-interactions (heart animation, hover effects)

**Mobile Experience:**
- ✅ Touch-optimized (swipe, pinch-zoom)
- ✅ Bottom navigation (thumb-friendly)
- ✅ Progressive Web App (install on phone)
- ✅ Offline viewing (cache favorites)

---

## 🔧 TECHNICAL REQUIREMENTS

**Must-Have Features:**

### Core Functionality:
1. **Authentication**
   - Photographer login (OAuth + email/password)
   - Gallery password protection (unique codes)
   - Guest access (view without account)

2. **Image Processing**
   - Auto-generate 3 versions: thumbnail (400px), web (1920px), original
   - Preserve EXIF data
   - Watermark overlay (if enabled)
   - Format: WebP for web, JPG/PNG for downloads

3. **Video Handling**
   - Stream 1080p in browser
   - Store 4K original
   - Video thumbnails
   - HLS streaming for smooth playback

4. **Database**
   - PostgreSQL (via Supabase)
   - Tables: users, galleries, photos, videos, favorites, comments, orders
   - Relationships maintained
   - Indexes on frequently queried fields

5. **Storage**
   - Supabase Storage for primary hosting
   - Cloudflare R2 for overflow (cheaper)
   - CDN for fast global delivery
   - Automatic backups

6. **Print Fulfillment**
   - WHCC API integration (preferred for quality)
   - Printful as backup option
   - Real-time pricing sync
   - Automated order submission
   - Tracking updates

7. **Performance**
   - Images load in <2 seconds
   - Lighthouse score: 90+
   - Core Web Vitals: all green
   - Lazy loading
   - Image caching

---

## 📱 FEATURE BREAKDOWN

### Phase 1: Core Gallery (MVP - Week 1-2)
**Must launch with:**
- [ ] User auth (photographer login)
- [ ] Create galleries
- [ ] Upload photos (bulk, 300-500 at once)
- [ ] Auto-generate thumbnails
- [ ] Gallery URLs with passwords
- [ ] Beautiful quilted grid view
- [ ] Fullscreen lightbox
- [ ] Mobile-responsive

### Phase 2: Client Interaction (Week 3)
**Add next:**
- [ ] Client favorites (heart button)
- [ ] Comments on photos
- [ ] Download high-res (if enabled)
- [ ] Share gallery link
- [ ] Gallery settings (password, public/private)

### Phase 3: Print Ordering (Week 4)
**E-commerce:**
- [ ] WHCC integration
- [ ] Product catalog (prints, canvas, frames)
- [ ] Shopping cart
- [ ] Stripe checkout
- [ ] Order management
- [ ] Email notifications

### Phase 4: Portfolio & Polish (Week 5)
**Professional features:**
- [ ] Public portfolio page
- [ ] Best work showcase
- [ ] Video upload/streaming
- [ ] Watermark system
- [ ] Gallery analytics
- [ ] Custom branding

---

## 🎯 SUCCESS CRITERIA

**The app is successful when:**

1. ✅ **You can sign in easily** (Google auth or email/password)
2. ✅ **Upload 400 photos in <5 minutes**
3. ✅ **Gallery looks stunning** (better than Google Drive link)
4. ✅ **Client opens link, enters password, sees beautiful gallery**
5. ✅ **Client can favorite photos** (hearts visible to you)
6. ✅ **Client can order prints** (seamless Stripe checkout)
7. ✅ **Print order auto-sends to WHCC** (no manual work)
8. ✅ **You get paid** (Stripe → your account)
9. ✅ **Gallery URLs work forever** (permanent links)
10. ✅ **Mobile experience is flawless** (60% of clients on mobile)

**Business Impact:**
- Save 5+ hours per week (no manual ordering)
- Increase revenue 30-50% (upsell prints)
- Professional brand image
- Client satisfaction increases
- Referrals increase

---

## 🚫 OUT OF SCOPE (Not Needed)

- Multi-user photographer accounts
- Complex analytics dashboard
- Video editing tools
- Contract management
- Invoicing system (use separate tool)
- Client CRM (use separate tool)
- Booking calendar
- Payment plans
- Gift cards
- Subscription tiers

**Keep it focused:** Gallery viewing + Print ordering = Core value

---

## 🌟 RESEARCH-BACKED ENHANCEMENTS

Based on top platform analysis:

**From Pic-Time (highest rated):**
- ✅ AI-powered smart collections (auto-group similar photos)
- ✅ Marketing automation (abandoned cart emails)
- ✅ Client dashboard (see all their galleries)

**From Pixieset (best UI):**
- ✅ Drag-and-drop gallery builder
- ✅ Simple, beautiful client interface
- ✅ Zero commission on Pro account

**From ShootProof (best business tools):**
- ✅ Automated email notifications
- ✅ Generous photo storage
- ✅ Template galleries

**From Google Photos (best UX):**
- ✅ Quilted grid layout
- ✅ Lightning-fast scrolling
- ✅ Intuitive navigation
- ✅ Smart zoom/crop

**Industry Best Practices:**
- ✅ High-resolution assets (crisp, professional)
- ✅ Consistent visual quality
- ✅ 90% of information is visual (prioritize images)
- ✅ White space (don't crowd)
- ✅ iOS-style pinch-to-zoom
- ✅ Keyboard shortcuts (arrow keys, escape)

---

## 📐 TECHNICAL ARCHITECTURE

**Stack:**
- **Frontend:** Next.js 15 + TypeScript + Tailwind + Framer Motion
- **Backend:** Next.js API Routes + Supabase
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth (OAuth + password)
- **Storage:** Supabase Storage + Cloudflare R2
- **Payments:** Stripe
- **Print Lab:** WHCC API
- **Deployment:** Vercel
- **CDN:** Cloudflare

**Why This Stack:**
- Modern, proven, widely supported
- Fast development time
- Scales automatically
- Low cost at your volume
- Professional results

---

## 💰 ESTIMATED MONTHLY COSTS

**At your scale (5 galleries/month, 2000 photos/month):**

- **Supabase Pro:** $25/month (100GB storage, PostgreSQL DB)
- **Cloudflare R2:** ~$5/month (overflow storage, egress free)
- **Vercel Pro:** $20/month (hosting, edge functions)
- **Stripe:** 2.9% + $0.30 per transaction
- **Domain:** $12/year (~$1/month)

**Total:** ~$51/month + transaction fees

**ROI Calculation:**
- Save 5 hours/week manual work = 20 hours/month
- At $50/hour value = $1,000/month saved
- Upsell 5 print orders/month at $50 profit = $250/month
- **Net benefit:** ~$1,200/month for $51 cost

---

## 🎨 BRANDING GUIDELINES

**Pure Ohana Treasures Visual Identity:**

**Logo:** (Your existing logo)
**Tagline:** "Island memories, beautifully delivered"

**Brand Voice:**
- Warm, professional, island-inspired
- Not too casual, not too formal
- Emphasis on family, memories, aloha spirit

**Photography Style:**
- Natural light, candid moments
- Vibrant island colors
- Authentic emotions
- Professional polish

---

## 📝 NEXT STEPS

1. **Review this document** - Ensure everything matches your vision
2. **Create Agent Build Prompt** - Detailed instructions for AI agents
3. **Create Technical Specification** - Developer-ready docs
4. **Create Development Roadmap** - Step-by-step build plan
5. **Start Building** - Phase 1 (Core Gallery MVP)

---

**Document Version:** 1.0  
**Last Updated:** 2025-09-30  
**Status:** Ready for Development  
**Reviewed By:** Joe Medina, Pure Ohana Treasures LLC
