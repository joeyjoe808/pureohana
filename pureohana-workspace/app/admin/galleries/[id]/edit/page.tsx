'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Save, Upload, Loader2 } from 'lucide-react'

interface Gallery {
  id: string
  title: string
  slug: string
  description: string | null
  cover_photo_url: string | null
  access_key: string
  is_public: boolean
}

interface Photo {
  id: string
  filename: string
  web_url: string
  thumbnail_url: string
}

interface EditGalleryPageProps {
  params: Promise<{ id: string }>
}

export default function EditGalleryPage({ params }: EditGalleryPageProps) {
  const router = useRouter()
  const [galleryId, setGalleryId] = useState<string>('')
  const [gallery, setGallery] = useState<Gallery | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCoverPhotoId, setSelectedCoverPhotoId] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const resolvedParams = await params
      setGalleryId(resolvedParams.id)
      await loadGallery(resolvedParams.id)
    }
    init()
  }, [params])

  const loadGallery = async (id: string) => {
    try {
      const supabase = createClient()

      // Load gallery
      const { data: galleryData, error: galleryError } = await supabase
        .from('galleries')
        .select('*')
        .eq('id', id)
        .single()

      if (galleryError) throw galleryError

      setGallery(galleryData)
      setTitle(galleryData.title)
      setDescription(galleryData.description || '')

      // Load photos for hero image selection
      const { data: photosData, error: photosError } = await supabase
        .from('photos')
        .select('id, filename, web_url, thumbnail_url')
        .eq('gallery_id', id)
        .order('position', { ascending: true })

      if (photosError) throw photosError

      setPhotos(photosData || [])

      // Find which photo is the current cover
      if (galleryData.cover_photo_url) {
        const coverPhoto = photosData?.find(p => p.web_url === galleryData.cover_photo_url)
        if (coverPhoto) {
          setSelectedCoverPhotoId(coverPhoto.id)
        }
      }

      setLoading(false)
    } catch (err: any) {
      console.error('Error loading gallery:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!gallery) return

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()

      // Get the selected photo's web_url
      let coverPhotoUrl: string | null = null
      if (selectedCoverPhotoId) {
        const selectedPhoto = photos.find(p => p.id === selectedCoverPhotoId)
        if (selectedPhoto) {
          coverPhotoUrl = selectedPhoto.web_url
        }
      }

      // Update gallery
      const { error: updateError } = await supabase
        .from('galleries')
        .update({
          title: title.trim(),
          description: description.trim() || null,
          cover_photo_url: coverPhotoUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', gallery.id)

      if (updateError) throw updateError

      setSuccess(true)
      setTimeout(() => {
        router.push(`/admin/galleries/${gallery.id}`)
      }, 1500)
    } catch (err: any) {
      console.error('Error saving gallery:', err)
      setError(err.message)
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Container className="py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-sunset-600" />
        </div>
      </Container>
    )
  }

  if (!gallery) {
    return (
      <Container className="py-12">
        <div className="text-center">
          <p className="text-charcoal-600">Gallery not found</p>
          <Link href="/admin/galleries" className="text-sunset-600 hover:text-sunset-700 mt-4 inline-block">
            Back to Galleries
          </Link>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/admin/galleries/${gallery.id}`}
          className="inline-flex items-center gap-2 text-charcoal-600 hover:text-charcoal-900 transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          Back to Gallery
        </Link>

        <Heading level={1} className="text-2xl sm:text-3xl">Edit Gallery</Heading>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-luxury text-red-800">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-luxury text-green-800">
          Gallery updated successfully! Redirecting...
        </div>
      )}

      {/* Edit Form */}
      <div className="bg-white rounded-luxury-lg shadow-luxury p-6 sm:p-8 max-w-4xl">
        {/* Title */}
        <div className="mb-6">
          <label htmlFor="title" className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
            Gallery Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-charcoal-300 rounded-luxury focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent font-serif"
            placeholder="e.g., Smith Wedding - Maui 2024"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-charcoal-300 rounded-luxury focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent font-serif"
            placeholder="A beautiful celebration of love on the shores of Maui..."
          />
        </div>

        {/* Hero Image Selection */}
        <div className="mb-8">
          <label className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
            Hero Image
          </label>
          <p className="text-sm text-charcoal-600 mb-4">
            Select a photo to use as the landing page cover image with title overlay
          </p>

          {photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setSelectedCoverPhotoId(photo.id)}
                  className={`relative aspect-square rounded-luxury overflow-hidden transition-all ${
                    selectedCoverPhotoId === photo.id
                      ? 'ring-4 ring-sunset-500 shadow-lg'
                      : 'hover:shadow-md'
                  }`}
                >
                  <Image
                    src={photo.thumbnail_url}
                    alt={photo.filename}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  />
                  {selectedCoverPhotoId === photo.id && (
                    <div className="absolute inset-0 bg-sunset-600/20 flex items-center justify-center">
                      <div className="bg-white rounded-full p-2">
                        <Upload className="w-6 h-6 text-sunset-600" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-charcoal-50 rounded-luxury">
              <p className="text-charcoal-600 font-serif">
                No photos uploaded yet. Upload photos to select a hero image.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="flex items-center gap-2 bg-sunset-600 text-white py-2 px-6 rounded-luxury font-serif hover:bg-sunset-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>

          <Link
            href={`/admin/galleries/${gallery.id}`}
            className="flex items-center gap-2 bg-charcoal-100 text-charcoal-700 py-2 px-6 rounded-luxury font-serif hover:bg-charcoal-200 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </div>
    </Container>
  )
}
