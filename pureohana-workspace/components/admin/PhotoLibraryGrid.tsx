'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Photo } from '@/lib/supabase/types'
import { Check, MapPin, Eye, Filter, ExternalLink } from 'lucide-react'

interface PhotoWithPlacements extends Photo {
  placements: Array<{
    section_key: string
    sort_order: number
    is_active: boolean
  }>
  galleries?: {
    id: string
    title: string
    slug: string
  }
}

interface Gallery {
  id: string
  title: string
  slug: string
}

interface PhotoLibraryGridProps {
  photos: PhotoWithPlacements[]
  galleries: Gallery[]
}

// Available sections for placement
const SECTIONS = [
  { key: 'homepage_hero', label: 'Homepage Hero', color: 'bg-purple-100 text-purple-700' },
  { key: 'homepage_grid_1', label: 'Homepage Grid 1', color: 'bg-blue-100 text-blue-700' },
  { key: 'homepage_grid_2', label: 'Homepage Grid 2', color: 'bg-blue-100 text-blue-700' },
  { key: 'homepage_grid_3', label: 'Homepage Grid 3', color: 'bg-blue-100 text-blue-700' },
  { key: 'homepage_grid_4', label: 'Homepage Grid 4', color: 'bg-blue-100 text-blue-700' },
  { key: 'portfolio', label: 'Portfolio', color: 'bg-green-100 text-green-700' },
  { key: 'about_hero', label: 'About Hero', color: 'bg-orange-100 text-orange-700' },
  { key: 'services_hero', label: 'Services Hero', color: 'bg-pink-100 text-pink-700' },
]

export function PhotoLibraryGrid({ photos: initialPhotos, galleries }: PhotoLibraryGridProps) {
  const [photos, setPhotos] = useState(initialPhotos)
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoWithPlacements | null>(null)
  const [loading, setLoading] = useState(false)
  const [filterGallery, setFilterGallery] = useState<string>('all')
  const [filterAssignment, setFilterAssignment] = useState<string>('all') // 'all', 'assigned', 'unassigned'
  const supabase = createClient()

  const handleTogglePlacement = async (photoId: string, sectionKey: string, currentlyAssigned: boolean) => {
    setLoading(true)

    if (currentlyAssigned) {
      // Remove placement
      const { error } = await supabase
        .from('photo_placements')
        .delete()
        .eq('photo_id', photoId)
        .eq('section_key', sectionKey)

      if (error) {
        console.error('Error removing placement:', error)
        alert('Failed to remove placement')
      }
    } else {
      // Add placement
      const { error } = await supabase
        .from('photo_placements')
        .insert({
          photo_id: photoId,
          section_key: sectionKey,
          sort_order: 0,
          is_active: true,
        })

      if (error) {
        console.error('Error adding placement:', error)
        alert('Failed to add placement')
      }
    }

    // Refresh photo data with gallery info
    const { data: updatedPhoto } = await supabase
      .from('photos')
      .select(`
        *,
        placements:photo_placements(section_key, sort_order, is_active),
        galleries (
          id,
          title,
          slug
        )
      `)
      .eq('id', photoId)
      .single()

    if (updatedPhoto) {
      setPhotos(prev => prev.map(p => p.id === photoId ? updatedPhoto as unknown as PhotoWithPlacements : p))
      if (selectedPhoto?.id === photoId) {
        setSelectedPhoto(updatedPhoto as unknown as PhotoWithPlacements)
      }
    }

    setLoading(false)
  }

  const getActivePlacements = (photo: PhotoWithPlacements) => {
    return photo.placements.filter(p => p.is_active)
  }

  // Filter and sort photos
  const filteredAndSortedPhotos = useMemo(() => {
    let filtered = [...photos]

    // Filter by gallery
    if (filterGallery !== 'all') {
      filtered = filtered.filter(p => p.gallery_id === filterGallery)
    }

    // Filter by assignment
    if (filterAssignment === 'assigned') {
      filtered = filtered.filter(p => p.placements.length > 0)
    } else if (filterAssignment === 'unassigned') {
      filtered = filtered.filter(p => p.placements.length === 0)
    }

    // Sort: assigned photos first, then by creation date
    return filtered.sort((a, b) => {
      const aHasPlacements = a.placements.length > 0
      const bHasPlacements = b.placements.length > 0

      if (aHasPlacements && !bHasPlacements) return -1
      if (!aHasPlacements && bHasPlacements) return 1

      // If both have or both don't have placements, sort by created_at
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [photos, filterGallery, filterAssignment])

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 bg-white rounded-luxury shadow-luxury p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-charcoal-600" />
          <h3 className="font-display text-lg text-charcoal-900">Filter Photos</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gallery Filter */}
          <div>
            <label className="block font-serif text-sm text-charcoal-600 mb-2">
              By Gallery
            </label>
            <select
              value={filterGallery}
              onChange={(e) => setFilterGallery(e.target.value)}
              className="w-full px-4 py-2 border-2 border-charcoal-200 rounded-luxury font-serif text-sm focus:outline-none focus:border-sunset-500"
            >
              <option value="all">All Galleries ({photos.length} photos)</option>
              {galleries.map(gallery => (
                <option key={gallery.id} value={gallery.id}>
                  {gallery.title} ({photos.filter(p => p.gallery_id === gallery.id).length} photos)
                </option>
              ))}
            </select>
          </div>

          {/* Assignment Filter */}
          <div>
            <label className="block font-serif text-sm text-charcoal-600 mb-2">
              By Assignment
            </label>
            <select
              value={filterAssignment}
              onChange={(e) => setFilterAssignment(e.target.value)}
              className="w-full px-4 py-2 border-2 border-charcoal-200 rounded-luxury font-serif text-sm focus:outline-none focus:border-sunset-500"
            >
              <option value="all">All Photos</option>
              <option value="assigned">Assigned Only ({photos.filter(p => p.placements.length > 0).length})</option>
              <option value="unassigned">Unassigned Only ({photos.filter(p => p.placements.length === 0).length})</option>
            </select>
          </div>
        </div>

        <p className="mt-4 font-serif text-xs text-charcoal-500">
          Showing {filteredAndSortedPhotos.length} of {photos.length} photos
          {filterAssignment === 'all' && ' • Assigned photos appear first'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Photo Grid - Left Side */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredAndSortedPhotos.map((photo) => {
              const placements = getActivePlacements(photo)
              const isSelected = selectedPhoto?.id === photo.id

              return (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className={`
                    relative group cursor-pointer rounded-luxury overflow-hidden
                    transition-all duration-200
                    ${isSelected ? 'ring-4 ring-sunset-500 shadow-xl' : 'hover:shadow-lg'}
                  `}
                >
                  {/* Photo */}
                  <div className="aspect-square relative bg-charcoal-100">
                    <Image
                      src={photo.thumbnail_url}
                      alt={photo.filename}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all">
                      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs font-serif truncate">
                          {photo.filename}
                        </p>
                      </div>
                    </div>

                    {/* Placement Count Badge */}
                    {placements.length > 0 && (
                      <div className="absolute top-2 right-2 bg-sunset-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <MapPin size={12} />
                        {placements.length}
                      </div>
                    )}
                  </div>

                  {/* Gallery Name & Placement Tags */}
                  <div className="p-2 bg-white">
                    {/* Gallery Name with Link */}
                    {photo.galleries && (
                      <div className="mb-2">
                        <Link
                          href={`/galleries/${photo.galleries.slug}?key=${photo.gallery_id}`}
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs text-charcoal-500 hover:text-sunset-600 transition-colors group/link"
                        >
                          <span className="truncate">{photo.galleries.title}</span>
                          <ExternalLink size={10} className="flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </Link>
                      </div>
                    )}

                    {/* Placement Tags */}
                    {placements.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {placements.slice(0, 2).map((placement) => {
                          const section = SECTIONS.find(s => s.key === placement.section_key)
                          return (
                            <span
                              key={placement.section_key}
                              className={`text-[10px] px-2 py-0.5 rounded-full ${section?.color || 'bg-gray-100 text-gray-700'}`}
                            >
                              {section?.label || placement.section_key}
                            </span>
                          )
                        })}
                        {placements.length > 2 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            +{placements.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {filteredAndSortedPhotos.length === 0 && (
            <div className="text-center py-16">
              <p className="font-serif text-charcoal-400">
                No photos match your filters
              </p>
            </div>
          )}
        </div>

        {/* Placement Manager - Right Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            {selectedPhoto ? (
              <div className="bg-white rounded-luxury shadow-luxury p-6">
                <h3 className="font-display text-xl text-charcoal-900 mb-4">
                  Assign to Sections
                </h3>

                {/* Selected Photo Preview */}
                <div className="mb-6 rounded-luxury overflow-hidden">
                  <div className="aspect-square relative">
                    <Image
                      src={selectedPhoto.web_url}
                      alt={selectedPhoto.filename}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                  <p className="mt-2 font-serif text-sm text-charcoal-600 truncate">
                    {selectedPhoto.filename}
                  </p>

                  {/* Gallery Link */}
                  {selectedPhoto.galleries && (
                    <Link
                      href={`/galleries/${selectedPhoto.galleries.slug}?key=${selectedPhoto.gallery_id}`}
                      target="_blank"
                      className="mt-1 flex items-center gap-1 text-xs text-sunset-600 hover:text-sunset-700 transition-colors"
                    >
                      <span>View in {selectedPhoto.galleries.title}</span>
                      <ExternalLink size={12} />
                    </Link>
                  )}
                </div>

                {/* Section Checkboxes */}
                <div className="space-y-3">
                  {SECTIONS.map((section) => {
                    const isAssigned = selectedPhoto.placements.some(
                      p => p.section_key === section.key && p.is_active
                    )

                    return (
                      <label
                        key={section.key}
                        className={`
                          flex items-center gap-3 p-3 rounded-luxury border-2 cursor-pointer
                          transition-all
                          ${isAssigned
                            ? 'border-sunset-500 bg-sunset-50'
                            : 'border-charcoal-200 hover:border-charcoal-300'
                          }
                          ${loading ? 'opacity-50 cursor-wait' : ''}
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={isAssigned}
                          onChange={() => handleTogglePlacement(selectedPhoto.id, section.key, isAssigned)}
                          disabled={loading}
                          className="hidden"
                        />

                        {/* Custom Checkbox */}
                        <div className={`
                          w-5 h-5 rounded flex items-center justify-center
                          ${isAssigned ? 'bg-sunset-600' : 'bg-white border-2 border-charcoal-300'}
                        `}>
                          {isAssigned && <Check size={14} className="text-white" />}
                        </div>

                        <span className="font-serif text-sm text-charcoal-900 flex-1">
                          {section.label}
                        </span>

                        <span className={`text-xs px-2 py-0.5 rounded-full ${section.color}`}>
                          {section.key.split('_')[0]}
                        </span>
                      </label>
                    )
                  })}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-luxury">
                  <p className="font-serif text-xs text-blue-800">
                    💡 <strong>Tip:</strong> Photos can appear in multiple sections. Changes update the website in real-time.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-luxury shadow-luxury p-12 text-center">
                <Eye size={48} className="mx-auto text-charcoal-300 mb-4" />
                <p className="font-serif text-charcoal-600">
                  Click a photo to assign it to website sections
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
