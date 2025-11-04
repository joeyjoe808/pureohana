/**
 * Seed Test Gallery - Pure Ohana Treasures
 *
 * Creates a test gallery with sample photos for Phase 4 testing
 * Usage: node scripts/seed-test-gallery.mjs
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mnsienbfqpbdfbqefmft.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc2llbmJmcXBiZGZicWVmbWZ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjA1Njg1NywiZXhwIjoyMDc3NjMyODU3fQ.T1sHHY661UGj-R_RyQ6XJPifkOetY_4sDQyDWZsmweE'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedTestGallery() {
  console.log('🌺 Starting test gallery seed...\n')

  // 1. Create a test auth user first
  console.log('👤 Creating test auth user...')
  const testEmail = 'joe@pureohanatreasures.com'
  const testPassword = 'TestPassword123!'

  // Try to sign up (will fail if user exists, which is fine)
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        full_name: 'Joe Smith',
        business_name: 'Pure Ohana Treasures'
      }
    }
  })

  let photographerId

  if (signUpError && signUpError.message.includes('already registered')) {
    // User exists, get their ID
    const { data: signInData } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    })
    photographerId = signInData?.user?.id
    console.log('✅ Using existing auth user:', photographerId)
  } else if (signUpData?.user) {
    photographerId = signUpData.user.id
    console.log('✅ Auth user created:', photographerId)

    // Create photographer profile
    await supabase.from('photographers').insert({
      id: photographerId,
      email: testEmail,
      full_name: 'Joe Smith',
      business_name: 'Pure Ohana Treasures',
      avatar_url: null
    })
    console.log('✅ Photographer profile created')
  } else {
    console.error('❌ Error creating user:', signUpError)
    return
  }

  // 2. Create test gallery
  console.log('\n📁 Creating test gallery...')
  const galleryId = crypto.randomUUID()
  const accessKey = crypto.randomUUID()

  const { data: gallery, error: galleryError } = await supabase
    .from('galleries')
    .insert({
      id: galleryId,
      photographer_id: photographerId,
      title: 'Smith Family Beach Session',
      slug: 'smith-family-beach',
      description: 'A beautiful afternoon capturing the Smith family at Sunset Beach. These moments of joy and connection will be treasured for generations.',
      access_key: accessKey,
      is_public: false,
      view_count: 0
    })
    .select()
    .single()

  if (galleryError) {
    console.error('❌ Error creating gallery:', galleryError)
    return
  }

  console.log('✅ Gallery created!')
  console.log(`   ID: ${galleryId}`)
  console.log(`   Slug: smith-family-beach`)
  console.log(`   Access Key: ${accessKey}`)
  console.log(`   \n   🔗 View at: http://localhost:3001/galleries/smith-family-beach?key=${accessKey}\n`)

  // 3. Add sample photos (using placeholder images)
  console.log('📷 Adding sample photos...\n')

  const samplePhotos = [
    {
      filename: 'sunset-beach-1.jpg',
      thumbnail_url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=600&fit=crop',
      web_url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920&h=1080&fit=crop',
      original_url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=4000&h=3000&fit=crop',
      width: 4000,
      height: 3000,
      file_size: 2500000,
      position: 1
    },
    {
      filename: 'family-portrait-1.jpg',
      thumbnail_url: 'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=400&h=600&fit=crop',
      web_url: 'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=1920&h=1080&fit=crop',
      original_url: 'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=4000&h=3000&fit=crop',
      width: 4000,
      height: 3000,
      file_size: 2800000,
      position: 2
    },
    {
      filename: 'kids-playing-1.jpg',
      thumbnail_url: 'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=400&h=600&fit=crop',
      web_url: 'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=1920&h=1080&fit=crop',
      original_url: 'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=4000&h=3000&fit=crop',
      width: 4000,
      height: 3000,
      file_size: 2300000,
      position: 3
    },
    {
      filename: 'golden-hour-1.jpg',
      thumbnail_url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&h=600&fit=crop',
      web_url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1920&h=1080&fit=crop',
      original_url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=4000&h=3000&fit=crop',
      width: 4000,
      height: 3000,
      file_size: 2600000,
      position: 4
    },
    {
      filename: 'beach-walk-1.jpg',
      thumbnail_url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=600&fit=crop',
      web_url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1920&h=1080&fit=crop',
      original_url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=4000&h=3000&fit=crop',
      width: 4000,
      height: 3000,
      file_size: 2400000,
      position: 5
    },
    {
      filename: 'sunset-silhouette-1.jpg',
      thumbnail_url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&h=600&fit=crop',
      web_url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1920&h=1080&fit=crop',
      original_url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=4000&h=3000&fit=crop',
      width: 4000,
      height: 3000,
      file_size: 2700000,
      position: 6
    }
  ]

  for (const photo of samplePhotos) {
    const { error: photoError } = await supabase
      .from('photos')
      .insert({
        id: crypto.randomUUID(),
        gallery_id: galleryId,
        ...photo,
        is_public_portfolio: false
      })

    if (photoError) {
      console.error(`❌ Error adding ${photo.filename}:`, photoError)
    } else {
      console.log(`✅ Added ${photo.filename}`)
    }
  }

  console.log('\n✨ Test gallery seeded successfully!')
  console.log('\n📋 Testing Instructions:')
  console.log('   1. Visit: http://localhost:3001/galleries/smith-family-beach?key=' + accessKey)
  console.log('   2. Test favorite button (heart icon on photos)')
  console.log('   3. Test comment button (message icon on photos)')
  console.log('   4. Test lightbox (click on any photo)')
  console.log('   5. Test without access key (should show access required)')
  console.log('\n')
}

seedTestGallery().catch(console.error)
