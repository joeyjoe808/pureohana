import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ClearCart from './ClearCart'

export default async function OrderSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ session_id?: string; order_id?: string }>
}) {
  const params = await searchParams
  const { session_id, order_id } = params

  if (!session_id || !order_id) {
    redirect('/')
  }

  const supabase = await createClient()

  // Get order details
  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *
      )
    `)
    .eq('id', order_id)
    .eq('stripe_session_id', session_id)
    .single()

  if (!order) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-white">
      <ClearCart />
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <svg 
              className="w-10 h-10 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          <h1 className="text-4xl font-serif font-light text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-500 font-light">
            Thank you for your order
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 border border-gray-100 p-8 mb-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                Order Number
              </p>
              <p className="text-sm font-medium text-gray-900">
                #{order.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                Order Date
              </p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(order.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
              Shipping To
            </p>
            <p className="text-sm text-gray-900">
              {order.customer_name}
            </p>
            <p className="text-sm text-gray-600">
              {order.shipping_address_line1}
              {order.shipping_address_line2 && `, ${order.shipping_address_line2}`}
            </p>
            <p className="text-sm text-gray-600">
              {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white border border-gray-100 p-8 mb-6">
          <h2 className="text-xl font-serif font-light text-gray-900 mb-6">
            Order Items
          </h2>
          <div className="space-y-4">
            {order.order_items.map((item: any) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                {item.photo_url && (
                  <img
                    src={item.photo_url}
                    alt={item.photo_filename}
                    className="w-20 h-20 object-cover bg-gray-50"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {item.product_name} - {item.product_size}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.photo_filename}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ${item.total_price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div className="border-t border-gray-200 mt-6 pt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-900">${order.shipping_cost.toFixed(2)}</span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">${order.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg pt-4 border-t border-gray-200">
              <span className="font-medium text-gray-900">Total</span>
              <span className="font-serif text-2xl text-gray-900">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-blue-50 border border-blue-100 p-6 mb-6">
          <h3 className="text-lg font-serif font-light text-gray-900 mb-3">
            What Happens Next?
          </h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="font-medium">1.</span>
              <span>You'll receive an email confirmation at <strong>{order.customer_email}</strong></span>
            </li>
            <li className="flex gap-2">
              <span className="font-medium">2.</span>
              <span>Your prints will be professionally processed and printed</span>
            </li>
            <li className="flex gap-2">
              <span className="font-medium">3.</span>
              <span>We'll send you tracking information when your order ships</span>
            </li>
            <li className="flex gap-2">
              <span className="font-medium">4.</span>
              <span>Expect delivery within 7-10 business days</span>
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="bg-gray-900 px-8 py-3 hover:bg-gray-800 transition font-medium uppercase tracking-wider text-xs"
            style={{ color: '#ffffff' }}
          >
            Return Home
          </Link>
        </div>

        {/* Contact Info */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Questions about your order?</p>
          <p className="mt-1">
            Contact us at{' '}
            <a href="mailto:hello@pureohanatreaures.com" className="text-gray-900 hover:underline">
              hello@pureohanatreaures.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
