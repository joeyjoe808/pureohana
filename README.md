# 🌺 Pure Ohana Unified Platform

**A luxury photography gallery and marketing website - built with resilience, tested to perfection.**

**Built for Pure Ohana Treasures LLC by Joe Medina**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Resend API key (for emails)

### Setup
```bash
# 1. Clone and navigate
cd pure-ohana-gallery

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Add your credentials to .env.local
# (See MASTER_BUILD_SPEC.md for details)

# 5. Run database migrations
npm run db:migrate

# 6. Start development server
npm run dev
```

Visit `http://localhost:3000`

---

## 📋 Project Structure

```
/
├── pure-ohana-gallery/
│   ├── src/
│   │   ├── app/              # Next.js 15 App Router pages
│   │   ├── components/       # React components
│   │   ├── lib/              # Utilities (Supabase, email, etc.)
│   │   └── styles/           # Global styles
│   ├── public/               # Static assets
│   └── tests/                # Test files
├── MASTER_BUILD_SPEC.md      # Complete technical specification
├── README.md                 # This file
└── archive/                  # Historical docs (reference only)
```

---

## 🎯 What This Platform Does

### Marketing Site
- Luxury homepage with hero
- Services, about, portfolio pages
- Blog with CMS
- Email-integrated contact form (connects to your email + AI responder)

### Client Galleries
- **Link-based access** (no login required - just share URL)
- View, favorite, comment on photos
- Download high-res images
- Beautiful luxury design (Playfair Display, elegant colors)

### Admin Dashboard
- Upload 300-500 photos in bulk
- Create password-protected galleries
- See client favorites & comments (live alerts)
- Export favorite lists for editing

---

## 🧪 Testing

```bash
# Run all tests
npm run test:all

# Unit tests only
npm test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

**Philosophy:** **98% built without tests = 0% done. No exceptions.**

---

## 🔒 Security

- Row Level Security (RLS) on all tables
- Rate limiting on API routes (10 req/min)
- CSRF protection on forms
- Input sanitization (XSS prevention)
- Secure headers (CSP, HSTS, X-Frame-Options)

See `MASTER_BUILD_SPEC.md` for complete security details.

---

## 🚀 Deployment

```bash
# Deploy to Vercel
vercel --prod
```

See deployment checklist in `MASTER_BUILD_SPEC.md`

---

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - **AGENT SYSTEM PROMPT** - Read this first if you're an AI agent
  - Integration Orchestrator role
  - Concrete success criteria for all 8 phases
  - Silicon Valley code quality standards
  - Sequential execution pattern (REASON → ACT → VALIDATE → REPORT)
  - Anti-patterns to avoid (no excessive .md files!)
  - Quality gates and integration checkpoints

- **[MERGE_BLUEPRINT.md](./MERGE_BLUEPRINT.md)** - **START HERE!** Complete merge execution plan
  - Live site merge strategy
  - 8-phase execution plan
  - Netlify vs Vercel deployment
  - Domain migration steps
  - Testing checklists
  - Agent-ready instructions

- **[MASTER_BUILD_SPEC.md](./MASTER_BUILD_SPEC.md)** - Complete technical specification
  - Full technical architecture
  - Feature specifications
  - Testing requirements (98% = 0% philosophy)
  - Security best practices
  - Email integration specs
  - Deployment checklist
  - Silicon Valley standards (error handling, retries, resilience)

- **[archive/](./archive/)** - Historical documentation (for reference only)

---

## 📞 Support

**Owner:** Joe Medina, Pure Ohana Treasures LLC

For complete documentation, see `MASTER_BUILD_SPEC.md`

---

**Built with aloha spirit and Silicon Valley best practices** 🌺
