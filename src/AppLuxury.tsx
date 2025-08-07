import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import NavbarLuxury from './components/NavbarLuxury';
// import PageLoader from './components/PageLoader';
// import { supabase } from './lib/supabase';

// Import directly instead of lazy loading for now
import HomePageLuxury from './pages/HomePageLuxury';
import PortfolioLuxury from './pages/PortfolioLuxury';
import TestPage from './pages/TestPage';
// const AboutPage = lazy(() => import('./pages/AboutPage'));
// const ContactPage = lazy(() => import('./pages/ContactPage'));

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
        <Routes>
            {/* Test route */}
            <Route path="/test" element={<TestPage />} />
            
            {/* Public Routes - Minimal */}
            <Route path="/" element={<HomePageLuxury />} />
            <Route path="/portfolio" element={<PortfolioLuxury />} />
            <Route path="/about" element={<HomePageLuxury />} />
            <Route path="/investment" element={<HomePageLuxury />} />
            
            {/* Redirect old routes */}
            <Route path="/services" element={<Navigate to="/investment" replace />} />
            <Route path="/blog" element={<Navigate to="/portfolio" replace />} />
            <Route path="/contact" element={<Navigate to="/investment" replace />} />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </div>
    </BrowserRouter>
  );
}

export default AppLuxury;