'use client'

import { useState } from 'react'
import Lightbox from './Lightbox'
import { Photo } from '@/types/gallery'

interface GalleryGridProps {
  photos: Photo[]
}

export default function GalleryGrid({ photos }: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  return (
    <>
      <div 
        className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-1"
        style={{ columnGap: '4px' }}
      >
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="break-inside-avoid cursor-pointer group mb-1"
            onClick={() => setSelectedIndex(index)}
          >
            <div className="relative overflow-hidden bg-gray-50 hover:opacity-95 transition-opacity duration-150">
              <img
                src={photo.thumbnail_url}
                alt={photo.filename}
                className="w-full h-auto block"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNext={() => setSelectedIndex((selectedIndex + 1) % photos.length)}
          onPrev={() => setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length)}
        />
      )}
    </>
  )
}
