import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase'
import Link from 'next/link'
import { LogOut, LayoutDashboard, Image, Upload, Heart, MessageSquare, Images, FileText, Briefcase, Info, Home, MessagesSquare } from 'lucide-react'

async function AdminNav() {
  return (
    <nav className="bg-charcoal-900 text-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 sm:py-0 sm:h-16">
          <Link href="/admin/dashboard" className="font-display text-xl text-cream-50 hover:text-sunset-400 transition-colors mb-3 sm:mb-0">
            Pure Ohana Admin
          </Link>

          <div className="flex items-center flex-wrap gap-3 sm:gap-4 lg:gap-6">
            <Link href="/admin/dashboard" className="flex items-center gap-1 sm:gap-2 text-cream-100 hover:text-sunset-400 transition-colors font-serif text-sm whitespace-nowrap">
              <LayoutDashboard size={16} className="flex-shrink-0" />
              <span className="hidden md:inline">Dashboard</span>
            </Link>
            <Link href="/admin/galleries" className="flex items-center gap-1 sm:gap-2 text-cream-100 hover:text-sunset-400 transition-colors font-serif text-sm whitespace-nowrap">
              <Image size={16} className="flex-shrink-0" />
              <span className="hidden md:inline">Galleries</span>
            </Link>
            <Link href="/admin/photo-library" className="flex items-center gap-1 sm:gap-2 text-cream-100 hover:text-sunset-400 transition-colors font-serif text-sm whitespace-nowrap">
              <Images size={16} className="flex-shrink-0" />
              <span className="hidden lg:inline">Photo Library</span>
            </Link>
            <Link href="/admin/upload" className="flex items-center gap-1 sm:gap-2 text-cream-100 hover:text-sunset-400 transition-colors font-serif text-sm whitespace-nowrap">
              <Upload size={16} className="flex-shrink-0" />
              <span className="hidden md:inline">Upload</span>
            </Link>
            <Link href="/admin/feedback" className="flex items-center gap-1 sm:gap-2 text-cream-100 hover:text-sunset-400 transition-colors font-serif text-sm whitespace-nowrap">
              <MessagesSquare size={16} className="flex-shrink-0" />
              <span className="hidden md:inline">Feedback</span>
            </Link>
            <Link href="/admin/blog" className="flex items-center gap-1 sm:gap-2 text-cream-100 hover:text-sunset-400 transition-colors font-serif text-sm whitespace-nowrap">
              <FileText size={16} className="flex-shrink-0" />
              <span className="hidden md:inline">Blog</span>
            </Link>
            <Link href="/admin/services" className="flex items-center gap-1 sm:gap-2 text-cream-100 hover:text-sunset-400 transition-colors font-serif text-sm whitespace-nowrap">
              <Briefcase size={16} className="flex-shrink-0" />
              <span className="hidden lg:inline">Services</span>
            </Link>
            <Link href="/admin/about" className="flex items-center gap-1 sm:gap-2 text-cream-100 hover:text-sunset-400 transition-colors font-serif text-sm whitespace-nowrap">
              <Info size={16} className="flex-shrink-0" />
              <span className="hidden lg:inline">About</span>
            </Link>
            <Link href="/admin/home" className="flex items-center gap-1 sm:gap-2 text-cream-100 hover:text-sunset-400 transition-colors font-serif text-sm whitespace-nowrap">
              <Home size={16} className="flex-shrink-0" />
              <span className="hidden lg:inline">Home</span>
            </Link>
            <Link href="/" className="flex items-center gap-1 sm:gap-2 text-cream-100 hover:text-sunset-400 transition-colors font-serif text-sm whitespace-nowrap">
              <span className="hidden md:inline">View Site</span>
              <span className="md:hidden">Site</span>
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="flex items-center gap-1 sm:gap-2 text-cream-100 hover:text-sunset-400 transition-colors font-serif text-sm whitespace-nowrap">
                <LogOut size={16} className="flex-shrink-0" />
                <span className="hidden md:inline">Logout</span>
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
