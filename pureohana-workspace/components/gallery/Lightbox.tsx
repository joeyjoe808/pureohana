'use client'

import { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Photo } from '@/lib/supabase/types'

interface LightboxProps {
  photos: Photo[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

export default function Lightbox({ photos, currentIndex, onClose, onNext, onPrev }: LightboxProps) {
  const currentPhoto = photos[currentIndex]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [onClose, onNext, onPrev])

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-cream-200 transition-colors z-50 p-2 rounded-full hover:bg-white/10"
        aria-label="Close"
      >
        <X className="w-8 h-8" />
      </button>

      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-cream-200 transition-all bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 shadow-luxury"
        aria-label="Previous"
      >
        <ChevronLeft className="w-8 h-8" strokeWidth={2} />
      </button>

      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-cream-200 transition-all bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 shadow-luxury"
        aria-label="Next"
      >
        <ChevronRight className="w-8 h-8" strokeWidth={2} />
      </button>

      <div className="max-w-7xl max-h-screen p-4 flex items-center justify-center">
        <img
          src={currentPhoto.original_url}
          alt={currentPhoto.filename}
          className="max-w-full max-h-[90vh] object-contain shadow-luxury"
        />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full font-serif text-sm">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  )
}
