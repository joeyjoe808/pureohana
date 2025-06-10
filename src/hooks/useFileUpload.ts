import { useState } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Custom hook for handling file uploads to Supabase storage
 */
export type FileUploadOptions = {
  bucket?: string;
  folder?: string;
  fileTypes?: string[]; // e.g. ['image/*', 'video/*']
  maxSizeMB?: number;
  onSuccess?: (url: string, file: File) => void;
  onError?: (error: Error) => void;
  generateThumbnail?: boolean;
}

export const useFileUpload = (options: FileUploadOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const {
    bucket = 'media',
    folder = 'uploads',
    fileTypes = ['image/*', 'video/*'],
    maxSizeMB = 50,
    onSuccess,
    onError,
    generateThumbnail = false
  } = options;

  /**
   * Validates a file before upload
   */
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { 
        valid: false, 
        error: `File size exceeds maximum allowed size of ${maxSizeMB}MB` 
      };
    }

    // Check file type if fileTypes is specified
    if (fileTypes.length > 0) {
      // Handling wildcards like 'image/*'
      const fileType = file.type;
      const isValidType = fileTypes.some(type => {
        if (type.endsWith('/*')) {
          const category = type.split('/')[0];
          return fileType.startsWith(`${category}/`);
        }
        return type === fileType;
      });

      if (!isValidType) {
        return { 
          valid: false, 
          error: `File type not supported. Allowed types: ${fileTypes.join(', ')}` 
        };
      }
    }

    return { valid: true };
  };

  /**
   * Generates a unique file name to avoid collisions
   */
  const generateFileName = (file: File): string => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    
    return `${timestamp}_${random}.${fileExt}`;
  };

  /**
   * Gets image dimensions if the file is an image
   */
  const getImageDimensions = (file: File): Promise<{ width: number; height: number } | null> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(null);
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => {
        resolve(null);
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  /**
   * Creates a thumbnail for images if needed
   */
  const createThumbnail = async (file: File): Promise<string | null> => {
    if (!generateThumbnail || !file.type.startsWith('image/')) {
      return null;
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Create a small thumbnail (max 300x300)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }

        const maxSize = 300;
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxSize) {
            height = Math.round(height * maxSize / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round(width * maxSize / height);
            height = maxSize;
          }
        }
        
        // Set canvas size
        canvas.width = width;
        canvas.height = height;
        
        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(null);
            return;
          }
          
          // Create a new file from the blob
          const thumbnailFile = new File([blob], `thumb_${file.name}`, { 
            type: 'image/jpeg',
            lastModified: new Date().getTime()
          });
          
          // Upload the thumbnail
          const thumbnailPath = `${folder}/thumbnails/${generateFileName(thumbnailFile)}`;
          
          supabase.storage
            .from(bucket)
            .upload(thumbnailPath, thumbnailFile)
            .then(({ data }) => {
              if (data) {
                const { data: urlData } = supabase.storage
                  .from(bucket)
                  .getPublicUrl(thumbnailPath);
                
                resolve(urlData.publicUrl);
              } else {
                resolve(null);
              }
            })
            .catch(() => {
              resolve(null);
            });
        }, 'image/jpeg', 0.75);
        
        URL.revokeObjectURL(img.src);
      };
      
      img.onerror = () => {
        resolve(null);
        URL.revokeObjectURL(img.src);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  /**
   * Uploads a file to Supabase storage
   */
  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      setError(null);
      setProgress(0);
      
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      
      // Generate file path
      const fileName = generateFileName(file);
      const filePath = `${folder}/${fileName}`;
      
      // Get image dimensions if it's an image
      const dimensions = await getImageDimensions(file);
      
      // Upload file to Supabase
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      const publicUrl = urlData.publicUrl;
      
      // Create thumbnail if needed
      let thumbnailUrl = null;
      if (generateThumbnail) {
        thumbnailUrl = await createThumbnail(file);
      }
      
      // Store in media library if needed
      if (folder === 'media_library' || folder === 'uploads') {
        try {
          await supabase
            .from('media_library')
            .insert({
              file_name: file.name,
              file_path: publicUrl,
              file_type: file.type,
              file_size: file.size,
              width: dimensions?.width,
              height: dimensions?.height,
              thumbnail_path: thumbnailUrl
            });
        } catch (e) {
          console.warn('Could not add to media library:', e);
          // Don't fail the overall upload if this fails
        }
      }
      
      // Set state and call success callback
      setUploadedUrl(publicUrl);
      setProgress(100);
      
      if (onSuccess) {
        onSuccess(publicUrl, file);
      }
      
      return publicUrl;
    } catch (err: any) {
      console.error('File upload error:', err);
      setError(err);
      
      if (onError) {
        onError(err);
      }
      
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Uploads multiple files to Supabase storage
   */
  const uploadMultipleFiles = async (files: FileList | File[]): Promise<string[]> => {
    const urls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const url = await uploadFile(files[i]);
      if (url) {
        urls.push(url);
      }
      // Update progress
      setProgress(((i + 1) / files.length) * 100);
    }
    
    return urls;
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    isUploading,
    progress,
    error,
    uploadedUrl
  };
};