'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Upload, Trash2, AlertCircle, Eye, Settings, Link2, Check } from 'lucide-react'

interface Photo {
  id: string
  filename: string
  web_url: string
  thumbnail_url: string
  original_url?: string
  storage_path?: string
  created_at: string
}

interface Gallery {
  id: string
  title: string
  slug: string
  description: string | null
  access_key: string
  is_public: boolean
}

interface GalleryPageProps {
  params: Promise<{ id: string }>
}

export default function GalleryDetailPage({ params }: GalleryPageProps) {
  const router = useRouter()
  const [galleryId, setGalleryId] = useState<string>('')
  const [gallery, setGallery] = useState<Gallery | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [linkCopied, setLinkCopied] = useState(false)

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

      // Fetch gallery details
      const { data: galleryData, error: galleryError } = await supabase
        .from('galleries')
        .select('*')
        .eq('id', id)
        .single()

      if (galleryError || !galleryData) {
        setError('Gallery not found')
        setLoading(false)
        return
      }

      setGallery(galleryData)

      // Fetch photos in this gallery
      const { data: photosData, error: photosError } = await supabase
        .from('photos')
        .select('*')
        .eq('gallery_id', id)
        .order('created_at', { ascending: false })

      if (!photosError && photosData) {
        setPhotos(photosData)
      }

      setLoading(false)
    } catch (err: any) {
      console.error('Error loading gallery:', err)
      setError(err.message || 'Failed to load gallery')
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !gallery) return

    setUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('You must be logged in to upload photos')
      }

      const totalFiles = files.length
      let uploadedCount = 0

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('gallery-photos')
          .upload(filePath, file)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          throw uploadError
        }

        // Get public URLs
        const { data: { publicUrl } } = supabase.storage
          .from('gallery-photos')
          .getPublicUrl(filePath)

        // Insert photo record
        const { error: dbError } = await supabase
          .from('photos')
          .insert({
            gallery_id: gallery.id,
            filename: file.name,
            original_url: publicUrl,
            web_url: publicUrl,
            thumbnail_url: publicUrl,
            position: uploadedCount + 1,
            is_public_portfolio: false,
          })

        if (dbError) {
          console.error('Database error:', dbError)
          throw dbError
        }

        uploadedCount++
        setUploadProgress((uploadedCount / totalFiles) * 100)
      }

      // Reload photos
      await loadGallery(galleryId)
      setUploading(false)
      setUploadProgress(0)

      // Reset file input
      e.target.value = ''
    } catch (err: any) {
      console.error('Error uploading photos:', err)
      setError(err.message || 'Failed to upload photos')
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDeletePhoto = async (photo: Photo) => {
    if (!confirm(`Are you sure you want to delete "${photo.filename}"? This action cannot be undone and will remove the photo from Supabase storage.`)) {
      return
    }

    try {
      const supabase = createClient()

      // Extract storage path from URL
      // URL format: https://[project].supabase.co/storage/v1/object/public/gallery-photos/[path]
      if (photo.original_url) {
        try {
          const url = new URL(photo.original_url)
          const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/gallery-photos\/(.+)/)
          if (pathMatch && pathMatch[1]) {
            const storagePath = decodeURIComponent(pathMatch[1])
            const { error: storageError } = await supabase.storage
              .from('gallery-photos')
              .remove([storagePath])

            if (storageError) {
              console.error('Storage deletion error:', storageError)
            }
          }
        } catch (urlError) {
          console.error('Error parsing storage URL:', urlError)
        }
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photo.id)

      if (dbError) {
        throw new Error(`Failed to delete photo: ${dbError.message}`)
      }

      // Update local state
      setPhotos(photos.filter(p => p.id !== photo.id))
    } catch (err: any) {
      console.error('Error deleting photo:', err)
      setError(err.message || 'Failed to delete photo')
    }
  }

  const copyGalleryLink = async () => {
    if (!gallery) return

    const baseUrl = window.location.origin
    const galleryUrl = `${baseUrl}/galleries/${gallery.slug}?key=${gallery.access_key}`

    try {
      await navigator.clipboard.writeText(galleryUrl)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
      alert('Failed to copy link. Please copy manually.')
    }
  }

  if (loading) {
    return (
      <Container className="py-12">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-sunset-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-charcoal-600">Loading gallery...</p>
        </div>
      </Container>
    )
  }

  if (error && !gallery) {
    return (
      <Container className="py-12">
        <div className="bg-red-50 border-2 border-red-200 rounded-luxury p-6">
          <p className="font-serif text-red-900">{error}</p>
          <Link href="/admin/galleries" className="text-sunset-600 hover:underline mt-2 inline-block">
            ← Back to galleries
          </Link>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-8 sm:py-12">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Link
          href="/admin/galleries"
          className="inline-flex items-center gap-2 text-sunset-600 hover:text-sunset-700 font-serif mb-4 text-sm sm:text-base"
        >
          <ArrowLeft size={18} className="flex-shrink-0" />
          <span className="truncate">Back to galleries</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Heading level={1} className="mb-2 text-xl sm:text-2xl lg:text-3xl break-words">
              {gallery?.title}
            </Heading>
            <p className="font-serif text-charcoal-600 mb-2 text-sm sm:text-base truncate">
              /{gallery?.slug}
            </p>
            {gallery?.description && (
              <p className="font-serif text-charcoal-600 text-sm sm:text-base max-w-2xl line-clamp-3 sm:line-clamp-none">
                {gallery.description}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:flex-shrink-0">
            <button
              onClick={copyGalleryLink}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-sunset-600 text-white rounded-luxury font-serif text-sm hover:bg-sunset-700 transition-colors whitespace-nowrap"
            >
              {linkCopied ? (
                <>
                  <Check size={16} className="flex-shrink-0" />
                  <span className="hidden xs:inline">Link Copied!</span>
                  <span className="xs:hidden">Copied!</span>
                </>
              ) : (
                <>
                  <Link2 size={16} className="flex-shrink-0" />
                  <span className="hidden xs:inline">Copy Gallery Link</span>
                  <span className="xs:hidden">Copy Link</span>
                </>
              )}
            </button>
            <Link
              href={`/galleries/${gallery?.slug}?key=${gallery?.access_key}`}
              target="_blank"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-charcoal-300 text-charcoal-700 rounded-luxury font-serif text-sm hover:bg-charcoal-50 transition-colors whitespace-nowrap"
            >
              <Eye size={16} className="flex-shrink-0" />
              Preview
            </Link>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-luxury p-4 mb-6 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-serif text-red-900 font-medium">Error</p>
            <p className="font-serif text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-luxury shadow-luxury p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="min-w-0">
            <h2 className="font-display text-lg sm:text-xl text-charcoal-900 mb-1">Upload Photos</h2>
            <p className="font-serif text-xs sm:text-sm text-charcoal-600">
              Add photos to this gallery
            </p>
          </div>
          <label className="inline-flex items-center justify-center gap-2 bg-sunset-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-luxury font-serif font-medium hover:bg-sunset-700 transition-colors cursor-pointer whitespace-nowrap">
            <Upload size={18} className="flex-shrink-0" />
            {uploading ? 'Uploading...' : 'Choose Files'}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {uploading && (
          <div className="w-full bg-charcoal-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-sunset-600 h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Gallery Link */}
      <div className="bg-white rounded-luxury shadow-luxury p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="mb-4">
          <h3 className="font-display text-base sm:text-lg text-charcoal-900 mb-2">Client Gallery Link</h3>
          <p className="font-serif text-xs sm:text-sm text-charcoal-600 mb-4">
            Share this link with your client to give them access to the gallery
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-cream-50 p-3 sm:p-4 rounded-luxury border border-charcoal-200">
            <code className="flex-1 font-mono text-xs sm:text-sm text-charcoal-900 break-all min-w-0 overflow-x-auto">
              {typeof window !== 'undefined' && gallery ? `${window.location.origin}/galleries/${gallery.slug}?key=${gallery.access_key}` : 'Loading...'}
            </code>
            <button
              onClick={copyGalleryLink}
              className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-sunset-600 text-white rounded-luxury font-serif text-xs sm:text-sm hover:bg-sunset-700 transition-colors whitespace-nowrap"
            >
              {linkCopied ? (
                <>
                  <Check size={16} className="flex-shrink-0" />
                  Copied
                </>
              ) : (
                <>
                  <Link2 size={16} className="flex-shrink-0" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-luxury shadow-luxury p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <p className="font-serif text-xs sm:text-sm text-charcoal-600 mb-1">Total Photos</p>
            <p className="font-display text-2xl sm:text-3xl text-charcoal-900">{photos.length}</p>
          </div>
          <div>
            <p className="font-serif text-xs sm:text-sm text-charcoal-600 mb-1">Gallery Status</p>
            <span className={`inline-block px-3 py-1 rounded-full font-serif text-xs sm:text-sm whitespace-nowrap ${
              gallery?.is_public
                ? 'bg-green-100 text-green-700'
                : 'bg-charcoal-100 text-charcoal-700'
            }`}>
              {gallery?.is_public ? 'Public' : 'Private'}
            </span>
          </div>
          <div>
            <p className="font-serif text-xs sm:text-sm text-charcoal-600 mb-1">Access Key</p>
            <code className="font-mono text-xs sm:text-sm text-charcoal-900 break-all">{gallery?.access_key}</code>
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      {photos.length > 0 ? (
        <div>
          <h2 className="font-display text-lg sm:text-xl text-charcoal-900 mb-4">
            Photos ({photos.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-square rounded-luxury overflow-hidden group bg-charcoal-100"
              >
                <Image
                  src={photo.thumbnail_url}
                  alt={photo.filename}
                  fill
                  className="object-cover"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 flex items-center justify-center">
                  <button
                    onClick={() => handleDeletePhoto(photo)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white p-3 rounded-full hover:bg-red-700"
                    title="Delete photo"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Filename */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-serif truncate">{photo.filename}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-luxury shadow-luxury p-8 sm:p-12 text-center">
          <Upload size={48} className="text-charcoal-300 mx-auto mb-4" />
          <Heading level={2} className="mb-2 text-lg sm:text-xl lg:text-2xl">No photos yet</Heading>
          <p className="font-serif text-charcoal-600 mb-6 text-sm sm:text-base">
            Upload photos to this gallery to get started
          </p>
          <label className="inline-flex items-center justify-center gap-2 bg-sunset-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-luxury font-serif font-medium hover:bg-sunset-700 transition-colors cursor-pointer">
            <Upload size={18} className="flex-shrink-0" />
            <span className="whitespace-nowrap">Upload First Photo</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      )}
    </Container>
  )
}
