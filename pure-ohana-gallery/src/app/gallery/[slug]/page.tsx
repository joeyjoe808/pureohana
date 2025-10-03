import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import GalleryHeader from '@/components/gallery/GalleryHeader'

export default async function PublicGalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: gallery } = await supabase
    .from('galleries')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!gallery) {
    notFound()
  }

  await supabase
    .from('galleries')
    .update({ view_count: (gallery.view_count || 0) + 1 })
    .eq('id', gallery.id)

  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .eq('gallery_id', gallery.id)
    .order('position', { ascending: true })

  return (
    <div className="min-h-screen bg-white">
      <GalleryHeader
        title={gallery.title}
        description={gallery.description}
        photoCount={photos?.length || 0}
        viewCount={gallery.view_count || 0}
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {photos && photos.length > 0 ? (
          <GalleryGrid photos={photos} galleryId={gallery.id} />
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-light text-gray-900 mb-2">
              No photos yet
            </h3>
            <p className="text-gray-500 font-light">
              Check back soon for amazing photos
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
