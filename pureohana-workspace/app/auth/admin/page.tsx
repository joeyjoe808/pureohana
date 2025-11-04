'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectTo = searchParams.get('redirectTo') || '/admin/dashboard'
  const reason = searchParams.get('reason')

  useEffect(() => {
    if (reason === 'session_expired') {
      setError('Your session has expired. Please login again.')
    }
  }, [reason])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Redirect to intended page or dashboard
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-cream-50 flex items-center justify-center">
      <Container className="max-w-md">
        <div className="bg-white rounded-luxury-lg shadow-luxury-lg p-8">
          <Heading level={1} className="text-center mb-2">
            Admin Login
          </Heading>
          <p className="text-center text-charcoal-600 font-serif mb-8">
            Sign in to manage your galleries
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-luxury">
              <p className="text-red-600 font-serif text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block font-serif text-sm font-medium text-charcoal-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="joe@pureohana.com"
                className="w-full px-4 py-3 border border-charcoal-200 rounded-luxury focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent font-serif"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-serif text-sm font-medium text-charcoal-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-charcoal-200 rounded-luxury focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent font-serif"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sunset-600 text-white py-3 px-6 rounded-luxury font-serif font-medium hover:bg-sunset-700 transition-colors shadow-luxury disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </Container>
    </main>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-cream-50 flex items-center justify-center">
        <Container className="max-w-md">
          <div className="bg-white rounded-luxury-lg shadow-luxury-lg p-8">
            <Heading level={1} className="text-center mb-2">
              Admin Login
            </Heading>
            <p className="text-center text-charcoal-600 font-serif">
              Loading...
            </p>
          </div>
        </Container>
      </main>
    }>
      <AdminLoginForm />
    </Suspense>
  )
}
