import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Save, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Upload, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  ChevronLeft,
  Eye,
  PlusCircle,
  Image as ImageIcon,
  Film,
  Move,
  Settings,
  ArrowLeft,
  Star
} from 'lucide-react';
import FileUploader from '../../components/ui/FileUploader';
import MediaUploader from '../../components/ui/MediaUploader';

const AdminPortfolio = () => {
  const [loading, setLoading] = useState(true);
  const [galleries, setGalleries] = useState([]);
  const [currentView, setCurrentView] = useState('galleries'); // 'galleries', 'edit-gallery', 'gallery-items'
  const [currentGallery, setCurrentGallery] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('galleries')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      setGalleries(data || []);
    } catch (error) {
      console.error('Error fetching galleries:', error);
      showNotification('error', 'Failed to load galleries');
    } finally {
      setLoading(false);
    }
  };

  const fetchGalleryItems = async (galleryId) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('gallery_id', galleryId)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      setGalleryItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      showNotification('error', 'Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentGallery(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitGallery = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!currentGallery.title || !currentGallery.slug) {
      showNotification('error', 'Please fill out all required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      if (currentGallery.id) {
        // Update existing gallery
        const { error } = await supabase
          .from('galleries')
          .update({
            title: currentGallery.title,
            slug: currentGallery.slug,
            description: currentGallery.description,
            cover_image: currentGallery.cover_image,
            is_featured: currentGallery.is_featured,
            is_published: currentGallery.is_published,
            display_order: currentGallery.display_order || 0,
            meta_title: currentGallery.meta_title,
            meta_description: currentGallery.meta_description,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentGallery.id);
        
        if (error) throw error;
        showNotification('success', 'Gallery updated successfully');
      } else {
        // Create new gallery
        const { data, error } = await supabase
          .from('galleries')
          .insert({
            title: currentGallery.title,
            slug: currentGallery.slug,
            description: currentGallery.description,
            cover_image: currentGallery.cover_image,
            is_featured: currentGallery.is_featured,
            is_published: currentGallery.is_published === undefined ? true : currentGallery.is_published,
            display_order: galleries.length,
            meta_title: currentGallery.meta_title,
            meta_description: currentGallery.meta_description
          })
          .select();
        
        if (error) throw error;
        
        if (data && data[0]) {
          setCurrentGallery(data[0]);
          showNotification('success', 'Gallery created successfully');
          setCurrentView('gallery-items');
        }
      }
      
      fetchGalleries();
    } catch (error) {
      console.error('Error saving gallery:', error);
      showNotification('error', `Failed to save gallery: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGallery = async () => {
    if (!currentGallery || !currentGallery.id) return;
    
    try {
      setLoading(true);
      setShowDeleteConfirm(false);
      
      // Delete all gallery items first
      await supabase
        .from('gallery_items')
        .delete()
        .eq('gallery_id', currentGallery.id);
      
      // Then delete the gallery
      const { error } = await supabase
        .from('galleries')
        .delete()
        .eq('id', currentGallery.id);
      
      if (error) throw error;
      
      showNotification('success', 'Gallery deleted successfully');
      fetchGalleries();
      setCurrentView('galleries');
      setCurrentGallery(null);
    } catch (error) {
      console.error('Error deleting gallery:', error);
      showNotification('error', 'Failed to delete gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleEditGallery = (gallery) => {
    setCurrentGallery(gallery);
    setCurrentView('edit-gallery');
  };

  const handleViewGalleryItems = (gallery) => {
    setCurrentGallery(gallery);
    fetchGalleryItems(gallery.id);
    setCurrentView('gallery-items');
  };

  const handleNewGallery = () => {
    setCurrentGallery({
      title: '',
      slug: '',
      description: '',
      cover_image: '',
      is_featured: false,
      is_published: true,
      display_order: galleries.length,
      meta_title: '',
      meta_description: ''
    });
    setCurrentView('edit-gallery');
  };

  const handleFileUpload = async (url) => {
    if (currentView === 'edit-gallery') {
      setCurrentGallery(prev => ({ ...prev, cover_image: url }));
    }
  };

  const handleDeleteGalleryItem = async (itemId) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
      
      setGalleryItems(galleryItems.filter(item => item.id !== itemId));
      showNotification('success', 'Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      showNotification('error', 'Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const handleGalleryItemChange = async (itemId, data) => {
    try {
      const { error } = await supabase
        .from('gallery_items')
        .update(data)
        .eq('id', itemId);
      
      if (error) throw error;
      
      setGalleryItems(galleryItems.map(item => 
        item.id === itemId ? { ...item, ...data } : item
      ));
    } catch (error) {
      console.error('Error updating gallery item:', error);
      showNotification('error', 'Failed to update gallery item');
    }
  };

  const handleAddGalleryItem = async (url, mediaType) => {
    try {
      setLoading(true);
      
      // Determine media type and URLs
      let filePath = url;
      let thumbnailPath = url;
      let videoUrl = mediaType === 'video' ? url : null;
      
      // For videos from YouTube, extract a thumbnail
      if (mediaType === 'video' && (url.includes('youtube.com') || url.includes('youtu.be'))) {
        let videoId = '';
        
        // Extract video ID
        if (url.includes('youtube.com/watch?v=')) {
          videoId = new URL(url).searchParams.get('v');
        } else if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1].split('?')[0];
        }
        
        if (videoId) {
          thumbnailPath = `https://img.youtube.com/vi/${videoId}/0.jpg`;
          filePath = thumbnailPath;
        }
      }
      
      const { data, error } = await supabase
        .from('gallery_items')
        .insert({
          gallery_id: currentGallery.id,
          media_type: mediaType,
          file_path: filePath,
          thumbnail_path: thumbnailPath,
          video_url: videoUrl,
          display_order: galleryItems.length
        })
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        setGalleryItems([...galleryItems, data[0]]);
        showNotification('success', `${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} added successfully`);
      }
    } catch (error) {
      console.error('Error adding gallery item:', error);
      showNotification('error', 'Failed to add item to gallery');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = () => {
    if (!currentGallery?.title) return '';
    
    return currentGallery.title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-');
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  if (loading && currentView === 'galleries') {
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80">
          <div className="bg-slate-800 p-8 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-medium text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "{currentGallery.title}"? This action cannot be undone and will delete all media items in this gallery.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGallery}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete Gallery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery List View */}
      {currentView === 'galleries' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-serif text-white">Portfolio Galleries</h1>
            <button
              onClick={handleNewGallery}
              className="px-4 py-2 bg-yellow-400 text-slate-900 rounded hover:bg-yellow-500 transition-colors flex items-center"
            >
              <Plus size={18} className="mr-1" />
              New Gallery
            </button>
          </div>
          
          {galleries.length === 0 ? (
            <div className="bg-slate-800 rounded-lg p-10 text-center">
              <div className="text-5xl mb-4">🖼️</div>
              <h2 className="text-xl text-white mb-2">No Galleries Found</h2>
              <p className="text-gray-400 mb-6">
                Create your first gallery to showcase your portfolio.
              </p>
              <button
                onClick={handleNewGallery}
                className="px-6 py-3 bg-yellow-400 text-slate-900 rounded hover:bg-yellow-500 transition-colors"
              >
                <PlusCircle size={18} className="inline mr-2" />
                Create Gallery
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleries.map((gallery) => (
                <div 
                  key={gallery.id}
                  className="bg-slate-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-40">
                    {gallery.cover_image ? (
                      <img 
                        src={gallery.cover_image} 
                        alt={gallery.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                        <span className="text-gray-500">No Cover Image</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      {gallery.is_featured && (
                        <span className="px-2 py-1 bg-yellow-400/80 text-slate-900 text-xs rounded">
                          Featured
                        </span>
                      )}
                      {!gallery.is_published && (
                        <span className="px-2 py-1 bg-gray-800/80 text-gray-300 text-xs rounded">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h2 className="text-white text-lg font-medium mb-2 truncate">
                      {gallery.title}
                    </h2>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {gallery.description || 'No description'}
                    </p>
                    
                    <div className="flex justify-between">
                      <button
                        onClick={() => handleEditGallery(gallery)}
                        className="text-yellow-400 flex items-center text-sm hover:text-yellow-300"
                      >
                        <Settings size={16} className="mr-1" />
                        Settings
                      </button>
                      <button
                        onClick={() => handleViewGalleryItems(gallery)}
                        className="text-blue-400 flex items-center text-sm hover:text-blue-300"
                      >
                        <ImageIcon size={16} className="mr-1" />
                        Manage Media
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Gallery View */}
      {currentView === 'edit-gallery' && (
        <div>
          <div className="flex items-center mb-6">
            <button
              type="button"
              onClick={() => {
                setCurrentView('galleries');
                setCurrentGallery(null);
              }}
              className="mr-4 text-gray-400 hover:text-white"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-serif text-white">
              {currentGallery.id ? 'Edit Gallery' : 'Create New Gallery'}
            </h1>
          </div>

          <form onSubmit={handleSubmitGallery}>
            <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-medium text-white mb-6">Gallery Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-300 mb-2">Gallery Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={currentGallery.title || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="Gallery Title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">
                    Slug* 
                    <button
                      type="button"
                      onClick={() => setCurrentGallery({...currentGallery, slug: generateSlug()})}
                      className="ml-2 text-xs text-yellow-400 hover:text-yellow-300"
                    >
                      Generate from title
                    </button>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={currentGallery.slug || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="gallery-url-slug"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={currentGallery.description || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="Describe this gallery"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Display Order</label>
                  <input
                    type="number"
                    name="display_order"
                    value={currentGallery.display_order || 0}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    min="0"
                  />
                </div>
                
                <div className="flex items-center space-x-8">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_featured"
                      name="is_featured"
                      checked={currentGallery.is_featured || false}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor="is_featured" className="text-gray-300">
                      Feature on homepage
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_published"
                      name="is_published"
                      checked={currentGallery.is_published !== false}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor="is_published" className="text-gray-300">
                      Published
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-medium text-white mb-6">Cover Image</h2>
              
              <div className="mb-6">
                <FileUploader
                  value={currentGallery.cover_image || ''}
                  onChange={(url) => setCurrentGallery({...currentGallery, cover_image: url})}
                  onUploadComplete={handleFileUpload}
                  onUploadError={(error) => showNotification('error', error.message)}
                  folder="gallery_covers"
                  fileTypes={['image/*']}
                  maxSizeMB={5}
                  placeholder="Upload a cover image for your gallery"
                  showPreview={true}
                />
              </div>
            </div>
            
            <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-medium text-white mb-6">SEO Settings</h2>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Meta Title</label>
                  <input
                    type="text"
                    name="meta_title"
                    value={currentGallery.meta_title || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="SEO Title for browser tab and search results"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Recommended length: 50-60 characters. Current length: {(currentGallery.meta_title || '').length}
                  </p>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Meta Description</label>
                  <textarea
                    name="meta_description"
                    value={currentGallery.meta_description || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="Description that appears in search engine results"
                  ></textarea>
                  <p className="mt-1 text-sm text-gray-500">
                    Recommended length: 150-160 characters. Current length: {(currentGallery.meta_description || '').length}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-between">
              {currentGallery.id && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 size={18} className="inline mr-1" />
                  Delete Gallery
                </button>
              )}
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('galleries');
                    setCurrentGallery(null);
                  }}
                  className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-yellow-400 text-slate-900 rounded hover:bg-yellow-500 transition-colors flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw size={18} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Save Gallery
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Gallery Items View */}
      {currentView === 'gallery-items' && currentGallery && (
        <div>
          <div className="flex items-center mb-6">
            <button
              type="button"
              onClick={() => {
                setCurrentView('galleries');
                setCurrentGallery(null);
                setGalleryItems([]);
              }}
              className="mr-4 text-gray-400 hover:text-white"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-serif text-white">
                {currentGallery.title} - Media Items
              </h1>
              <p className="text-gray-400 text-sm">
                Manage images and videos in this gallery
              </p>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-medium text-white mb-4">Add New Media</h2>
            <MediaUploader 
              onUploadComplete={handleAddGalleryItem}
              folder={`galleries/${currentGallery.id}`}
              mediaTypes={['image', 'video']}
              buttonText="Select file to upload"
            />
          </div>

          {/* Gallery Items Grid */}
          <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-medium text-white mb-6">Gallery Media ({galleryItems.length})</h2>
            
            {galleryItems.length === 0 ? (
              <div className="text-center py-10">
                <Film size={48} className="mx-auto mb-4 text-gray-500" />
                <h3 className="text-lg text-white mb-2">No Media Items Yet</h3>
                <p className="text-gray-400 mb-4">
                  Upload images or add videos to populate this gallery.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {galleryItems.map((item) => (
                  <div key={item.id} className="bg-slate-700 rounded-md overflow-hidden">
                    <div className="relative h-40">
                      <img 
                        src={item.file_path} 
                        alt={item.title || "Gallery media"} 
                        className="w-full h-full object-cover"
                      />
                      {item.media_type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Film size={32} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => handleGalleryItemChange(item.id, { title: e.target.value })}
                        className="w-full px-2 py-1 mb-2 bg-slate-600 border border-slate-500 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400 text-white text-sm"
                        placeholder="Title"
                      />
                      <input
                        type="text"
                        value={item.alt_text || ''}
                        onChange={(e) => handleGalleryItemChange(item.id, { alt_text: e.target.value })}
                        className="w-full px-2 py-1 mb-2 bg-slate-600 border border-slate-500 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400 text-white text-sm"
                        placeholder="Alt text for accessibility"
                      />
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex space-x-1">
                          <button
                            type="button"
                            onClick={() => handleGalleryItemChange(item.id, { is_featured: !item.is_featured })}
                            className={`p-1 rounded ${item.is_featured ? 'bg-yellow-400 text-slate-900' : 'bg-slate-600 text-white'}`}
                            title={item.is_featured ? "Featured" : "Make featured"}
                          >
                            <Star size={16} />
                          </button>
                          <button
                            type="button"
                            className="p-1 rounded bg-slate-600 text-white"
                            title="Change display order"
                          >
                            <Move size={16} />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteGalleryItem(item.id)}
                          className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          title="Delete item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Back to Settings Button */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => handleEditGallery(currentGallery)}
              className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors flex items-center"
            >
              <Settings size={18} className="mr-2" />
              Gallery Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortfolio;