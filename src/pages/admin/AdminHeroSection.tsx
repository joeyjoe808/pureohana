import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Save, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Play,
  Image as ImageIcon,
  X,
  ArrowDown,
  ArrowUp,
  Copy,
  Eye
} from 'lucide-react';
import FileUploader from '../../components/ui/FileUploader';
import MediaUploader from '../../components/ui/MediaUploader';

const AdminHeroSection = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slides, setSlides] = useState([]);
  const [settings, setSettings] = useState({
    autoplay: true,
    loop: true,
    pause_on_hover: true,
    show_indicators: true,
    show_controls: true,
    default_transition_type: 'fade',
    default_display_duration: 6000,
    default_transition_duration: 1500
  });
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [editingSlideIndex, setEditingSlideIndex] = useState(-1);

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    try {
      setLoading(true);
      
      // Fetch slides
      const { data: slidesData, error: slidesError } = await supabase
        .from('hero_slides')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (slidesError) throw slidesError;
      
      // Fetch settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('hero_settings')
        .select('*')
        .limit(1);
      
      if (settingsError) throw settingsError;
      
      // Set data
      setSlides(slidesData || []);
      
      if (settingsData && settingsData.length > 0) {
        setSettings(settingsData[0]);
      }
    } catch (error) {
      console.error('Error fetching hero content:', error);
      showNotification('error', 'Failed to load hero content');
    } finally {
      setLoading(false);
    }
  };

  const handleSlideChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentSlide(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseInt(value, 10) : value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      
      // Update or insert settings
      const { error } = await supabase
        .from('hero_settings')
        .upsert({
          id: settings.id || 1,
          autoplay: settings.autoplay,
          loop: settings.loop,
          pause_on_hover: settings.pause_on_hover,
          show_indicators: settings.show_indicators,
          show_controls: settings.show_controls,
          default_transition_type: settings.default_transition_type,
          default_display_duration: settings.default_display_duration,
          default_transition_duration: settings.default_transition_duration
        });
      
      if (error) throw error;
      
      showNotification('success', 'Hero settings saved successfully');
      fetchHeroContent();
      setIsEditingSettings(false);
    } catch (error) {
      console.error('Error saving hero settings:', error);
      showNotification('error', 'Failed to save hero settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSlide = async () => {
    try {
      setSaving(true);
      
      // Validate required fields
      if (!currentSlide.title || (!currentSlide.image_url && !currentSlide.video_url)) {
        showNotification('error', 'Please provide a title and either an image or video URL');
        return;
      }
      
      if (currentSlide.id) {
        // Update existing slide
        const { error } = await supabase
          .from('hero_slides')
          .update({
            image_url: currentSlide.image_url,
            video_url: currentSlide.video_url,
            subtitle: currentSlide.subtitle,
            title: currentSlide.title,
            description: currentSlide.description,
            subtitle_color: currentSlide.subtitle_color,
            title_color: currentSlide.title_color,
            description_color: currentSlide.description_color,
            subtitle_size: currentSlide.subtitle_size,
            title_size: currentSlide.title_size,
            description_size: currentSlide.description_size,
            overlay_color: currentSlide.overlay_color,
            overlay_opacity: currentSlide.overlay_opacity,
            display_duration: currentSlide.display_duration,
            transition_duration: currentSlide.transition_duration,
            entrance_animation: currentSlide.entrance_animation,
            primary_btn_text: currentSlide.primary_btn_text,
            primary_btn_link: currentSlide.primary_btn_link,
            secondary_btn_text: currentSlide.secondary_btn_text,
            secondary_btn_link: currentSlide.secondary_btn_link,
            display_order: currentSlide.display_order,
            is_active: currentSlide.is_active
          })
          .eq('id', currentSlide.id);
        
        if (error) throw error;
        
        // Update local state
        const updatedSlides = [...slides];
        updatedSlides[editingSlideIndex] = currentSlide;
        setSlides(updatedSlides);
        
        showNotification('success', 'Slide updated successfully');
      } else {
        // Create new slide
        const { data, error } = await supabase
          .from('hero_slides')
          .insert({
            image_url: currentSlide.image_url,
            video_url: currentSlide.video_url,
            subtitle: currentSlide.subtitle,
            title: currentSlide.title,
            description: currentSlide.description,
            subtitle_color: currentSlide.subtitle_color || '#FACC15',
            title_color: currentSlide.title_color || '#FFFFFF',
            description_color: currentSlide.description_color || '#E5E7EB',
            subtitle_size: currentSlide.subtitle_size || 'text-sm',
            title_size: currentSlide.title_size || 'heading-xl',
            description_size: currentSlide.description_size || 'text-lg',
            overlay_color: currentSlide.overlay_color || 'from-slate-900/90 to-slate-900/40',
            overlay_opacity: currentSlide.overlay_opacity || 70,
            display_duration: currentSlide.display_duration || settings.default_display_duration,
            transition_duration: currentSlide.transition_duration || settings.default_transition_duration,
            entrance_animation: currentSlide.entrance_animation || settings.default_transition_type,
            primary_btn_text: currentSlide.primary_btn_text,
            primary_btn_link: currentSlide.primary_btn_link,
            secondary_btn_text: currentSlide.secondary_btn_text,
            secondary_btn_link: currentSlide.secondary_btn_link,
            display_order: slides.length,
            is_active: currentSlide.is_active !== undefined ? currentSlide.is_active : true
          })
          .select();
        
        if (error) throw error;
        
        // Add to local state
        if (data && data[0]) {
          setSlides([...slides, data[0]]);
        }
        
        showNotification('success', 'Slide created successfully');
      }
      
      setIsEditing(false);
      setCurrentSlide(null);
    } catch (error) {
      console.error('Error saving slide:', error);
      showNotification('error', 'Failed to save slide');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlide = async (slideId, index) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', slideId);
      
      if (error) throw error;
      
      // Remove from local state
      const newSlides = [...slides];
      newSlides.splice(index, 1);
      
      // Update display order for remaining slides
      const updatedSlides = newSlides.map((slide, idx) => ({
        ...slide,
        display_order: idx
      }));
      
      setSlides(updatedSlides);
      
      // Update display_order in database
      for (const slide of updatedSlides) {
        await supabase
          .from('hero_slides')
          .update({ display_order: slide.display_order })
          .eq('id', slide.id);
      }
      
      showNotification('success', 'Slide deleted successfully');
    } catch (error) {
      console.error('Error deleting slide:', error);
      showNotification('error', 'Failed to delete slide');
    } finally {
      setLoading(false);
    }
  };

  const handleMoveSlide = async (index, direction) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === slides.length - 1)
    ) {
      return;
    }
    
    try {
      setLoading(true);
      
      const newSlides = [...slides];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      // Swap slides
      [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
      
      // Update display_order
      newSlides[index].display_order = index;
      newSlides[targetIndex].display_order = targetIndex;
      
      setSlides(newSlides);
      
      // Update in database
      await supabase
        .from('hero_slides')
        .update({ display_order: newSlides[index].display_order })
        .eq('id', newSlides[index].id);
      
      await supabase
        .from('hero_slides')
        .update({ display_order: newSlides[targetIndex].display_order })
        .eq('id', newSlides[targetIndex].id);
      
      showNotification('success', 'Slide order updated');
    } catch (error) {
      console.error('Error moving slide:', error);
      showNotification('error', 'Failed to update slide order');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSlide = (slide, index) => {
    setCurrentSlide(slide);
    setEditingSlideIndex(index);
    setIsEditing(true);
  };

  const handleNewSlide = () => {
    setCurrentSlide({
      image_url: '',
      video_url: '',
      subtitle: '',
      title: '',
      description: '',
      subtitle_color: '#FACC15',
      title_color: '#FFFFFF',
      description_color: '#E5E7EB',
      subtitle_size: 'text-sm',
      title_size: 'heading-xl',
      description_size: 'text-lg',
      overlay_color: 'from-slate-900/90 to-slate-900/40',
      overlay_opacity: 70,
      display_duration: settings.default_display_duration,
      transition_duration: settings.default_transition_duration,
      entrance_animation: settings.default_transition_type,
      primary_btn_text: '',
      primary_btn_link: '',
      secondary_btn_text: '',
      secondary_btn_link: '',
      is_active: true
    });
    setEditingSlideIndex(-1);
    setIsEditing(true);
  };

  const handleToggleActive = async (slideId, currentStatus) => {
    try {
      setLoading(true);
      
      const newStatus = !currentStatus;
      
      const { error } = await supabase
        .from('hero_slides')
        .update({ is_active: newStatus })
        .eq('id', slideId);
      
      if (error) throw error;
      
      // Update local state
      setSlides(slides.map(slide => 
        slide.id === slideId ? { ...slide, is_active: newStatus } : slide
      ));
      
      showNotification('success', `Slide ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling slide status:', error);
      showNotification('error', 'Failed to update slide status');
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUpload = (url, mediaType) => {
    if (mediaType === 'image') {
      setCurrentSlide(prev => ({ ...prev, image_url: url, video_url: '' }));
    } else {
      setCurrentSlide(prev => ({ ...prev, video_url: url, image_url: '' }));
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  if (loading && slides.length === 0 && !isEditing) {
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

      {/* Edit Slide View */}
      {isEditing ? (
        <div>
          <div className="flex items-center mb-6">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setCurrentSlide(null);
              }}
              className="mr-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <h1 className="text-2xl font-serif text-white">
              {currentSlide.id ? 'Edit Slide' : 'Create New Slide'}
            </h1>
          </div>

          <div className="space-y-8">
            {/* Media Upload Section */}
            <div className="bg-slate-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-medium text-white mb-6">Slide Media</h2>
              
              <MediaUploader 
                onUploadComplete={handleMediaUpload}
                folder="hero_slides"
                mediaTypes={['image', 'video']}
                initialMediaType={currentSlide.video_url ? 'video' : 'image'}
                buttonText="Upload Media"
              />
              
              {currentSlide.image_url && (
                <div className="mt-4">
                  <div className="bg-slate-700 rounded-lg overflow-hidden">
                    <img 
                      src={currentSlide.image_url} 
                      alt="Slide preview" 
                      className="w-full h-48 object-cover" 
                    />
                  </div>
                </div>
              )}
              
              {currentSlide.video_url && (
                <div className="mt-4">
                  <div className="bg-slate-700 rounded-lg overflow-hidden">
                    <div className="aspect-video relative">
                      {/* Handle YouTube embeds */}
                      {currentSlide.video_url.includes('youtube.com') || currentSlide.video_url.includes('youtu.be') ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-gray-400">
                            <Play size={48} className="mx-auto mb-2" />
                            <p className="text-center">YouTube Video</p>
                          </div>
                        </div>
                      ) : (
                        <video 
                          src={currentSlide.video_url} 
                          className="w-full h-full" 
                          controls 
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Content Section */}
            <div className="bg-slate-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-medium text-white mb-6">Slide Content</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2">Subtitle (small text above title)</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={currentSlide.subtitle || ''}
                    onChange={handleSlideChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="e.g., EXTRAORDINARY MOMENTS"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Title (main heading)*</label>
                  <input
                    type="text"
                    name="title"
                    value={currentSlide.title || ''}
                    onChange={handleSlideChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="e.g., CAPTURING THE AUTHENTIC SPIRIT OF YOUR OHANA"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={currentSlide.description || ''}
                    onChange={handleSlideChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="e.g., Beautiful family photography and films that preserve your most precious Hawaiian memories for generations to come."
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Call to Action Buttons */}
            <div className="bg-slate-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-medium text-white mb-6">Call to Action Buttons</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-300 mb-2">Primary Button Text</label>
                  <input
                    type="text"
                    name="primary_btn_text"
                    value={currentSlide.primary_btn_text || ''}
                    onChange={handleSlideChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="e.g., OUR EXPERIENCES"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Primary Button Link</label>
                  <input
                    type="text"
                    name="primary_btn_link"
                    value={currentSlide.primary_btn_link || ''}
                    onChange={handleSlideChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="e.g., /services or #services-section"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Secondary Button Text</label>
                  <input
                    type="text"
                    name="secondary_btn_text"
                    value={currentSlide.secondary_btn_text || ''}
                    onChange={handleSlideChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="e.g., VIEW OUR WORK"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Secondary Button Link</label>
                  <input
                    type="text"
                    name="secondary_btn_link"
                    value={currentSlide.secondary_btn_link || ''}
                    onChange={handleSlideChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="e.g., /portfolio or #portfolio-section"
                  />
                </div>
              </div>
            </div>
            
            {/* Style Settings */}
            <div className="bg-slate-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-medium text-white mb-6">Style Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Colors */}
                <div>
                  <label className="block text-gray-300 mb-2">Subtitle Color</label>
                  <div className="flex">
                    <input
                      type="color"
                      name="subtitle_color"
                      value={currentSlide.subtitle_color || '#FACC15'}
                      onChange={handleSlideChange}
                      className="w-10 h-10 rounded overflow-hidden"
                    />
                    <input
                      type="text"
                      name="subtitle_color"
                      value={currentSlide.subtitle_color || '#FACC15'}
                      onChange={handleSlideChange}
                      className="flex-1 ml-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                      placeholder="#FACC15"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Title Color</label>
                  <div className="flex">
                    <input
                      type="color"
                      name="title_color"
                      value={currentSlide.title_color || '#FFFFFF'}
                      onChange={handleSlideChange}
                      className="w-10 h-10 rounded overflow-hidden"
                    />
                    <input
                      type="text"
                      name="title_color"
                      value={currentSlide.title_color || '#FFFFFF'}
                      onChange={handleSlideChange}
                      className="flex-1 ml-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Description Color</label>
                  <div className="flex">
                    <input
                      type="color"
                      name="description_color"
                      value={currentSlide.description_color || '#E5E7EB'}
                      onChange={handleSlideChange}
                      className="w-10 h-10 rounded overflow-hidden"
                    />
                    <input
                      type="text"
                      name="description_color"
                      value={currentSlide.description_color || '#E5E7EB'}
                      onChange={handleSlideChange}
                      className="flex-1 ml-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                      placeholder="#E5E7EB"
                    />
                  </div>
                </div>
                
                {/* Text Sizes */}
                <div>
                  <label className="block text-gray-300 mb-2">Subtitle Size</label>
                  <select
                    name="subtitle_size"
                    value={currentSlide.subtitle_size || 'text-sm'}
                    onChange={handleSlideChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                  >
                    <option value="text-xs">Extra Small</option>
                    <option value="text-sm">Small</option>
                    <option value="text-base">Medium</option>
                    <option value="text-lg">Large</option>
                    <option value="text-xl">Extra Large</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Title Size</label>
                  <select
                    name="title_size"
                    value={currentSlide.title_size || 'heading-xl'}
                    onChange={handleSlideChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                  >
                    <option value="heading-sm">Small</option>
                    <option value="heading-md">Medium</option>
                    <option value="heading-lg">Large</option>
                    <option value="heading-xl">Extra Large</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Description Size</label>
                  <select
                    name="description_size"
                    value={currentSlide.description_size || 'text-lg'}
                    onChange={handleSlideChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                  >
                    <option value="text-sm">Small</option>
                    <option value="text-base">Medium</option>
                    <option value="text-lg">Large</option>
                    <option value="text-xl">Extra Large</option>
                  </select>
                </div>
                
                {/* Overlay */}
                <div>
                  <label className="block text-gray-300 mb-2">Overlay Gradient</label>
                  <select
                    name="overlay_color"
                    value={currentSlide.overlay_color || 'from-slate-900/90 to-slate-900/40'}
                    onChange={handleSlideChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                  >
                    <option value="from-slate-900/90 to-slate-900/40">Dark (Default)</option>
                    <option value="from-slate-900/70 to-transparent">Medium Dark</option>
                    <option value="from-slate-900/50 to-transparent">Light Dark</option>
                    <option value="from-yellow-900/50 to-yellow-900/20">Gold Accent</option>
                    <option value="from-blue-900/70 to-slate-900/40">Blue Accent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Overlay Opacity (%)</label>
                  <input
                    type="range"
                    name="overlay_opacity"
                    min="0"
                    max="100"
                    value={currentSlide.overlay_opacity || 70}
                    onChange={handleSlideChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Transparent</span>
                    <span>{currentSlide.overlay_opacity || 70}%</span>
                    <span>Solid</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Entrance Animation</label>
                  <select
                    name="entrance_animation"
                    value={currentSlide.entrance_animation || 'fade'}
                    onChange={handleSlideChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                  >
                    <option value="fade">Fade</option>
                    <option value="slide-up">Slide Up</option>
                    <option value="slide-down">Slide Down</option>
                    <option value="slide-left">Slide Left</option>
                    <option value="slide-right">Slide Right</option>
                    <option value="zoom-in">Zoom In</option>
                    <option value="zoom-out">Zoom Out</option>
                  </select>
                </div>
                
                {/* Timing */}
                <div>
                  <label className="block text-gray-300 mb-2">Display Duration (ms)</label>
                  <input
                    type="number"
                    name="display_duration"
                    value={currentSlide.display_duration || settings.default_display_duration}
                    onChange={handleSlideChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="6000"
                    min="1000"
                    step="500"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    How long the slide stays visible (in milliseconds)
                  </p>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Transition Duration (ms)</label>
                  <input
                    type="number"
                    name="transition_duration"
                    value={currentSlide.transition_duration || settings.default_transition_duration}
                    onChange={handleSlideChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    placeholder="1500"
                    min="500"
                    step="100"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    How long the transition between slides takes
                  </p>
                </div>
              </div>
            </div>
            
            {/* Status */}
            <div className="bg-slate-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={currentSlide.is_active !== false}
                  onChange={handleSlideChange}
                  className="h-5 w-5 text-yellow-400 rounded focus:ring-yellow-400"
                />
                <label htmlFor="is_active" className="ml-2 text-gray-300">
                  Active (show this slide in the slideshow)
                </label>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentSlide(null);
                }}
                className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSlide}
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
                    Save Slide
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : isEditingSettings ? (
        <div>
          <div className="flex items-center mb-6">
            <button
              type="button"
              onClick={() => setIsEditingSettings(false)}
              className="mr-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <h1 className="text-2xl font-serif text-white">
              Hero Slideshow Settings
            </h1>
          </div>
          
          <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-medium text-white mb-6">Display Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Behavior Controls */}
              <div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoplay"
                      name="autoplay"
                      checked={settings.autoplay !== false}
                      onChange={handleSettingsChange}
                      className="h-5 w-5 text-yellow-400 rounded focus:ring-yellow-400"
                    />
                    <label htmlFor="autoplay" className="ml-2 text-gray-300">
                      Autoplay Slideshow
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="loop"
                      name="loop"
                      checked={settings.loop !== false}
                      onChange={handleSettingsChange}
                      className="h-5 w-5 text-yellow-400 rounded focus:ring-yellow-400"
                    />
                    <label htmlFor="loop" className="ml-2 text-gray-300">
                      Loop Slideshow
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="pause_on_hover"
                      name="pause_on_hover"
                      checked={settings.pause_on_hover !== false}
                      onChange={handleSettingsChange}
                      className="h-5 w-5 text-yellow-400 rounded focus:ring-yellow-400"
                    />
                    <label htmlFor="pause_on_hover" className="ml-2 text-gray-300">
                      Pause on Hover
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="show_indicators"
                      name="show_indicators"
                      checked={settings.show_indicators !== false}
                      onChange={handleSettingsChange}
                      className="h-5 w-5 text-yellow-400 rounded focus:ring-yellow-400"
                    />
                    <label htmlFor="show_indicators" className="ml-2 text-gray-300">
                      Show Slide Indicators
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="show_controls"
                      name="show_controls"
                      checked={settings.show_controls !== false}
                      onChange={handleSettingsChange}
                      className="h-5 w-5 text-yellow-400 rounded focus:ring-yellow-400"
                    />
                    <label htmlFor="show_controls" className="ml-2 text-gray-300">
                      Show Navigation Controls
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Default Transition Settings */}
            <h3 className="text-lg font-medium text-white mb-4">Default Transition Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-gray-300 mb-2">Default Transition Type</label>
                <select
                  name="default_transition_type"
                  value={settings.default_transition_type || 'fade'}
                  onChange={handleSettingsChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                >
                  <option value="fade">Fade</option>
                  <option value="slide-up">Slide Up</option>
                  <option value="slide-down">Slide Down</option>
                  <option value="slide-left">Slide Left</option>
                  <option value="slide-right">Slide Right</option>
                  <option value="zoom-in">Zoom In</option>
                  <option value="zoom-out">Zoom Out</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Default Display Duration (ms)</label>
                <input
                  type="number"
                  name="default_display_duration"
                  value={settings.default_display_duration || 6000}
                  onChange={handleSettingsChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                  min="1000"
                  step="500"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Default Transition Duration (ms)</label>
                <input
                  type="number"
                  name="default_transition_duration"
                  value={settings.default_transition_duration || 1500}
                  onChange={handleSettingsChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                  min="500"
                  step="100"
                />
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsEditingSettings(false)}
              className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveSettings}
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
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-serif text-white">Hero Slideshow Management</h1>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditingSettings(true)}
                className="px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition-colors flex items-center"
              >
                <Edit size={18} className="mr-2" />
                Slideshow Settings
              </button>
              <button
                onClick={handleNewSlide}
                className="px-4 py-2 bg-yellow-400 text-slate-900 rounded hover:bg-yellow-500 transition-colors flex items-center"
              >
                <Plus size={18} className="mr-2" />
                New Slide
              </button>
            </div>
          </div>
          
          {slides.length === 0 ? (
            <div className="bg-slate-800 rounded-lg p-10 text-center">
              <div className="text-5xl mb-4">🖼️</div>
              <h2 className="text-xl text-white mb-2">No Hero Slides Found</h2>
              <p className="text-gray-400 mb-6">
                Create your first slide to start building your hero slideshow.
              </p>
              <button
                onClick={handleNewSlide}
                className="px-6 py-3 bg-yellow-400 text-slate-900 rounded hover:bg-yellow-500 transition-colors"
              >
                <Plus size={18} className="inline mr-2" />
                Create First Slide
              </button>
            </div>
          ) : (
            <div>
              <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-xl font-medium text-white mb-6">Hero Slides ({slides.length})</h2>
                
                <div className="space-y-6">
                  {slides.map((slide, index) => (
                    <div key={slide.id} className="bg-slate-700 rounded-lg overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                        {/* Slide Preview */}
                        <div className="md:col-span-3 bg-slate-800 relative">
                          {slide.image_url ? (
                            <img 
                              src={slide.image_url} 
                              alt={slide.title} 
                              className="w-full h-40 object-cover"
                            />
                          ) : slide.video_url ? (
                            <div className="w-full h-40 flex items-center justify-center bg-slate-800">
                              <Play size={40} className="text-gray-500" />
                            </div>
                          ) : (
                            <div className="w-full h-40 flex items-center justify-center bg-slate-800">
                              <span className="text-gray-500">No Media</span>
                            </div>
                          )}
                          
                          {/* Status Badge */}
                          <div className="absolute top-2 right-2">
                            {slide.is_active ? (
                              <span className="px-2 py-1 bg-green-500/50 text-white text-xs rounded">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-500/50 text-white text-xs rounded">
                                Inactive
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Slide Content */}
                        <div className="md:col-span-7 p-4 flex flex-col justify-center">
                          <h3 className="text-lg font-medium text-white mb-2">
                            {slide.title || 'Untitled Slide'}
                          </h3>
                          
                          {slide.subtitle && (
                            <p className="text-gray-400 text-sm mb-1">
                              <span className="font-medium text-yellow-400">Subtitle:</span> {slide.subtitle}
                            </p>
                          )}
                          
                          {slide.description && (
                            <p className="text-gray-400 text-sm line-clamp-2">
                              {slide.description}
                            </p>
                          )}
                          
                          <div className="mt-2 flex flex-wrap gap-2">
                            {slide.primary_btn_text && (
                              <span className="bg-yellow-400/20 text-yellow-300 text-xs px-2 py-1 rounded">
                                Button: {slide.primary_btn_text}
                              </span>
                            )}
                            
                            {slide.secondary_btn_text && (
                              <span className="bg-slate-600/50 text-gray-300 text-xs px-2 py-1 rounded">
                                Button: {slide.secondary_btn_text}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="md:col-span-2 flex md:flex-col justify-end p-4 gap-2">
                          <button
                            onClick={() => handleEditSlide(slide, index)}
                            className="p-2 bg-slate-600 rounded hover:bg-slate-500 transition-colors text-white"
                            title="Edit slide"
                          >
                            <Edit size={18} />
                          </button>
                          
                          <button
                            onClick={() => handleToggleActive(slide.id, slide.is_active)}
                            className={`p-2 rounded transition-colors text-white ${
                              slide.is_active 
                                ? 'bg-red-500/30 hover:bg-red-500/50' 
                                : 'bg-green-500/30 hover:bg-green-500/50'
                            }`}
                            title={slide.is_active ? 'Deactivate slide' : 'Activate slide'}
                          >
                            {slide.is_active ? <X size={18} /> : <Eye size={18} />}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteSlide(slide.id, index)}
                            className="p-2 bg-red-500/20 rounded hover:bg-red-500/40 transition-colors text-white"
                            title="Delete slide"
                          >
                            <Trash2 size={18} />
                          </button>
                          
                          <div className="mt-2 space-y-1">
                            <button
                              onClick={() => handleMoveSlide(index, 'up')}
                              disabled={index === 0}
                              className="p-2 bg-slate-600 rounded hover:bg-slate-500 transition-colors text-white disabled:opacity-30 disabled:cursor-not-allowed w-full"
                              title="Move up"
                            >
                              <ArrowUp size={16} />
                            </button>
                            
                            <button
                              onClick={() => handleMoveSlide(index, 'down')}
                              disabled={index === slides.length - 1}
                              className="p-2 bg-slate-600 rounded hover:bg-slate-500 transition-colors text-white disabled:opacity-30 disabled:cursor-not-allowed w-full"
                              title="Move down"
                            >
                              <ArrowDown size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleNewSlide}
                  className="px-6 py-3 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  Add Another Slide
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminHeroSection;