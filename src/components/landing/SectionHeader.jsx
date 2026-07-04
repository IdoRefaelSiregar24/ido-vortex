import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/**
 * SectionHeader — Reusable section title component
 * @param {string} title  - Section heading text
 * @param {string} subtitle - Optional subtitle text
 * @param {string} linkTo  - Optional route to "Lihat Semua" link
 * @param {string} linkLabel - Label for the link (default: "Lihat Semua")
 */
export default function SectionHeader({
  title,
  subtitle,
  linkTo,
  linkLabel = "Lihat Semua",
}) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 className="text-dashboard font-bold text-cyprus tracking-tight leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-grey mt-0.5">{subtitle}</p>
        )}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="flex items-center gap-1 text-xs font-semibold text-ocean-green hover:text-cyprus transition-colors group"
        >
          {linkLabel}
          <ChevronRight
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      )}
    </div>
  );
}
