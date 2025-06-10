import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import PageLoader from './components/PageLoader';
import AdminLogin from './components/admin/AdminLogin';
import { supabase } from './lib/supabase';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setIsLoading(false);
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostDetail = lazy(() => import('./pages/BlogPostDetail'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminInquiries = lazy(() => import('./pages/admin/AdminInquiries'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminSubscribers = lazy(() => import('./pages/admin/AdminSubscribers'));
const AdminHomepage = lazy(() => import('./pages/admin/AdminHomepage'));
const AdminHeroSection = lazy(() => import('./pages/admin/AdminHeroSection'));
const AdminAbout = lazy(() => import('./pages/admin/AdminAbout'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminPortfolio = lazy(() => import('./pages/admin/AdminPortfolio'));
const AdminMedia = lazy(() => import('./pages/admin/AdminMedia'));
const AdminNavigation = lazy(() => import('./pages/admin/AdminNavigation'));
const AdminSEO = lazy(() => import('./pages/admin/AdminSEO'));
const AdminChangePassword = lazy(() => import('./pages/admin/AdminChangePassword'));
const SecurityLogs = lazy(() => import('./pages/admin/SecurityLogs'));

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<BlogPostDetail />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="homepage" element={<AdminHomepage />} />
            <Route path="hero" element={<AdminHeroSection />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="portfolio" element={<AdminPortfolio />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="subscribers" element={<AdminSubscribers />} />
            <Route path="navigation" element={<AdminNavigation />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="seo" element={<AdminSEO />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="change-password" element={<AdminChangePassword />} />
            <Route path="security-logs" element={<SecurityLogs />} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/\" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;