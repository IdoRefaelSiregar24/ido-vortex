-- ============================================================
-- MODUL 3: POIN REWARD & LOYALITAS
-- Jalankan KEEMPAT di Supabase SQL Editor (setelah 003)
-- ============================================================
-- Fitur:
--   ✅ Konfigurasi global perolehan poin (earn_percentage)
--   ✅ Multiplier poin berdasarkan tier (Free 1x, Premium 1.5x, VIP 2x)
--   ✅ Konversi poin ke Rupiah saat checkout (redeem)
--   ✅ Batas maks redeem per transaksi (% dari subtotal)
--   ✅ Histori lengkap: earn, redeem, bonus, expire, adjustment
-- ============================================================

-- ────────────────────────────────────────────
-- 1. LOYALTY CONFIG — Konfigurasi Global
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.loyalty_config (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    earn_percentage         NUMERIC(5,2) NOT NULL DEFAULT 1.00,
    min_transaction         NUMERIC(12,2) DEFAULT 0,
    points_to_currency_rate NUMERIC(10,2) DEFAULT 100,
    max_redeem_percentage   NUMERIC(5,2) DEFAULT 50.00,
    multiplier_premium      NUMERIC(3,1) DEFAULT 1.5,
    multiplier_vip          NUMERIC(3,1) DEFAULT 2.0,
    is_active               BOOLEAN DEFAULT true,
    updated_by              UUID REFERENCES auth.users(id),
    updated_at              TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.loyalty_config IS 'Konfigurasi global sistem poin loyalitas';
COMMENT ON COLUMN public.loyalty_config.earn_percentage IS 'Persentase dari total transaksi yang dikonversi jadi poin. Misal: 1.00 berarti Rp 100 = 1 poin';
COMMENT ON COLUMN public.loyalty_config.points_to_currency_rate IS 'Nilai tukar 1 poin = berapa Rupiah saat redeem. Misal: 100 berarti 1 poin = Rp 100';
COMMENT ON COLUMN public.loyalty_config.max_redeem_percentage IS 'Maks persentase dari subtotal yang boleh dibayar dengan poin. Misal: 50 berarti maks 50% dari subtotal';
COMMENT ON COLUMN public.loyalty_config.multiplier_premium IS 'Pengali poin untuk member tier Premium';
COMMENT ON COLUMN public.loyalty_config.multiplier_vip IS 'Pengali poin untuk member tier VIP';

-- Insert default config (hanya jika belum ada)
INSERT INTO public.loyalty_config (
    earn_percentage, min_transaction, points_to_currency_rate,
    max_redeem_percentage, multiplier_premium, multiplier_vip
)
SELECT 1.00, 10000, 100, 50.00, 1.5, 2.0
WHERE NOT EXISTS (SELECT 1 FROM public.loyalty_config);

-- ────────────────────────────────────────────
-- 2. POINTS TRANSACTIONS — Histori Poin
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.points_transactions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id      UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    type          VARCHAR(20) NOT NULL
                  CHECK (type IN ('earn', 'redeem', 'bonus', 'expire', 'adjustment')),
    points        INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    description   TEXT,
    created_at    TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.points_transactions IS 'Histori lengkap perolehan dan penggunaan poin loyalitas';
COMMENT ON COLUMN public.points_transactions.type IS 'earn = dapat dari transaksi, redeem = tukar jadi diskon, bonus = bonus manual admin, expire = poin kadaluarsa, adjustment = koreksi admin';
COMMENT ON COLUMN public.points_transactions.points IS 'Positif untuk earn/bonus, negatif untuk redeem/expire';
COMMENT ON COLUMN public.points_transactions.balance_after IS 'Saldo poin setelah transaksi ini (untuk audit trail)';

CREATE INDEX IF NOT EXISTS idx_points_tx_user ON public.points_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_points_tx_type ON public.points_transactions(type);
CREATE INDEX IF NOT EXISTS idx_points_tx_created ON public.points_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_points_tx_order ON public.points_transactions(order_id);
