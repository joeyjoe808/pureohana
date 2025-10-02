'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markCommentAsRead(commentId: string) {
  const supabase = await createClient()
  
  // Get current user to verify auth
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Update comment
  const { error } = await supabase
    .from('comments')
    .update({ is_read: true })
    .eq('id', commentId)

  if (error) {
    console.error('Error marking comment as read:', error)
    return { success: false, error: error.message }
  }

  // Revalidate both pages
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/comments')

  return { success: true }
}

export async function toggleCommentLike(commentId: string, currentlyLiked: boolean) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('comments')
    .update({ is_liked: !currentlyLiked })
    .eq('id', commentId)

  if (error) {
    console.error('Error toggling like:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/comments')

  return { success: true }
}

export async function replyToComment(commentId: string, reply: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('comments')
    .update({ 
      photographer_reply: reply,
      replied_at: new Date().toISOString(),
      is_read: true
    })
    .eq('id', commentId)

  if (error) {
    console.error('Error replying to comment:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/comments')

  return { success: true }
}
