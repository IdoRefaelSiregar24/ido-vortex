-- ============================================================
-- VERIFIKASI — Jalankan setelah semua migration (001-008)
-- ============================================================
-- File ini untuk memverifikasi bahwa semua tabel, RLS, dan
-- functions telah berhasil dibuat dengan benar.
-- ============================================================

-- ────────────────────────────────────────────
-- 1. Verifikasi semua tabel tercipta (harus 14 tabel)
-- ────────────────────────────────────────────
SELECT '✅ TABEL' AS check_type, table_name, 'EXISTS' AS status
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
    'products', 'orders', 'order_items',
    'promos', 'promo_usage',
    'subscriptions', 'subscription_deliveries',
    'loyalty_config', 'points_transactions',
    'refill_reminders',
    'patient_health_profiles', 'patient_allergies',
    'patient_segments', 'patient_segment_members'
)
ORDER BY table_name;

-- ────────────────────────────────────────────
-- 2. Verifikasi RLS aktif di semua tabel
-- ────────────────────────────────────────────
SELECT '🔒 RLS' AS check_type, tablename, 
    CASE WHEN rowsecurity THEN '✅ ENABLED' ELSE '❌ DISABLED' END AS status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
    'products', 'orders', 'order_items',
    'promos', 'promo_usage',
    'subscriptions', 'subscription_deliveries',
    'loyalty_config', 'points_transactions',
    'refill_reminders',
    'patient_health_profiles', 'patient_allergies',
    'patient_segments', 'patient_segment_members'
)
ORDER BY tablename;

-- ────────────────────────────────────────────
-- 3. Verifikasi semua RLS policies (harus ~43 policies)
-- ────────────────────────────────────────────
SELECT '📋 POLICY' AS check_type, schemaname || '.' || tablename AS table_name, policyname, cmd AS operation
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ────────────────────────────────────────────
-- 4. Verifikasi functions tercipta
-- ────────────────────────────────────────────
SELECT '⚙️ FUNCTION' AS check_type, routine_name, 'EXISTS' AS status
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
    'validate_promo_code',
    'earn_loyalty_points',
    'redeem_loyalty_points',
    'confirm_redeem_points',
    'generate_refill_reminders',
    'reorder_from_reminder',
    'process_subscription_delivery',
    'admin_adjust_points',
    'is_admin_or_staff',
    'is_admin'
)
ORDER BY routine_name;

-- ────────────────────────────────────────────
-- 5. Verifikasi views tercipta
-- ────────────────────────────────────────────
SELECT '👁️ VIEW' AS check_type, table_name, 'EXISTS' AS status
FROM information_schema.views
WHERE table_schema = 'public'
AND table_name IN (
    'admin_refill_dashboard',
    'admin_subscription_dashboard'
)
ORDER BY table_name;

-- ────────────────────────────────────────────
-- 6. Verifikasi seed data
-- ────────────────────────────────────────────
SELECT '🏷️ PRODUCTS' AS check_type, COUNT(*) AS total FROM public.products;
SELECT '🎫 PROMOS' AS check_type, COUNT(*) AS total FROM public.promos;
SELECT '🏥 SEGMENTS' AS check_type, COUNT(*) AS total FROM public.patient_segments;
SELECT '⚙️ LOYALTY CONFIG' AS check_type, COUNT(*) AS total FROM public.loyalty_config;

-- ────────────────────────────────────────────
-- 7. Verifikasi Foreign Keys
-- ────────────────────────────────────────────
SELECT '🔗 FK' AS check_type, 
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS references_table,
    ccu.column_name AS references_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- ────────────────────────────────────────────
-- 8. Quick test: validate_promo_code
-- ────────────────────────────────────────────
-- Uncomment baris di bawah setelah login sebagai user:
-- SELECT public.validate_promo_code('SEHAT2026', 100000);
-- SELECT public.validate_promo_code('WELCOME10K', 5000); -- harus gagal (min_purchase 20000)
