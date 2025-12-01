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
    <nav className="fixed top-0 w-full bg-transparent backdrop-blur-sm z-[60]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="group flex items-baseline gap-2 transition-all">
            <span className="font-display text-2xl text-white group-hover:text-cream-100 transition-colors drop-shadow-lg [text-shadow:_0_2px_4px_rgb(0_0_0_/_80%)]">
              Pure Ohana
            </span>
            <span className="font-script text-4xl text-sunset-400 group-hover:text-sunset-300 transition-colors drop-shadow-lg [text-shadow:_0_2px_4px_rgb(0_0_0_/_80%)]">
              Treasures
            </span>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={'font-serif text-lg transition-colors drop-shadow-md ' + (
                  pathname === link.href
                    ? 'text-sunset-400 font-semibold [text-shadow:_0_2px_4px_rgb(0_0_0_/_80%)]'
                    : 'text-white hover:text-sunset-400 [text-shadow:_0_2px_4px_rgb(0_0_0_/_80%)]'
                )}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <Link
                href="/admin"
                className={
                  'flex items-center gap-2 px-4 py-2 rounded-md font-serif text-sm transition-all drop-shadow-md [text-shadow:_0_2px_4px_rgb(0_0_0_/_80%)] ' +
                  (pathname?.startsWith('/admin')
                    ? 'bg-sunset-600 text-white'
                    : 'bg-charcoal-900/80 text-cream-50 hover:bg-sunset-600')
                }
                title="Admin Dashboard"
              >
                <Shield size={16} />
                Admin
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-white hover:text-sunset-400 transition-colors drop-shadow-md"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 animate-fade-in-up bg-charcoal-900/95 backdrop-blur-md rounded-b-lg -mx-4 px-4">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={'block py-4 font-serif text-lg transition-colors min-h-[48px] flex items-center ' + (
                  pathname === link.href
                    ? 'text-sunset-400 font-semibold'
                    : 'text-white hover:text-sunset-400'
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
                  'flex items-center gap-2 py-4 font-serif text-lg transition-colors min-h-[48px] ' +
                  (pathname?.startsWith('/admin')
                    ? 'text-sunset-400 font-semibold'
                    : 'text-white hover:text-sunset-400')
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
