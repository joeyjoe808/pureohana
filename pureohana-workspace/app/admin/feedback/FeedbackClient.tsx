'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, MessageSquare, Filter, Check, X, Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import type { Favorite, Comment, Gallery } from '@/lib/supabase/types'

type EnrichedFavorite = Favorite & {
  photo: {
    id: string
    gallery_id: string
    filename: string
    thumbnail_url: string
  }
  gallery: {
    id: string
    title: string
    slug: string
  }
}

type EnrichedComment = Comment & {
  photo: {
    id: string
    gallery_id: string
    filename: string
    thumbnail_url: string
  }
  gallery: {
    id: string
    title: string
    slug: string
  }
}

interface FeedbackClientProps {
  favorites: EnrichedFavorite[]
  comments: EnrichedComment[]
  galleries: Array<{ id: string; title: string; slug: string }>
}

type FilterType = 'all' | 'favorites' | 'comments' | 'unread'

export default function FeedbackClient({ favorites, comments, galleries }: FeedbackClientProps) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [selectedGallery, setSelectedGallery] = useState<string>('all')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localComments, setLocalComments] = useState(comments)

  const supabase = createClient()

  // Group favorites by photo and count them
  const groupedFavorites = favorites.reduce((acc, fav) => {
    const key = fav.photo_id
    if (!acc[key]) {
      acc[key] = {
        photo: fav.photo,
        gallery: fav.gallery,
        count: 0,
        latestFavorite: fav
      }
    }
    acc[key].count++
    // Keep the most recent favorite for timestamp display
    if (new Date(fav.created_at) > new Date(acc[key].latestFavorite.created_at)) {
      acc[key].latestFavorite = fav
    }
    return acc
  }, {} as Record<string, {
    photo: EnrichedFavorite['photo']
    gallery: EnrichedFavorite['gallery']
    count: number
    latestFavorite: EnrichedFavorite
  }>)

  // Filter data based on current filters
  const getFilteredFavorites = () => {
    let filtered = Object.values(groupedFavorites)
    if (selectedGallery !== 'all') {
      filtered = filtered.filter(f => f.gallery.id === selectedGallery)
    }
    // Sort by count (most favorited first)
    return filtered.sort((a, b) => b.count - a.count)
  }

  const getFilteredComments = () => {
    let filtered = localComments
    if (selectedGallery !== 'all') {
      filtered = filtered.filter(c => c.gallery.id === selectedGallery)
    }
    if (filter === 'unread') {
      filtered = filtered.filter(c => !c.is_read)
    }
    return filtered
  }

  const filteredFavorites = getFilteredFavorites()
  const filteredComments = getFilteredComments()

  // Mark comment as read
  const markAsRead = async (commentId: string) => {
    const { error } = await supabase
      .from('comments')
      .update({ is_read: true })
      .eq('id', commentId)

    if (!error) {
      setLocalComments(prev =>
        prev.map(c => c.id === commentId ? { ...c, is_read: true } : c)
      )
    }
  }

  // Mark comment as unread
  const markAsUnread = async (commentId: string) => {
    const { error } = await supabase
      .from('comments')
      .update({ is_read: false })
      .eq('id', commentId)

    if (!error) {
      setLocalComments(prev =>
        prev.map(c => c.id === commentId ? { ...c, is_read: false } : c)
      )
    }
  }

  // Submit reply to comment
  const submitReply = async (commentId: string) => {
    if (!replyText.trim() || isSubmitting) return

    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('comments')
        .update({
          photographer_reply: replyText.trim(),
          replied_at: new Date().toISOString(),
          is_read: true
        })
        .eq('id', commentId)

      if (!error) {
        // Send notification email (optional - implement if needed)
        // fetch('/api/notify/reply', { ... })

        setLocalComments(prev =>
          prev.map(c => c.id === commentId ? {
            ...c,
            photographer_reply: replyText.trim(),
            replied_at: new Date().toISOString(),
            is_read: true
          } : c)
        )
        setReplyingTo(null)
        setReplyText('')
      }
    } catch (error) {
      console.error('Failed to submit reply:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const unreadCount = localComments.filter(c => !c.is_read).length

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-luxury-lg shadow-luxury p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          {/* Type Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-serif text-sm text-charcoal-600 whitespace-nowrap">Show:</span>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full font-serif text-sm transition-all ${
                filter === 'all'
                  ? 'bg-charcoal-900 text-cream-50'
                  : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
              }`}
            >
              All ({Object.keys(groupedFavorites).length + localComments.length})
            </button>
            <button
              onClick={() => setFilter('favorites')}
              className={`px-4 py-2 rounded-full font-serif text-sm transition-all flex items-center gap-2 ${
                filter === 'favorites'
                  ? 'bg-red-600 text-white'
                  : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
              }`}
            >
              <Heart className="w-4 h-4" fill={filter === 'favorites' ? 'currentColor' : 'none'} />
              Favorites ({Object.keys(groupedFavorites).length})
            </button>
            <button
              onClick={() => setFilter('comments')}
              className={`px-4 py-2 rounded-full font-serif text-sm transition-all flex items-center gap-2 ${
                filter === 'comments'
                  ? 'bg-sunset-600 text-white'
                  : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Comments ({localComments.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-full font-serif text-sm transition-all relative ${
                filter === 'unread'
                  ? 'bg-sunset-600 text-white'
                  : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Gallery Filter */}
          {galleries.length > 1 && (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Filter className="w-4 h-4 text-charcoal-400 flex-shrink-0" />
              <select
                value={selectedGallery}
                onChange={(e) => setSelectedGallery(e.target.value)}
                className="flex-1 px-4 py-2 border border-charcoal-300 rounded-lg font-serif text-sm focus:outline-none focus:ring-2 focus:ring-sunset-500 bg-white min-w-0"
              >
                <option value="all">All Galleries</option>
                {galleries.map(gallery => (
                  <option key={gallery.id} value={gallery.id}>
                    {gallery.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {filter === 'all' || filter === 'favorites' ? (
        <div className="mb-8">
          <h2 className="font-display text-2xl text-charcoal-900 mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-600" fill="currentColor" />
            Favorites ({filteredFavorites.length})
          </h2>

          {filteredFavorites.length === 0 ? (
            <div className="bg-white rounded-luxury-lg shadow-luxury p-12 text-center">
              <Heart className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
              <p className="font-serif text-charcoal-600">No favorites yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFavorites.map(grouped => (
                <div key={grouped.photo.id} className="bg-white rounded-luxury shadow-luxury overflow-hidden hover:shadow-luxury-lg transition-shadow">
                  <div className="relative aspect-square bg-charcoal-100">
                    <Image
                      src={grouped.photo.thumbnail_url}
                      alt={grouped.photo.filename}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {/* Heart icon with count badge */}
                    <div className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg relative">
                      <Heart className="w-5 h-5" fill="currentColor" />
                      {grouped.count > 1 && (
                        <span className="absolute -top-1 -right-1 bg-white text-red-600 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-red-600">
                          {grouped.count}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-serif text-sm text-charcoal-900 font-semibold truncate mb-1">
                      {grouped.gallery.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="font-serif text-xs text-charcoal-500">
                        {formatDistanceToNow(new Date(grouped.latestFavorite.created_at), { addSuffix: true })}
                      </p>
                      {grouped.count > 1 && (
                        <p className="font-serif text-xs text-red-600 font-semibold">
                          {grouped.count} favorites
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {filter === 'all' || filter === 'comments' || filter === 'unread' ? (
        <div>
          <h2 className="font-display text-2xl text-charcoal-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-sunset-600" />
            Comments ({filteredComments.length})
          </h2>

          {filteredComments.length === 0 ? (
            <div className="bg-white rounded-luxury-lg shadow-luxury p-12 text-center">
              <MessageSquare className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
              <p className="font-serif text-charcoal-600">
                {filter === 'unread' ? 'No unread comments' : 'No comments yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComments.map(comment => (
                <div
                  key={comment.id}
                  className={`bg-white rounded-luxury-lg shadow-luxury p-6 transition-all ${
                    !comment.is_read ? 'border-2 border-sunset-400' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Photo Thumbnail */}
                    <div className="relative w-24 h-24 flex-shrink-0 bg-charcoal-100 rounded-luxury overflow-hidden">
                      <Image
                        src={comment.photo.thumbnail_url}
                        alt={comment.photo.filename}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-serif font-semibold text-charcoal-900">
                              {comment.client_name || 'Anonymous'}
                            </span>
                            {!comment.is_read && (
                              <span className="bg-sunset-500 text-white text-xs px-2 py-0.5 rounded-full font-serif">
                                New
                              </span>
                            )}
                          </div>
                          <p className="font-serif text-sm text-charcoal-600 truncate">
                            {comment.gallery.title} • {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </p>
                        </div>

                        {/* Mark as Read/Unread */}
                        <button
                          onClick={() => comment.is_read ? markAsUnread(comment.id) : markAsRead(comment.id)}
                          className="text-charcoal-400 hover:text-sunset-600 transition-colors flex-shrink-0"
                          title={comment.is_read ? 'Mark as unread' : 'Mark as read'}
                        >
                          {comment.is_read ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                        </button>
                      </div>

                      <p className="font-serif text-charcoal-800 mb-4 leading-relaxed">
                        {comment.comment}
                      </p>

                      {/* Photographer Reply */}
                      {comment.photographer_reply && (
                        <div className="bg-cream-100 rounded-luxury p-4 mb-4">
                          <p className="font-serif text-xs text-charcoal-500 mb-2">Your reply:</p>
                          <p className="font-serif text-charcoal-800">{comment.photographer_reply}</p>
                          <p className="font-serif text-xs text-charcoal-500 mt-2">
                            {comment.replied_at && formatDistanceToNow(new Date(comment.replied_at), { addSuffix: true })}
                          </p>
                        </div>
                      )}

                      {/* Reply Form */}
                      {replyingTo === comment.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your reply..."
                            className="w-full px-4 py-3 border border-charcoal-300 rounded-luxury focus:outline-none focus:ring-2 focus:ring-sunset-500 font-serif resize-none"
                            rows={3}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => submitReply(comment.id)}
                              disabled={!replyText.trim() || isSubmitting}
                              className="bg-sunset-600 text-white px-6 py-2 rounded-luxury hover:bg-sunset-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-serif text-sm flex items-center gap-2"
                            >
                              <Send className="w-4 h-4" />
                              {isSubmitting ? 'Sending...' : 'Send Reply'}
                            </button>
                            <button
                              onClick={() => {
                                setReplyingTo(null)
                                setReplyText('')
                              }}
                              className="bg-charcoal-100 text-charcoal-700 px-6 py-2 rounded-luxury hover:bg-charcoal-200 transition-colors font-serif text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReplyingTo(comment.id)}
                          className="text-sunset-600 hover:text-sunset-700 font-serif text-sm transition-colors"
                        >
                          {comment.photographer_reply ? 'Edit Reply' : 'Reply'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
