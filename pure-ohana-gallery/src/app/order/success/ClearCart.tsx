'use client'

import { useEffect } from 'react'
import { useCart } from '@/stores/cartStore'

export default function ClearCart() {
  const { clearCart } = useCart()
  
  useEffect(() => {
    // Clear cart after successful payment
    clearCart()
  }, [clearCart])
  
  return null
}
