import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  eventType: string
  eventDate?: string
  vision: string
  referral?: string
}

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Create Supabase client with service role for inserting
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function generateEmailHTML(data: ContactFormData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #D97706;">New Inquiry from Pure Ohana Treasures Website</h2>

      <h3 style="color: #1F2937;">Client Information:</h3>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
      ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}

      <h3 style="color: #1F2937;">Event Details:</h3>
      <p><strong>Type:</strong> ${data.eventType}</p>
      ${data.eventDate ? `<p><strong>Date:</strong> ${new Date(data.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}

      <h3 style="color: #1F2937;">Their Vision:</h3>
      <p style="white-space: pre-wrap;">${data.vision}</p>

      ${data.referral ? `<h3 style="color: #1F2937;">How They Found Us:</h3><p>${data.referral}</p>` : ''}

      <hr style="margin: 20px 0; border: none; border-top: 1px solid #E5E7EB;">
      <p style="color: #6B7280; font-size: 14px;">
        Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'Pacific/Honolulu', dateStyle: 'long', timeStyle: 'short' })} HST
      </p>
    </div>
  `
}

function generatePlainTextEmail(data: ContactFormData): string {
  const eventDate = data.eventDate
    ? `\nDate: ${new Date(data.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
    : ''

  const referral = data.referral ? `\n\nHow They Found Us:\n${data.referral}` : ''

  const phone = data.phone ? `\nPhone: ${data.phone}` : ''

  return `
New Inquiry: ${data.eventType} - ${data.name}

Client Information:
Name: ${data.name}
Email: ${data.email}${phone}

Event Details:
Type: ${data.eventType}${eventDate}

Their Vision:
${data.vision}${referral}

---
Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'Pacific/Honolulu', dateStyle: 'long', timeStyle: 'short' })} HST
`.trim()
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

    // Save to Supabase first
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        event_type: data.eventType,
        event_date: data.eventDate || null,
        vision: data.vision,
        referral: data.referral,
        status: 'new'
      })

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to save submission')
    }

    // Send email notification via Resend
    const { error: emailError } = await resend.emails.send({
      from: 'Pure Ohana Inquiries <onboarding@resend.dev>',
      to: process.env.PHOTOGRAPHER_EMAIL || 'pureohanatreasures@gmail.com',
      replyTo: data.email,
      subject: `New Inquiry: ${data.eventType} - ${data.name}`,
      html: generateEmailHTML(data),
      text: generatePlainTextEmail(data)
    })

    if (emailError) {
      console.error('Email error:', emailError)
      // Don't fail the request if email fails, submission is already saved
    }

    console.log('✅ Contact submission saved and email sent:', {
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
