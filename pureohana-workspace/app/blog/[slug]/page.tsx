import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Heading } from '@/components/ui/Heading'
import { createServerClient } from '@/lib/supabase'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, meta_description')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  return {
    title: post ? `${post.title} | Pure Ohana Treasures` : 'Blog Post | Pure Ohana Treasures',
    description: post?.meta_description || 'Read our latest insights on photography and island life.',
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const supabase = await createServerClient()

  // Fetch post from database
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error || !post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-cream-50">
      <article className="max-w-4xl mx-auto px-4 py-20">
        <Link href="/blog" className="text-sunset-600 font-serif hover:underline mb-8 inline-block">
          ← Back to Blog
        </Link>

        {post.cover_image_url && (
          <div className="relative h-[400px] rounded-luxury overflow-hidden shadow-luxury mb-8">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        )}

        <Heading level={1} className="mb-6">{post.title}</Heading>
        <div className="flex items-center gap-4 text-charcoal-600 mb-8 pb-8 border-b border-charcoal-200">
          <p>Pure Ohana Team</p>
          <span>•</span>
          <p>{new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div
          className="prose prose-lg max-w-none font-serif prose-headings:font-display prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8 prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6 prose-p:mb-4 prose-a:text-sunset-600 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  )
}
