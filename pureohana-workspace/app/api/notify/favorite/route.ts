import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { sendEmail, getFavoriteEmailTemplate } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { photoId, clientName, clientEmail } = await request.json()

    const supabase = await createServerClient()

    // Get photo and gallery details
    const { data: photo } = await supabase
      .from('photos')
      .select(`
        *,
        galleries (
          *,
          photographers (
            email
          )
        )
      `)
      .eq('id', photoId)
      .single()

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }

    const gallery = (photo.galleries as any)
    const photographer = gallery.photographers

    if (!photographer?.email) {
      return NextResponse.json({ error: 'Photographer email not found' }, { status: 404 })
    }

    // Send email notification
    const html = getFavoriteEmailTemplate({
      galleryTitle: gallery.title,
      photoFilename: photo.filename,
      clientName,
      clientEmail,
      gallerySlug: gallery.slug,
      galleryAccessKey: gallery.access_key
    })

    await sendEmail({
      to: photographer.email,
      subject: `❤️ New favorite on "${gallery.title}"`,
      html
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error sending favorite notification:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
