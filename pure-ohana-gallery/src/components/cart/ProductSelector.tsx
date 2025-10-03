'use client'

import { useState, useEffect } from 'react'
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
  onClose: () => void
}

export default function ProductSelector({ 
  photoId, 
  photoUrl, 
  photoFilename, 
  onClose 
}: ProductSelectorProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  
  const { addItem } = useCart()
  const supabase = createClient()

  useEffect(() => {
    loadProducts()
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
      quantity
    })

    onClose()
  }

  const selectedVariantData = variants.find(v => v.id === selectedVariant)
  const total = selectedVariantData ? selectedVariantData.price * quantity : 0

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-light text-gray-900">
              Order This Photo
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
        </div>

        {/* Photo Preview */}
        <div className="p-6 border-b border-gray-100">
          <img 
            src={photoUrl} 
            alt={photoFilename}
            className="w-full h-48 object-contain bg-gray-50"
          />
          <p className="text-xs text-gray-500 text-center mt-2">{photoFilename}</p>
        </div>

        {/* Product Selection */}
        <div className="p-6 space-y-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500">No products available</p>
          ) : (
            <>
              {/* Product Type */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-700 mb-3 font-medium">
                  Product Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product.id)}
                      className={`p-4 border-2 text-left transition-colors ${
                        selectedProduct === product.id
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm" style={{ color: '#1a1a1a' }}>
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 capitalize">
                        {product.category}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              {selectedProduct && variants.length > 0 && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-700 mb-3 font-medium">
                    Size
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant.id)}
                        className={`p-3 border-2 text-center transition-colors ${
                          selectedVariant === variant.id
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-sm" style={{ color: '#1a1a1a' }}>
                          {variant.size}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
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
                  <label className="block text-xs uppercase tracking-wider text-gray-700 mb-3 font-medium">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 border border-gray-300 hover:bg-gray-50 transition"
                      style={{ color: '#1a1a1a' }}
                    >
                      −
                    </button>
                    <span className="text-lg font-medium w-12 text-center" style={{ color: '#1a1a1a' }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 border border-gray-300 hover:bg-gray-50 transition"
                      style={{ color: '#1a1a1a' }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Total */}
              {selectedVariant && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-medium" style={{ color: '#1a1a1a' }}>Total:</span>
                    <span className="font-serif text-2xl" style={{ color: '#1a1a1a' }}>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-gray-100 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white border border-gray-300 px-6 py-3 hover:bg-gray-50 transition font-medium uppercase tracking-wider text-xs"
            style={{ color: '#1a1a1a' }}
          >
            Cancel
          </button>
          <button
            onClick={handleAddToCart}
            disabled={!selectedProduct || !selectedVariant || loading}
            className="flex-1 bg-gray-900 px-6 py-3 hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium uppercase tracking-wider text-xs"
            style={{ color: '#ffffff' }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
