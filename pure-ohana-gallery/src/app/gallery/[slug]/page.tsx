import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import GalleryGrid from '@/components/gallery/GalleryGrid'

export default async function PublicGalleryPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  
  const { data: gallery } = await supabase
    .from('galleries')
    .select('*')
    .eq('slug', params.slug)
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
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-4 tracking-tight">
              {gallery.title}
            </h1>
            {gallery.description && (
              <p className="text-lg text-gray-500 mb-6 font-light">
                {gallery.description}
              </p>
            )}
            <div className="flex items-center justify-center gap-8 text-xs uppercase tracking-wider text-gray-400">
              <span>{photos?.length || 0} Photos</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>{gallery.view_count || 0} Views</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {photos && photos.length > 0 ? (
          <GalleryGrid photos={photos} />
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
