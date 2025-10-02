import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CommentsList from '@/components/dashboard/CommentsList'

export const revalidate = 0

export default async function CommentsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get all comments for photographer's galleries
  const { data: comments, error } = await supabase
    .from('comments')
    .select(`
      *,
      photos!inner(
        id,
        filename,
        thumbnail_url,
        web_url,
        gallery_id
      ),
      galleries!inner(
        id,
        title,
        slug,
        photographer_id
      )
    `)
    .eq('galleries.photographer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching comments:', error)
  }
  
  console.log('Comments query result:', { 
    commentsCount: comments?.length || 0, 
    userId: user.id,
    error: error?.message 
  })

  // Count unread comments
  const unreadCount = comments?.filter(c => !c.is_read).length || 0

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href="/dashboard"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2 inline-block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-serif font-light text-gray-900 tracking-tight">
                Comments
              </h1>
            </div>
            {unreadCount > 0 && (
              <div className="bg-blue-50 px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-blue-600">
                  {unreadCount} unread
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {comments && comments.length > 0 ? (
          <CommentsList comments={comments} />
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-light text-gray-900 mb-2">
              No comments yet
            </h3>
            <p className="text-gray-500 font-light">
              When clients comment on photos, they'll appear here
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
