import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase'
import Link from 'next/link'
import { LogOut, LayoutDashboard, Image, Upload, Heart, MessageSquare, Images, FileText, Briefcase, Info, Home } from 'lucide-react'

async function AdminNav() {
  return (
    <nav className="bg-charcoal-900 text-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/admin/dashboard" className="font-display text-xl text-cream-50 hover:text-sunset-400 transition-colors">
            Pure Ohana Admin
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2 text-cream-100 hover:text-sunset-400 transition-colors font-serif">
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link href="/admin/galleries" className="flex items-center gap-2 text-cream-100 hover:text-sunset-400 transition-colors font-serif">
              <Image size={18} />
              Galleries
            </Link>
            <Link href="/admin/photo-library" className="flex items-center gap-2 text-cream-100 hover:text-sunset-400 transition-colors font-serif">
              <Images size={18} />
              Photo Library
            </Link>
            <Link href="/admin/upload" className="flex items-center gap-2 text-cream-100 hover:text-sunset-400 transition-colors font-serif">
              <Upload size={18} />
              Upload
            </Link>
            <Link href="/admin/blog" className="flex items-center gap-2 text-cream-100 hover:text-sunset-400 transition-colors font-serif">
              <FileText size={18} />
              Blog
            </Link>
            <Link href="/admin/services" className="flex items-center gap-2 text-cream-100 hover:text-sunset-400 transition-colors font-serif">
              <Briefcase size={18} />
              Services
            </Link>
            <Link href="/admin/about" className="flex items-center gap-2 text-cream-100 hover:text-sunset-400 transition-colors font-serif">
              <Info size={18} />
              About
            </Link>
            <Link href="/admin/home" className="flex items-center gap-2 text-cream-100 hover:text-sunset-400 transition-colors font-serif">
              <Home size={18} />
              Home
            </Link>
            <Link href="/" className="flex items-center gap-2 text-cream-100 hover:text-sunset-400 transition-colors font-serif">
              View Site
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="flex items-center gap-2 text-cream-100 hover:text-sunset-400 transition-colors font-serif">
                <LogOut size={18} />
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/admin')
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <AdminNav />
      <main>{children}</main>
    </div>
  )
}
