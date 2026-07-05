import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Link } from "react-router-dom";

const slides = [
  {
    id: 1,
    title: "Discover the Latest Deals –",
    highlight: "Up to 50% Off!",
    ctaLabel: "Shop Now",
    ctaLink: "/member-obat",
    bg: "bg-[#023d38]", // Dark green/teal forest color from screenshot
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Proteksi Imunitas Anda –",
    highlight: "Diskon Akhir Tahun!",
    ctaLabel: "Shop Now",
    ctaLink: "/member-obat",
    bg: "bg-[#034a45]",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Layanan Farmasi Modern –",
    highlight: "Gratis Ongkir Instan!",
    ctaLabel: "Shop Now",
    ctaLink: "/member-obat",
    bg: "bg-[#045953]",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
  }
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback(
    (index) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent((index + slides.length) % slides.length);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* ── ROW 1: MAIN HERO CAROUSEL (UPPER SECTION) ────────────────── */}
      <div className={`relative w-full overflow-hidden rounded-[18px] ${slide.bg} transition-all duration-700`} style={{ minHeight: "360px" }}>
        {/* Full-width container with flex layout */}
        <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between">
          
          {/* Left Text Box */}
          <div className="flex flex-col items-start text-left pl-8 md:pl-20 pr-6 py-10 md:py-14 max-w-xl z-10">
            <h2 className="text-xl md:text-2xl lg:text-3xl text-white/90 font-medium tracking-tight">
              {slide.title}
            </h2>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-none mt-2 font-serif italic tracking-wide">
              {slide.highlight}
            </h1>
            <Link
              to={slide.ctaLink}
              className="mt-6 px-10 py-3 bg-[#eaf8e7] hover:bg-[#c1e6ba] text-cyprus text-sm font-extrabold rounded-full transition-all duration-300 shadow-sm"
            >
              {slide.ctaLabel}
            </Link>
          </div>

          {/* Right Image Box (half-width fade out style matching screenshot) */}
          <div className="hidden md:block w-[55%] h-full relative">
            <div 
              className="absolute inset-0 z-10" 
              style={{ backgroundImage: `linear-gradient(to right, ${slide.bg.includes("#") ? slide.bg.split("[")[1].split("]")[0] : "#023d38"} 0%, transparent 100%)` }}
            />
            <img
              src={slide.image}
              alt={slide.highlight}
              className="w-full h-full object-cover opacity-85"
            />
          </div>
        </div>

        {/* Carousel Arrows (white circle style from screenshot) */}
        <button
          onClick={prev}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-cyprus shadow-md transition-all cursor-pointer"
          aria-label="Sebelumnya"
        >
          <ChevronLeft size={20} className="stroke-[2.5]" />
        </button>
        <button
          onClick={next}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white hover:bg-gray-150 flex items-center justify-center text-cyprus shadow-md transition-all cursor-pointer"
          aria-label="Selanjutnya"
        >
          <ChevronRight size={20} className="stroke-[2.5]" />
        </button>
      </div>

      {/* ── ROW 2: 3-COLUMN CARD GRID ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Card 1: Lindungi Keluarga (New Year! New Fashion layout) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200/80 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div>
            <h3 className="text-base font-bold text-cyprus">Lindungi Imunitas Keluarga</h3>
            <p className="text-[10px] text-grey mt-0.5">Sedia P3K & suplemen harian di rumah</p>
          </div>
          <div className="my-4 relative overflow-hidden rounded-xl h-36 w-full">
            <img
              src="https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?auto=format&fit=crop&w=500&q=80"
              alt="Immunity"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex justify-center">
            <Link
              to="/member-obat"
              className="w-full text-center py-2.5 bg-ocean-green hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Card 2: Alat Medis Mandiri (Gaming accessories layout) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200/80 p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
            <h3 className="text-base font-bold text-cyprus">Alat Medis Mandiri</h3>
            <Link to="/member-obat" className="text-[11px] text-blue-600 font-bold hover:underline">
              See more
            </Link>
          </div>
          {/* Grid of 4 boxes with full image cover */}
          <div className="grid grid-cols-2 gap-4 my-4">
            {[
              { label: "Tensimeter", img: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=250&q=80" },
              { label: "Termometer", img: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=250&q=80" },
              { label: "Oksimeter", img: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=250&q=80" },
              { label: "Cek Darah",  img: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&w=250&q=80" },
            ].map((item) => (
              <Link
                key={item.label}
                to="/member-obat"
                className="relative bg-white border border-gray-100 rounded-xl overflow-hidden h-28 flex flex-col justify-end hover:border-ocean-green/30 hover:shadow-md transition-all group"
              >
                <img
                  src={item.img}
                  alt={item.label}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent z-10" />
                <span className="relative z-20 p-2.5 text-[10px] font-bold text-white text-left drop-shadow-sm">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Card 3: Stacked Column Banners */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Top Two Smaller Banners */}
          <div className="grid grid-cols-2 gap-4">
            {/* Banner Left (Vivid red style) */}
            <Link
              to="/member-obat"
              className="rounded-xl overflow-hidden relative h-28 bg-[#EF4343] p-4 flex flex-col justify-between text-white group shadow-sm"
            >
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-black uppercase bg-white/20 px-1.5 py-0.5 rounded w-max">Promo Medis</span>
                <p className="text-[11px] font-black leading-tight mt-1.5">Voucher Sehat 30%</p>
              </div>
              <span className="text-[9px] font-bold underline opacity-85 group-hover:opacity-100">More details</span>
            </Link>

            {/* Banner Right (Vivid blue/purple style) */}
            <Link
              to="/member-obat"
              className="rounded-xl overflow-hidden relative h-28 bg-gradient-to-br from-blue-600 to-indigo-700 p-4 flex flex-col justify-between text-white group shadow-sm"
            >
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-black uppercase bg-white/20 px-1.5 py-0.5 rounded w-max">Imunitas</span>
                <p className="text-[11px] font-black leading-tight mt-1.5">Multivitamin Booster</p>
              </div>
              <span className="text-[9px] font-bold bg-white/25 px-2 py-0.5 rounded-full w-max mt-2">Shop Now</span>
            </Link>
          </div>

          {/* Bottom Wide Banner (Product with image left/text right layout) */}
          <div className="flex-1 bg-white border border-gray-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm relative overflow-hidden min-h-[120px] group">
            <img
              src="https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=150&q=80"
              alt="Medical device"
              className="w-20 h-20 object-contain rounded-lg opacity-90 group-hover:scale-105 transition-transform"
            />
            <div className="flex-1 flex flex-col justify-between h-full text-right items-end">
              <div>
                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Remedy Kit</span>
                <h4 className="text-[11px] font-extrabold text-cyprus mt-1">Nebulizer Portable</h4>
                <p className="text-xs text-grey font-bold mt-0.5">Rp 275.000</p>
              </div>
              <Link
                to="/member-obat"
                className="mt-3 px-4 py-1.5 bg-[#eaf8e7] hover:bg-[#c1e6ba] text-cyprus text-[10px] font-extrabold rounded-full transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* ── ROW 3: FOUR BOTTOM CARDS (HORIZONTAL GRID) ────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Card 1: P3K Mandiri */}
        <Link to="/member-obat" className="relative h-32 rounded-xl overflow-hidden shadow-sm group">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img src="https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=300&q=80" alt="P3K" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 z-20 p-4 flex flex-col justify-between text-left">
            <span className="text-[9px] font-black uppercase text-[#C1E6BA] tracking-wider">P3K Mandiri</span>
            <p className="text-xs font-black text-white leading-tight">Obat Bebas & P3K</p>
          </div>
        </Link>

        {/* Card 2: Vitamin & Nutrisi */}
        <Link to="/member-obat" className="relative h-32 rounded-xl overflow-hidden shadow-sm group">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img src="https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=300&q=80" alt="Vitamin" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 z-20 p-4 flex flex-col justify-between text-left">
            <span className="text-[9px] font-black uppercase text-[#C1E6BA] tracking-wider">Vitamin & Nutrisi</span>
            <p className="text-xs font-black text-white leading-tight">Multivitamin Pilihan</p>
          </div>
        </Link>

        {/* Card 3: Ibu & Bayi */}
        <Link to="/member-obat" className="relative h-32 rounded-xl overflow-hidden shadow-sm group">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img src="https://media.suara.com/pictures/653x366/2024/11/26/86938-promo-diskon-kebutuhan-ibu-dan-anak.jpg" alt="Ibu & Bayi" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 z-20 p-4 flex flex-col justify-between text-left">
            <span className="text-[9px] font-black uppercase text-[#C1E6BA] tracking-wider">Ibu & Anak</span>
            <p className="text-xs font-black text-white leading-tight">Kebutuhan Ibu & Anak</p>
          </div>
        </Link>

        {/* Card 4: Suplemen Herbal */}
        <Link to="/member-obat" className="relative h-32 rounded-xl overflow-hidden shadow-sm group">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=300&q=80" alt="Herbal" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 z-20 p-4 flex flex-col justify-between text-left">
            <span className="text-[9px] font-black uppercase text-[#C1E6BA] tracking-wider">Herbal Alami</span>
            <p className="text-xs font-black text-white leading-tight">Suplemen Herbal Pilihan</p>
          </div>
        </Link>

      </div>

    </div>
  );
}
