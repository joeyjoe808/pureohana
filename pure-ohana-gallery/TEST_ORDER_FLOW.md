# 🧪 Testing Complete Order Flow

## ✅ Pre-Test Checklist

Make sure you have:

- [x] Stripe CLI running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- [x] Webhook secret in `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_...`
- [ ] Dev server RESTARTED after adding webhook secret
- [ ] SQL schema run in Supabase (supabase-phase3-schema.sql)
- [ ] Stripe keys in `.env.local`

---

## 🚀 Step-by-Step Test

### 1. Restart Dev Server (Important!)
```bash
# Stop your current dev server (Ctrl+C)
# Then restart:
npm run dev
```

### 2. Keep Stripe CLI Running
In a **separate terminal**:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# You should see:
# > Ready! You're receiving webhook events
```

### 3. Go to a Gallery
```
http://localhost:3000/gallery/your-gallery-slug
```

### 4. Add Items to Cart
- Click **"Order Prints"** on a photo
- Select product type (e.g., Lustre Print)
- Select size (e.g., 8x10)
- Set quantity
- Click **"Add to Cart"**
- Repeat for 2-3 photos

### 5. Open Cart
- Click the **cart icon** (top-right)
- Verify items are there
- Check quantities
- Check total price

### 6. Go to Checkout
- Click **"Proceed to Checkout"**
- Should go to: `http://localhost:3000/checkout`

### 7. Fill Out Form
**Customer Info:**
- Name: Test Customer
- Email: test@example.com
- Phone: (optional)

**Shipping Address:**
- Address Line 1: 123 Test St
- City: Honolulu
- State: HI
- ZIP: 96815

### 8. Submit to Stripe
- Click **"Continue to Payment"**
- Should redirect to Stripe Checkout page

### 9. Enter Test Card
Use Stripe test card:
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
Name: Test Customer
```

### 10. Complete Payment
- Click **"Pay"**
- Wait for processing...

---

## 🎯 What Should Happen

### In Stripe CLI Terminal:
You should see:
```
[200] POST /api/webhooks/stripe [evt_xxx]
checkout.session.completed
```

### In Your Browser:
- Redirects to: `/order/success?session_id=...&order_id=...`
- Shows order confirmation page
- Displays order details
- Shows items ordered
- Shows total paid

### In Supabase Database:
Check `orders` table:
```sql
SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;
```

Should see:
- ✅ `payment_status = 'paid'`
- ✅ `stripe_session_id` populated
- ✅ `stripe_payment_intent_id` populated
- ✅ Customer info filled
- ✅ Shipping address filled
- ✅ Correct totals

Check `order_items` table:
```sql
SELECT * FROM order_items WHERE order_id = 'your-order-id';
```

Should see all items you ordered.

---

## 🐛 If Something Goes Wrong

### ❌ "Checkout failed"
**Check:**
- Are Stripe keys in `.env.local`?
- Did you restart dev server after adding them?
- Check browser console for errors

### ❌ Order created but payment_status still 'pending'
**Check:**
- Is Stripe CLI running?
- Did you see webhook in CLI terminal?
- Check webhook secret is correct
- Did you restart dev server after adding webhook secret?

### ❌ "No products available" in modal
**Check:**
- Did you run `supabase-phase3-schema.sql`?
- Check in Supabase:
  ```sql
  SELECT * FROM products;
  SELECT * FROM product_variants;
  ```

### ❌ Can't see order success page
**Check:**
- Look at URL - does it have `session_id` and `order_id`?
- Check browser console for errors
- Check Next.js terminal for server errors

---

## 📊 Verify Everything Works

After successful test, verify:

### 1. Cart Clears
- Go back to gallery
- Cart icon should show 0 items

### 2. Database Updated
```sql
-- Check order
SELECT id, customer_name, total, payment_status, fulfillment_status
FROM orders 
ORDER BY created_at DESC 
LIMIT 1;

-- Check order items
SELECT oi.*, p.filename 
FROM order_items oi
LEFT JOIN photos p ON p.id = oi.photo_id
WHERE oi.order_id = 'your-order-id';
```

### 3. Stripe Dashboard
- Go to: https://dashboard.stripe.com/test/payments
- Should see your test payment
- Click on it to see details
- Check metadata has `order_id`

### 4. Webhook Logs
In Stripe CLI, you should have seen:
```
[200] POST /api/webhooks/stripe
  checkout.session.completed
  payment_intent.succeeded
```

---

## ✅ Success Criteria

Your test is successful when:

- [x] Added multiple items to cart
- [x] Cart shows correct items and total
- [x] Checkout form submitted successfully
- [x] Redirected to Stripe payment page
- [x] Payment completed with test card
- [x] Webhook received (visible in Stripe CLI)
- [x] Redirected to success page
- [x] Success page shows correct order details
- [x] Order in database with `payment_status = 'paid'`
- [x] Order items in database
- [x] Cart cleared after purchase

---

## 🎉 If Everything Works

**Congratulations!** Your e-commerce flow is working perfectly!

You can now:
- ✅ Accept real orders (switch to live Stripe keys)
- ✅ Process real payments
- ✅ Track orders in your database
- ✅ See order history

---

## 🚀 Next Steps After Testing

1. **Test different scenarios:**
   - Different product types
   - Different quantities
   - Multiple photos
   - Different shipping addresses

2. **Test error cases:**
   - Declined card: `4000 0000 0000 0002`
   - Insufficient funds: `4000 0000 0000 9995`

3. **Deploy to production** when ready!

4. **Switch to live Stripe keys** for real payments

---

## 🆘 Need Help?

If something isn't working:
1. Check all terminals (dev server, Stripe CLI)
2. Check browser console
3. Check Supabase logs
4. Share the error message!

Let me know how it goes! 🎯
