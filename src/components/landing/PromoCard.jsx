import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * PromoCard — Wide promotional banner card for best-sellers / special offers
 * @param {string}  title      - Promo title
 * @param {string}  subtitle   - Promo subtitle / description
 * @param {string}  badge      - Badge label (e.g., "PROMO SPESIAL")
 * @param {string}  ctaLabel   - Call to action button label
 * @param {string}  ctaLink    - Link for CTA
 * @param {string}  bgClass    - Tailwind background class (gradient or solid)
 * @param {string}  textColor  - Tailwind text color class
 * @param {string}  image      - Optional image URL
 * @param {boolean} tall       - Taller card variant (row-span-2)
 */
export default function PromoCard({
  title = "Promo Spesial",
  subtitle = "Dapatkan penawaran terbaik hari ini",
  badge,
  ctaLabel = "Belanja Sekarang",
  ctaLink = "/member-obat",
  bgClass = "bg-gradient-to-br from-ocean-green to-cyprus",
  textColor = "text-white",
  image,
  tall = false,
}) {
  return (
    <Link
      to={ctaLink}
      className={`relative ${tall ? "row-span-2" : ""} rounded-2xl overflow-hidden flex flex-col justify-end p-5 min-h-[160px] group cursor-pointer ${bgClass}`}
    >
      {/* Background image overlay */}
      {image && (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
          onError={(e) => { e.target.style.display = "none"; }}
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10">
        {badge && (
          <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full mb-2">
            {badge}
          </span>
        )}
        <h3 className={`font-extrabold text-sm leading-snug ${textColor}`}>
          {title}
        </h3>
        <p className={`text-xs mt-1 opacity-80 ${textColor}`}>{subtitle}</p>
        <div
          className={`mt-3 flex items-center gap-1 text-xs font-bold ${textColor} group-hover:gap-2 transition-all`}
        >
          {ctaLabel}
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
