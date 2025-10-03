-- ============================================
-- VERIFY PHASE 3 DATABASE SETUP
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Check if orders table exists
SELECT 
  'orders' as table_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders' AND table_schema = 'public')
    THEN '✅ EXISTS'
    ELSE '❌ MISSING - Run supabase-phase3-schema.sql!'
  END as status;

-- 2. Check if order_items table exists  
SELECT 
  'order_items' as table_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_items' AND table_schema = 'public')
    THEN '✅ EXISTS'
    ELSE '❌ MISSING - Run supabase-phase3-schema.sql!'
  END as status;

-- 3. Check if products table exists
SELECT 
  'products' as table_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products' AND table_schema = 'public')
    THEN '✅ EXISTS'
    ELSE '❌ MISSING - Run supabase-phase3-schema.sql!'
  END as status;

-- 4. Check if product_variants table exists
SELECT 
  'product_variants' as table_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_variants' AND table_schema = 'public')
    THEN '✅ EXISTS'
    ELSE '❌ MISSING - Run supabase-phase3-schema.sql!'
  END as status;

-- 5. Check if products are seeded
SELECT 
  'products_count' as check_name,
  COUNT(*)::text || ' products' as status
FROM products;

-- 6. Check if product variants are seeded
SELECT 
  'variants_count' as check_name,
  COUNT(*)::text || ' variants' as status
FROM product_variants;

-- 7. Check RLS policies on orders
SELECT 
  'orders_rls' as check_name,
  CASE 
    WHEN rowsecurity THEN '✅ ENABLED'
    ELSE '❌ DISABLED'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'orders';

-- 8. Check if anyone can create orders (RLS policy)
SELECT 
  'orders_insert_policy' as check_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'orders' 
      AND policyname = 'Anyone can create orders'
    )
    THEN '✅ EXISTS'
    ELSE '❌ MISSING - Check RLS policies'
  END as status;

-- ============================================
-- If you see any ❌ MISSING, you need to:
-- 1. Open supabase-phase3-schema.sql
-- 2. Copy ALL the contents
-- 3. Run it in Supabase SQL Editor
-- ============================================
