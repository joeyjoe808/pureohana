'use client'

import CartButton from '../cart/CartButton'

interface GalleryHeaderProps {
  title: string
  description: string | null
  photoCount: number
  viewCount: number
}

export default function GalleryHeader({ 
  title, 
  description, 
  photoCount, 
  viewCount 
}: GalleryHeaderProps) {
  return (
    <div className="border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        {/* Cart Button - Fixed Position */}
        <div className="fixed top-6 right-6 z-30">
          <CartButton />
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-4 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-gray-500 mb-6 font-light">
              {description}
            </p>
          )}
          <div className="flex items-center justify-center gap-8 text-xs uppercase tracking-wider text-gray-400">
            <span>{photoCount} Photos</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>{viewCount} Views</span>
          </div>
        </div>
      </div>
    </div>
  )
}
