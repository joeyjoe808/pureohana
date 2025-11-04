import { NextRequest, NextResponse } from 'next/server'

// Note: This is a placeholder implementation
// TODO Phase 5: Add Resend email integration and Supabase storage

interface ContactFormData {
  name: string
  email: string
  phone?: string
  eventType: string
  eventDate?: string
  vision: string
  referral?: string
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.eventType || !data.vision) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // TODO Phase 5: Implement Resend email sending
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'Pure Ohana Treasures <contact@pureohanatreasures.com>',
    //   to: process.env.PHOTOGRAPHER_EMAIL || 'joe@pureohanatreasures.com',
    //   subject: `New Inquiry: ${data.eventType} - ${data.name}`,
    //   html: generateEmailHTML(data)
    // })

    // TODO Phase 5: Save to Supabase contact_submissions table
    // const supabase = createClient()
    // await supabase.from('contact_submissions').insert({
    //   name: data.name,
    //   email: data.email,
    //   phone: data.phone,
    //   event_type: data.eventType,
    //   event_date: data.eventDate,
    //   vision: data.vision,
    //   referral: data.referral
    // })

    console.log('Contact form submission received:', {
      name: data.name,
      email: data.email,
      eventType: data.eventType
    })

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    )
  }
}
