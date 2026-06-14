import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    FaHeartbeat, FaPills, FaShippingFast, FaCheckCircle, FaAward, 
    FaUserPlus, FaSignInAlt, FaBuilding, FaUsers, FaStethoscope,
    FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaClipboardList 
} from "react-icons/fa";
import { supabase } from "../lib/supabase";

export default function LandingPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("home"); // home, profile, services, contact
    const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
    const [contactSuccess, setContactSuccess] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    const handleContactSubmit = (e) => {
        e.preventDefault();
        setContactSuccess(true);
        setContactForm({ name: "", email: "", message: "" });
        setTimeout(() => setContactSuccess(false), 4000);
    };

    useEffect(() => {
        let mounted = true;

        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    if (mounted) {
                        setUserProfile(null);
                        setLoadingAuth(false);
                    }
                    return;
                }

                const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", session.user.id)
                    .single();

                if (mounted) {
                    if (profile) {
                        setUserProfile(profile);
                    } else {
                        setUserProfile({
                            full_name: session.user.user_metadata?.full_name || "User",
                            role: session.user.user_metadata?.role || "member",
                            email: session.user.email
                        });
                    }
                }
            } catch (err) {
                console.error("Error checking session on landing page:", err);
            } finally {
                if (mounted) {
                    setLoadingAuth(false);
                }
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!session) {
                if (mounted) setUserProfile(null);
                return;
            }

            try {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", session.user.id)
                    .single();

                if (mounted) {
                    if (profile) {
                        setUserProfile(profile);
                    } else {
                        setUserProfile({
                            full_name: session.user.user_metadata?.full_name || "User",
                            role: session.user.user_metadata?.role || "member",
                            email: session.user.email
                        });
                    }
                }
            } catch (err) {
                console.error("Error on auth state change in landing page:", err);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // Render Home View
    const renderHome = () => (
        <>
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6 text-left">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-aqua-spring text-ocean-green text-xs font-bold uppercase tracking-wider rounded-full border border-ocean-green/10">
                        ✨ Program Loyalitas Apotek Terbaru
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-cyprus leading-tight tracking-tight">
                        Sehat Bersama <br />
                        <span className="text-ocean-green">Apotek Keluarga</span>
                    </h1>
                    <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-xl">
                        Dapatkan kemudahan akses obat-obatan berkualitas, konsultasi apoteker gratis, dan kumpulkan poin loyalitas dari setiap transaksi untuk diklaim menjadi diskon menarik.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                        <Link to="/register" className="px-6 py-3.5 bg-ocean-green text-white text-base font-bold rounded-xl hover:bg-emerald-700 hover:shadow-lg hover:shadow-ocean-green/10 transition-all shadow-md">
                            Gabung Member Gratis
                        </Link>
                        <button 
                            onClick={() => {
                                const section = document.getElementById("membership");
                                if (section) section.scrollIntoView({ behavior: "smooth" });
                            }} 
                            className="px-6 py-3.5 border border-gray-200 bg-white text-cyprus hover:bg-gray-50 text-base font-semibold rounded-xl transition-all"
                        >
                            Lihat Paket Keanggotaan
                        </button>
                    </div>
                </div>
                <div className="lg:col-span-5 relative flex justify-center">
                    <div className="absolute -inset-4 bg-ocean-green/5 rounded-3xl filter blur-xl"></div>
                    <div className="relative bg-white border border-gray-150 p-6 rounded-2xl shadow-xl w-full max-w-sm">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                            <h3 className="font-bold text-cyprus">Kartu Member Digital</h3>
                            <span className="text-xs font-bold text-ocean-green px-2 py-0.5 bg-aqua-spring rounded-full">VIP Member</span>
                        </div>
                        <div className="py-8 text-center space-y-2">
                            <span className="text-xs text-gray-400 uppercase tracking-widest font-bold block">Poin Anggota</span>
                            <h2 className="text-5xl font-black text-cyprus">2,450 <span className="text-sm font-medium text-gray-400">pts</span></h2>
                        </div>
                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                            <span>Keluarga Apotek ID</span>
                            <span className="font-semibold text-cyprus">AK-99827</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="bg-white py-16 md:py-24 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6 space-y-12">
                    <div className="text-center space-y-3">
                        <h2 className="text-3xl font-bold text-cyprus tracking-tight">Mengapa Menjadi Member Kami?</h2>
                        <p className="text-sm text-gray-400 max-w-md mx-auto">Rasakan berbagai kemudahan pelayanan kesehatan modern di genggaman Anda</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 bg-[#f8faf9] rounded-2xl border border-gray-100 space-y-4 text-left">
                            <div className="w-12 h-12 bg-aqua-spring text-ocean-green rounded-xl flex items-center justify-center text-xl">
                                <FaHeartbeat />
                            </div>
                            <h3 className="text-lg font-bold text-cyprus">Layanan Prioritas</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Tidak perlu mengantre lama untuk menebus resep obat. Nikmati pelayanan kesehatan prioritas bagi pemegang member Premium dan VIP.
                            </p>
                        </div>
                        <div className="p-6 bg-[#f8faf9] rounded-2xl border border-gray-100 space-y-4 text-left">
                            <div className="w-12 h-12 bg-aqua-spring text-ocean-green rounded-xl flex items-center justify-center text-xl">
                                <FaAward />
                            </div>
                            <h3 className="text-lg font-bold text-cyprus">Poin Loyalitas & Hadiah</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Kumpulkan poin dari setiap pembelian produk farmasi atau resep dokter, lalu tukarkan poin menjadi diskon langsung atau suplemen kesehatan gratis.
                            </p>
                        </div>
                        <div className="p-6 bg-[#f8faf9] rounded-2xl border border-gray-100 space-y-4 text-left">
                            <div className="w-12 h-12 bg-aqua-spring text-ocean-green rounded-xl flex items-center justify-center text-xl">
                                <FaShippingFast />
                            </div>
                            <h3 className="text-lg font-bold text-cyprus">Gratis Ongkir Instan</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Kirim obat langsung ke rumah Anda dengan layanan antar instan gratis tanpa minimum pembelian khusus bagi anggota berbayar kami.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="membership" className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-16">
                <div className="text-center space-y-3">
                    <h2 className="text-3xl font-bold text-cyprus tracking-tight">Pilih Paket Keanggotaan Anda</h2>
                    <p className="text-sm text-gray-400 max-w-md mx-auto">Gabung secara gratis sekarang dan rasakan keuntungannya secara langsung</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="bg-white border border-gray-150 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative text-left">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-cyprus">Free Member</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-extrabold text-cyprus">Rp 0</span>
                                <span className="text-xs text-gray-400">/ selamanya</span>
                            </div>
                            <p className="text-xs text-gray-400">Cocok untuk pemakaian obat berkala dan pendaftaran awal.</p>
                            <ul className="space-y-2.5 text-xs text-gray-600 pt-4 font-medium">
                                <li className="flex items-center gap-2"><FaCheckCircle className="text-ocean-green" /> 1 Poin per Rp 10.000 belanja</li>
                                <li className="flex items-center gap-2"><FaCheckCircle className="text-ocean-green" /> Konsultasi apoteker reguler</li>
                                <li className="flex items-center gap-2"><FaCheckCircle className="text-ocean-green" /> Akses produk obat standar</li>
                            </ul>
                        </div>
                        <Link to="/register" className="mt-8 w-full py-2.5 text-center text-xs font-bold text-ocean-green bg-aqua-spring hover:bg-ocean-green hover:text-white rounded-xl transition-all block">
                            Daftar Gratis
                        </Link>
                    </div>

                    <div className="bg-white border-2 border-ocean-green rounded-2xl p-6 flex flex-col justify-between shadow-lg relative text-left scale-105">
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-ocean-green text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                            Paling Populer
                        </span>
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-cyprus">Premium Member</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-extrabold text-cyprus">Rp 49K</span>
                                <span className="text-xs text-gray-400">/ bulan</span>
                            </div>
                            <p className="text-xs text-gray-400">Solusi terbaik untuk perlindungan kesehatan rutin keluarga Anda.</p>
                            <ul className="space-y-2.5 text-xs text-gray-600 pt-4 font-medium">
                                <li className="flex items-center gap-2"><FaCheckCircle className="text-ocean-green" /> 2x Lipat Poin per Transaksi</li>
                                <li className="flex items-center gap-2"><FaCheckCircle className="text-ocean-green" /> Bebas Antre & Konsultasi Prioritas</li>
                                <li className="flex items-center gap-2"><FaCheckCircle className="text-ocean-green" /> Gratis Ongkir Instan (3x/bulan)</li>
                                <li className="flex items-center gap-2"><FaCheckCircle className="text-ocean-green" /> Diskon Khusus Staf 5% All Item</li>
                            </ul>
                        </div>
                        <Link to="/register" className="mt-8 w-full py-2.5 text-center text-xs font-bold text-white bg-ocean-green hover:bg-emerald-700 rounded-xl transition-all block shadow-md shadow-ocean-green/20">
                            Gabung Premium
                        </Link>
                    </div>

                    <div className="bg-white border border-gray-150 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative text-left">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-cyprus">VIP Member</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-extrabold text-cyprus">Rp 99K</span>
                                <span className="text-xs text-gray-400">/ bulan</span>
                            </div>
                            <p className="text-xs text-gray-400">Bagi yang menginginkan perawatan kesehatan preventif ekstra lengkap.</p>
                            <ul className="space-y-2.5 text-xs text-gray-600 pt-4 font-medium">
                                <li className="flex items-center gap-2"><FaCheckCircle className="text-ocean-green" /> 3x Lipat Poin per Transaksi</li>
                                <li className="flex items-center gap-2"><FaCheckCircle className="text-ocean-green" /> Jalur VIP Apotek & Antar Obat Instan</li>
                                <li className="flex items-center gap-2"><FaCheckCircle className="text-ocean-green" /> Unlimited Gratis Ongkir Instan</li>
                                <li className="flex items-center gap-2"><FaCheckCircle className="text-ocean-green" /> Diskon All Item 10%</li>
                                <li className="flex items-center gap-2"><FaCheckCircle className="text-ocean-green" /> Cek Kesehatan Dasar Bulanan Gratis</li>
                            </ul>
                        </div>
                        <Link to="/register" className="mt-8 w-full py-2.5 text-center text-xs font-bold text-ocean-green bg-aqua-spring hover:bg-ocean-green hover:text-white rounded-xl transition-all block">
                            Pesan VIP Sekarang
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );

    // Render Company Profile View
    const renderProfile = () => (
        <section className="max-w-5xl mx-auto px-6 py-16 space-y-16 text-left">
            {/* Header Profil */}
            <div className="space-y-4 text-center">
                <span className="px-3 py-1 bg-aqua-spring text-ocean-green text-xs font-bold uppercase tracking-wider rounded-full">
                    🏢 Profil Perusahaan
                </span>
                <h2 className="text-4xl font-extrabold text-cyprus tracking-tight">Tentang Apotek Keluarga</h2>
                <p className="text-sm text-gray-400 max-w-xl mx-auto">Kami berdedikasi untuk memberikan layanan farmasi modern berkualitas tinggi dan terpercaya untuk seluruh keluarga Indonesia.</p>
            </div>

            {/* Visi Misi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-4">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                    <div className="w-10 h-10 bg-aqua-spring text-ocean-green rounded-xl flex items-center justify-center text-lg">
                        <FaBuilding />
                    </div>
                    <h3 className="text-xl font-bold text-cyprus">Visi Kami</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Menjadi apotek jejaring terkemuka di Indonesia yang mengintegrasikan layanan farmasi klinis digital dan program loyalitas pelanggan untuk mewujudkan masyarakat yang lebih sehat.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                    <div className="w-10 h-10 bg-aqua-spring text-ocean-green rounded-xl flex items-center justify-center text-lg">
                        <FaClipboardList />
                    </div>
                    <h3 className="text-xl font-bold text-cyprus">Misi Kami</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Menyediakan obat-obatan asli 100% dengan rantai distribusi yang aman, memberikan konsultasi medis yang edukatif dan ramah oleh apoteker ahli, serta menghadirkan kemudahan transaksi melalui teknologi digital yang responsif.
                    </p>
                </div>
            </div>

            {/* Tim Kami */}
            <div className="space-y-8">
                <h3 className="text-2xl font-bold text-cyprus text-center">Tim Apoteker Profesional Kami</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Tim 1 */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center space-y-3">
                        <div className="w-20 h-20 bg-aqua-spring border border-ocean-green/20 rounded-full flex items-center justify-center mx-auto text-ocean-green font-bold text-2xl">
                            AS
                        </div>
                        <div>
                            <h4 className="font-bold text-cyprus">apt. Ahmad Siregar, S.Farm.</h4>
                            <p className="text-xs text-gray-400">Kepala Apoteker Utama</p>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Berpengalaman lebih dari 12 tahun di bidang farmasi klinis dan manajemen apotek modern.
                        </p>
                    </div>
                    {/* Tim 2 */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center space-y-3">
                        <div className="w-20 h-20 bg-aqua-spring border border-ocean-green/20 rounded-full flex items-center justify-center mx-auto text-ocean-green font-bold text-2xl">
                            RI
                        </div>
                        <div>
                            <h4 className="font-bold text-cyprus">apt. Riana Indah, M.Farm.</h4>
                            <p className="text-xs text-gray-400">Spesialis Informasi Obat</p>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Ahli dalam pelayanan kefarmasian rawat jalan dan konsultasi obat-obatan penyakit kronis.
                        </p>
                    </div>
                    {/* Tim 3 */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center space-y-3">
                        <div className="w-20 h-20 bg-aqua-spring border border-ocean-green/20 rounded-full flex items-center justify-center mx-auto text-ocean-green font-bold text-2xl">
                            DK
                        </div>
                        <div>
                            <h4 className="font-bold text-cyprus">dr. Dodi Kurniawan, Sp.FK</h4>
                            <p className="text-xs text-gray-400">Konsultan Farmakologi</p>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Membantu pengawasan formulasi obat dan memastikan interaksi obat aman bagi pasien.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );

    // Render Services View
    const renderServices = () => (
        <section className="max-w-5xl mx-auto px-6 py-16 space-y-16 text-left">
            <div className="space-y-4 text-center">
                <span className="px-3 py-1 bg-aqua-spring text-ocean-green text-xs font-bold uppercase tracking-wider rounded-full">
                    🛠️ Layanan Kami
                </span>
                <h2 className="text-4xl font-extrabold text-cyprus tracking-tight">Layanan Kesehatan Apotek</h2>
                <p className="text-sm text-gray-400 max-w-xl mx-auto">Kami mengedepankan integrasi teknologi untuk menghadirkan layanan farmasi terbaik langsung ke depan pintu rumah Anda.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Service 1 */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start">
                    <div className="w-12 h-12 bg-aqua-spring text-ocean-green rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                        <FaPills />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-cyprus">Penyediaan Obat & Alat Kesehatan Lengkap</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Kami menyediakan obat-obatan paten, generik, suplemen makanan, kosmetik medis, serta alat kesehatan dasar dengan jaminan keaslian produk 100%.
                        </p>
                    </div>
                </div>

                {/* Service 2 */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start">
                    <div className="w-12 h-12 bg-aqua-spring text-ocean-green rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                        <FaStethoscope />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-cyprus">Konsultasi Apoteker Online</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Konsultasikan aturan pakai obat, efek samping, dan pantangan makan langsung dengan apoteker kami secara gratis melalui chat digital interaktif.
                        </p>
                    </div>
                </div>

                {/* Service 3 */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start">
                    <div className="w-12 h-12 bg-aqua-spring text-ocean-green rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                        <FaShippingFast />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-cyprus">Layanan Delivery Antar Obat Cepat</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Layanan pengiriman obat darurat yang bekerja sama dengan kurir internal apotek untuk menjamin obat sampai dengan suhu penyimpanan yang terjaga.
                        </p>
                    </div>
                </div>

                {/* Service 4 */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start">
                    <div className="w-12 h-12 bg-aqua-spring text-ocean-green rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                        <FaUsers />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-cyprus">Cek Kesehatan Mandiri</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Kunjungi outlet fisik kami untuk pengecekan kolesterol, kadar gula darah, asam urat, serta tensi tekanan darah secara instan dengan harga terjangkau.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );

    // Render Contact View
    const renderContact = () => (
        <section className="max-w-5xl mx-auto px-6 py-16 space-y-16 text-left">
            <div className="space-y-4 text-center">
                <span className="px-3 py-1 bg-aqua-spring text-ocean-green text-xs font-bold uppercase tracking-wider rounded-full">
                    📞 Kontak Kami
                </span>
                <h2 className="text-4xl font-extrabold text-cyprus tracking-tight">Hubungi Kami Sekarang</h2>
                <p className="text-sm text-gray-400 max-w-xl mx-auto">Ada pertanyaan mengenai ketersediaan obat atau paket keanggotaan member? Kami siap melayani Anda.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* Info Kontak (5 span) */}
                <div className="md:col-span-5 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="text-lg font-bold text-cyprus">Informasi Outlet</h3>
                        
                        <div className="flex gap-3 text-sm text-gray-650 items-start">
                            <FaMapMarkerAlt className="text-ocean-green text-lg mt-0.5 flex-shrink-0" />
                            <span>Jl. Jenderal Sudirman No. 124, Kota Pekanbaru, Riau</span>
                        </div>
                        <div className="flex gap-3 text-sm text-gray-650 items-center">
                            <FaPhoneAlt className="text-ocean-green flex-shrink-0" />
                            <span>+62 812-3456-7890</span>
                        </div>
                        <div className="flex gap-3 text-sm text-gray-650 items-center">
                            <FaEnvelope className="text-ocean-green flex-shrink-0" />
                            <span>support@apotekkeluarga.com</span>
                        </div>
                        <div className="flex gap-3 text-sm text-gray-650 items-center">
                            <FaClock className="text-ocean-green flex-shrink-0" />
                            <span>Buka 24 Jam (Setiap Hari)</span>
                        </div>
                    </div>

                    {/* Mock Map */}
                    <div className="h-48 bg-aqua-spring rounded-2xl border border-ocean-green/10 flex flex-col items-center justify-center p-4 text-center shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/101.4478,0.5071,13/400x300?access_token=mock')` }}></div>
                        <FaMapMarkerAlt className="text-ocean-green text-3xl mb-2 animate-bounce z-10" />
                        <span className="text-xs font-bold text-cyprus z-10">Peta Outlet Pekanbaru</span>
                        <span className="text-[10px] text-gray-400 z-10 mt-1">Gunakan navigasi Google Maps ke Apotek Keluarga</span>
                    </div>
                </div>

                {/* Form Kontak (7 span) */}
                <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-cyprus">Kirim Pesan Langsung</h3>
                    
                    {contactSuccess && (
                        <div className="bg-emerald-50 border border-emerald-150 p-4 text-xs text-emerald-700 rounded-xl flex items-center gap-2">
                            <FaCheckCircle className="text-lg text-emerald-500" />
                            <span>Pesan Anda berhasil terkirim! Staf apotek kami akan membalas via email.</span>
                        </div>
                    )}

                    <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Nama Lengkap</label>
                            <input 
                                type="text"
                                value={contactForm.name}
                                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-ocean-green/20"
                                placeholder="Nama Anda"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                            <input 
                                type="email"
                                value={contactForm.email}
                                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-ocean-green/20"
                                placeholder="email@contoh.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Pesan / Masukan</label>
                            <textarea 
                                rows="4"
                                value={contactForm.message}
                                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-ocean-green/20 resize-none"
                                placeholder="Tuliskan pertanyaan Anda di sini..."
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2.5 bg-ocean-green hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                        >
                            Kirim Pesan
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );

    return (
        <div className="bg-[#f8faf9] min-h-screen text-gray-800 font-inter flex flex-col justify-between">
            <div>
                {/* Header / Navbar */}
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-ocean-green rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md shadow-ocean-green/20">
                            +
                        </div>
                        <span className="text-xl font-extrabold text-cyprus tracking-tight">
                            Apotek Keluarga
                        </span>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-500">
                        <button 
                            onClick={() => setActiveTab("home")}
                            className={`hover:text-ocean-green transition-colors cursor-pointer ${activeTab === "home" ? "text-ocean-green font-bold" : ""}`}
                        >
                            Home
                        </button>
                        <button 
                            onClick={() => setActiveTab("profile")}
                            className={`hover:text-ocean-green transition-colors cursor-pointer ${activeTab === "profile" ? "text-ocean-green font-bold" : ""}`}
                        >
                            Profil Company
                        </button>
                        <button 
                            onClick={() => setActiveTab("services")}
                            className={`hover:text-ocean-green transition-colors cursor-pointer ${activeTab === "services" ? "text-ocean-green font-bold" : ""}`}
                        >
                            Layanan
                        </button>
                        <button 
                            onClick={() => setActiveTab("contact")}
                            className={`hover:text-ocean-green transition-colors cursor-pointer ${activeTab === "contact" ? "text-ocean-green font-bold" : ""}`}
                        >
                            Hubungi Kami
                        </button>
                    </nav>

                    <div className="flex items-center gap-3">
                        {!loadingAuth && (
                            userProfile ? (
                                <>
                                    <Link 
                                        to={userProfile.role === "member" ? "/member-dashboard" : "/dashboard"} 
                                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-ocean-green rounded-xl hover:bg-emerald-700 hover:shadow-md transition-all shadow-sm"
                                    >
                                        Dashboard
                                    </Link>
                                    <button 
                                        onClick={async () => {
                                            if (window.confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
                                                await supabase.auth.signOut();
                                            }
                                        }} 
                                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-cyprus hover:text-red-650 transition-colors cursor-pointer"
                                    >
                                        Keluar
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-cyprus hover:text-ocean-green transition-colors">
                                        <FaSignInAlt /> Masuk
                                    </Link>
                                    <Link to="/register" className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-ocean-green rounded-xl hover:bg-emerald-700 hover:shadow-md transition-all shadow-sm">
                                        <FaUserPlus /> Daftar
                                    </Link>
                                </>
                            )
                        )}
                    </div>
                </header>

                {/* Main Dynamic View Content */}
                <main className="transition-all duration-300">
                    {activeTab === "home" && renderHome()}
                    {activeTab === "profile" && renderProfile()}
                    {activeTab === "services" && renderServices()}
                    {activeTab === "contact" && renderContact()}
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-cyprus text-gray-400 border-t border-teal-950 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-ocean-green rounded-lg flex items-center justify-center text-white text-lg font-bold">
                            +
                        </div>
                        <span className="text-white font-bold tracking-tight">Apotek Keluarga</span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-gray-400">
                        <button onClick={() => setActiveTab("home")} className="hover:text-white transition-colors">Home</button>
                        <button onClick={() => setActiveTab("profile")} className="hover:text-white transition-colors">Profil</button>
                        <button onClick={() => setActiveTab("services")} className="hover:text-white transition-colors">Layanan</button>
                        <button onClick={() => setActiveTab("contact")} className="hover:text-white transition-colors">Kontak</button>
                    </div>

                    <p className="text-center md:text-left text-xs">
                        © 2026 Apotek Keluarga. All rights reserved. Portal Kesehatan Modern Pekanbaru.
                    </p>
                </div>
            </footer>
        </div>
    );
}
