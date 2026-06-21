-- ============================================================
-- MODUL 1: KODE PROMO & DISKON
-- Jalankan KEDUA di Supabase SQL Editor (setelah 001)
-- ============================================================
-- Fitur:
--   ✅ Kode promo dengan diskon persentase atau nominal tetap
--   ✅ Batas masa berlaku (valid_from - valid_until)
--   ✅ Kuota penggunaan global & per-user
--   ✅ Minimal pembelian
--   ✅ Maksimal potongan (untuk tipe persentase)
--   ✅ Log penggunaan promo per user per order
-- ============================================================

-- ────────────────────────────────────────────
-- 1. PROMOS — Daftar Kode Promo
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.promos (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code           VARCHAR(50) UNIQUE NOT NULL,
    description    TEXT,
    discount_type  VARCHAR(20) NOT NULL DEFAULT 'percentage'
                   CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(12,2) NOT NULL CHECK (discount_value > 0),
    max_discount   NUMERIC(12,2) DEFAULT NULL,
    min_purchase   NUMERIC(12,2) DEFAULT 0,
    usage_limit    INTEGER DEFAULT NULL,
    usage_count    INTEGER DEFAULT 0,
    per_user_limit INTEGER DEFAULT 1,
    valid_from     TIMESTAMPTZ NOT NULL DEFAULT now(),
    valid_until    TIMESTAMPTZ NOT NULL,
    is_active      BOOLEAN DEFAULT true,
    created_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at     TIMESTAMPTZ DEFAULT now(),
    updated_at     TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.promos IS 'Kode promo dan diskon untuk checkout pelanggan';
COMMENT ON COLUMN public.promos.discount_type IS 'percentage = persen dari subtotal, fixed = potongan nominal Rupiah';
COMMENT ON COLUMN public.promos.discount_value IS 'Nilai diskon: 0-100 untuk percentage, nominal Rupiah untuk fixed';
COMMENT ON COLUMN public.promos.max_discount IS 'Batas maksimal diskon dalam Rupiah (hanya berlaku untuk tipe percentage)';
COMMENT ON COLUMN public.promos.usage_limit IS 'Kuota total penggunaan promo (NULL = unlimited)';
COMMENT ON COLUMN public.promos.per_user_limit IS 'Maks pemakaian per user (default 1)';

CREATE INDEX IF NOT EXISTS idx_promos_code ON public.promos(code);
CREATE INDEX IF NOT EXISTS idx_promos_valid_until ON public.promos(valid_until);
CREATE INDEX IF NOT EXISTS idx_promos_is_active ON public.promos(is_active);

-- ────────────────────────────────────────────
-- 2. PROMO USAGE LOG — Riwayat Penggunaan per User
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.promo_usage (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promo_id         UUID NOT NULL REFERENCES public.promos(id) ON DELETE CASCADE,
    user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id         UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    discount_applied NUMERIC(12,2) NOT NULL,
    used_at          TIMESTAMPTZ DEFAULT now(),

    UNIQUE(promo_id, user_id, order_id)
);

COMMENT ON TABLE public.promo_usage IS 'Log setiap kali user menggunakan kode promo pada sebuah pesanan';

CREATE INDEX IF NOT EXISTS idx_promo_usage_user ON public.promo_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_promo_usage_promo ON public.promo_usage(promo_id);

-- ────────────────────────────────────────────
-- 3. Tambahkan FK promo_id ke orders
-- ────────────────────────────────────────────
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_orders_promo'
        AND table_name = 'orders'
    ) THEN
        ALTER TABLE public.orders
            ADD CONSTRAINT fk_orders_promo
            FOREIGN KEY (promo_id) REFERENCES public.promos(id) ON DELETE SET NULL;
    END IF;
END
$$;

-- ────────────────────────────────────────────
-- 4. SEED: Data Promo Awal (contoh)
-- ────────────────────────────────────────────
INSERT INTO public.promos (code, description, discount_type, discount_value, max_discount, min_purchase, usage_limit, per_user_limit, valid_from, valid_until) VALUES
    ('SEHAT2026',    'Promo Tahun Sehat 2026 — Diskon 10%',            'percentage', 10.00, 50000,  50000,  100, 1, now(), now() + INTERVAL '90 days'),
    ('OBATGRATIS',   'Potongan Rp 25.000 untuk pembelian pertama',     'fixed',      25000, NULL,   30000,  50,  1, now(), now() + INTERVAL '60 days'),
    ('MEMBER15',     'Diskon khusus member 15%',                        'percentage', 15.00, 75000,  100000, NULL, 2, now(), now() + INTERVAL '180 days'),
    ('DIABETESCARE', 'Diskon 20% untuk obat diabetes rutin',            'percentage', 20.00, 100000, 50000,  200, 3, now(), now() + INTERVAL '365 days'),
    ('WELCOME10K',   'Selamat datang! Potongan Rp 10.000',             'fixed',      10000, NULL,   20000,  NULL, 1, now(), now() + INTERVAL '30 days')
ON CONFLICT (code) DO NOTHING;
