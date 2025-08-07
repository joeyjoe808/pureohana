// Your Supabase image URLs
// These are the correct format for accessing your photos from Supabase storage

export const SUPABASE_URL = 'https://ujpvlaaitdudcawgcyik.supabase.co';
export const BUCKET_NAME = 'pureohanatreasures';

// Helper function to get image URL
export const getImageUrl = (filename: string) => {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${filename}`;
};

// Your actual photos - update these with your actual filenames from Supabase
export const websiteImages = {
  // Hero/Main background image
  hero: getImageUrl('your-main-hero-image.jpg'), // Replace with your hero image filename
  
  // Portfolio grid images (4 images)
  portfolio: [
    getImageUrl('portfolio-1.jpg'), // Replace with your portfolio image 1
    getImageUrl('portfolio-2.jpg'), // Replace with your portfolio image 2
    getImageUrl('portfolio-3.jpg'), // Replace with your portfolio image 3
    getImageUrl('portfolio-4.jpg'), // Replace with your portfolio image 4
  ],
  
  // Featured wedding image
  featured: getImageUrl('featured-wedding.jpg'), // Replace with your featured image
  
  // Add more as needed
  about: getImageUrl('about-image.jpg'),
};

// Example URLs with actual filenames you might have:
// If your files are named like: IMG_0776.jpg, untitled-1720.jpg, etc.
export const exampleImages = {
  hero: getImageUrl('IMG_0776.jpg'),
  portfolio: [
    getImageUrl('untitled-1700.jpg'),
    getImageUrl('untitled-1705.jpg'),
    getImageUrl('untitled-1710.jpg'),
    getImageUrl('untitled-1715.jpg'),
  ],
  featured: getImageUrl('untitled-1730.jpg'),
};