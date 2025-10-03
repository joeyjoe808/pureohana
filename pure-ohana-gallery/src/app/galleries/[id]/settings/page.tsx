import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import GallerySettingsForm from '@/components/gallery/GallerySettingsForm'

export default async function GallerySettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: gallery } = await supabase
    .from('galleries')
    .select('*')
    .eq('id', id)
    .eq('photographer_id', user.id)
    .single()

  if (!gallery) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link 
            href={`/galleries/${gallery.id}`}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2 inline-block"
          >
            ← Back to Gallery
          </Link>
          <h1 className="text-3xl font-serif font-light text-gray-900 tracking-tight">
            Gallery Settings
          </h1>
          <p className="text-gray-500 font-light mt-2">
            {gallery.title}
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <GallerySettingsForm gallery={gallery} />
      </div>
    </div>
  )
}
