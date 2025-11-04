import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { Heading } from '@/components/ui/Heading'
import { createServerClient } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Pure Ohana Treasures | Luxury Photography in Hawaii',
  description: 'Capturing life\'s most precious moments with luxury and aloha. Island portraits, adventure films, and custom memory treasures for discerning couples & families.',
  keywords: ['Hawaii photography', 'luxury photography', 'island portraits', 'wedding photography', 'Hawaii wedding', 'family photography Hawaii'],
}

export default async function HomePage() {
  const supabase = await createServerClient()

  // Fetch homepage content from database
  const { data: homeContent, error: contentError } = await supabase
    .from('homepage_content')
    .select('*')
    .limit(1)
    .single()

  // Fallback content if no content in database
  const content = (!contentError && homeContent) ? homeContent : {
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
  }

  // Fetch photos for each grid position
  const gridSections = ['homepage_grid_1', 'homepage_grid_2', 'homepage_grid_3', 'homepage_grid_4']

  const gridPhotosPromises = gridSections.map(async (sectionKey) => {
    const { data } = await supabase
      .from('photo_placements')
      .select(`
        photos (
          web_url,
          filename
        )
      `)
      .eq('section_key', sectionKey)
      .eq('is_active', true)
      .limit(1)
      .single()

    // Handle case where photos might be an array or single object
    const photoData = data?.photos
    return photoData ? (Array.isArray(photoData) ? photoData[0] : photoData) : null
  })

  const gridPhotosResults = await Promise.all(gridPhotosPromises)

  // Fallback images if no photos assigned
  const placeholderImages = [
    {
      web_url: "https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/ashley%20looking%20into%20isaiahs%20eyes.jpg",
      filename: "Luxury Wedding Couple Portrait"
    },
    {
      web_url: "https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/rosaries-grad-group.jpg",
      filename: "Family Celebration Photography"
    },
    {
      web_url: "https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/untitled-03371.jpg",
      filename: "Hawaii Wedding Ceremony"
    },
    {
      web_url: "https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/untitled-9870.jpg",
      filename: "Sunset Wedding Photography"
    }
  ]

  const gridImages = gridPhotosResults.map((photo, idx) =>
    photo || placeholderImages[idx]
  )
  return (
    <main className="-mt-20">
      {/* HERO - Full screen, one stunning image, minimal text */}
      <section className="relative h-screen w-full overflow-hidden pt-20">
        <div className="absolute inset-0 -mt-20">
          <Image
            src="https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/untitled-9870.jpg"
            alt="Luxury Hawaii Wedding Photography"
            fill
            priority
            className="object-cover opacity-90"
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <h1
            className="text-white text-5xl md:text-7xl font-extralight tracking-wider mb-6 font-display"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
          >
            {content.hero_title}
          </h1>
          <div className="w-20 h-[1px] bg-white/60 mb-6"></div>
          <p className="text-white/80 text-lg font-light tracking-wide mb-12 font-serif">
            {content.hero_subtitle}
          </p>

          <Link
            href="/contact"
            className="border border-white/60 text-white px-8 py-3
                     hover:bg-white hover:text-black transition-all duration-500
                     text-sm tracking-widest font-light font-serif"
          >
            {content.hero_button_text}
          </Link>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-white/40" size={24} />
        </div>
      </section>

      {/* PORTFOLIO GRID */}
      <section className="bg-white py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-7xl mx-auto">
          {gridImages.map((image, idx) => (
            <div key={idx} className="relative aspect-[3/2] overflow-hidden group">
              <Image
                src={image.web_url}
                alt={image.filename || `Portfolio Image ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={85}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-white py-32">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <Heading level={2} className="text-3xl font-extralight tracking-wider mb-8">
            {content.about_heading}
          </Heading>
          <div className="w-20 h-[1px] bg-gray-300 mx-auto mb-8"></div>
          <p className="text-gray-600 font-light leading-relaxed text-lg font-serif">
            {content.about_text}
          </p>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="bg-gray-50 py-32">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div>
              <h3 className="text-6xl font-extralight text-gray-300 mb-4 font-display">01</h3>
              <h4 className="text-lg tracking-wider mb-3 text-gray-900 font-serif">{content.experience_1_title}</h4>
              <p className="text-gray-600 font-light text-sm leading-relaxed font-sans">
                {content.experience_1_text}
              </p>
            </div>
            <div>
              <h3 className="text-6xl font-extralight text-gray-300 mb-4 font-display">02</h3>
              <h4 className="text-lg tracking-wider mb-3 text-gray-900 font-serif">{content.experience_2_title}</h4>
              <p className="text-gray-600 font-light text-sm leading-relaxed font-sans">
                {content.experience_2_text}
              </p>
            </div>
            <div>
              <h3 className="text-6xl font-extralight text-gray-300 mb-4 font-display">03</h3>
              <h4 className="text-lg tracking-wider mb-3 text-gray-900 font-serif">{content.experience_3_title}</h4>
              <p className="text-gray-600 font-light text-sm leading-relaxed font-sans">
                {content.experience_3_text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="bg-white py-32">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <Heading level={2} className="text-3xl font-extralight tracking-wider mb-8">
            {content.contact_heading}
          </Heading>
          <div className="w-20 h-[1px] bg-gray-300 mx-auto mb-12"></div>

          <Link
            href="/contact"
            className="inline-block border border-gray-900 text-gray-900 px-12 py-4
                     hover:bg-gray-900 hover:text-white transition-all duration-500
                     text-sm tracking-widest font-light font-serif"
          >
            {content.contact_button_text}
          </Link>

          <div className="mt-16 text-gray-400 font-light text-sm font-sans">
            <p>{content.contact_location}</p>
            <p className="mt-2">{content.contact_email}</p>
          </div>
        </div>
      </section>
    </main>
  )
}
