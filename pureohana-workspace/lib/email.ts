import { Resend } from 'resend'

interface EmailParams {
  to: string
  subject: string
  html: string
}

// Lazy-load Resend client to avoid build-time errors when API key is missing
function getResendClient() {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_key') {
    return null
  }
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendEmail({ to, subject, html }: EmailParams) {
  const resend = getResendClient()

  if (!resend) {
    console.log('Resend API key not configured. Email would have been sent:', { to, subject })
    return { success: false, message: 'Resend API key not configured' }
  }

  try {
    await resend.emails.send({
      from: 'Pure Ohana Treasures <noreply@pureohanatreasures.com>',
      to,
      subject,
      html,
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error sending email:', error)
    return { success: false, message: error.message }
  }
}

export function getFavoriteEmailTemplate(params: {
  galleryTitle: string
  photoFilename: string
  clientName: string
  clientEmail?: string
  gallerySlug: string
  galleryAccessKey: string
}) {
  const { galleryTitle, photoFilename, clientName, clientEmail, gallerySlug, galleryAccessKey } = params

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #3d3d3d;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 12px 12px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
          }
          .content {
            background: white;
            padding: 30px;
            border: 1px solid #e5e5e5;
            border-top: none;
            border-radius: 0 0 12px 12px;
          }
          .highlight {
            background: #f5f1ed;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            background: #ff6b35;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 8px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>❤️ New Favorite!</h1>
        </div>
        <div class="content">
          <p>Great news! A client just favorited one of your photos.</p>

          <div class="highlight">
            <p><strong>Gallery:</strong> ${galleryTitle}</p>
            <p><strong>Photo:</strong> ${photoFilename}</p>
            <p><strong>Client:</strong> ${clientName}${clientEmail ? ` (${clientEmail})` : ''}</p>
          </div>

          <p>This is a great indicator that your client loves this photo! Consider reaching out to discuss print options or larger packages.</p>

          <center>
            <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/galleries/${gallerySlug}?key=${galleryAccessKey}" class="button">
              View Gallery
            </a>
          </center>
        </div>

        <div class="footer">
          <p>Pure Ohana Treasures<br>
          Capturing Hawaii's precious moments</p>
        </div>
      </body>
    </html>
  `
}

export function getCommentEmailTemplate(params: {
  galleryTitle: string
  photoFilename: string
  clientName: string
  clientEmail?: string
  commentText: string
  gallerySlug: string
  galleryAccessKey: string
}) {
  const { galleryTitle, photoFilename, clientName, clientEmail, commentText, gallerySlug, galleryAccessKey } = params

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #3d3d3d;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 12px 12px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
          }
          .content {
            background: white;
            padding: 30px;
            border: 1px solid #e5e5e5;
            border-top: none;
            border-radius: 0 0 12px 12px;
          }
          .highlight {
            background: #f5f1ed;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .comment-box {
            background: white;
            border-left: 4px solid #ff6b35;
            padding: 15px;
            margin: 20px 0;
            font-style: italic;
          }
          .button {
            display: inline-block;
            background: #ff6b35;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 8px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>💬 New Comment!</h1>
        </div>
        <div class="content">
          <p>Your client left a comment on one of your photos!</p>

          <div class="highlight">
            <p><strong>Gallery:</strong> ${galleryTitle}</p>
            <p><strong>Photo:</strong> ${photoFilename}</p>
            <p><strong>From:</strong> ${clientName}${clientEmail ? ` (${clientEmail})` : ''}</p>
          </div>

          <div class="comment-box">
            "${commentText}"
          </div>

          <p>Your clients are engaging with your work! This is a great opportunity to respond and build that personal connection.</p>

          <center>
            <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/admin/galleries" class="button">
              View in Dashboard
            </a>
          </center>
        </div>

        <div class="footer">
          <p>Pure Ohana Treasures<br>
          Capturing Hawaii's precious moments</p>
        </div>
      </body>
    </html>
  `
}
