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
  Trash, 
  X,
  ChevronLeft,
  Eye,
  List,
  PlusCircle
} from 'lucide-react';

const AdminServices = () => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('service_pages')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      showNotification('error', 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentService(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!currentService.title || !currentService.slug || !currentService.headline || !currentService.description) {
      showNotification('error', 'Please fill out all required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      // Ensure features is an array
      if (typeof currentService.features === 'string') {
        try {
          currentService.features = JSON.parse(currentService.features);
        } catch (e) {
          currentService.features = [];
        }
      }
      
      if (currentService.id) {
        // Update existing service
        const { error } = await supabase
          .from('service_pages')
          .update({
            title: currentService.title,
            slug: currentService.slug,
            headline: currentService.headline,
            description: currentService.description,
            banner_image: currentService.banner_image,
            content: currentService.content,
            features: currentService.features,
            cta_text: currentService.cta_text,
            cta_link: currentService.cta_link,
            meta_title: currentService.meta_title,
            meta_description: currentService.meta_description,
            is_published: currentService.is_published,
            display_order: currentService.display_order || 0,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentService.id);
        
        if (error) throw error;
        showNotification('success', 'Service updated successfully');
      } else {
        // Create new service
        const { error } = await supabase
          .from('service_pages')
          .insert({
            title: currentService.title,
            slug: currentService.slug,
            headline: currentService.headline,
            description: currentService.description,
            banner_image: currentService.banner_image,
            content: currentService.content,
            features: currentService.features,
            cta_text: currentService.cta_text,
            cta_link: currentService.cta_link,
            meta_title: currentService.meta_title,
            meta_description: currentService.meta_description,
            is_published: currentService.is_published === undefined ? true : currentService.is_published,
            display_order: services.length
          });
        
        if (error) throw error;
        showNotification('success', 'Service created successfully');
      }
      
      fetchServices();
      setIsEditing(false);
      setCurrentService(null);
    } catch (error) {
      console.error('Error saving service:', error);
      showNotification('error', `Failed to save service: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    // Parse features if it's a string
    if (typeof service.features === 'string') {
      try {
        service.features = JSON.parse(service.features);
      } catch (e) {
        service.features = [];
      }
    }
    
    setCurrentService(service);
    setIsEditing(true);
  };

  const handleNew = () => {
    setCurrentService({
      title: '',
      slug: '',
      headline: '',
      description: '',
      banner_image: '',
      content: '',
      features: [],
      cta_text: 'LEARN MORE',
      cta_link: '/contact',
      meta_title: '',
      meta_description: '',
      is_published: true,
      display_order: services.length
    });
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (!currentService || !currentService.id) return;
    
    try {
      setLoading(true);
      setShowDeleteConfirm(false);
      
      const { error } = await supabase
        .from('service_pages')
        .delete()
        .eq('id', currentService.id);
      
      if (error) throw error;
      
      showNotification('success', 'Service deleted successfully');
      fetchServices();
      setIsEditing(false);
      setCurrentService(null);
    } catch (error) {
      console.error('Error deleting service:', error);
      showNotification('error', 'Failed to delete service');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      
      // Define storage path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `services/${fileName}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('media')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
      
      setCurrentService(prev => ({ ...prev, banner_image: urlData.publicUrl }));
      
      showNotification('success', 'Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      showNotification('error', 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    
    const newFeatures = [...(currentService.features || []), featureInput];
    setCurrentService({ ...currentService, features: newFeatures });
    setFeatureInput('');
  };

  const removeFeature = (index) => {
    const newFeatures = [...currentService.features];
    newFeatures.splice(index, 1);
    setCurrentService({ ...currentService, features: newFeatures });
  };

  const generateSlug = () => {
    if (!currentService?.title) return '';
    
    return currentService.title
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

  if (loading && !isEditing) {
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
              Are you sure you want to delete "{currentService.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditing ? (
        <div>
          <div className="flex items-center mb-6">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setCurrentService(null);
              }}
              className="mr-4 text-gray-400 hover:text-white"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-serif text-white">
              {currentService.id ? 'Edit Service' : 'Create New Service'}
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-medium text-white mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-300 mb-2">Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={currentService.title || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="Service Title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">
                    Slug* 
                    <button
                      type="button"
                      onClick={() => setCurrentService({...currentService, slug: generateSlug()})}
                      className="ml-2 text-xs text-yellow-400 hover:text-yellow-300"
                    >
                      Generate from title
                    </button>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={currentService.slug || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="service-url-slug"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-300 mb-2">Headline (H1)*</label>
                  <input
                    type="text"
                    name="headline"
                    value={currentService.headline || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="Main Headline (H1)"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Display Order</label>
                  <input
                    type="number"
                    name="display_order"
                    value={currentService.display_order || 0}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Short Description*</label>
                <textarea
                  name="description"
                  value={currentService.description || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                  placeholder="Brief description of the service"
                  required
                ></textarea>
              </div>

              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="is_published"
                  name="is_published"
                  checked={currentService.is_published}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="is_published" className="text-gray-300">
                  Publish this service (make it visible to website visitors)
                </label>
              </div>
            </div>
            
            <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-medium text-white mb-6">Banner Image</h2>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Banner Image URL</label>
                <input
                  type="text"
                  name="banner_image"
                  value={currentService.banner_image || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-1 text-sm text-gray-500">Enter a URL or upload an image below</p>
                
                <div className="flex items-center space-x-4 mt-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Upload New Image</label>
                    <label className="flex items-center justify-center w-full h-12 px-4 bg-slate-700 border border-slate-600 rounded cursor-pointer hover:bg-slate-600 transition-colors">
                      <Upload size={18} className="mr-2 text-yellow-400" />
                      <span className="text-gray-300">Choose File</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                </div>
                
                {currentService.banner_image && (
                  <div className="mt-4 relative">
                    <p className="text-gray-300 mb-2">Current Banner Image:</p>
                    <div className="relative h-48 bg-slate-700 rounded overflow-hidden">
                      <img
                        src={currentService.banner_image}
                        alt="Current banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-medium text-white mb-6">Detailed Content</h2>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Main Content</label>
                <textarea
                  name="content"
                  value={currentService.content || ''}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                  placeholder="Detailed description of the service..."
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Features/Highlights</label>
                
                <div className="flex items-end space-x-2 mb-4">
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                      placeholder="Add a feature or highlight"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-yellow-400 text-slate-900 rounded hover:bg-yellow-500 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                
                {currentService.features && currentService.features.length > 0 ? (
                  <ul className="space-y-2 bg-slate-700/50 rounded-md p-4">
                    {currentService.features.map((feature, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <div className="flex items-start">
                          <span className="text-yellow-400 mr-2">•</span>
                          <span className="text-white">{feature}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic text-center py-4">No features added yet</p>
                )}
              </div>
            </div>
            
            <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-medium text-white mb-6">Call to Action</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">CTA Text</label>
                  <input
                    type="text"
                    name="cta_text"
                    value={currentService.cta_text || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="e.g., BOOK A SESSION"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">CTA Link</label>
                  <input
                    type="text"
                    name="cta_link"
                    value={currentService.cta_link || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="e.g., /contact"
                  />
                </div>
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
                    value={currentService.meta_title || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="SEO Title for browser tab and search results"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Recommended length: 50-60 characters. Current length: {(currentService.meta_title || '').length}
                  </p>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Meta Description</label>
                  <textarea
                    name="meta_description"
                    value={currentService.meta_description || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="Description that appears in search engine results"
                  ></textarea>
                  <p className="mt-1 text-sm text-gray-500">
                    Recommended length: 150-160 characters. Current length: {(currentService.meta_description || '').length}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-between">
              {currentService.id && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                >
                  <Trash size={18} className="inline mr-1" />
                  Delete Service
                </button>
              )}
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentService(null);
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
                      Save Service
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-serif text-white">Service Pages</h1>
            <button
              onClick={handleNew}
              className="px-4 py-2 bg-yellow-400 text-slate-900 rounded hover:bg-yellow-500 transition-colors flex items-center"
            >
              <Plus size={18} className="mr-1" />
              Add New Service
            </button>
          </div>
          
          {services.length === 0 ? (
            <div className="bg-slate-800 rounded-lg p-10 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-xl text-white mb-2">No Service Pages Found</h2>
              <p className="text-gray-400 mb-6">
                Get started by creating your first service page to showcase your offerings.
              </p>
              <button
                onClick={handleNew}
                className="px-6 py-3 bg-yellow-400 text-slate-900 rounded hover:bg-yellow-500 transition-colors"
              >
                <PlusCircle size={18} className="inline mr-2" />
                Create Service Page
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div 
                  key={service.id}
                  className="bg-slate-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-40">
                    {service.banner_image ? (
                      <img 
                        src={service.banner_image} 
                        alt={service.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      {!service.is_published && (
                        <span className="px-2 py-1 bg-gray-800/80 text-gray-300 text-xs rounded">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h2 className="text-white text-lg font-medium mb-2 truncate">
                      {service.title}
                    </h2>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    
                    <div className="text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <List size={14} className="mr-1" />
                        <span>{Array.isArray(service.features) ? service.features.length : 0} Features</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        onClick={() => window.open(`/services/${service.slug}`, '_blank')}
                        className="text-blue-400 flex items-center text-sm hover:text-blue-300"
                      >
                        <Eye size={16} className="mr-1" />
                        Preview
                      </button>
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-yellow-400 flex items-center text-sm hover:text-yellow-300"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminServices;