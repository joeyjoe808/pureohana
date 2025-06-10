import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, RefreshCw, AlertCircle, CheckCircle, Upload, Image as ImageIcon } from 'lucide-react';

const AdminAbout = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [content, setContent] = useState({
    id: null,
    banner_image: '',
    headline: '',
    main_narrative: '',
    mission_statement: '',
    vision_statement: '',
    team_intro: '',
    updated_at: null
  });

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .order('id', { ascending: true })
        .limit(1)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setContent(data);
      }
    } catch (error) {
      console.error('Error fetching about page content:', error);
      showNotification('error', 'Failed to load about page content');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      let result;
      
      if (content.id) {
        // Update existing content
        const { data, error } = await supabase
          .from('about_content')
          .update({
            banner_image: content.banner_image,
            headline: content.headline,
            main_narrative: content.main_narrative,
            mission_statement: content.mission_statement,
            vision_statement: content.vision_statement,
            team_intro: content.team_intro,
            updated_at: new Date().toISOString()
          })
          .eq('id', content.id);
        
        if (error) throw error;
        result = data;
      } else {
        // Insert new content if none exists
        const { data, error } = await supabase
          .from('about_content')
          .insert({
            banner_image: content.banner_image,
            headline: content.headline,
            main_narrative: content.main_narrative,
            mission_statement: content.mission_statement,
            vision_statement: content.vision_statement,
            team_intro: content.team_intro
          });
        
        if (error) throw error;
        result = data;
      }
      
      showNotification('success', 'About page content saved successfully');
      fetchAboutContent(); // Refresh content
    } catch (error) {
      console.error('Error saving about page content:', error);
      showNotification('error', 'Failed to save about page content');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingBanner(true);
      
      // Define storage path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `about/${fileName}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('media')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
      
      setContent(prev => ({ ...prev, banner_image: urlData.publicUrl }));
      
      showNotification('success', 'Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      showNotification('error', 'Failed to upload image');
    } finally {
      setUploadingBanner(false);
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
        <h1 className="text-2xl font-serif text-white mb-2">About Page Content Management</h1>
        <p className="text-gray-400">
          Edit and manage the content displayed on the About Us page.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-medium text-white mb-6">Banner Section</h2>
          
          {/* Banner Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Banner Image URL</label>
            <input
              type="text"
              name="banner_image"
              value={content.banner_image || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
              placeholder="https://example.com/image.jpg"
            />
            <p className="mt-1 text-sm text-gray-500">Enter a URL or upload an image below</p>
            
            <div className="flex items-center space-x-4 mt-4">
              <div>
                <label className="block text-gray-300 mb-2">Upload New Banner Image</label>
                <label className="flex items-center justify-center w-full h-12 px-4 bg-slate-700 border border-slate-600 rounded cursor-pointer hover:bg-slate-600 transition-colors">
                  <Upload size={18} className="mr-2 text-yellow-400" />
                  <span className="text-gray-300">Choose File</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploadingBanner}
                  />
                </label>
              </div>
            </div>
            
            {content.banner_image && (
              <div className="mt-4 relative">
                <p className="text-gray-300 mb-2">Current Banner Image:</p>
                <div className="relative h-48 bg-slate-700 rounded overflow-hidden">
                  <img
                    src={content.banner_image}
                    alt="Current banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Headline */}
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Page Headline</label>
            <input
              type="text"
              name="headline"
              value={content.headline || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
              placeholder="e.g., WE ARE STORYTELLERS & VISUAL ARTISTS"
              required
            />
          </div>
        </div>
        
        {/* Main Narrative */}
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-medium text-white mb-6">Main Content</h2>
          
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Main Narrative</label>
            <textarea
              name="main_narrative"
              value={content.main_narrative || ''}
              onChange={handleChange}
              rows={8}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
              placeholder="Enter the main narrative about Pure Ohana Treasures..."
              required
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Team Introduction</label>
            <textarea
              name="team_intro"
              value={content.team_intro || ''}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
              placeholder="Enter text introducing the team..."
            ></textarea>
          </div>
        </div>
        
        {/* Mission & Vision */}
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-medium text-white mb-6">Mission & Vision</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">Mission Statement</label>
              <textarea
                name="mission_statement"
                value={content.mission_statement || ''}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="Enter your mission statement..."
              ></textarea>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Vision Statement</label>
              <textarea
                name="vision_statement"
                value={content.vision_statement || ''}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="Enter your vision statement..."
              ></textarea>
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
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAbout;