'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface FavoriteButtonProps {
  photoId: string
  galleryId: string
}

export default function FavoriteButton({ photoId, galleryId }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const getClientId = () => {
    if (typeof window === 'undefined') return null

    let clientId = localStorage.getItem('pure_ohana_client_id')
    if (!clientId) {
      clientId = crypto.randomUUID()
      localStorage.setItem('pure_ohana_client_id', clientId)
    }
    return clientId
  }

  useEffect(() => {
    loadFavorites()
  }, [photoId])

  const loadFavorites = async () => {
    const clientId = getClientId()
    if (!clientId) return

    try {
      const { data: favorite } = await supabase
        .from('favorites')
        .select('id')
        .eq('photo_id', photoId)
        .eq('client_identifier', clientId)
        .maybeSingle()

      setIsFavorited(!!favorite)

      const { count: favoriteCount } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('photo_id', photoId)

      setCount(favoriteCount || 0)
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
  }

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()

    const clientId = getClientId()
    if (!clientId || isLoading) return

    setIsLoading(true)

    try {
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('photo_id', photoId)
          .eq('client_identifier', clientId)

        setIsFavorited(false)
        setCount(prev => Math.max(0, prev - 1))
      } else {
        const clientName = localStorage.getItem('client_name') || 'Anonymous Client'
        const clientEmail = localStorage.getItem('client_email') || undefined

        await supabase
          .from('favorites')
          .insert({
            photo_id: photoId,
            gallery_id: galleryId,
            client_identifier: clientId,
            client_name: clientName,
            client_email: clientEmail
          })

        // Send email notification
        fetch('/api/notify/favorite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            photoId,
            clientName,
            clientEmail
          })
        }).catch(err => console.error('Error sending notification:', err))

        setIsFavorited(true)
        setCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-soft"
      style={{
        color: isFavorited ? '#D97706' : '#6B7280' // sunset-600 : gray-500
      }}
      aria-label={isFavorited ? 'Unfavorite photo' : 'Favorite photo'}
    >
      <Heart
        className="w-5 h-5"
        fill={isFavorited ? 'currentColor' : 'none'}
        strokeWidth={2}
      />
      {count > 0 && (
        <span
          className="absolute -top-1 -right-1 bg-sunset-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold shadow-sm"
          style={{ fontSize: '10px' }}
        >
          {count}
        </span>
      )}
    </button>
  )
}
