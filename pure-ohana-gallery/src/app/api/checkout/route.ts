import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
})

export async function POST(request: NextRequest) {
  try {
    const { items, customerInfo, shippingInfo, galleryId } = await request.json()

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    if (!customerInfo || !shippingInfo) {
      return NextResponse.json({ error: 'Customer info required' }, { status: 400 })
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    )

    // Simple tax calculation (adjust based on your requirements)
    const taxRate = 0.0 // Set to your state tax rate (e.g., 0.08 for 8%)
    const tax = subtotal * taxRate

    // Flat shipping (you can make this dynamic based on order size)
    const shippingCost = 9.99

    const total = subtotal + tax + shippingCost

    // Create Stripe line items
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${item.productName} - ${item.productSize}`,
          description: item.photoFilename,
          images: [item.photoUrl]
        },
        unit_amount: Math.round(item.price * 100) // Stripe uses cents
      },
      quantity: item.quantity
    }))

    // Add shipping as line item
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
            description: 'Standard shipping'
          },
          unit_amount: Math.round(shippingCost * 100)
        },
        quantity: 1
      })
    }

    // Add tax as line item
    if (tax > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Sales Tax',
            description: 'Applicable sales tax'
          },
          unit_amount: Math.round(tax * 100)
        },
        quantity: 1
      })
    }

    // Create order in database first
    const supabase = await createClient()

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        gallery_id: galleryId,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone || null,
        shipping_address_line1: shippingInfo.address1,
        shipping_address_line2: shippingInfo.address2 || null,
        shipping_city: shippingInfo.city,
        shipping_state: shippingInfo.state,
        shipping_zip: shippingInfo.zip,
        shipping_country: shippingInfo.country || 'US',
        subtotal: subtotal,
        tax: tax,
        shipping_cost: shippingCost,
        total: total,
        payment_status: 'pending',
        fulfillment_status: 'pending'
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      photo_id: item.photoId,
      product_name: item.productName,
      product_size: item.productSize,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      photo_url: item.photoUrl,
      photo_filename: item.photoFilename
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Order items error:', itemsError)
      // Continue anyway - we can fix items later
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/checkout`,
      customer_email: customerInfo.email,
      metadata: {
        order_id: order.id,
        gallery_id: galleryId
      },
      shipping_address_collection: {
        allowed_countries: ['US']
      }
    })

    // Update order with Stripe session ID
    await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id)

    return NextResponse.json({ 
      sessionId: session.id,
      orderId: order.id 
    })

  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Checkout failed' },
      { status: 500 }
    )
  }
}
