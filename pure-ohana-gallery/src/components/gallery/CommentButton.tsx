'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'

interface Comment {
  id: string
  photo_id: string
  gallery_id: string
  client_name: string | null
  client_email: string | null
  comment: string
  created_at: string
}

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
      const { error } = await supabase
        .from('comments')
        .insert({
          photo_id: photoId,
          gallery_id: galleryId,
          client_name: formData.name.trim() || null,
          client_email: formData.email.trim() || null,
          comment: formData.comment.trim()
        })

      if (!error) {
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
        className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm p-2 hover:bg-white transition-all duration-150 opacity-0 group-hover:opacity-100"
        style={{ 
          color: count > 0 ? '#3b82f6' : '#6b7280',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
        aria-label={`View comments (${count})`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        {count > 0 && (
          <span 
            className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
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
            className="bg-white max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
          >
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-serif font-light text-gray-900">
                Comments
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isLoading ? (
                <div className="text-center py-8 text-gray-400 font-light">
                  Loading comments...
                </div>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="border-l-2 border-gray-100 pl-4">
                    <div className="flex items-baseline gap-2 mb-1">
                      {comment.client_name ? (
                        <span className="font-medium text-gray-900 text-sm">
                          {comment.client_name}
                        </span>
                      ) : (
                        <span className="font-medium text-gray-400 text-sm">
                          Anonymous
                        </span>
                      )}
                      <span className="text-xs text-gray-400 font-light">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-gray-700 font-light leading-relaxed">
                      {comment.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 font-light text-sm">
                    No comments yet. Be the first!
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
                      Name (optional)
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors bg-white"
                      style={{ color: '#1a1a1a', fontSize: '14px' }}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors bg-white"
                      style={{ color: '#1a1a1a', fontSize: '14px' }}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="comment" className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
                    Comment *
                  </label>
                  <textarea
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors resize-none bg-white"
                    style={{ color: '#1a1a1a', fontSize: '14px' }}
                    placeholder="Share your thoughts about this photo..."
                    rows={4}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={!formData.comment.trim() || isSubmitting}
                  className="w-full bg-gray-900 text-white px-6 py-3 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium uppercase tracking-wider text-xs"
                  style={{ color: '#ffffff' }}
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
