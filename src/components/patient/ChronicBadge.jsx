import React from "react";

/**
 * ChronicBadge — Badge kondisi kronis/segment pasien.
 * @param {string}  name    - Nama kondisi/segment (mis. "Hipertensi Kronis")
 * @param {string}  color   - HEX warna dari database (opsional)
 * @param {string}  size    - "sm" | "md"
 */

// Map nama segment ke warna preset (fallback jika color dari DB kosong)
const CONDITION_COLORS = {
  "Pasien Diabetes":    { bg: "#FEF2F2", text: "#991B1B", border: "#FECACA" },
  "Pasien Hipertensi":  { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  "Pasien Asma":        { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
  "Pasien Jantung":     { bg: "#FAF5FF", text: "#6D28D9", border: "#DDD6FE" },
  "Pasien Kolesterol":  { bg: "#FFF7ED", text: "#9A3412", border: "#FDBA74" },
  "Ibu Hamil":          { bg: "#FFF0F6", text: "#9D174D", border: "#FBCFE8" },
  "Lansia (>60th)":     { bg: "#F8FAFC", text: "#475569", border: "#CBD5E1" },
  "Pasien Alergi Obat": { bg: "#FFF7F0", text: "#C2410C", border: "#FED7AA" },
};

// Ikononya sendiri (inline SVG mini)
const CONDITION_ICONS = {
  "Pasien Diabetes":    "🩸",
  "Pasien Hipertensi":  "💊",
  "Pasien Asma":        "🫁",
  "Pasien Jantung":     "❤️",
  "Pasien Kolesterol":  "📈",
  "Ibu Hamil":          "🤰",
  "Lansia (>60th)":     "👴",
  "Pasien Alergi Obat": "⚠️",
};

export default function ChronicBadge({ name, color, size = "md" }) {
  const preset = CONDITION_COLORS[name];

  let style = {};
  if (preset) {
    style = {
      backgroundColor: preset.bg,
      color: preset.text,
      borderColor: preset.border,
    };
  } else if (color) {
    // Pakai warna DB dengan opacity
    style = {
      backgroundColor: color + "18",
      color: color,
      borderColor: color + "40",
    };
  } else {
    style = {
      backgroundColor: "#F1F5F9",
      color: "#475569",
      borderColor: "#CBD5E1",
    };
  }

  const icon = CONDITION_ICONS[name] ?? "🏥";

  const sizeClass = size === "sm"
    ? "text-[10px] px-1.5 py-0.5"
    : "text-xs px-2 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-sm border ${sizeClass}`}
      style={style}
    >
      <span className="text-[10px] leading-none">{icon}</span>
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
    <div className="flex flex-wrap gap-1">
      {visible.map((c, i) => (
        <ChronicBadge key={i} name={c.name} color={c.color} size={size} />
      ))}
      {rest > 0 && (
        <span className="text-xs text-gray-400 font-medium px-1.5 py-0.5 bg-gray-100 rounded-sm border border-gray-200">
          +{rest} lagi
        </span>
      )}
    </div>
  );
}
