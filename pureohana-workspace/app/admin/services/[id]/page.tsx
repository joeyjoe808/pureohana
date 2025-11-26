'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'
import { PhotoPicker } from '@/components/admin/PhotoPicker'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Save, AlertCircle, ImagePlus, X, Plus, Trash2 } from 'lucide-react'

interface EditServicePageProps {
  params: Promise<{ id: string }>
}

export default function EditServicePage({ params }: EditServicePageProps) {
  const router = useRouter()
  const [serviceId, setServiceId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPhotoPicker, setShowPhotoPicker] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    features: [''],
    starting_price: '',
    cover_image_url: '',
    display_order: 0,
    is_active: true,
  })

  useEffect(() => {
    const loadService = async () => {
      const resolvedParams = await params
      setServiceId(resolvedParams.id)

      const supabase = createClient()

      const { data: service, error: fetchError } = await supabase
        .from('services')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

      if (fetchError || !service) {
        setError('Service not found')
        setLoadingData(false)
        return
      }

      setFormData({
        title: service.title || '',
        description: service.description || '',
        features: Array.isArray(service.features) && service.features.length > 0
          ? service.features
          : [''],
        starting_price: service.starting_price || '',
        cover_image_url: service.cover_image_url || '',
        display_order: service.display_order || 0,
        is_active: service.is_active ?? true,
      })

      setLoadingData(false)
    }

    loadService()
  }, [params])

  const handleAddFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ''],
    })
  }

  const handleRemoveFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      features: newFeatures.length > 0 ? newFeatures : [''],
    })
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData({
      ...formData,
      features: newFeatures,
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
        throw new Error('You must be logged in to update a service')
      }

      // Validate inputs
      if (!formData.title.trim()) {
        throw new Error('Service title is required')
      }

      if (!formData.description.trim()) {
        throw new Error('Service description is required')
      }

      if (!formData.starting_price.trim()) {
        throw new Error('Starting price is required')
      }

      // Filter out empty features
      const validFeatures = formData.features.filter(f => f.trim() !== '')

      // Update service
      const { error: updateError } = await supabase
        .from('services')
        .update({
          title: formData.title.trim(),
          description: formData.description.trim(),
          features: validFeatures,
          starting_price: formData.starting_price.trim(),
          cover_image_url: formData.cover_image_url.trim() || null,
          display_order: formData.display_order,
          is_active: formData.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', serviceId)
        .eq('photographer_id', user.id)

      if (updateError) {
        throw new Error(`Failed to update service: ${updateError.message}`)
      }

      // Success! Redirect to services list
      router.push('/admin/services')
    } catch (err: any) {
      console.error('Error updating service:', err)
      setError(err.message || 'Failed to update service')
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('You must be logged in to delete a service')
      }

      const { error: deleteError } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)
        .eq('photographer_id', user.id)

      if (deleteError) {
        throw new Error(`Failed to delete service: ${deleteError.message}`)
      }

      router.push('/admin/services')
    } catch (err: any) {
      console.error('Error deleting service:', err)
      setError(err.message || 'Failed to delete service')
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <Container className="py-12">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-sunset-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-charcoal-600">Loading service...</p>
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
            href="/admin/services"
            className="inline-flex items-center gap-2 text-sunset-600 hover:text-sunset-700 font-serif mb-4"
          >
            <ArrowLeft size={20} />
            Back to services
          </Link>

          <Heading level={1} className="mb-2">
            Edit Service
          </Heading>
          <p className="font-serif text-charcoal-600">
            Update your service details
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
              Service Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-charcoal-200 rounded-luxury focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent font-serif text-xl"
              placeholder="Island Portrait Sessions"
              required
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block font-serif font-medium text-charcoal-900 mb-2">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-charcoal-200 rounded-luxury focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent font-serif resize-none"
              rows={4}
              placeholder="Luxury family and couple portraits across Hawaii's most stunning locations"
              required
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
                    sizes="(max-width: 1024px) 100vw, 896px"
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

          {/* Features */}
          <div className="mb-6">
            <label className="block font-serif font-medium text-charcoal-900 mb-2">
              Features & Inclusions
            </label>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-charcoal-200 rounded-luxury focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent font-serif"
                    placeholder="1-2 hour session"
                    disabled={loading}
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="px-4 py-3 border-2 border-red-600 text-red-600 rounded-luxury hover:bg-red-50 transition-colors"
                      disabled={loading}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddFeature}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 border border-sunset-600 text-sunset-600 rounded-luxury font-serif text-sm hover:bg-sunset-50 transition-colors"
              disabled={loading}
            >
              <Plus size={16} />
              Add Feature
            </button>
          </div>

          {/* Starting Price */}
          <div className="mb-6">
            <label htmlFor="starting_price" className="block font-serif font-medium text-charcoal-900 mb-2">
              Starting Price <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="starting_price"
              value={formData.starting_price}
              onChange={(e) => setFormData({ ...formData, starting_price: e.target.value })}
              className="w-full px-4 py-3 border border-charcoal-200 rounded-luxury focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent font-serif"
              placeholder="$850 or Custom"
              required
              disabled={loading}
            />
            <p className="mt-2 font-serif text-xs text-charcoal-600">
              Examples: "$850", "$2,500", "Custom", "Contact for pricing"
            </p>
          </div>

          {/* Display Order */}
          <div className="mb-6">
            <label htmlFor="display_order" className="block font-serif font-medium text-charcoal-900 mb-2">
              Display Order
            </label>
            <input
              type="number"
              id="display_order"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 border border-charcoal-200 rounded-luxury focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent font-serif"
              placeholder="0"
              disabled={loading}
            />
            <p className="mt-2 font-serif text-xs text-charcoal-600">
              Lower numbers appear first (0 = first)
            </p>
          </div>

          {/* Active Status */}
          <div className="mb-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 rounded border-charcoal-300 text-sunset-600 focus:ring-sunset-500"
                disabled={loading}
              />
              <span className="font-serif text-charcoal-900">
                Active (show on public services page)
              </span>
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
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Update Service
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-6 py-3 border-2 border-red-600 text-red-600 rounded-luxury font-serif font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={18} />
            </button>
            <Link
              href="/admin/services"
              className="px-6 py-3 border-2 border-charcoal-200 text-charcoal-700 rounded-luxury font-serif font-medium hover:border-charcoal-300 transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
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
