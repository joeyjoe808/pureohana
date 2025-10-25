/**
 * OptimizedImage Component
 *
 * High-performance image component with:
 * - Blur-up placeholder loading
 * - WebP/AVIF with fallbacks
 * - Responsive images (srcset)
 * - Lazy loading with intersection observer
 * - Automatic Supabase Storage CDN URLs
 *
 * @example
 * ```tsx
 * <OptimizedImage
 *   src="photo.jpg"
 *   alt="Beautiful landscape"
 *   width={800}
 *   height={600}
 *   sizes="(max-width: 768px) 100vw, 50vw"
 *   priority={false}
 * />
 * ```
 */

import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  blurDataURL?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  onError?: () => void;
}

interface ImageState {
  isLoaded: boolean;
  isError: boolean;
  currentSrc: string | null;
}

/**
 * Generate responsive image URLs for Supabase Storage
 */
const generateResponsiveSources = (src: string, width?: number): string[] => {
  if (!width) {
    return [src];
  }

  const widths = [640, 750, 828, 1080, 1200, 1920, 2048];
  const applicableWidths = widths.filter(w => w <= width * 2);

  return applicableWidths.map(w => {
    // If using Supabase Storage, append transformation parameters
    if (src.includes('supabase')) {
      const url = new URL(src);
      url.searchParams.set('width', w.toString());
      url.searchParams.set('quality', '85');
      return url.toString();
    }
    return src;
  });
};

/**
 * Generate WebP/AVIF versions of the image
 */
const generateModernFormats = (src: string, format: 'webp' | 'avif'): string => {
  if (src.includes('supabase')) {
    const url = new URL(src);
    url.searchParams.set('format', format);
    return url.toString();
  }

  // For other sources, attempt to change extension
  return src.replace(/\.(jpg|jpeg|png)$/i, `.${format}`);
};

/**
 * Generate blur placeholder data URL
 */
const generateBlurPlaceholder = (width: number = 10, height: number = 10): string => {
  // Generate a tiny SVG placeholder with blur effect
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <filter id="blur">
        <feGaussianBlur stdDeviation="2"/>
      </filter>
      <rect width="100%" height="100%" fill="#e5e7eb" filter="url(#blur)"/>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  sizes = '100vw',
  priority = false,
  blurDataURL,
  objectFit = 'cover',
  className = '',
  onLoad,
  onError,
  ...props
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageState, setImageState] = useState<ImageState>({
    isLoaded: false,
    isError: false,
    currentSrc: null,
  });

  // Use intersection observer for lazy loading (unless priority)
  const { isIntersecting } = useIntersectionObserver(imageRef, {
    threshold: 0.01,
    rootMargin: '50px',
    freezeOnceVisible: true,
    skip: priority, // Skip observer if priority image
  });

  const shouldLoad = priority || isIntersecting;

  // Generate responsive sources
  const responsiveSources = generateResponsiveSources(src, width);

  // Generate srcset string
  const srcSet = responsiveSources
    .map((url, idx) => {
      const widths = [640, 750, 828, 1080, 1200, 1920, 2048];
      return `${url} ${widths[idx]}w`;
    })
    .join(', ');

  // Generate WebP and AVIF sources
  const webpSrcSet = responsiveSources
    .map(url => generateModernFormats(url, 'webp'))
    .join(', ');

  const avifSrcSet = responsiveSources
    .map(url => generateModernFormats(url, 'avif'))
    .join(', ');

  // Placeholder
  const placeholder = blurDataURL || generateBlurPlaceholder(width, height);

  // Handle image load
  const handleLoad = () => {
    setImageState(prev => ({ ...prev, isLoaded: true }));
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setImageState(prev => ({ ...prev, isError: true }));
    onError?.();
  };

  // Preload priority images
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      if (srcSet) {
        link.setAttribute('imagesrcset', srcSet);
      }
      if (sizes) {
        link.setAttribute('imagesizes', sizes);
      }
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, src, srcSet, sizes]);

  const imageClasses = `
    transition-all duration-500 ease-in-out
    ${imageState.isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}
    ${className}
  `;

  const placeholderClasses = `
    absolute inset-0 transition-opacity duration-500
    ${imageState.isLoaded ? 'opacity-0' : 'opacity-100'}
  `;

  const containerStyle = {
    position: 'relative' as const,
    overflow: 'hidden',
    ...(width && height ? { aspectRatio: `${width} / ${height}` } : {}),
  };

  return (
    <div style={containerStyle} className="relative">
      {/* Blur placeholder */}
      {!imageState.isLoaded && (
        <img
          src={placeholder}
          alt=""
          aria-hidden="true"
          className={placeholderClasses}
          style={{
            objectFit,
            width: '100%',
            height: '100%',
          }}
        />
      )}

      {/* Main image with picture element for modern formats */}
      {shouldLoad && (
        <picture>
          {/* AVIF - best compression */}
          <source
            type="image/avif"
            srcSet={avifSrcSet}
            sizes={sizes}
          />

          {/* WebP - good compression, wide support */}
          <source
            type="image/webp"
            srcSet={webpSrcSet}
            sizes={sizes}
          />

          {/* Fallback to original format */}
          <img
            ref={imageRef}
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={imageClasses}
            style={{
              objectFit,
              width: '100%',
              height: '100%',
            }}
            {...props}
          />
        </picture>
      )}

      {/* Error state */}
      {imageState.isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="text-center text-gray-500">
            <svg
              className="mx-auto h-12 w-12 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
