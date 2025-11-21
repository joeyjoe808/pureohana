'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Promotion, PromotionInsert } from '@/lib/supabase/types'
import { Button } from '@/components/ui/Button'
import { X, Plus } from 'lucide-react'

interface PromotionFormProps {
  promotion?: Promotion
  mode: 'create' | 'edit'
}

export default function PromotionForm({ promotion, mode }: PromotionFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [highlights, setHighlights] = useState<string[]>(promotion?.highlights || [])
  const [newHighlight, setNewHighlight] = useState('')

  const [formData, setFormData] = useState({
    title: promotion?.title || '',
    slug: promotion?.slug || '',
    tagline: promotion?.tagline || '',
    description: promotion?.description || '',
    terms_conditions: promotion?.terms_conditions || '',
    original_price: promotion?.original_price || '',
    promotional_price: promotion?.promotional_price || '',
    savings_text: promotion?.savings_text || '',
    hero_image_url: promotion?.hero_image_url || '',
    secondary_image_url: promotion?.secondary_image_url || '',
    valid_from: promotion?.valid_from ? new Date(promotion.valid_from).toISOString().split('T')[0] : '',
    valid_until: promotion?.valid_until ? new Date(promotion.valid_until).toISOString().split('T')[0] : '',
    is_active: promotion?.is_active ?? true,
    is_featured: promotion?.is_featured ?? false,
    service_category: promotion?.service_category || '',
  })

  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  function handleTitleChange(title: string) {
    setFormData(prev => ({
      ...prev,
      title,
      slug: mode === 'create' ? generateSlug(title) : prev.slug,
    }))
  }

  function addHighlight() {
    if (newHighlight.trim()) {
      setHighlights([...highlights, newHighlight.trim()])
      setNewHighlight('')
    }
  }

  function removeHighlight(index: number) {
    setHighlights(highlights.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload: Partial<PromotionInsert> = {
        ...formData,
        highlights: highlights.length > 0 ? highlights : null,
        valid_from: formData.valid_from ? new Date(formData.valid_from).toISOString() : null,
        valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null,
        tagline: formData.tagline || null,
        original_price: formData.original_price || null,
        savings_text: formData.savings_text || null,
        hero_image_url: formData.hero_image_url || null,
        secondary_image_url: formData.secondary_image_url || null,
        terms_conditions: formData.terms_conditions || null,
        service_category: formData.service_category || null,
      }

      const url = mode === 'create'
        ? '/api/admin/promotions'
        : `/api/admin/promotions/${promotion?.id}`

      const method = mode === 'create' ? 'POST' : 'PATCH'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save promotion')
      }

      router.push('/admin/promotions')
      router.refresh()
    } catch (error) {
      console.error('Error saving promotion:', error)
      alert(error instanceof Error ? error.message : 'Failed to save promotion')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h2 className="text-xl font-bold text-charcoal-900 mb-4">Basic Information</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-charcoal-900 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500"
              placeholder="e.g., Spring Wedding Special"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-semibold text-charcoal-900 mb-2">
              URL Slug *
            </label>
            <input
              type="text"
              id="slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500"
              placeholder="spring-wedding-special"
            />
            <p className="text-xs text-charcoal-500 mt-1">
              URL: /promo/{formData.slug || 'your-slug'}
            </p>
          </div>

          <div>
            <label htmlFor="tagline" className="block text-sm font-semibold text-charcoal-900 mb-2">
              Tagline
            </label>
            <input
              type="text"
              id="tagline"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500"
              placeholder="A short catchy phrase"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-charcoal-900 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500"
              placeholder="Detailed description of the promotion..."
            />
          </div>

          <div>
            <label htmlFor="service_category" className="block text-sm font-semibold text-charcoal-900 mb-2">
              Service Category
            </label>
            <select
              id="service_category"
              value={formData.service_category}
              onChange={(e) => setFormData({ ...formData, service_category: e.target.value })}
              className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500"
            >
              <option value="">Select a category</option>
              <option value="Wedding">Wedding</option>
              <option value="Family">Family Portrait</option>
              <option value="Maternity">Maternity</option>
              <option value="Event">Event</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h2 className="text-xl font-bold text-charcoal-900 mb-4">Pricing</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="original_price" className="block text-sm font-semibold text-charcoal-900 mb-2">
              Original Price
            </label>
            <input
              type="text"
              id="original_price"
              value={formData.original_price}
              onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
              className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500"
              placeholder="e.g., $1,500"
            />
          </div>

          <div>
            <label htmlFor="promotional_price" className="block text-sm font-semibold text-charcoal-900 mb-2">
              Promotional Price *
            </label>
            <input
              type="text"
              id="promotional_price"
              required
              value={formData.promotional_price}
              onChange={(e) => setFormData({ ...formData, promotional_price: e.target.value })}
              className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500"
              placeholder="e.g., $999"
            />
          </div>

          <div>
            <label htmlFor="savings_text" className="block text-sm font-semibold text-charcoal-900 mb-2">
              Savings Text
            </label>
            <input
              type="text"
              id="savings_text"
              value={formData.savings_text}
              onChange={(e) => setFormData({ ...formData, savings_text: e.target.value })}
              className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500"
              placeholder="e.g., Save $500 or 30% Off"
            />
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h2 className="text-xl font-bold text-charcoal-900 mb-4">Highlights (What's Included)</h2>

        <div className="space-y-3">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex items-center gap-2 bg-charcoal-50 p-3 rounded-lg">
              <span className="flex-1 text-charcoal-900">{highlight}</span>
              <button
                type="button"
                onClick={() => removeHighlight(index)}
                className="p-1 hover:bg-red-100 rounded transition-colors"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
          ))}

          <div className="flex gap-2">
            <input
              type="text"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
              className="flex-1 px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500"
              placeholder="Add a highlight..."
            />
            <button
              type="button"
              onClick={addHighlight}
              className="px-4 py-2 bg-sunset-600 text-white rounded-lg hover:bg-sunset-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h2 className="text-xl font-bold text-charcoal-900 mb-4">Images</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="hero_image_url" className="block text-sm font-semibold text-charcoal-900 mb-2">
              Hero Image URL
            </label>
            <input
              type="url"
              id="hero_image_url"
              value={formData.hero_image_url}
              onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
              className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500"
              placeholder="https://..."
            />
            <p className="text-xs text-charcoal-500 mt-1">Large banner image at top of page</p>
          </div>

          <div>
            <label htmlFor="secondary_image_url" className="block text-sm font-semibold text-charcoal-900 mb-2">
              Secondary Image URL
            </label>
            <input
              type="url"
              id="secondary_image_url"
              value={formData.secondary_image_url}
              onChange={(e) => setFormData({ ...formData, secondary_image_url: e.target.value })}
              className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500"
              placeholder="https://..."
            />
            <p className="text-xs text-charcoal-500 mt-1">Optional secondary image in page body</p>
          </div>
        </div>
      </div>

      {/* Valid Dates */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h2 className="text-xl font-bold text-charcoal-900 mb-4">Valid Dates</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="valid_from" className="block text-sm font-semibold text-charcoal-900 mb-2">
              Valid From
            </label>
            <input
              type="date"
              id="valid_from"
              value={formData.valid_from}
              onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
              className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500"
            />
          </div>

          <div>
            <label htmlFor="valid_until" className="block text-sm font-semibold text-charcoal-900 mb-2">
              Valid Until
            </label>
            <input
              type="date"
              id="valid_until"
              value={formData.valid_until}
              onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
              className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500"
            />
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h2 className="text-xl font-bold text-charcoal-900 mb-4">Terms & Conditions</h2>

        <textarea
          id="terms_conditions"
          rows={6}
          value={formData.terms_conditions}
          onChange={(e) => setFormData({ ...formData, terms_conditions: e.target.value })}
          className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500"
          placeholder="Terms and conditions for this promotion..."
        />
      </div>

      {/* Status */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h2 className="text-xl font-bold text-charcoal-900 mb-4">Status</h2>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 text-sunset-600 rounded focus:ring-sunset-500"
            />
            <div>
              <span className="font-semibold text-charcoal-900">Active</span>
              <p className="text-sm text-charcoal-600">Promotion is visible to the public</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-5 h-5 text-sunset-600 rounded focus:ring-sunset-500"
            />
            <div>
              <span className="font-semibold text-charcoal-900">Featured</span>
              <p className="text-sm text-charcoal-600">Mark as a special featured offer</p>
            </div>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Promotion' : 'Update Promotion'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
