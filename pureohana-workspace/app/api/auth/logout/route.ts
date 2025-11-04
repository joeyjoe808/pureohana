import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const supabase = await createServerClient()

  // Sign out from Supabase
  await supabase.auth.signOut()

  // Clear all auth-related cookies for extra security
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()

  const response = NextResponse.redirect(new URL('/', request.url))

  // Remove all Supabase auth cookies
  allCookies.forEach(cookie => {
    if (cookie.name.includes('supabase') || cookie.name.includes('auth')) {
      response.cookies.delete(cookie.name)
    }
  })

  return response
}
