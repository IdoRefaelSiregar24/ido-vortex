import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdSearch, MdInfoOutline, MdWarning, MdClose, MdOutlineShoppingCart } from "react-icons/md";
import { FaPills, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { supabase } from "../../lib/supabase";
import { obatData } from "../../data";
import Modal from "../../components/Modal";
import CheckoutForm from "../../components/crm/CheckoutForm";
import RewardCard from "../../components/crm/RewardCard";

export default function MemberObat() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  
  // Cart & Checkout flow states
  const [cart, setCart] = useState([]);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("form"); // "form" | "reward"
  const [orderSummary, setOrderSummary] = useState(null);
  const [triggerMember, setTriggerMember] = useState(true);
  const [selectedObat, setSelectedObat] = useState(null);
  
  // Auth state
  const [userProfile, setUserProfile] = useState(null);
  const [patientHealthData, setPatientHealthData] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = ["Semua", "Obat Bebas", "Obat Bebas Terbatas", "Obat Keras", "Suplemen"];

  useEffect(() => {
    document.title = "Katalog Obat & Suplemen - Apotek Keluarga Pekanbaru";
  }, []);

  useEffect(() => {
    let mounted = true;
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          if (mounted) {
            setUserProfile(null);
            setPatientHealthData(null);
            setLoadingAuth(false);
          }
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        const { data: healthProfile } = await supabase
          .from("patient_health_profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .maybeSingle();

        const { data: allergies } = await supabase
          .from("patient_allergies")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("is_active", true);

        if (mounted) {
          if (profile) {
            setUserProfile(profile);
            
            const mergedHealth = {
              allergies: (allergies && allergies.length > 0)
                ? allergies.map(a => a.allergen).join(", ")
                : "Amoxicillin",
              chronicDisease: (healthProfile?.medical_conditions && healthProfile.medical_conditions.length > 0)
                ? healthProfile.medical_conditions.join(", ")
                : "Hipertensi Kronis",
              address: healthProfile?.address || "Jl. Sudirman No. 12, Pekanbaru, Riau",
              phone: profile.phone || "0812-3456-7890",
            };
            setPatientHealthData(mergedHealth);
          }
        }
      } catch (err) {
        console.error("Error loading session:", err);
      } finally {
        if (mounted) setLoadingAuth(false);
      }
    };

    checkSession();
  }, []);

  const getKategoriBadge = (kategori) => {
    switch (kategori) {
      case "Obat Bebas":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Obat Bebas Terbatas":
        return "bg-amber-50 text-amber-700 border-amber-250/55";
      case "Obat Keras":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Suplemen":
        return "bg-sky-50 text-sky-700 border-sky-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleAddToCart = (med) => {
    const existing = cart.find((item) => item.id === med.id);
    if (existing) {
      setCart(cart.filter((item) => item.id !== med.id)); // Toggle remove
    } else {
      setCart([...cart, { ...med, quantity: 1 }]);
    }
  };

  const handleCheckoutSubmit = async (data) => {
    if (userProfile) {
      // Member Checkout
      const earnedPoints = Math.round(totalCartAmount * 0.1);
      const newPoints = (userProfile.membership_points || 0) + earnedPoints;
      
      try {
        const { error } = await supabase
          .from("profiles")
          .update({ membership_points: newPoints })
          .eq("id", userProfile.id);
        
        if (!error) {
          setUserProfile({ ...userProfile, membership_points: newPoints });
        }
      } catch (err) {
        console.error("Gagal menambahkan poin member:", err);
      }
      
      setOrderSummary({
        ...data,
        isMember: true,
        pointsEarned: earnedPoints,
        newTotalPoints: newPoints
      });
    } else {
      // Guest Checkout
      setOrderSummary({
        ...data,
        isMember: false,
        pointsEarned: 0
      });
    }
    setCheckoutStep("reward");
  };

  const handleProceedToDashboard = () => {
    const isMember = !!userProfile || orderSummary?.triggerMember;
    setCheckoutModalOpen(false);
    setCart([]);
    setCheckoutStep("form");
    setOrderSummary(null);
    if (isMember) {
      navigate("/member-dashboard");
    } else {
      // For guests returning from checkout
      navigate("/member-obat");
    }
  };

  const filteredObat = obatData.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "Semua" || item.kategori === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleLogout = async () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      await supabase.auth.signOut();
      setUserProfile(null);
    }
  };

  const initials = userProfile?.full_name
    ? userProfile.full_name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "M";

  const totalCartAmount = cart.reduce((sum, item) => sum + item.harga, 0);

  return (
    <div className="bg-[#FAFBFB] min-h-screen font-inter flex flex-col justify-between">
      <div>
        {/* Universal Header (Conditionally render Home-style Header for Guests, and Member-style Header for Members) */}
        {userProfile ? (
          /* Member Logged-In Header (Matches Member Layout Theme) */
          <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3">
                <div className="w-9 h-9 bg-ocean-green rounded-xl flex items-center justify-center text-white font-black text-lg">
                  +
                </div>
                <div className="text-left">
                  <span className="font-extrabold text-cyprus tracking-tight text-sm md:text-base block leading-none">Portal Member</span>
                  <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Apotek Keluarga</span>
                </div>
              </Link>

              {/* Navigation Tabs - Desktop */}
              <nav className="hidden md:flex items-center h-full gap-1">
                <Link to="/member-dashboard" className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all">
                  Dashboard
                </Link>
                <Link to="/health-card" className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all">
                  Kartu Kesehatan
                </Link>
                <Link to="/member-obat" className="px-4 py-2 text-xs font-bold bg-gray-950 text-white shadow-sm rounded-lg transition-all">
                  Katalog Obat
                </Link>
              </nav>

              {/* Desktop Profile Details & Mobile Menu Button */}
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-black text-cyprus">{userProfile.full_name}</span>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                      {userProfile.membership_points?.toLocaleString("id-ID")} pts · {userProfile.membership_status}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-aqua-spring border border-ocean-green/20 flex items-center justify-center text-ocean-green font-bold text-xs">
                    {initials}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-650 bg-red-50 hover:bg-red-100 rounded-lg transition-all cursor-pointer"
                  >
                    <FaSignOutAlt className="text-xs" /> <span>Keluar</span>
                  </button>
                </div>

                {/* Hamburger Button (Mobile) */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 text-gray-500 hover:text-ocean-green rounded-lg hover:bg-gray-50 transition-all cursor-pointer focus:outline-none"
                  aria-label="Toggle Navigation Menu"
                >
                  {isMobileMenuOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Dropdown Menu for Member */}
            {isMobileMenuOpen && (
              <div className="md:hidden border-t border-gray-100 bg-white shadow-lg animate-fade-in absolute w-full left-0 z-45 px-6 py-5 space-y-4 text-left">
                <div className="flex flex-col gap-3 font-semibold text-gray-600">
                  <div className="pb-3 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-aqua-spring flex items-center justify-center text-ocean-green font-bold">
                      {initials}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-cyprus">{userProfile.full_name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        {userProfile.membership_points?.toLocaleString("id-ID")} Poin · Tier {userProfile.membership_status}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/member-dashboard"
                    className="py-2 border-b border-gray-50 hover:text-ocean-green transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/health-card"
                    className="py-2 border-b border-gray-50 hover:text-ocean-green transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Kartu Kesehatan
                  </Link>
                  <Link
                    to="/member-obat"
                    className="py-2 border-b border-gray-50 text-ocean-green font-bold transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Katalog Obat
                  </Link>
                  <button
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await handleLogout();
                    }}
                    className="w-full text-left py-2.5 text-red-650 font-bold text-sm transition-colors cursor-pointer"
                  >
                    Keluar dari Akun
                  </button>
                </div>
              </div>
            )}
          </header>
        ) : (
          /* Guest Out-of-Log Header (Matches LandingPage.jsx Theme and Layout exactly) */
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-ocean-green rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md shadow-ocean-green/20">
                +
              </div>
              <span className="text-xl font-extrabold text-cyprus tracking-tight">
                Apotek Keluarga
              </span>
            </Link>

            {/* Navigation Menu (Desktop) */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-500">
              <button 
                onClick={() => navigate("/", { state: { activeTab: "home" } })}
                className="hover:text-ocean-green transition-colors cursor-pointer"
              >
                Home
              </button>
              <Link 
                to="/member-obat"
                className="text-ocean-green font-bold transition-colors"
              >
                Katalog Obat
              </Link>
              <button 
                onClick={() => navigate("/", { state: { activeTab: "profile" } })}
                className="hover:text-ocean-green transition-colors cursor-pointer"
              >
                Profil Company
              </button>
              <button 
                onClick={() => navigate("/", { state: { activeTab: "services" } })}
                className="hover:text-ocean-green transition-colors cursor-pointer"
              >
                Layanan
              </button>
              <button 
                onClick={() => navigate("/", { state: { activeTab: "contact" } })}
                className="hover:text-ocean-green transition-colors cursor-pointer"
              >
                Hubungi Kami
              </button>
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden md:flex items-center gap-3">
                {!loadingAuth && (
                  <div className="flex items-center gap-3">
                    <Link to="/login" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-cyprus hover:text-ocean-green transition-colors">
                      <FaSignInAlt className="text-xs" /> Masuk
                    </Link>
                    <Link to="/register" className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-ocean-green rounded-lg hover:bg-emerald-700 transition-all shadow-sm">
                      <FaUserPlus className="text-xs" /> Daftar
                    </Link>
                  </div>
                )}
              </div>

              {/* Hamburger Button (Mobile) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-500 hover:text-ocean-green rounded-lg hover:bg-gray-50 transition-all cursor-pointer focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile Dropdown Menu for Guest */}
            {isMobileMenuOpen && (
              <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md shadow-lg animate-fade-in absolute w-full left-0 z-45 px-6 py-5 space-y-4 text-left">
                <div className="flex flex-col gap-3 font-semibold text-gray-600">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/", { state: { activeTab: "home" } });
                    }}
                    className="text-left py-2 border-b border-gray-50 hover:text-ocean-green transition-colors cursor-pointer"
                  >
                    Home
                  </button>
                  <Link
                    to="/member-obat"
                    className="py-2 border-b border-gray-50 text-ocean-green font-bold transition-colors block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Katalog Obat
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/", { state: { activeTab: "profile" } });
                    }}
                    className="text-left py-2 border-b border-gray-50 hover:text-ocean-green transition-colors cursor-pointer"
                  >
                    Profil Company
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/", { state: { activeTab: "services" } });
                    }}
                    className="text-left py-2 border-b border-gray-50 hover:text-ocean-green transition-colors cursor-pointer"
                  >
                    Layanan
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/", { state: { activeTab: "contact" } });
                    }}
                    className="text-left py-2 border-b border-gray-50 hover:text-ocean-green transition-colors cursor-pointer"
                  >
                    Hubungi Kami
                  </button>

                  <div className="pt-2 flex gap-2">
                    <Link
                      to="/login"
                      className="flex-1 text-center py-2.5 text-sm font-semibold text-cyprus hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Masuk
                    </Link>
                    <Link
                      to="/register"
                      className="flex-1 text-center py-2.5 bg-ocean-green text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Daftar
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </header>
        )}

        {/* Catalog Content Area */}
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 space-y-8 text-left">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-black text-cyprus tracking-tight">Katalog Obat &amp; Suplemen</h1>
            <p className="text-sm text-gray-500 mt-1">Cari obat, cek stok tersedia, dan tambah langsung ke keranjang belanja Anda.</p>
          </div>

          {/* Main Layout Grid (Left Sidebar + Right Products Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar: Kategori (3 Columns) */}
            <aside className="md:col-span-3 bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-5">
              <div>
                <h3 className="text-xs font-black text-zinc-450 uppercase tracking-widest pb-3 border-b border-zinc-100">Golongan Obat</h3>
                <div className="flex flex-col gap-1 mt-3">
                  {categories.map((cat) => {
                    const isActive = activeCategory === cat;
                    let icon = <span className="text-sm">💊</span>;
                    if (cat === "Semua") icon = <span className="text-sm">📦</span>;
                    else if (cat === "Obat Bebas") icon = <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-600 inline-block flex-shrink-0" />;
                    else if (cat === "Obat Bebas Terbatas") icon = <span className="w-3.5 h-3.5 rounded-full bg-blue-500 border border-blue-600 inline-block flex-shrink-0" />;
                    else if (cat === "Obat Keras") icon = <div className="w-4 h-4 rounded-full bg-red-600 border border-black flex items-center justify-center text-[9px] font-black text-black leading-none">K</div>;
                    else if (cat === "Suplemen") icon = <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-500 inline-block flex-shrink-0" />;

                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-left ${
                          isActive
                            ? "bg-zinc-950 text-white shadow-xs"
                            : "text-zinc-550 hover:bg-zinc-50 hover:text-zinc-900"
                        }`}
                      >
                        {icon}
                        <span className="truncate">{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Body Systems Category from Reference Image */}
              <div className="pt-2">
                <h3 className="text-xs font-black text-zinc-455 uppercase tracking-widest pb-3 border-b border-zinc-100">Kondisi Tubuh</h3>
                <div className="flex flex-col gap-1 mt-3">
                  {[
                    { label: "Darah & Jantung", emoji: "🩸" },
                    { label: "Hormon & Kelenjar", emoji: "🧪" },
                    { label: "Kepala & Saraf", emoji: "🧠" },
                    { label: "Kulit & Alergi", emoji: "🧴" },
                    { label: "Otot, Sendi & Tulang", emoji: "🦵" },
                    { label: "Saluran Pencernaan", emoji: "🍏" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        if (item.label.includes("Darah")) {
                          setSearch("Amlodipine");
                        } else if (item.label.includes("Pencernaan")) {
                          setSearch("Omeprazole");
                        } else {
                          setSearch("");
                        }
                        setActiveCategory("Semua");
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-550 hover:bg-zinc-50 hover:text-zinc-950 transition-all cursor-pointer text-left"
                    >
                      <span className="text-base flex-shrink-0 leading-none">{item.emoji}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Right Column: Grid and Search (9 Columns) */}
            <div className="md:col-span-9 space-y-6">
              {/* Search Bar */}
              <div className="bg-white border border-gray-250/60 rounded-2xl p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Cari nama obat atau khasiat..."
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-250/80 rounded-xl focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green outline-none transition-all placeholder-gray-400 shadow-inner"
                      id="search-obat-member"
                    />
                  </div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    Menampilkan {filteredObat.length} dari {obatData.length} item
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {filteredObat.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl py-20 text-center text-gray-400 shadow-xs">
                  <FaPills className="mx-auto text-4xl mb-3 text-gray-300" />
                  <p className="font-semibold text-sm">Obat tidak ditemukan</p>
                  <p className="text-xs text-gray-400 mt-1">Coba gunakan kata kunci pencarian atau kategori lain.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredObat.map((item) => {
                    const isObatKeras = item.kategori === "Obat Keras";
                    const isInCart = cart.some((c) => c.id === item.id);
                    
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedObat(item)}
                        className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between hover:border-gray-300 relative group"
                      >
                        {/* SCM BPOM "Obat Keras" Red Circle K Badge on top-right of image box area */}
                        {isObatKeras && (
                          <div 
                            className="absolute top-4 right-4 w-5 h-5 rounded-full bg-red-600 border border-black flex items-center justify-center text-[9px] font-black text-black leading-none shadow-sm z-10" 
                            title="Obat Keras - Harus dengan Resep Dokter"
                          >
                            K
                          </div>
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-3 pr-6">
                            <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md border ${getKategoriBadge(item.kategori)}`}>
                              {item.kategori}
                            </span>
                          </div>

                          <h3 className="font-extrabold text-cyprus group-hover:text-ocean-green transition-colors text-base line-clamp-1">{item.nama}</h3>
                          <p className="text-xs text-zinc-500 mt-1.5 line-clamp-2 leading-relaxed font-normal">{item.deskripsi}</p>
                        </div>

                        <div className="pt-4 border-t border-zinc-100 mt-5 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">Harga</span>
                            <span className="text-base font-black text-cyprus">{formatCurrency(item.harga)}</span>
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item);
                            }}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
                              isInCart
                                ? "bg-zinc-100 text-zinc-800 border-zinc-200 hover:bg-zinc-250"
                                : "bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800 shadow-sm"
                            }`}
                          >
                            {isInCart ? "Hapus" : "Tambah"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Floating Bottom Cart Panel */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-zinc-950 text-white px-6 py-4 rounded-full flex items-center gap-6 shadow-xl border border-zinc-850 animate-bounce-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-lg">
              <MdOutlineShoppingCart />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-zinc-300 block">{cart.length} obat dipilih</span>
              <span className="text-sm font-black tracking-tight">{formatCurrency(totalCartAmount)}</span>
            </div>
          </div>
          
          <button
            onClick={() => {
              setCheckoutStep("form");
              setCheckoutModalOpen(true);
            }}
            className="px-6 py-2 bg-white text-zinc-950 font-extrabold text-xs uppercase tracking-wider rounded-full hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            Checkout Sekarang
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      <Modal
        isOpen={!!selectedObat}
        onClose={() => setSelectedObat(null)}
        title={
          selectedObat ? (
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-aqua-spring border border-ocean-green/20 flex items-center justify-center text-ocean-green font-bold">
                <FaPills className="text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-cyprus leading-none">{selectedObat.nama}</h3>
                <span className={`inline-block mt-1.5 px-2.5 py-0.5 text-[9px] font-bold uppercase rounded-md border ${getKategoriBadge(selectedObat.kategori)}`}>
                  {selectedObat.kategori}
                </span>
              </div>
            </div>
          ) : ""
        }
        size="md"
      >
        {selectedObat && (
          <div className="space-y-5 text-left pt-2">
            {selectedObat.kategori === "Obat Keras" && (
              <div className="bg-red-50 border border-red-150 rounded-xl p-3.5 flex items-start gap-2.5">
                <MdWarning className="text-red-650 text-xl flex-shrink-0 mt-0.5" />
                <div className="text-xs text-red-800 font-semibold leading-relaxed">
                  <p className="font-bold text-red-900">Perhatian: Golongan Obat Keras!</p>
                  <p className="mt-0.5 font-medium">Pembelian obat ini mewajibkan penyerahan resep dokter yang sah dari klinik atau rumah sakit saat pengambilan obat.</p>
                </div>
              </div>
            )}

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Khasiat / Deskripsi</span>
              <p className="text-xs text-gray-700 font-medium leading-relaxed mt-1.5">{selectedObat.deskripsi}</p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Harga Indikasi</span>
                <span className="text-base font-black text-cyprus mt-1 block">{formatCurrency(selectedObat.harga)}</span>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Ketersediaan Stok</span>
                <span className={`text-base font-black mt-1 block ${selectedObat.stok < 100 ? "text-red-650" : "text-emerald-700"}`}>
                  {selectedObat.stok} unit
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
                <MdInfoOutline className="text-sm" /> Harga sewaktu-waktu dapat berubah.
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart(selectedObat);
                    setSelectedObat(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  {cart.some((c) => c.id === selectedObat.id) ? "Hapus dari Keranjang" : "Masukkan Keranjang"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedObat(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Checkout and Reward Wizard Modal */}
      <Modal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        title={
          checkoutStep === "form" ? (
            <div className="flex items-center gap-2 text-left">
              <span className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 font-bold text-sm">
                CO
              </span>
              <h3 className="text-base font-extrabold text-zinc-900">Checkout Transaksi Instan</h3>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-left">
              <span className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-emerald-600 font-bold text-sm">
                🎉
              </span>
              <h3 className="text-base font-extrabold text-zinc-900">Selamat! Loyalty Reward Dibuka</h3>
            </div>
          )
        }
        size="xl"
      >
        {checkoutStep === "form" ? (
          <CheckoutForm
            cartItems={cart}
            onSubmit={handleCheckoutSubmit}
            triggerMember={triggerMember}
            setTriggerMember={setTriggerMember}
            userProfile={userProfile}
            patientHealthData={patientHealthData}
          />
        ) : (
          <RewardCard
            orderData={orderSummary}
            onProceedToDashboard={handleProceedToDashboard}
          />
        )}
      </Modal>

      {/* Footer */}
      <footer className="bg-cyprus text-gray-400 border-t border-teal-950 py-8 px-6 mt-16">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-ocean-green rounded-lg flex items-center justify-center text-white text-xs font-bold">
              +
            </div>
            <span className="text-white font-bold tracking-tight">Apotek Keluarga</span>
          </div>
          <p>© 2026 Apotek Keluarga. All rights reserved. Portal Kesehatan Modern Pekanbaru.</p>
        </div>
      </footer>
    </div>
  );
}
