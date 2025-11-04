import { createServerClient } from '@/lib/supabase'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'

export default async function AdminBlogPage() {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Fetch all blog posts
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('photographer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts:', error)
  }

  return (
    <Container className="py-12">
      <div className="flex items-center justify-between mb-12">
        <Heading level={1}>Blog Posts</Heading>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-sunset-600 text-white py-3 px-6 rounded-luxury font-serif font-medium hover:bg-sunset-700 transition-colors shadow-luxury"
        >
          <Plus size={20} />
          New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-luxury shadow-luxury p-6">
          <p className="font-serif text-sm text-charcoal-600 mb-1">Total Posts</p>
          <p className="font-display text-3xl text-charcoal-900">{posts?.length || 0}</p>
        </div>
        <div className="bg-white rounded-luxury shadow-luxury p-6">
          <p className="font-serif text-sm text-charcoal-600 mb-1">Published</p>
          <p className="font-display text-3xl text-green-600">
            {posts?.filter(p => p.is_published).length || 0}
          </p>
        </div>
        <div className="bg-white rounded-luxury shadow-luxury p-6">
          <p className="font-serif text-sm text-charcoal-600 mb-1">Drafts</p>
          <p className="font-display text-3xl text-charcoal-400">
            {posts?.filter(p => !p.is_published).length || 0}
          </p>
        </div>
      </div>

      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-luxury-lg shadow-luxury overflow-hidden">
              {/* Cover Image */}
              {post.cover_image_url && (
                <div className="relative h-48">
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Post Info */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  {post.is_published ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-serif text-xs bg-green-100 text-green-700">
                      <Eye size={12} />
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-serif text-xs bg-charcoal-100 text-charcoal-700">
                      <EyeOff size={12} />
                      Draft
                    </span>
                  )}
                </div>

                <h3 className="font-display text-xl text-charcoal-900 mb-2">
                  {post.title}
                </h3>
                <p className="font-serif text-sm text-charcoal-600 mb-4 line-clamp-2">
                  {post.excerpt || 'No excerpt'}
                </p>

                <p className="text-xs text-charcoal-500 mb-4">
                  {post.is_published && post.published_at
                    ? `Published ${new Date(post.published_at).toLocaleDateString()}`
                    : `Created ${new Date(post.created_at).toLocaleDateString()}`
                  }
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="flex-1 text-center py-2 px-4 border border-sunset-600 text-sunset-600 rounded-luxury font-serif text-sm hover:bg-sunset-50 transition-colors"
                  >
                    Edit
                  </Link>
                  {post.is_published && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="py-2 px-4 border border-charcoal-300 text-charcoal-700 rounded-luxury font-serif text-sm hover:bg-charcoal-50 transition-colors"
                    >
                      View
                    </Link>
                  )}
                </div>
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
              No blog posts yet
            </Heading>
            <p className="font-serif text-charcoal-600 mb-8">
              Start sharing your photography insights, tips, and island stories with your audience
            </p>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 bg-sunset-600 text-white py-3 px-6 rounded-luxury font-serif font-medium hover:bg-sunset-700 transition-colors shadow-luxury"
            >
              <Plus size={20} />
              Create Your First Post
            </Link>
          </div>
        </div>
      )}
    </Container>
  )
}
