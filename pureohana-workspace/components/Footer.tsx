import Link from 'next/link'
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-charcoal-900 text-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl mb-4">Pure Ohana</h3>
            <p className="text-cream-300 font-sans text-sm">
              Capturing life's precious moments with luxury and aloha.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="inline-block text-cream-300 hover:text-cream-50 transition-colors text-sm py-2 min-h-[48px] flex items-center">About</Link></li>
              <li><Link href="/services" className="inline-block text-cream-300 hover:text-cream-50 transition-colors text-sm py-2 min-h-[48px] flex items-center">Services</Link></li>
              <li><Link href="/portfolio" className="inline-block text-cream-300 hover:text-cream-50 transition-colors text-sm py-2 min-h-[48px] flex items-center">Portfolio</Link></li>
              <li><Link href="/blog" className="inline-block text-cream-300 hover:text-cream-50 transition-colors text-sm py-2 min-h-[48px] flex items-center">Blog</Link></li>
              <li><Link href="/contact" className="inline-block text-cream-300 hover:text-cream-50 transition-colors text-sm py-2 min-h-[48px] flex items-center">Contact</Link></li>
              <li><Link href="/privacy" className="inline-block text-cream-300 hover:text-cream-50 transition-colors text-sm py-2 min-h-[48px] flex items-center">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-cream-300 text-sm">
              <li className="flex items-center gap-2 min-h-[48px]">
                <Mail size={16} className="flex-shrink-0" />
                <a href="mailto:pureohanatreasures@gmail.com" className="hover:text-cream-50 transition-colors py-2 flex items-center">
                  pureohanatreasures@gmail.com
                </a>
              </li>
              <li className="mt-4">
                <p>Aiea, Oahu</p>
                <p>Serving all Hawaiian Islands</p>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-serif text-lg mb-4">Follow Us</h4>
            <div className="flex gap-2">
              <a
                href="https://www.instagram.com/pureohanatreasures/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream-300 hover:text-cream-50 transition-colors p-3 min-w-[48px] min-h-[48px] flex items-center justify-center"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://www.facebook.com/pureohanatreasures/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream-300 hover:text-cream-50 transition-colors p-3 min-w-[48px] min-h-[48px] flex items-center justify-center"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://twitter.com/pureohana"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream-300 hover:text-cream-50 transition-colors p-3 min-w-[48px] min-h-[48px] flex items-center justify-center"
                aria-label="Follow us on Twitter"
              >
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-cream-800 mt-8 pt-8 text-center text-cream-400 text-sm">
          <p>&copy; {currentYear} Pure Ohana Treasures LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
