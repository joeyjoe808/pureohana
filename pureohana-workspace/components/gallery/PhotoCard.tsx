'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, Download, Share2, MessageCircle } from 'lucide-react'
import type { Photo } from '@/lib/supabase/types'
import { useFavorite } from '@/hooks/useFavorite'
import CommentButton from './CommentButton'

interface PhotoCardProps {
  photo: Photo
  galleryId: string
  index: number
  isLoaded: boolean
  onImageLoad: (photoId: string) => void
  onPhotoClick: () => void
  onDownload: (photo: Photo) => void
  onShare: (photo: Photo) => void
}

export default function PhotoCard({
  photo,
  galleryId,
  index,
  isLoaded,
  onImageLoad,
  onPhotoClick,
  onDownload,
  onShare
}: PhotoCardProps) {
  const { isFavorited, count, toggleFavorite } = useFavorite(photo.id, galleryId)

  return (
    <div className="cursor-pointer group mb-1 break-inside-avoid">
      <div className="relative overflow-hidden bg-charcoal-100" id={`photo-${photo.id}`}>
        {/* Skeleton loader with shimmer */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-100 via-charcoal-200 to-charcoal-100 animate-shimmer bg-[length:200%_100%] min-h-[200px]" />
        )}

        {/* Next.js Image with natural aspect ratio - optimized for masonry */}
        <div onClick={onPhotoClick}>
          <Image
            src={photo.thumbnail_url}
            alt={photo.filename}
            width={400}
            height={400}
            className={`w-full h-auto transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading={index < 12 ? 'eager' : 'lazy'}
            quality={85}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            style={{ width: '100%', height: 'auto' }}
            onLoad={() => onImageLoad(photo.id)}
          />
        </div>

        {/* Hidden but functional comment component */}
        <div className="hidden">
          <CommentButton photoId={photo.id} galleryId={galleryId} />
        </div>

        {/* Pixieset-style hover icons at bottom right */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex items-center justify-end gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite()
            }}
            className={`transition-colors ${
              isFavorited ? 'text-red-400' : 'text-white hover:text-red-400'
            }`}
            title="Favorite"
          >
            <Heart className="w-5 h-5" fill={isFavorited ? 'currentColor' : 'none'} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-semibold text-[10px]">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              const container = document.getElementById(`photo-${photo.id}`)
              const commentBtn = container?.querySelector('button[aria-label*="comment" i]') as HTMLButtonElement
              commentBtn?.click()
            }}
            className="text-white hover:text-cream-200 transition-colors"
            title="Comment"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDownload(photo)
            }}
            className="text-white hover:text-cream-200 transition-colors"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onShare(photo)
            }}
            className="text-white hover:text-cream-200 transition-colors"
            title="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
