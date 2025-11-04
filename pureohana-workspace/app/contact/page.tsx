import { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'

export const metadata: Metadata = {
  title: 'Contact Us | Pure Ohana Treasures',
  description: 'Ready to capture your precious moments? Get in touch with us today.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-cream-50">
      <Container className="py-20">
        <div className="max-w-2xl mx-auto">
          <Heading level={1} className="text-center mb-4">
            Let's Create Magic Together
          </Heading>
          <p className="text-xl text-center text-charcoal-600 font-serif mb-12">
            Tell us about your vision and we'll make it a reality
          </p>

          <ContactForm />

          <div className="mt-12 text-center">
            <p className="text-charcoal-600 mb-2">Or reach us directly:</p>
            <p className="font-serif text-lg text-charcoal-900">pureohanatreasures@gmail.com</p>
            <p className="text-charcoal-600 mt-4">Aiea, Oahu • Serving all Hawaiian Islands</p>
          </div>
        </div>
      </Container>
    </main>
  )
}
