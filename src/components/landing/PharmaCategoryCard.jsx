/**
 * PharmaCategoryCard — Category icon pill card
 * @param {React.ReactNode} icon   - Icon element
 * @param {string}          label  - Category name
 * @param {string}          bg     - Tailwind bg color class for icon bg
 * @param {string}          color  - Tailwind text color class for icon
 * @param {function}        onClick - Click handler
 */
export default function PharmaCategoryCard({ icon, label, bg = "bg-aqua-spring", color = "text-ocean-green", onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-gray-100 hover:border-ocean-green/30 hover:shadow-md hover:shadow-ocean-green/10 transition-all duration-200 group cursor-pointer min-w-[90px]"
    >
      <div
        className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-200`}
      >
        {icon}
      </div>
      <span className="text-xs font-semibold text-cyprus text-center leading-tight">
        {label}
      </span>
    </button>
  );
}
