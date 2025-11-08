import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(request: NextRequest) {
  try {
    const { photo_id, gallery_id, client_identifier } = await request.json()

    const supabase = createServiceClient()

    // Insert favorite using service role client (bypasses RLS)
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        photo_id,
        gallery_id,
        client_identifier
      })
      .select()

    if (error) {
      console.error('Error inserting favorite:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Error in favorites API:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const photo_id = searchParams.get('photo_id')
    const client_identifier = searchParams.get('client_identifier')

    if (!photo_id || !client_identifier) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Delete favorite using service role client (bypasses RLS)
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('photo_id', photo_id)
      .eq('client_identifier', client_identifier)

    if (error) {
      console.error('Error deleting favorite:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in favorites DELETE API:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
