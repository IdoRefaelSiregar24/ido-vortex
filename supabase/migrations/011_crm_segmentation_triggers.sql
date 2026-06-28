-- ============================================================
-- FASE 2: AUTOMATED CUSTOMER SEGMENTATION (TAGS ENGINE)
-- Jalankan KESEBELAS di Supabase SQL Editor
-- ============================================================
-- Fitur:
--   ✅ Fungsi sync_patient_segments untuk sinkronisasi segmen pasien
--   ✅ Trigger otomatisasi segmen dari profil kesehatan
--   ✅ Trigger otomatisasi segmen dari alergi obat
--   ✅ Trigger otomatisasi segmen dari pembelian obat selesai (Orders completed)
-- ============================================================

-- ────────────────────────────────────────────
-- 1. FUNCTION: public.sync_patient_segments
--    Mengevaluasi kondisi pasien dan memasukkan ke segmen yang cocok.
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.sync_patient_segments(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    v_profile RECORD;
    v_has_diabetes BOOLEAN := false;
    v_has_hipertensi BOOLEAN := false;
    v_has_asma BOOLEAN := false;
    v_has_jantung BOOLEAN := false;
    v_has_kolesterol BOOLEAN := false;
    v_has_hamil BOOLEAN := false;
    v_is_lansia BOOLEAN := false;
    v_has_allergies BOOLEAN := false;

    v_seg_rec RECORD;
    v_should_belong BOOLEAN;
BEGIN
    -- Ambil data profil kesehatan
    SELECT * INTO v_profile FROM public.patient_health_profiles WHERE user_id = p_user_id;

    -- Jika profil kesehatan tidak ditemukan, buat record kosong agar sinkronisasi bisa lanjut
    IF v_profile IS NULL THEN
        INSERT INTO public.patient_health_profiles (user_id, medical_conditions)
        VALUES (p_user_id, ARRAY[]::TEXT[])
        RETURNING * INTO v_profile;
    END IF;

    -- 1. Cek Lansia (>60th)
    IF v_profile.date_of_birth IS NOT NULL THEN
        IF EXTRACT(YEAR FROM AGE(v_profile.date_of_birth)) >= 60 THEN
            v_is_lansia := true;
        END IF;
    END IF;

    -- 2. Cek Alergi Obat
    SELECT EXISTS (
        SELECT 1 FROM public.patient_allergies 
        WHERE user_id = p_user_id AND is_active = true
    ) INTO v_has_allergies;

    -- 3. Cek Kondisi Medis dari array medical_conditions
    IF v_profile.medical_conditions IS NOT NULL THEN
        v_has_diabetes := 'Diabetes' = ANY(v_profile.medical_conditions) 
                       OR 'Diabetes Tipe 1' = ANY(v_profile.medical_conditions) 
                       OR 'Diabetes Tipe 2' = ANY(v_profile.medical_conditions)
                       OR 'diabetes' = ANY(v_profile.medical_conditions);
        v_has_hipertensi := 'Hipertensi' = ANY(v_profile.medical_conditions) 
                         OR 'Hipertensi Kronis' = ANY(v_profile.medical_conditions)
                         OR 'hipertensi' = ANY(v_profile.medical_conditions);
        v_has_asma := 'Asma' = ANY(v_profile.medical_conditions) OR 'asma' = ANY(v_profile.medical_conditions);
        v_has_jantung := 'Jantung' = ANY(v_profile.medical_conditions) 
                      OR 'Penyakit Jantung' = ANY(v_profile.medical_conditions)
                      OR 'jantung' = ANY(v_profile.medical_conditions);
        v_has_kolesterol := 'Kolesterol' = ANY(v_profile.medical_conditions) OR 'kolesterol' = ANY(v_profile.medical_conditions);
        v_has_hamil := 'Kehamilan' = ANY(v_profile.medical_conditions) 
                    OR 'Hamil' = ANY(v_profile.medical_conditions)
                    OR 'hamil' = ANY(v_profile.medical_conditions);
    END IF;

    -- 4. Cek riwayat pembelian obat (Orders & Order Items) dalam 90 hari terakhir
    -- Diabetes meds (Metformin, Glimepiride, Insulin)
    IF NOT v_has_diabetes THEN
        SELECT EXISTS (
            SELECT 1 FROM public.orders o
            JOIN public.order_items oi ON oi.order_id = o.id
            JOIN public.products p ON p.id = oi.product_id
            WHERE o.user_id = p_user_id
            AND o.status = 'completed'
            AND o.created_at >= now() - INTERVAL '90 days'
            AND (p.name ILIKE '%metformin%' OR p.name ILIKE '%glimepiride%' OR p.name ILIKE '%insulin%' OR p.category ILIKE '%diabetes%')
        ) INTO v_has_diabetes;
    END IF;

    -- Hipertensi meds (Amlodipine, Captopril, Valsartan)
    IF NOT v_has_hipertensi THEN
        SELECT EXISTS (
            SELECT 1 FROM public.orders o
            JOIN public.order_items oi ON oi.order_id = o.id
            JOIN public.products p ON p.id = oi.product_id
            WHERE o.user_id = p_user_id
            AND o.status = 'completed'
            AND o.created_at >= now() - INTERVAL '90 days'
            AND (p.name ILIKE '%amlodipine%' OR p.name ILIKE '%captopril%' OR p.name ILIKE '%valsartan%' OR p.category ILIKE '%hipertensi%')
        ) INTO v_has_hipertensi;
    END IF;

    -- Loop segmen untuk update mapping Many-to-Many
    FOR v_seg_rec IN SELECT * FROM public.patient_segments LOOP
        v_should_belong := false;
        
        IF v_seg_rec.name = 'Pasien Diabetes' AND v_has_diabetes THEN
            v_should_belong := true;
        ELSIF v_seg_rec.name = 'Pasien Hipertensi' AND v_has_hipertensi THEN
            v_should_belong := true;
        ELSIF v_seg_rec.name = 'Pasien Asma' AND v_has_asma THEN
            v_should_belong := true;
        ELSIF v_seg_rec.name = 'Pasien Jantung' AND v_has_jantung THEN
            v_should_belong := true;
        ELSIF v_seg_rec.name = 'Pasien Kolesterol' AND v_has_kolesterol THEN
            v_should_belong := true;
        ELSIF v_seg_rec.name = 'Ibu Hamil' AND v_has_hamil THEN
            v_should_belong := true;
        ELSIF v_seg_rec.name = 'Lansia (>60th)' AND v_is_lansia THEN
            v_should_belong := true;
        ELSIF v_seg_rec.name = 'Pasien Alergi Obat' AND v_has_allergies THEN
            v_should_belong := true;
        END IF;

        IF v_should_belong THEN
            INSERT INTO public.patient_segment_members (user_id, segment_id)
            VALUES (p_user_id, v_seg_rec.id)
            ON CONFLICT (user_id, segment_id) DO NOTHING;
        ELSE
            DELETE FROM public.patient_segment_members
            WHERE user_id = p_user_id AND segment_id = v_seg_rec.id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.sync_patient_segments(UUID) IS 'Sinkronisasi segmen pasien berdasarkan riwayat medis, alergi obat, dan transaksi belanja obat kronis.';

-- ────────────────────────────────────────────
-- 2. TRIGGERS
-- ────────────────────────────────────────────

-- A. Trigger ketika Profil Kesehatan Ditambah/Diupdate
CREATE OR REPLACE FUNCTION public.trigger_sync_patient_segments_profile()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.sync_patient_segments(NEW.user_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_sync_segments_on_profile
    AFTER INSERT OR UPDATE ON public.patient_health_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_sync_patient_segments_profile();

-- B. Trigger ketika Alergi Obat Ditambah/Diupdate
CREATE OR REPLACE FUNCTION public.trigger_sync_patient_segments_allergies()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.sync_patient_segments(NEW.user_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_sync_segments_on_allergies
    AFTER INSERT OR UPDATE ON public.patient_allergies
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_sync_patient_segments_allergies();

-- C. Trigger ketika Order Selesai (status 'completed')
CREATE OR REPLACE FUNCTION public.trigger_sync_patient_segments_order()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        PERFORM public.sync_patient_segments(NEW.user_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_sync_segments_on_order
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_sync_patient_segments_order();
