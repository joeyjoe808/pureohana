# 🛒 PHASE 3 GUIDE - Print Ordering System

**Prerequisites:** Phase 1 & 2 Complete ✅
**Estimated Time:** 1-2 weeks
**Difficulty:** Medium-High

---

## 📋 Phase 3 Goals

Build a complete e-commerce system for print orders:

1. **Product Catalog** - Display available print products
2. **Shopping Cart** - Add photos to cart with product selection
3. **Stripe Checkout** - Secure payment processing
4. **Order Management** - Photographer dashboard for orders
5. **WHCC Integration** - Automatic order fulfillment

---

## 🗄️ Step 1: Database Setup

### Run the Schema
1. Open Supabase SQL Editor
2. Copy contents of `supabase-phase3-schema.sql`
3. Execute the SQL

### What Gets Created:
- ✅ `products` table (print types)
- ✅ `product_variants` table (sizes/prices)
- ✅ `orders` table (customer orders)
- ✅ `order_items` table (items in orders)
- ✅ `cart_items` table (shopping cart)
- ✅ Seeded with common products (Lustre, Canvas, Metal, etc.)

### Verify Installation:
```sql
-- Check products
SELECT p.name, p.category, pv.size, pv.price 
FROM products p 
JOIN product_variants pv ON p.id = pv.product_id 
WHERE p.is_active = true
ORDER BY p.name, pv.price;

-- You should see:
-- Lustre Print: 4x6 ($0.50), 5x7 ($1.00), 8x10 ($3.00), etc.
-- Canvas Wrap: 8x10 ($25), 11x14 ($35), 16x20 ($60), etc.
-- Metal Print: 8x10 ($40), 11x14 ($60), 16x20 ($100), etc.
```

---

## 🛍️ Step 2: Build Shopping Cart

### Create Cart Store (Zustand)

**File:** `src/stores/cartStore.ts` (NEW)

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  photoId: string
  photoUrl: string
  photoFilename: string
  productName: string
  productSize: string
  variantId: string
  price: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const id = crypto.randomUUID()
        set((state) => ({
          items: [...state.items, { ...item, id }]
        }))
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id)
        }))
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
        }))
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      }
    }),
    {
      name: 'cart-storage'
    }
  )
)
```

---

## 🎨 Step 3: Product Selection Modal

### Create Product Selector

**File:** `src/components/cart/ProductSelector.tsx` (NEW)

```typescript
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/stores/cartStore'

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
  const [products, setProducts] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [variants, setVariants] = useState<any[]>([])
  const [quantity, setQuantity] = useState(1)
  
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
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('name')
    
    setProducts(data || [])
  }

  const loadVariants = async (productId: string) => {
    const { data } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', productId)
      .eq('is_available', true)
      .order('price')
    
    setVariants(data || [])
    setSelectedVariant(null)
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-light text-gray-900">
              Order This Photo
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
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
                  <div className="text-xs text-gray-500 mt-1">
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
                      ${variant.price}
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
                >
                  -
                </button>
                <span className="text-lg font-medium w-12 text-center" style={{ color: '#1a1a1a' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 hover:bg-gray-50 transition"
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
            disabled={!selectedProduct || !selectedVariant}
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
```

---

## 🛒 Step 4: Shopping Cart Component

**File:** `src/components/cart/CartDrawer.tsx` (NEW)

Create a slide-out cart drawer that shows cart items and total.

---

## 💳 Step 5: Stripe Integration

### Install Stripe
```bash
npm install stripe @stripe/stripe-js
```

### Create Stripe Checkout API

**File:** `src/app/api/checkout/route.ts` (NEW)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
})

export async function POST(request: NextRequest) {
  try {
    const { items, customerInfo, shippingInfo } = await request.json()

    // Calculate total
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${item.productName} - ${item.productSize}`,
          images: [item.photoUrl]
        },
        unit_amount: Math.round(item.price * 100) // Stripe uses cents
      },
      quantity: item.quantity
    }))

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
      customer_email: customerInfo.email,
      metadata: {
        customerName: customerInfo.name,
        shippingAddress: JSON.stringify(shippingInfo)
      }
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

---

## 📝 Next Steps

1. **Run the SQL schema** in Supabase
2. **Install Stripe**: `npm install stripe @stripe/stripe-js`
3. **Set up environment variables**:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
4. **Build the components** step by step

---

Ready to start building? Let me know and I'll create the components!
