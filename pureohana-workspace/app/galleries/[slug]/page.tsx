import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase'
import type { Photo, Gallery } from '@/lib/supabase'
import type { Metadata } from 'next'
import GalleryView from '@/components/gallery/GalleryView'

interface PageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    key?: string
    photo?: string
  }>
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { key, photo: photoId } = await searchParams
  const supabase = await createServerClient()

  // Fetch gallery
  const { data: gallery } = await supabase
    .from('galleries')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (!gallery || gallery.access_key !== key) {
    return {
      title: 'Gallery - Pure Ohana Treasures',
    }
  }

  // If sharing a specific photo
  if (photoId) {
    const { data: photo } = await supabase
      .from('photos')
      .select('*')
      .eq('id', photoId)
      .eq('gallery_id', gallery.id)
      .maybeSingle()

    if (photo) {
      return {
        title: `${photo.filename} - ${gallery.title}`,
        description: `View this photo from ${gallery.title}`,
        openGraph: {
          title: `${photo.filename} - ${gallery.title}`,
          description: `View this photo from ${gallery.title}`,
          images: [
            {
              url: photo.web_url,
              width: photo.width || 1920,
              height: photo.height || 1280,
              alt: photo.filename,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${photo.filename} - ${gallery.title}`,
          description: `View this photo from ${gallery.title}`,
          images: [photo.web_url],
        },
      }
    }
  }

  // Default gallery metadata
  const { data: coverPhoto } = await supabase
    .from('photos')
    .select('*')
    .eq('gallery_id', gallery.id)
    .order('position', { ascending: true })
    .limit(1)
    .maybeSingle()

  return {
    title: `${gallery.title} - Pure Ohana Treasures`,
    description: gallery.description || `View photos from ${gallery.title}`,
    openGraph: {
      title: gallery.title,
      description: gallery.description || `View photos from ${gallery.title}`,
      images: coverPhoto ? [
        {
          url: coverPhoto.web_url,
          width: coverPhoto.width || 1920,
          height: coverPhoto.height || 1280,
          alt: gallery.title,
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: gallery.title,
      description: gallery.description || `View photos from ${gallery.title}`,
      images: coverPhoto ? [coverPhoto.web_url] : [],
    },
  }
}

export default async function GalleryPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { key } = await searchParams
  const supabase = await createServerClient()

  // Fetch gallery by slug
  const { data: gallery, error: galleryError } = await supabase
    .from('galleries')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (galleryError || !gallery) {
    notFound()
  }

  // Validate access key
  if (gallery.access_key !== key) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="max-w-md w-full mx-4 text-center">
          <h1 className="font-display text-4xl text-charcoal-900 mb-4">
            Access Required
          </h1>
          <p className="font-serif text-charcoal-600 mb-8">
            This gallery requires a valid access key. Please check your invitation link.
          </p>
        </div>
      </div>
    )
  }

  // Fetch photos for this gallery
  const { data: photos, error: photosError } = await supabase
    .from('photos')
    .select('*')
    .eq('gallery_id', gallery.id)
    .order('position', { ascending: true })

  if (photosError) {
    console.error('Error fetching photos:', photosError)
  }

  const galleryPhotos = photos || []

  // Increment view count
  await supabase
    .from('galleries')
    .update({ view_count: gallery.view_count + 1 })
    .eq('id', gallery.id)

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Gallery Header */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-5xl md:text-6xl text-charcoal-900 mb-4">
            {gallery.title}
          </h1>
          {gallery.description && (
            <p className="font-serif text-xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed">
              {gallery.description}
            </p>
          )}
          <div className="mt-6 font-serif text-sm text-charcoal-500">
            {galleryPhotos.length} {galleryPhotos.length === 1 ? 'photo' : 'photos'}
          </div>
        </div>

        {/* Gallery Grid */}
        <GalleryView photos={galleryPhotos} gallery={gallery} />
      </div>
    </div>
  )
}
