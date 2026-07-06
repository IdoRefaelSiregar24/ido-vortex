import React from "react";

/**
 * ChronicBadge — Badge kondisi kronis/segment pasien.
 * @param {string}  name    - Nama kondisi/segment (mis. "Hipertensi Kronis")
 * @param {string}  color   - HEX warna dari database (opsional)
 * @param {string}  size    - "sm" | "md"
 */

// Map nama segment ke warna preset (fallback jika color dari DB kosong)
const CONDITION_COLORS = {
  "Pasien Diabetes":    { bg: "#FEF2F2", text: "#DC2626" },
  "Pasien Hipertensi":  { bg: "#EFF6FF", text: "#2563EB" },
  "Pasien Asma":        { bg: "#FFFBEB", text: "#D97706" },
  "Pasien Jantung":     { bg: "#FAF5FF", text: "#7C3AED" },
  "Pasien Kolesterol":  { bg: "#FFF7ED", text: "#EA580C" },
  "Ibu Hamil":          { bg: "#FFF1F2", text: "#E11D48" },
  "Lansia (>60th)":     { bg: "#F8FAFC", text: "#475569" },
  "Pasien Alergi Obat": { bg: "#FFF7ED", text: "#EA580C" },
};

export default function ChronicBadge({ name, color, size = "md" }) {
  const preset = CONDITION_COLORS[name];

  let style = {};
  if (preset) {
    style = {
      backgroundColor: preset.bg,
      color: preset.text,
    };
  } else if (color) {
    // Pakai warna DB dengan opacity 7%
    style = {
      backgroundColor: color + "12",
      color: color,
    };
  } else {
    style = {
      backgroundColor: "#F1F5F9",
      color: "#475569",
    };
  }

  const sizeClass = size === "sm"
    ? "text-[10px] px-2 py-0.5"
    : "text-xs px-2.5 py-0.5";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border-none ${sizeClass}`}
      style={style}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: style.color }} />
      {name}
    </span>
  );
}

/**
 * ChronicGroup — Tampilkan multiple kondisi kronis
 */
export function ChronicGroup({ conditions = [], segments = [], maxShow = 3, size = "md" }) {
  // Gabungkan medical_conditions array string dengan segments
  const all = [
    ...conditions.map((c) => ({ name: c, color: null })),
    ...segments.map((s) => ({ name: s.name ?? s, color: s.color ?? null })),
  ];
  const unique = Array.from(new Map(all.map((x) => [x.name, x])).values());
  const visible = unique.slice(0, maxShow);
  const rest = unique.length - maxShow;

  if (unique.length === 0) {
    return <span className="text-xs text-gray-400 italic">Tidak ada kondisi tercatat</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((c, i) => (
        <ChronicBadge key={i} name={c.name} color={c.color} size={size} />
      ))}
      {rest > 0 && (
        <span className="text-[10px] text-gray-400 font-semibold px-2 py-0.5 bg-gray-50 rounded-full border border-gray-100">
          +{rest} lagi
        </span>
      )}
    </div>
  );
}
