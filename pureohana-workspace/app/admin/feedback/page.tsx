import { createServerClient } from '@/lib/supabase'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'
import FeedbackClient from './FeedbackClient'

export default async function FeedbackPage() {
  const supabase = await createServerClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get all galleries for this photographer
  const { data: galleries } = await supabase
    .from('galleries')
    .select('id, title, slug')
    .eq('photographer_id', user.id)

  const galleryIds = galleries?.map(g => g.id) || []

  if (galleryIds.length === 0) {
    return (
      <Container className="py-12">
        <Heading level={1} className="mb-8">Client Feedback</Heading>
        <div className="text-center py-16">
          <p className="font-serif text-xl text-charcoal-400">
            No galleries yet. Create a gallery to start receiving feedback.
          </p>
        </div>
      </Container>
    )
  }

  // Get all photos for these galleries
  const { data: photos } = await supabase
    .from('photos')
    .select('id, gallery_id, filename, thumbnail_url')
    .in('gallery_id', galleryIds)

  const photoIds = photos?.map(p => p.id) || []

  // Get all favorites with photo and gallery info
  const { data: favorites } = await supabase
    .from('favorites')
    .select('*')
    .in('photo_id', photoIds)
    .order('created_at', { ascending: false })

  // Get all comments with photo and gallery info
  const { data: comments } = await supabase
    .from('comments')
    .select('*')
    .in('photo_id', photoIds)
    .order('created_at', { ascending: false })

  // Create lookup maps for photos and galleries
  const photoMap = new Map(photos?.map(p => [p.id, p]) || [])
  const galleryMap = new Map(galleries?.map(g => [g.id, g]) || [])

  // Enrich favorites with photo and gallery data
  const enrichedFavorites = favorites?.map(fav => {
    const photo = photoMap.get(fav.photo_id)
    const gallery = photo ? galleryMap.get(photo.gallery_id) : null
    return {
      ...fav,
      photo,
      gallery
    }
  }).filter(f => f.photo && f.gallery) || []

  // Enrich comments with photo and gallery data
  const enrichedComments = comments?.map(comment => {
    const photo = photoMap.get(comment.photo_id)
    const gallery = photo ? galleryMap.get(photo.gallery_id) : null
    return {
      ...comment,
      photo,
      gallery
    }
  }).filter(c => c.photo && c.gallery) || []

  return (
    <Container className="py-12">
      <div className="mb-8">
        <Heading level={1} className="mb-2">Client Feedback</Heading>
        <p className="font-serif text-lg text-charcoal-600">
          All favorites and comments from your clients in one place
        </p>
      </div>

      <FeedbackClient
        favorites={enrichedFavorites}
        comments={enrichedComments}
        galleries={galleries || []}
      />
    </Container>
  )
}
