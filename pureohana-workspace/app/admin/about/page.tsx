'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'
import { ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface AboutContent {
  id: string
  page_title: string
  story_heading: string
  story_text: string
  philosophy_heading: string
  philosophy_text: string
}

export default function EditAboutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [aboutId, setAboutId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    page_title: 'About Pure Ohana Treasures',
    story_heading: 'Our Story',
    story_text: 'Pure Ohana Treasures was born from a deep love for Hawaii and a passion for preserving life\'s most precious moments.',
    philosophy_heading: 'Our Philosophy',
    philosophy_text: 'We believe in creating heirloom imagery that transcends trends and touches hearts for generations. Every photograph we create is crafted with intention, artistry, and aloha.',
  })

  useEffect(() => {
    loadAboutContent()
  }, [])

  const loadAboutContent = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // Fetch existing about content
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .eq('photographer_id', user.id)
        .single()

      if (!error && data) {
        setAboutId(data.id)
        setFormData({
          page_title: data.page_title,
          story_heading: data.story_heading,
          story_text: data.story_text,
          philosophy_heading: data.philosophy_heading,
          philosophy_text: data.philosophy_text,
        })
      }

      setLoading(false)
    } catch (err: any) {
      console.error('Error loading about content:', err)
      setError(err.message || 'Failed to load content')
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('You must be logged in')
      }

      if (aboutId) {
        // Update existing
        const { error: updateError } = await supabase
          .from('about_content')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', aboutId)

        if (updateError) throw updateError
      } else {
        // Create new
        const { data: newContent, error: insertError } = await supabase
          .from('about_content')
          .insert({
            ...formData,
            photographer_id: user.id,
          })
          .select()
          .single()

        if (insertError) throw insertError
        if (newContent) setAboutId(newContent.id)
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Error saving about content:', err)
      setError(err.message || 'Failed to save content')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Container className="py-12">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-sunset-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-charcoal-600">Loading...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-sunset-600 hover:text-sunset-700 font-serif mb-4"
          >
            <ArrowLeft size={20} />
            Back to dashboard
          </Link>

          <Heading level={1} className="mb-2">
            Edit About Page
          </Heading>
          <p className="font-serif text-charcoal-600">
            Customize the content that appears on your About page
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

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-2 border-green-200 rounded-luxury p-4 mb-6 flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-serif text-green-900 font-medium">Success!</p>
              <p className="font-serif text-green-800 text-sm">About page content saved successfully</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSave} className="bg-white rounded-luxury shadow-luxury p-8">
          {/* Page Title */}
          <div className="mb-6">
            <label className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
              Page Title
            </label>
            <input
              type="text"
              value={formData.page_title}
              onChange={(e) => setFormData({ ...formData, page_title: e.target.value })}
              className="w-full px-4 py-2 border border-charcoal-300 rounded-luxury font-serif focus:outline-none focus:ring-2 focus:ring-sunset-500"
              required
            />
          </div>

          {/* Story Section */}
          <div className="mb-8 p-6 bg-cream-50 rounded-luxury">
            <h3 className="font-display text-lg text-charcoal-900 mb-4">Story Section</h3>

            <div className="mb-4">
              <label className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
                Story Heading
              </label>
              <input
                type="text"
                value={formData.story_heading}
                onChange={(e) => setFormData({ ...formData, story_heading: e.target.value })}
                className="w-full px-4 py-2 border border-charcoal-300 rounded-luxury font-serif focus:outline-none focus:ring-2 focus:ring-sunset-500"
                required
              />
            </div>

            <div>
              <label className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
                Story Text
              </label>
              <textarea
                value={formData.story_text}
                onChange={(e) => setFormData({ ...formData, story_text: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-charcoal-300 rounded-luxury font-serif focus:outline-none focus:ring-2 focus:ring-sunset-500"
                required
              />
              <p className="text-xs text-charcoal-500 mt-1 font-sans">
                This appears below the "Our Story" heading
              </p>
            </div>
          </div>

          {/* Philosophy Section */}
          <div className="mb-8 p-6 bg-cream-50 rounded-luxury">
            <h3 className="font-display text-lg text-charcoal-900 mb-4">Philosophy Section</h3>

            <div className="mb-4">
              <label className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
                Philosophy Heading
              </label>
              <input
                type="text"
                value={formData.philosophy_heading}
                onChange={(e) => setFormData({ ...formData, philosophy_heading: e.target.value })}
                className="w-full px-4 py-2 border border-charcoal-300 rounded-luxury font-serif focus:outline-none focus:ring-2 focus:ring-sunset-500"
                required
              />
            </div>

            <div>
              <label className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
                Philosophy Text
              </label>
              <textarea
                value={formData.philosophy_text}
                onChange={(e) => setFormData({ ...formData, philosophy_text: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-charcoal-300 rounded-luxury font-serif focus:outline-none focus:ring-2 focus:ring-sunset-500"
                required
              />
              <p className="text-xs text-charcoal-500 mt-1 font-sans">
                This appears in the philosophy box below the story section
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-sunset-600 text-white py-3 px-6 rounded-luxury font-serif font-medium hover:bg-sunset-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            <Link
              href="/about"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 border-2 border-charcoal-300 text-charcoal-700 py-3 px-6 rounded-luxury font-serif font-medium hover:bg-charcoal-50 transition-colors"
            >
              Preview Page
            </Link>
          </div>
        </form>
      </div>
    </Container>
  )
}
