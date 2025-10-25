/**
 * Pure Ohana Treasures - Working New Architecture
 *
 * Production-grade React application using EXISTING pages.
 * This version only uses pages that already exist!
 *
 * Features:
 * - Clean architecture with dependency injection
 * - Code splitting for optimal performance
 * - Authentication with protected routes
 * - Uses existing pages from old codebase
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { AuthProvider } from './contexts/AuthContext';
import { Container } from './infrastructure/container';
import { swrConfig } from './lib/swr-config';
import PageLoader from './components/PageLoader';
import { ProtectedRoute, RedirectIfAuthenticated } from './components/ProtectedRoute';

// Initialize dependency injection container
Container.initialize(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

/**
 * Lazy-loaded page components using EXISTING pages
 */
// Public Pages (using existing pages from old codebase)
const Home = lazy(() => import('./pages/Home'));  // NEW luxury home page
const About = lazy(() => import('./pages/AboutPage'));  // Existing
const Services = lazy(() => import('./pages/ServicesPage'));  // Existing
const Portfolio = lazy(() => import('./pages/PortfolioPage'));  // Existing
const Contact = lazy(() => import('./pages/Contact'));  // NEW contact with email
const BlogList = lazy(() => import('./pages/BlogPage'));  // Existing
const BlogPost = lazy(() => import('./pages/BlogPostDetail'));  // Existing

// Admin Pages (using existing admin pages)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminInquiries = lazy(() => import('./pages/admin/AdminInquiries'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminGalleries = lazy(() => import('./pages/admin/AdminHomepage'));  // Gallery management

// Layouts
const PublicLayout = lazy(() => import('./layouts/PublicLayout'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

/**
 * Main Application Component
 */
export default function App() {
  return (
    <BrowserRouter>
      <SWRConfig value={swrConfig}>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="services" element={<Services />} />
                <Route path="portfolio" element={<Portfolio />} />
                <Route path="contact" element={<Contact />} />
                <Route path="blog" element={<BlogList />} />
                <Route path="blog/:slug" element={<BlogPost />} />
              </Route>

              {/* Admin Login (redirect if already authenticated) */}
              <Route
                path="/admin/login"
                element={
                  <RedirectIfAuthenticated>
                    <AdminLogin />
                  </RedirectIfAuthenticated>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="galleries" element={<AdminGalleries />} />
                <Route path="inquiries" element={<AdminInquiries />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* 404 - Redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </SWRConfig>
    </BrowserRouter>
  );
}
