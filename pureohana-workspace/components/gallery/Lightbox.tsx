'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Download, Loader2, Heart, Share2, MessageCircle } from 'lucide-react'
import type { Photo } from '@/lib/supabase/types'
import { useFavorite } from '@/hooks/useFavorite'
import CommentButton from './CommentButton'

interface LightboxProps {
  photos: Photo[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  galleryId: string
}

export default function Lightbox({ photos, currentIndex, onClose, onNext, onPrev, galleryId }: LightboxProps) {
  const currentPhoto = photos[currentIndex]
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const { isFavorited, count, toggleFavorite } = useFavorite(currentPhoto.id, galleryId)

  // Reset loading state when photo changes
  useEffect(() => {
    setIsImageLoaded(false)
  }, [currentIndex])

  // Download the FULL RESOLUTION original - ALWAYS download, never share
  const handleDownload = async () => {
    try {
      const response = await fetch(currentPhoto.original_url)
      const blob = await response.blob()

      // Standard download for all devices
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = currentPhoto.filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
      window.open(currentPhoto.original_url, '_blank')
    }
  }

  // Share photo URL
  const handleShare = async () => {
    const photoUrl = `${window.location.origin}${window.location.pathname}?photo=${currentPhoto.id}&key=${new URLSearchParams(window.location.search).get('key')}`

    if (navigator.share) {
      try {
        await navigator.share({
          url: photoUrl,
        })
      } catch (error) {
        console.log('Share cancelled or failed:', error)
      }
    } else {
      await navigator.clipboard.writeText(photoUrl)
      alert('Photo link copied to clipboard!')
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'd' || e.key === 'D') handleDownload() // Press 'D' to download
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [onClose, onNext, onPrev, currentPhoto])

  return (
    <div
      className="fixed inset-0 bg-white z-50 flex items-center justify-center"
      id="lightbox-container"
      onClick={onClose}
    >
      {/* Hidden but functional comment component */}
      <div className="hidden">
        <CommentButton photoId={currentPhoto.id} galleryId={galleryId} />
      </div>

      {/* Close button - Below header, simple black X */}
      <div className="absolute top-24 right-4 z-[70]">
        <button
          onClick={onClose}
          className="text-charcoal-900 hover:text-charcoal-600 transition-colors p-2"
          aria-label="Close"
        >
          <X className="w-8 h-8" strokeWidth={3} />
        </button>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onPrev()
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-600 hover:text-charcoal-900 transition-colors p-2 z-[70]"
        aria-label="Previous"
      >
        <ChevronLeft className="w-8 h-8" strokeWidth={2} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onNext()
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-600 hover:text-charcoal-900 transition-colors p-2 z-[70]"
        aria-label="Next"
      >
        <ChevronRight className="w-8 h-8" strokeWidth={2} />
      </button>

      {/* Image container with premium loading */}
      <div className="max-w-7xl max-h-screen p-4 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <div className="relative max-w-full max-h-[90vh]">
          {/* Loading skeleton with shimmer */}
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full max-w-4xl max-h-[80vh] bg-gradient-to-r from-charcoal-100 via-charcoal-200 to-charcoal-100 animate-shimmer bg-[length:200%_100%]" />
              <Loader2 className="absolute w-12 h-12 text-charcoal-400 animate-spin" />
            </div>
          )}

          {/* Image with smooth fade-in */}
          <Image
            src={currentPhoto.web_url}
            alt={currentPhoto.filename}
            width={currentPhoto.width || 1920}
            height={currentPhoto.height || 1280}
            className={`max-w-full max-h-[90vh] w-auto h-auto object-contain transition-opacity duration-500 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            quality={90}
            priority
            sizes="100vw"
            onLoad={() => setIsImageLoaded(true)}
          />
        </div>
      </div>

      {/* Action buttons - Bottom center */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[70]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-4 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-charcoal-200">
          <button
            onClick={toggleFavorite}
            className={`transition-colors p-2 relative ${
              isFavorited ? 'text-red-500' : 'text-charcoal-600 hover:text-red-500'
            }`}
            aria-label="Favorite Photo"
            title="Favorite"
          >
            <Heart className="w-6 h-6" fill={isFavorited ? 'currentColor' : 'none'} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-semibold text-[10px]">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              const container = document.getElementById('lightbox-container')
              const commentBtn = container?.querySelector('button[aria-label*="comment" i]') as HTMLButtonElement
              commentBtn?.click()
            }}
            className="text-charcoal-600 hover:text-charcoal-900 transition-colors p-2"
            aria-label="Comment on Photo"
            title="Comment"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <button
            onClick={handleDownload}
            className="text-charcoal-600 hover:text-charcoal-900 transition-colors p-2"
            aria-label="Download"
            title="Download original"
          >
            <Download className="w-6 h-6" />
          </button>
          <button
            onClick={handleShare}
            className="text-charcoal-600 hover:text-charcoal-900 transition-colors p-2"
            aria-label="Share"
            title="Share photo"
          >
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Photo counter - Bottom center below action buttons */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-charcoal-600 bg-charcoal-100 px-6 py-2 rounded-full font-serif text-sm z-[70]" onClick={(e) => e.stopPropagation()}>
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  )
}
