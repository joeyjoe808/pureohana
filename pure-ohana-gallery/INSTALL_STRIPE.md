# 🔧 Install Stripe Packages

## Run these commands:

```bash
cd /Users/joemedina/PURE_OHANA_TREASURES/website-gallery/pure-ohana-gallery

# If you get permission errors, run this first:
sudo chown -R 501:20 "/Users/joemedina/.npm"

# Then install Stripe:
npm install stripe @stripe/stripe-js
```

## Add to .env.local:

```bash
# Stripe Keys (get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# For webhooks (get after creating webhook in Stripe)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Get Your Stripe Keys:

1. Go to https://stripe.com
2. Sign up or login
3. Go to Developers → API keys
4. Copy **Test mode** keys (start with `sk_test_` and `pk_test_`)
5. Add to `.env.local`

That's it! The code is ready to use them.
