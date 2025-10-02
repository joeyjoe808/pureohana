'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { markCommentAsRead, toggleCommentLike, replyToComment } from '@/app/actions/comments'

interface Comment {
  id: string
  photo_id: string
  gallery_id: string
  client_name: string | null
  client_email: string | null
  comment: string
  is_read: boolean
  photographer_reply: string | null
  is_liked: boolean
  replied_at: string | null
  created_at: string
  photos: {
    id: string
    filename: string
    thumbnail_url: string
    web_url: string
    gallery_id: string
  }
  galleries: {
    id: string
    title: string
    slug: string
    photographer_id: string
  }
}

interface CommentsListProps {
  comments: Comment[]
}

export default function CommentsList({ comments: initialComments }: CommentsListProps) {
  const [comments, setComments] = useState(initialComments)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const router = useRouter()

  const handleMarkAsRead = async (commentId: string) => {
    // Optimistic update
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, is_read: true } : c
    ))

    const result = await markCommentAsRead(commentId)

    if (!result.success) {
      // Revert on error
      setComments(initialComments)
      alert(`Error: ${result.error}\n\nCheck browser console for details.`)
      console.error('Mark as read error:', result.error)
    } else {
      router.refresh()
    }
  }

  const handleToggleLike = async (commentId: string, currentlyLiked: boolean) => {
    // Optimistic update
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, is_liked: !currentlyLiked } : c
    ))

    const result = await toggleCommentLike(commentId, currentlyLiked)

    if (!result.success) {
      // Revert on error
      setComments(initialComments)
      alert(`Error: ${result.error}`)
    }
  }

  const handleSubmitReply = async (commentId: string) => {
    if (!replyText.trim() || isSubmitting) return

    setIsSubmitting(true)

    const result = await replyToComment(commentId, replyText.trim())

    if (result.success) {
      setComments(comments.map(c => 
        c.id === commentId ? { 
          ...c, 
          photographer_reply: replyText.trim(),
          replied_at: new Date().toISOString(),
          is_read: true
        } : c
      ))
      setReplyText('')
      setReplyingTo(null)
      router.refresh()
    } else {
      alert(`Error: ${result.error}`)
    }

    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div 
          key={comment.id}
          className={`border ${comment.is_read ? 'border-gray-100' : 'border-blue-200 bg-blue-50/30'} p-6 transition-colors`}
        >
          <div className="flex gap-6">
            {/* Photo Thumbnail */}
            <Link 
              href={`/gallery/${comment.galleries.slug}?photo=${comment.photo_id}`}
              className="flex-shrink-0 group"
              onClick={() => handleMarkAsRead(comment.id)}
            >
              <div className="relative w-32 h-32 bg-gray-100 overflow-hidden">
                <img
                  src={comment.photos.thumbnail_url}
                  alt={comment.photos.filename}
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Comment Details */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {comment.client_name ? (
                      <span className="font-medium text-gray-900">
                        {comment.client_name}
                      </span>
                    ) : (
                      <span className="font-medium text-gray-400">
                        Anonymous
                      </span>
                    )}
                    {comment.client_email && (
                      <span className="text-sm text-gray-400">
                        ({comment.client_email})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                    <span>•</span>
                    <Link 
                      href={`/galleries/${comment.gallery_id}`}
                      className="hover:text-gray-600 transition-colors"
                    >
                      {comment.galleries.title}
                    </Link>
                  </div>
                </div>

                {/* Status Badge */}
                {!comment.is_read && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    NEW
                  </span>
                )}
              </div>

              {/* Comment Text */}
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                {comment.comment}
              </p>

              {/* Photographer Reply */}
              {comment.photographer_reply && (
                <div className="bg-gray-50 border-l-2 border-gray-900 p-4 mb-4">
                  <div className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
                    Your Reply
                  </div>
                  <p className="text-gray-700 font-light leading-relaxed">
                    {comment.photographer_reply}
                  </p>
                  {comment.replied_at && (
                    <div className="text-xs text-gray-400 mt-2">
                      {formatDistanceToNow(new Date(comment.replied_at), { addSuffix: true })}
                    </div>
                  )}
                </div>
              )}

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className="mb-4 bg-gray-50 p-4 border border-gray-200">
                  <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                    Your Reply
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors resize-none bg-white"
                    style={{ color: '#1a1a1a', fontSize: '14px' }}
                    placeholder="Write your reply..."
                    rows={4}
                    autoFocus
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyText.trim() || isSubmitting}
                      className="bg-gray-900 px-6 py-3 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium uppercase tracking-wider text-xs"
                      style={{ color: '#ffffff' }}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Reply'}
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null)
                        setReplyText('')
                      }}
                      className="px-6 py-3 border border-gray-300 hover:border-gray-500 hover:bg-gray-50 transition-colors font-medium uppercase tracking-wider text-xs"
                      style={{ color: '#1a1a1a' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => handleToggleLike(comment.id, comment.is_liked)}
                  className="flex items-center gap-2 text-sm font-medium hover:text-gray-900 transition-colors"
                  style={{ color: comment.is_liked ? '#ef4444' : '#6b7280' }}
                >
                  <svg className="w-5 h-5" fill={comment.is_liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span style={{ color: comment.is_liked ? '#ef4444' : '#6b7280' }}>
                    {comment.is_liked ? 'Liked' : 'Like'}
                  </span>
                </button>

                {!comment.photographer_reply && (
                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className="flex items-center gap-2 text-sm font-medium transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded"
                    style={{ color: '#2563eb' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    <span style={{ color: '#2563eb' }}>Reply</span>
                  </button>
                )}

                {!comment.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(comment.id)}
                    className="flex items-center gap-2 text-sm font-medium transition-colors bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded"
                    style={{ color: '#1a1a1a' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span style={{ color: '#1a1a1a' }}>Mark as Read</span>
                  </button>
                )}

                <Link
                  href={`/gallery/${comment.galleries.slug}?photo=${comment.photo_id}`}
                  onClick={() => handleMarkAsRead(comment.id)}
                  className="flex items-center gap-2 text-sm font-medium transition-colors ml-auto bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded"
                  style={{ color: '#ffffff' }}
                >
                  <span style={{ color: '#ffffff' }}>View Photo</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
