'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Photo, Gallery } from '@/lib/supabase/types'
import Lightbox from './Lightbox'
import FavoriteButton from './FavoriteButton'
import CommentButton from './CommentButton'

interface GalleryViewProps {
  photos: Photo[]
  gallery: Gallery
}

export default function GalleryView({ photos, gallery }: GalleryViewProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (photos.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-serif text-xl text-charcoal-400">
          No photos in this gallery yet.
        </p>
      </div>
    )
  }

  return (
    <>
      <div
        className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2 md:gap-3"
        style={{ columnFill: 'balance' }}
      >
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="break-inside-avoid cursor-pointer group mb-2 md:mb-3"
            onClick={() => setSelectedIndex(index)}
          >
            <div className="relative overflow-hidden bg-charcoal-100 rounded-lg hover:shadow-luxury transition-all duration-300 hover:scale-[1.02]">
              <div className="relative w-full aspect-auto">
                <Image
                  src={photo.thumbnail_url}
                  alt={photo.filename}
                  width={400}
                  height={photo.height && photo.width ? Math.round((photo.height / photo.width) * 400) : 600}
                  className="w-full h-auto block"
                  loading={index < 12 ? 'eager' : 'lazy'}
                  quality={85}
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
              </div>
              <FavoriteButton photoId={photo.id} galleryId={gallery.id} />
              <CommentButton photoId={photo.id} galleryId={gallery.id} />
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
