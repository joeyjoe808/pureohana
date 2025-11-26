import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase'
import type { Photo, Gallery } from '@/lib/supabase'
import type { Metadata } from 'next'
import GalleryView from '@/components/gallery/GalleryView'
import NextImage from 'next/image'
import { getImageGallerySchema, getBreadcrumbSchema, getImageObjectSchema } from '@/lib/structured-data'

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
  const { key, photo: photoId } = await searchParams
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

  // Generate structured data
  const breadcrumbs = [
    { name: 'Home', url: 'https://pureohanatreasures.com' },
    { name: 'Galleries', url: 'https://pureohanatreasures.com/access' },
    { name: gallery.title, url: `https://pureohanatreasures.com/galleries/${slug}?key=${key}` },
  ]

  // Get the specific photo if photoId is provided
  const sharedPhoto = photoId ? galleryPhotos.find(p => p.id === photoId) : null

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Structured Data - Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbSchema(breadcrumbs)) }}
      />

      {/* Structured Data - Gallery or Single Photo */}
      {sharedPhoto ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getImageObjectSchema(sharedPhoto, gallery.title)) }}
        />
      ) : (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getImageGallerySchema(gallery, galleryPhotos)) }}
        />
      )}

      {/* Hero Section with Cover Image */}
      {gallery.cover_photo_url && (
        <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <NextImage
              src={gallery.cover_photo_url}
              alt={gallery.title}
              fill
              className="object-cover"
              priority
              quality={90}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/40 via-charcoal-900/30 to-charcoal-900/60" />
          </div>

          {/* Centered Title */}
          <div className="relative z-10 text-center px-4">
            <h1 className="font-display text-6xl md:text-8xl text-white mb-6 tracking-wide drop-shadow-2xl">
              {gallery.title}
            </h1>
            {gallery.description && (
              <p className="font-serif text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                {gallery.description}
              </p>
            )}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white/50 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Gallery Header (only shown if no cover image) */}
        {!gallery.cover_photo_url && (
          <div className="mb-12 text-center">
            <h1 className="font-display text-5xl md:text-6xl text-charcoal-900 mb-4">
              {gallery.title}
            </h1>
            {gallery.description && (
              <p className="font-serif text-xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed">
                {gallery.description}
              </p>
            )}
          </div>
        )}

        {/* Photo Count */}
        <div className="text-center mb-12">
          <div className="font-serif text-sm text-charcoal-500">
            {galleryPhotos.length} {galleryPhotos.length === 1 ? 'photo' : 'photos'}
          </div>
        </div>

        {/* Gallery Grid */}
        <GalleryView photos={galleryPhotos} gallery={gallery} />

        {/* Elegant Footer */}
        <div className="mt-20 mb-12 text-center">
          <p className="font-display text-2xl md:text-3xl text-charcoal-600 italic tracking-wide">
            With Aloha From Pure Ohana Treasures
          </p>
        </div>
      </div>
    </div>
  )
}
