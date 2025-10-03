'use client'

import { useCart } from '@/stores/cartStore'
import { useRouter } from 'next/navigation'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    onClose()
    router.push('/checkout')
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-light text-gray-900">
              Shopping Cart
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 font-light">Your cart is empty</p>
              <button
                onClick={onClose}
                className="mt-4 text-sm text-gray-900 hover:underline"
              >
                Continue browsing
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border border-gray-100 p-4">
                  {/* Photo Preview */}
                  <div className="flex gap-4 mb-3">
                    <img
                      src={item.photoUrl}
                      alt={item.photoFilename}
                      className="w-20 h-20 object-cover bg-gray-50"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.productName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Size: {item.productSize}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.photoFilename}
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 border border-gray-300 hover:bg-gray-50 transition text-sm"
                        style={{ color: '#1a1a1a' }}
                      >
                        −
                      </button>
                      <span className="text-sm font-medium w-8 text-center" style={{ color: '#1a1a1a' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 border border-gray-300 hover:bg-gray-50 transition text-sm"
                        style={{ color: '#1a1a1a' }}
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium" style={{ color: '#1a1a1a' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-600 transition"
                        title="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium" style={{ color: '#1a1a1a' }}>
                Subtotal:
              </span>
              <span className="font-serif text-2xl" style={{ color: '#1a1a1a' }}>
                ${getTotal().toFixed(2)}
              </span>
            </div>

            <p className="text-xs text-gray-500">
              Shipping and taxes calculated at checkout
            </p>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                className="w-full bg-gray-900 px-6 py-3 hover:bg-gray-800 transition font-medium uppercase tracking-wider text-xs"
                style={{ color: '#ffffff' }}
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear your cart?')) {
                    clearCart()
                  }
                }}
                className="w-full bg-white border border-gray-300 px-6 py-3 hover:bg-gray-50 transition font-medium uppercase tracking-wider text-xs"
                style={{ color: '#1a1a1a' }}
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
