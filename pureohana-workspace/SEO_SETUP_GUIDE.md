# SEO Setup Guide - Pure Ohana Treasures

This guide covers the remaining SEO optimizations that require manual setup outside of the codebase.

## ✅ Completed Technical Improvements

1. **Mobile Tap Targets** - All interactive elements now meet 48x48px minimum
2. **Structured Data (Schema.org)** - Full markup for Organization, Services, Galleries, and Breadcrumbs
3. **Asset Caching** - Optimal cache headers for all static assets
4. **Social Media Links** - Footer updated with Instagram, Facebook, and Twitter placeholders

---

## 📋 Remaining Manual Tasks

### 1. Social Media Setup (High Priority)

#### Create Facebook Business Page
1. Go to [facebook.com/pages/create](https://facebook.com/pages/create)
2. Select "Business or Brand"
3. Fill in details:
   - **Page name**: Pure Ohana Treasures
   - **Category**: Photography & Videography
   - **Bio**: Luxury photography services in Hawaii - Family portraits, couples, events, and custom treasures. Serving all Hawaiian Islands with aloha.
4. Add your best photos to the gallery
5. Fill out the "About" section with:
   - Location: Aiea, Oahu, Hawaii
   - Service area: All Hawaiian Islands
   - Hours: Mon-Sun 9:00 AM - 6:00 PM
   - Email: pureohanatreasures@gmail.com
   - Website: https://pureohanatreasures.com
6. **Update the website**: Replace `https://www.facebook.com/pureohanatreasures/` in [components/Footer.tsx](components/Footer.tsx) with your actual Facebook page URL

#### Optimize Twitter/X Account
You already have Twitter at [@pure_ohana_808](https://x.com/pure_ohana_808) - nice! Let's make sure it's fully optimized:
- [ ] Profile complete with business name and professional photo
- [ ] Bio includes: Luxury photography in Hawaii 📸 | Family portraits, couples & events 🌺 | 📍 Aiea, Oahu
- [ ] Website link points to https://pureohanatreasures.com
- [ ] Location set to Aiea, Hawaii
- [ ] Cover photo showcases your best work
- [ ] Pin an important tweet (like a portfolio highlight or special offer)
- [ ] Tweet regularly with location tags and relevant hashtags (#HawaiiPhotography, #OahuPhotographer, etc.)

#### Optimize Instagram Profile
You already have Instagram! Make sure it's fully optimized:
- [ ] Link in bio points to https://pureohanatreasures.com
- [ ] Business account enabled
- [ ] Contact button active
- [ ] Story highlights showcasing different service types
- [ ] Post regularly with location tags for local SEO

---

### 2. Local SEO Setup (High Priority)

#### Google Business Profile
This is **critical** for local SEO!

1. Go to [business.google.com](https://business.google.com)
2. Sign in and click "Add Business"
3. Fill in details:
   - **Business name**: Pure Ohana Treasures
   - **Category**: Photography Service, Portrait Studio
   - **Do you want to add a location?**: Select "Yes, I serve customers at my business address"
   - **Address**: Your Aiea address
   - **Service area**: Add all Hawaiian Islands (Oahu, Maui, Big Island, Kauai, Molokai, Lanai)
4. Verify your business (Google will mail you a postcard with verification code)
5. Once verified, complete your profile:
   - Add business hours
   - Upload 10-20 of your best photos
   - Write a compelling business description
   - Add all service categories
   - Enable messaging if possible
6. **Collect reviews**: Ask satisfied clients to leave Google reviews (this is HUGE for local SEO)

#### Yelp for Business
1. Go to [biz.yelp.com](https://biz.yelp.com)
2. Claim or create your business listing
3. Fill in all details:
   - Business name, address, phone
   - Categories: Photographers, Portrait Photographers, Event Photography
   - Hours and website
   - Upload photos
   - Add service offerings
4. Enable messaging
5. **Respond to reviews**: Engage with any reviews you receive

---

### 3. Email Security (Medium Priority)

#### Set up SPF, DKIM, and DMARC

These DNS records improve email deliverability and security.

**SPF Record** (Add to your DNS):
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com ~all
```

**DMARC Record** (Add to your DNS):
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:pureohanatreasures@gmail.com
```

**DKIM**: If using Gmail/Google Workspace:
1. Go to Google Admin Console
2. Navigate to Apps > Google Workspace > Gmail > Authenticate email
3. Generate DKIM key
4. Add the provided TXT record to your DNS

---

### 4. Content & Ongoing SEO

#### Blog Content Strategy
Your site has a blog! Use it for SEO:

**Post ideas:**
- "Best Photo Locations in Oahu for Family Portraits"
- "What to Wear for Your Hawaii Photo Session"
- "Sunrise vs Sunset Photography in Hawaii"
- "Preparing for Your Engagement Photo Shoot"
- "Behind the Scenes: A Day of Event Photography"

**SEO Tips for Blog Posts:**
- Use local keywords naturally (Oahu, Hawaii, Waikiki, etc.)
- Include location tags and maps where relevant
- Add alt text to all images
- Link to your service pages
- Share posts on social media

#### Portfolio Updates
- Add location data to portfolio images
- Include captions with service types and locations
- Update portfolio regularly with recent work

#### Customer Reviews
- Ask satisfied clients for Google reviews
- Respond to all reviews (positive and negative)
- Share positive testimonials on social media
- Consider adding a testimonials page to the website

---

### 5. Analytics & Monitoring

#### Google Search Console
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add your property (https://pureohanatreasures.com)
3. Verify ownership (you already have Google Analytics, so verification should be automatic)
4. Submit your sitemap: `https://pureohanatreasures.com/sitemap.xml`

**Monitor weekly:**
- Search queries bringing traffic
- Pages with most impressions/clicks
- Any crawl errors or issues

#### Review Your SEO Score
After implementing all changes:
1. Run Google PageSpeed Insights: [pagespeed.web.dev](https://pagespeed.web.dev/)
2. Run a new SEO audit at [seobility.net](https://www.seobility.net/)
3. Check mobile-friendliness: [search.google.com/test/mobile-friendly](https://search.google.com/test/mobile-friendly)
4. Test structured data: [search.google.com/test/rich-results](https://search.google.com/test/rich-results)

**Expected improvements:**
- SEO score should jump from 60 to 85-95
- Mobile-friendliness: ✅ All tests passing
- Rich results: ✅ Organization, Services, Breadcrumbs
- Performance: ✅ Improved with asset caching

---

## 🎯 Priority Order

If you're short on time, tackle these in order:

1. **Google Business Profile** (Highest impact on local SEO)
2. **Facebook Business Page** (Second-highest social signal)
3. **Twitter/X Account** (Additional social presence)
4. **Collect Google Reviews** (Massive trust signal)
5. **Yelp Listing** (Alternate discovery channel)
6. **Email Security (SPF/DMARC)** (Deliverability + security)
7. **Start blogging** (Long-term organic traffic)

---

## 📊 Measuring Success

Track these metrics monthly:

- **Google Search Console**: Impressions, clicks, average position
- **Google Analytics**: Organic traffic, bounce rate, conversion rate
- **Google Business Profile**: Views, actions (calls, website visits)
- **Social Media**: Follower growth, engagement rate
- **Reviews**: Number and average rating on Google/Yelp

---

## 🆘 Need Help?

If you need assistance with any of these tasks:
- DNS record setup can be done through your domain registrar (Netlify, GoDaddy, etc.)
- Social media graphics can be created with [Canva](https://canva.com)
- Need professional photos for social? Use some of your best portfolio shots!

**Questions?** Feel free to ask - I'm here to help guide you through any of these steps!
