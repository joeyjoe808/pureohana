'use client'

import { useState } from 'react'
import { X, Play } from 'lucide-react'

interface Video {
  id: string
  youtube_url: string
  title: string
  video_type: string
}

interface VideoGalleryProps {
  videos: Video[]
}

// Extract YouTube video ID from various URL formats
function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

// Get YouTube thumbnail URL
function getYouTubeThumbnail(videoId: string): string {
  // maxresdefault gives highest quality, falls back to hqdefault
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

export default function VideoGallery({ videos }: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  if (!videos || videos.length === 0) return null

  const openModal = (video: Video) => {
    setSelectedVideo(video)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedVideo(null)
    document.body.style.overflow = ''
  }

  return (
    <>
      {/* Video Thumbnails Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <h2 className="text-2xl font-extralight tracking-wider text-center mb-2 font-display text-gray-900">
            Wedding Video Samples
          </h2>
          <div className="w-20 h-[1px] bg-gray-300 mx-auto mb-10"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video) => {
              const videoId = getYouTubeId(video.youtube_url)
              if (!videoId) return null

              return (
                <div
                  key={video.id}
                  className="cursor-pointer group"
                  onClick={() => openModal(video)}
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                    <img
                      src={getYouTubeThumbnail(videoId)}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback to hqdefault if maxresdefault doesn't exist
                        const target = e.target as HTMLImageElement
                        if (target.src.includes('maxresdefault')) {
                          target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                        }
                      }}
                    />
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all duration-300">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="mt-3">
                    <h3 className="font-serif text-sm text-gray-900 line-clamp-2 group-hover:text-sunset-600 transition-colors">
                      {video.title}
                    </h3>
                    <p className="font-sans text-xs text-gray-500 mt-1">
                      {video.video_type}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-serif text-lg text-gray-900 pr-8 line-clamp-1">
                {selectedVideo.title}
              </h3>
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close video"
              >
                <X size={24} />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(selectedVideo.youtube_url)}?autoplay=1&rel=0`}
                title={selectedVideo.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
