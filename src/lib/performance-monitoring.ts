/**
 * Performance Monitoring with Web Vitals
 *
 * Monitors Core Web Vitals and sends metrics to analytics:
 * - LCP (Largest Contentful Paint) - Target: <2.5s
 * - FID (First Input Delay) - Target: <100ms
 * - CLS (Cumulative Layout Shift) - Target: <0.1
 * - FCP (First Contentful Paint) - Target: <1.8s
 * - TTFB (Time to First Byte) - Target: <600ms
 *
 * Also tracks custom performance metrics:
 * - Route change duration
 * - Image load times
 * - API response times
 * - Bundle load times
 */

import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

/**
 * Performance thresholds based on Google recommendations
 */
export const PERFORMANCE_THRESHOLDS = {
  LCP: {
    good: 2500,
    needsImprovement: 4000,
    poor: Infinity,
  },
  INP: {
    good: 200,
    needsImprovement: 500,
    poor: Infinity,
  },
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
    poor: Infinity,
  },
  FCP: {
    good: 1800,
    needsImprovement: 3000,
    poor: Infinity,
  },
  TTFB: {
    good: 600,
    needsImprovement: 1500,
    poor: Infinity,
  },
} as const;

/**
 * Rating type for metrics
 */
type MetricRating = 'good' | 'needs-improvement' | 'poor';

/**
 * Get rating for a metric value
 */
const getMetricRating = (
  metricName: keyof typeof PERFORMANCE_THRESHOLDS,
  value: number
): MetricRating => {
  const thresholds = PERFORMANCE_THRESHOLDS[metricName];

  if (value <= thresholds.good) {
    return 'good';
  }
  if (value <= thresholds.needsImprovement) {
    return 'needs-improvement';
  }
  return 'poor';
};

/**
 * Analytics handler interface
 */
interface AnalyticsHandler {
  trackEvent: (eventName: string, properties: Record<string, any>) => void;
}

/**
 * Console logger for development
 */
const consoleHandler: AnalyticsHandler = {
  trackEvent: (eventName, properties) => {
    console.log(`[Performance] ${eventName}:`, properties);
  },
};

/**
 * Google Analytics handler
 */
const googleAnalyticsHandler: AnalyticsHandler = {
  trackEvent: (eventName, properties) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }
  },
};

/**
 * Supabase analytics handler (custom implementation)
 */
const supabaseAnalyticsHandler: AnalyticsHandler = {
  trackEvent: async (eventName, properties) => {
    try {
      // Send to Supabase analytics table
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: eventName,
          properties,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send analytics');
      }
    } catch (error) {
      console.error('Analytics error:', error);
    }
  },
};

/**
 * Performance metrics handler
 */
class PerformanceMonitor {
  private handlers: AnalyticsHandler[] = [];
  private customMetrics: Map<string, number> = new Map();

  constructor() {
    // Add console handler in development
    if (import.meta.env.DEV) {
      this.addHandler(consoleHandler);
    }

    // Add production handlers
    if (import.meta.env.PROD) {
      this.addHandler(googleAnalyticsHandler);
      // this.addHandler(supabaseAnalyticsHandler);
    }
  }

  /**
   * Add analytics handler
   */
  addHandler(handler: AnalyticsHandler) {
    this.handlers.push(handler);
  }

  /**
   * Send metric to all handlers
   */
  private sendMetric(metric: Metric) {
    const rating = getMetricRating(
      metric.name as keyof typeof PERFORMANCE_THRESHOLDS,
      metric.value
    );

    const properties = {
      metric_name: metric.name,
      metric_value: metric.value,
      metric_rating: rating,
      metric_id: metric.id,
      metric_delta: metric.delta,
      navigation_type: metric.navigationType,
    };

    this.handlers.forEach((handler) => {
      handler.trackEvent('web_vital', properties);
    });

    // Log to performance budget checker
    this.checkPerformanceBudget(metric.name as any, metric.value, rating);
  }

  /**
   * Check if metric exceeds performance budget
   */
  private checkPerformanceBudget(
    metricName: keyof typeof PERFORMANCE_THRESHOLDS,
    value: number,
    rating: MetricRating
  ) {
    const threshold = PERFORMANCE_THRESHOLDS[metricName].good;

    if (value > threshold) {
      console.warn(
        `Performance Budget Exceeded: ${metricName} = ${value.toFixed(2)} (threshold: ${threshold}, rating: ${rating})`
      );

      // Send warning to analytics
      this.handlers.forEach((handler) => {
        handler.trackEvent('performance_budget_exceeded', {
          metric: metricName,
          value,
          threshold,
          rating,
          exceededBy: value - threshold,
        });
      });
    }
  }

  /**
   * Initialize Web Vitals monitoring
   */
  initWebVitals() {
    onCLS((metric) => this.sendMetric(metric));
    onINP((metric) => this.sendMetric(metric));
    onFCP((metric) => this.sendMetric(metric));
    onLCP((metric) => this.sendMetric(metric));
    onTTFB((metric) => this.sendMetric(metric));
  }

  /**
   * Track custom metric
   */
  trackCustomMetric(name: string, value: number, metadata?: Record<string, any>) {
    this.customMetrics.set(name, value);

    this.handlers.forEach((handler) => {
      handler.trackEvent('custom_metric', {
        metric_name: name,
        metric_value: value,
        ...metadata,
      });
    });
  }

  /**
   * Track route change performance
   */
  trackRouteChange(route: string, duration: number) {
    this.trackCustomMetric('route_change', duration, { route });
  }

  /**
   * Track image load performance
   */
  trackImageLoad(src: string, duration: number, size?: number) {
    this.trackCustomMetric('image_load', duration, { src, size });
  }

  /**
   * Track API response time
   */
  trackAPIResponse(endpoint: string, duration: number, status: number) {
    this.trackCustomMetric('api_response', duration, { endpoint, status });
  }

  /**
   * Track bundle load time
   */
  trackBundleLoad(bundleName: string, duration: number) {
    this.trackCustomMetric('bundle_load', duration, { bundle: bundleName });
  }

  /**
   * Get all custom metrics
   */
  getCustomMetrics(): Record<string, number> {
    return Object.fromEntries(this.customMetrics);
  }

  /**
   * Clear custom metrics
   */
  clearCustomMetrics() {
    this.customMetrics.clear();
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const metrics = this.getCustomMetrics();
    const report = Object.entries(metrics)
      .map(([name, value]) => `${name}: ${value.toFixed(2)}ms`)
      .join('\n');

    return `Performance Report:\n${report}`;
  }
}

/**
 * Singleton instance
 */
export const performanceMonitor = new PerformanceMonitor();

/**
 * Initialize performance monitoring
 */
export const initPerformanceMonitoring = () => {
  performanceMonitor.initWebVitals();

  // Track when page becomes visible
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      performanceMonitor.trackCustomMetric(
        'page_visible',
        performance.now()
      );
    }
  });

  // Track first interaction
  let firstInteraction = true;
  ['click', 'touchstart', 'keydown'].forEach((event) => {
    document.addEventListener(event, () => {
      if (firstInteraction) {
        performanceMonitor.trackCustomMetric(
          'first_interaction',
          performance.now()
        );
        firstInteraction = false;
      }
    }, { once: true });
  });

  console.log('Performance monitoring initialized');
};

/**
 * Higher-order function to measure execution time
 */
export const measurePerformance = <T extends (...args: any[]) => any>(
  fn: T,
  metricName: string
): T => {
  return ((...args: any[]) => {
    const start = performance.now();
    const result = fn(...args);

    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - start;
        performanceMonitor.trackCustomMetric(metricName, duration);
      });
    } else {
      const duration = performance.now() - start;
      performanceMonitor.trackCustomMetric(metricName, duration);
      return result;
    }
  }) as T;
};

/**
 * React hook to measure component render time
 */
export const useMeasureRender = (componentName: string) => {
  const startTime = performance.now();

  return () => {
    const duration = performance.now() - startTime;
    performanceMonitor.trackCustomMetric(`${componentName}_render`, duration);
  };
};

export default performanceMonitor;
