/**
 * Security middleware for development environment
 * In production, we use the _headers file for Netlify
 */
import { securityHeaders } from './securityConfig';

export const applySecurityMiddleware = (req: Request, res: Response, next: Function) => {
  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  
  // Detect and prevent common attack patterns
  const url = req.url.toLowerCase();
  
  // Prevent directory traversal attempts
  if (url.includes('../') || url.includes('..%2f')) {
    console.error('Security violation: Directory traversal attempt blocked');
    return res.status(403).send('Forbidden');
  }
  
  // Block suspicious SQL injection attempts
  const suspiciousPatterns = ['union+select', 'exec(', 'eval(', 'select+from', '--', '/*', 'drop+table'];
  if (suspiciousPatterns.some(pattern => url.includes(pattern))) {
    console.error('Security violation: Possible SQL injection attempt blocked');
    return res.status(403).send('Forbidden');
  }
  
  next();
};

// For Vite development server
export const configureViteSecurityMiddleware = (server: any) => {
  server.middlewares.use((req, res, next) => {
    // Apply security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    // Continue processing the request
    next();
  });
};