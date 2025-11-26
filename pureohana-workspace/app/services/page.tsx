import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { createServerClient } from '@/lib/supabase'
import { getServiceSchema, getBreadcrumbSchema } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Photography Services | Pure Ohana Treasures',
  description: 'Island portraits, adventure films, events, and custom memory treasures. Luxury photography services in Hawaii.',
}

export default async function ServicesPage() {
  const supabase = await createServerClient()

  // Fetch active services from database
  const { data: dbServices, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching services:', error)
  }

  // Fallback placeholder services if database is empty
  const placeholderServices = [
    {
      title: 'Island Portrait Sessions',
      description: 'Luxury family and couple portraits across Hawaii\'s most stunning locations',
      features: ['1-2 hour sessions', 'Multiple locations', 'Full resolution digital gallery', 'Print options available'],
      starting_price: '$850',
      cover_image_url: 'https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/ashley%20looking%20into%20isaiahs%20eyes.jpg'
    },
    {
      title: 'Adventure Films & Story Videos',
      description: 'Cinematic storytelling that captures your ohana\'s unique journey',
      features: ['Professional cinematography', 'Drone footage', 'Custom editing', '3-5 minute highlight film'],
      starting_price: '$2,500',
      cover_image_url: 'https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/untitled-03371.jpg'
    },
    {
      title: 'Events, Luau & Special Days',
      description: 'Comprehensive event coverage with luxury attention to detail',
      features: ['Full day coverage', 'Multiple photographers', 'Online gallery', 'Same-week previews'],
      starting_price: '$3,500',
      cover_image_url: 'https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/rosaries-grad-group.jpg'
    },
    {
      title: 'Custom Memory Treasures',
      description: 'Bespoke photography collections tailored to your vision',
      features: ['Personalized planning', 'Unlimited locations', 'Custom albums', 'Heirloom prints'],
      starting_price: 'Custom',
      cover_image_url: 'https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/untitled-9870.jpg'
    }
  ]

  const services = dbServices && dbServices.length > 0 ? dbServices : placeholderServices

  // Breadcrumbs
  const breadcrumbs = [
    { name: 'Home', url: 'https://pureohanatreasures.com' },
    { name: 'Services', url: 'https://pureohanatreasures.com/services' },
  ]

  return (
    <main className="min-h-screen bg-cream-50">
      {/* Structured Data - Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbSchema(breadcrumbs)) }}
      />

      {/* Structured Data - Services */}
      {services.map((service, idx) => (
        <script
          key={service.id || idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              getServiceSchema({
                name: service.title,
                description: service.description,
                price: service.starting_price,
                image: service.cover_image_url,
              })
            ),
          }}
        />
      ))}

      <Container className="py-20">
        <Heading level={1} className="text-center mb-4">Our Services</Heading>
        <p className="text-xl text-center text-charcoal-600 font-serif mb-16 max-w-3xl mx-auto">
          Luxury photography and cinematography services across the Hawaiian islands
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((service, idx) => (
            <div key={service.id || idx} className="bg-white rounded-luxury shadow-luxury overflow-hidden">
              {service.cover_image_url && (
                <div className="relative h-64">
                  <Image
                    src={service.cover_image_url}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="p-8">
                <Heading level={3} className="mb-3">{service.title}</Heading>
                <p className="text-charcoal-600 font-serif mb-4">{service.description}</p>

                {service.features && Array.isArray(service.features) && service.features.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature: string, featureIdx: number) => (
                      <li key={featureIdx} className="text-sm text-charcoal-700 flex items-center">
                        <span className="w-1.5 h-1.5 bg-sunset-600 rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                <p className="text-2xl font-display text-sunset-600 mb-4">Starting at {service.starting_price}</p>

                <Link href="/contact">
                  <Button variant="primary" className="w-full">Inquire</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-12 rounded-luxury shadow-luxury text-center">
          <Heading level={2} className="mb-6">Ready to Begin?</Heading>
          <p className="text-xl font-serif text-charcoal-600 mb-8 max-w-2xl mx-auto">
            Let's create something beautiful together. Contact us to discuss your vision.
          </p>
          <Link href="/contact">
            <Button variant="primary" size="lg">Get in Touch</Button>
          </Link>
        </div>
      </Container>
    </main>
  )
}
