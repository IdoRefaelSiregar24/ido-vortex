-- ============================================================
-- ROW LEVEL SECURITY (RLS) — SEMUA TABEL CRM
-- Jalankan KETUJUH di Supabase SQL Editor (setelah 006)
-- ============================================================
-- Prinsip Keamanan:
--   ✅ Guest/Member hanya bisa akses data miliknya sendiri
--   ✅ Admin/Staff/Manager punya akses penuh (baca semua data)
--   ✅ Hanya Admin yang bisa CRUD data master (promo, segment, config)
--   ✅ Data kesehatan (profil, alergi) dilindungi ketat
--   ✅ Promo publik terlihat oleh semua authenticated user
-- ============================================================

-- ────────────────────────────────────────────
-- HELPER FUNCTIONS: Cek Role User
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin_or_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'manager', 'staff')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.is_admin_or_staff() IS 'Cek apakah current user memiliki role admin, manager, atau staff';
COMMENT ON FUNCTION public.is_admin() IS 'Cek apakah current user memiliki role admin';

-- ────────────────────────────────────────────
-- CLEANUP: Drop all existing policies in public schema to avoid duplicate policy errors
-- ────────────────────────────────────────────
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname, tablename, schemaname
        FROM pg_policies
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- ══════════════════════════════════════════════════════════════
-- PROFILES — RLS
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_authenticated"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "profiles_insert_admin"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "profiles_update_own_or_admin"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id OR public.is_admin())
    WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_delete_admin"
    ON public.profiles FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ══════════════════════════════════════════════════════════════
-- PRODUCTS — RLS
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Semua user (termasuk anon) bisa melihat produk aktif
CREATE POLICY "products_select_active"
    ON public.products FOR SELECT
    USING (is_active = true);

-- Admin/Staff bisa melihat SEMUA produk (termasuk non-aktif)
CREATE POLICY "products_select_all_admin"
    ON public.products FOR SELECT
    USING (public.is_admin_or_staff());

-- Admin/Staff bisa insert produk
CREATE POLICY "products_insert_admin"
    ON public.products FOR INSERT
    WITH CHECK (public.is_admin_or_staff());

-- Admin/Staff bisa update produk
CREATE POLICY "products_update_admin"
    ON public.products FOR UPDATE
    USING (public.is_admin_or_staff());

-- Hanya Admin yang bisa delete produk
CREATE POLICY "products_delete_admin"
    ON public.products FOR DELETE
    USING (public.is_admin());


-- ══════════════════════════════════════════════════════════════
-- ORDERS — RLS
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- User hanya bisa lihat order miliknya sendiri
CREATE POLICY "orders_select_own"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id);

-- Admin/Staff bisa lihat semua order
CREATE POLICY "orders_select_admin"
    ON public.orders FOR SELECT
    USING (public.is_admin_or_staff());

-- User bisa membuat order untuk dirinya sendiri
CREATE POLICY "orders_insert_own"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Admin/Staff bisa insert order (untuk subscription auto-order)
CREATE POLICY "orders_insert_admin"
    ON public.orders FOR INSERT
    WITH CHECK (public.is_admin_or_staff());

-- Admin/Staff bisa update status order
CREATE POLICY "orders_update_admin"
    ON public.orders FOR UPDATE
    USING (public.is_admin_or_staff());

-- User bisa cancel order miliknya (hanya jika masih pending)
CREATE POLICY "orders_update_own_cancel"
    ON public.orders FOR UPDATE
    USING (auth.uid() = user_id AND status = 'pending');


-- ══════════════════════════════════════════════════════════════
-- ORDER ITEMS — RLS
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- User bisa lihat items dari order miliknya
CREATE POLICY "order_items_select_own"
    ON public.order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- Admin/Staff bisa lihat semua order items
CREATE POLICY "order_items_select_admin"
    ON public.order_items FOR SELECT
    USING (public.is_admin_or_staff());

-- User bisa insert items ke order miliknya
CREATE POLICY "order_items_insert_own"
    ON public.order_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- Admin/Staff bisa insert order items
CREATE POLICY "order_items_insert_admin"
    ON public.order_items FOR INSERT
    WITH CHECK (public.is_admin_or_staff());


-- ══════════════════════════════════════════════════════════════
-- PROMOS — RLS
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;

-- Semua authenticated user bisa lihat promo aktif & masih berlaku
CREATE POLICY "promos_select_active"
    ON public.promos FOR SELECT
    TO authenticated
    USING (
        is_active = true
        AND now() BETWEEN valid_from AND valid_until
        AND (usage_limit IS NULL OR usage_count < usage_limit)
    );

-- Admin/Staff bisa lihat SEMUA promo (termasuk expired & non-aktif)
CREATE POLICY "promos_select_admin"
    ON public.promos FOR SELECT
    USING (public.is_admin_or_staff());

-- Hanya Admin yang bisa CRUD promo
CREATE POLICY "promos_insert_admin"
    ON public.promos FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "promos_update_admin"
    ON public.promos FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "promos_delete_admin"
    ON public.promos FOR DELETE
    USING (public.is_admin());


-- ══════════════════════════════════════════════════════════════
-- PROMO USAGE — RLS
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.promo_usage ENABLE ROW LEVEL SECURITY;

-- User bisa lihat riwayat pemakaian promo miliknya
CREATE POLICY "promo_usage_select_own"
    ON public.promo_usage FOR SELECT
    USING (auth.uid() = user_id);

-- Admin bisa lihat semua usage
CREATE POLICY "promo_usage_select_admin"
    ON public.promo_usage FOR SELECT
    USING (public.is_admin_or_staff());

-- User bisa insert usage (saat apply promo di checkout)
CREATE POLICY "promo_usage_insert_own"
    ON public.promo_usage FOR INSERT
    WITH CHECK (auth.uid() = user_id);


-- ══════════════════════════════════════════════════════════════
-- SUBSCRIPTIONS — RLS
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- User bisa lihat subscription miliknya
CREATE POLICY "subscriptions_select_own"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- Admin/Staff bisa lihat semua
CREATE POLICY "subscriptions_select_admin"
    ON public.subscriptions FOR SELECT
    USING (public.is_admin_or_staff());

-- User bisa membuat subscription
CREATE POLICY "subscriptions_insert_own"
    ON public.subscriptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- User bisa update subscription miliknya (pause/cancel)
CREATE POLICY "subscriptions_update_own"
    ON public.subscriptions FOR UPDATE
    USING (auth.uid() = user_id);

-- Admin bisa update semua subscription
CREATE POLICY "subscriptions_update_admin"
    ON public.subscriptions FOR UPDATE
    USING (public.is_admin_or_staff());


-- ══════════════════════════════════════════════════════════════
-- SUBSCRIPTION DELIVERIES — RLS
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.subscription_deliveries ENABLE ROW LEVEL SECURITY;

-- User bisa lihat deliveries dari subscription miliknya
CREATE POLICY "sub_deliveries_select_own"
    ON public.subscription_deliveries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.subscriptions
            WHERE subscriptions.id = subscription_deliveries.subscription_id
            AND subscriptions.user_id = auth.uid()
        )
    );

-- Admin/Staff bisa lihat semua
CREATE POLICY "sub_deliveries_select_admin"
    ON public.subscription_deliveries FOR SELECT
    USING (public.is_admin_or_staff());

-- Hanya Admin/Staff yang bisa insert & update deliveries
CREATE POLICY "sub_deliveries_insert_admin"
    ON public.subscription_deliveries FOR INSERT
    WITH CHECK (public.is_admin_or_staff());

CREATE POLICY "sub_deliveries_update_admin"
    ON public.subscription_deliveries FOR UPDATE
    USING (public.is_admin_or_staff());


-- ══════════════════════════════════════════════════════════════
-- LOYALTY CONFIG — RLS
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.loyalty_config ENABLE ROW LEVEL SECURITY;

-- Semua authenticated user bisa baca config (untuk kalkulasi di frontend)
CREATE POLICY "loyalty_config_select_all"
    ON public.loyalty_config FOR SELECT
    TO authenticated
    USING (true);

-- Hanya admin yang bisa update config
CREATE POLICY "loyalty_config_update_admin"
    ON public.loyalty_config FOR UPDATE
    USING (public.is_admin());


-- ══════════════════════════════════════════════════════════════
-- POINTS TRANSACTIONS — RLS
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;

-- User bisa lihat histori poin miliknya
CREATE POLICY "points_tx_select_own"
    ON public.points_transactions FOR SELECT
    USING (auth.uid() = user_id);

-- Admin bisa lihat semua histori poin
CREATE POLICY "points_tx_select_admin"
    ON public.points_transactions FOR SELECT
    USING (public.is_admin_or_staff());

-- Insert via user sendiri (untuk tracking di frontend)
CREATE POLICY "points_tx_insert_own"
    ON public.points_transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Admin bisa insert (untuk manual adjustment/bonus)
CREATE POLICY "points_tx_insert_admin"
    ON public.points_transactions FOR INSERT
    WITH CHECK (public.is_admin_or_staff());


-- ══════════════════════════════════════════════════════════════
-- REFILL REMINDERS — RLS
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.refill_reminders ENABLE ROW LEVEL SECURITY;

-- User hanya bisa lihat reminder miliknya
CREATE POLICY "refill_select_own"
    ON public.refill_reminders FOR SELECT
    USING (auth.uid() = user_id);

-- Admin/Staff bisa lihat semua (untuk dashboard)
CREATE POLICY "refill_select_admin"
    ON public.refill_reminders FOR SELECT
    USING (public.is_admin_or_staff());

-- User bisa update status reminder miliknya (dismiss/reorder)
CREATE POLICY "refill_update_own"
    ON public.refill_reminders FOR UPDATE
    USING (auth.uid() = user_id);

-- Admin/Staff bisa insert & update reminder
CREATE POLICY "refill_insert_system"
    ON public.refill_reminders FOR INSERT
    WITH CHECK (public.is_admin_or_staff() OR auth.uid() = user_id);

CREATE POLICY "refill_update_admin"
    ON public.refill_reminders FOR UPDATE
    USING (public.is_admin_or_staff());


-- ══════════════════════════════════════════════════════════════
-- PATIENT HEALTH PROFILES — RLS (DATA SENSITIF)
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.patient_health_profiles ENABLE ROW LEVEL SECURITY;

-- User hanya bisa lihat profil kesehatan SENDIRI
CREATE POLICY "health_profile_select_own"
    ON public.patient_health_profiles FOR SELECT
    USING (auth.uid() = user_id);

-- Admin/Apoteker bisa lihat semua (untuk medication safety)
CREATE POLICY "health_profile_select_admin"
    ON public.patient_health_profiles FOR SELECT
    USING (public.is_admin_or_staff());

-- User bisa buat profil kesehatannya
CREATE POLICY "health_profile_insert_own"
    ON public.patient_health_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- User bisa update profil kesehatannya
CREATE POLICY "health_profile_update_own"
    ON public.patient_health_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Admin juga bisa update (dari data resep dokter)
CREATE POLICY "health_profile_update_admin"
    ON public.patient_health_profiles FOR UPDATE
    USING (public.is_admin_or_staff());


-- ══════════════════════════════════════════════════════════════
-- PATIENT ALLERGIES — RLS (DATA KRITIS UNTUK KESELAMATAN)
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.patient_allergies ENABLE ROW LEVEL SECURITY;

-- User hanya bisa lihat alergi SENDIRI
CREATE POLICY "allergies_select_own"
    ON public.patient_allergies FOR SELECT
    USING (auth.uid() = user_id);

-- Admin/Apoteker bisa lihat semua alergi (KRITIS untuk keselamatan)
CREATE POLICY "allergies_select_admin"
    ON public.patient_allergies FOR SELECT
    USING (public.is_admin_or_staff());

-- User bisa CRUD alergi miliknya
CREATE POLICY "allergies_insert_own"
    ON public.patient_allergies FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "allergies_update_own"
    ON public.patient_allergies FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "allergies_delete_own"
    ON public.patient_allergies FOR DELETE
    USING (auth.uid() = user_id);

-- Admin juga bisa manage alergi (jika data dari resep dokter)
CREATE POLICY "allergies_insert_admin"
    ON public.patient_allergies FOR INSERT
    WITH CHECK (public.is_admin_or_staff());

CREATE POLICY "allergies_update_admin"
    ON public.patient_allergies FOR UPDATE
    USING (public.is_admin_or_staff());


-- ══════════════════════════════════════════════════════════════
-- PATIENT SEGMENTS — RLS
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.patient_segments ENABLE ROW LEVEL SECURITY;

-- Semua authenticated user bisa lihat daftar segment
CREATE POLICY "segments_select_all"
    ON public.patient_segments FOR SELECT
    TO authenticated
    USING (true);

-- Hanya Admin yang bisa CRUD segment
CREATE POLICY "segments_insert_admin"
    ON public.patient_segments FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "segments_update_admin"
    ON public.patient_segments FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "segments_delete_admin"
    ON public.patient_segments FOR DELETE
    USING (public.is_admin());


-- ══════════════════════════════════════════════════════════════
-- PATIENT SEGMENT MEMBERS — RLS
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.patient_segment_members ENABLE ROW LEVEL SECURITY;

-- User bisa lihat segment yang dia ikuti
CREATE POLICY "seg_members_select_own"
    ON public.patient_segment_members FOR SELECT
    USING (auth.uid() = user_id);

-- Admin bisa lihat semua mapping
CREATE POLICY "seg_members_select_admin"
    ON public.patient_segment_members FOR SELECT
    USING (public.is_admin_or_staff());

-- Hanya admin/staff yang bisa assign/remove segment
CREATE POLICY "seg_members_insert_admin"
    ON public.patient_segment_members FOR INSERT
    WITH CHECK (public.is_admin_or_staff());

CREATE POLICY "seg_members_delete_admin"
    ON public.patient_segment_members FOR DELETE
    USING (public.is_admin_or_staff());
