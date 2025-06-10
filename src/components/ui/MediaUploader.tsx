import React, { useState } from 'react';
import { Upload, Film, Image as ImageIcon, AlertTriangle, CheckCircle } from 'lucide-react';
import FileUploader from './FileUploader';

interface MediaUploaderProps {
  onUploadComplete: (url: string, mediaType: 'image' | 'video') => void;
  folder?: string;
  mediaTypes?: ('image' | 'video')[];
  initialMediaType?: 'image' | 'video';
  buttonText?: string;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUploadComplete,
  folder = 'uploads',
  mediaTypes = ['image', 'video'],
  initialMediaType = 'image',
  buttonText
}) => {
  const [mediaType, setMediaType] = useState<'image' | 'video'>(initialMediaType);
  const [videoUrl, setVideoUrl] = useState('');
  const [isAddingVideoUrl, setIsAddingVideoUrl] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  const handleUploadComplete = (url: string) => {
    onUploadComplete(url, mediaType);
    showNotification('success', `${mediaType === 'image' ? 'Image' : 'Video'} uploaded successfully`);
  };

  const handleVideoUrlSubmit = () => {
    if (!videoUrl) {
      showNotification('error', 'Please enter a video URL');
      return;
    }

    // Check if it's a valid URL
    try {
      new URL(videoUrl);
      onUploadComplete(videoUrl, 'video');
      setVideoUrl('');
      setIsAddingVideoUrl(false);
      showNotification('success', 'Video URL added successfully');
    } catch (e) {
      showNotification('error', 'Please enter a valid URL');
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: 'success', message: '' });
    }, 3000);
  };

  const getFileTypes = () => {
    return mediaType === 'image' 
      ? ['image/*'] 
      : ['video/*'];
  };

  return (
    <div className="space-y-4">
      {/* Notification */}
      {notification.show && (
        <div className={`p-3 rounded-md text-sm flex items-start ${
          notification.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}
      
      {/* Media type selector - only show if multiple media types are allowed */}
      {mediaTypes.length > 1 && (
        <div className="flex space-x-2 mb-4">
          {mediaTypes.includes('image') && (
            <button
              type="button"
              onClick={() => setMediaType('image')}
              className={`px-3 py-1.5 rounded text-sm flex items-center ${
                mediaType === 'image' 
                  ? 'bg-yellow-400 text-slate-900' 
                  : 'bg-slate-700 text-white hover:bg-slate-600'
              }`}
            >
              <ImageIcon size={16} className="mr-1" />
              Image
            </button>
          )}
          
          {mediaTypes.includes('video') && (
            <button
              type="button"
              onClick={() => setMediaType('video')}
              className={`px-3 py-1.5 rounded text-sm flex items-center ${
                mediaType === 'video' 
                  ? 'bg-yellow-400 text-slate-900' 
                  : 'bg-slate-700 text-white hover:bg-slate-600'
              }`}
            >
              <Film size={16} className="mr-1" />
              Video
            </button>
          )}
        </div>
      )}
      
      {/* File uploader or video URL input */}
      {mediaType === 'image' || !isAddingVideoUrl ? (
        <FileUploader
          onUploadComplete={handleUploadComplete}
          onUploadError={(error) => showNotification('error', error.message)}
          folder={`${folder}/${mediaType}s`}
          fileTypes={getFileTypes()}
          maxSizeMB={mediaType === 'image' ? 5 : 100}
          buttonText={buttonText || `Upload ${mediaType === 'image' ? 'Image' : 'Video'}`}
        />
      ) : (
        <div className="space-y-2">
          <label className="text-sm text-gray-300">Video URL (YouTube, Vimeo, or direct link)</label>
          <div className="flex">
            <input 
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://..."
              className="flex-grow px-4 py-2 bg-slate-700 border border-slate-600 rounded-l focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
            />
            <button
              type="button"
              onClick={handleVideoUrlSubmit}
              className="px-4 py-2 bg-yellow-400 text-slate-900 rounded-r hover:bg-yellow-500 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      )}
      
      {/* Video URL option toggle */}
      {mediaType === 'video' && (
        <button
          type="button"
          onClick={() => setIsAddingVideoUrl(!isAddingVideoUrl)}
          className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          {isAddingVideoUrl ? 'Upload video file instead' : 'Enter video URL instead'}
        </button>
      )}
    </div>
  );
};

export default MediaUploader;