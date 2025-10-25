# 🗑️ Files to Remove - Cleanup Guide

## Overview
These are **old duplicate files** from the original codebase that are no longer needed. The new architecture replaces all of these with cleaner, better-organized versions.

---

## ✅ Safe to Delete - Old Router Files

### **Keep ONLY:**
- ✅ `App-New.tsx` - New production architecture (will rename to `App.tsx` later)
- ✅ `AppLuxury.tsx` - Currently active (will be replaced)

### **DELETE:**
- ❌ `App.tsx` - Old busy version (commented out in main.tsx)
- ❌ `AppSimple.tsx` - Test version

---

## ✅ Safe to Delete - Duplicate Homepage Files

### **Keep:**
- ✅ `pages/Home.tsx` - New luxury homepage (in new architecture)
- ✅ `pages/HomePageLuxury.tsx` - Currently active (will be replaced)

### **DELETE:**
- ❌ `pages/HomePage.tsx` - Old simple composition version
- ❌ `pages/HomePageLuxurySupabase.tsx` - Duplicate with Supabase

---

## ✅ Safe to Delete - Old Admin Pages (Root Level)

These are OLD admin pages at root level. All new admin pages are in `pages/admin/` folder.

### **DELETE ALL:**
- ❌ `pages/AdminBasic.tsx`
- ❌ `pages/AdminBlog.tsx`
- ❌ `pages/AdminPage.tsx`
- ❌ `pages/AdminPageProtected.tsx`
- ❌ `pages/AdminPageSimple.tsx`

---

## ✅ Duplicate Admin Components

### **Keep:**
- ✅ `layouts/AdminLayout.tsx` - New clean version
- ✅ `layouts/PublicLayout.tsx` - New clean version

### **DELETE:**
- ❌ `components/admin/AdminLayout.tsx` - Old version (duplicate)
- ❌ `components/admin/AdminLogin.tsx` - Old version (new one in pages/admin/)

---

## 🗂️ Admin Pages Status

### **Keep (in `pages/admin/`)** - These will be updated with new architecture:
- ✅ `pages/admin/AdminDashboard.tsx`
- ✅ `pages/admin/AdminBlog.tsx`
- ✅ `pages/admin/AdminInquiries.tsx`
- ✅ `pages/admin/AdminSettings.tsx`
- ✅ `pages/admin/AdminSubscribers.tsx`
- ✅ `pages/admin/AdminHomepage.tsx`
- ✅ `pages/admin/AdminHeroSection.tsx`
- ✅ `pages/admin/AdminAbout.tsx`
- ✅ `pages/admin/AdminServices.tsx`
- ✅ `pages/admin/AdminPortfolio.tsx`
- ✅ `pages/admin/AdminMedia.tsx`
- ✅ `pages/admin/AdminNavigation.tsx`
- ✅ `pages/admin/AdminSEO.tsx`
- ✅ `pages/admin/AdminChangePassword.tsx`
- ✅ `pages/admin/AdminLogin.tsx`

---

## 📋 Complete Deletion Checklist

Run these commands to delete old files:

### Router Files
```bash
cd src
rm App.tsx
rm AppSimple.tsx
```

### Old Homepage Variants
```bash
cd src/pages
rm HomePage.tsx
rm HomePageLuxurySupabase.tsx
```

### Old Root-Level Admin Pages
```bash
cd src/pages
rm AdminBasic.tsx
rm AdminBlog.tsx
rm AdminPage.tsx
rm AdminPageProtected.tsx
rm AdminPageSimple.tsx
```

### Duplicate Admin Components
```bash
cd src/components/admin
rm AdminLayout.tsx
rm AdminLogin.tsx
```

---

## 🎯 After Deletion

### Total Files to Delete: **12 files**

- 2 old router files
- 2 old homepage variants
- 5 old root-level admin pages
- 2 duplicate admin components
- 1 CLAUDE.md (move to archives)

### Result:
- ✅ Cleaner codebase
- ✅ No duplicate files
- ✅ Clear architecture
- ✅ Easier to maintain

---

## ⚠️ Important Notes

1. **DO NOT DELETE** anything in `pages/admin/` folder - these will be updated
2. **DO NOT DELETE** `AppLuxury.tsx` yet - it's currently active
3. **DO NOT DELETE** `HomePageLuxury.tsx` yet - it's currently active
4. **Move** (don't delete) `backup/` and `CLAUDE.md` to your archives folder

---

## 🚀 Next Steps After Cleanup

1. Delete the files listed above
2. Move `backup/` and `CLAUDE.md` to archives
3. Test that site still runs: `npm run dev`
4. Eventually switch from `AppLuxury.tsx` to `App-New.tsx`
5. Eventually switch from `HomePageLuxury.tsx` to `Home.tsx`

---

**Safe to proceed with deletion!** All these files are duplicates or old versions that are no longer used.
