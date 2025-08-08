// Helper function to get proper Supabase storage URLs
export const getSupabaseImageUrl = (path: string) => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/${cleanPath}`;
};

// Helper to check if image exists
export const checkImageExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// Get fallback image if primary fails
export const getImageWithFallback = (primaryUrl: string, fallbackUrl: string) => {
  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(primaryUrl);
    img.onerror = () => resolve(fallbackUrl);
    img.src = primaryUrl;
  });
};