import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Home,
  Info,
  Briefcase,
  Image,
  Film,
  Mail,
  Search,
  Library,
  Navigation,
  Shield,
  LockKeyhole,
  Layers
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'Homepage', path: '/admin/homepage', icon: <Home size={18} /> },
    { name: 'Hero Slides', path: '/admin/hero', icon: <Layers size={18} /> },
    { name: 'About Us', path: '/admin/about', icon: <Info size={18} /> },
    { name: 'Services', path: '/admin/services', icon: <Briefcase size={18} /> },
    { name: 'Portfolio', path: '/admin/portfolio', icon: <Image size={18} /> },
    { name: 'Blog Management', path: '/admin/blog', icon: <FileText size={18} /> },
    { name: 'Inquiries', path: '/admin/inquiries', icon: <MessageSquare size={18} /> },
    { name: 'Subscribers', path: '/admin/subscribers', icon: <Users size={18} /> },
    { name: 'Navigation Menu', path: '/admin/navigation', icon: <Navigation size={18} /> },
    { name: 'Media Library', path: '/admin/media', icon: <Library size={18} /> },
    { name: 'SEO Settings', path: '/admin/seo', icon: <Search size={18} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={18} /> },
  ];

  const securityItems = [
    { name: 'Change Password', path: '/admin/change-password', icon: <LockKeyhole size={18} /> },
    { name: 'Security Logs', path: '/admin/security-logs', icon: <Shield size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-30 h-screen w-64 bg-slate-800 transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:z-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-slate-700">
            <Link to="/" className="flex items-center space-x-2" target="_blank">
              <Sparkles size={18} className="text-yellow-400" />
              <span className="text-lg font-serif">Pure Ohana Admin</span>
            </Link>
          </div>
          
          <nav className="flex-grow py-5 overflow-y-auto">
            <div className="px-3 mb-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
              Content Management
            </div>
            <ul className="space-y-1 px-3 mb-6">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center px-3 py-2 rounded-md transition-colors
                      ${isActive ? 'bg-yellow-400/10 text-yellow-400' : 'text-gray-400 hover:bg-slate-700/60 hover:text-white'}
                    `}
                    end={item.path === '/admin'}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                    {item.path !== '/admin' && (
                      <ChevronRight size={14} className="ml-auto" />
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
            
            <div className="px-3 mb-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
              Security
            </div>
            <ul className="space-y-1 px-3">
              {securityItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center px-3 py-2 rounded-md transition-colors
                      ${isActive ? 'bg-yellow-400/10 text-yellow-400' : 'text-gray-400 hover:bg-slate-700/60 hover:text-white'}
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                    <ChevronRight size={14} className="ml-auto" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-5 border-t border-slate-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-gray-400 hover:text-white hover:bg-slate-700/60 rounded-md transition-colors"
            >
              <LogOut size={18} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Top Bar */}
        <header className="bg-slate-800 border-b border-slate-700 py-4 px-6 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="mr-4 lg:hidden text-gray-400 hover:text-white"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-lg font-light">Admin Dashboard</h1>
          </div>
          
          <div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-white px-3 py-1 border border-gray-600 rounded hover:bg-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;