import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useFavorite(photoId: string, galleryId: string) {
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

  const toggleFavorite = async () => {
    const clientId = getClientId()
    if (!clientId || isLoading) return

    setIsLoading(true)

    try {
      if (isFavorited) {
        // Delete favorite via API
        const response = await fetch(`/api/favorites?photo_id=${photoId}&client_identifier=${clientId}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          const error = await response.json()
          console.error('❌ Failed to delete favorite:', error)
          return
        }

        console.log('✅ Favorite deleted successfully')
        setIsFavorited(false)
        setCount(prev => Math.max(0, prev - 1))
      } else {
        // Add favorite via API
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            photo_id: photoId,
            gallery_id: galleryId,
            client_identifier: clientId
          })
        })

        if (!response.ok) {
          const error = await response.json()
          console.error('❌ Failed to insert favorite:', error)
          return
        }

        const result = await response.json()
        console.log('✅ Favorite inserted successfully:', result)

        // Send email notification (get client info from localStorage for email only)
        const clientName = localStorage.getItem('client_name') || 'Anonymous Client'
        const clientEmail = localStorage.getItem('client_email') || undefined

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
      console.error('❌ Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isFavorited,
    count,
    isLoading,
    toggleFavorite
  }
}
