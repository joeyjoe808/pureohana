'use client'

import { useState } from 'react'
import ProductSelector from '../cart/ProductSelector'

interface OrderPrintButtonProps {
  photoId: string
  photoUrl: string
  filename: string
}

export default function OrderPrintButton({ photoId, photoUrl, filename }: OrderPrintButtonProps) {
  const [showSelector, setShowSelector] = useState(false)

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setShowSelector(true)
        }}
        className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-3 py-2 hover:bg-white transition flex items-center gap-2 text-xs font-medium uppercase tracking-wider"
        style={{ color: '#1a1a1a' }}
        title="Order prints of this photo"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
          />
        </svg>
        <span className="hidden sm:inline">Order Prints</span>
      </button>

      {showSelector && (
        <ProductSelector
          photoId={photoId}
          photoUrl={photoUrl}
          photoFilename={filename}
          onClose={() => setShowSelector(false)}
        />
      )}
    </>
  )
}
