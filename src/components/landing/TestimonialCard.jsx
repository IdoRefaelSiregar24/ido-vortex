import { Star } from "lucide-react";

/**
 * TestimonialCard — Redesigned to match the exact design in the screenshot:
 * - Avatar on left, name and rating stars next to it.
 * - Testimonial quote text below.
 * - Soft light green background (#eaf8e7) for highlighted/selected card.
 */
export default function TestimonialCard({
  name = "Emily R.",
  review = "Fast delivery and fantastic quality! The customer support team was quick to resolve my query. Dealport has earned a loyal customer.",
  avatarUrl = "https://i.pravatar.cc/150?img=11",
  rating = 5,
  isHighlighted = false,
}) {
  return (
    <div
      className={`relative flex flex-col w-[340px] shrink-0 p-5 rounded-2xl border transition-all duration-300 select-none ${
        isHighlighted
          ? "bg-[#eaf8e7] border-transparent shadow-sm"
          : "bg-white border-gray-200 shadow-sm hover:border-[#4EA674]/30"
      }`}
    >
      {/* Top Row: Avatar, Name, Stars */}
      <div className="flex items-center gap-3 mb-3 text-left">
        <img
          src={avatarUrl}
          alt={name}
          className="w-10 h-10 rounded-lg object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/150x150/EAF8E7/4EA674?text=${name[0]}`;
          }}
        />
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-extrabold text-cyprus whitespace-nowrap">{name}</h4>
            <div className="flex items-center gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className={i < rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Text */}
      <p className="text-xs text-cyprus/80 text-left leading-relaxed font-medium">
        "{review}"
      </p>
    </div>
  );
}
