/**
 * useIntersectionObserver Hook
 *
 * Custom hook for lazy loading and scroll-triggered animations using the Intersection Observer API.
 *
 * Features:
 * - Efficient lazy loading for images and components
 * - Scroll-triggered animations
 * - Freeze state once visible (prevent re-triggering)
 * - Configurable thresholds and root margins
 * - Memory-efficient cleanup
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const elementRef = useRef(null);
 *   const { isIntersecting, entry } = useIntersectionObserver(elementRef, {
 *     threshold: 0.5,
 *     rootMargin: '100px',
 *     freezeOnceVisible: true
 *   });
 *
 *   return (
 *     <div ref={elementRef}>
 *       {isIntersecting && <ExpensiveComponent />}
 *     </div>
 *   );
 * };
 * ```
 */

import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  /**
   * Percentage of target visibility to trigger callback
   * @default 0
   */
  threshold?: number | number[];

  /**
   * Margin around root element
   * @default '0px'
   */
  rootMargin?: string;

  /**
   * Root element for intersection detection
   * @default null (viewport)
   */
  root?: Element | null;

  /**
   * Freeze the state once visible (optimization for one-time animations)
   * @default false
   */
  freezeOnceVisible?: boolean;

  /**
   * Skip observer entirely (useful for SSR or conditional logic)
   * @default false
   */
  skip?: boolean;

  /**
   * Callback when intersection state changes
   */
  onChange?: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void;
}

interface UseIntersectionObserverReturn {
  /**
   * Whether the element is currently intersecting
   */
  isIntersecting: boolean;

  /**
   * The raw IntersectionObserverEntry object
   */
  entry: IntersectionObserverEntry | null;
}

/**
 * Hook to observe element visibility using Intersection Observer API
 */
export const useIntersectionObserver = (
  elementRef: RefObject<Element>,
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn => {
  const {
    threshold = 0,
    rootMargin = '0px',
    root = null,
    freezeOnceVisible = false,
    skip = false,
    onChange,
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const frozenRef = useRef(false);

  useEffect(() => {
    // Skip if requested or ref not set
    if (skip || !elementRef.current) {
      return;
    }

    // If already frozen, don't observe
    if (freezeOnceVisible && frozenRef.current) {
      return;
    }

    // Check if IntersectionObserver is supported
    if (typeof IntersectionObserver === 'undefined') {
      console.warn('IntersectionObserver is not supported in this browser');
      // Fallback: assume visible
      setIsIntersecting(true);
      return;
    }

    const element = elementRef.current;

    // Create observer instance
    const observer = new IntersectionObserver(
      (entries) => {
        const [observerEntry] = entries;

        setEntry(observerEntry);
        setIsIntersecting(observerEntry.isIntersecting);

        // Call onChange callback if provided
        onChange?.(observerEntry.isIntersecting, observerEntry);

        // Freeze state if requested and now visible
        if (freezeOnceVisible && observerEntry.isIntersecting) {
          frozenRef.current = true;
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    // Start observing
    observer.observe(element);

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [
    elementRef,
    threshold,
    rootMargin,
    root,
    freezeOnceVisible,
    skip,
    onChange,
  ]);

  return { isIntersecting, entry };
};

/**
 * Hook for lazy loading galleries and image grids
 *
 * @example
 * ```tsx
 * const Gallery = ({ images }) => {
 *   const containerRef = useRef(null);
 *   const { isIntersecting } = useGalleryLazyLoad(containerRef);
 *
 *   return (
 *     <div ref={containerRef}>
 *       {isIntersecting && images.map(img => <OptimizedImage key={img.id} {...img} />)}
 *     </div>
 *   );
 * };
 * ```
 */
export const useGalleryLazyLoad = (
  elementRef: RefObject<Element>,
  options?: Omit<UseIntersectionObserverOptions, 'threshold' | 'rootMargin' | 'freezeOnceVisible'>
) => {
  return useIntersectionObserver(elementRef, {
    threshold: 0.01,
    rootMargin: '200px 0px', // Load 200px before entering viewport
    freezeOnceVisible: true,
    ...options,
  });
};

/**
 * Hook for scroll-triggered animations
 *
 * @example
 * ```tsx
 * const AnimatedSection = () => {
 *   const sectionRef = useRef(null);
 *   const { isIntersecting } = useScrollAnimation(sectionRef);
 *
 *   return (
 *     <div
 *       ref={sectionRef}
 *       className={isIntersecting ? 'animate-fade-in' : 'opacity-0'}
 *     >
 *       Content
 *     </div>
 *   );
 * };
 * ```
 */
export const useScrollAnimation = (
  elementRef: RefObject<Element>,
  options?: Omit<UseIntersectionObserverOptions, 'threshold' | 'freezeOnceVisible'>
) => {
  return useIntersectionObserver(elementRef, {
    threshold: 0.2,
    freezeOnceVisible: true,
    ...options,
  });
};

/**
 * Hook for infinite scroll pagination
 *
 * @example
 * ```tsx
 * const InfiniteList = () => {
 *   const loaderRef = useRef(null);
 *   const { isIntersecting } = useInfiniteScroll(loaderRef, {
 *     onLoadMore: () => fetchMoreItems()
 *   });
 *
 *   return (
 *     <div>
 *       {items.map(item => <Item key={item.id} {...item} />)}
 *       <div ref={loaderRef}>Loading...</div>
 *     </div>
 *   );
 * };
 * ```
 */
export const useInfiniteScroll = (
  elementRef: RefObject<Element>,
  options?: UseIntersectionObserverOptions & {
    onLoadMore?: () => void | Promise<void>;
  }
) => {
  const { onLoadMore, ...observerOptions } = options || {};

  const result = useIntersectionObserver(elementRef, {
    threshold: 0.01,
    rootMargin: '100px',
    freezeOnceVisible: false, // Don't freeze for infinite scroll
    ...observerOptions,
  });

  // Trigger load more when intersecting
  useEffect(() => {
    if (result.isIntersecting && onLoadMore) {
      onLoadMore();
    }
  }, [result.isIntersecting, onLoadMore]);

  return result;
};

export default useIntersectionObserver;
