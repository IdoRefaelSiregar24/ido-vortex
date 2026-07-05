import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdSearch, MdInfoOutline, MdWarning, MdClose, MdOutlineShoppingCart } from "react-icons/md";
import { FaPills, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { supabase } from "../../lib/supabase";
import { obatData } from "../../data";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import Modal from "../../components/Modal";
import CheckoutForm from "../../components/crm/CheckoutForm";
import RewardCard from "../../components/crm/RewardCard";

const getProductImage = (item) => {
  const name = item.nama.toLowerCase();
  if (name.includes("paracetamol")) {
    return "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&h=300&q=80";
  }
  if (name.includes("amoxicillin") || name.includes("cetirizine") || name.includes("ibuprofen") || name.includes("candesartan")) {
    return "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=400&h=300&q=80";
  }
  if (name.includes("vitamin") || name.includes("antangin")) {
    return "https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?auto=format&fit=crop&w=400&h=300&q=80";
  }
  if (name.includes("sirup") || name.includes("cair") || name.includes("obh")) {
    return "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=400&h=300&q=80";
  }
  return "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&h=300&q=80";
};

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
    document.title = "Katalog Obat & Suplemen - Apotek Sehat Pekanbaru";
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
      // Member Checkout - Create actual database transaction
      try {
        const orderNumber = 'ORD-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
        const subtotal = totalCartAmount;
        const pointsRedeemed = data.pointsRedeemed || 0;
        const discountAmount = data.discountAmount || 0;
        const finalTotal = Math.max(0, subtotal - discountAmount);

        // 1. Create order
        const { data: newOrder, error: orderError } = await supabase
          .from("orders")
          .insert([{
            order_number: orderNumber,
            user_id: userProfile.id,
            status: 'pending',
            subtotal: subtotal,
            discount_amount: discountAmount,
            points_used: pointsRedeemed,
            total: finalTotal,
            shipping_address: data.address || "Jl. Sudirman No. 12, Pekanbaru",
            source: 'manual',
            notes: 'Checkout Instan Member'
          }])
          .select()
          .single();

        if (orderError) throw orderError;

        // 2. Fetch products to map mock SKU IDs (like OBT-002) to database UUIDs
        const { data: dbProducts, error: dbProdError } = await supabase
          .from("products")
          .select("id, sku");
        
        if (dbProdError) throw dbProdError;

        const orderItems = cart.map(item => {
          const dbProd = dbProducts?.find(p => p.sku === item.id);
          if (!dbProd) {
            throw new Error(`Obat dengan SKU ${item.id} tidak ditemukan di database.`);
          }
          return {
            order_id: newOrder.id,
            product_id: dbProd.id, // Gunakan UUID dari database
            product_name: item.nama || item.name,
            quantity: item.quantity || 1,
            unit_price: item.harga
          };
        });

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems);

        if (itemsError) throw itemsError;

        // 3. Confirm points redemption if user redeemed points
        if (pointsRedeemed > 0) {
          const { error: confirmError } = await supabase
            .rpc('confirm_redeem_points', {
              p_user_id: userProfile.id,
              p_order_id: newOrder.id,
              p_points_to_redeem: pointsRedeemed
            });
          if (confirmError) console.error("Error confirming points redeem:", confirmError.message);
        }

        // 4. Update order to completed status (triggers Tags Engine & refill reminders on database)
        const { error: updateStatusError } = await supabase
          .from("orders")
          .update({ status: 'completed' })
          .eq('id', newOrder.id);

        if (updateStatusError) throw updateStatusError;

        // 5. Earn loyalty points via Supabase RPC
        const { data: earnResult, error: earnError } = await supabase
          .rpc('earn_loyalty_points', { p_order_id: newOrder.id });

        if (earnError) console.error("Error earning loyalty points:", earnError.message);

        // 6. Fetch updated user profile points balance
        const { data: updatedProfile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userProfile.id)
          .single();

        if (!profileError && updatedProfile) {
          setUserProfile(updatedProfile);
        }

        // 7. Update local UI state
        setOrderSummary({
          ...data,
          isMember: true,
          pointsEarned: earnResult?.points_earned || Math.round(totalCartAmount * 0.01),
          newTotalPoints: updatedProfile?.membership_points || (userProfile.membership_points + (earnResult?.points_earned || 0) - pointsRedeemed)
        });

      } catch (err) {
        console.error("Gagal memproses transaksi member:", err.message);
        alert("Gagal memproses transaksi: " + err.message);
        return;
      }
    } else {
      // Guest Checkout (Fallback / mock)
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
                  <span className="text-[9px] text-zinc-400 font-extrabold tracking-wider uppercase mt-0.5">Apotek Sehat Pekanbaru</span>
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
          /* Unified LandingNavbar for Guest */
          <LandingNavbar
            activeTab="product"
            setActiveTab={() => {}}
            userProfile={userProfile}
            loadingAuth={loadingAuth}
          />
        )}

        {/* Catalog Content Area */}
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 space-y-8 text-left">
          {/* Title Area */}
          <div className="relative bg-gradient-to-r from-cyprus via-[#034040] to-ocean-green rounded-3xl p-8 md:p-10 overflow-hidden shadow-lg mb-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-10 w-40 h-40 bg-ocean-green/30 rounded-full blur-2xl translate-y-1/2 pointer-events-none" />
            <div className="relative z-10">
              <h1 className="text-4xl font-black text-white tracking-tight mb-2">Katalog Obat &amp; Suplemen</h1>
              <p className="text-sm text-emerald-50 max-w-xl leading-relaxed">Temukan obat bebas, obat keras beresep, dan suplemen kesehatan dengan mudah. Cek ketersediaan stok secara real-time dan pesan sekarang.</p>
            </div>
          </div>

          {/* Main Layout Grid (Left Sidebar + Right Products Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar: Kategori (3 Columns) */}
            <aside className="md:col-span-3 space-y-6">
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-xs font-black text-cyprus uppercase tracking-widest pb-4 border-b border-gray-100 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-ocean-green"></span> Golongan Obat
                </h3>
                <div className="flex flex-col gap-1.5">
                  {categories.map((cat) => {
                    const isActive = activeCategory === cat;
                    let icon = <span className="text-base">💊</span>;
                    if (cat === "Semua") icon = <span className="text-base">📦</span>;
                    else if (cat === "Obat Bebas") icon = <span className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-emerald-100 flex-shrink-0 shadow-sm" />;
                    else if (cat === "Obat Bebas Terbatas") icon = <span className="w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-100 flex-shrink-0 shadow-sm" />;
                    else if (cat === "Obat Keras") icon = <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-red-100 shadow-sm flex items-center justify-center text-[8px] font-black text-white leading-none">K</div>;
                    else if (cat === "Suplemen") icon = <span className="w-4 h-4 rounded-full bg-amber-400 border-2 border-amber-100 flex-shrink-0 shadow-sm" />;

                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer text-left group ${
                          isActive
                            ? "bg-cyprus text-white shadow-md shadow-cyprus/20 scale-[1.02]"
                            : "text-gray-500 hover:bg-gray-50 hover:text-cyprus"
                        }`}
                      >
                        <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</div>
                        <span className="truncate">{cat}</span>
                        {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-ocean-green" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Body Systems Category */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="text-xs font-black text-cyprus uppercase tracking-widest pb-4 border-b border-gray-100 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> Kondisi Tubuh
                </h3>
                <div className="flex flex-col gap-1.5">
                  {[
                    { label: "Darah & Jantung", emoji: "🩸", bg: "bg-red-50" },
                    { label: "Hormon & Kelenjar", emoji: "🧪", bg: "bg-purple-50" },
                    { label: "Kepala & Saraf", emoji: "🧠", bg: "bg-pink-50" },
                    { label: "Kulit & Alergi", emoji: "🧴", bg: "bg-orange-50" },
                    { label: "Otot, Sendi & Tulang", emoji: "🦵", bg: "bg-amber-50" },
                    { label: "Saluran Pencernaan", emoji: "🍏", bg: "bg-green-50" },
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
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-cyprus transition-all duration-300 cursor-pointer text-left group"
                    >
                      <span className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>{item.emoji}</span>
                      <span className="truncate group-hover:translate-x-1 transition-transform duration-300">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Right Column: Grid and Search (9 Columns) */}
            <div className="md:col-span-9 space-y-6">
              {/* Search Bar */}
              <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-ocean-green/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-ocean-green/10 transition-colors duration-500" />
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between relative z-10">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MdSearch className="text-gray-400 text-xl group-focus-within:text-ocean-green transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Cari nama obat, kandungan, atau khasiat..."
                      className="w-full pl-12 pr-4 py-3 text-sm bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-ocean-green/10 focus:border-ocean-green focus:bg-white outline-none transition-all duration-300 placeholder-gray-400 font-medium text-cyprus"
                      id="search-obat-member"
                    />
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400 font-black uppercase tracking-widest px-4 py-2 bg-gray-50 rounded-xl whitespace-nowrap border border-gray-100">
                    Menampilkan <span className="text-cyprus">{filteredObat.length}</span> dari {obatData.length} item
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {filteredObat.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-3xl py-24 text-center text-gray-400 shadow-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gray-50/50" />
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaPills className="text-4xl text-gray-300" />
                    </div>
                    <p className="font-bold text-base text-cyprus">Obat tidak ditemukan</p>
                    <p className="text-xs text-gray-500 mt-2">Coba gunakan kata kunci pencarian atau kategori lain.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredObat.map((item) => {
                    const isObatKeras = item.kategori === "Obat Keras";
                    const isInCart = cart.some((c) => c.id === item.id);
                    const sediaan = item.nama.toLowerCase().includes("cair") ? "Cair" : (item.nama.toLowerCase().includes("sirup") ? "Sirup" : "Tablet");
                    
                    const getRegulasiIndicator = (kategori) => {
                      switch (kategori) {
                        case "Obat Bebas":
                          return (
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm shadow-sm px-2.5 py-1 rounded-lg border border-emerald-100/50 z-10" title="Obat Bebas — Dapat dibeli tanpa resep dokter">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white shadow-sm inline-block flex-shrink-0" />
                              <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wide">Bebas</span>
                            </div>
                          );
                        case "Obat Bebas Terbatas":
                          return (
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm shadow-sm px-2.5 py-1 rounded-lg border border-blue-100/50 z-10" title="Obat Bebas Terbatas — Bebas dibeli dalam jumlah terbatas">
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white shadow-sm inline-block flex-shrink-0" />
                              <span className="text-[9px] font-black text-blue-700 uppercase tracking-wide">Terbatas</span>
                            </div>
                          );
                        case "Obat Keras":
                          return (
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm shadow-sm px-2.5 py-1 rounded-lg border border-red-100/50 z-10" title="Obat Keras — Harus tebus dengan resep dokter">
                              <div className="w-3.5 h-3.5 rounded-full bg-red-600 border border-white shadow-sm flex items-center justify-center text-[8px] font-black text-white leading-none flex-shrink-0">K</div>
                              <span className="text-[9px] font-black text-red-700 uppercase tracking-wide">Obat Keras</span>
                            </div>
                          );
                        default:
                          return (
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm shadow-sm px-2.5 py-1 rounded-lg border border-gray-100/50 z-10">
                              <span className="w-2.5 h-2.5 rounded-full bg-gray-400 border border-white shadow-sm inline-block flex-shrink-0" />
                              <span className="text-[9px] font-black text-gray-700 uppercase tracking-wide">{kategori}</span>
                            </div>
                          );
                      }
                    };

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedObat(item)}
                        className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:shadow-ocean-green/10 hover:border-ocean-green/30 transition-all duration-300 cursor-pointer flex flex-col justify-between relative group text-left transform hover:-translate-y-1"
                      >
                        <div>
                          {/* Image Box */}
                          <div className="w-full h-40 bg-gray-50 rounded-2xl relative overflow-hidden mb-5 transition-all duration-300">
                            {getRegulasiIndicator(item.kategori)}
                            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-cyprus text-[9px] font-black px-2 py-1 rounded-lg shadow-sm border border-gray-100/50 z-10 uppercase tracking-wide">
                              {sediaan}
                            </div>
                            <img 
                              src={getProductImage(item)} 
                              alt={item.nama}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out mix-blend-multiply"
                              loading="lazy"
                            />
                            {/* Overlay gradient on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-cyprus/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          </div>

                          {/* Drug Name */}
                          <h3 className="font-extrabold text-cyprus group-hover:text-ocean-green transition-colors text-sm line-clamp-2 leading-snug">
                            {item.nama}
                          </h3>

                          {/* Kandungan Generik / Deskripsi */}
                          <p className="text-[11px] text-gray-500 font-medium line-clamp-2 mt-2 leading-relaxed">
                            {item.deskripsi}
                          </p>
                        </div>

                        <div className="pt-4 mt-5 flex items-end justify-between border-t border-gray-50">
                          <div>
                            <span className="text-[9px] font-black text-gray-400 block uppercase tracking-widest mb-1">Harga</span>
                            <span className="text-base font-black text-[#4ea674]">{formatCurrency(item.harga)}</span>
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item);
                            }}
                            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer shadow-sm active:scale-95 flex items-center justify-center ${
                              isInCart
                                ? "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:border-red-200"
                                : isObatKeras
                                  ? "bg-cyprus text-white hover:bg-[#022528] shadow-cyprus/20 hover:shadow-md"
                                  : "bg-ocean-green text-white hover:bg-[#3d8c5e] shadow-ocean-green/20 hover:shadow-md"
                            }`}
                          >
                            {isInCart ? "Hapus" : isObatKeras ? "Tebus Resep" : "Tambah"}
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-cyprus/95 backdrop-blur-md text-white px-3 py-3 pr-4 rounded-full flex items-center gap-4 shadow-2xl shadow-cyprus/30 border border-white/10 animate-fade-in translate-y-0 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center gap-3 bg-white/10 rounded-full px-4 py-2">
            <div className="relative">
              <MdOutlineShoppingCart className="text-xl" />
              <div className="absolute -top-1.5 -right-2 bg-ocean-green text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {cart.length}
              </div>
            </div>
            <div className="text-left border-l border-white/20 pl-3">
              <span className="text-[10px] font-medium text-white/70 block uppercase tracking-wider">Total Belanja</span>
              <span className="text-sm font-black tracking-tight text-white">{formatCurrency(totalCartAmount)}</span>
            </div>
          </div>
          
          <button
            onClick={() => {
              setCheckoutStep("form");
              setCheckoutModalOpen(true);
            }}
            className="px-6 py-2.5 bg-ocean-green text-white font-extrabold text-xs uppercase tracking-wider rounded-full hover:bg-[#3d8c5e] transition-colors cursor-pointer shadow-lg shadow-ocean-green/40 flex items-center gap-2"
          >
            Checkout <span className="text-base leading-none">&rarr;</span>
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
      {userProfile ? (
        <footer className="bg-cyprus text-gray-400 border-t border-teal-950 py-8 px-6 mt-16">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-ocean-green rounded-lg flex items-center justify-center text-white text-xs font-bold">
                +
              </div>
              <span className="text-white font-bold tracking-tight">Apotek Sehat Pekanbaru</span>
            </div>
            <p>© 2026 Apotek Sehat Pekanbaru. All rights reserved. Portal Member Apotek.</p>
          </div>
        </footer>
      ) : (
        <LandingFooter setActiveTab={() => {}} />
      )}
    </div>
  );
}
