'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'
import Link from 'next/link'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function generateAccessKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let key = ''
  for (let i = 0; i < 12; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return key
}

export default function NewGalleryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    is_public: false,
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData({
      ...formData,
      title,
      slug: slugify(title),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('You must be logged in to create a gallery')
      }

      // Validate inputs
      if (!formData.title.trim()) {
        throw new Error('Gallery title is required')
      }

      if (!formData.slug.trim()) {
        throw new Error('Gallery slug is required')
      }

      // Create gallery
      const { data: gallery, error: createError } = await supabase
        .from('galleries')
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          slug: formData.slug.trim(),
          is_public: formData.is_public,
          access_key: generateAccessKey(),
          photographer_id: user.id,
        })
        .select()
        .single()

      if (createError) {
        if (createError.code === '23505') {
          throw new Error('A gallery with this slug already exists. Please choose a different title.')
        }
        throw new Error(`Failed to create gallery: ${createError.message}`)
      }

      // Success! Redirect to the new gallery
      router.push(`/admin/galleries/${gallery.id}`)
    } catch (err: any) {
      console.error('Error creating gallery:', err)
      setError(err.message || 'Failed to create gallery')
      setLoading(false)
    }
  }

  return (
    <Container className="py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/galleries"
            className="inline-flex items-center gap-2 text-sunset-600 hover:text-sunset-700 font-serif mb-4"
          >
            <ArrowLeft size={20} />
            Back to galleries
          </Link>

          <Heading level={1} className="mb-2">
            Create New Gallery
          </Heading>
          <p className="font-serif text-charcoal-600">
            Create a new gallery to organize and share your photos with clients
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
        <form onSubmit={handleSubmit} className="bg-white rounded-luxury-lg shadow-luxury p-8">
          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block font-serif font-medium text-charcoal-900 mb-2">
              Gallery Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-4 py-3 border border-charcoal-200 rounded-luxury focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent font-serif"
              placeholder="e.g., Summer Beach Wedding 2024"
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
              placeholder="summer-beach-wedding-2024"
              required
              disabled={loading}
            />
            <p className="mt-2 font-serif text-sm text-charcoal-600">
              Your gallery will be accessible at: <span className="font-mono text-sunset-600">/galleries/{formData.slug || 'your-slug'}</span>
            </p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block font-serif font-medium text-charcoal-900 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-charcoal-200 rounded-luxury focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent font-serif resize-none"
              rows={4}
              placeholder="Add a description for your gallery..."
              disabled={loading}
            />
          </div>

          {/* Is Public */}
          <div className="mb-8">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_public}
                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                className="mt-1 w-5 h-5 text-sunset-600 border-charcoal-300 rounded focus:ring-sunset-500"
                disabled={loading}
              />
              <div>
                <span className="block font-serif font-medium text-charcoal-900 mb-1">
                  Make gallery public
                </span>
                <span className="block font-serif text-sm text-charcoal-600">
                  Public galleries are visible to everyone. Private galleries require an access key.
                </span>
              </div>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-sunset-600 text-white py-3 px-6 rounded-luxury font-serif font-medium hover:bg-sunset-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Create Gallery
                </>
              )}
            </button>
            <Link
              href="/admin/galleries"
              className="px-6 py-3 border-2 border-charcoal-200 text-charcoal-700 rounded-luxury font-serif font-medium hover:border-charcoal-300 transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-luxury p-6">
          <p className="font-serif text-sm text-blue-900 mb-2">
            <strong>What happens next?</strong>
          </p>
          <ul className="font-serif text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Your gallery will be created with a unique access key</li>
            <li>You can upload photos to this gallery</li>
            <li>Share the gallery link with your clients</li>
            <li>Clients can view, favorite, and comment on photos</li>
          </ul>
        </div>
      </div>
    </Container>
  )
}
