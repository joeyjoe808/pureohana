import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, RefreshCw, AlertCircle, CheckCircle, Upload, Play, Image as ImageIcon } from 'lucide-react';

const AdminHomepage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [content, setContent] = useState({
    id: null,
    banner_image: '',
    banner_video: '',
    headline: '',
    intro_text: '',
    cta_primary_text: '',
    cta_primary_link: '',
    cta_secondary_text: '',
    cta_secondary_link: '',
    behind_scenes_text: '',
    behind_scenes_link: ''
  });
  const [previewType, setPreviewType] = useState('image'); // 'image' or 'video'

  useEffect(() => {
    fetchHomepageContent();
  }, []);

  const fetchHomepageContent = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .order('id', { ascending: true })
        .limit(1)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setContent(data);
        setPreviewType(data.banner_video ? 'video' : 'image');
      }
    } catch (error) {
      console.error('Error fetching homepage content:', error);
      showNotification('error', 'Failed to load homepage content');
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
          .from('homepage_content')
          .update({
            banner_image: content.banner_image,
            banner_video: content.banner_video,
            headline: content.headline,
            intro_text: content.intro_text,
            cta_primary_text: content.cta_primary_text,
            cta_primary_link: content.cta_primary_link,
            cta_secondary_text: content.cta_secondary_text,
            cta_secondary_link: content.cta_secondary_link,
            behind_scenes_text: content.behind_scenes_text,
            behind_scenes_link: content.behind_scenes_link,
            updated_at: new Date().toISOString()
          })
          .eq('id', content.id);
        
        if (error) throw error;
        result = data;
      } else {
        // Insert new content if none exists
        const { data, error } = await supabase
          .from('homepage_content')
          .insert({
            banner_image: content.banner_image,
            banner_video: content.banner_video,
            headline: content.headline,
            intro_text: content.intro_text,
            cta_primary_text: content.cta_primary_text,
            cta_primary_link: content.cta_primary_link,
            cta_secondary_text: content.cta_secondary_text,
            cta_secondary_link: content.cta_secondary_link,
            behind_scenes_text: content.behind_scenes_text,
            behind_scenes_link: content.behind_scenes_link
          });
        
        if (error) throw error;
        result = data;
      }
      
      showNotification('success', 'Homepage content saved successfully');
      fetchHomepageContent(); // Refresh content
    } catch (error) {
      console.error('Error saving homepage content:', error);
      showNotification('error', 'Failed to save homepage content');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (event, fileType) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingBanner(true);
      
      // Define storage path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `homepage/${fileName}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('media')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
      
      if (fileType === 'image') {
        setContent(prev => ({ ...prev, banner_image: urlData.publicUrl, banner_video: '' }));
        setPreviewType('image');
      } else {
        setContent(prev => ({ ...prev, banner_video: urlData.publicUrl, banner_image: '' }));
        setPreviewType('video');
      }
      
      showNotification('success', `${fileType.charAt(0).toUpperCase() + fileType.slice(1)} uploaded successfully`);
    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error);
      showNotification('error', `Failed to upload ${fileType}`);
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
        <h1 className="text-2xl font-serif text-white mb-2">Homepage Content Management</h1>
        <p className="text-gray-400">
          Edit and manage the content displayed on your homepage.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-medium text-white mb-6">Hero Section</h2>
          
          {/* Banner Image/Video Upload */}
          <div className="mb-8">
            <label className="block text-gray-300 mb-2">Banner Media</label>
            
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                className={`px-4 py-2 rounded ${previewType === 'image' ? 'bg-yellow-400 text-slate-900' : 'bg-slate-700 text-white'}`}
                onClick={() => setPreviewType('image')}
              >
                <ImageIcon size={16} className="inline mr-2" />
                Image
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded ${previewType === 'video' ? 'bg-yellow-400 text-slate-900' : 'bg-slate-700 text-white'}`}
                onClick={() => setPreviewType('video')}
              >
                <Play size={16} className="inline mr-2" />
                Video
              </button>
            </div>
            
            {previewType === 'image' ? (
              <>
                <div className="mb-4">
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
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Upload New Banner Image</label>
                    <label className="flex items-center justify-center w-full h-12 px-4 bg-slate-700 border border-slate-600 rounded cursor-pointer hover:bg-slate-600 transition-colors">
                      <Upload size={18} className="mr-2 text-yellow-400" />
                      <span className="text-gray-300">Choose File</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'image')}
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
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Banner Video URL</label>
                  <input
                    type="text"
                    name="banner_video"
                    value={content.banner_video || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="https://example.com/video.mp4"
                  />
                  <p className="mt-1 text-sm text-gray-500">Enter a URL or upload a video below</p>
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Upload New Banner Video</label>
                    <label className="flex items-center justify-center w-full h-12 px-4 bg-slate-700 border border-slate-600 rounded cursor-pointer hover:bg-slate-600 transition-colors">
                      <Upload size={18} className="mr-2 text-yellow-400" />
                      <span className="text-gray-300">Choose File</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e, 'video')}
                        disabled={uploadingBanner}
                      />
                    </label>
                  </div>
                </div>
                
                {content.banner_video && (
                  <div className="mt-4">
                    <p className="text-gray-300 mb-2">Current Banner Video:</p>
                    <div className="relative h-48 bg-slate-700 rounded overflow-hidden">
                      <video
                        src={content.banner_video}
                        className="w-full h-full object-cover"
                        controls
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Headline & Intro Text */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <label className="block text-gray-300 mb-2">Main Headline</label>
              <input
                type="text"
                name="headline"
                value={content.headline || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="Enter main headline text"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Introductory Text</label>
              <textarea
                name="intro_text"
                value={content.intro_text || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="Enter introductory paragraph text"
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Call to Action Buttons */}
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-medium text-white mb-6">Call to Action Buttons</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-300 mb-2">Primary CTA Text</label>
              <input
                type="text"
                name="cta_primary_text"
                value={content.cta_primary_text || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="e.g., OUR EXPERIENCES"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Primary CTA Link</label>
              <input
                type="text"
                name="cta_primary_link"
                value={content.cta_primary_link || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="e.g., /services"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Secondary CTA Text</label>
              <input
                type="text"
                name="cta_secondary_text"
                value={content.cta_secondary_text || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="e.g., VIEW OUR WORK"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Secondary CTA Link</label>
              <input
                type="text"
                name="cta_secondary_link"
                value={content.cta_secondary_link || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="e.g., /portfolio"
              />
            </div>
          </div>
        </div>
        
        {/* Behind the Scenes Section */}
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-medium text-white mb-6">Behind the Scenes Section</h2>
          
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <label className="block text-gray-300 mb-2">Behind the Scenes Text</label>
              <textarea
                name="behind_scenes_text"
                value={content.behind_scenes_text || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="Enter text describing behind the scenes content"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Behind the Scenes Link</label>
              <input
                type="text"
                name="behind_scenes_link"
                value={content.behind_scenes_link || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="e.g., /about"
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
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminHomepage;