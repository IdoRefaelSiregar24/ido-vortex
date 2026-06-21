-- ============================================================
-- MODUL 5: SEGMENTASI PASIEN & RIWAYAT ALERGI
-- Jalankan KEENAM di Supabase SQL Editor (setelah 005)
-- ============================================================
-- Fitur:
--   ✅ Profil kesehatan pasien (tanggal lahir, golongan darah, kondisi medis)
--   ✅ Riwayat alergi obat dengan tingkat keparahan
--   ✅ Segmentasi pasien (Diabetes, Hipertensi, Asma, dll)
--   ✅ Relasi many-to-many pasien ↔ segment
--   ✅ Seed data segment default
-- ============================================================

-- ────────────────────────────────────────────
-- 1. PATIENT HEALTH PROFILES — Profil Kesehatan
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.patient_health_profiles (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date_of_birth           DATE,
    gender                  VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    blood_type              VARCHAR(5) CHECK (blood_type IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
    weight_kg               NUMERIC(5,1),
    height_cm               NUMERIC(5,1),
    medical_conditions      TEXT[],
    emergency_contact_name  VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    notes                   TEXT,
    created_at              TIMESTAMPTZ DEFAULT now(),
    updated_at              TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.patient_health_profiles IS 'Profil kesehatan pasien — data sensitif dilindungi RLS';
COMMENT ON COLUMN public.patient_health_profiles.medical_conditions IS 'Array kondisi medis yang diderita, misal: {''Diabetes Tipe 2'', ''Hipertensi''}';
COMMENT ON COLUMN public.patient_health_profiles.user_id IS 'Relasi 1:1 ke auth.users — setiap pasien hanya punya 1 profil kesehatan';

-- ────────────────────────────────────────────
-- 2. PATIENT ALLERGIES — Riwayat Alergi Obat
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.patient_allergies (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    allergen       VARCHAR(255) NOT NULL,
    severity       VARCHAR(20) DEFAULT 'moderate'
                   CHECK (severity IN ('mild', 'moderate', 'severe', 'life_threatening')),
    reaction       TEXT,
    diagnosed_date DATE,
    diagnosed_by   VARCHAR(255),
    is_active      BOOLEAN DEFAULT true,
    created_at     TIMESTAMPTZ DEFAULT now(),
    updated_at     TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.patient_allergies IS 'Riwayat alergi obat pasien — KRITIS untuk medication safety';
COMMENT ON COLUMN public.patient_allergies.allergen IS 'Nama zat atau obat yang menimbulkan alergi';
COMMENT ON COLUMN public.patient_allergies.severity IS 'Tingkat keparahan: mild (ringan), moderate (sedang), severe (berat), life_threatening (mengancam jiwa)';
COMMENT ON COLUMN public.patient_allergies.reaction IS 'Deskripsi reaksi alergi yang dialami, misal: gatal-gatal, sesak napas, anafilaksis';
COMMENT ON COLUMN public.patient_allergies.diagnosed_by IS 'Nama dokter yang mendiagnosa alergi';

CREATE INDEX IF NOT EXISTS idx_allergies_user ON public.patient_allergies(user_id);
CREATE INDEX IF NOT EXISTS idx_allergies_allergen ON public.patient_allergies(allergen);
CREATE INDEX IF NOT EXISTS idx_allergies_severity ON public.patient_allergies(severity);

-- ────────────────────────────────────────────
-- 3. PATIENT SEGMENTS — Segmentasi Pasien
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.patient_segments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color       VARCHAR(7) DEFAULT '#4EA674',
    icon        VARCHAR(50) DEFAULT 'heart',
    is_active   BOOLEAN DEFAULT true,
    created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.patient_segments IS 'Kategori segmentasi pasien untuk edukasi dan promo terarah';
COMMENT ON COLUMN public.patient_segments.color IS 'Warna badge HEX untuk tampilan UI';
COMMENT ON COLUMN public.patient_segments.icon IS 'Nama ikon identitas segment (icon library reference)';

-- Seed default segments
INSERT INTO public.patient_segments (name, description, color, icon) VALUES
    ('Pasien Diabetes',    'Pasien dengan diagnosis Diabetes Mellitus Tipe 1 atau Tipe 2',       '#E74C3C', 'activity'),
    ('Pasien Hipertensi',  'Pasien dengan tekanan darah tinggi yang memerlukan pengobatan rutin', '#3498DB', 'heart'),
    ('Pasien Asma',        'Pasien dengan riwayat asma bronkial',                                '#F39C12', 'wind'),
    ('Pasien Jantung',     'Pasien dengan riwayat penyakit jantung koroner atau gagal jantung',  '#9B59B6', 'heart-pulse'),
    ('Pasien Kolesterol',  'Pasien dengan kadar kolesterol tinggi (dislipidemia)',                '#E67E22', 'trending-up'),
    ('Ibu Hamil',          'Pasien ibu hamil yang memerlukan suplemen dan obat khusus kehamilan', '#E91E63', 'baby'),
    ('Lansia (>60th)',     'Pasien berusia di atas 60 tahun dengan kebutuhan pengobatan khusus',  '#607D8B', 'users'),
    ('Pasien Alergi Obat', 'Pasien yang memiliki riwayat alergi terhadap obat tertentu',         '#FF5722', 'alert-triangle')
ON CONFLICT (name) DO NOTHING;

-- ────────────────────────────────────────────
-- 4. PATIENT-SEGMENT MAPPING — Relasi Many-to-Many
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.patient_segment_members (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    segment_id  UUID NOT NULL REFERENCES public.patient_segments(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ DEFAULT now(),

    UNIQUE(user_id, segment_id)
);

COMMENT ON TABLE public.patient_segment_members IS 'Mapping many-to-many antara pasien dan segment — dikelola oleh admin/apoteker';
COMMENT ON COLUMN public.patient_segment_members.assigned_by IS 'Admin atau apoteker yang meng-assign pasien ke segment ini';

CREATE INDEX IF NOT EXISTS idx_seg_members_user ON public.patient_segment_members(user_id);
CREATE INDEX IF NOT EXISTS idx_seg_members_segment ON public.patient_segment_members(segment_id);
