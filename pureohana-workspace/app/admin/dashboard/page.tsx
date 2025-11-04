import { createServerClient } from '@/lib/supabase'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'
import Link from 'next/link'
import { Image, Heart, MessageSquare, Eye } from 'lucide-react'

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

  return (
    <Container className="py-12">
      <div className="mb-12">
        <Heading level={1} className="mb-2">
          Welcome back, {photographer?.full_name || 'Admin'}
        </Heading>
        <p className="font-serif text-xl text-charcoal-600">
          {photographer?.business_name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-luxury-lg shadow-luxury p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-serif text-sm text-charcoal-600">Galleries</p>
            <Image size={20} className="text-sunset-600" />
          </div>
          <p className="font-display text-3xl text-charcoal-900">{galleriesCount || 0}</p>
        </div>

        <div className="bg-white rounded-luxury-lg shadow-luxury p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-serif text-sm text-charcoal-600">Photos</p>
            <Image size={20} className="text-sunset-600" />
          </div>
          <p className="font-display text-3xl text-charcoal-900">{photosCount || 0}</p>
        </div>

        <div className="bg-white rounded-luxury-lg shadow-luxury p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-serif text-sm text-charcoal-600">Favorites</p>
            <Heart size={20} className="text-sunset-600" />
          </div>
          <p className="font-display text-3xl text-charcoal-900">{favoritesCount || 0}</p>
        </div>

        <div className="bg-white rounded-luxury-lg shadow-luxury p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-serif text-sm text-charcoal-600">Comments</p>
            <MessageSquare size={20} className="text-sunset-600" />
          </div>
          <p className="font-display text-3xl text-charcoal-900">{commentsCount || 0}</p>
        </div>
      </div>

      {/* Recent Galleries */}
      <div className="bg-white rounded-luxury-lg shadow-luxury p-8">
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
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-lg text-charcoal-900">{gallery.title}</h3>
                    <p className="font-serif text-sm text-charcoal-600">{gallery.slug}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-charcoal-600">
                    <span className="flex items-center gap-1">
                      <Eye size={16} />
                      {gallery.view_count || 0}
                    </span>
                    <span className={`px-3 py-1 rounded-full font-serif text-xs ${
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
