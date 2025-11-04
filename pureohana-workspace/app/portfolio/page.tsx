import { Metadata } from 'next'
import Image from 'next/image'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'
import { createServerClient } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Portfolio | Pure Ohana Treasures',
  description: 'View our finest work capturing life\'s precious moments across the Hawaiian islands.',
}

export default async function PortfolioPage() {
  const supabase = await createServerClient()

  // Fetch photos assigned to portfolio section via photo placements
  const { data: placements, error: placementsError } = await supabase
    .from('photo_placements')
    .select(`
      sort_order,
      photos (
        id,
        filename,
        web_url,
        thumbnail_url,
        galleries (title)
      )
    `)
    .eq('section_key', 'portfolio')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (placementsError) {
    console.error('Error fetching portfolio photos:', placementsError)
  }

  // Extract photos from placements (handle array or single object)
  const photos = placements?.map(p => {
    const photoData = p.photos
    return photoData ? (Array.isArray(photoData) ? photoData[0] : photoData) : null
  }).filter(Boolean) || []

  // Use placeholder if no photos assigned yet
  const displayPhotos = photos.length > 0 ? photos : [
    { id: 'placeholder-1', web_url: 'https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/ashley%20looking%20into%20isaiahs%20eyes.jpg', filename: 'Wedding photo', galleries: { title: 'Portfolio' } },
    { id: 'placeholder-2', web_url: 'https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/rosaries-grad-group.jpg', filename: 'Family portrait', galleries: { title: 'Portfolio' } },
    { id: 'placeholder-3', web_url: 'https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/untitled-03371.jpg', filename: 'Event photography', galleries: { title: 'Portfolio' } },
    { id: 'placeholder-4', web_url: 'https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/untitled-9870.jpg', filename: 'Sunset wedding', galleries: { title: 'Portfolio' } },
  ]

  return (
    <main className="min-h-screen bg-cream-50">
      <Container className="py-20">
        <Heading level={1} className="text-center mb-4">Portfolio</Heading>
        <p className="text-xl text-center text-charcoal-600 font-serif mb-16 max-w-3xl mx-auto">
          A curated collection of our finest work
        </p>

        {displayPhotos.length === 0 ? (
          <p className="text-center text-charcoal-500 font-serif">
            No portfolio photos yet. Check back soon!
          </p>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {displayPhotos.map(photo => (
              <div key={photo.id} className="mb-6 break-inside-avoid">
                <div className="relative rounded-luxury overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-all duration-300 cursor-pointer group">
                  <Image
                    src={photo.web_url}
                    alt={photo.filename || 'Portfolio photo'}
                    width={800}
                    height={800}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, (max-width: 1536px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="font-serif text-sm">{photo.filename}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </main>
  )
}
