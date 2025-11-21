import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PromotionsClient from './PromotionsClient'

export const metadata = {
  title: 'Manage Promotions | Admin',
}

export default async function PromotionsPage() {
  const supabase = await createClient()

  // Check authentication
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/auth/admin')
  }

  // Fetch all promotions
  const { data: promotions, error } = await supabase
    .from('promotions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching promotions:', error)
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Promotions</h1>
        <p className="text-charcoal-700">{error.message}</p>
      </div>
    )
  }

  return <PromotionsClient initialPromotions={promotions || []} />
}
