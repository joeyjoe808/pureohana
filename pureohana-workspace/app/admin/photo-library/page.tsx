import { createServerClient } from '@/lib/supabase'
import { Photo } from '@/lib/supabase/types'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { PhotoLibraryGrid } from '@/components/admin/PhotoLibraryGrid'

interface PhotoWithPlacements extends Photo {
  placements: Array<{
    section_key: string
    sort_order: number
    is_active: boolean
  }>
  galleries?: {
    id: string
    title: string
    slug: string
  }
}

export default async function PhotoLibraryPage() {
  const supabase = await createServerClient()

  // Fetch all galleries for filtering
  const { data: galleries } = await supabase
    .from('galleries')
    .select('id, title, slug')
    .order('created_at', { ascending: false })

  // Try to fetch photos with placement information and gallery
  let { data: photos, error } = await supabase
    .from('photos')
    .select(`
      *,
      placements:photo_placements(section_key, sort_order, is_active),
      galleries (
        id,
        title,
        slug
      )
    `)
    .order('created_at', { ascending: false })

  // If photo_placements table doesn't exist, fetch photos without placements
  if (error && error.code === '42703') {
    console.log('Photo placements table not set up yet. Fetching photos without placement info.')
    const fallback = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false })

    photos = fallback.data
    error = fallback.error
  }

  if (error) {
    console.error('Error fetching photos:', error)
  }

  // Add empty placements array if not present
  const photosWithPlacements = (photos || []).map(photo => ({
    ...photo,
    placements: (photo as any).placements || []
  })) as unknown as PhotoWithPlacements[]

  // Check if placement system is available
  const hasPlacementSystem = photosWithPlacements.length > 0 && photosWithPlacements.some(p => p.placements !== undefined)

  return (
    <Container className="py-12">
      <div className="mb-8">
        <Heading level={1} className="mb-2">
          Photo Library
        </Heading>
        <p className="font-serif text-charcoal-600">
          Manage all your uploaded photos and assign them to website sections
        </p>
      </div>

      {/* Photo Placement Setup Banner */}
      {!hasPlacementSystem && photosWithPlacements.length > 0 && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-luxury p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-3xl">📸</div>
            <div className="flex-1">
              <h3 className="font-display text-lg text-blue-900 mb-2">
                Photo Placement System Available
              </h3>
              <p className="font-serif text-blue-800 mb-4">
                To assign photos to website sections (homepage, portfolio, etc.), run the photo placement migration in Supabase.
              </p>
              <details className="font-serif text-sm text-blue-800">
                <summary className="cursor-pointer font-medium mb-2">Show setup instructions</summary>
                <ol className="list-decimal list-inside space-y-2 mt-2 ml-4">
                  <li>Open your Supabase project dashboard</li>
                  <li>Go to SQL Editor (left sidebar)</li>
                  <li>Create a new query</li>
                  <li>Copy the SQL from: <code className="bg-blue-100 px-2 py-0.5 rounded">migrations/001_photo_placements.sql</code></li>
                  <li>Paste and run the query</li>
                  <li>Refresh this page</li>
                </ol>
              </details>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-luxury shadow-luxury p-6">
          <p className="font-serif text-sm text-charcoal-600 mb-1">Total Photos</p>
          <p className="font-display text-3xl text-charcoal-900">{photosWithPlacements.length}</p>
        </div>
        <div className="bg-white rounded-luxury shadow-luxury p-6">
          <p className="font-serif text-sm text-charcoal-600 mb-1">On Homepage</p>
          <p className="font-display text-3xl text-sunset-600">
            {photosWithPlacements.filter(p =>
              p.placements.some(pl => pl.section_key.startsWith('homepage_') && pl.is_active)
            ).length}
          </p>
        </div>
        <div className="bg-white rounded-luxury shadow-luxury p-6">
          <p className="font-serif text-sm text-charcoal-600 mb-1">In Portfolio</p>
          <p className="font-display text-3xl text-sunset-600">
            {photosWithPlacements.filter(p =>
              p.placements.some(pl => pl.section_key === 'portfolio' && pl.is_active)
            ).length}
          </p>
        </div>
        <div className="bg-white rounded-luxury shadow-luxury p-6">
          <p className="font-serif text-sm text-charcoal-600 mb-1">Unassigned</p>
          <p className="font-display text-3xl text-charcoal-400">
            {photosWithPlacements.filter(p => p.placements.length === 0).length}
          </p>
        </div>
      </div>

      {/* Photo Grid */}
      <PhotoLibraryGrid photos={photosWithPlacements} galleries={galleries || []} />
    </Container>
  )
}
