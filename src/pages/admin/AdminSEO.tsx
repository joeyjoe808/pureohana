import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, RefreshCw, AlertCircle, CheckCircle, Link } from 'lucide-react';

const AdminSEO = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [seoData, setSeoData] = useState({
    site_title: '',
    site_description: '',
    og_title: '',
    og_description: '',
    og_image: '',
    twitter_card: 'summary_large_image',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
    google_analytics_id: '',
    fb_pixel_id: '',
  });

  useEffect(() => {
    // In a real implementation, you would fetch actual SEO settings from your database
    // For now, we'll just simulate loading with the values from index.html
    setTimeout(() => {
      setSeoData({
        site_title: 'Pure Ohana Treasures - Luxury Wedding Photography & Cinematography',
        site_description: 'Luxury Hawaiian Wedding Photography & Cinematography',
        og_title: 'Pure Ohana Treasures - Luxury Wedding Photography & Cinematography',
        og_description: 'Exquisite photography and cinematic artistry for discerning couples across the Hawaiian islands. Specializing in sophisticated wedding celebrations and intimate luxury events.',
        og_image: 'https://www.pureohanatreasures.com/social-preview.jpg',
        twitter_card: 'summary_large_image',
        twitter_title: 'Pure Ohana Treasures - Luxury Wedding Photography & Cinematography',
        twitter_description: 'Exquisite photography and cinematic artistry for discerning couples across the Hawaiian islands. Specializing in sophisticated wedding celebrations and intimate luxury events.',
        twitter_image: 'https://www.pureohanatreasures.com/social-preview.jpg',
        google_analytics_id: '',
        fb_pixel_id: '',
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeoData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // In a real implementation, you would save these to your database
      // For now, we'll just simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showNotification('success', 'SEO settings saved successfully');
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      showNotification('error', 'Failed to save SEO settings');
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-md shadow-lg flex items-start ${
          notification.type === 'success' ? 'bg-green-500/20 border border-green-500/30 text-green-400' :
          notification.type === 'error' ? 'bg-red-500/20 border border-red-500/30 text-red-400' : 
          'bg-blue-500/20 border border-blue-500/30 text-blue-400'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle size={18} className="mr-3 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle size={18} className="mr-3 mt-0.5 flex-shrink-0" />
          )}
          <p>{notification.message}</p>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-serif text-white mb-2">SEO Settings</h1>
        <p className="text-gray-400">
          Manage your website's Search Engine Optimization (SEO) settings.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-medium text-white mb-6 flex items-center">
            <Link size={18} className="mr-2 text-yellow-400" />
            Basic SEO Settings
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Website Title</label>
              <input
                type="text"
                name="site_title"
                value={seoData.site_title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="Your website title"
              />
              <p className="mt-1 text-sm text-gray-500">
                This appears in browser tabs and search engine results.
              </p>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Website Description</label>
              <textarea
                name="site_description"
                value={seoData.site_description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="Brief description of your website"
              ></textarea>
              <p className="mt-1 text-sm text-gray-500">
                This appears in search engine results. Recommended length: 150-160 characters.
                Current length: {seoData.site_description.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-medium text-white mb-6">Open Graph (Social Media)</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">OG Title</label>
              <input
                type="text"
                name="og_title"
                value={seoData.og_title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="Title for social media shares"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">OG Description</label>
              <textarea
                name="og_description"
                value={seoData.og_description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="Description for social media shares"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">OG Image URL</label>
              <input
                type="text"
                name="og_image"
                value={seoData.og_image}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="https://example.com/image.jpg"
              />
              <p className="mt-1 text-sm text-gray-500">
                Recommended size: 1200×630 pixels
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-medium text-white mb-6">Twitter Card</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Card Type</label>
              <select
                name="twitter_card"
                value={seoData.twitter_card}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
              >
                <option value="summary">Summary</option>
                <option value="summary_large_image">Summary with Large Image</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Twitter Title</label>
              <input
                type="text"
                name="twitter_title"
                value={seoData.twitter_title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="Title for Twitter shares"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Twitter Description</label>
              <textarea
                name="twitter_description"
                value={seoData.twitter_description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="Description for Twitter shares"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Twitter Image URL</label>
              <input
                type="text"
                name="twitter_image"
                value={seoData.twitter_image}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-medium text-white mb-6">Analytics</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Google Analytics ID</label>
              <input
                type="text"
                name="google_analytics_id"
                value={seoData.google_analytics_id}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter your Google Analytics Measurement ID
              </p>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Facebook Pixel ID</label>
              <input
                type="text"
                name="fb_pixel_id"
                value={seoData.fb_pixel_id}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="XXXXXXXXXX"
              />
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-yellow-400 text-slate-900 rounded-sm hover:bg-yellow-500 transition-colors flex items-center font-medium disabled:opacity-70"
          >
            {saving ? (
              <>
                <RefreshCw size={18} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Save SEO Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSEO;