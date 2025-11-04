'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'

export default function GalleryAccessPage() {
  const router = useRouter()
  const [slug, setSlug] = useState('')
  const [accessKey, setAccessKey] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (slug && accessKey) {
      router.push(`/galleries/${slug}?key=${accessKey}`)
    }
  }

  return (
    <main className="min-h-screen bg-cream-50 flex items-center justify-center">
      <Container className="max-w-md">
        <div className="bg-white rounded-luxury-lg shadow-luxury-lg p-8">
          <Heading level={1} className="text-center mb-2">
            Access Your Gallery
          </Heading>
          <p className="text-center text-charcoal-600 font-serif mb-8">
            Enter your gallery details to view your photos
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="slug" className="block font-serif text-sm font-medium text-charcoal-700 mb-2">
                Gallery Name
              </label>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g., smith-family-beach"
                className="w-full px-4 py-3 border border-charcoal-200 rounded-luxury focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent font-serif"
                required
              />
            </div>

            <div>
              <label htmlFor="accessKey" className="block font-serif text-sm font-medium text-charcoal-700 mb-2">
                Access Key
              </label>
              <input
                type="text"
                id="accessKey"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Enter your access key"
                className="w-full px-4 py-3 border border-charcoal-200 rounded-luxury focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent font-serif"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sunset-600 text-white py-3 px-6 rounded-luxury font-serif font-medium hover:bg-sunset-700 transition-colors shadow-luxury"
            >
              View Gallery
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-charcoal-100">
            <p className="text-xs text-charcoal-500 text-center font-serif">
              Gallery details provided in your email invitation
            </p>
          </div>
        </div>
      </Container>
    </main>
  )
}
