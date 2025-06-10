/**
 * Security Utilities for the Pure Ohana Treasures application
 */

// Sanitize input to prevent XSS attacks
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Replace potentially dangerous characters
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (!password) {
    return { valid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  return { valid: true, message: 'Password is strong' };
};

// Log security events (in a real app, these would likely be sent to a secure logging service)
export const logSecurityEvent = (eventType: string, details: any): void => {
  console.log(`SECURITY EVENT [${eventType}]:`, details);
  
  // In production, you'd want to send these to a secure logging service
  // For example: await sendToSecureLoggingService(eventType, details);
};

// Generate a secure session ID
export const generateSecureSessionId = (): string => {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Rate limiting helper (simple in-memory implementation)
const rateLimitStore: { [key: string]: { count: number, resetTime: number } } = {};

export const checkRateLimit = (key: string, maxAttempts: number, windowMs: number): boolean => {
  const now = Date.now();
  
  // Create or get the record for this key
  if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
    rateLimitStore[key] = { count: 0, resetTime: now + windowMs };
  }
  
  // Increment the counter
  rateLimitStore[key].count++;
  
  // Check if rate limit is exceeded
  return rateLimitStore[key].count <= maxAttempts;
};

// Clear sensitive data
export const clearSensitiveData = (): void => {
  // Clear any sensitive data in localStorage/sessionStorage
  // Be careful not to remove auth tokens you need
  const keysToPreserve = ['sb-'];
  
  // Clear sessionStorage except for necessary keys
  Object.keys(sessionStorage).forEach(key => {
    if (!keysToPreserve.some(prefix => key.startsWith(prefix))) {
      sessionStorage.removeItem(key);
    }
  });
  
  // Only clear non-essential localStorage items
  Object.keys(localStorage).forEach(key => {
    if (!keysToPreserve.some(prefix => key.startsWith(prefix))) {
      localStorage.removeItem(key);
    }
  });
};