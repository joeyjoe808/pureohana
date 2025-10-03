import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const supabase = await createClient()

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Get order ID from metadata
        const orderId = session.metadata?.order_id

        if (!orderId) {
          console.error('No order_id in session metadata')
          break
        }

        // Update order payment status
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            stripe_payment_intent_id: session.payment_intent as string
          })
          .eq('id', orderId)

        if (updateError) {
          console.error('Failed to update order:', updateError)
        } else {
          console.log(`Order ${orderId} marked as paid`)
        }

        // TODO: Send confirmation email to customer
        // TODO: Submit order to WHCC for fulfillment

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`PaymentIntent ${paymentIntent.id} succeeded`)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.error(`PaymentIntent ${paymentIntent.id} failed`)

        // Find order by payment intent and mark as failed
        const { data: orders } = await supabase
          .from('orders')
          .select('id')
          .eq('stripe_payment_intent_id', paymentIntent.id)

        if (orders && orders.length > 0) {
          await supabase
            .from('orders')
            .update({ payment_status: 'failed' })
            .eq('id', orders[0].id)
        }

        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        
        // Find order by payment intent and mark as refunded
        const { data: orders } = await supabase
          .from('orders')
          .select('id')
          .eq('stripe_payment_intent_id', charge.payment_intent as string)

        if (orders && orders.length > 0) {
          await supabase
            .from('orders')
            .update({ payment_status: 'refunded' })
            .eq('id', orders[0].id)
        }

        console.log(`Charge ${charge.id} refunded`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
    
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
