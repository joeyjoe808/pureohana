import React, { useState, useRef } from 'react';
import { Upload, X, Check, File, AlertTriangle, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useFileUpload, type FileUploadOptions } from '../../hooks/useFileUpload';

interface FileUploaderProps {
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: Error) => void;
  value?: string;
  onChange?: (url: string) => void;
  folder?: string;
  bucket?: string;
  fileTypes?: string[];
  maxSizeMB?: number;
  className?: string;
  buttonText?: string;
  placeholder?: string;
  showPreview?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadComplete,
  onUploadError,
  value,
  onChange,
  folder = 'uploads',
  bucket = 'media',
  fileTypes = ['image/*'],
  maxSizeMB = 10,
  className = '',
  buttonText = 'Upload File',
  placeholder = 'No file selected',
  showPreview = true
}) => {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const uploadOptions: FileUploadOptions = {
    folder,
    bucket,
    fileTypes,
    maxSizeMB,
    onSuccess: (url: string) => {
      setPreview(url);
      if (onChange) onChange(url);
      if (onUploadComplete) onUploadComplete(url);
    },
    onError: (error: Error) => {
      if (onUploadError) onUploadError(error);
    }
  };
  
  const { uploadFile, isUploading, error } = useFileUpload(uploadOptions);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await uploadFile(file);
    }
  };
  
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await uploadFile(file);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  
  const clearFile = () => {
    setPreview(null);
    if (onChange) onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const isImage = (url: string): boolean => {
    return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url);
  };
  
  const isVideo = (url: string): boolean => {
    return /\.(mp4|webm|ogg|mov)$/i.test(url);
  };

  return (
    <div className={`${className}`}>
      <div 
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive 
            ? 'border-yellow-400 bg-yellow-400/10' 
            : 'border-slate-600 hover:border-slate-500'
        } ${error ? 'border-red-500 bg-red-500/10' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!isUploading && !preview && (
          <div className="flex flex-col items-center justify-center space-y-3 text-center">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-sm text-gray-300">
              <p>Drag and drop your file here, or</p>
              <button 
                type="button" 
                className="mt-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {buttonText}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept={fileTypes.join(',')}
            />
            <p className="text-xs text-gray-500">
              {placeholder}
            </p>
            {fileTypes.includes('image/*') && (
              <p className="text-xs text-gray-500">
                Supported formats: JPEG, PNG, GIF, WebP, SVG
              </p>
            )}
            {fileTypes.includes('video/*') && (
              <p className="text-xs text-gray-500">
                Supported formats: MP4, WebM, OGG, MOV
              </p>
            )}
            <p className="text-xs text-gray-500">
              Maximum file size: {maxSizeMB}MB
            </p>
          </div>
        )}
        
        {isUploading && (
          <div className="flex flex-col items-center justify-center space-y-3 py-4">
            <RefreshCw className="h-8 w-8 text-yellow-400 animate-spin" />
            <p className="text-sm text-gray-300">Uploading file...</p>
          </div>
        )}
        
        {error && (
          <div className="flex flex-col items-center justify-center space-y-3 py-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <p className="text-sm text-red-400">{error.message}</p>
            <button 
              type="button" 
              className="mt-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              Try Again
            </button>
          </div>
        )}
        
        {preview && !isUploading && !error && showPreview && (
          <div className="relative">
            <button
              type="button"
              onClick={clearFile}
              className="absolute top-2 right-2 rounded-full bg-black/70 p-1 text-gray-300 hover:text-white transition-colors"
              title="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
            
            {isImage(preview) ? (
              <div className="flex justify-center">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-h-64 rounded-lg"
                />
              </div>
            ) : isVideo(preview) ? (
              <div className="flex justify-center">
                <video 
                  src={preview} 
                  controls 
                  className="max-h-64 rounded-lg"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2 p-4">
                <File className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-300">
                  File uploaded successfully
                </span>
                <Check className="h-5 w-5 text-green-500" />
              </div>
            )}
            
            <div className="mt-2 flex justify-center">
              <button 
                type="button" 
                className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload a different file
              </button>
            </div>
          </div>
        )}
      </div>
      
      {value && !showPreview && (
        <div className="mt-2 flex items-center justify-between bg-slate-700 rounded p-2">
          {isImage(value) ? (
            <div className="flex items-center">
              <ImageIcon className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-xs text-gray-300 truncate max-w-xs">
                Image uploaded
              </span>
            </div>
          ) : (
            <div className="flex items-center">
              <File className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-xs text-gray-300 truncate max-w-xs">
                {value.split('/').pop()}
              </span>
            </div>
          )}
          
          <button
            type="button"
            onClick={clearFile}
            className="text-gray-400 hover:text-red-400 transition-colors"
            title="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      
      <input
        type="hidden"
        value={preview || ''}
        onChange={(e) => {
          if (onChange) onChange(e.target.value);
        }}
      />
    </div>
  );
};

export default FileUploader;