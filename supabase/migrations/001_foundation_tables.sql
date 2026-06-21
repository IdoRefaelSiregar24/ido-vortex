-- ============================================================
-- FASE 1A: TABEL FONDASI — PRODUCTS & ORDERS
-- Jalankan PERTAMA di Supabase SQL Editor
-- ============================================================
-- Deskripsi:
--   Membuat tabel products, orders, dan order_items sebagai
--   fondasi utama yang akan direferensikan oleh semua modul CRM.
-- ============================================================

-- ────────────────────────────────────────────
-- 1. PRODUCTS (Katalog Obat)
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku                   VARCHAR(50) UNIQUE NOT NULL,
    name                  VARCHAR(255) NOT NULL,
    category              VARCHAR(100) NOT NULL DEFAULT 'Obat Bebas',
    description           TEXT,
    price                 NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
    stock                 INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    unit                  VARCHAR(50) DEFAULT 'tablet',
    requires_prescription BOOLEAN DEFAULT false,
    daily_dosage          NUMERIC(5,2) DEFAULT NULL,
    expiry_date           DATE,
    image_url             TEXT,
    is_active             BOOLEAN DEFAULT true,
    created_at            TIMESTAMPTZ DEFAULT now(),
    updated_at            TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.products IS 'Katalog obat dan produk apotek';
COMMENT ON COLUMN public.products.sku IS 'Stock Keeping Unit — kode unik produk (misal: OBT-001)';
COMMENT ON COLUMN public.products.daily_dosage IS 'Estimasi dosis per hari untuk kalkulasi refill reminder';
COMMENT ON COLUMN public.products.requires_prescription IS 'Apakah obat memerlukan resep dokter';
COMMENT ON COLUMN public.products.unit IS 'Satuan: tablet, kapsul, botol, strip, sachet';

-- Index untuk pencarian produk
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products USING gin(to_tsvector('indonesian', name));

-- ────────────────────────────────────────────
-- 2. ORDERS (Pesanan)
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number     VARCHAR(50) UNIQUE NOT NULL,
    user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status           VARCHAR(30) NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
    subtotal         NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount_amount  NUMERIC(12,2) DEFAULT 0,
    points_used      INTEGER DEFAULT 0,
    points_earned    INTEGER DEFAULT 0,
    promo_id         UUID,
    total            NUMERIC(12,2) NOT NULL DEFAULT 0,
    notes            TEXT,
    shipping_address TEXT,
    source           VARCHAR(30) DEFAULT 'manual'
                     CHECK (source IN ('manual', 'subscription', 'refill_reorder')),
    created_at       TIMESTAMPTZ DEFAULT now(),
    updated_at       TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.orders IS 'Pesanan pelanggan apotek';
COMMENT ON COLUMN public.orders.source IS 'Sumber pesanan: manual, subscription (otomatis), refill_reorder (re-order dari reminder)';
COMMENT ON COLUMN public.orders.promo_id IS 'FK ke tabel promos — akan di-ALTER setelah tabel promos dibuat';

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);

-- ────────────────────────────────────────────
-- 3. ORDER ITEMS (Detail Item per Pesanan)
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id     UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id   UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    product_name VARCHAR(255) NOT NULL,
    quantity     INTEGER NOT NULL CHECK (quantity > 0),
    unit_price   NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
    total_price  NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at   TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.order_items IS 'Detail item per pesanan — snapshot harga saat pembelian';
COMMENT ON COLUMN public.order_items.product_name IS 'Snapshot nama produk saat beli (jaga histori jika nama berubah)';
COMMENT ON COLUMN public.order_items.total_price IS 'Auto-calculated: quantity × unit_price';

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- ────────────────────────────────────────────
-- SEED: Data Produk Awal (opsional)
-- ────────────────────────────────────────────
INSERT INTO public.products (sku, name, category, description, price, stock, unit, requires_prescription, daily_dosage, expiry_date) VALUES
    ('OBT-001', 'Paracetamol 500mg',      'Obat Bebas',          'Pereda nyeri dan penurun demam',       15000, 250, 'tablet', false, 3.0,  '2027-06-15'),
    ('OBT-002', 'Amoxicillin 500mg',       'Obat Keras',          'Antibiotik untuk infeksi bakteri',     35000, 120, 'kapsul', true,  3.0,  '2027-03-20'),
    ('OBT-003', 'Vitamin C 1000mg',        'Suplemen',            'Suplemen daya tahan tubuh',            25000, 300, 'tablet', false, 1.0,  '2027-12-01'),
    ('OBT-004', 'Omeprazole 20mg',         'Obat Keras',          'Obat maag dan asam lambung',           45000, 80,  'kapsul', true,  1.0,  '2027-01-10'),
    ('OBT-005', 'Cetirizine 10mg',         'Obat Bebas Terbatas', 'Antihistamin untuk alergi',            20000, 150, 'tablet', false, 1.0,  '2027-09-25'),
    ('OBT-006', 'Ibuprofen 400mg',         'Obat Bebas Terbatas', 'Anti inflamasi dan pereda nyeri',      18000, 200, 'tablet', false, 3.0,  '2027-07-30'),
    ('OBT-007', 'Metformin 500mg',         'Obat Keras',          'Obat diabetes tipe 2',                 30000, 90,  'tablet', true,  2.0,  '2027-04-12'),
    ('OBT-008', 'Antangin Cair',           'Obat Bebas',          'Obat masuk angin herbal',              8000,  400, 'sachet', false, NULL, '2027-11-05'),
    ('OBT-009', 'Promag Tablet',           'Obat Bebas',          'Obat sakit maag',                      12000, 350, 'tablet', false, 3.0,  '2027-08-18'),
    ('OBT-010', 'Dexamethasone 0.5mg',     'Obat Keras',          'Kortikosteroid anti inflamasi',        22000, 60,  'tablet', true,  2.0,  '2027-02-28'),
    ('OBT-011', 'Amlodipine 5mg',          'Obat Keras',          'Obat hipertensi / tekanan darah tinggi', 28000, 100, 'tablet', true, 1.0, '2027-10-15'),
    ('OBT-012', 'Glimepiride 2mg',         'Obat Keras',          'Obat diabetes mellitus tipe 2',        32000, 75,  'tablet', true,  1.0,  '2027-08-22'),
    ('OBT-013', 'Salbutamol Inhaler 100mcg','Obat Keras',         'Inhaler untuk asma bronkial',          65000, 40,  'botol',  true,  NULL, '2027-09-30'),
    ('OBT-014', 'Asam Folat 400mcg',       'Suplemen',            'Suplemen kehamilan',                   15000, 200, 'tablet', false, 1.0,  '2028-01-15')
ON CONFLICT (sku) DO NOTHING;
