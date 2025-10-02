import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <nav className="flex justify-between items-center mb-24">
          <h1 className="text-2xl font-serif font-light text-gray-900 tracking-tight">
            Pure Ohana Treasures
          </h1>
          <div className="flex items-center gap-8">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900 transition uppercase tracking-wider"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-gray-900 text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition uppercase tracking-wider"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto text-center space-y-16">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-serif font-light text-gray-900 leading-tight tracking-tight">
              Island memories,
              <br />
              beautifully delivered
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
              Professional photography galleries for Pure Ohana Treasures.
              Share stunning galleries, receive client favorites, and sell prints seamlessly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signup"
              className="bg-gray-900 text-white px-10 py-4 text-sm font-medium hover:bg-gray-800 transition uppercase tracking-wider"
            >
              Create Your Gallery
            </Link>
            <Link
              href="/login"
              className="bg-white text-gray-900 px-10 py-4 text-sm font-medium hover:bg-gray-50 transition border border-gray-200 uppercase tracking-wider"
            >
              Sign In
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mt-24 text-left">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gray-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-light text-gray-900">
                Beautiful Galleries
              </h3>
              <p className="text-gray-500 font-light leading-relaxed">
                Share 300-500 photos per gallery with stunning quilted grid layouts
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-gray-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-light text-gray-900">
                Client Favorites
              </h3>
              <p className="text-gray-500 font-light leading-relaxed">
                Clients can heart their favorite photos and leave comments
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-gray-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-light text-gray-900">
                Print Orders
              </h3>
              <p className="text-gray-500 font-light leading-relaxed">
                Seamless print ordering with automatic fulfillment via WHCC
              </p>
            </div>
          </div>

          <div className="mt-32 pt-16 border-t border-gray-100">
            <h3 className="text-3xl font-serif font-light text-gray-900 mb-4">
              Ready to showcase your work?
            </h3>
            <p className="text-gray-500 mb-8 font-light">
              Join Pure Ohana Treasures and deliver stunning gallery experiences
            </p>
            <Link
              href="/signup"
              className="inline-block bg-gray-900 text-white px-12 py-4 text-sm font-medium hover:bg-gray-800 transition uppercase tracking-wider"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
