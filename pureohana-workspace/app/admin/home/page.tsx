'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'
import { ArrowLeft, Save, AlertCircle, CheckCircle, Plus, Trash2, GripVertical, Video } from 'lucide-react'
import Link from 'next/link'

interface VideoItem {
  id: string
  youtube_url: string
  title: string
  video_type: string
  display_order: number
  is_active: boolean
}

const VIDEO_TYPES = ['Highlight reel', 'Short feature', 'Full film', 'Teaser', 'Same day edit']

export default function EditHomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [homeId, setHomeId] = useState<string | null>(null)
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [savingVideos, setSavingVideos] = useState(false)

  const [formData, setFormData] = useState({
    hero_title: 'PURE OHANA TREASURES',
    hero_subtitle: 'Hawaii Luxury Wedding • Photography & Cinematography',
    hero_button_text: 'INQUIRE',
    about_heading: 'TIMELESS ELEGANCE',
    about_text: 'For discerning couples & ohanas seeking extraordinary photography across the Hawaiian islands. We preserve your family\'s unfolding story, capturing keepsake memories that deepen in meaning as your ohana grows.',
    experience_1_title: 'EXCLUSIVE ACCESS',
    experience_1_text: 'Private estates, secluded beaches, and Hawaii\'s most coveted locations',
    experience_2_title: 'ARTISAN APPROACH',
    experience_2_text: 'Each image meticulously crafted, never mass-produced',
    experience_3_title: 'WHITE GLOVE SERVICE',
    experience_3_text: 'Concierge-level attention from first contact through delivery',
    contact_heading: 'BEGIN YOUR STORY',
    contact_button_text: 'INQUIRE',
    contact_location: 'Aiea, Oahu • Serving all Hawaiian Islands',
    contact_email: 'pureohanatreasures@gmail.com',
  })

  useEffect(() => {
    loadHomeContent()
  }, [])

  const loadHomeContent = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // Fetch existing homepage content
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .eq('photographer_id', user.id)
        .single()

      if (!error && data) {
        setHomeId(data.id)
        setFormData({
          hero_title: data.hero_title,
          hero_subtitle: data.hero_subtitle,
          hero_button_text: data.hero_button_text,
          about_heading: data.about_heading,
          about_text: data.about_text,
          experience_1_title: data.experience_1_title,
          experience_1_text: data.experience_1_text,
          experience_2_title: data.experience_2_title,
          experience_2_text: data.experience_2_text,
          experience_3_title: data.experience_3_title,
          experience_3_text: data.experience_3_text,
          contact_heading: data.contact_heading,
          contact_button_text: data.contact_button_text,
          contact_location: data.contact_location,
          contact_email: data.contact_email,
        })
      }

      // Fetch homepage videos
      const { data: videosData } = await supabase
        .from('homepage_videos')
        .select('*')
        .eq('photographer_id', user.id)
        .order('display_order', { ascending: true })

      if (videosData) {
        setVideos(videosData)
      }

      setLoading(false)
    } catch (err: any) {
      console.error('Error loading homepage content:', err)
      setError(err.message || 'Failed to load content')
      setLoading(false)
    }
  }

  // Video management functions
  const addVideo = () => {
    const newVideo: VideoItem = {
      id: `temp-${Date.now()}`,
      youtube_url: '',
      title: '',
      video_type: 'Highlight reel',
      display_order: videos.length,
      is_active: true,
    }
    setVideos([...videos, newVideo])
  }

  const updateVideo = (index: number, field: keyof VideoItem, value: string | boolean | number) => {
    const updated = [...videos]
    updated[index] = { ...updated[index], [field]: value }
    setVideos(updated)
  }

  const removeVideo = (index: number) => {
    const updated = videos.filter((_, i) => i !== index)
    // Update display order
    updated.forEach((v, i) => v.display_order = i)
    setVideos(updated)
  }

  const saveVideos = async () => {
    setSavingVideos(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('You must be logged in')

      // Delete all existing videos for this user
      await supabase
        .from('homepage_videos')
        .delete()
        .eq('photographer_id', user.id)

      // Insert all current videos (filter out empty ones)
      const videosToSave = videos
        .filter(v => v.youtube_url && v.title)
        .map((v, index) => ({
          photographer_id: user.id,
          youtube_url: v.youtube_url,
          title: v.title,
          video_type: v.video_type,
          display_order: index,
          is_active: v.is_active,
        }))

      if (videosToSave.length > 0) {
        const { error: insertError } = await supabase
          .from('homepage_videos')
          .insert(videosToSave)

        if (insertError) throw insertError
      }

      // Reload to get proper IDs
      const { data: newVideos } = await supabase
        .from('homepage_videos')
        .select('*')
        .eq('photographer_id', user.id)
        .order('display_order', { ascending: true })

      if (newVideos) setVideos(newVideos)

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Error saving videos:', err)
      setError(err.message || 'Failed to save videos')
    } finally {
      setSavingVideos(false)
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

      if (homeId) {
        // Update existing
        const { error: updateError } = await supabase
          .from('homepage_content')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', homeId)

        if (updateError) throw updateError
      } else {
        // Create new
        const { data: newContent, error: insertError } = await supabase
          .from('homepage_content')
          .insert({
            ...formData,
            photographer_id: user.id,
          })
          .select()
          .single()

        if (insertError) throw insertError
        if (newContent) setHomeId(newContent.id)
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Error saving homepage content:', err)
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
            Edit Homepage
          </Heading>
          <p className="font-serif text-charcoal-600">
            Customize the content that appears on your homepage
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
              <p className="font-serif text-green-800 text-sm">Homepage content saved successfully</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-8">
          {/* Hero Section */}
          <div className="bg-white rounded-luxury shadow-luxury p-8">
            <h3 className="font-display text-xl text-charcoal-900 mb-6">Hero Section</h3>

            <div className="space-y-4">
              <div>
                <label className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
                  Main Title
                </label>
                <input
                  type="text"
                  value={formData.hero_title}
                  onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                  className="w-full px-4 py-2 border border-charcoal-300 rounded-luxury font-serif focus:outline-none focus:ring-2 focus:ring-sunset-500"
                  required
                />
              </div>

              <div>
                <label className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.hero_subtitle}
                  onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-charcoal-300 rounded-luxury font-serif focus:outline-none focus:ring-2 focus:ring-sunset-500"
                  required
                />
              </div>

              <div>
                <label className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  value={formData.hero_button_text}
                  onChange={(e) => setFormData({ ...formData, hero_button_text: e.target.value })}
                  className="w-full px-4 py-2 border border-charcoal-300 rounded-luxury font-serif focus:outline-none focus:ring-2 focus:ring-sunset-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-luxury shadow-luxury p-8">
            <h3 className="font-display text-xl text-charcoal-900 mb-6">About Section</h3>

            <div className="space-y-4">
              <div>
                <label className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
                  Heading
                </label>
                <input
                  type="text"
                  value={formData.about_heading}
                  onChange={(e) => setFormData({ ...formData, about_heading: e.target.value })}
                  className="w-full px-4 py-2 border border-charcoal-300 rounded-luxury font-serif focus:outline-none focus:ring-2 focus:ring-sunset-500"
                  required
                />
              </div>

              <div>
                <label className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
                  Text
                </label>
                <textarea
                  value={formData.about_text}
                  onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-charcoal-300 rounded-luxury font-serif focus:outline-none focus:ring-2 focus:ring-sunset-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-luxury shadow-luxury p-8">
            <h3 className="font-display text-xl text-charcoal-900 mb-6">Experience Section (3 Cards)</h3>

            <div className="space-y-6">
              {/* Card 1 */}
              <div className="p-4 bg-cream-50 rounded-luxury">
                <h4 className="font-serif font-medium text-charcoal-900 mb-3">Card 1</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.experience_1_title}
                      onChange={(e) => setFormData({ ...formData, experience_1_title: e.target.value })}
                      className="w-full px-4 py-2 border border-charcoal-300 rounded-luxury font-serif focus:outline-none focus:ring-2 focus:ring-sunset-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
                      Text
                    </label>
                    <textarea
                      value={formData.experience_1_text}
                      onChange={(e) => setFormData({ ...formData, experience_1_text: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 border border-charcoal-300 rounded-luxury font-serif focus:outline-none focus:ring-2 focus:ring-sunset-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-4 bg-cream-50 rounded-luxury">
                <h4 className="font-serif font-medium text-charcoal-900 mb-3">Card 2</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.experience_2_title}
                      onChange={(e) => setFormData({ ...formData, experience_2_title: e.target.value })}
                      className="w-full px-4 py-2 border border-charcoal-300 rounded-luxury font-serif focus:outline-none focus:ring-2 focus:ring-sunset-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
                      Text
                    </label>
                    <textarea
                      value={formData.experience_2_text}
                      onChange={(e) => setFormData({ ...formData, experience_2_text: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 border border-charcoal-300 rounded-luxury font-serif focus:outline-none focus:ring-2 focus:ring-sunset-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-4 bg-cream-50 rounded-luxury">
                <h4 className="font-serif font-medium text-charcoal-900 mb-3">Card 3</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.experience_3_title}
                      onChange={(e) => setFormData({ ...formData, experience_3_title: e.target.value })}
                      className="w-full px-4 py-2 border border-charcoal-300 rounded-luxury font-serif focus:outline-none focus:ring-2 focus:ring-sunset-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
                      Text
                    </label>
                    <textarea
                      value={formData.experience_3_text}
                      onChange={(e) => setFormData({ ...formData, experience_3_text: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 border border-charcoal-300 rounded-luxury font-serif focus:outline-none focus:ring-2 focus:ring-sunset-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-luxury shadow-luxury p-8">
            <h3 className="font-display text-xl text-charcoal-900 mb-6">Contact Section</h3>

            <div className="space-y-4">
              <div>
                <label className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
                  Heading
                </label>
                <input
                  type="text"
                  value={formData.contact_heading}
                  onChange={(e) => setFormData({ ...formData, contact_heading: e.target.value })}
                  className="w-full px-4 py-2 border border-charcoal-300 rounded-luxury font-serif focus:outline-none focus:ring-2 focus:ring-sunset-500"
                  required
                />
              </div>

              <div>
                <label className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  value={formData.contact_button_text}
                  onChange={(e) => setFormData({ ...formData, contact_button_text: e.target.value })}
                  className="w-full px-4 py-2 border border-charcoal-300 rounded-luxury font-serif focus:outline-none focus:ring-2 focus:ring-sunset-500"
                  required
                />
              </div>

              <div>
                <label className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
                  Location Text
                </label>
                <input
                  type="text"
                  value={formData.contact_location}
                  onChange={(e) => setFormData({ ...formData, contact_location: e.target.value })}
                  className="w-full px-4 py-2 border border-charcoal-300 rounded-luxury font-serif focus:outline-none focus:ring-2 focus:ring-sunset-500"
                  required
                />
              </div>

              <div>
                <label className="block font-serif text-sm font-medium text-charcoal-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full px-4 py-2 border border-charcoal-300 rounded-luxury font-serif focus:outline-none focus:ring-2 focus:ring-sunset-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Video Gallery Section */}
          <div className="bg-white rounded-luxury shadow-luxury p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Video size={24} className="text-sunset-600" />
                <h3 className="font-display text-xl text-charcoal-900">Wedding Video Samples</h3>
              </div>
              <button
                type="button"
                onClick={addVideo}
                className="inline-flex items-center gap-2 bg-sunset-600 text-white px-4 py-2 rounded-luxury font-serif text-sm hover:bg-sunset-700 transition-colors"
              >
                <Plus size={18} />
                Add Video
              </button>
            </div>

            <p className="font-serif text-sm text-charcoal-600 mb-6">
              Add up to 4 YouTube videos to showcase on your homepage. Paste the YouTube URL and add a title.
            </p>

            {videos.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-charcoal-200 rounded-luxury">
                <Video size={40} className="mx-auto text-charcoal-300 mb-3" />
                <p className="font-serif text-charcoal-500">No videos added yet</p>
                <p className="font-serif text-sm text-charcoal-400 mt-1">Click "Add Video" to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {videos.map((video, index) => (
                  <div key={video.id} className="p-4 bg-cream-50 rounded-luxury border border-charcoal-200">
                    <div className="flex items-start gap-3">
                      <div className="text-charcoal-400 mt-2">
                        <GripVertical size={20} />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-serif text-xs font-medium text-charcoal-700 mb-1">
                              YouTube URL
                            </label>
                            <input
                              type="url"
                              value={video.youtube_url}
                              onChange={(e) => updateVideo(index, 'youtube_url', e.target.value)}
                              placeholder="https://www.youtube.com/watch?v=..."
                              className="w-full px-3 py-2 border border-charcoal-300 rounded-luxury font-serif text-sm focus:outline-none focus:ring-2 focus:ring-sunset-500"
                            />
                          </div>
                          <div>
                            <label className="block font-serif text-xs font-medium text-charcoal-700 mb-1">
                              Video Title
                            </label>
                            <input
                              type="text"
                              value={video.title}
                              onChange={(e) => updateVideo(index, 'title', e.target.value)}
                              placeholder="Isaiah & Ashley | A Love Story"
                              className="w-full px-3 py-2 border border-charcoal-300 rounded-luxury font-serif text-sm focus:outline-none focus:ring-2 focus:ring-sunset-500"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <label className="block font-serif text-xs font-medium text-charcoal-700 mb-1">
                              Video Type
                            </label>
                            <select
                              value={video.video_type}
                              onChange={(e) => updateVideo(index, 'video_type', e.target.value)}
                              className="w-full px-3 py-2 border border-charcoal-300 rounded-luxury font-serif text-sm focus:outline-none focus:ring-2 focus:ring-sunset-500 bg-white"
                            >
                              {VIDEO_TYPES.map((type) => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                          <div className="pt-5">
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={video.is_active}
                                onChange={(e) => updateVideo(index, 'is_active', e.target.checked)}
                                className="w-4 h-4 rounded border-charcoal-300 text-sunset-600 focus:ring-sunset-500"
                              />
                              <span className="font-serif text-sm text-charcoal-700">Active</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-luxury transition-colors"
                        title="Remove video"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {videos.length > 0 && (
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={saveVideos}
                  disabled={savingVideos}
                  className="inline-flex items-center gap-2 bg-charcoal-800 text-white px-6 py-2 rounded-luxury font-serif hover:bg-charcoal-900 transition-colors disabled:opacity-50"
                >
                  <Save size={18} />
                  {savingVideos ? 'Saving Videos...' : 'Save Videos'}
                </button>
              </div>
            )}
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
              href="/"
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
