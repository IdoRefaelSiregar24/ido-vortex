import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  MapPin,
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  ChevronDown,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

/**
 * LandingNavbar — Updated to match the design from the reference image exactly,
 * adapted to a digital pharmacy theme while preserving all functions.
 */
export default function LandingNavbar({ activeTab, setActiveTab, userProfile, loadingAuth }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSectionNav = (tabName) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { activeTab: tabName } });
    } else {
      setActiveTab(tabName);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("/member-obat");
    }
  };

  const handleSignOut = async () => {
    if (window.confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
      await supabase.auth.signOut();
    }
  };

  // Nav links matching the right-side of Row 2 in the image
  const mainNavLinks = [
    { label: "Home", tab: "home" },
    { label: "Product", to: "/member-obat" }, // Maps to Catalog
    { label: "About Us", tab: "profile" },
    { label: "Contact", tab: "contact" },
  ];

  // Pharmacy-adapted department/category links for Row 3
  const pharmaDepartments = [
    { label: "Obat Bebas", to: "/member-obat" },
    { label: "Vitamin", to: "/member-obat" },
    { label: "Suplemen", to: "/member-obat" },
    { label: "Alat Kesehatan", to: "/member-obat" },
    { label: "Ibu & Anak", to: "/member-obat" },
    { label: "Perawatan Tubuh", to: "/member-obat" },
    { label: "Herbal & Jamu", to: "/member-obat" },
    { label: "Resep Digital", to: "/member-obat" },
    { label: "BPJS Online", to: "/member-obat" },
    { label: "Peralatan Medis", to: "/member-obat" },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* Top Announcement Promo Bar */}
      <div className="w-full bg-gradient-to-r from-cyprus via-[#034a4f] to-ocean-green text-white text-center py-2 px-4 flex items-center justify-center gap-2 relative z-50 overflow-hidden shadow-sm">
        <span className="inline-block animate-bounce text-xs">🎉</span>
        <p className="text-[10px] font-black tracking-wide uppercase">
          PROMO TERBATAS: GUNAKAN KODE <span className="bg-yellow-400 text-slate-950 font-black px-2 py-0.5 rounded shadow-sm inline-block tracking-wider mx-1 animate-pulse">SEHAT30</span> UNTUK DISKON 30% DI CHECKOUT!
        </p>
      </div>

      {/* ── ROW 1: BRAND, LOCATION, LANG, SEARCH, USER, CART ──────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        
        {/* Left Side: Brand, Location, Language */}
        <div className="flex items-center gap-5">
          {/* Brand Logo "DEALPORT" style */}
          <Link
            to="/"
            onClick={() => handleSectionNav("home")}
            className="flex items-center gap-2.5 select-none shrink-0"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-ocean-green to-cyprus rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-ocean-green/20">
              +
            </div>
            <div>
              <p className="text-sm font-extrabold text-cyprus leading-none tracking-tight">
                Apotek Sehat
              </p>
              <p className="text-[10px] font-bold text-[#4EA674] leading-none tracking-wider mt-0.5 uppercase">
                Pekanbaru
              </p>
            </div>
          </Link>

          {/* Vertical Divider */}
          <div className="hidden lg:block w-px h-8 bg-gray-200" />

          {/* Location Badge */}
          <div className="hidden lg:flex items-center gap-2.5 text-left select-none">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-cyprus">
              <MapPin size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <p className="text-[10px] text-grey font-medium leading-none">Deliver to</p>
              <p className="text-xs text-cyprus font-bold leading-tight mt-0.5">
                {userProfile?.alamat ? userProfile.alamat.substring(0, 18) + "..." : "Your address"}
              </p>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden lg:block w-px h-8 bg-gray-200" />

          {/* Language Selector */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-cyprus font-semibold cursor-pointer hover:opacity-80 select-none">
            <span className="text-base leading-none">🇺🇸</span>
            <span>EN</span>
            <ChevronDown size={12} className="text-grey" />
          </div>
        </div>

        {/* Center: Search pill */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-xl hidden md:flex items-center bg-[#eaf8e7]/60 border border-[#c1e6ba]/40 rounded-full pl-5 pr-1.5 py-1 focus-within:border-ocean-green/50 focus-within:bg-[#eaf8e7]/80 transition-all"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What you're looking for"
            className="flex-1 bg-transparent text-sm text-cyprus placeholder:text-grey/60 outline-none pr-3 py-1.5"
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 bg-white text-cyprus text-xs font-bold rounded-full border border-gray-200/50 hover:bg-gray-50 shadow-sm cursor-pointer transition-colors"
          >
            <Search size={14} className="stroke-[2.5]" />
            Search
          </button>
        </form>

        {/* Right Side: User Menu & Cart */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* User Account / Dashboard Menu */}
          {!loadingAuth && (
            userProfile ? (
              <div className="flex items-center gap-2">
                <Link
                  to={userProfile.role === "member" ? "/member-dashboard" : "/dashboard"}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-50 hover:bg-aqua-spring text-cyprus hover:text-ocean-green transition-all"
                  title="Dashboard"
                >
                  <User size={18} />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-grey hover:text-red-500 transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-50 hover:bg-aqua-spring text-cyprus hover:text-ocean-green transition-all"
                title="Sign In"
              >
                <User size={18} />
              </Link>
            )
          )}

          {/* Cart Icon & Label */}
          <Link
            to="/member-obat"
            className="flex items-center gap-2 hover:text-[#4EA674] transition-colors group"
          >
            <div className="relative">
              <ShoppingCart size={18} className="text-cyprus group-hover:text-ocean-green transition-colors" />
              <span className="absolute -top-1.5 -right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </div>
            <span className="text-xs font-extrabold text-cyprus group-hover:text-ocean-green transition-colors">Cart</span>
          </Link>

          {/* Hamburger (Mobile) */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-grey hover:text-cyprus hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* ── ROW 2: MENU & NAVIGATION LINKS ───────────────────────────────── */}
      <div className="border-t border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between">
          {/* Left Navigation (Menu, Explore, Deals, Saved) */}
          <div className="flex items-center gap-4 text-xs font-semibold text-cyprus">
            <button className="flex items-center gap-2 hover:text-ocean-green transition-colors cursor-pointer">
              <Menu size={16} />
              <span>Menu</span>
            </button>
            <div className="w-px h-4 bg-gray-200" />
            <Link to="/member-obat" className="hover:text-ocean-green transition-colors">
              Explore
            </Link>
            <button
              onClick={() => {
                if (location.pathname !== "/") {
                  navigate("/", { state: { activeTab: "home", scrollTo: "membership" } });
                } else {
                  setActiveTab("home");
                  setTimeout(() => {
                    document.getElementById("membership")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }
              }}
              className="hover:text-ocean-green transition-colors cursor-pointer"
            >
              Deals
            </button>
            <Link to="/member-obat" className="hover:text-ocean-green transition-colors">
              Saved
            </Link>
          </div>

          {/* Right Navigation (Home, Product, About Us, Contact) */}
          <nav className="flex items-center gap-6 text-xs font-semibold">
            {mainNavLinks.map((link) => {
              const isActive = link.tab ? activeTab === link.tab : false;
              return link.tab ? (
                <button
                  key={link.tab}
                  onClick={() => handleSectionNav(link.tab)}
                  className={`relative py-1 cursor-pointer transition-all ${
                    isActive
                      ? "text-ocean-green font-bold after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-0.5 after:bg-ocean-green"
                      : "text-grey hover:text-cyprus"
                  }`}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`relative py-1 transition-all ${
                    location.pathname === link.to
                      ? "text-ocean-green font-bold after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-0.5 after:bg-ocean-green"
                      : "text-grey hover:text-cyprus"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── ROW 3: PHARMACY DEPARTMENTS / CATEGORIES ROW ──────────────────── */}
      <div className="border-t border-gray-100 hidden md:block bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide text-xs font-semibold text-[#3b8a60]">
          <div className="flex items-center gap-6 whitespace-nowrap">
            {pharmaDepartments.map((dept, idx) => (
              <Link
                key={idx}
                to={dept.to}
                className="hover:text-cyprus transition-colors"
              >
                {dept.label}
              </Link>
            ))}
            <Link
              to="/member-obat"
              className="text-[#6467F2] hover:text-[#6467F2]/80 transition-colors font-bold"
            >
              See more
            </Link>
          </div>
        </div>
      </div>

      {/* ── MOBILE DRAWER ────────────────────────────────────────────────── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 top-[60px] z-40 bg-black/25 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-72 h-full bg-white shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search */}
            <form onSubmit={handleSearch} className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                <Search size={15} className="text-grey" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What you're looking for"
                  className="flex-1 bg-transparent text-sm outline-none"
                />
              </div>
            </form>

            {/* Menu Items */}
            <div className="flex flex-col p-4 gap-1 flex-1 overflow-y-auto">
              {mainNavLinks.map((link) => (
                link.tab ? (
                  <button
                    key={link.tab}
                    onClick={() => { handleSectionNav(link.tab); setIsMobileOpen(false); }}
                    className={`text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                      activeTab === link.tab
                        ? "bg-aqua-spring text-ocean-green"
                        : "text-grey hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setIsMobileOpen(false)}
                    className={`text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all block ${
                      location.pathname === link.to
                        ? "bg-aqua-spring text-ocean-green font-bold"
                        : "text-grey hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <div className="h-px bg-gray-100 my-2" />
              {pharmaDepartments.map((dept, idx) => (
                <Link
                  key={idx}
                  to={dept.to}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-left px-4 py-2 text-xs font-semibold text-grey hover:bg-gray-50 rounded-lg transition-all block"
                >
                  {dept.label}
                </Link>
              ))}
            </div>

            {/* Auth CTAs */}
            <div className="p-4 border-t border-gray-100 space-y-2">
              {!loadingAuth && (
                userProfile ? (
                  <>
                    <Link
                      to={userProfile.role === "member" ? "/member-dashboard" : "/dashboard"}
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-ocean-green text-white text-sm font-bold rounded-xl hover:bg-cyprus transition-all"
                    >
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <button
                      onClick={() => { setIsMobileOpen(false); handleSignOut(); }}
                      className="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-all cursor-pointer"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileOpen(false)}
                      className="block w-full text-center py-3 text-sm font-semibold text-cyprus border border-gray-200 rounded-xl hover:border-ocean-green/50 transition-all"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileOpen(false)}
                      className="block w-full text-center py-3 text-sm font-bold text-white bg-ocean-green rounded-xl hover:bg-cyprus transition-all"
                    >
                      Daftar Gratis
                    </Link>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
