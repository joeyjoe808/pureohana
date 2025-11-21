'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { X, Check, Search } from 'lucide-react'

interface Photo {
  id: string
  filename: string
  web_url: string
  thumbnail_url: string
}

interface PhotoPickerProps {
  onSelect: (url: string) => void
  currentUrl?: string
  onClose: () => void
}

export function PhotoPicker({ onSelect, currentUrl, onClose }: PhotoPickerProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUrl, setSelectedUrl] = useState(currentUrl || '')

  useEffect(() => {
    const fetchPhotos = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('photos')
        .select('id, filename, web_url, thumbnail_url')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setPhotos(data)
      }
      setLoading(false)
    }

    fetchPhotos()
  }, [])

  const filteredPhotos = photos.filter(photo =>
    photo.filename.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = () => {
    onSelect(selectedUrl)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-luxury-lg shadow-luxury max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-charcoal-200 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl text-charcoal-900">Choose Cover Photo</h2>
            <p className="font-serif text-sm text-charcoal-600 mt-1">
              Select a photo from your library
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-charcoal-100 rounded-luxury transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-charcoal-200">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search photos by filename..."
              className="w-full pl-12 pr-4 py-3 border border-charcoal-200 rounded-luxury focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent font-serif"
            />
          </div>
        </div>

        {/* Photo Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-sunset-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="font-serif text-charcoal-600">Loading photos...</p>
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-serif text-charcoal-600">
                {searchTerm ? 'No photos found matching your search' : 'No photos uploaded yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPhotos.map((photo) => {
                const isSelected = selectedUrl === photo.web_url

                return (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedUrl(photo.web_url)}
                    className={`
                      relative aspect-square rounded-luxury overflow-hidden cursor-pointer
                      transition-all duration-200
                      ${isSelected
                        ? 'ring-4 ring-sunset-500 shadow-xl'
                        : 'hover:shadow-lg hover:scale-105'
                      }
                    `}
                  >
                    <Image
                      src={photo.thumbnail_url}
                      alt={photo.filename}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />

                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-sunset-500/20 flex items-center justify-center">
                        <div className="bg-sunset-600 text-white rounded-full p-2">
                          <Check size={24} />
                        </div>
                      </div>
                    )}

                    {/* Filename Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-white text-xs font-serif truncate">
                        {photo.filename}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-charcoal-200 flex items-center justify-between">
          <p className="font-serif text-sm text-charcoal-600">
            {selectedUrl ? 'Photo selected' : 'Select a photo to continue'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-charcoal-200 text-charcoal-700 rounded-luxury font-serif font-medium hover:border-charcoal-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedUrl}
              className="px-6 py-3 bg-sunset-600 text-white rounded-luxury font-serif font-medium hover:bg-sunset-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Use This Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
