import { createServerClient } from '@/lib/supabase'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'
import Link from 'next/link'
import { Plus, Eye, Heart, MessageSquare, Edit, Trash2 } from 'lucide-react'

export default async function AdminGalleriesPage() {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get all galleries for this photographer
  const { data: galleries } = await supabase
    .from('galleries')
    .select(`
      *,
      photos (count)
    `)
    .eq('photographer_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <Container className="py-12">
      <div className="flex items-center justify-between mb-12">
        <Heading level={1}>My Galleries</Heading>
        <Link
          href="/admin/galleries/new"
          className="inline-flex items-center gap-2 bg-sunset-600 text-white py-3 px-6 rounded-luxury font-serif font-medium hover:bg-sunset-700 transition-colors shadow-luxury"
        >
          <Plus size={20} />
          New Gallery
        </Link>
      </div>

      {galleries && galleries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <div key={gallery.id} className="bg-white rounded-luxury-lg shadow-luxury overflow-hidden">
              {/* Gallery Header */}
              <div className="p-6">
                <h3 className="font-display text-xl text-charcoal-900 mb-2">
                  {gallery.title}
                </h3>
                <p className="font-serif text-sm text-charcoal-600 mb-4">
                  /{gallery.slug}
                </p>
                {gallery.description && (
                  <p className="font-serif text-charcoal-600 text-sm line-clamp-2 mb-4">
                    {gallery.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-charcoal-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Eye size={16} />
                    {gallery.view_count || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    📸 {(gallery.photos as any)?.[0]?.count || 0}
                  </span>
                </div>

                {/* Status Badge */}
                <span className={`inline-block px-3 py-1 rounded-full font-serif text-xs ${
                  gallery.is_public
                    ? 'bg-green-100 text-green-700'
                    : 'bg-charcoal-100 text-charcoal-700'
                }`}>
                  {gallery.is_public ? 'Public' : 'Private'}
                </span>
              </div>

              {/* Actions */}
              <div className="border-t border-charcoal-100 p-4 flex gap-2">
                <Link
                  href={`/admin/galleries/${gallery.id}`}
                  className="flex-1 text-center py-2 px-4 border border-sunset-600 text-sunset-600 rounded-luxury font-serif text-sm hover:bg-sunset-50 transition-colors"
                >
                  View Details
                </Link>
                <Link
                  href={`/galleries/${gallery.slug}?key=${gallery.access_key}`}
                  target="_blank"
                  className="py-2 px-4 border border-charcoal-300 text-charcoal-700 rounded-luxury font-serif text-sm hover:bg-charcoal-50 transition-colors"
                >
                  Preview
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-luxury-lg shadow-luxury p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-sunset-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-sunset-600" />
            </div>
            <Heading level={2} className="mb-4">
              No galleries yet
            </Heading>
            <p className="font-serif text-charcoal-600 mb-8">
              Create your first gallery to start sharing photos with your clients
            </p>
            <Link
              href="/admin/galleries/new"
              className="inline-flex items-center gap-2 bg-sunset-600 text-white py-3 px-6 rounded-luxury font-serif font-medium hover:bg-sunset-700 transition-colors shadow-luxury"
            >
              <Plus size={20} />
              Create Gallery
            </Link>
          </div>
        </div>
      )}
    </Container>
  )
}
