# Performance Optimization Guide

## Pure Ohana Photography - High-Performance Image Delivery System

This guide documents the comprehensive performance optimization system implemented for the Pure Ohana Photography website. The system is designed to deliver a blazingly fast experience despite being image-heavy.

---

## Table of Contents

1. [Overview](#overview)
2. [Performance Targets](#performance-targets)
3. [Architecture](#architecture)
4. [Components](#components)
5. [Usage Examples](#usage-examples)
6. [Performance Monitoring](#performance-monitoring)
7. [Bundle Optimization](#bundle-optimization)
8. [Caching Strategy](#caching-strategy)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The performance system implements multiple optimization layers:

- **Image Optimization**: Responsive images, modern formats (WebP/AVIF), lazy loading, blur-up placeholders
- **Code Splitting**: Route-based and vendor chunking for optimal loading
- **Caching**: Multi-tier caching with SWR, Service Worker, and browser cache
- **Monitoring**: Real-time Core Web Vitals tracking
- **Progressive Loading**: Skeleton loaders and smooth transitions

### Key Features

- Target: <3s LCP (Largest Contentful Paint)
- Target: <100ms FID (First Input Delay)
- Target: <0.1 CLS (Cumulative Layout Shift)
- Offline support with Service Worker
- Automatic bundle size monitoring
- Performance budgets enforcement

---

## Performance Targets

### Core Web Vitals

| Metric | Target | Acceptable | Description |
|--------|--------|------------|-------------|
| **LCP** | <2.5s | <4.0s | Largest Contentful Paint |
| **FID** | <100ms | <300ms | First Input Delay |
| **CLS** | <0.1 | <0.25 | Cumulative Layout Shift |
| **FCP** | <1.8s | <3.0s | First Contentful Paint |
| **TTFB** | <600ms | <1.5s | Time to First Byte |

### Bundle Size Budgets

| Resource Type | Budget (gzipped) |
|--------------|------------------|
| JavaScript | 300 KB |
| CSS | 50 KB |
| Images | 500 KB |
| Fonts | 100 KB |
| **Total** | **1000 KB** |

---

## Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   User Request                           │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Service Worker (PWA)                        │
│  - Cache-First for images                               │
│  - Network-First for API                                │
│  - Offline fallback                                     │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  SWR Cache Layer                        │
│  - Stale-while-revalidate                              │
│  - Automatic deduplication                             │
│  - Background revalidation                             │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│             React Component Layer                        │
│  - OptimizedImage                                       │
│  - Lazy loading with IntersectionObserver              │
│  - Skeleton loaders                                     │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Supabase Storage CDN                       │
│  - Image transformations                                │
│  - WebP/AVIF conversion                                │
│  - Responsive sizing                                    │
└─────────────────────────────────────────────────────────┘
```

---

## Components

### 1. OptimizedImage Component

**Location**: `src/components/OptimizedImage.tsx`

High-performance image component with automatic optimization.

#### Features

- Blur-up placeholder loading
- WebP/AVIF with fallbacks
- Responsive srcset generation
- Lazy loading with IntersectionObserver
- Priority loading for above-the-fold images
- Automatic Supabase CDN URL generation

#### Props

```typescript
interface OptimizedImageProps {
  src: string;              // Image source URL
  alt: string;              // Alt text (required for accessibility)
  width?: number;           // Image width
  height?: number;          // Image height
  sizes?: string;           // Responsive sizes attribute
  priority?: boolean;       // Load immediately (for hero images)
  blurDataURL?: string;     // Custom blur placeholder
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;      // Load callback
  onError?: () => void;     // Error callback
}
```

#### Usage Example

```tsx
import { OptimizedImage } from '@components/OptimizedImage';

// Hero image (above the fold)
<OptimizedImage
  src="https://example.supabase.co/storage/hero.jpg"
  alt="Beautiful Hawaiian sunset"
  width={1920}
  height={1080}
  priority={true}
  sizes="100vw"
/>

// Gallery image (lazy loaded)
<OptimizedImage
  src="https://example.supabase.co/storage/gallery/photo.jpg"
  alt="Wedding ceremony"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
  objectFit="cover"
/>
```

---

### 2. Lazy Loading Hooks

**Location**: `src/hooks/useIntersectionObserver.ts`

Custom hooks for efficient lazy loading and scroll animations.

#### Available Hooks

##### useIntersectionObserver

Base hook for observing element visibility.

```tsx
import { useIntersectionObserver } from '@hooks/useIntersectionObserver';

const MyComponent = () => {
  const elementRef = useRef(null);
  const { isIntersecting } = useIntersectionObserver(elementRef, {
    threshold: 0.5,
    rootMargin: '100px',
    freezeOnceVisible: true
  });

  return (
    <div ref={elementRef}>
      {isIntersecting && <ExpensiveComponent />}
    </div>
  );
};
```

##### useGalleryLazyLoad

Optimized for gallery lazy loading with 200px preload margin.

```tsx
import { useGalleryLazyLoad } from '@hooks/useIntersectionObserver';

const Gallery = ({ images }) => {
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

##### useScrollAnimation

For scroll-triggered animations.

```tsx
import { useScrollAnimation } from '@hooks/useIntersectionObserver';

const AnimatedSection = () => {
  const sectionRef = useRef(null);
  const { isIntersecting } = useScrollAnimation(sectionRef);

  return (
    <div
      ref={sectionRef}
      className={isIntersecting ? 'animate-fade-in' : 'opacity-0'}
    >
      Content
    </div>
  );
};
```

##### useInfiniteScroll

For infinite scroll pagination.

```tsx
import { useInfiniteScroll } from '@hooks/useIntersectionObserver';

const InfiniteList = () => {
  const loaderRef = useRef(null);
  useInfiniteScroll(loaderRef, {
    onLoadMore: () => fetchMoreItems()
  });

  return (
    <div>
      {items.map(item => <Item key={item.id} {...item} />)}
      <div ref={loaderRef}>Loading...</div>
    </div>
  );
};
```

---

### 3. SWR Data Fetching

**Location**: `src/lib/swr-config.ts` and `src/hooks/useSupabaseData.ts`

Intelligent data fetching with automatic caching and revalidation.

#### Configuration Profiles

- **default**: Standard caching (5min revalidation)
- **static**: Long-term caching (no refocus revalidation)
- **realtime**: Frequent updates (5s refresh interval)
- **pagination**: Infinite scroll support

#### Available Hooks

```tsx
import {
  usePortfolioImages,
  useBlogPosts,
  useBlogPost,
  useServices,
  useSiteSettings,
  useTestimonials,
  useDashboardStats,
  useInfinitePortfolio
} from '@hooks/useSupabaseData';

// Fetch portfolio images
const { data, isLoading, error, mutate } = usePortfolioImages('weddings');

// Infinite scroll
const {
  images,
  isLoading,
  loadMore,
  isReachingEnd
} = useInfinitePortfolio(12);

// Optimistic updates
import { useOptimisticMutation } from '@hooks/useSupabaseData';

const { optimisticUpdate } = useOptimisticMutation(['blog', 'posts']);

await optimisticUpdate(
  (currentData) => [...currentData, newPost],
  async () => await createPost(newPost)
);
```

---

### 4. Skeleton Loaders

**Location**: `src/components/SkeletonLoader.tsx`

Loading state components with shimmer animation.

#### Available Components

- `Skeleton` - Base skeleton
- `ImageSkeleton` - Image with aspect ratio
- `GallerySkeleton` - Grid of images
- `BlogCardSkeleton` - Blog post card
- `BlogListSkeleton` - Grid of blog cards
- `PortfolioCardSkeleton` - Portfolio item
- `ServiceCardSkeleton` - Service card
- `TestimonialSkeleton` - Testimonial
- `HeroSkeleton` - Hero section
- `NavSkeleton` - Navigation
- `TableSkeleton` - Data table
- `PageSkeleton` - Full page

#### Usage

```tsx
import {
  GallerySkeleton,
  BlogListSkeleton,
  PageSkeleton
} from '@components/SkeletonLoader';

const Gallery = () => {
  const { data, isLoading } = usePortfolioImages();

  if (isLoading) return <GallerySkeleton itemCount={12} columns={3} />;

  return <div>...</div>;
};
```

---

## Performance Monitoring

### Web Vitals Tracking

**Location**: `src/lib/performance-monitoring.ts`

#### Initialization

Add to your `main.tsx`:

```tsx
import { initPerformanceMonitoring } from './lib/performance-monitoring';

// Initialize monitoring
initPerformanceMonitoring();
```

#### Custom Metrics

```tsx
import { performanceMonitor } from './lib/performance-monitoring';

// Track route change
performanceMonitor.trackRouteChange('/portfolio', duration);

// Track image load
performanceMonitor.trackImageLoad(src, duration, size);

// Track API response
performanceMonitor.trackAPIResponse('/api/posts', duration, status);

// Measure function performance
import { measurePerformance } from './lib/performance-monitoring';

const optimizedFn = measurePerformance(myFunction, 'myFunction');
```

#### Performance Report

```tsx
// Generate report
const report = performanceMonitor.generateReport();
console.log(report);
```

---

## Bundle Optimization

### Build Configuration

**Location**: `vite.config.ts`

#### Manual Chunking

Vendor chunks are automatically split:

- `react-vendor`: React, ReactDOM, React Router
- `supabase-vendor`: Supabase client
- `animation-vendor`: Framer Motion
- `ui-vendor`: Lucide React icons

#### Compression

- Gzip compression for all assets >10KB
- Brotli compression (better than gzip)
- Automatic in production builds

#### Build Commands

```bash
# Production build
npm run build

# Build with bundle analysis
npm run build:analyze

# Build and check bundle sizes
npm run build:check
```

### Bundle Analysis

After running `npm run build:analyze`, open `dist/stats.html` to visualize:

- Bundle sizes by chunk
- Module dependencies
- Duplicate modules
- Largest modules

### Performance Budget Checker

**Location**: `scripts/check-bundle-size.js`

Automatically checks bundle sizes against budgets defined in `performance-budget.json`.

```bash
# Check bundle sizes
npm run check-bundle

# Will exit with code 1 if budgets exceeded
```

#### CI/CD Integration

Add to your CI/CD pipeline:

```yaml
# .github/workflows/ci.yml
- name: Check bundle size
  run: npm run build:check
```

---

## Caching Strategy

### Multi-Tier Caching

#### 1. Service Worker Cache (PWA)

**Strategy**: Cache-First for images, Network-First for API

- Images cached for 30 days
- API responses cached for 5 minutes
- Fonts cached for 1 year
- Offline fallback page

#### 2. SWR Cache

**Strategy**: Stale-While-Revalidate

- Immediate response from cache
- Background revalidation
- Automatic deduplication
- Focus/reconnect revalidation

#### 3. Browser Cache

**Strategy**: HTTP cache headers

Set proper cache headers on Supabase Storage:

```
Cache-Control: public, max-age=31536000, immutable
```

### Cache Management

```tsx
import { useClearCache } from '@hooks/useSupabaseData';

const { clearCache } = useClearCache();

// Clear specific cache
clearCache('portfolio');

// Clear all caches (Service Worker)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    registration.active?.postMessage({
      type: 'CLEAR_CACHE'
    });
  });
}
```

---

## Best Practices

### Image Optimization

1. **Use OptimizedImage for all images**
   ```tsx
   // ✅ Good
   <OptimizedImage src={url} alt="Description" />

   // ❌ Bad
   <img src={url} alt="Description" />
   ```

2. **Set priority for hero images**
   ```tsx
   <OptimizedImage priority={true} />
   ```

3. **Provide width and height to prevent CLS**
   ```tsx
   <OptimizedImage width={800} height={600} />
   ```

4. **Use appropriate sizes attribute**
   ```tsx
   sizes="(max-width: 768px) 100vw, 50vw"
   ```

### Data Fetching

1. **Use SWR hooks for all data**
   ```tsx
   // ✅ Good
   const { data } = usePortfolioImages();

   // ❌ Bad
   const [data, setData] = useState();
   useEffect(() => { fetch(...) }, []);
   ```

2. **Prefetch data on hover**
   ```tsx
   import { usePrefetch } from '@hooks/useSupabaseData';

   const { prefetch } = usePrefetch();

   <Link
     to="/portfolio"
     onMouseEnter={() => prefetch(['portfolio'], fetchPortfolio)}
   >
     Portfolio
   </Link>
   ```

3. **Use appropriate cache profile**
   ```tsx
   // Static data
   useSWR(key, fetcher, swrConfigs.static);

   // Realtime data
   useSWR(key, fetcher, swrConfigs.realtime);
   ```

### Code Splitting

1. **Lazy load routes**
   ```tsx
   const Portfolio = lazy(() => import('./pages/Portfolio'));
   ```

2. **Lazy load heavy components**
   ```tsx
   const VideoPlayer = lazy(() => import('./components/VideoPlayer'));
   ```

3. **Use Suspense with fallback**
   ```tsx
   <Suspense fallback={<SkeletonLoader />}>
     <Portfolio />
   </Suspense>
   ```

### Performance Monitoring

1. **Track important user journeys**
   ```tsx
   performanceMonitor.trackRouteChange(route, duration);
   ```

2. **Monitor API performance**
   ```tsx
   const start = performance.now();
   await fetch(...);
   performanceMonitor.trackAPIResponse(url, performance.now() - start, 200);
   ```

3. **Set performance budgets**
   - Review `performance-budget.json` regularly
   - Adjust based on analytics data
   - Fail CI/CD if exceeded

---

## Troubleshooting

### Issue: Images not lazy loading

**Solution**: Check that component uses `useIntersectionObserver` or `OptimizedImage`.

```tsx
// Ensure ref is attached
const imageRef = useRef(null);
const { isIntersecting } = useIntersectionObserver(imageRef);

<div ref={imageRef}>...</div>
```

### Issue: Service Worker not updating

**Solution**: Clear cache and reload.

```tsx
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(reg => reg.unregister());
  });
}
```

### Issue: Bundle size exceeds budget

**Solution**: Analyze bundle and remove unused code.

```bash
# Visualize bundle
npm run build:analyze

# Check for:
# - Duplicate dependencies
# - Unused imports
# - Large third-party libraries
```

### Issue: CLS (layout shift) on images

**Solution**: Always specify width and height.

```tsx
// ✅ Prevents layout shift
<OptimizedImage width={800} height={600} />

// ❌ Causes layout shift
<OptimizedImage />
```

### Issue: Slow API responses

**Solution**: Check SWR cache configuration.

```tsx
// Increase cache time for static data
useSWR(key, fetcher, {
  ...swrConfigs.static,
  revalidateOnFocus: false,
  dedupingInterval: 60000
});
```

---

## Monitoring Dashboard

### Viewing Performance Metrics

1. **Chrome DevTools**
   - Lighthouse: `npm run build && npm run preview`, then run Lighthouse
   - Performance tab: Record and analyze
   - Network tab: Check waterfall

2. **Web Vitals Extension**
   - Install: [Chrome Web Store](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma)
   - View real-time metrics

3. **Production Analytics**
   - Metrics sent to Google Analytics (if configured)
   - Custom dashboard in Supabase

### Performance Checklist

Before deploying to production:

- [ ] Run Lighthouse audit (score >90)
- [ ] Check bundle sizes (`npm run check-bundle`)
- [ ] Test on 3G network (Chrome DevTools)
- [ ] Verify images lazy load
- [ ] Test offline mode
- [ ] Check Service Worker registration
- [ ] Verify no console errors
- [ ] Test on mobile device
- [ ] Verify CLS <0.1
- [ ] Check LCP <2.5s

---

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [SWR Documentation](https://swr.vercel.app/)
- [Workbox](https://developers.google.com/web/tools/workbox)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

---

## Support

For issues or questions about the performance system:

1. Check this documentation first
2. Review existing issues in the repository
3. Create a new issue with:
   - Performance metrics (Lighthouse report)
   - Browser and device information
   - Steps to reproduce

---

**Last Updated**: 2025-10-24

**Maintained By**: Performance Engineering Team
