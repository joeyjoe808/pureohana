import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Get original metadata
    const metadata = await sharp(buffer).metadata()

    // Generate thumbnail (400px wide, maintains aspect ratio)
    const thumbnailBuffer = await sharp(buffer)
      .resize(400, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: 80 })
      .toBuffer()

    // Generate web version (1920px wide, maintains aspect ratio)
    const webBuffer = await sharp(buffer)
      .resize(1920, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: 85 })
      .toBuffer()

    // For very high-res originals, generate a compressed version
    // Otherwise use the web version as original
    let originalBuffer: Buffer
    if (metadata.width && metadata.width > 3000) {
      originalBuffer = await sharp(buffer)
        .resize(3000, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({ quality: 90 })
        .toBuffer()
    } else {
      originalBuffer = buffer
    }

    return NextResponse.json({
      thumbnail: {
        data: thumbnailBuffer.toString('base64'),
        size: thumbnailBuffer.length
      },
      web: {
        data: webBuffer.toString('base64'),
        size: webBuffer.length
      },
      original: {
        data: originalBuffer.toString('base64'),
        size: originalBuffer.length
      },
      metadata: {
        originalWidth: metadata.width,
        originalHeight: metadata.height,
        format: metadata.format
      }
    })
  } catch (error: any) {
    console.error('Image optimization error:', error)
    return NextResponse.json(
      { error: 'Failed to optimize image', details: error.message },
      { status: 500 }
    )
  }
}
