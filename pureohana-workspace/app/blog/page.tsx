import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'
import { createServerClient } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Blog | Pure Ohana Treasures',
  description: 'Photography tips, island stories, and behind-the-scenes insights from Hawaii.',
}

export default async function BlogPage() {
  const supabase = await createServerClient()

  // Fetch published blog posts
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image_url, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts:', error)
  }

  // Use placeholder if no published posts yet
  const placeholderPosts = [
    {
      slug: 'why-hawaii-is-perfect-for-family-photos',
      title: 'Why Hawaii is Perfect for Family Photos',
      excerpt: 'Discover the magic of island photography and why the Hawaiian islands provide the perfect backdrop for capturing your family\'s precious moments.',
      cover_image_url: 'https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/ashley%20looking%20into%20isaiahs%20eyes.jpg',
      published_at: '2024-10-15',
    },
    {
      slug: 'planning-your-hawaii-wedding-photography',
      title: 'Planning Your Hawaii Wedding Photography',
      excerpt: 'Essential tips for planning your wedding photography in Hawaii, from location scouting to timeline creation.',
      cover_image_url: 'https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/untitled-9870.jpg',
      published_at: '2024-10-01',
    },
    {
      slug: 'best-oahu-photography-locations',
      title: 'Best Oahu Photography Locations',
      excerpt: 'Our curated list of the most stunning photography locations across Oahu, from secret beaches to iconic landmarks.',
      cover_image_url: 'https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/untitled-03371.jpg',
      published_at: '2024-09-20',
    }
  ]

  const displayPosts = posts && posts.length > 0 ? posts : placeholderPosts
  return (
    <main className="min-h-screen bg-cream-50">
      <Container className="py-20">
        <Heading level={1} className="text-center mb-4">Blog</Heading>
        <p className="text-xl text-center text-charcoal-600 font-serif mb-16 max-w-3xl mx-auto">
          Photography tips, island stories, and behind-the-scenes insights
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPosts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="bg-white rounded-luxury shadow-luxury hover:shadow-luxury-lg transition-shadow overflow-hidden">
                {post.cover_image_url && (
                  <div className="relative h-64">
                    <Image
                      src={post.cover_image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6">
                  <p className="text-sm text-charcoal-500 mb-2">{new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <Heading level={3} className="mb-3 group-hover:text-sunset-600 transition-colors">{post.title}</Heading>
                  <p className="text-charcoal-600 font-sans mb-4">{post.excerpt}</p>
                  <span className="text-sunset-600 font-serif text-sm">Read more →</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  )
}
