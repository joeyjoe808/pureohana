import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 0

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: galleries } = await supabase
    .from('galleries')
    .select(`
      *,
      photos!inner(
        id,
        thumbnail_url,
        web_url
      )
    `)
    .eq('photographer_id', user.id)
    .order('created_at', { ascending: false })

  const { count: totalPhotos } = await supabase
    .from('photos')
    .select('*', { count: 'exact', head: true })
    .in('gallery_id', galleries?.map(g => g.id) || [])

  const { count: unreadComments } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .in('gallery_id', galleries?.map(g => g.id) || [])
    .eq('is_read', false)

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-serif font-light text-gray-900 tracking-tight">
              Pure Ohana Treasures
            </h1>
            <div className="flex items-center gap-8">
              <span className="text-xs text-gray-500 uppercase tracking-wider">{user.email}</span>
              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="text-xs text-gray-600 hover:text-gray-900 uppercase tracking-wider"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-serif font-light text-gray-900 mb-2 tracking-tight">Dashboard</h2>
          <p className="text-gray-500 font-light">Manage your photography galleries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-50 p-8 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Total Galleries</p>
                <p className="text-4xl font-serif font-light text-gray-900">{galleries?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Total Photos</p>
                <p className="text-4xl font-serif font-light text-gray-900">{totalPhotos || 0}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Total Views</p>
                <p className="text-4xl font-serif font-light text-gray-900">
                  {galleries?.reduce((sum, g) => sum + (g.view_count || 0), 0) || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>

          <Link href="/dashboard/comments" className="bg-blue-50 p-8 border border-blue-200 hover:border-blue-300 transition-colors group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 mb-2 uppercase tracking-wider font-medium">Comments</p>
                <p className="text-4xl font-serif font-light text-gray-900">
                  {unreadComments || 0}
                  {unreadComments && unreadComments > 0 ? (
                    <span className="text-sm text-blue-600 ml-2">unread</span>
                  ) : null}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-serif font-light text-gray-900">Your Galleries</h3>
          <Link
            href="/galleries/new"
            className="bg-gray-900 text-white px-6 py-3 font-medium hover:bg-gray-800 transition flex items-center gap-2 text-xs uppercase tracking-wider"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Gallery
          </Link>
        </div>

        {galleries && galleries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery) => (
              <Link
                key={gallery.id}
                href={`/galleries/${gallery.id}`}
                className="bg-white overflow-hidden border border-gray-100 hover:border-gray-200 transition group"
              >
                <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center overflow-hidden">
                  {gallery.photos && gallery.photos.length > 0 ? (
                    <img
                      src={gallery.photos[0].web_url}
                      alt={gallery.title}
                      className="w-full h-full object-cover group-hover:opacity-90 transition"
                    />
                  ) : (
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-serif font-light text-gray-900 mb-2 group-hover:text-gray-600 transition">
                    {gallery.title}
                  </h4>
                  {gallery.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 font-light">
                      {gallery.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {gallery.photos?.length || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {gallery.view_count || 0}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      gallery.is_public 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {gallery.is_public ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-12 text-center border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-light text-gray-900 mb-2">
              No galleries yet
            </h3>
            <p className="text-gray-500 mb-6 font-light">
              Create your first gallery to start sharing your beautiful photography
            </p>
            <Link
              href="/galleries/new"
              className="inline-block bg-gray-900 text-white px-8 py-3 font-medium hover:bg-gray-800 transition text-xs uppercase tracking-wider"
            >
              Create Your First Gallery
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
