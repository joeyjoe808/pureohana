'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { MessageCircle, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import type { Comment } from '@/lib/supabase/types'

interface CommentButtonProps {
  photoId: string
  galleryId: string
}

export default function CommentButton({ photoId, galleryId }: CommentButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: ''
  })

  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    loadComments()
  }, [photoId])

  const loadComments = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('photo_id', photoId)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setComments(data)
        setCount(data.length)
      }
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.comment.trim() || isSubmitting) return

    setIsSubmitting(true)

    try {
      const clientName = formData.name.trim() || 'Anonymous'
      const clientEmail = formData.email.trim() || undefined
      const commentText = formData.comment.trim()

      const { error } = await supabase
        .from('comments')
        .insert({
          photo_id: photoId,
          gallery_id: galleryId,
          client_name: clientName,
          client_email: clientEmail,
          comment: commentText
        })

      if (!error) {
        // Send email notification
        fetch('/api/notify/comment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            photoId,
            clientName,
            clientEmail,
            commentText
          })
        }).catch(err => console.error('Error sending notification:', err))

        setFormData({ name: '', email: '', comment: '' })
        await loadComments()
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={openModal}
        className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-soft"
        style={{
          color: count > 0 ? '#D97706' : '#6B7280' // sunset-600 : gray-500
        }}
        aria-label={`View comments (${count})`}
      >
        <MessageCircle className="w-5 h-5" strokeWidth={2} />
        {count > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-sunset-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold shadow-sm"
            style={{ fontSize: '10px' }}
          >
            {count}
          </span>
        )}
      </button>

      {isOpen && mounted && createPortal(
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-luxury"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-cream-200 px-6 py-4 flex items-center justify-between">
              <h3 className="font-display text-2xl text-charcoal-900">
                Comments
              </h3>
              <button
                onClick={closeModal}
                className="text-charcoal-400 hover:text-charcoal-600 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isLoading ? (
                <div className="text-center py-8 font-serif text-charcoal-400">
                  Loading comments...
                </div>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="border-l-2 border-sunset-200 pl-4">
                    <div className="flex items-baseline gap-2 mb-1">
                      {comment.client_name ? (
                        <span className="font-serif font-semibold text-charcoal-900 text-sm">
                          {comment.client_name}
                        </span>
                      ) : (
                        <span className="font-serif font-semibold text-charcoal-400 text-sm">
                          Anonymous
                        </span>
                      )}
                      <span className="font-serif text-xs text-charcoal-400">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="font-serif text-charcoal-700 leading-relaxed">
                      {comment.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 text-charcoal-300" />
                  </div>
                  <p className="font-serif text-charcoal-400 text-sm">
                    No comments yet. Be the first!
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-cream-200 p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block font-serif text-xs uppercase tracking-wider text-charcoal-500 mb-2 font-semibold">
                      Name (optional)
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent transition-all bg-white font-serif text-charcoal-900"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-serif text-xs uppercase tracking-wider text-charcoal-500 mb-2 font-semibold">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent transition-all bg-white font-serif text-charcoal-900"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="comment" className="block font-serif text-xs uppercase tracking-wider text-charcoal-500 mb-2 font-semibold">
                    Comment *
                  </label>
                  <textarea
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full px-4 py-3 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-500 focus:border-transparent transition-all resize-none bg-white font-serif text-charcoal-900"
                    placeholder="Share your thoughts about this photo..."
                    rows={4}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={!formData.comment.trim() || isSubmitting}
                  className="w-full bg-charcoal-900 text-cream-50 px-6 py-3 rounded-lg hover:bg-charcoal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-serif font-semibold uppercase tracking-wider text-sm shadow-soft"
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
