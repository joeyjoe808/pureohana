# 🔧 Git Repository Setup Guide

**IMPORTANT:** Set up version control NOW before continuing to Phase 2!

---

## 🎯 Why Git?

- **Backup your work** - Never lose your code
- **Track changes** - See what changed and when
- **Rollback mistakes** - Undo changes that break things
- **Safe experimentation** - Try new features without fear
- **Professional workflow** - Industry standard

---

## 📦 Step 1: Initialize Git Repo

Run these commands in your terminal:

```bash
cd /Users/joemedina/PURE_OHANA_TREASURES/website-gallery/pure-ohana-gallery

# Initialize git
git init

# Check status
git status
```

---

## 📝 Step 2: Create .gitignore

The `.gitignore` file already exists, but let's verify it has everything:

```bash
cat .gitignore
```

Should contain:
```
# dependencies
/node_modules
/.pnp
.pnp.*
*.pnp.*

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# env files (DO NOT COMMIT!)
.env*.local
.env
.env.production

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

**⚠️ CRITICAL:** Make sure `.env.local` and `.env` are in .gitignore! Never commit your Supabase keys!

---

## 💾 Step 3: First Commit (Phase 1 Complete)

```bash
# Add all files
git add .

# Create first commit
git commit -m "Phase 1 complete - Core gallery functionality

- Authentication (login/signup)
- Dashboard with gallery management
- Photo upload system
- Public gallery viewer with masonry layout
- Lightbox with navigation
- Elegant Pixieset-inspired design
- Responsive mobile design"

# Verify commit
git log
```

---

## 🌐 Step 4: Create GitHub Repo (Recommended)

### Option A: Using GitHub CLI (if installed)

```bash
# Login to GitHub
gh auth login

# Create repo
gh repo create pure-ohana-gallery --private --source=. --remote=origin --push

# View repo
gh repo view --web
```

### Option B: Using GitHub Website

1. Go to https://github.com/new
2. **Repository name:** `pure-ohana-gallery`
3. **Private:** ✅ (recommended - contains business logic)
4. **DO NOT** initialize with README (you already have code)
5. Click "Create repository"
6. Follow the instructions to push existing repository:

```bash
git remote add origin https://github.com/YOUR_USERNAME/pure-ohana-gallery.git
git branch -M main
git push -u origin main
```

---

## 🔒 Step 5: Verify Secrets Are Safe

**CRITICAL CHECK:**

```bash
# Make sure these are NOT in your repo:
git log --all --full-history -- "*env*"

# Should show nothing or just .gitignore changes
# If you see .env.local contents, YOU HAVE A PROBLEM!
```

If you accidentally committed secrets:
```bash
# Remove from history (DANGEROUS - only if just committed)
git rm --cached .env.local
git commit -m "Remove sensitive file"
```

Better: Create a new repo and start fresh if secrets were exposed.

---

## 📊 Step 6: Document Current State

Already done! ✅
- `PHASE_1_COMPLETE.md` - Full documentation
- `PHASE_2_GUIDE.md` - Next steps
- `GIT_SETUP.md` - This file
- `PROJECT_ROADMAP.md` - Updated with Phase 1 complete

---

## 🚀 Daily Git Workflow

### Before Starting Work
```bash
# Check current state
git status

# See what branch you're on
git branch
```

### After Adding a Feature
```bash
# See what changed
git status
git diff

# Add changed files
git add src/path/to/file.tsx
# Or add everything:
git add .

# Commit with descriptive message
git commit -m "Add favorites button to gallery grid"

# Push to GitHub
git push
```

### Create Feature Branch (Advanced)
```bash
# Create new branch for Phase 2
git checkout -b phase-2-favorites

# Work on feature...
git add .
git commit -m "Add favorites functionality"

# Push branch
git push -u origin phase-2-favorites

# When done, merge back:
git checkout main
git merge phase-2-favorites
git push
```

---

## 🆘 Git Emergency Commands

### Undo Last Commit (Before Push)
```bash
# Keep changes, just undo commit
git reset --soft HEAD~1

# Undo commit and discard changes (DANGEROUS!)
git reset --hard HEAD~1
```

### Discard All Local Changes
```bash
# See what will be discarded
git status

# Discard all changes (CANNOT UNDO!)
git reset --hard HEAD
git clean -fd
```

### View File at Previous Commit
```bash
# See file history
git log --oneline src/app/page.tsx

# View file at specific commit
git show COMMIT_HASH:src/app/page.tsx
```

### Restore Single File
```bash
# Restore file from last commit
git checkout HEAD -- src/app/page.tsx

# Restore from specific commit
git checkout COMMIT_HASH -- src/app/page.tsx
```

---

## 📅 Commit Message Best Practices

### Good Commit Messages
```bash
git commit -m "Add heart button to favorite photos"
git commit -m "Fix lightbox navigation on mobile"
git commit -m "Update masonry grid gap to 4px"
git commit -m "Add comments table to database schema"
```

### Bad Commit Messages
```bash
git commit -m "updates"
git commit -m "fixed stuff"
git commit -m "asdf"
git commit -m "Final version (really this time)"
```

### Format
```
<action> <what> [additional context]

Examples:
Add favorites system with heart icons
Fix photo upload progress tracking
Update gallery grid to use thumbnails
Remove unused import from Lightbox
Refactor upload component for clarity
```

---

## 🎯 Checkpoints for Phase 2

**Commit after each major feature:**

```bash
# After adding bulk upload
git add .
git commit -m "Add bulk photo upload (300-500 photos)"
git push

# After adding favorites
git add .
git commit -m "Add favorites system with localStorage"
git push

# After adding comments
git add .
git commit -m "Add comments modal and database integration"
git push

# Etc...
```

---

## ✅ Verification Checklist

Before moving to Phase 2, verify:

- [ ] Git repo initialized (`git status` works)
- [ ] `.gitignore` includes `.env.local` and `.env`
- [ ] First commit created (Phase 1 complete)
- [ ] GitHub repo created (optional but recommended)
- [ ] Pushed to GitHub (`git push` succeeds)
- [ ] **SECRETS NOT IN REPO** (`git log --all -- "*env*"` shows nothing)
- [ ] Can see repo on GitHub (if using GitHub)

---

## 🎓 Learn More

- **Git Basics:** https://git-scm.com/doc
- **GitHub Guides:** https://guides.github.com/
- **Git Cheat Sheet:** https://education.github.com/git-cheat-sheet-education.pdf

---

## ⚡ Quick Reference

```bash
# Status
git status                    # See what changed
git log --oneline            # View commit history
git diff                     # See changes

# Basic workflow
git add .                    # Stage all changes
git commit -m "message"      # Commit with message
git push                     # Push to remote

# Branching
git branch                   # List branches
git checkout -b new-branch   # Create new branch
git checkout main            # Switch to main
git merge other-branch       # Merge branch

# Undo
git reset --soft HEAD~1      # Undo last commit (keep changes)
git checkout HEAD -- file    # Restore single file
git reset --hard HEAD        # Discard all changes (DANGEROUS!)

# Remote
git remote -v                # View remote URLs
git pull                     # Pull latest changes
git push                     # Push commits
```

---

**✅ Git setup complete! You're now ready to start Phase 2 safely!**

See `PHASE_2_GUIDE.md` for next steps.
