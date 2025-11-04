import Link from 'next/link'
import { Instagram, Facebook, Mail } from 'lucide-react'

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
              <li><Link href="/about" className="text-cream-300 hover:text-cream-50 transition-colors text-sm">About</Link></li>
              <li><Link href="/services" className="text-cream-300 hover:text-cream-50 transition-colors text-sm">Services</Link></li>
              <li><Link href="/portfolio" className="text-cream-300 hover:text-cream-50 transition-colors text-sm">Portfolio</Link></li>
              <li><Link href="/blog" className="text-cream-300 hover:text-cream-50 transition-colors text-sm">Blog</Link></li>
              <li><Link href="/contact" className="text-cream-300 hover:text-cream-50 transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-cream-300 text-sm">
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-1 flex-shrink-0" />
                <a href="mailto:pureohanatreasures@gmail.com" className="hover:text-cream-50 transition-colors">
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
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/pureohanatreasures/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cream-300 hover:text-cream-50 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="#" 
                className="text-cream-300 hover:text-cream-50 transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={24} />
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
