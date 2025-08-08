/**
 * Security Configuration for Pure Ohana Treasures
 * 
 * This file contains security-related configurations and utilities
 * to enhance the website's security posture.
 */

// Default security headers for fetch requests
export const securityHeaders = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data: https://images.pexels.com https://*.googleusercontent.com https://*.pexels.com https://ujpvlaaitdudcawgcyik.supabase.co https://*.supabase.co; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co; " +
    "frame-src 'self' https://www.youtube.com https://www.google.com; " +
    "object-src 'none'; " +
    "base-uri 'self';",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
};

// Security configuration for cookies
export const secureCookieOptions = {
  httpOnly: true,           // Prevents JavaScript access to cookies
  secure: true,             // Only send cookies over HTTPS
  sameSite: 'strict' as const, // Prevents CSRF attacks
  maxAge: 3600 * 24 * 7     // Cookie expiration time (7 days)
};

/**
 * Creates a nonce for CSP
 * @returns A cryptographically secure random string
 */
export const generateNonce = (): string => {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Sanitize user input to prevent XSS attacks
 * @param input The user input to sanitize
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Apply rate limiting for sensitive operations
 */
export class RateLimiter {
  private attempts: Map<string, { count: number, resetTime: number }> = new Map();
  private maxAttempts: number;
  private timeWindowMs: number;

  constructor(maxAttempts = 5, timeWindowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.timeWindowMs = timeWindowMs;
  }

  /**
   * Check if the operation should be rate limited
   * @param key Unique identifier for the operation (e.g. IP address, user ID)
   * @returns true if the operation is allowed, false if rate limited
   */
  checkLimit(key: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key) || { count: 0, resetTime: now + this.timeWindowMs };

    // Reset if time window has passed
    if (attempt.resetTime <= now) {
      attempt.count = 1;
      attempt.resetTime = now + this.timeWindowMs;
      this.attempts.set(key, attempt);
      return true;
    }

    // Increment attempt count
    attempt.count++;
    this.attempts.set(key, attempt);

    // Check if rate limit is exceeded
    return attempt.count <= this.maxAttempts;
  }

  /**
   * Get remaining attempts allowed
   * @param key Unique identifier for the operation
   * @returns Number of attempts remaining, or max attempts if no previous attempts
   */
  getRemainingAttempts(key: string): number {
    const attempt = this.attempts.get(key);
    if (!attempt) return this.maxAttempts;
    return Math.max(0, this.maxAttempts - attempt.count);
  }

  /**
   * Clear rate limit for a key
   * @param key Unique identifier to clear
   */
  clearLimit(key: string): void {
    this.attempts.delete(key);
  }
}

// Create a global rate limiter instance for login attempts
export const loginRateLimiter = new RateLimiter(5, 3600000); // 5 attempts per hour

export const isSecureContext = (): boolean => {
  if (typeof window !== 'undefined') {
    // Check if we're in a secure context (HTTPS)
    return window.isSecureContext;
  }
  return false;
};

// Helper to validate password strength
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
  return strongPasswordRegex.test(password);
};

// Helper to create a CSP-compatible hash for inline scripts
export const generateCSPHash = (content: string): string => {
  // This is a placeholder - in a real implementation, we'd use the Web Crypto API
  // to generate SHA-256 hashes of inline scripts
  return `'sha256-${btoa(content)}'`;
};