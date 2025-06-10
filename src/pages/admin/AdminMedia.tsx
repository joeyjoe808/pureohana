import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Save, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Upload, 
  Search, 
  Trash2, 
  Image as ImageIcon,
  Film,
  FileText,
  Filter,
  Copy,
  ExternalLink,
  X,
  Edit,
  Plus
} from 'lucide-react';
import FileUploader from '../../components/ui/FileUploader';

const AdminMedia = () => {
  const [loading, setLoading] = useState(true);
  const [mediaItems, setMediaItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchMediaLibrary();
  }, []);

  useEffect(() => {
    if (searchQuery || selectedType !== 'all') {
      filterMedia();
    } else {
      setFilteredItems(mediaItems);
    }
  }, [searchQuery, selectedType, mediaItems]);

  const fetchMediaLibrary = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setMediaItems(data || []);
      setFilteredItems(data || []);
    } catch (error) {
      console.error('Error fetching media library:', error);
      showNotification('error', 'Failed to load media library');
    } finally {
      setLoading(false);
    }
  };

  const filterMedia = () => {
    let filtered = [...mediaItems];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        (item.file_name && item.file_name.toLowerCase().includes(query)) || 
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query))
      );
    }
    
    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => 
        item.file_type && item.file_type.startsWith(selectedType)
      );
    }
    
    setFilteredItems(filtered);
  };

  const handleFileUpload = async (url) => {
    try {
      setUploadingFiles(true);
      
      // The file is already uploaded by the FileUploader component and added to the media_library table
      // Just refresh the list
      fetchMediaLibrary();
      
      showNotification('success', 'File uploaded successfully');
    } catch (error) {
      console.error('Error handling upload:', error);
      showNotification('error', 'Failed to process uploaded file');
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleDeleteMedia = async (id) => {
    if (!confirm('Are you sure you want to delete this media item? This cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Get the file path first
      const { data: mediaItem } = await supabase
        .from('media_library')
        .select('file_path')
        .eq('id', id)
        .single();
      
      if (mediaItem) {
        // Extract the file name from the path
        const fileName = mediaItem.file_path.split('/').pop();
        
        // Delete from storage (if possible)
        try {
          await supabase.storage
            .from('media')
            .remove([`media_library/${fileName}`]);
        } catch (storageError) {
          console.error('Error deleting from storage (continuing):', storageError);
          // Continue with database deletion even if storage deletion fails
        }
      }
      
      // Delete from database
      const { error } = await supabase
        .from('media_library')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove from state
      setMediaItems(mediaItems.filter(item => item.id !== id));
      setFilteredItems(filteredItems.filter(item => item.id !== id));
      
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem(null);
      }
      
      showNotification('success', 'Media deleted successfully');
    } catch (error) {
      console.error('Error deleting media:', error);
      showNotification('error', 'Failed to delete media');
    } finally {
      setLoading(false);
    }
  };

  const updateMediaItem = async () => {
    if (!editingItem) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('media_library')
        .update({
          title: editingItem.title,
          alt_text: editingItem.alt_text,
          description: editingItem.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingItem.id);
      
      if (error) throw error;
      
      // Update state
      setMediaItems(mediaItems.map(item => 
        item.id === editingItem.id ? { ...item, ...editingItem } : item
      ));
      
      setFilteredItems(filteredItems.map(item => 
        item.id === editingItem.id ? { ...item, ...editingItem } : item
      ));
      
      setSelectedItem({ ...selectedItem, ...editingItem });
      setEditingItem(null);
      
      showNotification('success', 'Media updated successfully');
    } catch (error) {
      console.error('Error updating media:', error);
      showNotification('error', 'Failed to update media');
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem({ ...item });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => showNotification('success', 'URL copied to clipboard'),
      () => showNotification('error', 'Failed to copy URL')
    );
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  if (loading && mediaItems.length === 0) {
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
        <h1 className="text-2xl font-serif text-white mb-2">Media Library</h1>
        <p className="text-gray-400">
          Manage all your media files in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Media Grid */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search media..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
                
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                >
                  <option value="all">All Media</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="application">Documents</option>
                </select>
              </div>
            </div>
            
            {/* File uploader */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-white mb-4">Upload New Media</h2>
              <FileUploader 
                folder="media_library"
                fileTypes={['image/*', 'video/*', 'application/pdf']}
                maxSizeMB={50}
                onUploadComplete={handleFileUpload}
                buttonText="Upload Media File"
                placeholder="JPG, PNG, GIF, MP4, PDF, etc. (Max 50MB)"
                showPreview={false}
              />
            </div>
            
            {uploadingFiles && (
              <div className="flex justify-center items-center py-4 mb-4 bg-slate-700/30 rounded">
                <RefreshCw size={20} className="animate-spin text-yellow-400 mr-2" />
                <span className="text-white">Processing upload...</span>
              </div>
            )}
            
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                {searchQuery || selectedType !== 'all' ? (
                  <>
                    <div className="text-5xl mb-4">🔍</div>
                    <h2 className="text-xl text-white mb-2">No results found</h2>
                    <p className="text-gray-400 mb-4">
                      Try adjusting your search terms or filters.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedType('all');
                      }}
                      className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
                    >
                      Clear filters
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-5xl mb-4">📁</div>
                    <h2 className="text-xl text-white mb-2">Your media library is empty</h2>
                    <p className="text-gray-400 mb-6">
                      Upload files to add them to your media library.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`relative group cursor-pointer rounded-md overflow-hidden bg-slate-700 ${
                      selectedItem && selectedItem.id === item.id ? 'ring-2 ring-yellow-400' : ''
                    }`}
                  >
                    {item.file_type && item.file_type.startsWith('image/') ? (
                      <div className="aspect-square">
                        <img
                          src={item.file_path}
                          alt={item.alt_text || item.file_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : item.file_type && item.file_type.startsWith('video/') ? (
                      <div className="aspect-square bg-slate-800 flex flex-col items-center justify-center">
                        <Film size={24} className="text-gray-400 mb-2" />
                        <span className="text-xs text-gray-400">Video</span>
                      </div>
                    ) : (
                      <div className="aspect-square bg-slate-800 flex flex-col items-center justify-center">
                        <FileText size={24} className="text-gray-400 mb-2" />
                        <span className="text-xs text-gray-400">File</span>
                      </div>
                    )}
                    
                    <div className="absolute inset-x-0 bottom-0 bg-black/70 py-1 px-2">
                      <div className="text-white text-xs truncate">
                        {item.title || item.file_name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Media Details Panel */}
        <div className="lg:col-span-1">
          {selectedItem ? (
            <div className="bg-slate-800 rounded-lg shadow-lg p-6 sticky top-6">
              <div className="mb-6">
                <h2 className="text-xl font-medium text-white mb-4">Media Details</h2>
                
                <div className="mb-6">
                  {selectedItem.file_type && selectedItem.file_type.startsWith('image/') ? (
                    <img
                      src={selectedItem.file_path}
                      alt={selectedItem.alt_text || selectedItem.file_name}
                      className="w-full h-auto rounded"
                    />
                  ) : selectedItem.file_type && selectedItem.file_type.startsWith('video/') ? (
                    <div className="aspect-video bg-slate-700 rounded">
                      <video
                        src={selectedItem.file_path}
                        controls
                        className="w-full h-full rounded"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-slate-700 rounded flex items-center justify-center">
                      <FileText size={40} className="text-gray-400" />
                    </div>
                  )}
                </div>
                
                {editingItem ? (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-1 text-sm">Title</label>
                        <input
                          type="text"
                          value={editingItem.title || ''}
                          onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                          placeholder="Media title"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 mb-1 text-sm">Alt Text</label>
                        <input
                          type="text"
                          value={editingItem.alt_text || ''}
                          onChange={(e) => setEditingItem({...editingItem, alt_text: e.target.value})}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                          placeholder="Alternative text for accessibility"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 mb-1 text-sm">Description</label>
                        <textarea
                          value={editingItem.description || ''}
                          onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                          placeholder="Media description"
                          rows={3}
                        ></textarea>
                      </div>
                      
                      <div className="flex space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingItem(null)}
                          className="px-3 py-1 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={updateMediaItem}
                          className="px-3 py-1 bg-yellow-400 text-slate-900 rounded hover:bg-yellow-500 transition-colors flex items-center"
                        >
                          <Save size={16} className="mr-1" />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-gray-300 text-sm font-medium">File Name</h3>
                        <p className="text-white break-words">{selectedItem.file_name}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <h3 className="text-gray-300 text-sm font-medium">Type</h3>
                          <p className="text-white">{selectedItem.file_type}</p>
                        </div>
                        <div>
                          <h3 className="text-gray-300 text-sm font-medium">Size</h3>
                          <p className="text-white">{formatFileSize(selectedItem.file_size)}</p>
                        </div>
                      </div>
                      
                      {selectedItem.width && selectedItem.height && (
                        <div>
                          <h3 className="text-gray-300 text-sm font-medium">Dimensions</h3>
                          <p className="text-white">{selectedItem.width} × {selectedItem.height}px</p>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="text-gray-300 text-sm font-medium">Title</h3>
                        <p className="text-white">{selectedItem.title || '—'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-gray-300 text-sm font-medium">Alt Text</h3>
                        <p className="text-white">{selectedItem.alt_text || '—'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-gray-300 text-sm font-medium">Description</h3>
                        <p className="text-white">{selectedItem.description || '—'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-gray-300 text-sm font-medium">Uploaded</h3>
                        <p className="text-white">
                          {new Date(selectedItem.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-gray-300 text-sm font-medium">URL</h3>
                        <div className="flex items-center mt-1">
                          <input
                            type="text"
                            value={selectedItem.file_path}
                            readOnly
                            className="flex-grow px-2 py-1 bg-slate-700 border border-slate-600 rounded-l text-white text-sm truncate"
                          />
                          <button
                            onClick={() => copyToClipboard(selectedItem.file_path)}
                            className="px-2 py-1 bg-slate-600 text-white rounded-r"
                            title="Copy URL"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => handleEditItem(selectedItem)}
                        className="px-3 py-1 border border-blue-500/30 text-blue-400 rounded hover:bg-blue-500/10 transition-colors flex items-center"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => window.open(selectedItem.file_path, '_blank')}
                        className="px-3 py-1 border border-green-500/30 text-green-400 rounded hover:bg-green-500/10 transition-colors flex items-center"
                      >
                        <ExternalLink size={16} className="mr-1" />
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMedia(selectedItem.id)}
                        className="px-3 py-1 border border-red-500/30 text-red-400 rounded hover:bg-red-500/10 transition-colors flex items-center"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-800 rounded-lg shadow-lg p-6">
              <div className="py-10 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-4">
                  <ImageIcon size={24} className="text-gray-400" />
                </div>
                <h2 className="text-lg text-white mb-2">No Media Selected</h2>
                <p className="text-gray-400 mb-4">
                  Select an item to view its details or upload new media.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMedia;