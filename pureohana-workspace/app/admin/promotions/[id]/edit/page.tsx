import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import PromotionForm from '../../PromotionForm'

interface EditPromotionPageProps {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Edit Promotion | Admin',
}

export default async function EditPromotionPage({ params }: EditPromotionPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Check authentication
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/auth/admin')
  }

  // Fetch promotion
  const { data: promotion, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('id', id)
    .eq('photographer_id', session.user.id)
    .single()

  if (error || !promotion) {
    notFound()
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal-900">Edit Promotion</h1>
        <p className="text-charcoal-600 mt-1">
          Update your promotion details
        </p>
      </div>

      <PromotionForm promotion={promotion} mode="edit" />
    </div>
  )
}
