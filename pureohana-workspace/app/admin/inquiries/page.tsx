import { createServerClient } from '@/lib/supabase'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'
import InquiriesClient from './InquiriesClient'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function InquiriesPage() {
  const supabase = await createServerClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Fetch all contact submissions
  const { data: inquiries } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <Container className="py-12">
      <div className="mb-8">
        <Heading level={1} className="mb-2">Client Inquiries</Heading>
        <p className="font-serif text-lg text-charcoal-600">
          Manage and track all client inquiries from your contact form
        </p>
      </div>

      <InquiriesClient inquiries={inquiries || []} />
    </Container>
  )
}
