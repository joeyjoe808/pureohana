/**
 * SWR Configuration
 *
 * Centralized SWR configuration for data fetching with:
 * - Intelligent caching strategies
 * - Automatic revalidation
 * - Error retry logic
 * - Request deduplication
 * - Optimistic updates
 *
 * SWR (stale-while-revalidate) provides:
 * - Fast page loads by showing cached data first
 * - Background revalidation for fresh data
 * - Automatic refetch on focus/reconnect
 * - Request deduplication to prevent duplicate API calls
 */

import { SWRConfiguration } from 'swr';

/**
 * Default SWR configuration for the application
 */
export const swrConfig: SWRConfiguration = {
  /**
   * Default fetcher function using native fetch API
   */
  fetcher: async (url: string) => {
    const response = await fetch(url);

    if (!response.ok) {
      const error = new Error('An error occurred while fetching the data.');
      // Attach extra info to the error object
      (error as any).info = await response.json();
      (error as any).status = response.status;
      throw error;
    }

    return response.json();
  },

  /**
   * Automatically revalidate when window regains focus
   * @default true
   */
  revalidateOnFocus: true,

  /**
   * Automatically revalidate when network reconnects
   * @default true
   */
  revalidateOnReconnect: true,

  /**
   * Dedupe requests with the same key in this time span (ms)
   * Prevents duplicate API calls
   * @default 2000
   */
  dedupingInterval: 2000,

  /**
   * Cache data for this duration (ms)
   * 5 minutes default
   */
  focusThrottleInterval: 5000,

  /**
   * Retry on error
   * @default true
   */
  shouldRetryOnError: true,

  /**
   * Error retry configuration
   */
  errorRetryInterval: 5000, // Wait 5s between retries
  errorRetryCount: 3, // Retry up to 3 times

  /**
   * Loading timeout (ms)
   * Show error if request takes longer than this
   */
  loadingTimeout: 30000, // 30 seconds

  /**
   * Global error handler
   */
  onError: (error, key) => {
    console.error(`SWR Error [${key}]:`, error);

    // You can send errors to analytics service here
    // analytics.trackError(error, { key });
  },

  /**
   * Global success handler
   */
  onSuccess: (data, key) => {
    // Optional: Track successful fetches
    // console.log(`SWR Success [${key}]`);
  },

  /**
   * Compare function to detect data changes
   * Default is deep equal comparison
   */
  compare: (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  },
};

/**
 * Configuration for static data that rarely changes
 * (e.g., site settings, service offerings)
 */
export const staticDataConfig: SWRConfiguration = {
  ...swrConfig,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 60000, // 1 minute
  focusThrottleInterval: 3600000, // 1 hour
};

/**
 * Configuration for real-time data that needs frequent updates
 * (e.g., admin dashboard, live stats)
 */
export const realtimeConfig: SWRConfiguration = {
  ...swrConfig,
  refreshInterval: 5000, // Refresh every 5 seconds
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 1000,
};

/**
 * Configuration for infinite scroll/pagination
 */
export const paginationConfig: SWRConfiguration = {
  ...swrConfig,
  revalidateFirstPage: true,
  persistSize: true,
};

/**
 * Custom hook configurations for different data types
 */
export const swrConfigs = {
  default: swrConfig,
  static: staticDataConfig,
  realtime: realtimeConfig,
  pagination: paginationConfig,
};

export default swrConfig;
