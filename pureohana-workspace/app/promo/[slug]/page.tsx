import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Sparkles, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/Button'

interface PromoPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PromoPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: promo } = await supabase
    .from('promotions')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!promo) {
    return {
      title: 'Promotion Not Found | Pure Ohana Treasures',
    }
  }

  return {
    title: `${promo.title} | Pure Ohana Treasures`,
    description: promo.tagline || promo.description,
  }
}

export default async function PromoPage({ params }: PromoPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch promotion details
  const { data: promo, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !promo) {
    notFound()
  }

  // Increment view count
  await supabase
    .from('promotions')
    .update({ view_count: promo.view_count + 1 })
    .eq('id', promo.id)

  // Check if promotion is valid by date
  const now = new Date()
  const validFrom = promo.valid_from ? new Date(promo.valid_from) : null
  const validUntil = promo.valid_until ? new Date(promo.valid_until) : null

  const isDateValid = (!validFrom || now >= validFrom) && (!validUntil || now <= validUntil)

  return (
    <main className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
        {promo.hero_image_url ? (
          <Image
            src={promo.hero_image_url}
            alt={promo.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sunset-200 via-gold-100 to-ocean-100" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/40 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
            {promo.is_featured && (
              <div className="flex items-center gap-2 mb-4 animate-fade-in">
                <Sparkles className="w-5 h-5 text-gold-400" />
                <span className="text-gold-300 font-serif text-sm uppercase tracking-wider">
                  Featured Offer
                </span>
              </div>
            )}

            <Heading level={1} className="text-cream-50 mb-4 animate-fade-in-up">
              {promo.title}
            </Heading>

            {promo.tagline && (
              <p className="text-xl md:text-2xl text-cream-200 font-serif max-w-3xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                {promo.tagline}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Pricing Card */}
        <div className="bg-white rounded-luxury-xl shadow-luxury-xl p-8 md:p-12 mb-12 border border-gold-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* Pricing */}
            <div>
              <div className="flex items-baseline gap-4 mb-2">
                {promo.original_price && (
                  <span className="text-2xl text-charcoal-400 line-through font-serif">
                    {promo.original_price}
                  </span>
                )}
                <span className="text-5xl font-bold text-sunset-600 font-display">
                  {promo.promotional_price}
                </span>
              </div>

              {promo.savings_text && (
                <div className="inline-block bg-sunset-100 text-sunset-900 px-4 py-2 rounded-luxury-lg font-semibold">
                  {promo.savings_text}
                </div>
              )}

              {/* Valid Dates */}
              {(validFrom || validUntil) && (
                <div className="flex items-center gap-2 mt-4 text-charcoal-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-serif">
                    {validFrom && validUntil
                      ? `Valid ${new Date(validFrom).toLocaleDateString()} - ${new Date(validUntil).toLocaleDateString()}`
                      : validFrom
                      ? `Valid from ${new Date(validFrom).toLocaleDateString()}`
                      : `Valid until ${new Date(validUntil!).toLocaleDateString()}`}
                  </span>
                </div>
              )}

              {!isDateValid && (
                <div className="mt-4 text-sunset-700 font-semibold">
                  This promotion is not currently active.
                </div>
              )}
            </div>

            {/* CTA Button */}
            {isDateValid && (
              <div>
                <Link href={`/contact?promo=${promo.slug}`}>
                  <Button variant="primary" size="lg" className="text-lg px-8 py-4 whitespace-nowrap">
                    Inquire Now
                  </Button>
                </Link>
                <p className="text-xs text-charcoal-500 mt-2 text-center">
                  Limited time offer
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="bg-cream-100 rounded-luxury-lg p-8">
            <h2 className="text-3xl font-serif font-bold text-charcoal-900 mb-4">
              About This Offer
            </h2>
            <p className="text-charcoal-700 leading-relaxed whitespace-pre-line">
              {promo.description}
            </p>
          </div>
        </div>

        {/* Highlights */}
        {promo.highlights && promo.highlights.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-charcoal-900 mb-6 text-center">
              What's Included
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {promo.highlights.map((highlight: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-white p-4 rounded-luxury-lg shadow-soft"
                >
                  <Check className="w-6 h-6 text-ocean-600 flex-shrink-0 mt-1" />
                  <span className="text-charcoal-800">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Secondary Image */}
        {promo.secondary_image_url && (
          <div className="relative w-full h-96 rounded-luxury-xl overflow-hidden mb-12 shadow-luxury-lg">
            <Image
              src={promo.secondary_image_url}
              alt={`${promo.title} preview`}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Terms & Conditions */}
        {promo.terms_conditions && (
          <div className="bg-charcoal-50 rounded-luxury-lg p-8 mb-12">
            <h3 className="text-xl font-serif font-semibold text-charcoal-900 mb-4">
              Terms & Conditions
            </h3>
            <div className="text-sm text-charcoal-700 whitespace-pre-line leading-relaxed">
              {promo.terms_conditions}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        {isDateValid && (
          <div className="text-center bg-gradient-to-r from-sunset-50 to-gold-50 rounded-luxury-xl p-12 shadow-luxury">
            <h3 className="text-3xl font-serif font-bold text-charcoal-900 mb-4">
              Ready to Capture Your Memories?
            </h3>
            <p className="text-charcoal-600 mb-8 text-lg">
              Don't miss out on this exclusive offer. Book your session today!
            </p>
            <Link href={`/contact?promo=${promo.slug}`}>
              <Button variant="primary" size="lg" className="text-lg px-12 py-4">
                Inquire About This Promotion
              </Button>
            </Link>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-ocean-600 hover:text-ocean-700 font-serif underline"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
