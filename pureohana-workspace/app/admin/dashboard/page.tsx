import { createServerClient } from '@/lib/supabase'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'
import Link from 'next/link'
import NextImage from 'next/image'
import { Image, Heart, MessageSquare, Eye } from 'lucide-react'

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboardPage() {
  const supabase = await createServerClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get photographer details
  const { data: photographer } = await supabase
    .from('photographers')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get galleries
  const { data: galleries, count: galleriesCount } = await supabase
    .from('galleries')
    .select('*', { count: 'exact' })
    .eq('photographer_id', user.id)

  const galleryIds = galleries?.map(g => g.id) || []

  // Get recent galleries
  const recentGalleries = galleries?.slice(0, 5).sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ) || []

  // Get total photos count
  const { count: photosCount } = await supabase
    .from('photos')
    .select('*', { count: 'exact', head: true })
    .in('gallery_id', galleryIds)

  // Get photo IDs for this photographer
  const { data: photos } = await supabase
    .from('photos')
    .select('id')
    .in('gallery_id', galleryIds)

  const photoIds = photos?.map(p => p.id) || []

  // Get total favorites count
  const { count: favoritesCount } = await supabase
    .from('favorites')
    .select('*', { count: 'exact', head: true })
    .in('photo_id', photoIds)

  // Get total comments count
  const { count: commentsCount } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .in('photo_id', photoIds)

  // Get favorite data with photo and gallery info for display
  const { data: favoritesData } = await supabase
    .from('favorites')
    .select(`
      id,
      photo_id,
      created_at,
      photos!inner (
        id,
        filename,
        thumbnail_url,
        gallery_id,
        galleries!inner (
          id,
          title,
          slug
        )
      )
    `)
    .in('photo_id', photoIds)
    .order('created_at', { ascending: false })

  // Group favorites by photo and count them
  const groupedFavorites = (favoritesData || []).reduce((acc, fav) => {
    const photoId = fav.photo_id
    if (!acc[photoId]) {
      acc[photoId] = {
        photo: fav.photos,
        count: 0,
        latestFavorite: fav
      }
    }
    acc[photoId].count++
    if (new Date(fav.created_at) > new Date(acc[photoId].latestFavorite.created_at)) {
      acc[photoId].latestFavorite = fav
    }
    return acc
  }, {} as Record<string, any>)

  // Get top 6 most favorited photos
  const topFavorites = Object.values(groupedFavorites)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 6)

  return (
    <Container className="py-8 sm:py-12">
      <div className="mb-8 sm:mb-12">
        <Heading level={1} className="mb-2 text-2xl sm:text-3xl">
          Welcome back, {photographer?.full_name || 'Admin'}
        </Heading>
        <p className="font-serif text-lg sm:text-xl text-charcoal-600">
          {photographer?.business_name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        <div className="bg-white rounded-luxury-lg shadow-luxury p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-serif text-xs sm:text-sm text-charcoal-600">Galleries</p>
            <Image size={18} className="text-sunset-600 flex-shrink-0" />
          </div>
          <p className="font-display text-2xl sm:text-3xl text-charcoal-900">{galleriesCount || 0}</p>
        </div>

        <div className="bg-white rounded-luxury-lg shadow-luxury p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-serif text-xs sm:text-sm text-charcoal-600">Photos</p>
            <Image size={18} className="text-sunset-600 flex-shrink-0" />
          </div>
          <p className="font-display text-2xl sm:text-3xl text-charcoal-900">{photosCount || 0}</p>
        </div>

        <div className="bg-white rounded-luxury-lg shadow-luxury p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-serif text-xs sm:text-sm text-charcoal-600">Favorites</p>
            <Heart size={18} className="text-sunset-600 flex-shrink-0" />
          </div>
          <p className="font-display text-2xl sm:text-3xl text-charcoal-900">{favoritesCount || 0}</p>
        </div>

        <div className="bg-white rounded-luxury-lg shadow-luxury p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-serif text-xs sm:text-sm text-charcoal-600">Comments</p>
            <MessageSquare size={18} className="text-sunset-600 flex-shrink-0" />
          </div>
          <p className="font-display text-2xl sm:text-3xl text-charcoal-900">{commentsCount || 0}</p>
        </div>
      </div>

      {/* Most Favorited Photos */}
      {topFavorites.length > 0 && (
        <div className="bg-white rounded-luxury-lg shadow-luxury p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <Heading level={2}>Most Favorited Photos</Heading>
            <Link
              href="/admin/feedback"
              className="font-serif text-sunset-600 hover:text-sunset-700 transition-colors"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {topFavorites.map((grouped: any) => (
              <div
                key={grouped.photo.id}
                className="bg-white rounded-luxury shadow-luxury overflow-hidden hover:shadow-luxury-lg transition-shadow"
              >
                <div className="relative aspect-square bg-charcoal-100">
                  <NextImage
                    src={grouped.photo.thumbnail_url}
                    alt={grouped.photo.filename}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                  {/* Heart icon with count badge */}
                  <div className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg relative">
                    <Heart className="w-4 h-4" fill="currentColor" />
                    {grouped.count > 1 && (
                      <span className="absolute -top-1 -right-1 bg-white text-red-600 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-red-600">
                        {grouped.count}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-2">
                  <p className="font-serif text-xs text-charcoal-900 font-semibold truncate">
                    {grouped.photo.galleries.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Galleries */}
      <div className="bg-white rounded-luxury-lg shadow-luxury p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <Heading level={2}>Recent Galleries</Heading>
          <Link
            href="/admin/galleries"
            className="font-serif text-sunset-600 hover:text-sunset-700 transition-colors"
          >
            View all
          </Link>
        </div>

        {recentGalleries && recentGalleries.length > 0 ? (
          <div className="space-y-4">
            {recentGalleries.map((gallery) => (
              <Link
                key={gallery.id}
                href={`/admin/galleries/${gallery.id}`}
                className="block p-4 border border-charcoal-200 rounded-luxury hover:border-sunset-400 hover:shadow-luxury transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base sm:text-lg text-charcoal-900 truncate">{gallery.title}</h3>
                    <p className="font-serif text-sm text-charcoal-600 truncate">{gallery.slug}</p>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 text-sm text-charcoal-600 flex-shrink-0">
                    <span className="flex items-center gap-1">
                      <Eye size={16} />
                      {gallery.view_count || 0}
                    </span>
                    <span className={`px-3 py-1 rounded-full font-serif text-xs whitespace-nowrap ${
                      gallery.is_public
                        ? 'bg-green-100 text-green-700'
                        : 'bg-charcoal-100 text-charcoal-700'
                    }`}>
                      {gallery.is_public ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Image size={48} className="mx-auto text-charcoal-300 mb-4" />
            <p className="font-serif text-charcoal-600 mb-4">No galleries yet</p>
            <Link
              href="/admin/galleries/new"
              className="inline-block bg-sunset-600 text-white py-2 px-6 rounded-luxury font-serif hover:bg-sunset-700 transition-colors"
            >
              Create your first gallery
            </Link>
          </div>
        )}
      </div>
    </Container>
  )
}
