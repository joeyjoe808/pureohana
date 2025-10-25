/**
 * Performance Optimization Examples
 *
 * This file demonstrates how to use all performance optimization components together.
 * Copy these patterns into your own components.
 */

import React, { useRef, Suspense, lazy } from 'react';
import { OptimizedImage } from '../OptimizedImage';
import {
  useGalleryLazyLoad,
  useScrollAnimation,
  useInfiniteScroll,
} from '../../hooks/useIntersectionObserver';
import {
  usePortfolioImages,
  useBlogPosts,
  useInfinitePortfolio,
} from '../../hooks/useSupabaseData';
import {
  GallerySkeleton,
  BlogListSkeleton,
  ImageSkeleton,
} from '../SkeletonLoader';

// Lazy load heavy components
const VideoPlayer = lazy(() => import('../VideoPlayer'));
const CommentSection = lazy(() => import('../CommentSection'));

/**
 * Example 1: Hero Image with Priority Loading
 */
export const HeroExample = () => {
  return (
    <section className="relative h-screen">
      <OptimizedImage
        src="https://example.supabase.co/storage/hero.jpg"
        alt="Beautiful Hawaiian landscape"
        width={1920}
        height={1080}
        priority={true} // Load immediately - above the fold
        sizes="100vw"
        objectFit="cover"
        className="absolute inset-0"
      />

      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">Pure Ohana Photography</h1>
          <p className="text-2xl">Capturing Moments in Paradise</p>
        </div>
      </div>
    </section>
  );
};

/**
 * Example 2: Lazy Loaded Gallery Grid
 */
export const GalleryExample = () => {
  const { data: images, isLoading, error } = usePortfolioImages();

  if (isLoading) {
    return <GallerySkeleton itemCount={12} columns={3} aspectRatio="4/3" />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load gallery</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images?.map((image) => (
        <OptimizedImage
          key={image.id}
          src={image.url}
          alt={image.title}
          width={800}
          height={600}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          objectFit="cover"
          className="rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        />
      ))}
    </div>
  );
};

/**
 * Example 3: Lazy Load Section (loads when scrolled into view)
 */
export const LazyLoadSectionExample = ({ images }: { images: any[] }) => {
  const containerRef = useRef(null);
  const { isIntersecting } = useGalleryLazyLoad(containerRef);

  return (
    <section ref={containerRef} className="py-12">
      <h2 className="text-3xl font-bold mb-8">Featured Work</h2>

      {!isIntersecting ? (
        // Show skeleton while not in viewport
        <GallerySkeleton itemCount={6} columns={3} />
      ) : (
        // Load actual content when in viewport
        <div className="grid grid-cols-3 gap-4">
          {images.map((img) => (
            <OptimizedImage
              key={img.id}
              src={img.url}
              alt={img.title}
              width={400}
              height={300}
              sizes="33vw"
            />
          ))}
        </div>
      )}
    </section>
  );
};

/**
 * Example 4: Scroll-Triggered Animation
 */
export const AnimatedSectionExample = () => {
  const sectionRef = useRef(null);
  const { isIntersecting } = useScrollAnimation(sectionRef);

  return (
    <section
      ref={sectionRef}
      className={`
        py-20 transition-all duration-1000
        ${isIntersecting
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
        }
      `}
    >
      <h2 className="text-4xl font-bold text-center mb-8">About Us</h2>
      <p className="text-lg text-center max-w-3xl mx-auto">
        We capture the beauty of life's precious moments in the stunning
        landscapes of Hawaii.
      </p>
    </section>
  );
};

/**
 * Example 5: Infinite Scroll Gallery
 */
export const InfiniteScrollExample = () => {
  const {
    images,
    isLoading,
    loadMore,
    isReachingEnd,
  } = useInfinitePortfolio(12);

  const loaderRef = useRef(null);

  // Automatically load more when scrolling to bottom
  useInfiniteScroll(loaderRef, {
    onLoadMore: loadMore,
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((image) => (
          <OptimizedImage
            key={image.id}
            src={image.url}
            alt={image.title}
            width={400}
            height={300}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ))}
      </div>

      {/* Loading indicator / trigger */}
      <div ref={loaderRef} className="text-center py-8">
        {isLoading && <p>Loading more images...</p>}
        {isReachingEnd && <p>No more images to load</p>}
      </div>
    </div>
  );
};

/**
 * Example 6: Blog Post List with SWR
 */
export const BlogListExample = () => {
  const { data: posts, isLoading, error } = useBlogPosts(6);

  if (isLoading) {
    return <BlogListSkeleton count={6} />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load blog posts</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts?.map((post) => (
        <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <OptimizedImage
            src={post.featured_image}
            alt={post.title}
            width={600}
            height={400}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            objectFit="cover"
          />

          <div className="p-6">
            <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <a
              href={`/blog/${post.slug}`}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Read More →
            </a>
          </div>
        </article>
      ))}
    </div>
  );
};

/**
 * Example 7: Lazy Loaded Component with Suspense
 */
export const LazyComponentExample = () => {
  const [showVideo, setShowVideo] = React.useState(false);

  return (
    <div>
      <button
        onClick={() => setShowVideo(true)}
        className="bg-blue-600 text-white px-6 py-3 rounded-full"
      >
        Watch Video
      </button>

      {showVideo && (
        <Suspense fallback={<ImageSkeleton aspectRatio="16/9" />}>
          <VideoPlayer url="https://example.com/video.mp4" />
        </Suspense>
      )}
    </div>
  );
};

/**
 * Example 8: Grid with Staggered Animation
 */
export const StaggeredGridExample = ({ items }: { items: any[] }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item, index) => {
        const itemRef = useRef(null);
        const { isIntersecting } = useScrollAnimation(itemRef);

        return (
          <div
            key={item.id}
            ref={itemRef}
            className={`
              transition-all duration-500
              ${isIntersecting
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
              }
            `}
            style={{
              transitionDelay: `${index * 100}ms`,
            }}
          >
            <OptimizedImage
              src={item.url}
              alt={item.title}
              width={400}
              height={300}
              sizes="33vw"
            />
          </div>
        );
      })}
    </div>
  );
};

/**
 * Example 9: Complete Page with All Optimizations
 */
export const CompletePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero with priority loading */}
      <HeroExample />

      {/* Immediate content */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8">Latest Work</h2>
        <GalleryExample />
      </section>

      {/* Lazy loaded section */}
      <LazyLoadSectionExample
        images={[
          /* ... */
        ]}
      />

      {/* Animated section */}
      <AnimatedSectionExample />

      {/* Blog posts */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8">Latest Articles</h2>
        <BlogListExample />
      </section>

      {/* Lazy loaded components */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <Suspense fallback={<div>Loading comments...</div>}>
          <CommentSection />
        </Suspense>
      </section>
    </div>
  );
};

/**
 * Example 10: Masonry Grid with Lazy Loading
 */
export const MasonryGridExample = ({ images }: { images: any[] }) => {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
      {images.map((image) => (
        <div key={image.id} className="mb-4 break-inside-avoid">
          <OptimizedImage
            src={image.url}
            alt={image.title}
            width={image.width}
            height={image.height}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            objectFit="cover"
            className="rounded-lg shadow-lg w-full"
          />
        </div>
      ))}
    </div>
  );
};

export default {
  HeroExample,
  GalleryExample,
  LazyLoadSectionExample,
  AnimatedSectionExample,
  InfiniteScrollExample,
  BlogListExample,
  LazyComponentExample,
  StaggeredGridExample,
  CompletePage,
  MasonryGridExample,
};
