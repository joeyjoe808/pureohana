/**
 * Public Layout Component
 *
 * Layout wrapper for all public-facing pages.
 *
 * Features:
 * - Responsive navigation
 * - Elegant footer
 * - Scroll-to-top on route change
 * - Consistent spacing and structure
 */

import { useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Heading3, BodyText as Body } from '../design-system';

/**
 * Public Layout Component
 */
export default function PublicLayout() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

/**
 * Navigation Component
 */
function Navigation() {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-charcoal-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-serif font-bold text-charcoal-900">
              Pure Ohana
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  text-sm font-medium transition-colors duration-200
                  ${
                    isActive(link.path)
                      ? 'text-sunset-600 border-b-2 border-sunset-600'
                      : 'text-charcoal-700 hover:text-sunset-600'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-charcoal-700 hover:text-sunset-600">
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

/**
 * Footer Component
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-900 text-cream-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Heading3 className="text-white mb-4 font-serif">Pure Ohana Treasures</Heading3>
            <Body size="sm" className="text-cream-200">
              Capturing the purest moments and frozen emotions in Hawaii and beyond.
            </Body>
          </div>

          {/* Quick Links */}
          <div>
            <Heading3 className="text-white mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </Heading3>
            <ul className="space-y-2">
              <FooterLink to="/portfolio">Portfolio</FooterLink>
              <FooterLink to="/about">About</FooterLink>
              <FooterLink to="/services">Services</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <Heading3 className="text-white mb-4 text-sm uppercase tracking-wider">
              Get in Touch
            </Heading3>
            <ul className="space-y-2">
              <li>
                <Body size="sm" className="text-cream-200">
                  📧 inquiries@pureohanatreasures.com
                </Body>
              </li>
              <li>
                <Body size="sm" className="text-cream-200">
                  📍 Honolulu, Hawaii
                </Body>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-charcoal-700 text-center">
          <Body size="sm" className="text-cream-300">
            © {currentYear} Pure Ohana Treasures. All rights reserved.
          </Body>
        </div>
      </div>
    </footer>
  );
}

/**
 * Footer Link Component
 */
function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        to={to}
        className="text-sm text-cream-200 hover:text-sunset-400 transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}
