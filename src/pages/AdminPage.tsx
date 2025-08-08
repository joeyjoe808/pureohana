import React, { useState, useCallback } from 'react';
import { Upload, X, Image, Check, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PhotoSection {
  id: string;
  name: string;
  description: string;
  currentImage?: string;
}

const AdminPage = () => {
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File }>({});
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({});

  const sections: PhotoSection[] = [
    {
      id: 'hero',
      name: 'Hero Background',
      description: 'Main background image on homepage (1920x1080 recommended)',
      currentImage: 'IMG_0776.JPG'
    },
    {
      id: 'portfolio1',
      name: 'Portfolio Image 1',
      description: 'First image in portfolio grid',
      currentImage: 'IMG_0843.JPG'
    },
    {
      id: 'portfolio2',
      name: 'Portfolio Image 2',
      description: 'Second image in portfolio grid',
      currentImage: 'IMG_0886.JPG'
    },
    {
      id: 'portfolio3',
      name: 'Portfolio Image 3',
      description: 'Third image in portfolio grid',
      currentImage: 'IMG_0776.JPG'
    },
    {
      id: 'portfolio4',
      name: 'Portfolio Image 4',
      description: 'Fourth image in portfolio grid',
      currentImage: 'IMG_0843.JPG'
    },
    {
      id: 'featured',
      name: 'Featured Wedding',
      description: 'Featured wedding showcase image',
      currentImage: 'IMG_0886.JPG'
    }
  ];

  const handleFileSelect = (sectionId: string, file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFiles(prev => ({ ...prev, [sectionId]: file }));
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => ({ ...prev, [sectionId]: url }));
    }
  };

  const handleDrop = useCallback((e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(sectionId, file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const uploadPhoto = async (sectionId: string) => {
    const file = selectedFiles[sectionId];
    if (!file) return;

    setUploading(sectionId);
    setUploadSuccess(null);

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `${sectionId}_${timestamp}_${file.name}`;

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from('pureohanatreasures')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pureohanatreasures')
        .getPublicUrl(fileName);

      // Update the website (you'll need to store this in a database or config)
      console.log(`New URL for ${sectionId}:`, publicUrl);
      
      setUploadSuccess(sectionId);
      
      // Clear after success
      setTimeout(() => {
        setUploadSuccess(null);
        setSelectedFiles(prev => {
          const newState = { ...prev };
          delete newState[sectionId];
          return newState;
        });
        setPreviewUrls(prev => {
          const newState = { ...prev };
          delete newState[sectionId];
          return newState;
        });
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(null);
    }
  };

  const cancelSelection = (sectionId: string) => {
    setSelectedFiles(prev => {
      const newState = { ...prev };
      delete newState[sectionId];
      return newState;
    });
    setPreviewUrls(prev => {
      const newState = { ...prev };
      URL.revokeObjectURL(newState[sectionId]);
      delete newState[sectionId];
      return newState;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-light mb-2">Photo Management</h1>
          <p className="text-gray-600 mb-8">Upload and manage photos for your website</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map(section => (
              <div key={section.id} className="border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-2">{section.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{section.description}</p>
                
                {/* Current Image */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Current: {section.currentImage}</p>
                </div>

                {/* Drop Zone */}
                {!selectedFiles[section.id] ? (
                  <div
                    onDrop={(e) => handleDrop(e, section.id)}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 mb-2">Drag & drop your photo here</p>
                    <p className="text-xs text-gray-500 mb-3">or</p>
                    <label className="cursor-pointer">
                      <span className="text-sm text-blue-600 hover:text-blue-700">Browse files</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(section.id, e.target.files[0])}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Preview */}
                    {previewUrls[section.id] && (
                      <div className="relative">
                        <img 
                          src={previewUrls[section.id]} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => cancelSelection(section.id)}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    )}
                    
                    {/* Upload Button */}
                    <button
                      onClick={() => uploadPhoto(section.id)}
                      disabled={uploading === section.id}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        uploading === section.id
                          ? 'bg-gray-300 cursor-not-allowed'
                          : uploadSuccess === section.id
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {uploading === section.id ? (
                        <span className="flex items-center justify-center">
                          <Loader className="animate-spin mr-2" size={18} />
                          Uploading...
                        </span>
                      ) : uploadSuccess === section.id ? (
                        <span className="flex items-center justify-center">
                          <Check className="mr-2" size={18} />
                          Uploaded!
                        </span>
                      ) : (
                        'Upload Photo'
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> After uploading, it may take 1-2 minutes for changes to appear on your live website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;