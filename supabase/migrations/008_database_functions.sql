-- ============================================================
-- DATABASE FUNCTIONS — Business Logic Server-Side
-- Jalankan KEDELAPAN di Supabase SQL Editor (setelah 007)
-- ============================================================
-- Fungsi-fungsi ini mengenkapsulasi business logic kompleks
-- agar aman dijalankan di sisi server (SECURITY DEFINER)
-- dan tidak bisa dimanipulasi dari frontend.
-- ============================================================

-- ────────────────────────────────────────────
-- 1. VALIDASI & KALKULASI KODE PROMO
-- ────────────────────────────────────────────
-- Dipanggil dari frontend saat guest memasukkan kode promo di checkout.
-- Return: JSON { valid, promo_id, discount_amount, message }
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.validate_promo_code(
    p_code VARCHAR,
    p_subtotal NUMERIC
)
RETURNS JSON AS $$
DECLARE
    v_promo RECORD;
    v_user_usage_count INTEGER;
    v_discount NUMERIC;
BEGIN
    -- Cari promo berdasarkan kode (case-insensitive)
    SELECT * INTO v_promo FROM public.promos
    WHERE UPPER(code) = UPPER(p_code)
    AND is_active = true
    AND now() BETWEEN valid_from AND valid_until;

    IF NOT FOUND THEN
        RETURN json_build_object(
            'valid', false,
            'message', 'Kode promo tidak ditemukan atau sudah kadaluarsa.'
        );
    END IF;

    -- Cek kuota global
    IF v_promo.usage_limit IS NOT NULL AND v_promo.usage_count >= v_promo.usage_limit THEN
        RETURN json_build_object(
            'valid', false,
            'message', 'Maaf, kuota kode promo ini sudah habis.'
        );
    END IF;

    -- Cek kuota per user
    SELECT COUNT(*) INTO v_user_usage_count
    FROM public.promo_usage
    WHERE promo_id = v_promo.id AND user_id = auth.uid();

    IF v_user_usage_count >= v_promo.per_user_limit THEN
        RETURN json_build_object(
            'valid', false,
            'message', 'Anda sudah pernah menggunakan kode promo ini.'
        );
    END IF;

    -- Cek minimal pembelian
    IF p_subtotal < v_promo.min_purchase THEN
        RETURN json_build_object(
            'valid', false,
            'message', format(
                'Minimal pembelian Rp %s untuk menggunakan promo ini. Belanja Anda saat ini: Rp %s.',
                to_char(v_promo.min_purchase, 'FM999,999,999'),
                to_char(p_subtotal, 'FM999,999,999')
            )
        );
    END IF;

    -- Hitung diskon berdasarkan tipe
    IF v_promo.discount_type = 'percentage' THEN
        v_discount := ROUND(p_subtotal * (v_promo.discount_value / 100), 0);
        -- Terapkan batas maksimal diskon
        IF v_promo.max_discount IS NOT NULL AND v_discount > v_promo.max_discount THEN
            v_discount := v_promo.max_discount;
        END IF;
    ELSE -- 'fixed'
        v_discount := v_promo.discount_value;
    END IF;

    -- Pastikan diskon tidak melebihi subtotal
    IF v_discount > p_subtotal THEN
        v_discount := p_subtotal;
    END IF;

    RETURN json_build_object(
        'valid', true,
        'promo_id', v_promo.id,
        'code', v_promo.code,
        'discount_type', v_promo.discount_type,
        'discount_value', v_promo.discount_value,
        'discount_amount', v_discount,
        'description', v_promo.description,
        'message', format('Promo "%s" berhasil diterapkan! Anda hemat Rp %s.', v_promo.code, to_char(v_discount, 'FM999,999,999'))
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.validate_promo_code IS 'Validasi dan hitung diskon kode promo. Dipanggil saat checkout. Cek: kode valid, belum expired, kuota tersedia, min pembelian terpenuhi.';


-- ────────────────────────────────────────────
-- 2. EARN LOYALTY POINTS (setelah order completed)
-- ────────────────────────────────────────────
-- Dipanggil oleh Admin setelah menandai order sebagai 'completed'.
-- Otomatis: hitung poin × tier multiplier → update saldo → catat histori.
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.earn_loyalty_points(
    p_order_id UUID
)
RETURNS JSON AS $$
DECLARE
    v_order RECORD;
    v_config RECORD;
    v_profile RECORD;
    v_multiplier NUMERIC;
    v_points_earned INTEGER;
    v_new_balance INTEGER;
BEGIN
    -- Ambil data order
    SELECT * INTO v_order FROM public.orders
    WHERE id = p_order_id AND status = 'completed';

    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Order tidak ditemukan atau belum berstatus completed.'
        );
    END IF;

    -- Cek apakah sudah pernah earn poin untuk order ini (prevent double-earn)
    IF EXISTS (
        SELECT 1 FROM public.points_transactions
        WHERE order_id = p_order_id AND type = 'earn'
    ) THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Poin sudah pernah diberikan untuk pesanan ini.'
        );
    END IF;

    -- Ambil config loyalitas aktif
    SELECT * INTO v_config FROM public.loyalty_config
    WHERE is_active = true LIMIT 1;

    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Konfigurasi loyalitas tidak aktif. Hubungi admin.'
        );
    END IF;

    -- Cek minimum transaksi
    IF v_order.total < v_config.min_transaction THEN
        RETURN json_build_object(
            'success', false,
            'message', format(
                'Total transaksi Rp %s di bawah minimum Rp %s untuk mendapat poin.',
                to_char(v_order.total, 'FM999,999,999'),
                to_char(v_config.min_transaction, 'FM999,999,999')
            )
        );
    END IF;

    -- Ambil profil user untuk cek tier membership
    SELECT * INTO v_profile FROM public.profiles WHERE id = v_order.user_id;

    -- Tentukan multiplier berdasarkan tier
    v_multiplier := 1.0;
    IF v_profile.membership_status = 'premium' THEN
        v_multiplier := COALESCE(v_config.multiplier_premium, 1.5);
    ELSIF v_profile.membership_status = 'vip' THEN
        v_multiplier := COALESCE(v_config.multiplier_vip, 2.0);
    END IF;

    -- Hitung poin: (total / rate) * earn_percentage * multiplier
    -- Misal: Rp 100.000 / 100 * 1.0 * 1.5 = 1500 poin (Premium)
    v_points_earned := FLOOR(
        (v_order.total / v_config.points_to_currency_rate)
        * v_config.earn_percentage
        * v_multiplier
    );

    -- Pastikan minimal 1 poin
    IF v_points_earned < 1 THEN
        v_points_earned := 1;
    END IF;

    -- Update saldo poin di profiles
    v_new_balance := COALESCE(v_profile.membership_points, 0) + v_points_earned;

    UPDATE public.profiles
    SET membership_points = v_new_balance,
        updated_at = now()
    WHERE id = v_order.user_id;

    -- Catat di histori poin
    INSERT INTO public.points_transactions (
        user_id, order_id, type, points, balance_after, description
    ) VALUES (
        v_order.user_id,
        p_order_id,
        'earn',
        v_points_earned,
        v_new_balance,
        format(
            'Poin dari pesanan %s (Rp %s × %.1f multiplier %s)',
            v_order.order_number,
            to_char(v_order.total, 'FM999,999,999'),
            v_multiplier,
            UPPER(COALESCE(v_profile.membership_status, 'free'))
        )
    );

    -- Update order dengan jumlah poin yang di-earn
    UPDATE public.orders
    SET points_earned = v_points_earned
    WHERE id = p_order_id;

    RETURN json_build_object(
        'success', true,
        'points_earned', v_points_earned,
        'new_balance', v_new_balance,
        'multiplier', v_multiplier,
        'tier', v_profile.membership_status,
        'message', format(
            'Selamat! %s poin telah ditambahkan (×%.1f %s). Saldo baru: %s poin.',
            v_points_earned, v_multiplier,
            UPPER(COALESCE(v_profile.membership_status, 'free')),
            v_new_balance
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.earn_loyalty_points IS 'Berikan poin loyalitas setelah order completed. Menghitung berdasarkan config × tier multiplier. Prevent double-earn.';


-- ────────────────────────────────────────────
-- 3. REDEEM LOYALTY POINTS saat Checkout
-- ────────────────────────────────────────────
-- Dipanggil saat guest ingin menukarkan poin menjadi potongan harga.
-- Belum memotong saldo — hanya validasi & preview.
-- Pemotongan saldo dilakukan saat order dibuat (confirm checkout).
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.redeem_loyalty_points(
    p_user_id UUID,
    p_points_to_redeem INTEGER,
    p_order_subtotal NUMERIC
)
RETURNS JSON AS $$
DECLARE
    v_config RECORD;
    v_profile RECORD;
    v_max_redeemable_points INTEGER;
    v_max_discount NUMERIC;
    v_discount_amount NUMERIC;
    v_new_balance INTEGER;
BEGIN
    -- Validasi bahwa user yang request = authenticated user
    IF auth.uid() != p_user_id THEN
        RETURN json_build_object('success', false, 'message', 'Unauthorized: Anda hanya bisa menukarkan poin milik sendiri.');
    END IF;

    -- Ambil config
    SELECT * INTO v_config FROM public.loyalty_config WHERE is_active = true LIMIT 1;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'Sistem poin loyalitas sedang tidak aktif.');
    END IF;

    -- Ambil profil user
    SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'Profil user tidak ditemukan.');
    END IF;

    -- Cek saldo poin mencukupi
    IF COALESCE(v_profile.membership_points, 0) < p_points_to_redeem THEN
        RETURN json_build_object(
            'success', false,
            'message', format(
                'Saldo poin tidak mencukupi. Saldo Anda: %s poin, yang diminta: %s poin.',
                COALESCE(v_profile.membership_points, 0),
                p_points_to_redeem
            )
        );
    END IF;

    -- Hitung batas maks diskon berdasarkan persentase subtotal
    v_max_discount := p_order_subtotal * (v_config.max_redeem_percentage / 100);
    v_max_redeemable_points := FLOOR(v_max_discount / v_config.points_to_currency_rate);

    -- Cek apakah poin yang ingin di-redeem melebihi batas
    IF p_points_to_redeem > v_max_redeemable_points THEN
        RETURN json_build_object(
            'success', false,
            'message', format(
                'Maks poin yang bisa ditukar untuk pesanan ini: %s poin (Rp %s). Batas: %s%% dari subtotal.',
                v_max_redeemable_points,
                to_char(v_max_redeemable_points * v_config.points_to_currency_rate, 'FM999,999,999'),
                v_config.max_redeem_percentage::INTEGER
            )
        );
    END IF;

    -- Hitung diskon dari poin
    v_discount_amount := p_points_to_redeem * v_config.points_to_currency_rate;
    v_new_balance := v_profile.membership_points - p_points_to_redeem;

    RETURN json_build_object(
        'success', true,
        'points_redeemed', p_points_to_redeem,
        'discount_amount', v_discount_amount,
        'new_balance', v_new_balance,
        'rate', v_config.points_to_currency_rate,
        'message', format(
            'Menukarkan %s poin = potongan Rp %s. Sisa saldo: %s poin.',
            p_points_to_redeem,
            to_char(v_discount_amount, 'FM999,999,999'),
            v_new_balance
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.redeem_loyalty_points IS 'Preview penukaran poin jadi diskon saat checkout. Validasi saldo dan batas maks redeem. Belum memotong saldo.';


-- ────────────────────────────────────────────
-- 4. CONFIRM REDEEM POINTS (saat order dibuat)
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.confirm_redeem_points(
    p_user_id UUID,
    p_order_id UUID,
    p_points_to_redeem INTEGER
)
RETURNS JSON AS $$
DECLARE
    v_config RECORD;
    v_profile RECORD;
    v_discount_amount NUMERIC;
    v_new_balance INTEGER;
BEGIN
    IF auth.uid() != p_user_id AND NOT public.is_admin_or_staff() THEN
        RETURN json_build_object('success', false, 'message', 'Unauthorized.');
    END IF;

    SELECT * INTO v_config FROM public.loyalty_config WHERE is_active = true LIMIT 1;
    SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id;

    IF COALESCE(v_profile.membership_points, 0) < p_points_to_redeem THEN
        RETURN json_build_object('success', false, 'message', 'Saldo poin tidak mencukupi.');
    END IF;

    v_discount_amount := p_points_to_redeem * v_config.points_to_currency_rate;
    v_new_balance := v_profile.membership_points - p_points_to_redeem;

    -- Potong saldo poin
    UPDATE public.profiles
    SET membership_points = v_new_balance, updated_at = now()
    WHERE id = p_user_id;

    -- Catat histori
    INSERT INTO public.points_transactions (user_id, order_id, type, points, balance_after, description)
    VALUES (
        p_user_id, p_order_id, 'redeem', -p_points_to_redeem, v_new_balance,
        format('Tukar %s poin (Rp %s) untuk pesanan', p_points_to_redeem, to_char(v_discount_amount, 'FM999,999,999'))
    );

    -- Update order
    UPDATE public.orders
    SET points_used = p_points_to_redeem, discount_amount = COALESCE(discount_amount, 0) + v_discount_amount
    WHERE id = p_order_id;

    RETURN json_build_object(
        'success', true,
        'points_deducted', p_points_to_redeem,
        'discount_applied', v_discount_amount,
        'new_balance', v_new_balance
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.confirm_redeem_points IS 'Konfirmasi pemotongan poin saat order dibuat. Potong saldo, catat histori, update order.';


-- ────────────────────────────────────────────
-- 5. GENERATE REFILL REMINDERS (otomatis setelah order selesai)
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.generate_refill_reminders(
    p_order_id UUID
)
RETURNS JSON AS $$
DECLARE
    v_order RECORD;
    v_item RECORD;
    v_days_supply INTEGER;
    v_estimated_run_out DATE;
    v_remind_at DATE;
    v_count INTEGER := 0;
BEGIN
    -- Ambil data order
    SELECT * INTO v_order FROM public.orders WHERE id = p_order_id;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'Order tidak ditemukan.');
    END IF;

    -- Loop setiap item yang punya daily_dosage
    FOR v_item IN
        SELECT
            oi.product_id,
            oi.quantity,
            oi.product_name,
            p.daily_dosage
        FROM public.order_items oi
        JOIN public.products p ON p.id = oi.product_id
        WHERE oi.order_id = p_order_id
        AND p.daily_dosage IS NOT NULL
        AND p.daily_dosage > 0
    LOOP
        -- Hitung estimasi hari pakai: quantity / daily_dosage
        v_days_supply := FLOOR(v_item.quantity / v_item.daily_dosage);

        -- Jika supply kurang dari 1 hari, skip
        IF v_days_supply < 1 THEN
            CONTINUE;
        END IF;

        v_estimated_run_out := CURRENT_DATE + v_days_supply;
        v_remind_at := v_estimated_run_out - 3; -- 3 hari sebelum habis

        -- Pastikan remind_at tidak di masa lalu
        IF v_remind_at < CURRENT_DATE THEN
            v_remind_at := CURRENT_DATE;
        END IF;

        -- Hanya buat reminder jika belum ada yang aktif untuk produk+user ini
        IF NOT EXISTS (
            SELECT 1 FROM public.refill_reminders
            WHERE user_id = v_order.user_id
            AND product_id = v_item.product_id
            AND status = 'active'
        ) THEN
            INSERT INTO public.refill_reminders (
                user_id, product_id, order_id,
                quantity_purchased, daily_dosage,
                estimated_run_out, remind_at, remind_days_before
            ) VALUES (
                v_order.user_id, v_item.product_id, p_order_id,
                v_item.quantity, v_item.daily_dosage,
                v_estimated_run_out, v_remind_at, 3
            );
            v_count := v_count + 1;
        END IF;
    END LOOP;

    RETURN json_build_object(
        'success', true,
        'reminders_created', v_count,
        'message', format('%s pengingat refill berhasil dibuat.', v_count)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.generate_refill_reminders IS 'Otomatis buat refill reminders setelah order selesai. Hitung estimasi habis berdasarkan daily_dosage.';


-- ────────────────────────────────────────────
-- 6. 1-KLIK RE-ORDER dari Refill Reminder
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.reorder_from_reminder(
    p_reminder_id UUID
)
RETURNS JSON AS $$
DECLARE
    v_reminder RECORD;
    v_product RECORD;
    v_order_number VARCHAR;
    v_order_id UUID;
BEGIN
    -- Ambil data reminder
    SELECT * INTO v_reminder FROM public.refill_reminders
    WHERE id = p_reminder_id
    AND user_id = auth.uid()
    AND status = 'active';

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'Reminder tidak ditemukan atau tidak aktif.');
    END IF;

    -- Ambil data produk
    SELECT * INTO v_product FROM public.products
    WHERE id = v_reminder.product_id AND is_active = true;

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'Produk sudah tidak tersedia.');
    END IF;

    -- Cek stok
    IF v_product.stock < v_reminder.quantity_purchased THEN
        RETURN json_build_object(
            'success', false,
            'message', format('Stok %s tidak mencukupi. Tersedia: %s, dibutuhkan: %s.',
                v_product.name, v_product.stock, v_reminder.quantity_purchased)
        );
    END IF;

    -- Generate order number
    v_order_number := 'RFL-' || to_char(now(), 'YYYYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 6);

    -- Buat order baru
    INSERT INTO public.orders (
        order_number, user_id, status, subtotal, total, source, notes
    ) VALUES (
        v_order_number,
        auth.uid(),
        'pending',
        v_product.price * v_reminder.quantity_purchased,
        v_product.price * v_reminder.quantity_purchased,
        'refill_reorder',
        format('Re-order dari refill reminder — %s x%s', v_product.name, v_reminder.quantity_purchased)
    )
    RETURNING id INTO v_order_id;

    -- Buat order items
    INSERT INTO public.order_items (order_id, product_id, product_name, quantity, unit_price)
    VALUES (v_order_id, v_product.id, v_product.name, v_reminder.quantity_purchased, v_product.price);

    -- Update reminder status
    UPDATE public.refill_reminders
    SET status = 'reordered',
        reorder_order_id = v_order_id,
        updated_at = now()
    WHERE id = p_reminder_id;

    RETURN json_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'product_name', v_product.name,
        'quantity', v_reminder.quantity_purchased,
        'total', v_product.price * v_reminder.quantity_purchased,
        'message', format(
            'Pesanan %s berhasil dibuat! %s x%s = Rp %s.',
            v_order_number, v_product.name, v_reminder.quantity_purchased,
            to_char(v_product.price * v_reminder.quantity_purchased, 'FM999,999,999')
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.reorder_from_reminder IS '1-klik re-order dari refill reminder. Buat order otomatis dan tandai reminder sebagai reordered.';


-- ────────────────────────────────────────────
-- 7. VIEW: Dashboard Refill Reminder untuk Admin
-- ────────────────────────────────────────────
CREATE OR REPLACE VIEW public.admin_refill_dashboard AS
SELECT
    rr.id,
    rr.user_id,
    p.full_name AS patient_name,
    p.email AS patient_email,
    p.membership_status AS patient_tier,
    pr.name AS product_name,
    pr.sku AS product_sku,
    pr.price AS product_price,
    rr.quantity_purchased,
    rr.daily_dosage,
    rr.estimated_run_out,
    rr.remind_at,
    rr.status,
    rr.is_read,
    rr.created_at,
    (rr.estimated_run_out - CURRENT_DATE) AS days_remaining,
    CASE
        WHEN rr.estimated_run_out <= CURRENT_DATE THEN 'overdue'
        WHEN rr.estimated_run_out <= CURRENT_DATE + 3 THEN 'urgent'
        WHEN rr.estimated_run_out <= CURRENT_DATE + 7 THEN 'upcoming'
        ELSE 'normal'
    END AS urgency_level
FROM public.refill_reminders rr
JOIN public.profiles p ON p.id = rr.user_id
JOIN public.products pr ON pr.id = rr.product_id
WHERE rr.status = 'active'
ORDER BY rr.estimated_run_out ASC;

COMMENT ON VIEW public.admin_refill_dashboard IS 'Dashboard admin: daftar pasien yang obatnya hampir habis, diurutkan berdasarkan urgensi (overdue → urgent → upcoming → normal)';


-- ────────────────────────────────────────────
-- 8. VIEW: Dashboard Subscription untuk Admin
-- ────────────────────────────────────────────
CREATE OR REPLACE VIEW public.admin_subscription_dashboard AS
SELECT
    s.id AS subscription_id,
    s.user_id,
    p.full_name AS patient_name,
    p.email AS patient_email,
    p.membership_status AS patient_tier,
    pr.name AS product_name,
    pr.sku AS product_sku,
    pr.price AS unit_price,
    s.quantity,
    (pr.price * s.quantity) AS delivery_cost,
    s.interval_days,
    s.status,
    s.next_delivery_date,
    s.last_delivery_date,
    s.total_deliveries,
    s.medical_notes,
    s.created_at,
    (s.next_delivery_date - CURRENT_DATE) AS days_until_next,
    CASE
        WHEN s.next_delivery_date <= CURRENT_DATE THEN 'overdue'
        WHEN s.next_delivery_date <= CURRENT_DATE + 2 THEN 'due_soon'
        ELSE 'scheduled'
    END AS delivery_status
FROM public.subscriptions s
JOIN public.profiles p ON p.id = s.user_id
JOIN public.products pr ON pr.id = s.product_id
WHERE s.status = 'active'
ORDER BY s.next_delivery_date ASC;

COMMENT ON VIEW public.admin_subscription_dashboard IS 'Dashboard admin: daftar langganan obat aktif dengan jadwal pengiriman berikutnya';


-- ────────────────────────────────────────────
-- 9. FUNCTION: Admin Manual Point Adjustment
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_adjust_points(
    p_target_user_id UUID,
    p_points INTEGER,
    p_description TEXT DEFAULT 'Manual adjustment oleh admin'
)
RETURNS JSON AS $$
DECLARE
    v_profile RECORD;
    v_new_balance INTEGER;
    v_type VARCHAR;
BEGIN
    -- Hanya admin/staff yang boleh adjust
    IF NOT public.is_admin_or_staff() THEN
        RETURN json_build_object('success', false, 'message', 'Unauthorized: Hanya admin/staff yang bisa adjust poin.');
    END IF;

    SELECT * INTO v_profile FROM public.profiles WHERE id = p_target_user_id;
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'User tidak ditemukan.');
    END IF;

    v_new_balance := COALESCE(v_profile.membership_points, 0) + p_points;

    -- Pastikan saldo tidak negatif
    IF v_new_balance < 0 THEN
        RETURN json_build_object(
            'success', false,
            'message', format('Saldo tidak boleh negatif. Saldo saat ini: %s, adjustment: %s.', v_profile.membership_points, p_points)
        );
    END IF;

    v_type := CASE WHEN p_points >= 0 THEN 'bonus' ELSE 'adjustment' END;

    -- Update saldo
    UPDATE public.profiles
    SET membership_points = v_new_balance, updated_at = now()
    WHERE id = p_target_user_id;

    -- Catat histori
    INSERT INTO public.points_transactions (user_id, type, points, balance_after, description)
    VALUES (p_target_user_id, v_type, p_points, v_new_balance, p_description);

    RETURN json_build_object(
        'success', true,
        'user_id', p_target_user_id,
        'adjustment', p_points,
        'new_balance', v_new_balance,
        'type', v_type,
        'message', format('Poin %s berhasil di-%s. Saldo baru: %s poin.',
            v_profile.full_name,
            CASE WHEN p_points >= 0 THEN 'tambah' ELSE 'kurangi' END,
            v_new_balance)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.admin_adjust_points IS 'Admin manual adjustment poin: bisa tambah (bonus) atau kurangi (adjustment). Saldo tidak boleh negatif.';
