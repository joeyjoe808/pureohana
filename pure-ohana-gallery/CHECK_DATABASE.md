# 🔍 Quick Database Check

## Run this in Supabase SQL Editor:

```sql
-- Check if orders table exists and show its structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;
```

## Expected Result:

You should see these columns:
- id (uuid)
- gallery_id (uuid)
- photographer_id (uuid)
- customer_name (text)
- customer_email (text)
- customer_phone (text)
- shipping_address_line1 (text)
- shipping_address_line2 (text)
- shipping_city (text)
- shipping_state (text)
- shipping_zip (text)
- shipping_country (text)
- subtotal (numeric)
- tax (numeric)
- shipping_cost (numeric)
- total (numeric)
- stripe_payment_intent_id (text)
- stripe_session_id (text)
- payment_status (text)
- whcc_order_id (text)
- fulfillment_status (text)
- tracking_number (text)
- notes (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

---

## If you see 0 rows:

**The orders table doesn't exist!** You need to:

1. Open `supabase-phase3-schema.sql`
2. Copy **ALL 300+ lines**
3. Paste in Supabase SQL Editor
4. Click **Run**

---

## Also check products:

```sql
-- Check if products exist
SELECT COUNT(*) as product_count FROM products;

-- Should show 6 products
```

If it says "relation does not exist" → You definitely need to run the schema!
