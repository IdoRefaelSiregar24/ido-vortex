import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import {
  FaHeartbeat, FaPills, FaShippingFast, FaCheckCircle, FaAward,
  FaUserPlus, FaSignInAlt, FaBuilding, FaUsers, FaStethoscope,
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaClipboardList,
} from "react-icons/fa";
import { supabase } from "../lib/supabase";

// ── Reusable Landing Components ────────────────────────────────
import LandingNavbar        from "../components/landing/LandingNavbar";
import HeroCarousel         from "../components/landing/HeroCarousel";
import SectionHeader        from "../components/landing/SectionHeader";
import PharmaCategoryCard   from "../components/landing/PharmaCategoryCard";
import PharmacyProductCard  from "../components/landing/PharmacyProductCard";
import PromoCard            from "../components/landing/PromoCard";
import TestimonialCard      from "../components/landing/TestimonialCard";
import LandingFooter        from "../components/landing/LandingFooter";

// ── Data ────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: "Vitamin & Suplemen", icon: "💊", bg: "bg-emerald-50", color: "text-emerald-600" },
  { label: "Obat Bebas",         icon: "🏥", bg: "bg-blue-50",    color: "text-blue-600"    },
  { label: "Antibiotik",         icon: "🧬", bg: "bg-purple-50",  color: "text-purple-600"  },
  { label: "Diabetes & Jantung", icon: "❤️", bg: "bg-red-50",     color: "text-red-500"     },
  { label: "Alat Kesehatan",     icon: "🩺", bg: "bg-amber-50",   color: "text-amber-600"   },
  { label: "BPJS & Resep",       icon: "📋", bg: "bg-cyan-50",    color: "text-cyan-600"    },
  { label: "Ibu & Anak",         icon: "👶", bg: "bg-pink-50",    color: "text-pink-500"    },
  { label: "Herbal & Jamu",      icon: "🌿", bg: "bg-lime-50",    color: "text-lime-600"    },
];

const TRENDING_PRODUCTS = [
  { id: 1, name: "Paracetamol 500mg (Strip 10)", category: "Obat Bebas",    price: 8500,   originalPrice: 12000,  discount: 29, rating: 5, sold: 1200, isBestSeller: true,  image: "https://placehold.co/160x140/EAF8E7/4EA674?text=Paracetamol" },
  { id: 2, name: "Vitamin C 1000mg Effervescent", category: "Suplemen",     price: 22000,  originalPrice: 28000,  discount: 21, rating: 5, sold: 890,  isBestSeller: false, image: "https://placehold.co/160x140/EAF8E7/4EA674?text=Vitamin+C"   },
  { id: 3, name: "Amoxicillin 500mg (Box)",       category: "Obat Keras",   price: 32000,  originalPrice: 40000,  discount: 20, rating: 4, sold: 450,  isBestSeller: false, image: "https://placehold.co/160x140/EAF8E7/4EA674?text=Amoxicillin" },
  { id: 4, name: "Cetirizine 10mg Antihistamin",  category: "Obat Bebas",   price: 18000,  originalPrice: null,   discount: 0,  rating: 4, sold: 670,  isBestSeller: false, image: "https://placehold.co/160x140/EAF8E7/4EA674?text=Cetirizine"  },
  { id: 5, name: "Omeprazole 20mg Kapsul",        category: "Obat Keras",   price: 42000,  originalPrice: 50000,  discount: 16, rating: 5, sold: 320,  isBestSeller: true,  image: "https://placehold.co/160x140/EAF8E7/4EA674?text=Omeprazole"  },
  { id: 6, name: "Promag Forte 30 Tablet",        category: "Obat Bebas",   price: 25000,  originalPrice: null,   discount: 0,  rating: 4, sold: 780,  isBestSeller: false, image: "https://placehold.co/160x140/EAF8E7/4EA674?text=Promag"       },
];

const DEALS_PRODUCTS = [
  { id: 7,  name: "Betadine Antiseptik 100ml",       category: "Alat Medis",  price: 35000,  originalPrice: 48000,  discount: 27, rating: 5, sold: 560,  image: "https://placehold.co/160x140/EAF8E7/4EA674?text=Betadine"    },
  { id: 8,  name: "Ibuprofen 400mg Anti Nyeri",      category: "Obat Bebas",  price: 15000,  originalPrice: 20000,  discount: 25, rating: 4, sold: 430,  image: "https://placehold.co/160x140/EAF8E7/4EA674?text=Ibuprofen"   },
  { id: 9,  name: "Antangin JRG Masuk Angin Herbal", category: "Herbal",      price: 7500,   originalPrice: 9000,   discount: 17, rating: 5, sold: 2100, image: "https://placehold.co/160x140/EAF8E7/4EA674?text=Antangin"    },
  { id: 10, name: "Metformin 500mg Diabetes",        category: "Obat Keras",  price: 27000,  originalPrice: 34000,  discount: 21, rating: 4, sold: 290,  image: "https://placehold.co/160x140/EAF8E7/4EA674?text=Metformin"   },
  { id: 11, name: "Curcuma Plus Suplemen Anak",      category: "Suplemen",    price: 45000,  originalPrice: 55000,  discount: 18, rating: 5, sold: 870,  image: "https://placehold.co/160x140/EAF8E7/4EA674?text=Curcuma"     },
];

const TESTIMONIALS = [
  { name: "Andi Pratama",    location: "Pekanbaru",   rating: 5, review: "Pelayanan sangat cepat! Obat datang dalam 1 jam setelah saya pesan. Apotekernya juga sangat ramah dan informatif.", isHighlighted: false },
  { name: "Siti Rahmawati",  location: "Marpoyan",    rating: 5, review: "Program member-nya worth it banget! Poin saya udah terkumpul banyak dan bisa ditukar diskon langsung. Sangat direkomendasikan!", isHighlighted: true  },
  { name: "Budi Santoso",    location: "Tampan",      rating: 4, review: "Harga obat di sini lebih terjangkau dibanding apotek lain. Stok lengkap dan mudah dicari katalognya.", isHighlighted: false },
  { name: "Dewi Anggraini",  location: "Rumbai",      rating: 5, review: "Konsultasi apotekernya gratis dan sangat membantu. Saya jadi lebih paham cara minum obat yang benar.", isHighlighted: false },
  { name: "Eko Purnomo",     location: "Payung Sekaki", rating: 5, review: "Fitur kartu member digitalnya keren! Langsung kelihatan poin dan riwayat pembelian saya kapan saja.", isHighlighted: false },
  { name: "Rina Fitri",      location: "Bukit Raya",  rating: 4, review: "Pesan obat resep dokter jadi sangat mudah. Tinggal upload foto resep, langsung diproses. Terima kasih Apotek Sehat!", isHighlighted: false },
];

const FEATURE_PILLS = [
  { icon: "🔥", label: "Produk Terlaris",  desc: "Update harian"       },
  { icon: "⚡", label: "Promo Hari Ini",   desc: "Diskon s/d 50%"      },
  { icon: "📋", label: "Resep Digital",    desc: "Upload & tebus mudah" },
  { icon: "🏥", label: "BPJS Online",      desc: "Tanpa antri panjang"  },
];

// ── Main Component ───────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab]         = useState("home");
  const [contactForm, setContactForm]     = useState({ name: "", email: "", message: "" });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [userProfile, setUserProfile]     = useState(null);
  const [loadingAuth, setLoadingAuth]     = useState(true);

  // ── Sync tab from navigate state ─────────────────────────────
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      if (location.state.scrollTo) {
          setTimeout(() => {
              document.getElementById(location.state.scrollTo)?.scrollIntoView({ behavior: "smooth" });
          }, 150);
      } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [location.state]);

  // ── Dynamic page title ────────────────────────────────────────
  useEffect(() => {
    const titles = {
      home:     "Apotek Sehat Pekanbaru — Farmasi Digital Terpercaya",
      profile:  "Profil Perusahaan — Apotek Sehat Pekanbaru",
      services: "Layanan Farmasi, Antar Obat & Cek Kesehatan — Apotek Sehat Pekanbaru",
      contact:  "Kontak & Lokasi Apotek Sehat Pekanbaru",
    };
    document.title = titles[activeTab] || "Apotek Sehat Pekanbaru";
  }, [activeTab]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSuccess(true);
    setContactForm({ name: "", email: "", message: "" });
    setTimeout(() => setContactSuccess(false), 4000);
  };

  // ── Auth check ────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          if (mounted) { setUserProfile(null); setLoadingAuth(false); }
          return;
        }
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        if (mounted) {
          setUserProfile(profile ?? {
            full_name: session.user.user_metadata?.full_name || "User",
            role: session.user.user_metadata?.role || "member",
            email: session.user.email,
          });
        }
      } catch (err) {
        console.error("Error checking session:", err);
      } finally {
        if (mounted) setLoadingAuth(false);
      }
    };
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session) { if (mounted) setUserProfile(null); return; }
      try {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        if (mounted) {
          setUserProfile(profile ?? {
            full_name: session.user.user_metadata?.full_name || "User",
            role: session.user.user_metadata?.role || "member",
            email: session.user.email,
          });
        }
      } catch (err) {
        console.error("Error on auth state change:", err);
      }
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  // ── Dummy cart handler ────────────────────────────────────────
  const handleAddToCart = (product) => {
    alert(`"${product.name}" ditambahkan ke keranjang!\nLogin untuk melanjutkan transaksi.`);
  };

  // ════════════════════════════════════════════════════════════════
  // RENDER: HOME — E-Commerce Layout
  // ════════════════════════════════════════════════════════════════
  const renderHome = () => (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-12">

      {/* ── 1. Hero Carousel ──────────────────────────────── */}
      <HeroCarousel />
        {/* ── 2. Feature Pills Row ─────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {FEATURE_PILLS.map((pill) => (
          <Link
            key={pill.label}
            to="/member-obat"
            className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-gray-100 hover:border-ocean-green/30 hover:shadow-md hover:shadow-ocean-green/10 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-aqua-spring rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              {pill.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-cyprus">{pill.label}</p>
              <p className="text-[10px] text-grey">{pill.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── 3. Category Grid ─────────────────────────────── */}
      <section>
        <SectionHeader title="Jelajahi Kategori" subtitle="Temukan produk sesuai kebutuhan kesehatan Anda" linkTo="/member-obat" />
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <PharmaCategoryCard
              key={cat.label}
              icon={cat.icon}
              label={cat.label}
              bg={cat.bg}
              color={cat.color}
              onClick={() => navigate("/member-obat")}
            />
          ))}
        </div>
      </section>

      {/* ── 4. Trending Products ─────────────────────────── */}
      <section>
        {/* Header matching screenshot layout */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#023337] tracking-tight">Trending Product</h2>
          <Link
            to="/member-obat"
            className="px-6 py-2 border border-gray-300 text-cyprus hover:bg-gray-50 text-xs font-bold rounded-full transition-colors"
          >
            View All
          </Link>
        </div>

        {/* 3 cards + 1 collection grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: 3 Product Cards */}
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Paracetamol 500mg Strip",
                desc: "Obat pereda nyeri dan penurun demam paling populer. Aman untuk dewasa dan anak di atas 6 tahun.",
                price: "Rp 8.500",
                originalPrice: "Rp 12.000",
                discount: "29% Off",
                rating: 5,
                reviews: 1200,
                image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
              },
              {
                name: "Vitamin C 1000mg Effervescent",
                desc: "Suplemen daya tahan tubuh dengan dosis tinggi Vitamin C. Larut sempurna, rasa jeruk segar.",
                price: "Rp 22.000",
                originalPrice: "Rp 28.000",
                discount: "21% Off",
                rating: 5,
                reviews: 890,
                image: "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=400&q=80",
              },
              {
                name: "Amoxicillin 500mg Box",
                desc: "Antibiotik spektrum luas untuk infeksi bakteri. Harus dengan resep dokter, tersedia konsultasi gratis.",
                price: "Rp 32.000",
                originalPrice: "Rp 40.000",
                discount: "20% Off",
                rating: 4,
                reviews: 450,
                image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=400&q=80",
              }
            ].map((prod, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                {/* Image & Wishlist Button */}
                <div className="h-48 bg-gray-50 relative flex items-center justify-center overflow-hidden">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                  <button className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm cursor-pointer transition-colors">
                    <Heart size={16} />
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="text-left">
                    <h3 className="text-base font-extrabold text-cyprus leading-snug">{prod.name}</h3>
                    <p className="text-[11px] text-grey leading-relaxed mt-1.5 line-clamp-2">{prod.desc}</p>
                    
                    {/* Stars & Reviews */}
                    <div className="flex items-center gap-1 mt-2.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} className={i < prod.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                      ))}
                      <span className="text-[10px] text-grey ml-1">({prod.reviews} reviews).</span>
                    </div>
                  </div>

                  {/* Price Row & Action */}
                  <div className="flex items-end justify-between border-t border-gray-50 pt-4 mt-auto">
                    <div className="text-left">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-base font-black text-[#4ea674]">{prod.price}</span>
                        {prod.originalPrice && (
                          <span className="text-[10px] text-grey line-through">({prod.originalPrice}).</span>
                        )}
                        {prod.discount && (
                          <span className="text-[10px] font-bold text-red-500">{prod.discount}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100/50">
                    <Link to="/member-obat" className="text-xs font-bold text-indigo-600 hover:underline">
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart({ name: prod.name })}
                      className="px-6 py-2 bg-[#4ea674] hover:bg-cyprus text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Koleksi Obat Populer Panel */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-200/80 p-5 flex flex-col justify-between shadow-sm">
            <h3 className="text-sm font-extrabold text-cyprus text-left mb-4">Koleksi Obat Populer</h3>
            
            <div className="grid grid-cols-2 gap-3.5">
              {[
                { label: "Multivitamin",   price: "Rp 89K",  discount: "20% off", img: "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=250&q=80" },
                { label: "Minyak Kayu Putih", price: "Rp 25K",  discount: null,      img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=250&q=80" },
                { label: "Madu Herbal",     price: "Rp 120K", discount: null,      img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=250&q=80" },
                { label: "Masker Medis",    price: "Rp 45K",  discount: null,      img: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=250&q=80" }
              ].map((item, i) => (
                <div key={i} className="relative border border-gray-100 rounded-2xl bg-white flex flex-col overflow-hidden hover:border-ocean-green/30 hover:shadow-md transition-all group h-[190px]">
                  {/* Image container */}
                  <div className="h-24 w-full relative overflow-hidden bg-gray-50">
                    <img src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {item.discount && (
                      <span className="absolute top-2 left-2 text-[8px] font-black text-white bg-red-500 px-1.5 py-0.5 rounded shadow-sm">
                        {item.discount}
                      </span>
                    )}
                    <span className="absolute top-2 right-2 text-[8px] font-black text-white bg-ocean-green px-1.5 py-0.5 rounded shadow-sm">
                      {item.price}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="p-2 flex flex-col flex-1 justify-between">
                    <div className="text-left">
                      <h4 className="text-[10px] font-black text-cyprus truncate">{item.label}</h4>
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart({ name: item.label })}
                      className="w-full bg-[#eaf8e7] hover:bg-ocean-green hover:text-white text-cyprus text-[9px] font-black py-1.5 rounded-lg shadow-sm cursor-pointer transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Best Selling (Promo Grid) ─────────────────── */}
      <section>
        <SectionHeader title="Produk Terlaris" subtitle="Pilihan pelanggan setia apotek kami" linkTo="/member-obat" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ minHeight: "360px" }}>
          {/* Large promo left */}
          <PromoCard
            title="Antar Obat Cepat ke Pintu Rumah"
            subtitle="Pesan sebelum jam 22.00, tiba malam ini juga"
            badge="EXPRESS DELIVERY"
            ctaLabel="Pesan Sekarang"
            ctaLink="/member-obat"
            bgClass="bg-gradient-to-br from-cyprus to-[#034a4f]"
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgHPHaYHnxT7rz3HoTtDpunZTu-IiWOLRUBH6ABnZHoyJabGmWxxFUqeE&s=10"
            tall
          />
          {/* Right column — 2 promo stacked */}
          <PromoCard
            title="Diskon Vitamin & Suplemen Pilihan"
            subtitle="Hemat hingga 30% untuk semua produk suplemen"
            badge="PROMO MINGGU INI"
            ctaLabel="Lihat Produk"
            ctaLink="/member-obat"
            bgClass="bg-gradient-to-br from-ocean-green to-[#3a7d5a]"
            image="https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?auto=format&fit=crop&w=400&q=80"
          />
          <PromoCard
            title="Program Keanggotaan Eksklusif VIP"
            subtitle="Unlimited gratis ongkir + cek kesehatan bulanan gratis"
            badge="VIP MEMBER"
            ctaLabel="Gabung VIP"
            ctaLink="/register"
            bgClass="bg-gradient-to-br from-[#4a2a7a] to-[#6b3fa8]"
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu7Ftoy3D0bkqht9-aEAYyXCl1-_Ec5_fuBOnIsAfpbBZuWmCLFlMMoQtj&s=10"
          />
          {/* Bottom 2 promo */}
          <PromoCard
            title="BPJS Kesehatan & Resep Digital"
            subtitle="Tebus resep dokter online tanpa antri panjang"
            badge="LAYANAN RESEP"
            ctaLabel="Upload Resep"
            ctaLink="/member-obat"
            bgClass="bg-gradient-to-br from-[#1a4a6b] to-[#2a6fa8]"
            image="https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80"
          />
          <PromoCard
            title="Cek Kesehatan Dasar Gratis"
            subtitle="Gula darah, kolesterol & tensi — khusus member"
            badge="GRATIS MEMBER"
            ctaLabel="Daftar Member"
            ctaLink="/register"
            bgClass="bg-gradient-to-br from-amber-600 to-orange-600"
            image="https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&w=400&q=80"
          />
          <PromoCard
            title="Konsultasi Apoteker 24 Jam"
            subtitle="Tanya obat, aturan pakai & efek samping gratis"
            badge="GRATIS"
            ctaLabel="Konsultasi Sekarang"
            ctaLink="/"
            bgClass="bg-gradient-to-br from-rose-600 to-pink-700"
            image="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80"
          />
        </div>
      </section>

      {/* ── 6. Limited-Time Deals ────────────────────────── */}
      <section>
        {/* Header matching screenshot layout */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#023337] tracking-tight">Limited-Time Deal</h2>
          <Link
            to="/member-obat"
            className="px-6 py-2 border border-gray-300 text-cyprus hover:bg-gray-50 text-xs font-bold rounded-full transition-colors"
          >
            View All
          </Link>
        </div>

        {/* 5-column product grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            {
              name: "Betadine Antiseptik 100ml",
              desc: "Cairan antiseptik povidone-iodine untuk luka ringan, gores, dan luka bakar. Membunuh kuman efektif.",
              price: "Rp 35.000",
              originalPrice: "Rp 48.000",
              discount: "27% Off",
              rating: 5,
              reviews: 560,
              badgeStyle: "circle",
              badgeText: "27%",
              image: "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=400&q=80",
            },
            {
              name: "Ibuprofen 400mg Anti Nyeri",
              desc: "Obat anti inflamasi non-steroid untuk meredakan nyeri otot, sakit kepala, dan demam tinggi.",
              price: "Rp 15.000",
              originalPrice: "Rp 20.000",
              discount: "25% Off",
              rating: 4,
              reviews: 430,
              badgeStyle: "banner-blue",
              badgeText: "PROMO SPESIAL 25% OFF",
              image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80",
            },
            {
              name: "Antangin JRG Herbal",
              desc: "Jamu herbal tradisional untuk masuk angin, pegal linu, dan mual. Formula alami terpercaya.",
              price: "Rp 7.500",
              originalPrice: "Rp 9.000",
              discount: "17% Off",
              rating: 5,
              reviews: 2100,
              badgeStyle: "banner-winter",
              badgeText: "diskon 17%",
              image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=80",
            },
            {
              name: "Metformin 500mg Diabetes",
              desc: "Obat diabetes tipe 2 untuk mengontrol kadar gula darah. Wajib konsultasi dokter sebelum penggunaan.",
              price: "Rp 27.000",
              originalPrice: "Rp 34.000",
              discount: "21% Off",
              rating: 4,
              reviews: 290,
              badgeStyle: "banner-sneaker",
              badgeText: "OBAT RESEP",
              image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=400&q=80",
            },
            {
              name: "Curcuma Plus Anak 100ml",
              desc: "Suplemen penambah nafsu makan anak dengan ekstrak temulawak dan multivitamin lengkap.",
              price: "Rp 45.000",
              originalPrice: "Rp 55.000",
              discount: "18% Off",
              rating: 5,
              reviews: 870,
              badgeStyle: "circle",
              badgeText: "18%",
              image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80",
            }
          ].map((prod, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              
              {/* Image Container with Wishlist and Overlays matching screenshot */}
              <div className="h-44 bg-gray-50 relative flex items-center justify-center overflow-hidden">
                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                
                {/* Wishlist Heart */}
                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm cursor-pointer z-20">
                  <Heart size={14} />
                </button>

                {/* Badge Overlay Types */}
                {prod.badgeStyle === "circle" && (
                  <div className="absolute top-3 left-3 bg-cyan-400 text-white font-extrabold text-[9px] w-9 h-9 rounded-full flex flex-col items-center justify-center rotate-[-12deg] shadow-sm z-10">
                    <span>{prod.badgeText}</span>
                    <span className="text-[7px] leading-none uppercase font-black">off</span>
                  </div>
                )}
                {prod.badgeStyle === "banner-blue" && (
                  <div className="absolute inset-0 bg-[#000d2b]/60 flex flex-col items-center justify-center p-2 z-10 text-center">
                    <p className="text-white text-[8px] tracking-wider uppercase font-black">PROMO APOTEK</p>
                    <p className="text-cyan-400 text-[10px] font-black mt-0.5">{prod.badgeText}</p>
                  </div>
                )}
                {prod.badgeStyle === "banner-winter" && (
                  <div className="absolute inset-0 bg-[#2d6a4f]/30 flex flex-col justify-between p-3 z-10 text-left">
                    <p className="text-[#023337] bg-white/90 text-[7px] px-1.5 py-0.5 rounded font-black w-max">{prod.badgeText}</p>
                    <p className="text-white text-[9px] font-black mt-auto drop-shadow-sm uppercase">Promo Herbal</p>
                  </div>
                )}
                {prod.badgeStyle === "banner-sneaker" && (
                  <div className="absolute inset-0 bg-[#023337]/60 flex flex-col items-center justify-center p-2 z-10 text-center">
                    <p className="text-white text-[9px] tracking-wider uppercase font-black border-b border-white/20 pb-0.5">{prod.badgeText}</p>
                    <p className="text-white/60 text-[6px] tracking-widest uppercase mt-0.5">BUTUH RESEP DOKTER</p>
                  </div>
                )}
              </div>

              {/* Body Content */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div className="text-left">
                  <h3 className="text-xs font-extrabold text-cyprus leading-snug line-clamp-1">{prod.name}</h3>
                  <p className="text-[10px] text-grey leading-relaxed mt-1 line-clamp-2">{prod.desc}</p>
                  
                  {/* Stars & Reviews */}
                  <div className="flex items-center gap-0.5 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className={i < prod.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                    ))}
                    <span className="text-[9px] text-grey ml-1">({prod.reviews} reviews).</span>
                  </div>
                </div>

                {/* Price Row */}
                <div className="flex items-end justify-between border-t border-gray-50 pt-3 mt-auto">
                  <div className="text-left">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-xs font-black text-[#4ea674]">{prod.price}</span>
                      {prod.originalPrice && (
                        <span className="text-[9px] text-grey line-through">({prod.originalPrice}).</span>
                      )}
                      {prod.discount && (
                        <span className="text-[9px] font-bold text-red-500">{prod.discount}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100/50">
                  <Link to="/member-obat" className="text-[10px] font-bold text-indigo-600 hover:underline">
                    View Details
                  </Link>
                  <button
                    onClick={() => handleAddToCart({ name: prod.name })}
                    className="px-4 py-1.5 bg-[#4ea674] hover:bg-cyprus text-white text-[10px] font-bold rounded-full transition-colors cursor-pointer"
                  >
                    Add to cart
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* ── 7. Membership CTA Banner ─────────────────────── */}
      <section id="membership" className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-cyprus via-[#034040] to-ocean-green p-8 md:p-12">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free */}
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5 space-y-3 text-white">
            <h3 className="font-bold text-base">Free Member</h3>
            <div className="text-2xl font-extrabold">Rp 0 <span className="text-xs font-normal opacity-60">/ selamanya</span></div>
            <ul className="space-y-1.5 text-xs opacity-80">
              {["1 Poin per Rp 10.000 belanja", "Konsultasi apoteker reguler", "Akses katalog lengkap"].map(f => (
                <li key={f} className="flex items-center gap-2"><FaCheckCircle className="text-surf-crest shrink-0" />{f}</li>
              ))}
            </ul>
            <Link to="/register" className="block text-center mt-4 py-2.5 text-xs font-bold bg-white/20 hover:bg-white/30 rounded-xl transition-all">Daftar Gratis</Link>
          </div>
          {/* Premium — highlighted */}
          <div className="bg-white rounded-2xl p-5 space-y-3 text-cyprus shadow-2xl scale-105">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">Premium Member</h3>
              <span className="text-[10px] font-extrabold bg-ocean-green text-white px-2 py-0.5 rounded-full uppercase">Populer</span>
            </div>
            <div className="text-2xl font-extrabold text-cyprus">Rp 49K <span className="text-xs font-normal text-grey">/ bulan</span></div>
            <ul className="space-y-1.5 text-xs text-grey">
              {["2x Lipat poin per transaksi", "Bebas antre & konsultasi prioritas", "Gratis ongkir instan 3x/bulan", "Diskon 5% semua item"].map(f => (
                <li key={f} className="flex items-center gap-2"><FaCheckCircle className="text-ocean-green shrink-0" />{f}</li>
              ))}
            </ul>
            <Link to="/register" className="block text-center mt-4 py-2.5 text-xs font-bold bg-ocean-green text-white hover:bg-cyprus rounded-xl transition-all shadow-md shadow-ocean-green/30">Gabung Premium</Link>
          </div>
          {/* VIP */}
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5 space-y-3 text-white">
            <h3 className="font-bold text-base">VIP Member</h3>
            <div className="text-2xl font-extrabold">Rp 99K <span className="text-xs font-normal opacity-60">/ bulan</span></div>
            <ul className="space-y-1.5 text-xs opacity-80">
              {["3x Lipat poin per transaksi", "Jalur VIP & antar obat unlimited", "Unlimited gratis ongkir instan", "Diskon 10% semua item", "Cek kesehatan dasar bulanan gratis"].map(f => (
                <li key={f} className="flex items-center gap-2"><FaCheckCircle className="text-surf-crest shrink-0" />{f}</li>
              ))}
            </ul>
            <Link to="/register" className="block text-center mt-4 py-2.5 text-xs font-bold bg-white/20 hover:bg-white/30 rounded-xl transition-all">Pesan VIP Sekarang</Link>
          </div>
        </div>
      </section>

      {/* ── 8. Stats Row ─────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: "10.000+", label: "Pelanggan Aktif",   icon: "👥" },
          { value: "500+",    label: "Produk Tersedia",   icon: "💊" },
          { value: "24 Jam",  label: "Layanan Online",    icon: "🕐" },
          { value: "4.9/5",   label: "Rating Pelanggan",  icon: "⭐" },
        ].map(({ value, label, icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center hover:border-ocean-green/30 hover:shadow-md transition-all">
            <div className="text-2xl mb-1">{icon}</div>
            <p className="text-xl font-extrabold text-cyprus">{value}</p>
            <p className="text-xs text-grey mt-0.5">{label}</p>
          </div>
        ))}
      </section>

      {/* ── 9. Testimonials ──────────────────────────────── */}
      <section className="py-12 bg-gray-50/20 rounded-3xl border border-gray-100 overflow-hidden relative">
        <style>{`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.33%); }
          }
          @keyframes scroll-right {
            0% { transform: translateX(-33.33%); }
            100% { transform: translateX(0); }
          }
          .animate-scroll-left {
            animation: scroll-left 25s linear infinite;
          }
          .animate-scroll-right {
            animation: scroll-right 25s linear infinite;
          }
          .animate-scroll-left:hover, .animate-scroll-right:hover {
            animation-play-state: paused;
          }
        `}</style>

        {/* Header matching screenshot */}
        <div className="text-center max-w-2xl mx-auto mb-10 px-4">
          <h2 className="text-3xl font-extrabold text-[#4ea674] tracking-tight">Our Happy Customers</h2>
          <p className="text-xs text-grey leading-relaxed mt-2">
            Don’t just take our word for it – see how our products and services have delighted customers across the globe, one experience at a time.
          </p>
        </div>

        {/* Row 1 (slides left) */}
        <div className="flex w-full overflow-hidden mb-6 relative">
          <div className="flex gap-6 animate-scroll-left w-max py-2 select-none">
            {/* Render 3 sets for a completely seamless looping experience */}
            {[...TESTIMONIALS.slice(0, 3), ...TESTIMONIALS.slice(0, 3), ...TESTIMONIALS.slice(0, 3)].map((t, idx) => (
              <TestimonialCard
                key={`r1-${idx}`}
                name={t.name}
                review={t.review}
                rating={t.rating}
                isHighlighted={t.isHighlighted}
                avatarUrl={`https://i.pravatar.cc/150?img=${(idx % 3) + 12}`}
              />
            ))}
          </div>
        </div>

        {/* Row 2 (slides right) */}
        <div className="flex w-full overflow-hidden relative">
          <div className="flex gap-6 animate-scroll-right w-max py-2 select-none">
            {[...TESTIMONIALS.slice(3, 6), ...TESTIMONIALS.slice(3, 6), ...TESTIMONIALS.slice(3, 6)].map((t, idx) => (
              <TestimonialCard
                key={`r2-${idx}`}
                name={t.name}
                review={t.review}
                rating={t.rating}
                isHighlighted={t.isHighlighted}
                avatarUrl={`https://i.pravatar.cc/150?img=${(idx % 3) + 33}`}
              />
            ))}
          </div>
        </div>

        {/* Central button "GET STARTED" */}
        <div className="flex justify-center mt-10">
          <Link
            to="/register"
            className="px-10 py-3.5 bg-[#023337] hover:bg-ocean-green text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md hover:shadow-lg transition-all"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );

  // ════════════════════════════════════════════════════════════════
  // RENDER: PROFILE
  // ════════════════════════════════════════════════════════════════
  const renderProfile = () => (
    <section className="max-w-5xl mx-auto px-6 py-16 space-y-16 text-left">
      <div className="space-y-4 text-center">
        <span className="px-3 py-1 bg-aqua-spring text-ocean-green text-xs font-bold uppercase tracking-wider rounded-full">
          🏢 Profil Perusahaan
        </span>
        <h2 className="text-4xl font-extrabold text-cyprus tracking-tight">Tentang Apotek Sehat Pekanbaru</h2>
        <p className="text-sm text-gray-400 max-w-xl mx-auto">
          Kami berdedikasi untuk memberikan layanan farmasi modern berkualitas tinggi dan terpercaya untuk seluruh keluarga Indonesia.
        </p>
      </div>

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
            Menyediakan obat-obatan asli 100% dengan rantai distribusi yang aman, memberikan konsultasi medis edukatif oleh apoteker ahli, serta menghadirkan kemudahan transaksi melalui teknologi digital.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-2xl font-bold text-cyprus text-center">Tim Apoteker Profesional Kami</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { initials: "AS", name: "apt. Ahmad Siregar, S.Farm.", role: "Kepala Apoteker Utama",    desc: "Berpengalaman lebih dari 12 tahun di bidang farmasi klinis dan manajemen apotek modern." },
            { initials: "RI", name: "apt. Riana Indah, M.Farm.",  role: "Spesialis Informasi Obat", desc: "Ahli dalam pelayanan kefarmasian rawat jalan dan konsultasi obat-obatan penyakit kronis." },
            { initials: "DK", name: "dr. Dodi Kurniawan, Sp.FK",  role: "Konsultan Farmakologi",    desc: "Membantu pengawasan formulasi obat dan memastikan interaksi obat aman bagi pasien." },
          ].map(({ initials, name, role, desc }) => (
            <div key={name} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center space-y-3">
              <div className="w-20 h-20 bg-aqua-spring border border-ocean-green/20 rounded-full flex items-center justify-center mx-auto text-ocean-green font-bold text-2xl">
                {initials}
              </div>
              <div>
                <h4 className="font-bold text-cyprus">{name}</h4>
                <p className="text-xs text-gray-400">{role}</p>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // ════════════════════════════════════════════════════════════════
  // RENDER: SERVICES
  // ════════════════════════════════════════════════════════════════
  const renderServices = () => (
    <section className="max-w-5xl mx-auto px-6 py-16 space-y-16 text-left">
      <div className="space-y-4 text-center">
        <span className="px-3 py-1 bg-aqua-spring text-ocean-green text-xs font-bold uppercase tracking-wider rounded-full">
          🛠️ Layanan Kami
        </span>
        <h2 className="text-4xl font-extrabold text-cyprus tracking-tight">Layanan Kesehatan Apotek</h2>
        <p className="text-sm text-gray-400 max-w-xl mx-auto">
          Kami mengedepankan integrasi teknologi untuk menghadirkan layanan farmasi terbaik langsung ke depan pintu rumah Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { icon: <FaPills />,        title: "Penyediaan Obat & Alat Kesehatan Lengkap",  desc: "Kami menyediakan obat-obatan paten, generik, suplemen makanan, kosmetik medis, serta alat kesehatan dasar dengan jaminan keaslian produk 100%." },
          { icon: <FaStethoscope />,  title: "Konsultasi Apoteker Online",                desc: "Konsultasikan aturan pakai obat, efek samping, dan pantangan makan langsung dengan apoteker kami secara gratis melalui chat digital interaktif." },
          { icon: <FaShippingFast />, title: "Layanan Delivery Antar Obat Cepat",        desc: "Layanan pengiriman obat darurat yang bekerja sama dengan kurir internal apotek untuk menjamin obat sampai dengan suhu penyimpanan yang terjaga." },
          { icon: <FaUsers />,        title: "Cek Kesehatan Mandiri",                    desc: "Kunjungi outlet fisik kami untuk pengecekan kolesterol, kadar gula darah, asam urat, serta tensi tekanan darah secara instan dengan harga terjangkau." },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start">
            <div className="w-12 h-12 bg-aqua-spring text-ocean-green rounded-xl flex items-center justify-center text-xl flex-shrink-0">
              {icon}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-cyprus">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  // ════════════════════════════════════════════════════════════════
  // RENDER: CONTACT
  // ════════════════════════════════════════════════════════════════
  const renderContact = () => (
    <section className="max-w-5xl mx-auto px-6 py-16 space-y-16 text-left">
      <div className="space-y-4 text-center">
        <span className="px-3 py-1 bg-aqua-spring text-ocean-green text-xs font-bold uppercase tracking-wider rounded-full">
          📞 Kontak Kami
        </span>
        <h2 className="text-4xl font-extrabold text-cyprus tracking-tight">Hubungi Kami Sekarang</h2>
        <p className="text-sm text-gray-400 max-w-xl mx-auto">
          Ada pertanyaan mengenai ketersediaan obat atau paket keanggotaan member? Kami siap melayani Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
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
              <span>support@apoteksehat.com</span>
            </div>
            <div className="flex gap-3 text-sm text-gray-650 items-center">
              <FaClock className="text-ocean-green flex-shrink-0" />
              <span>Buka 24 Jam (Setiap Hari)</span>
            </div>
          </div>
          <div className="h-48 bg-aqua-spring rounded-2xl border border-ocean-green/10 flex flex-col items-center justify-center p-4 text-center shadow-inner relative overflow-hidden">
            <FaMapMarkerAlt className="text-ocean-green text-3xl mb-2 animate-bounce z-10" />
            <span className="text-xs font-bold text-cyprus z-10">Peta Outlet Pekanbaru</span>
            <span className="text-[10px] text-gray-400 z-10 mt-1">Gunakan navigasi Google Maps ke Apotek Sehat Pekanbaru</span>
          </div>
        </div>

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
              <input type="text" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-ocean-green/20"
                placeholder="Nama Anda" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
              <input type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-ocean-green/20"
                placeholder="email@contoh.com" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Pesan / Masukan</label>
              <textarea rows="4" value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-ocean-green/20 resize-none"
                placeholder="Tuliskan pertanyaan Anda di sini..." required />
            </div>
            <button type="submit" className="w-full py-2.5 bg-ocean-green hover:bg-cyprus text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer">
              Kirim Pesan
            </button>
          </form>
        </div>
      </div>
    </section>
  );

  // ════════════════════════════════════════════════════════════════
  // MAIN RETURN
  // ════════════════════════════════════════════════════════════════
  return (
    <div className="bg-[#f8faf9] min-h-screen flex flex-col">

      {/* Navbar (replaces old inline header) */}
      <LandingNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        loadingAuth={loadingAuth}
      />

      {/* Main Content */}
      <main className="flex-1 transition-all duration-300 pb-6">
        {activeTab === "home"     && renderHome()}
        {activeTab === "profile"  && renderProfile()}
        {activeTab === "services" && renderServices()}
        {activeTab === "contact"  && renderContact()}
      </main>

      {/* Footer (replaces old inline footer) */}
      <LandingFooter setActiveTab={setActiveTab} />
    </div>
  );
}
