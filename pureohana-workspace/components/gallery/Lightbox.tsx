'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react'
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

  // Download the FULL RESOLUTION original
  const handleDownload = async () => {
    try {
      const response = await fetch(currentPhoto.original_url)
      const blob = await response.blob()

      // iOS/Safari: Use Web Share API to save to Photos app
      if (navigator.canShare && navigator.share) {
        try {
          // Create a File object from the blob
          const file = new File([blob], currentPhoto.filename, { type: blob.type })

          // Check if we can share files
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: currentPhoto.filename,
              text: 'Download full resolution photo'
            })
            return // Successfully shared, exit
          }
        } catch (shareError) {
          console.log('Share API not supported or user cancelled:', shareError)
          // Fall through to standard download
        }
      }

      // Desktop/Standard download: Create blob URL and trigger download
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
      // Fallback: open in new tab
      window.open(currentPhoto.original_url, '_blank')
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
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-cream-200 transition-colors z-50 p-2 rounded-full hover:bg-white/10"
        aria-label="Close"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Download button - Downloads FULL RESOLUTION original */}
      <button
        onClick={handleDownload}
        className="absolute top-4 left-4 text-white hover:text-cream-200 transition-all z-50 bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 shadow-luxury flex items-center gap-2"
        aria-label="Download full resolution"
        title="Download original full-resolution image"
      >
        <Download className="w-6 h-6" />
        <span className="hidden sm:inline font-serif text-sm">Download Original</span>
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
        <div className="relative max-w-full max-h-[90vh]">
          <Image
            src={currentPhoto.web_url}
            alt={currentPhoto.filename}
            width={currentPhoto.width || 1920}
            height={currentPhoto.height || 1280}
            className="max-w-full max-h-[90vh] w-auto h-auto object-contain shadow-luxury"
            quality={90}
            priority
            sizes="100vw"
          />
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full font-serif text-sm">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  )
}
