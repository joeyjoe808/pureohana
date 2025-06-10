import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  Activity, 
  TrendingUp,
  Eye,
  ArrowUpRight,
  AlertTriangle,
  Info,
  MessageSquare,
  Home
} from 'lucide-react';
import ConnectionTester from './ConnectionTester';

const StatsCard = ({ title, value, icon, description, trend }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="bg-slate-700 p-3 rounded-lg">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingUp size={16} className="mr-1 transform rotate-180" />}
            <span className="text-sm">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-serif text-white mb-1">{value}</div>
      <div className="font-medium text-gray-300 mb-2">{title}</div>
      <div className="text-xs text-gray-400">{description}</div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    subscribers: 0,
    inquiries: 0,
    blogPosts: 0,
    activeUsers: 0
  });
  const [recentSubscribers, setRecentSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch subscriber count
        const { count: subscriberCount, error: subscriberError } = await supabase
          .from('newsletter_subscribers')
          .select('*', { count: 'exact', head: true });
          
        if (subscriberError) {
          throw subscriberError;
        }
        
        // Fetch recent subscribers
        const { data: recentSubs, error: recentSubsError } = await supabase
          .from('newsletter_subscribers')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (recentSubsError) {
          throw recentSubsError;
        }
        
        // Fetch post count
        const { count: postCount, error: postError } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true });
          
        if (postError) {
          throw postError;
        }

        // Set the data
        setStats({
          subscribers: subscriberCount || 0,
          inquiries: 12, // Mock data
          blogPosts: postCount || 0,
          activeUsers: 24 // Mock data
        });
        
        setRecentSubscribers(recentSubs || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-2xl font-serif text-white mb-2">Welcome back</h1>
        <p className="text-gray-400">
          Here's what's happening with Pure Ohana Treasures today.
        </p>
      </header>

      {/* Connection Status */}
      <ConnectionTester />
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4 mb-6 flex items-start">
          <AlertTriangle size={18} className="text-red-400 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-300 font-medium">Error loading dashboard data</p>
            <p className="text-red-300 text-sm mt-1">{error}</p>
            <p className="text-red-300 text-sm mt-2">This may be due to connection issues with Supabase. Please check your CORS settings and make sure your database is accessible.</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard 
          title="Total Subscribers" 
          value={stats.subscribers}
          icon={<Users size={20} className="text-yellow-400" />} 
          description="Total newsletter subscribers"
          trend={8}
        />
        <StatsCard 
          title="Inquiries" 
          value={stats.inquiries}
          icon={<MessageSquare size={20} className="text-blue-400" />} 
          description="New client inquiries this month"
          trend={12}
        />
        <StatsCard 
          title="Blog Posts" 
          value={stats.blogPosts}
          icon={<FileText size={20} className="text-purple-400" />} 
          description="Published articles on the website"
          trend={0}
        />
        <StatsCard 
          title="Website Traffic" 
          value={stats.activeUsers}
          icon={<Eye size={20} className="text-green-400" />} 
          description="Active users today"
          trend={-3}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800 rounded-lg p-6 mb-10">
        <h2 className="text-lg font-medium text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/admin/homepage" 
            className="bg-slate-700 hover:bg-slate-600 transition-colors p-4 rounded-md flex items-center justify-between"
          >
            <div className="flex items-center">
              <Home size={20} className="text-yellow-400 mr-3" />
              <span className="text-white">Edit Homepage</span>
            </div>
            <ArrowUpRight size={16} className="text-gray-400" />
          </Link>
          <Link 
            to="/admin/blog" 
            className="bg-slate-700 hover:bg-slate-600 transition-colors p-4 rounded-md flex items-center justify-between"
          >
            <div className="flex items-center">
              <FileText size={20} className="text-yellow-400 mr-3" />
              <span className="text-white">Manage Blog</span>
            </div>
            <ArrowUpRight size={16} className="text-gray-400" />
          </Link>
          <Link 
            to="/admin/subscribers" 
            className="bg-slate-700 hover:bg-slate-600 transition-colors p-4 rounded-md flex items-center justify-between"
          >
            <div className="flex items-center">
              <Users size={20} className="text-green-400 mr-3" />
              <span className="text-white">Manage Subscribers</span>
            </div>
            <ArrowUpRight size={16} className="text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Subscribers */}
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-white">Recent Subscribers</h2>
            <Link to="/admin/subscribers" className="text-sm text-yellow-400 hover:text-yellow-300">
              View all
            </Link>
          </div>
          {recentSubscribers.length > 0 ? (
            <div className="space-y-4">
              {recentSubscribers.map((subscriber) => (
                <div key={subscriber.id} className="flex items-start p-3 bg-slate-700/50 rounded-md">
                  <div className="bg-slate-700 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-yellow-400 text-xs">
                      {subscriber.email.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{subscriber.email}</div>
                    <div className="text-xs text-gray-400 flex items-center mt-1">
                      <Clock size={12} className="mr-1" />
                      {new Date(subscriber.created_at).toLocaleDateString()} • 
                      <span className="ml-1">{subscriber.source || 'website'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">No recent subscribers</div>
              <p className="text-sm text-gray-500">
                New subscribers will appear here when they sign up.
              </p>
            </div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-white">Recent Inquiries</h2>
            <Link to="/admin/inquiries" className="text-sm text-yellow-400 hover:text-yellow-300">
              View all
            </Link>
          </div>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700 text-yellow-400 mb-4">
              <Calendar size={24} />
            </div>
            <h3 className="text-white font-medium mb-2">No Recent Inquiries</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
              There are no recent inquiries to display at this time. New inquiries will appear here when clients reach out.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;