/**
 * SkeletonLoader Components
 *
 * Loading state components for various content types:
 * - Image gallery skeletons
 * - Blog post skeletons
 * - Card skeletons
 * - Text skeletons
 *
 * Provides smooth loading states with animated shimmer effect
 * to improve perceived performance while content loads.
 */

import React from 'react';

interface SkeletonProps {
  className?: string;
  shimmer?: boolean;
}

/**
 * Base skeleton component with shimmer animation
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  shimmer = true
}) => {
  return (
    <div
      className={`
        bg-gray-200 rounded
        ${shimmer ? 'animate-pulse' : ''}
        ${className}
      `}
      aria-hidden="true"
    />
  );
};

/**
 * Skeleton for image with aspect ratio
 */
export const ImageSkeleton: React.FC<{
  aspectRatio?: string;
  className?: string;
}> = ({ aspectRatio = '16/9', className = '' }) => {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg ${className}`}
      style={{ aspectRatio }}
    >
      <Skeleton className="absolute inset-0" />
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          className="w-12 h-12 text-gray-300"
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
      </div>
    </div>
  );
};

/**
 * Gallery skeleton with grid layout
 */
export const GallerySkeleton: React.FC<{
  itemCount?: number;
  columns?: number;
  aspectRatio?: string;
}> = ({ itemCount = 12, columns = 3, aspectRatio = '4/3' }) => {
  return (
    <div
      className="grid gap-4 md:gap-6"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: itemCount }).map((_, idx) => (
        <ImageSkeleton key={idx} aspectRatio={aspectRatio} />
      ))}
    </div>
  );
};

/**
 * Blog post card skeleton
 */
export const BlogCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg">
      <ImageSkeleton aspectRatio="16/9" className="rounded-none" />
      <div className="p-6 space-y-4">
        {/* Category and date */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Title */}
        <Skeleton className="h-6 w-3/4" />

        {/* Excerpt */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>

        {/* Read more button */}
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </div>
  );
};

/**
 * Blog post list skeleton
 */
export const BlogListSkeleton: React.FC<{ count?: number }> = ({
  count = 6
}) => {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, idx) => (
        <BlogCardSkeleton key={idx} />
      ))}
    </div>
  );
};

/**
 * Portfolio item skeleton
 */
export const PortfolioCardSkeleton: React.FC = () => {
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-lg">
      <ImageSkeleton aspectRatio="4/3" className="rounded-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
          <Skeleton className="h-6 w-2/3 bg-white/20" />
          <Skeleton className="h-4 w-1/2 bg-white/20" />
        </div>
      </div>
    </div>
  );
};

/**
 * Service card skeleton
 */
export const ServiceCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-8 shadow-lg">
      {/* Icon */}
      <Skeleton className="h-16 w-16 rounded-full mb-6" />

      {/* Title */}
      <Skeleton className="h-7 w-3/4 mb-4" />

      {/* Description */}
      <div className="space-y-2 mb-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>

      {/* Features list */}
      <div className="space-y-2">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>

      {/* Button */}
      <Skeleton className="h-12 w-full rounded-full mt-6" />
    </div>
  );
};

/**
 * Text skeleton for paragraphs
 */
export const TextSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, idx) => (
        <Skeleton
          key={idx}
          className={`h-4 ${
            idx === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

/**
 * Testimonial skeleton
 */
export const TestimonialSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-8 shadow-lg">
      {/* Stars */}
      <div className="flex space-x-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Skeleton key={star} className="h-5 w-5" />
        ))}
      </div>

      {/* Quote */}
      <TextSkeleton lines={4} />

      {/* Author */}
      <div className="flex items-center space-x-4 mt-6">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
};

/**
 * Hero section skeleton
 */
export const HeroSkeleton: React.FC = () => {
  return (
    <div className="relative h-screen">
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
          <Skeleton className="h-16 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
          <div className="flex justify-center space-x-4 mt-8">
            <Skeleton className="h-12 w-32 rounded-full" />
            <Skeleton className="h-12 w-32 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Navigation skeleton
 */
export const NavSkeleton: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Skeleton className="h-8 w-32" />

          {/* Nav items */}
          <div className="hidden md:flex space-x-8">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} className="h-4 w-20" />
            ))}
          </div>

          {/* CTA */}
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>
    </nav>
  );
};

/**
 * Table skeleton
 */
export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number
}> = ({
  rows = 5,
  columns = 4
}) => {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: columns }).map((_, idx) => (
              <th key={idx} className="px-6 py-3">
                <Skeleton className="h-4 w-24" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx} className="px-6 py-4">
                  <Skeleton className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Page skeleton (full page loading state)
 */
export const PageSkeleton: React.FC<{
  includeNav?: boolean;
  includeHero?: boolean;
}> = ({
  includeNav = true,
  includeHero = false
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {includeNav && <NavSkeleton />}
      {includeHero && <HeroSkeleton />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          <TextSkeleton lines={5} />
          <GallerySkeleton />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
