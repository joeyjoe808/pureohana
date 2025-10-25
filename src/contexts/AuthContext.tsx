/**
 * Authentication Context
 *
 * Provides authentication state and methods throughout the application.
 * Follows SOLID principles with single responsibility and dependency injection.
 *
 * Features:
 * - Type-safe authentication state
 * - Automatic session management
 * - Error handling with Result pattern
 * - Security event logging
 * - Session refresh
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Result, success, failure } from '../domain/core/Result';
import { AuthenticationError, ValidationError } from '../domain/core/errors';

/**
 * Authentication state interface
 */
export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Authentication context value interface
 */
export interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<Result<User, AuthenticationError>>;
  signOut: () => Promise<Result<void, Error>>;
  refreshSession: () => Promise<Result<Session, Error>>;
  clearError: () => void;
}

/**
 * Create authentication context
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Authentication provider props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 *
 * Manages authentication state and provides auth methods to children.
 * Automatically handles session persistence and refresh.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!session;

  /**
   * Initialize authentication state on mount
   */
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Set up auth state change listener
   */
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Initialize authentication state
   */
  async function initializeAuth() {
    try {
      setIsLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
        setError(error.message);
        setUser(null);
        setSession(null);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
    } catch (err) {
      console.error('Unexpected error initializing auth:', err);
      setError('Failed to initialize authentication');
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Sign in with email and password
   *
   * @param email - User email address
   * @param password - User password
   * @returns Result with User or AuthenticationError
   */
  async function signIn(
    email: string,
    password: string
  ): Promise<Result<User, AuthenticationError>> {
    try {
      // Validate inputs
      if (!email || !email.includes('@')) {
        return failure(new ValidationError('Invalid email address'));
      }

      if (!password || password.length < 6) {
        return failure(new ValidationError('Password must be at least 6 characters'));
      }

      setIsLoading(true);
      setError(null);

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        const error = new AuthenticationError(
          authError.message || 'Authentication failed',
          authError.status
        );
        setError(error.message);
        return failure(error);
      }

      if (!data.user) {
        const error = new AuthenticationError('No user returned from authentication');
        setError(error.message);
        return failure(error);
      }

      // Update state
      setUser(data.user);
      setSession(data.session);
      setError(null);

      // Log security event
      await logSecurityEvent('auth_sign_in_success', {
        user_id: data.user.id,
        email_partial: email.slice(0, 3) + '***',
      });

      return success(data.user);
    } catch (err) {
      const error = new AuthenticationError(
        err instanceof Error ? err.message : 'Unexpected authentication error'
      );
      setError(error.message);
      return failure(error);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Sign out current user
   *
   * @returns Result with void or Error
   */
  async function signOut(): Promise<Result<void, Error>> {
    try {
      setIsLoading(true);
      setError(null);

      const userId = user?.id;

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        setError(signOutError.message);
        return failure(signOutError);
      }

      // Clear state
      setUser(null);
      setSession(null);
      setError(null);

      // Log security event
      if (userId) {
        await logSecurityEvent('auth_sign_out', { user_id: userId });
      }

      return success(undefined);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unexpected sign out error');
      setError(error.message);
      return failure(error);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Refresh current session
   *
   * @returns Result with Session or Error
   */
  async function refreshSession(): Promise<Result<Session, Error>> {
    try {
      setIsLoading(true);

      const { data, error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError) {
        setError(refreshError.message);
        return failure(refreshError);
      }

      if (!data.session) {
        const error = new Error('No session returned from refresh');
        setError(error.message);
        return failure(error);
      }

      setSession(data.session);
      setUser(data.session.user);
      setError(null);

      return success(data.session);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unexpected refresh error');
      setError(error.message);
      return failure(error);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Clear current error
   */
  function clearError() {
    setError(null);
  }

  /**
   * Log security event (fire and forget)
   */
  async function logSecurityEvent(action: string, details: Record<string, any>) {
    try {
      // Non-blocking security logging
      setTimeout(async () => {
        await supabase.from('security_audit_logs').insert([
          {
            action,
            details,
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          },
        ]);
      }, 0);
    } catch (err) {
      // Silent failure - don't disrupt user experience
      console.error('Security logging error:', err);
    }
  }

  const value: AuthContextValue = {
    user,
    session,
    isAuthenticated,
    isLoading,
    error,
    signIn,
    signOut,
    refreshSession,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use authentication context
 *
 * @throws Error if used outside AuthProvider
 * @returns AuthContextValue
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

/**
 * Hook to require authentication
 *
 * Returns auth context and throws if user is not authenticated.
 * Useful for components that require authentication.
 *
 * @throws Error if user is not authenticated
 * @returns AuthContextValue with guaranteed user
 */
export function useRequireAuth(): AuthContextValue & { user: User; session: Session } {
  const auth = useAuth();

  if (!auth.isAuthenticated || !auth.user || !auth.session) {
    throw new Error('User must be authenticated to access this resource');
  }

  return auth as AuthContextValue & { user: User; session: Session };
}
