import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PromotionForm from '../PromotionForm'

export const metadata = {
  title: 'New Promotion | Admin',
}

export default async function NewPromotionPage() {
  const supabase = await createClient()

  // Check authentication
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/auth/admin')
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal-900">Create New Promotion</h1>
        <p className="text-charcoal-600 mt-1">
          Set up a new seasonal offer or special deal for your photography services
        </p>
      </div>

      <PromotionForm mode="create" />
    </div>
  )
}
