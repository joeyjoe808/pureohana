/**
 * Protected Route Component
 *
 * Wraps routes that require authentication.
 * Redirects unauthenticated users to login page.
 *
 * Follows SOLID principles:
 * - Single Responsibility: Only handles route protection
 * - Open/Closed: Extensible through props
 * - Liskov Substitution: Drop-in replacement for Route
 */

import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PageLoader from '../components/PageLoader';

/**
 * Protected Route Props
 */
interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * Protected Route Component
 *
 * Renders children only if user is authenticated,
 * otherwise redirects to login page.
 *
 * @param children - Components to render when authenticated
 * @param redirectTo - Path to redirect to when not authenticated (default: /admin/login)
 */
export function ProtectedRoute({
  children,
  redirectTo = '/admin/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loader while checking authentication
  if (isLoading) {
    return <PageLoader />;
  }

  // Redirect to login if not authenticated
  // Pass current location so we can redirect back after login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Render protected content
  return <>{children}</>;
}

/**
 * Redirect If Authenticated Component
 *
 * Redirects to specified path if user is already authenticated.
 * Useful for login/signup pages.
 *
 * @param children - Components to render when not authenticated
 * @param redirectTo - Path to redirect to when authenticated (default: /admin)
 */
export function RedirectIfAuthenticated({
  children,
  redirectTo = '/admin',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loader while checking authentication
  if (isLoading) {
    return <PageLoader />;
  }

  // Redirect if already authenticated
  // Check if there's a "from" location to return to
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }

  // Render login/signup page
  return <>{children}</>;
}
