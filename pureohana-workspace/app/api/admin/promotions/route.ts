import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Create promotion
    const { data, error } = await supabase
      .from('promotions')
      .insert({
        ...body,
        photographer_id: session.user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating promotion:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/promotions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
