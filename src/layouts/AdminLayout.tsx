/**
 * Admin Layout Component
 *
 * Layout wrapper for all admin dashboard pages.
 *
 * Features:
 * - Sidebar navigation
 * - User profile menu
 * - Logout functionality
 * - Responsive design
 */

import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heading3, Body } from '../design-system';
import { isSuccess } from '../domain/core/Result';

/**
 * Admin Layout Component
 */
export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/**
 * Sidebar Component
 */
interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/galleries', label: 'Galleries', icon: '🖼️' },
    { path: '/admin/photos', label: 'Photos', icon: '📸' },
    { path: '/admin/inquiries', label: 'Inquiries', icon: '📬' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`
        ${isOpen ? 'w-64' : 'w-20'}
        bg-charcoal-900 text-white transition-all duration-300 flex flex-col
      `}
    >
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-charcoal-700">
        <Heading3 className={`text-white font-serif ${!isOpen && 'hidden'}`}>
          Pure Ohana
        </Heading3>
        {!isOpen && <span className="text-2xl">✨</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8">
        <ul className="space-y-2 px-4">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${
                    isActive(item.path)
                      ? 'bg-sunset-600 text-white'
                      : 'text-cream-200 hover:bg-charcoal-800'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                {isOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Back to Site Link */}
      <div className="p-4 border-t border-charcoal-700">
        <Link
          to="/"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-cream-200 hover:bg-charcoal-800 transition-colors"
        >
          <span className="text-xl">🏠</span>
          {isOpen && <span>View Site</span>}
        </Link>
      </div>
    </aside>
  );
}

/**
 * Header Component
 */
interface HeaderProps {
  onMenuClick: () => void;
}

function Header({ onMenuClick }: HeaderProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  async function handleSignOut() {
    const result = await signOut();
    if (isSuccess(result)) {
      navigate('/admin/login');
    }
  }

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="p-2 text-charcoal-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
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

      {/* Page Title */}
      <div className="flex-1"></div>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-10 h-10 bg-sunset-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {user?.email?.[0].toUpperCase()}
            </span>
          </div>
          <div className="text-left hidden md:block">
            <Body size="sm" className="text-charcoal-900 font-medium">
              {user?.email}
            </Body>
          </div>
          <svg
            className="w-5 h-5 text-charcoal-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
            <Link
              to="/admin/settings"
              className="block px-4 py-2 text-sm text-charcoal-700 hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              Settings
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
