import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PhotoUploader from '@/components/upload/PhotoUploader'

export default async function GalleryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: gallery } = await supabase
    .from('galleries')
    .select('*')
    .eq('id', id)
    .eq('photographer_id', user.id)
    .single()

  if (!gallery) {
    redirect('/dashboard')
  }

  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .eq('gallery_id', gallery.id)
    .order('position', { ascending: true })

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-serif font-light text-gray-900 tracking-tight">
                  {gallery.title}
                </h1>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  {photos?.length || 0} photos
                </p>
              </div>
            </div>
            <Link
              href={`/gallery/${gallery.slug}`}
              target="_blank"
              className="relative z-50 flex items-center gap-2 px-6 py-2.5 hover:opacity-80 transition-opacity duration-200"
              style={{ 
                backgroundColor: '#1a1a1a',
                color: '#ffffff',
                border: '1px solid #2a2a2a',
                fontSize: '11px',
                letterSpacing: '0.15em',
                fontWeight: '500'
              }}
            >
              <span style={{ color: '#ffffff' }}>View Gallery</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="#ffffff" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <PhotoUploader galleryId={gallery.id} />
        </div>

        {photos && photos.length > 0 ? (
          <div>
            <h2 className="text-2xl font-serif font-light text-gray-900 mb-6">
              Uploaded Photos ({photos.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group"
                >
                  <img
                    src={photo.thumbnail_url}
                    alt={photo.filename}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="text-white">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-12 text-center border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-light text-gray-900 mb-2">
              No photos yet
            </h3>
            <p className="text-gray-500 font-light">
              Upload your first photos using the uploader above
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
