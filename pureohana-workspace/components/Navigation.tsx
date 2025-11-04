'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
    { href: '/access', label: 'Client Login' }
  ]

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-luxury z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="group flex items-baseline gap-2 transition-all">
            <span className="font-display text-2xl text-charcoal-900 group-hover:text-charcoal-700 transition-colors">
              Pure Ohana
            </span>
            <span className="font-darlington text-4xl text-sunset-600 group-hover:text-sunset-700 transition-colors leading-none tracking-widest">
              Treasures
            </span>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={'font-serif text-lg transition-colors ' + (
                  pathname === link.href
                    ? 'text-sunset-600 font-semibold'
                    : 'text-charcoal-700 hover:text-sunset-600'
                )}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <Link
                href="/admin"
                className={
                  'flex items-center gap-2 px-4 py-2 rounded-md font-serif text-sm transition-all ' +
                  (pathname?.startsWith('/admin')
                    ? 'bg-sunset-600 text-white'
                    : 'bg-charcoal-900 text-cream-50 hover:bg-sunset-600')
                }
                title="Admin Dashboard"
              >
                <Shield size={16} />
                Admin
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-charcoal-900 hover:text-sunset-600 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 animate-fade-in-up">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={'block py-3 font-serif text-lg transition-colors ' + (
                  pathname === link.href
                    ? 'text-sunset-600 font-semibold'
                    : 'text-charcoal-700'
                )}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className={
                  'flex items-center gap-2 py-3 font-serif text-lg transition-colors ' +
                  (pathname?.startsWith('/admin')
                    ? 'text-sunset-600 font-semibold'
                    : 'text-charcoal-900')
                }
              >
                <Shield size={20} />
                Admin Dashboard
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
