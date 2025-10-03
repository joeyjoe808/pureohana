'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/stores/cartStore'

interface Product {
  id: string
  name: string
  description: string | null
  category: string
  base_price: number
  is_active: boolean
}

interface ProductVariant {
  id: string
  product_id: string
  size: string
  price: number
  is_available: boolean
}

interface ProductSelectorProps {
  photoId: string
  photoUrl: string
  photoFilename: string
  galleryId: string
  onClose: () => void
}

export default function ProductSelector({ 
  photoId, 
  photoUrl, 
  photoFilename,
  galleryId,
  onClose 
}: ProductSelectorProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  
  const { addItem } = useCart()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    loadProducts()
    
    // Lock body scroll when modal is open
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  useEffect(() => {
    if (selectedProduct) {
      loadVariants(selectedProduct)
    }
  }, [selectedProduct])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name')
      
      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadVariants = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId)
        .eq('is_available', true)
        .order('price')
      
      if (error) throw error
      setVariants(data || [])
      setSelectedVariant(null)
    } catch (error) {
      console.error('Error loading variants:', error)
    }
  }

  const handleAddToCart = () => {
    if (!selectedProduct || !selectedVariant) return

    const product = products.find(p => p.id === selectedProduct)
    const variant = variants.find(v => v.id === selectedVariant)

    if (!product || !variant) return

    addItem({
      photoId,
      photoUrl,
      photoFilename,
      productName: product.name,
      productSize: variant.size,
      variantId: variant.id,
      price: variant.price,
      quantity,
      galleryId
    })

    onClose()
  }

  const selectedVariantData = variants.find(v => v.id === selectedVariant)
  const total = selectedVariantData ? selectedVariantData.price * quantity : 0

  if (!mounted) return null

  const modalContent = (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 z-[9999]"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-[9999] overflow-y-auto pointer-events-none">
        <div className="min-h-full flex items-center justify-center p-4">
          <div 
            className="bg-white max-w-3xl w-full shadow-2xl pointer-events-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
        {/* Header */}
        <div className="border-b border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-serif font-light text-gray-900">
              Order This Photo
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 transition p-2 hover:bg-gray-100 rounded"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Photo Preview */}
        <div className="p-8 border-b border-gray-200 bg-white">
          <div className="max-w-md mx-auto">
            <img 
              src={photoUrl} 
              alt={photoFilename}
              className="w-full h-64 object-contain bg-gray-100 rounded"
            />
            <p className="text-sm text-gray-600 text-center mt-3 font-medium">{photoFilename}</p>
          </div>
        </div>

        {/* Product Selection */}
        <div className="p-8 space-y-8 bg-white">
          {loading ? (
            <p className="text-center text-gray-500 py-12 text-lg">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500 py-12 text-lg">No products available</p>
          ) : (
            <>
              {/* Product Type */}
              <div>
                <label className="block text-sm uppercase tracking-wider text-gray-700 mb-4 font-semibold">
                  1. Select Product Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product.id)}
                      className={`p-5 border-2 text-left transition-all ${
                        selectedProduct === product.id
                          ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                          : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
                      }`}
                    >
                      <div className={`font-semibold text-base mb-1 ${
                        selectedProduct === product.id ? 'text-white' : 'text-gray-900'
                      }`}>
                        {product.name}
                      </div>
                      <div className={`text-xs capitalize ${
                        selectedProduct === product.id ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {product.category}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              {selectedProduct && variants.length > 0 && (
                <div>
                  <label className="block text-sm uppercase tracking-wider text-gray-700 mb-4 font-semibold">
                    2. Select Size
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant.id)}
                        className={`p-4 border-2 text-center transition-all ${
                          selectedVariant === variant.id
                            ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                            : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
                        }`}
                      >
                        <div className={`font-semibold text-base mb-1 ${
                          selectedVariant === variant.id ? 'text-white' : 'text-gray-900'
                        }`}>
                          {variant.size}
                        </div>
                        <div className={`text-sm mt-1 ${
                          selectedVariant === variant.id ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          ${variant.price.toFixed(2)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              {selectedVariant && (
                <div>
                  <label className="block text-sm uppercase tracking-wider text-gray-700 mb-4 font-semibold">
                    3. Select Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all text-xl font-bold text-gray-700"
                    >
                      −
                    </button>
                    <span className="text-2xl font-semibold w-16 text-center text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all text-xl font-bold text-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Total */}
              {selectedVariant && (
                <div className="pt-6 border-t-2 border-gray-300 bg-gray-50 -mx-8 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold text-gray-700 uppercase tracking-wide">
                      Total:
                    </span>
                    <span className="font-serif text-4xl font-bold text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="border-t-2 border-gray-200 p-6 bg-gray-50 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-white border-2 border-gray-400 px-6 py-4 hover:bg-gray-100 hover:border-gray-500 transition-all font-semibold uppercase tracking-wider text-sm text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleAddToCart}
            disabled={!selectedProduct || !selectedVariant || loading}
            className="flex-1 bg-gray-900 px-6 py-4 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-wider text-sm shadow-lg hover:shadow-xl text-white"
          >
            {loading ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
          </div>
        </div>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
}
