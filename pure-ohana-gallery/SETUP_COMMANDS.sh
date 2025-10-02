#!/bin/bash

# Pure Ohana Treasures Gallery - Git Setup
# Run this script to initialize git repo and make first commit

echo "🚀 Setting up Git repository..."

# Navigate to project
cd /Users/joemedina/PURE_OHANA_TREASURES/website-gallery/pure-ohana-gallery

# Initialize git
git init

# Check .gitignore exists
if [ -f .gitignore ]; then
  echo "✅ .gitignore found"
else
  echo "❌ .gitignore not found - creating one"
  cat > .gitignore << 'EOF'
# dependencies
/node_modules
/.pnp
.pnp.*

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

# env files (CRITICAL - DO NOT COMMIT!)
.env*
.env*.local
.env.production

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
EOF
fi

# Verify .env.local is NOT being tracked
echo ""
echo "🔒 Verifying secrets are safe..."
if git check-ignore .env.local; then
  echo "✅ .env.local is properly ignored"
else
  echo "⚠️  WARNING: .env.local might not be ignored!"
fi

# Add all files
echo ""
echo "📦 Staging files..."
git add .

# Create first commit
echo ""
echo "💾 Creating first commit..."
git commit -m "Phase 1 complete - Core gallery functionality

✅ Features Completed:
- Authentication system (login/signup)
- Dashboard with gallery management  
- Photo upload with drag-and-drop
- Public gallery viewer with masonry layout
- Fullscreen lightbox with keyboard navigation
- Elegant Pixieset-inspired design
- Mobile responsive
- Password-protected galleries
- Shareable gallery links

📁 Tech Stack:
- Next.js 15 + TypeScript
- Supabase (auth, database, storage)
- Tailwind CSS v4
- Framer Motion
- Sharp (image processing)

🎨 Design:
- Serif fonts (Georgia)
- Minimal borders
- Clean spacing
- Gray-900 color scheme

📚 Documentation:
- PHASE_1_COMPLETE.md
- PHASE_2_GUIDE.md  
- GIT_SETUP.md
- START_NEW_SESSION.md"

# Show commit
echo ""
echo "✅ First commit created!"
git log --oneline -1

echo ""
echo "🎉 Git repository set up successfully!"
echo ""
echo "Next steps:"
echo "1. Create GitHub repo (optional but recommended)"
echo "2. git remote add origin <your-repo-url>"
echo "3. git push -u origin main"
echo ""
echo "See GIT_SETUP.md for detailed instructions"
