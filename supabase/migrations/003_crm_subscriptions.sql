-- ============================================================
-- MODUL 2: PAKET LANGGANAN OBAT RUTIN (Subscription)
-- Jalankan KETIGA di Supabase SQL Editor (setelah 002)
-- ============================================================
-- Fitur:
--   ✅ Berlangganan obat kronis (diabetes, hipertensi, dll)
--   ✅ Interval pengiriman fleksibel (7, 14, 30, 60, 90 hari)
--   ✅ Status: active, paused, cancelled, expired
--   ✅ Tracking jadwal & riwayat pengiriman
--   ✅ Catatan medis per subscription
-- ============================================================

-- ────────────────────────────────────────────
-- 1. SUBSCRIPTIONS — Paket Langganan
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id         UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity           INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    interval_days      INTEGER NOT NULL DEFAULT 30 CHECK (interval_days >= 7),
    status             VARCHAR(20) NOT NULL DEFAULT 'active'
                       CHECK (status IN ('active', 'paused', 'cancelled', 'expired')),
    next_delivery_date DATE NOT NULL,
    last_delivery_date DATE,
    total_deliveries   INTEGER DEFAULT 0,
    shipping_address   TEXT,
    medical_notes      TEXT,
    created_at         TIMESTAMPTZ DEFAULT now(),
    updated_at         TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.subscriptions IS 'Paket langganan obat rutin untuk pasien penyakit kronis';
COMMENT ON COLUMN public.subscriptions.interval_days IS 'Rentang hari antar pengiriman: 7, 14, 30, 60, atau 90';
COMMENT ON COLUMN public.subscriptions.medical_notes IS 'Catatan medis dari dokter atau apoteker terkait dosis/aturan pakai';
COMMENT ON COLUMN public.subscriptions.total_deliveries IS 'Counter jumlah pengiriman yang sudah berhasil dilakukan';

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_delivery ON public.subscriptions(next_delivery_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_product ON public.subscriptions(product_id);

-- ────────────────────────────────────────────
-- 2. SUBSCRIPTION DELIVERIES — Log Pengiriman
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subscription_deliveries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    order_id        UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    delivery_date   DATE NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'scheduled'
                    CHECK (status IN ('scheduled', 'processing', 'delivered', 'failed')),
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.subscription_deliveries IS 'Riwayat dan jadwal pengiriman per langganan obat';
COMMENT ON COLUMN public.subscription_deliveries.order_id IS 'Order yang otomatis dibuat saat pengiriman diproses';

CREATE INDEX IF NOT EXISTS idx_sub_deliveries_sub ON public.subscription_deliveries(subscription_id);
CREATE INDEX IF NOT EXISTS idx_sub_deliveries_date ON public.subscription_deliveries(delivery_date);
CREATE INDEX IF NOT EXISTS idx_sub_deliveries_status ON public.subscription_deliveries(status);

-- ────────────────────────────────────────────
-- 3. FUNCTION: Proses Pengiriman Subscription
--    Digunakan oleh Admin untuk memproses pengiriman terjadwal
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.process_subscription_delivery(
    p_subscription_id UUID
)
RETURNS JSON AS $$
DECLARE
    v_sub RECORD;
    v_product RECORD;
    v_order_number VARCHAR;
    v_order_id UUID;
BEGIN
    -- Ambil data subscription
    SELECT * INTO v_sub FROM public.subscriptions
    WHERE id = p_subscription_id AND status = 'active';

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'Subscription tidak ditemukan atau tidak aktif.');
    END IF;

    -- Ambil data produk
    SELECT * INTO v_product FROM public.products WHERE id = v_sub.product_id;

    -- Generate order number
    v_order_number := 'SUB-' || to_char(now(), 'YYYYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 6);

    -- Buat order otomatis
    INSERT INTO public.orders (order_number, user_id, status, subtotal, total, source, shipping_address, notes)
    VALUES (
        v_order_number,
        v_sub.user_id,
        'processing',
        v_product.price * v_sub.quantity,
        v_product.price * v_sub.quantity,
        'subscription',
        v_sub.shipping_address,
        format('Pesanan otomatis dari langganan %s — %s x%s', v_sub.id, v_product.name, v_sub.quantity)
    )
    RETURNING id INTO v_order_id;

    -- Buat order items
    INSERT INTO public.order_items (order_id, product_id, product_name, quantity, unit_price)
    VALUES (v_order_id, v_sub.product_id, v_product.name, v_sub.quantity, v_product.price);

    -- Catat delivery
    INSERT INTO public.subscription_deliveries (subscription_id, order_id, delivery_date, status)
    VALUES (p_subscription_id, v_order_id, CURRENT_DATE, 'processing');

    -- Update subscription
    UPDATE public.subscriptions SET
        last_delivery_date = CURRENT_DATE,
        next_delivery_date = CURRENT_DATE + (interval_days || ' days')::INTERVAL,
        total_deliveries = total_deliveries + 1,
        updated_at = now()
    WHERE id = p_subscription_id;

    RETURN json_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'next_delivery_date', (CURRENT_DATE + (v_sub.interval_days || ' days')::INTERVAL)::TEXT
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.process_subscription_delivery IS 'Memproses pengiriman terjadwal: buat order otomatis → catat delivery → update jadwal berikutnya';
