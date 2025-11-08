'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Download, Loader2, Heart, Share2, MessageCircle } from 'lucide-react'
import JSZip from 'jszip'
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
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [isDownloadingAll, setIsDownloadingAll] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 })
  const [showProgressBar, setShowProgressBar] = useState(true)

  const handleImageLoad = (photoId: string) => {
    setLoadedImages(prev => new Set(prev).add(photoId))
  }

  const loadingProgress = (loadedImages.size / photos.length) * 100
  const isFullyLoaded = loadedImages.size === photos.length

  // Hide progress bar 800ms after completion for smooth iOS-like experience
  useEffect(() => {
    if (isFullyLoaded) {
      const timer = setTimeout(() => setShowProgressBar(false), 800)
      return () => clearTimeout(timer)
    }
  }, [isFullyLoaded])

  // Download single photo
  const handleDownloadPhoto = async (photo: Photo) => {
    try {
      const response = await fetch(photo.original_url)
      const blob = await response.blob()

      // iOS/Safari: Use Web Share API
      if (navigator.canShare && navigator.share) {
        const file = new File([blob], photo.filename, { type: blob.type })
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: photo.filename,
          })
          return
        }
      }

      // Desktop: Standard download
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = photo.filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  // Share photo URL
  const handleSharePhoto = async (photo: Photo) => {
    const photoUrl = `${window.location.origin}${window.location.pathname}?photo=${photo.id}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.filename,
          text: 'Check out this photo',
          url: photoUrl,
        })
      } catch (error) {
        console.log('Share cancelled or failed:', error)
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(photoUrl)
      alert('Photo link copied to clipboard!')
    }
  }

  // Download all photos as ZIP
  const handleDownloadAll = async () => {
    setIsDownloadingAll(true)
    setDownloadProgress({ current: 0, total: photos.length })

    try {
      const zip = new JSZip()
      const folder = zip.folder(gallery.title || 'gallery')

      if (!folder) {
        throw new Error('Failed to create ZIP folder')
      }

      // Download all full-resolution images
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i]
        setDownloadProgress({ current: i + 1, total: photos.length })

        try {
          const response = await fetch(photo.original_url)
          const blob = await response.blob()
          folder.file(photo.filename, blob)
        } catch (error) {
          console.error(`Failed to download ${photo.filename}:`, error)
        }
      }

      // Generate and download ZIP
      const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
        // Optional: track ZIP generation progress
        console.log(`ZIP progress: ${metadata.percent.toFixed(0)}%`)
      })

      const url = window.URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = url
      a.download = `${gallery.title || 'gallery'}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download all failed:', error)
      alert('Failed to download gallery. Please try again.')
    } finally {
      setIsDownloadingAll(false)
      setDownloadProgress({ current: 0, total: 0 })
    }
  }

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
      {/* Premium loading progress bar - iOS-style with completion state */}
      {showProgressBar && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-charcoal-100 transition-opacity duration-500" style={{ opacity: showProgressBar ? 1 : 0 }}>
          <div
            className="h-full bg-gradient-to-r from-cream-600 via-gold-500 to-cream-600 transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
      )}

      {/* Pixieset-style masonry - CSS columns, preserves original aspect ratios */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-1">
        {photos.map((photo, index) => {
          const isLoaded = loadedImages.has(photo.id)

          return (
            <div
              key={photo.id}
              className="cursor-pointer group mb-1 break-inside-avoid"
            >
              <div className="relative overflow-hidden bg-charcoal-100" id={`photo-${photo.id}`}>
                {/* Skeleton loader with shimmer */}
                {!isLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-r from-charcoal-100 via-charcoal-200 to-charcoal-100 animate-shimmer bg-[length:200%_100%] min-h-[200px]" />
                )}

                {/* Next.js Image with natural aspect ratio - optimized for masonry */}
                <div onClick={() => setSelectedIndex(index)}>
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
                    onLoad={() => handleImageLoad(photo.id)}
                  />
                </div>

                {/* Hidden but functional favorite and comment components */}
                <div className="hidden">
                  <FavoriteButton photoId={photo.id} galleryId={gallery.id} />
                  <CommentButton photoId={photo.id} galleryId={gallery.id} />
                </div>

                {/* Pixieset-style hover icons at bottom right */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex items-center justify-end gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      const container = document.getElementById(`photo-${photo.id}`)
                      const favoriteBtn = container?.querySelector('button[aria-label*="avorite"]') as HTMLButtonElement
                      favoriteBtn?.click()
                    }}
                    className="text-white hover:text-red-400 transition-colors"
                    title="Favorite"
                  >
                    <Heart className="w-5 h-5" />
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
                      handleDownloadPhoto(photo)
                    }}
                    className="text-white hover:text-cream-200 transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSharePhoto(photo)
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
        })}
      </div>

      {/* Download All Button - Fixed position */}
      <button
        onClick={handleDownloadAll}
        disabled={isDownloadingAll}
        className="fixed bottom-6 right-6 bg-charcoal-900 hover:bg-charcoal-800 text-cream-50 px-6 py-3 rounded-full shadow-luxury-lg hover:shadow-luxury-xl transition-all duration-300 flex items-center gap-2 font-serif text-sm disabled:opacity-50 disabled:cursor-not-allowed z-40"
        title="Download all full-resolution photos as ZIP"
      >
        {isDownloadingAll ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Downloading {downloadProgress.current} of {downloadProgress.total}...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Download All ({photos.length} photos)</span>
          </>
        )}
      </button>

      {/* Download Progress Modal */}
      {isDownloadingAll && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-cream-50 rounded-lg shadow-luxury-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-charcoal-900 animate-spin mx-auto mb-4" />
              <h3 className="font-serif text-2xl text-charcoal-900 mb-2">
                Preparing Your Gallery
              </h3>
              <p className="text-charcoal-600 mb-4">
                Downloading full-resolution photos...
              </p>

              {/* Progress bar */}
              <div className="w-full bg-charcoal-200 rounded-full h-3 mb-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cream-600 via-gold-500 to-cream-600 transition-all duration-300"
                  style={{ width: `${(downloadProgress.current / downloadProgress.total) * 100}%` }}
                />
              </div>

              <p className="text-sm text-charcoal-500">
                {downloadProgress.current} of {downloadProgress.total} photos
              </p>

              <p className="text-xs text-charcoal-400 mt-4">
                This may take a moment for large galleries...
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={selectedIndex}
          galleryId={gallery.id}
          onClose={() => setSelectedIndex(null)}
          onNext={() => setSelectedIndex((selectedIndex + 1) % photos.length)}
          onPrev={() => setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length)}
        />
      )}
    </>
  )
}
