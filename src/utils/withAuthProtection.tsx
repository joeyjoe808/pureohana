import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PageLoader from '../components/PageLoader';
import { logSecurityEvent } from './securityUtils';

// Higher-order component to protect admin routes
export const withAuthProtection = (Component: React.ComponentType<any>) => {
  const AuthProtected: React.FC = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [user, setUser] = useState<any>(null);
    const location = useLocation();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const { data } = await supabase.auth.getSession();
          
          if (data.session) {
            setIsAuthenticated(true);
            setUser(data.session.user);
            
            // Log the successful access
            logSecurityEvent('page_access', { 
              path: location.pathname,
              userId: data.session.user.id
            });
          } else {
            setIsAuthenticated(false);
            
            // Log the unauthorized access attempt
            logSecurityEvent('unauthorized_access_attempt', { 
              path: location.pathname 
            });
          }
        } catch (error) {
          console.error('Auth check error:', error);
          setIsAuthenticated(false);
        }
      };
      
      checkAuth();
      
      // Set up auth state listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === 'SIGNED_IN') {
            setIsAuthenticated(true);
            setUser(session?.user || null);
          } else if (event === 'SIGNED_OUT') {
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      );
      
      return () => {
        // Clean up the subscription
        if (authListener && authListener.subscription) {
          authListener.subscription.unsubscribe();
        }
      };
    }, [location.pathname]);

    // While checking authentication status, show loader
    if (isAuthenticated === null) {
      return <PageLoader />;
    }
    
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      // Preserve the attempted URL for redirect after login
      return <Navigate to="/admin/login\" state={{ from: location }} replace />;
    }
    
    // If authenticated, render the protected component
    return <Component {...props} user={user} />;
  };
  
  return AuthProtected;
};

export default withAuthProtection;