// Photo configuration management
// This stores which photos are used in each section

export interface PhotoConfig {
  hero: string;
  portfolio1: string;
  portfolio2: string;
  portfolio3: string;
  portfolio4: string;
  featured: string;
}

// Default photo configuration
export const defaultPhotos: PhotoConfig = {
  hero: 'IMG_0776.JPG',
  portfolio1: 'IMG_0843.JPG',
  portfolio2: 'IMG_0886.JPG',
  portfolio3: 'IMG_0776.JPG',
  portfolio4: 'IMG_0843.JPG',
  featured: 'IMG_0886.JPG'
};

// Get Supabase URL for a photo
export const getPhotoUrl = (filename: string): string => {
  return `https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/${filename}`;
};

// Load photo config from localStorage
export const loadPhotoConfig = (): PhotoConfig => {
  const saved = localStorage.getItem('photoConfig');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading photo config:', e);
    }
  }
  return defaultPhotos;
};

// Save photo config to localStorage
export const savePhotoConfig = (config: PhotoConfig): void => {
  localStorage.setItem('photoConfig', JSON.stringify(config));
};

// Update a specific section's photo
export const updateSectionPhoto = (section: keyof PhotoConfig, filename: string): void => {
  const config = loadPhotoConfig();
  config[section] = filename;
  savePhotoConfig(config);
};