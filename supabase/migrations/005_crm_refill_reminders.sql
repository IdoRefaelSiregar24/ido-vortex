-- ============================================================
-- MODUL 4: PENGINGAT OTOMATIS TEBUS OBAT (Refill Reminder)
-- Jalankan KELIMA di Supabase SQL Editor (setelah 004)
-- ============================================================
-- Fitur:
--   ✅ Otomatis hitung estimasi obat habis berdasarkan daily_dosage
--   ✅ Pengingat X hari sebelum obat habis
--   ✅ Status tracking: active, dismissed, reordered, expired
--   ✅ 1-klik re-order dari halaman member
--   ✅ Dashboard admin: urgensi (overdue, urgent, upcoming)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.refill_reminders (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id         UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    order_id           UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    quantity_purchased INTEGER NOT NULL,
    daily_dosage       NUMERIC(5,2) NOT NULL,
    estimated_run_out  DATE NOT NULL,
    remind_at          DATE NOT NULL,
    remind_days_before INTEGER DEFAULT 3,
    status             VARCHAR(20) DEFAULT 'active'
                       CHECK (status IN ('active', 'dismissed', 'reordered', 'expired')),
    is_read            BOOLEAN DEFAULT false,
    reorder_order_id   UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    created_at         TIMESTAMPTZ DEFAULT now(),
    updated_at         TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.refill_reminders IS 'Pengingat otomatis tebus obat berdasarkan estimasi konsumsi harian';
COMMENT ON COLUMN public.refill_reminders.order_id IS 'Pesanan asal yang menjadi basis perhitungan estimasi habis';
COMMENT ON COLUMN public.refill_reminders.quantity_purchased IS 'Jumlah unit obat yang dibeli pada pesanan asal';
COMMENT ON COLUMN public.refill_reminders.daily_dosage IS 'Dosis harian (unit/hari) — diambil dari products.daily_dosage saat order';
COMMENT ON COLUMN public.refill_reminders.estimated_run_out IS 'Estimasi tanggal obat habis: order_date + (quantity / daily_dosage) hari';
COMMENT ON COLUMN public.refill_reminders.remind_at IS 'Tanggal reminder muncul: estimated_run_out - remind_days_before';
COMMENT ON COLUMN public.refill_reminders.reorder_order_id IS 'ID order baru jika pasien sudah melakukan re-order dari reminder ini';

CREATE INDEX IF NOT EXISTS idx_refill_user ON public.refill_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_refill_remind_at ON public.refill_reminders(remind_at);
CREATE INDEX IF NOT EXISTS idx_refill_status ON public.refill_reminders(status);
CREATE INDEX IF NOT EXISTS idx_refill_estimated ON public.refill_reminders(estimated_run_out);
CREATE INDEX IF NOT EXISTS idx_refill_product ON public.refill_reminders(product_id);
