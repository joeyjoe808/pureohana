/**
 * Security Configuration for Pure Ohana Treasures
 * 
 * This file contains security-related configurations and utilities
 * to enhance the website's security posture.
 */

// Default security headers for fetch requests
export const securityHeaders = {
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
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Validate email format
 * @param email The email to validate
 * @returns True if valid email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate a secure random token
 * @param length The desired token length
 * @returns A secure random token string
 */
export const generateSecureToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => chars[byte % chars.length]).join('');
};

/**
 * Rate limiting configuration
 */
export const rateLimitConfig = {
  maxRequests: 100,        // Maximum requests
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests, please try again later.'
};

/**
 * Session configuration
 */
export const sessionConfig = {
  secret: generateSecureToken(64),
  resave: false,
  saveUninitialized: false,
  cookie: secureCookieOptions
};