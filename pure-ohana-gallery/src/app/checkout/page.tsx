'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/stores/cartStore'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCart()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  })
  
  const [shippingInfo, setShippingInfo] = useState({
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if cart is empty
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/')
    }
  }, [mounted, items, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customerInfo,
          shippingInfo
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed')
      }

      // Redirect to Stripe Checkout using the session URL
      if (data.sessionUrl) {
        // DON'T clear cart yet - will clear after successful payment
        // Redirect to Stripe's hosted checkout page
        window.location.href = data.sessionUrl
      } else {
        throw new Error('No checkout session URL received')
      }
      
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message || 'Failed to process checkout')
      setLoading(false)
    }
  }

  const subtotal = getTotal()
  const shipping = 9.99
  const tax = subtotal * 0.0 // Adjust based on your tax rate
  const total = subtotal + shipping + tax

  if (!mounted || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-light text-gray-900 mb-2">
            Checkout
          </h1>
          <p className="text-gray-500 font-light">
            Complete your order
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-8 space-y-8">
              {/* Customer Information */}
              <div>
                <h2 className="text-xl font-serif font-light text-gray-900 mb-6">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors"
                      style={{ color: '#1a1a1a' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors"
                      style={{ color: '#1a1a1a' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors"
                      style={{ color: '#1a1a1a' }}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="pt-8 border-t border-gray-200">
                <h2 className="text-xl font-serif font-light text-gray-900 mb-6">
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address1" className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      id="address1"
                      required
                      value={shippingInfo.address1}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address1: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors"
                      style={{ color: '#1a1a1a' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="address2" className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      id="address2"
                      value={shippingInfo.address2}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address2: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors"
                      style={{ color: '#1a1a1a' }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        required
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors"
                        style={{ color: '#1a1a1a' }}
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                        State *
                      </label>
                      <input
                        type="text"
                        id="state"
                        required
                        maxLength={2}
                        placeholder="CA"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value.toUpperCase() })}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors"
                        style={{ color: '#1a1a1a' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="zip" className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      id="zip"
                      required
                      maxLength={10}
                      value={shippingInfo.zip}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors"
                      style={{ color: '#1a1a1a' }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 px-6 py-4 hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium uppercase tracking-wider text-sm"
                  style={{ color: '#ffffff' }}
                >
                  {loading ? 'Processing...' : 'Continue to Payment'}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 p-8 sticky top-6">
              <h2 className="text-xl font-serif font-light text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.photoUrl}
                      alt={item.photoFilename}
                      className="w-16 h-16 object-cover bg-gray-50"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.productName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.productSize} × {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900 font-medium">${shipping.toFixed(2)}</span>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900 font-medium">${tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg pt-4 border-t border-gray-200">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="font-serif text-2xl text-gray-900">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
