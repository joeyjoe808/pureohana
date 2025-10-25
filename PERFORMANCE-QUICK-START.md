# Performance Optimization - Quick Start Guide

## 5-Minute Setup Guide for Blazingly Fast Images

This guide will get you started with the performance optimization system in 5 minutes.

---

## Step 1: Replace Standard Images (2 minutes)

### Before (Standard)

```tsx
<img
  src="https://example.supabase.co/storage/photo.jpg"
  alt="Wedding photo"
  className="w-full"
/>
```

### After (Optimized)

```tsx
import { OptimizedImage } from '@/components/OptimizedImage';

<OptimizedImage
  src="https://example.supabase.co/storage/photo.jpg"
  alt="Wedding photo"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
  className="w-full"
/>
```

**Benefits**:
- ✅ WebP/AVIF automatic conversion
- ✅ Lazy loading with blur-up placeholder
- ✅ Responsive srcset
- ✅ No CLS (layout shift)

---

## Step 2: Add SWR Data Fetching (2 minutes)

### Before (Standard)

```tsx
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchPosts = async () => {
    const { data } = await supabase.from('blog_posts').select('*');
    setPosts(data);
    setLoading(false);
  };
  fetchPosts();
}, []);
```

### After (SWR)

```tsx
import { useBlogPosts } from '@/hooks/useSupabaseData';
import { BlogListSkeleton } from '@/components/SkeletonLoader';

const { data: posts, isLoading } = useBlogPosts();

if (isLoading) return <BlogListSkeleton count={6} />;
```

**Benefits**:
- ✅ Automatic caching
- ✅ Background revalidation
- ✅ No duplicate requests
- ✅ Skeleton loader

---

## Step 3: Initialize Performance Monitoring (1 minute)

### Add to main.tsx

```tsx
import { initPerformanceMonitoring } from './lib/performance-monitoring';

// After other imports
initPerformanceMonitoring();
```

**Benefits**:
- ✅ Core Web Vitals tracking
- ✅ Custom metrics
- ✅ Performance budgets
- ✅ Analytics integration

---

## Quick Reference

### Common Patterns

#### 1. Hero Image (Above the Fold)

```tsx
<OptimizedImage
  src={heroImage}
  alt="Hero"
  width={1920}
  height={1080}
  priority={true}  // Load immediately
  sizes="100vw"
/>
```

#### 2. Gallery Grid

```tsx
import { GallerySkeleton } from '@/components/SkeletonLoader';
import { usePortfolioImages } from '@/hooks/useSupabaseData';

const Gallery = () => {
  const { data: images, isLoading } = usePortfolioImages();

  if (isLoading) return <GallerySkeleton itemCount={12} columns={3} />;

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map(img => (
        <OptimizedImage
          key={img.id}
          src={img.url}
          alt={img.title}
          width={400}
          height={300}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      ))}
    </div>
  );
};
```

#### 3. Lazy Load Section

```tsx
import { useGalleryLazyLoad } from '@/hooks/useIntersectionObserver';

const LazySection = ({ images }) => {
  const containerRef = useRef(null);
  const { isIntersecting } = useGalleryLazyLoad(containerRef);

  return (
    <div ref={containerRef}>
      {isIntersecting && images.map(img => (
        <OptimizedImage key={img.id} {...img} />
      ))}
    </div>
  );
};
```

#### 4. Infinite Scroll

```tsx
import { useInfinitePortfolio } from '@/hooks/useSupabaseData';

const InfiniteGallery = () => {
  const { images, isLoading, loadMore, isReachingEnd } = useInfinitePortfolio(12);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {images.map(img => (
          <OptimizedImage key={img.id} {...img} />
        ))}
      </div>

      {!isReachingEnd && (
        <button onClick={loadMore}>
          {isLoading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};
```

---

## Build & Deploy

### Development

```bash
npm run dev
```

### Production Build

```bash
# Build and check bundle sizes
npm run build:check

# If bundle sizes are good, deploy
npm run build
```

### Analyze Bundle

```bash
# Generate bundle visualization
npm run build:analyze

# Opens dist/stats.html in browser
```

---

## Performance Checklist

Before deploying:

- [ ] All images use `OptimizedImage`
- [ ] Hero images have `priority={true}`
- [ ] All images have `width` and `height`
- [ ] Data fetching uses SWR hooks
- [ ] Skeleton loaders for loading states
- [ ] Performance monitoring initialized
- [ ] Bundle sizes checked (`npm run check-bundle`)
- [ ] Lighthouse score >90

---

## Common Issues

### Images not loading?

Check Supabase Storage URLs are correct:

```tsx
// ✅ Correct
src="https://yourproject.supabase.co/storage/v1/object/public/bucket/file.jpg"

// ❌ Wrong
src="/storage/file.jpg"
```

### Layout shift on images?

Always provide width and height:

```tsx
// ✅ Prevents CLS
<OptimizedImage width={800} height={600} />

// ❌ Causes CLS
<OptimizedImage />
```

### Service Worker not caching?

Check registration in browser DevTools:

1. Open DevTools → Application → Service Workers
2. Verify "pureohana-sw" is active
3. Check "Cache Storage" for cached assets

---

## Next Steps

1. Read full [PERFORMANCE.md](./PERFORMANCE.md) documentation
2. Set up Google Analytics for production metrics
3. Configure performance budgets for your needs
4. Set up CI/CD to fail on budget violations

---

## Support

Need help? Check:

1. [Full Documentation](./PERFORMANCE.md)
2. [Component Examples](./src/components/)
3. [Hook Documentation](./src/hooks/)

---

**You're all set!** Your images are now optimized for blazing fast performance. 🚀
