'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'
import { PhotoPicker } from '@/components/admin/PhotoPicker'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Save, Eye, AlertCircle, ImagePlus, X } from 'lucide-react'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function NewBlogPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPhotoPicker, setShowPhotoPicker] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image_url: '',
    meta_description: '',
    is_published: false,
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData({
      ...formData,
      title,
      slug: slugify(title),
    })
  }

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('You must be logged in to create a blog post')
      }

      // Validate inputs
      if (!formData.title.trim()) {
        throw new Error('Post title is required')
      }

      if (!formData.slug.trim()) {
        throw new Error('Post slug is required')
      }

      if (!formData.content.trim()) {
        throw new Error('Post content is required')
      }

      // Create blog post
      const { data: post, error: createError } = await supabase
        .from('blog_posts')
        .insert({
          title: formData.title.trim(),
          slug: formData.slug.trim(),
          excerpt: formData.excerpt.trim() || null,
          content: formData.content.trim(),
          cover_image_url: formData.cover_image_url.trim() || null,
          meta_description: formData.meta_description.trim() || null,
          is_published: publish,
          published_at: publish ? new Date().toISOString() : null,
          photographer_id: user.id,
        })
        .select()
        .single()

      if (createError) {
        if (createError.code === '23505') {
          throw new Error('A post with this slug already exists. Please choose a different title.')
        }
        throw new Error(`Failed to create post: ${createError.message}`)
      }

      // Success! Redirect to blog list
      router.push('/admin/blog')
    } catch (err: any) {
      console.error('Error creating blog post:', err)
      setError(err.message || 'Failed to create blog post')
      setLoading(false)
    }
  }

  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-2 text-sunset-600 hover:text-sunset-700 font-serif mb-4"
          >
            <ArrowLeft size={20} />
            Back to blog posts
          </Link>

          <Heading level={1} className="mb-2">
            Create New Blog Post
          </Heading>
          <p className="font-serif text-charcoal-600">
            Share your photography insights and island stories
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-luxury p-4 mb-6 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-serif text-red-900 font-medium">Error</p>
              <p className="font-serif text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="bg-white rounded-luxury-lg shadow-luxury p-8">
          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block font-serif font-medium text-charcoal-900 mb-2">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-4 py-3 border border-charcoal-200 rounded-luxury focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent font-serif text-xl"
              placeholder="Why Hawaii is Perfect for Family Photos"
              required
              disabled={loading}
            />
          </div>

          {/* Slug */}
          <div className="mb-6">
            <label htmlFor="slug" className="block font-serif font-medium text-charcoal-900 mb-2">
              URL Slug <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-3 border border-charcoal-200 rounded-luxury focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent font-serif font-mono text-sm"
              placeholder="why-hawaii-is-perfect-for-family-photos"
              required
              disabled={loading}
            />
            <p className="mt-2 font-serif text-sm text-charcoal-600">
              Your post will be at: <span className="font-mono text-sunset-600">/blog/{formData.slug || 'your-slug'}</span>
            </p>
          </div>

          {/* Excerpt */}
          <div className="mb-6">
            <label htmlFor="excerpt" className="block font-serif font-medium text-charcoal-900 mb-2">
              Excerpt (Preview Text)
            </label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-3 border border-charcoal-200 rounded-luxury focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent font-serif resize-none"
              rows={3}
              placeholder="A brief summary that appears on the blog list page..."
              disabled={loading}
            />
          </div>

          {/* Cover Image */}
          <div className="mb-6">
            <label className="block font-serif font-medium text-charcoal-900 mb-2">
              Cover Image
            </label>

            {formData.cover_image_url ? (
              <div className="space-y-3">
                {/* Image Preview */}
                <div className="relative aspect-video w-full max-w-2xl rounded-luxury overflow-hidden shadow-luxury">
                  <Image
                    src={formData.cover_image_url}
                    alt="Cover image preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, cover_image_url: '' })}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                    disabled={loading}
                  >
                    <X size={16} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPhotoPicker(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-sunset-600 text-sunset-600 rounded-luxury font-serif text-sm hover:bg-sunset-50 transition-colors"
                  disabled={loading}
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowPhotoPicker(true)}
                className="w-full px-4 py-12 border-2 border-dashed border-charcoal-300 rounded-luxury hover:border-sunset-500 hover:bg-sunset-50 transition-colors flex flex-col items-center gap-3"
                disabled={loading}
              >
                <ImagePlus size={48} className="text-charcoal-400" />
                <div>
                  <p className="font-serif font-medium text-charcoal-900 mb-1">Choose Cover Photo</p>
                  <p className="font-serif text-sm text-charcoal-600">Select from your photo library</p>
                </div>
              </button>
            )}
          </div>

          {/* Content */}
          <div className="mb-6">
            <label htmlFor="content" className="block font-serif font-medium text-charcoal-900 mb-2">
              Content <span className="text-red-600">*</span>
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 border border-charcoal-200 rounded-luxury focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent font-serif resize-none"
              rows={20}
              placeholder="Write your blog post content here... You can use basic HTML like <p>, <h2>, <strong>, <em>, etc."
              required
              disabled={loading}
            />
            <p className="mt-2 font-serif text-xs text-charcoal-600">
              You can use HTML tags for formatting (p, h2, h3, strong, em, ul, ol, li, a)
            </p>
          </div>

          {/* Meta Description */}
          <div className="mb-8">
            <label htmlFor="meta_description" className="block font-serif font-medium text-charcoal-900 mb-2">
              Meta Description (SEO)
            </label>
            <textarea
              id="meta_description"
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              className="w-full px-4 py-3 border border-charcoal-200 rounded-luxury focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent font-serif resize-none"
              rows={2}
              placeholder="A description that appears in search results..."
              disabled={loading}
              maxLength={160}
            />
            <p className="mt-2 font-serif text-xs text-charcoal-600">
              {formData.meta_description.length}/160 characters
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-charcoal-600 text-white py-3 px-6 rounded-luxury font-serif font-medium hover:bg-charcoal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save as Draft
                </>
              )}
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading}
              className="flex-1 bg-sunset-600 text-white py-3 px-6 rounded-luxury font-serif font-medium hover:bg-sunset-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Eye size={18} />
              Publish Post
            </button>
            <Link
              href="/admin/blog"
              className="px-6 py-3 border-2 border-charcoal-200 text-charcoal-700 rounded-luxury font-serif font-medium hover:border-charcoal-300 transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-luxury p-6">
          <p className="font-serif text-sm text-blue-900 mb-2">
            <strong>Formatting Tips:</strong>
          </p>
          <ul className="font-serif text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Use &lt;h2&gt; and &lt;h3&gt; for headings</li>
            <li>Wrap paragraphs in &lt;p&gt; tags</li>
            <li>Use &lt;strong&gt; for bold and &lt;em&gt; for italics</li>
            <li>Create lists with &lt;ul&gt; and &lt;li&gt;</li>
          </ul>
        </div>
      </div>

      {/* Photo Picker Modal */}
      {showPhotoPicker && (
        <PhotoPicker
          currentUrl={formData.cover_image_url}
          onSelect={(url) => setFormData({ ...formData, cover_image_url: url })}
          onClose={() => setShowPhotoPicker(false)}
        />
      )}
    </Container>
  )
}
