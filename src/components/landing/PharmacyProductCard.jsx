import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * PharmacyProductCard — E-commerce product card for Landing Page
 * @param {string}  id           - Product ID (for link)
 * @param {string}  name         - Product name
 * @param {string}  category     - Category label (e.g., "Suplemen")
 * @param {number}  price        - Current price (IDR)
 * @param {number}  originalPrice - Original price (shows strikethrough)
 * @param {number}  discount      - Discount percentage (0 = no badge)
 * @param {string}  image         - Image URL
 * @param {number}  rating        - Star rating (0–5)
 * @param {number}  sold          - Number of units sold
 * @param {boolean} isBestSeller  - Shows "Terlaris" badge
 * @param {function} onAddToCart  - Cart handler
 */
export default function PharmacyProductCard({
  id,
  name,
  category,
  price,
  originalPrice,
  discount = 0,
  image,
  rating = 5,
  sold = 0,
  isBestSeller = false,
  onAddToCart,
}) {
  const formatRp = (n) =>
    n?.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });

  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:shadow-ocean-green/10 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col min-w-[160px] max-w-[200px]">
      {/* Badges */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        {discount > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
            -{discount}%
          </span>
        )}
        {isBestSeller && (
          <span className="bg-amber-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
            🔥 Terlaris
          </span>
        )}
      </div>

      {/* Image */}
      <Link to={`/member-obat`} className="block">
        <div className="h-36 bg-aqua-spring/40 flex items-center justify-center overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/160x140/EAF8E7/4EA674?text=${encodeURIComponent(name.substring(0, 10))}`;
            }}
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <span className="text-[10px] font-semibold text-ocean-green uppercase tracking-wider">
          {category}
        </span>
        <Link to={`/member-obat`}>
          <p className="text-xs font-bold text-cyprus leading-snug line-clamp-2 hover:text-ocean-green transition-colors">
            {name}
          </p>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={10}
              className={i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
            />
          ))}
          {sold > 0 && (
            <span className="text-[10px] text-grey ml-1">{sold} terjual</span>
          )}
        </div>

        {/* Price */}
        <div className="mt-1">
          <p className="text-sm font-extrabold text-cyprus">{formatRp(price)}</p>
          {originalPrice && originalPrice > price && (
            <p className="text-[10px] text-grey line-through">{formatRp(originalPrice)}</p>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={onAddToCart}
          className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 bg-ocean-green text-white text-xs font-bold rounded-xl hover:bg-cyprus transition-colors duration-200 cursor-pointer"
        >
          <ShoppingCart size={12} />
          Tambah
        </button>
      </div>
    </div>
  );
}
