'use client'

import { useState, useEffect } from 'react'
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
        await supabase
          .from('favorites')
          .insert({
            photo_id: photoId,
            gallery_id: galleryId,
            client_identifier: clientId
          })

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
      className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 hover:bg-white transition-all duration-150 opacity-0 group-hover:opacity-100"
      style={{ 
        color: isFavorited ? '#ef4444' : '#6b7280',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
      aria-label={isFavorited ? 'Unfavorite photo' : 'Favorite photo'}
    >
      <svg
        className="w-5 h-5"
        fill={isFavorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {count > 0 && (
        <span 
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
          style={{ fontSize: '10px' }}
        >
          {count}
        </span>
      )}
    </button>
  )
}
