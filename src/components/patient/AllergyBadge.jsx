import React from "react";

/**
 * AllergyBadge — Badge alergi dengan warna berdasarkan tingkat keparahan.
 * @param {string}  allergen  - Nama zat alergen (mis. "Amoxicillin")
 * @param {string}  severity  - "mild" | "moderate" | "severe" | "life_threatening"
 * @param {string}  size      - "sm" | "md" (default "md")
 * @param {boolean} showIcon  - Tampilkan ikon peringatan (default true)
 */

const SEVERITY_CONFIG = {
  life_threatening: {
    label: "LIFE-THREATENING",
    bg: "bg-red-600",
    text: "text-white",
    border: "border-red-700",
    ring: "ring-2 ring-red-400 ring-offset-1",
    dot: "bg-white animate-pulse",
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="inline-block mr-1">
        <path d="M12 2L1 21h22L12 2zm0 3.5L20.5 19.5h-17L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" />
      </svg>
    ),
  },
  severe: {
    label: "SEVERE",
    bg: "bg-orange-500",
    text: "text-white",
    border: "border-orange-600",
    ring: "",
    dot: "bg-white",
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="inline-block mr-1">
        <path d="M12 2L1 21h22L12 2zm0 3.5L20.5 19.5h-17L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" />
      </svg>
    ),
  },
  moderate: {
    label: "MODERATE",
    bg: "bg-amber-400",
    text: "text-amber-900",
    border: "border-amber-500",
    ring: "",
    dot: "bg-amber-700",
    icon: null,
  },
  mild: {
    label: "MILD",
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
    ring: "",
    dot: "bg-gray-400",
    icon: null,
  },
};

export default function AllergyBadge({ allergen, severity = "moderate", size = "md", showIcon = true }) {
  const cfg = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.moderate;

  const sizeClass = size === "sm"
    ? "text-[10px] px-1.5 py-0.5 gap-1"
    : "text-xs px-2 py-1 gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-bold rounded-sm border ${cfg.bg} ${cfg.text} ${cfg.border} ${cfg.ring} ${sizeClass}`}
      title={`Alergi ${allergen} — Tingkat keparahan: ${cfg.label}`}
    >
      {showIcon && cfg.icon}
      {!showIcon && (
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} inline-block`} />
      )}
      {allergen}
      {size !== "sm" && (
        <span className="opacity-70 font-normal">· {cfg.label}</span>
      )}
    </span>
  );
}

/**
 * AllergyGroup — Tampilkan multiple alergi sekaligus, sort by severity
 */
export function AllergyGroup({ allergies = [], maxShow = 3, size = "md" }) {
  const severityOrder = ["life_threatening", "severe", "moderate", "mild"];
  const sorted = [...allergies].sort(
    (a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
  );
  const visible = sorted.slice(0, maxShow);
  const rest = sorted.length - maxShow;

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((a, i) => (
        <AllergyBadge key={i} allergen={a.allergen} severity={a.severity} size={size} />
      ))}
      {rest > 0 && (
        <span className="text-xs text-gray-400 font-medium px-1.5 py-0.5 bg-gray-100 rounded-sm border border-gray-200">
          +{rest} lagi
        </span>
      )}
    </div>
  );
}
