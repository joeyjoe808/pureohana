-- ============================================
-- PHASE 3 DATABASE SCHEMA
-- Pure Ohana Treasures Gallery - Print Ordering
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. PRODUCTS TABLE
-- Stores available print products (prints, canvas, frames, etc.)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'print', 'canvas', 'frame', 'metal', 'acrylic', 'album'
  base_price DECIMAL(10,2) NOT NULL,
  photographer_markup DECIMAL(5,2) DEFAULT 0, -- Percentage markup (e.g., 20.00 for 20%)
  whcc_product_id TEXT, -- WHCC product identifier
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCT VARIANTS TABLE
-- Different sizes/options for each product
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL, -- '4x6', '5x7', '8x10', '11x14', '16x20', '20x30', etc.
  price DECIMAL(10,2) NOT NULL,
  whcc_variant_id TEXT, -- WHCC specific variant ID
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS TABLE
-- Customer orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID REFERENCES galleries(id) ON DELETE SET NULL,
  photographer_id UUID REFERENCES photographers(id) ON DELETE SET NULL,
  
  -- Customer info
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  
  -- Shipping info
  shipping_address_line1 TEXT NOT NULL,
  shipping_address_line2 TEXT,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_zip TEXT NOT NULL,
  shipping_country TEXT DEFAULT 'US',
  
  -- Order details
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  
  -- Payment
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  
  -- Fulfillment
  whcc_order_id TEXT,
  fulfillment_status TEXT DEFAULT 'pending', -- 'pending', 'submitted', 'processing', 'shipped', 'delivered', 'cancelled'
  tracking_number TEXT,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDER ITEMS TABLE
-- Individual items in each order
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  photo_id UUID REFERENCES photos(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  
  -- Snapshot of product details at time of order
  product_name TEXT NOT NULL,
  product_size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  
  -- Photo info
  photo_url TEXT,
  photo_filename TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CART TABLE
-- Temporary cart storage (optional - could use localStorage)
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL, -- Anonymous session identifier
  gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  product_variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_photographer_id ON orders(photographer_id);
CREATE INDEX IF NOT EXISTS idx_orders_gallery_id ON orders(gallery_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status ON orders(fulfillment_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_gallery_id ON cart_items(gallery_id);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- PRODUCTS POLICIES
-- Everyone can view active products
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

-- Photographers can manage products
CREATE POLICY "Photographers can manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- PRODUCT VARIANTS POLICIES
-- Everyone can view available variants
CREATE POLICY "Anyone can view available variants" ON product_variants
  FOR SELECT USING (is_available = true);

-- Photographers can manage variants
CREATE POLICY "Photographers can manage variants" ON product_variants
  FOR ALL USING (auth.role() = 'authenticated');

-- ORDERS POLICIES
-- Photographers can view their own orders
CREATE POLICY "Photographers can view own orders" ON orders
  FOR SELECT USING (auth.uid() = photographer_id);

-- Photographers can update their own orders
CREATE POLICY "Photographers can update own orders" ON orders
  FOR UPDATE USING (auth.uid() = photographer_id);

-- Anyone can create orders (clients)
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- ORDER ITEMS POLICIES
-- Anyone can view order items for orders they can see
CREATE POLICY "Anyone can view order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
    )
  );

-- Anyone can create order items
CREATE POLICY "Anyone can create order items" ON order_items
  FOR INSERT WITH CHECK (true);

-- CART POLICIES
-- Anyone can manage their own cart
CREATE POLICY "Anyone can manage own cart" ON cart_items
  FOR ALL USING (true);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp for products
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update updated_at timestamp for orders
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update updated_at timestamp for cart_items
DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA - COMMON PRINT PRODUCTS
-- ============================================

-- Insert standard print products (based on WHCC pricing)
INSERT INTO products (name, description, category, base_price, photographer_markup, is_active) VALUES
  ('Lustre Print', 'Professional photo print with lustre finish', 'print', 0.50, 25.00, true),
  ('Metallic Print', 'Vibrant metallic finish photo print', 'print', 1.00, 30.00, true),
  ('Canvas Wrap', 'Gallery-wrapped canvas print', 'canvas', 15.00, 40.00, true),
  ('Framed Print', 'Professional print with black frame', 'frame', 25.00, 35.00, true),
  ('Metal Print', 'High-gloss aluminum print', 'metal', 30.00, 40.00, true),
  ('Acrylic Print', 'Stunning acrylic face-mounted print', 'acrylic', 50.00, 45.00, true)
ON CONFLICT DO NOTHING;

-- Insert common print sizes for Lustre Prints
INSERT INTO product_variants (product_id, size, price, is_available)
SELECT 
  p.id,
  size_option.size,
  size_option.price,
  true
FROM products p
CROSS JOIN (
  VALUES 
    ('4x6', 0.50),
    ('5x7', 1.00),
    ('8x10', 3.00),
    ('11x14', 8.00),
    ('16x20', 15.00),
    ('20x30', 25.00)
) AS size_option(size, price)
WHERE p.name = 'Lustre Print'
ON CONFLICT DO NOTHING;

-- Insert common sizes for Canvas Wraps
INSERT INTO product_variants (product_id, size, price, is_available)
SELECT 
  p.id,
  size_option.size,
  size_option.price,
  true
FROM products p
CROSS JOIN (
  VALUES 
    ('8x10', 25.00),
    ('11x14', 35.00),
    ('16x20', 60.00),
    ('20x30', 100.00),
    ('24x36', 150.00)
) AS size_option(size, price)
WHERE p.name = 'Canvas Wrap'
ON CONFLICT DO NOTHING;

-- Insert common sizes for Metal Prints
INSERT INTO product_variants (product_id, size, price, is_available)
SELECT 
  p.id,
  size_option.size,
  size_option.price,
  true
FROM products p
CROSS JOIN (
  VALUES 
    ('8x10', 40.00),
    ('11x14', 60.00),
    ('16x20', 100.00),
    ('20x30', 180.00),
    ('24x36', 250.00)
) AS size_option(size, price)
WHERE p.name = 'Metal Print'
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('products', 'product_variants', 'orders', 'order_items', 'cart_items');

-- Check products and variants
-- SELECT p.name, p.category, pv.size, pv.price 
-- FROM products p 
-- JOIN product_variants pv ON p.id = pv.product_id 
-- WHERE p.is_active = true
-- ORDER BY p.name, pv.price;

-- Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('products', 'product_variants', 'orders', 'order_items', 'cart_items');

-- ============================================
SELECT 'Phase 3 database schema created successfully!' AS status,
       'Products seeded with common print options' AS products_status,
       'Ready to build shopping cart and checkout' AS next_step;
