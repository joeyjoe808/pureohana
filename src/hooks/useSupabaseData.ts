/**
 * Supabase Data Fetching Hooks with SWR
 *
 * Custom hooks for fetching data from Supabase with:
 * - Automatic caching and revalidation
 * - Type-safe data fetching
 * - Loading and error states
 * - Optimistic updates
 * - Mutation support
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { data, isLoading, error, mutate } = usePortfolioImages();
 *
 *   if (isLoading) return <SkeletonLoader />;
 *   if (error) return <ErrorMessage />;
 *
 *   return <Gallery images={data} />;
 * };
 * ```
 */

import useSWR, { useSWRConfig, SWRConfiguration } from 'swr';
import { supabase } from '../lib/supabase';
import { swrConfigs } from '../lib/swr-config';

/**
 * Generic Supabase fetcher with error handling
 */
const supabaseFetcher = async <T>(
  table: string,
  select: string = '*',
  filters?: Record<string, any>
): Promise<T> => {
  let query = supabase.from(table).select(select);

  // Apply filters
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data as T;
};

/**
 * Hook to fetch portfolio images with caching
 */
export const usePortfolioImages = (category?: string) => {
  const key = category
    ? ['portfolio', 'images', category]
    : ['portfolio', 'images'];

  return useSWR(
    key,
    () =>
      supabaseFetcher('portfolio_images', '*', {
        category,
        is_published: true,
      }),
    swrConfigs.static
  );
};

/**
 * Hook to fetch blog posts with caching
 */
export const useBlogPosts = (limit?: number) => {
  const key = limit ? ['blog', 'posts', limit] : ['blog', 'posts'];

  return useSWR(
    key,
    async () => {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw new Error(error.message);
      return data;
    },
    swrConfigs.static
  );
};

/**
 * Hook to fetch single blog post by slug
 */
export const useBlogPost = (slug: string | null) => {
  return useSWR(
    slug ? ['blog', 'post', slug] : null,
    async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    swrConfigs.static
  );
};

/**
 * Hook to fetch services
 */
export const useServices = () => {
  return useSWR(
    ['services'],
    () => supabaseFetcher('services', '*', { is_active: true }),
    swrConfigs.static
  );
};

/**
 * Hook to fetch site settings
 */
export const useSiteSettings = () => {
  return useSWR(
    ['site', 'settings'],
    async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    swrConfigs.static
  );
};

/**
 * Hook to fetch testimonials
 */
export const useTestimonials = () => {
  return useSWR(
    ['testimonials'],
    async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
    swrConfigs.static
  );
};

/**
 * Hook for admin dashboard stats (realtime updates)
 */
export const useDashboardStats = () => {
  return useSWR(
    ['dashboard', 'stats'],
    async () => {
      // Fetch various stats in parallel
      const [inquiries, subscribers, posts, images] = await Promise.all([
        supabase.from('inquiries').select('id', { count: 'exact', head: true }),
        supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('portfolio_images').select('id', { count: 'exact', head: true }),
      ]);

      return {
        inquiries: inquiries.count || 0,
        subscribers: subscribers.count || 0,
        posts: posts.count || 0,
        images: images.count || 0,
      };
    },
    swrConfigs.realtime
  );
};

/**
 * Hook for infinite scroll pagination
 */
export const useInfinitePortfolio = (pageSize: number = 12) => {
  const { data, error, size, setSize, isLoading, isValidating } = useSWR(
    (pageIndex: number) => ['portfolio', 'infinite', pageIndex],
    async (key: any) => {
      const pageIndex = key[2];
      const from = pageIndex * pageSize;
      const to = from + pageSize - 1;

      const { data, error } = await supabase
        .from('portfolio_images')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw new Error(error.message);
      return data;
    },
    swrConfigs.pagination
  );

  const images = data ? data.flat() : [];
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < pageSize);

  return {
    images,
    isLoading,
    isValidating,
    error,
    size,
    setSize,
    isEmpty,
    isReachingEnd,
    loadMore: () => setSize(size + 1),
  };
};

/**
 * Hook for optimistic mutations
 */
export const useOptimisticMutation = <T>(key: string | any[]) => {
  const { mutate } = useSWRConfig();

  const optimisticUpdate = async (
    updater: (currentData: T) => T,
    mutation: () => Promise<T>
  ) => {
    // Optimistically update the cache
    await mutate(
      key,
      async (currentData: T) => {
        return updater(currentData);
      },
      {
        optimisticData: updater,
        rollbackOnError: true,
        revalidate: false,
      }
    );

    // Perform actual mutation
    try {
      const result = await mutation();
      // Revalidate to sync with server
      await mutate(key);
      return result;
    } catch (error) {
      // SWR will automatically rollback on error
      throw error;
    }
  };

  return { optimisticUpdate };
};

/**
 * Hook to prefetch data for faster navigation
 */
export const usePrefetch = () => {
  const { cache, mutate } = useSWRConfig();

  const prefetch = async (key: string | any[], fetcher: () => Promise<any>) => {
    // Only prefetch if not already in cache
    if (!cache.get(key)) {
      await mutate(key, fetcher, { revalidate: false });
    }
  };

  return { prefetch };
};

/**
 * Hook to clear specific cache keys
 */
export const useClearCache = () => {
  const { mutate } = useSWRConfig();

  const clearCache = (keyPattern: string) => {
    // This will clear all cache entries matching the pattern
    mutate(
      (key: any) => {
        if (typeof key === 'string') {
          return key.includes(keyPattern);
        }
        if (Array.isArray(key)) {
          return key.some((k) => typeof k === 'string' && k.includes(keyPattern));
        }
        return false;
      },
      undefined,
      { revalidate: true }
    );
  };

  return { clearCache };
};

export default {
  usePortfolioImages,
  useBlogPosts,
  useBlogPost,
  useServices,
  useSiteSettings,
  useTestimonials,
  useDashboardStats,
  useInfinitePortfolio,
  useOptimisticMutation,
  usePrefetch,
  useClearCache,
};
