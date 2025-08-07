import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import NavbarLuxury from './components/NavbarLuxury';
import PageLoader from './components/PageLoader';
import { supabase } from './lib/supabase';

// Lazy load the luxury pages
const HomePageLuxury = lazy(() => import('./pages/HomePageLuxurySupabase'));
const PortfolioLuxury = lazy(() => import('./pages/PortfolioLuxury'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

// Minimal page loader for luxury feel
const LuxuryLoader = () => (
  <div className="h-screen flex items-center justify-center bg-white">
    <div className="text-gray-300 font-extralight tracking-[0.3em] text-sm">
      LOADING
    </div>
  </div>
);

function AppLuxury() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <NavbarLuxury />
        <Suspense fallback={<LuxuryLoader />}>
          <Routes>
            {/* Public Routes - Minimal */}
            <Route path="/" element={<HomePageLuxury />} />
            <Route path="/portfolio" element={<PortfolioLuxury />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/investment" element={<ContactPage />} />
            
            {/* Redirect old routes */}
            <Route path="/services" element={<Navigate to="/investment" replace />} />
            <Route path="/blog" element={<Navigate to="/portfolio" replace />} />
            <Route path="/contact" element={<Navigate to="/investment" replace />} />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default AppLuxury;