# 🔗 Stripe Webhook Setup Guide

Stripe is asking for an **Endpoint URL** - this is where Stripe will send payment notifications to your app.

---

## 🏠 For Development (Testing Locally)

You have **2 options** for testing webhooks on your local machine:

### Option 1: Stripe CLI (Recommended for Development)

**This forwards Stripe webhooks from the cloud to your localhost**

#### Step 1: Install Stripe CLI
```bash
# Mac (using Homebrew)
brew install stripe/stripe-cli/stripe

# Or download from: https://stripe.com/docs/stripe-cli
```

#### Step 2: Login to Stripe
```bash
stripe login
# This will open your browser to authorize
```

#### Step 3: Forward Webhooks to Localhost
```bash
# Start your Next.js app first
npm run dev

# In a NEW terminal window:
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

#### Step 4: Get the Webhook Secret
When you run `stripe listen`, it will show:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

**Copy that secret** and add to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

#### Step 5: Test It!
- Make a test purchase
- Stripe CLI will show webhook events in real-time
- Your app will receive the payment confirmation

**That's it!** No need to configure anything in Stripe Dashboard for local testing.

---

### Option 2: ngrok (If Stripe CLI doesn't work)

**This creates a temporary public URL for your localhost**

#### Step 1: Install ngrok
```bash
# Download from: https://ngrok.com/download
# Or with Homebrew:
brew install ngrok
```

#### Step 2: Start ngrok
```bash
# Start your Next.js app first
npm run dev

# In a NEW terminal:
ngrok http 3000
```

#### Step 3: Get Your Public URL
ngrok will show something like:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

#### Step 4: Add Webhook in Stripe Dashboard
1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click **"Add endpoint"**
3. **Endpoint URL**: `https://abc123.ngrok.io/api/webhooks/stripe`
4. **Events to send**: Select these:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Click **"Add endpoint"**

#### Step 5: Get Webhook Secret
- After creating the endpoint, click on it
- Click **"Reveal"** under "Signing secret"
- Copy the secret (starts with `whsec_`)

Add to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

---

## 🌐 For Production (Real Domain)

When you deploy to production (Vercel, etc.), you'll use your real domain.

### Step 1: Deploy Your App
```bash
# Deploy to Vercel (or your hosting)
vercel deploy
# You'll get a URL like: https://pure-ohana.vercel.app
```

### Step 2: Add Webhook in Stripe Dashboard (LIVE MODE)

1. Go to: https://dashboard.stripe.com/webhooks (switch to **Live mode**)
2. Click **"Add endpoint"**
3. **Endpoint URL**: `https://your-domain.com/api/webhooks/stripe`
   - Example: `https://pure-ohana.vercel.app/api/webhooks/stripe`
4. **Events to send**: Same as above
5. Click **"Add endpoint"**

### Step 3: Get LIVE Webhook Secret
- Copy the signing secret
- Add to your production environment variables (Vercel settings)

---

## 🧪 Testing Webhooks

### Test with Stripe CLI:
```bash
# Trigger a test payment success
stripe trigger checkout.session.completed
```

### Test with Real Payment:
1. Go to your checkout page
2. Use test card: `4242 4242 4242 4242`
3. Complete payment
4. Check your app logs for webhook event
5. Verify order status updated in database

---

## 🔍 Debugging Webhooks

### Check if Webhook is Receiving:
```bash
# In your Next.js app, add console logs
# File: src/app/api/webhooks/stripe/route.ts

console.log('Webhook received!', event.type)
```

### Check Stripe Dashboard:
- Go to **Webhooks** in Stripe Dashboard
- Click on your endpoint
- See **"Events"** tab - shows all webhook attempts
- Click on an event to see the payload and response

### Common Issues:

**❌ "No signature found"**
- Make sure `STRIPE_WEBHOOK_SECRET` is set in `.env.local`
- Restart your dev server after adding the secret

**❌ "Webhook signature verification failed"**
- Wrong webhook secret
- Make sure you're using the secret from the CLI or Dashboard

**❌ "404 Not Found"**
- Check your endpoint URL is correct
- Should be: `/api/webhooks/stripe` (no trailing slash)

---

## 📋 Quick Setup Checklist

For local development:

- [ ] Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
- [ ] Login: `stripe login`
- [ ] Start Next.js: `npm run dev`
- [ ] Start webhook forwarding: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- [ ] Copy webhook secret to `.env.local`
- [ ] Restart Next.js dev server
- [ ] Test with a purchase!

---

## 💡 Recommended Approach

**For Development**: Use **Stripe CLI** (Option 1)
- Easier
- No public URL needed
- Real-time logs

**For Production**: Configure in **Stripe Dashboard**
- Use your actual domain
- Switch to Live mode
- Add production webhook secret

---

## 🎯 What to Put in Stripe Dashboard

If they're asking for an endpoint URL right now:

**For Testing (with ngrok):**
```
https://YOUR-NGROK-URL.ngrok.io/api/webhooks/stripe
```

**For Production:**
```
https://your-domain.com/api/webhooks/stripe
```

**But I recommend using Stripe CLI instead** for local testing! Much easier.

---

## ✅ You'll Know It's Working When:

1. Make a test purchase
2. Complete payment in Stripe
3. You see webhook logs in terminal
4. Order status updates to "paid" in database
5. Success page shows correct order details

---

Need help? Let me know which option you want to use and I'll walk you through it! 🚀
