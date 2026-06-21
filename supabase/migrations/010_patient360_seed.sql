-- ============================================================
-- MODUL: PATIENT 360 — SEED DATA & VIEW
-- Jalankan KESEPULUH di Supabase SQL Editor (setelah 009)
-- ============================================================
-- Fitur:
--   ✅ View gabungan patient_health_profiles + allergies + segments
--   ✅ Seed data dummy Budi Santoso untuk testing
-- ============================================================

-- ────────────────────────────────────────────
-- 1. VIEW: patient_360_summary
--    Gabungan semua data pasien untuk tampilan admin
-- ────────────────────────────────────────────
CREATE OR REPLACE VIEW public.patient_360_summary AS
SELECT
    p.id                        AS profile_id,
    p.user_id,
    pr.full_name,
    pr.email,
    pr.phone,
    p.date_of_birth,
    DATE_PART('year', AGE(p.date_of_birth))::INT AS age,
    p.gender,
    p.blood_type,
    p.weight_kg,
    p.height_cm,
    p.medical_conditions,
    p.emergency_contact_name,
    p.emergency_contact_phone,
    p.notes,
    -- Alergi: array allergen + severity terburuk
    ARRAY_AGG(DISTINCT a.allergen)          FILTER (WHERE a.allergen IS NOT NULL AND a.is_active = true)  AS active_allergens,
    ARRAY_AGG(DISTINCT a.severity)          FILTER (WHERE a.severity IS NOT NULL AND a.is_active = true)  AS allergy_severities,
    -- Apakah ada alergi life_threatening?
    BOOL_OR(a.severity = 'life_threatening' AND a.is_active = true)                                        AS has_critical_allergy,
    -- Segmentasi
    ARRAY_AGG(DISTINCT seg.name)            FILTER (WHERE seg.name IS NOT NULL)                            AS segment_names,
    ARRAY_AGG(DISTINCT seg.color)           FILTER (WHERE seg.color IS NOT NULL)                           AS segment_colors,
    -- Timestamps
    p.created_at,
    p.updated_at
FROM public.patient_health_profiles p
INNER JOIN public.profiles pr          ON pr.id = p.user_id
LEFT  JOIN public.patient_allergies a  ON a.user_id = p.user_id
LEFT  JOIN public.patient_segment_members psm ON psm.user_id = p.user_id
LEFT  JOIN public.patient_segments seg ON seg.id = psm.segment_id
GROUP BY p.id, pr.full_name, pr.email, pr.phone, p.user_id,
         p.date_of_birth, p.gender, p.blood_type, p.weight_kg,
         p.height_cm, p.medical_conditions, p.emergency_contact_name,
         p.emergency_contact_phone, p.notes, p.created_at, p.updated_at;

COMMENT ON VIEW public.patient_360_summary IS
    'View 360° pasien — gabungan profil, alergi, dan segmen untuk dashboard admin';

-- ────────────────────────────────────────────
-- 2. FUNCTION: get_patient_last_transaction
--    Ambil transaksi terakhir setiap pasien
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_patient_last_transaction(p_user_id UUID)
RETURNS TABLE (
    product_name    TEXT,
    quantity        INT,
    total_amount    NUMERIC,
    transaction_date TIMESTAMPTZ
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    SELECT
        oi.product_name::TEXT,
        oi.quantity::INT,
        o.total_amount::NUMERIC,
        o.created_at AS transaction_date
    FROM public.orders o
    JOIN public.order_items oi ON oi.order_id = o.id
    WHERE o.user_id = p_user_id
    ORDER BY o.created_at DESC
    LIMIT 1;
END;
$$;

-- ────────────────────────────────────────────
-- 3. SEED: Tambahkan kolom product_name ke order_items jika belum ada
-- ────────────────────────────────────────────
-- (Aman dijalankan berulang karena ada IF NOT EXISTS guard)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name   = 'order_items'
          AND column_name  = 'product_name'
    ) THEN
        ALTER TABLE public.order_items ADD COLUMN product_name VARCHAR(255);
    END IF;
END $$;

-- ────────────────────────────────────────────
-- 4. INDEX tambahan untuk performa dashboard
-- ────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_php_user_id
    ON public.patient_health_profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_allergies_active
    ON public.patient_allergies(user_id, is_active)
    WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_psm_user_segment
    ON public.patient_segment_members(user_id, segment_id);
