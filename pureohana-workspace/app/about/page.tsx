import { Metadata } from 'next'
import Image from 'next/image'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'
import { createServerClient } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'About Pure Ohana | Our Story',
  description: 'Learn about our passion for capturing authentic moments and preserving precious memories across the Hawaiian islands.',
}

export default async function AboutPage() {
  const supabase = await createServerClient()

  // Fetch photo for About hero section
  const { data: aboutPhoto, error: photoError } = await supabase
    .from('photo_placements')
    .select(`
      photos (
        web_url,
        filename
      )
    `)
    .eq('section_key', 'about_hero')
    .eq('is_active', true)
    .limit(1)
    .single()

  // Fallback image if no photo assigned
  const heroImage = (!photoError && aboutPhoto?.photos) ? aboutPhoto.photos : {
    web_url: "https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/ashley%20looking%20into%20isaiahs%20eyes.jpg",
    filename: "Pure Ohana Photography"
  }

  // Fetch about content from database
  const { data: aboutContent, error: contentError } = await supabase
    .from('about_content')
    .select('*')
    .limit(1)
    .single()

  // Fallback content if no content in database
  const content = (!contentError && aboutContent) ? aboutContent : {
    page_title: 'About Pure Ohana Treasures',
    story_heading: 'Our Story',
    story_text: 'Pure Ohana Treasures was born from a deep love for Hawaii and a passion for preserving life\'s most precious moments.\n\nBased in Aiea, Oahu, we serve families and couples across all Hawaiian islands, creating timeless imagery that captures the essence of aloha and the beauty of your unique story.',
    philosophy_heading: 'Our Philosophy',
    philosophy_text: 'We believe in creating heirloom imagery that transcends trends and touches hearts for generations. Every photograph we create is crafted with intention, artistry, and aloha.'
  }
  return (
    <main className="min-h-screen bg-cream-50">
      <section className="bg-white py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Heading level={1} className="text-center mb-12">{content.page_title}</Heading>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div className="relative aspect-[4/5] overflow-hidden bg-charcoal-50">
                <Image
                  src={heroImage.web_url}
                  alt={heroImage.filename || "Pure Ohana Photography"}
                  fill
                  className="object-contain rounded-luxury shadow-luxury"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="space-y-6">
                <Heading level={2}>{content.story_heading}</Heading>
                <p className="text-lg font-serif text-charcoal-700 leading-relaxed whitespace-pre-line">
                  {content.story_text}
                </p>
              </div>
            </div>

            <div className="bg-cream-100 p-12 rounded-luxury">
              <Heading level={2} className="text-center mb-8">{content.philosophy_heading}</Heading>
              <p className="text-xl font-serif text-center text-charcoal-700 leading-relaxed max-w-3xl mx-auto whitespace-pre-line">
                {content.philosophy_text}
              </p>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}
