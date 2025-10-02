# Pure Ohana Treasures Gallery - Setup Instructions

## ✅ Step 1: Install Dependencies (DONE)
```bash
npm install @supabase/supabase-js @supabase/ssr framer-motion lucide-react zustand date-fns sharp
```

## 🗄️ Step 2: Set Up Supabase Database

### Run the SQL Schema

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `tyizffskwhhrekrxbjnr`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy all contents from `supabase-schema.sql`
6. Paste into the SQL Editor
7. Click **Run** (or press `Cmd+Enter`)

### What This Creates:

**Tables:**
- `photographers` - User profiles for photographers
- `galleries` - Gallery metadata (title, slug, password, etc.)
- `photos` - Photo records with URLs and metadata

**Security:**
- Row Level Security (RLS) policies
- Only photographers can manage their own galleries
- Public galleries are viewable by anyone
- Password-protected galleries require authentication

**Storage:**
- `gallery-photos` bucket for storing images
- Public read access
- Authenticated write access

**Triggers:**
- Auto-create photographer profile on signup
- Auto-update `updated_at` timestamps

## 🔐 Step 3: Verify Environment Variables

Check `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tyizffskwhhrekrxbjnr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

## 🚀 Step 4: Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 📝 Next Steps

After database setup:
1. Build authentication pages (login/signup)
2. Create dashboard
3. Build gallery creation flow
4. Add photo upload
5. Create gallery viewer

## 🆘 Troubleshooting

**Issue: SQL errors**
- Make sure you're in the correct Supabase project
- Check that the SQL Editor has no syntax errors
- Try running sections separately if needed

**Issue: RLS errors**
- Verify you're logged in as authenticated user
- Check policies are created correctly
- Look at Supabase logs for details

**Issue: Storage bucket errors**
- Verify `gallery-photos` bucket exists
- Check storage policies are active
- Ensure bucket is set to public

## ✅ Verification Checklist

After running SQL:
- [ ] `photographers` table exists
- [ ] `galleries` table exists
- [ ] `photos` table exists
- [ ] `gallery-photos` storage bucket exists
- [ ] RLS policies are enabled
- [ ] Triggers are active
