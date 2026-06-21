import React, { useState, useMemo } from "react";
import AllergyBadge from "./AllergyBadge";
import { ChronicGroup } from "./ChronicBadge";

// ─── DUMMY DATA untuk testing (Budi Santoso + pasien lain) ───────────────────
export const DUMMY_PATIENTS = [
  {
    profile_id: "p-001",
    user_id: "u-001",
    full_name: "Budi Santoso",
    email: "budi.santoso@email.com",
    phone: "0812-3456-7890",
    date_of_birth: "1992-03-15",
    age: 34,
    gender: "male",
    blood_type: "B+",
    weight_kg: 72.5,
    height_cm: 170.0,
    medical_conditions: ["Hipertensi Kronis"],
    active_allergens: ["Amoxicillin"],
    allergy_severities: ["severe"],
    has_critical_allergy: false,
    segment_names: ["Pasien Hipertensi"],
    segment_colors: ["#3498DB"],
    allergies: [{ allergen: "Amoxicillin", severity: "severe", reaction: "Ruam kulit & sesak napas", diagnosed_date: "2021-04-10" }],
    last_transaction: { product_name: "Amlodipine 5mg", quantity: 10, unit: "Strip", total_amount: 185000, transaction_date: "2026-06-12" },
    created_at: "2024-01-10T08:00:00Z",
  },
  {
    profile_id: "p-002",
    user_id: "u-002",
    full_name: "Siti Rahayu",
    email: "siti.rahayu@email.com",
    phone: "0813-9988-7766",
    date_of_birth: "1985-07-22",
    age: 40,
    gender: "female",
    blood_type: "O+",
    weight_kg: 58.0,
    height_cm: 155.0,
    medical_conditions: ["Diabetes Tipe 2", "Hipertensi"],
    active_allergens: ["Penisilin", "Sulfonamida"],
    allergy_severities: ["life_threatening", "moderate"],
    has_critical_allergy: true,
    segment_names: ["Pasien Diabetes", "Pasien Hipertensi"],
    segment_colors: ["#E74C3C", "#3498DB"],
    allergies: [
      { allergen: "Penisilin", severity: "life_threatening", reaction: "Anafilaksis", diagnosed_date: "2018-11-05" },
      { allergen: "Sulfonamida", severity: "moderate", reaction: "Ruam kulit", diagnosed_date: "2020-03-12" },
    ],
    last_transaction: { product_name: "Metformin 500mg", quantity: 30, unit: "Tab", total_amount: 45000, transaction_date: "2026-06-18" },
    created_at: "2023-06-15T09:30:00Z",
  },
  {
    profile_id: "p-003",
    user_id: "u-003",
    full_name: "Ahmad Fauzi",
    email: "ahmad.fauzi@email.com",
    phone: "0821-5544-3322",
    date_of_birth: "1978-11-03",
    age: 47,
    gender: "male",
    blood_type: "A+",
    weight_kg: 85.0,
    height_cm: 175.0,
    medical_conditions: ["Jantung Koroner", "Dislipidemia"],
    active_allergens: [],
    allergy_severities: [],
    has_critical_allergy: false,
    segment_names: ["Pasien Jantung", "Pasien Kolesterol"],
    segment_colors: ["#9B59B6", "#E67E22"],
    allergies: [],
    last_transaction: { product_name: "Atorvastatin 20mg", quantity: 30, unit: "Tab", total_amount: 120000, transaction_date: "2026-06-10" },
    created_at: "2023-09-20T11:00:00Z",
  },
  {
    profile_id: "p-004",
    user_id: "u-004",
    full_name: "Dewi Lestari",
    email: "dewi.lestari@email.com",
    phone: "0819-1122-3344",
    date_of_birth: "2000-05-30",
    age: 26,
    gender: "female",
    blood_type: "AB+",
    weight_kg: 52.0,
    height_cm: 158.0,
    medical_conditions: [],
    active_allergens: ["Ibuprofen"],
    allergy_severities: ["mild"],
    has_critical_allergy: false,
    segment_names: ["Ibu Hamil"],
    segment_colors: ["#E91E63"],
    allergies: [{ allergen: "Ibuprofen", severity: "mild", reaction: "Sakit perut ringan", diagnosed_date: "2023-02-14" }],
    last_transaction: { product_name: "Asam Folat 400mcg", quantity: 60, unit: "Tab", total_amount: 35000, transaction_date: "2026-06-20" },
    created_at: "2026-03-01T07:00:00Z",
  },
  {
    profile_id: "p-005",
    user_id: "u-005",
    full_name: "Hadi Kusuma",
    email: "hadi.kusuma@email.com",
    phone: "0812-7788-9900",
    date_of_birth: "1958-12-01",
    age: 67,
    gender: "male",
    blood_type: "B-",
    weight_kg: 68.0,
    height_cm: 162.0,
    medical_conditions: ["Osteoartritis", "Hipertensi", "PPOK"],
    active_allergens: ["Aspirin", "ACE Inhibitor"],
    allergy_severities: ["severe", "moderate"],
    has_critical_allergy: false,
    segment_names: ["Lansia (>60th)", "Pasien Hipertensi"],
    segment_colors: ["#607D8B", "#3498DB"],
    allergies: [
      { allergen: "Aspirin", severity: "severe", reaction: "Bronkospasme", diagnosed_date: "2015-07-20" },
      { allergen: "ACE Inhibitor", severity: "moderate", reaction: "Batuk kering persisten", diagnosed_date: "2019-01-08" },
    ],
    last_transaction: { product_name: "Candesartan 8mg", quantity: 30, unit: "Tab", total_amount: 95000, transaction_date: "2026-06-05" },
    created_at: "2022-11-15T10:00:00Z",
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
import { MdSearch, MdVisibility, MdChevronRight } from "react-icons/md";

const SortIcon = ({ dir }) => (
  <span className="text-gray-400 group-hover:text-gray-600 transition-colors ml-1 font-bold">
    {dir === "asc" && "↑"}
    {dir === "desc" && "↓"}
    {!dir && "⇅"}
  </span>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}
function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}
function getWorstSeverity(severities = []) {
  const order = ["life_threatening", "severe", "moderate", "mild"];
  return severities.find((s) => order.includes(s)) ?? null;
}

// ─── Row Detail Expand ────────────────────────────────────────────────────────
function PatientDetailRow({ patient, onClose }) {
  return (
    <tr className="bg-[#FAFBFB]">
      <td colSpan={8} className="px-6 py-5 border-t border-b border-gray-150">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-left">
          {/* Biodata */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Biodata Pasien</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {[
                ["Gender", patient.gender === "male" ? "Laki-laki" : patient.gender === "female" ? "Perempuan" : "—"],
                ["Gol. Darah", patient.blood_type ?? "—"],
                ["BB / TB", `${patient.weight_kg ?? "?"} kg / ${patient.height_cm ?? "?"} cm`],
                ["Tgl. Lahir", formatDate(patient.date_of_birth)],
                ["Telepon", patient.phone ?? "—"],
                ["Email", patient.email ?? "—"],
              ].map(([k, v]) => (
                <React.Fragment key={k}>
                  <span className="text-gray-450 font-semibold">{k}</span>
                  <span className="font-bold text-cyprus truncate">{v}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
          {/* Alergi Detail */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Detail Alergi</p>
            {patient.allergies?.length > 0 ? (
              <div className="space-y-2">
                {patient.allergies.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 bg-white border border-gray-150 rounded-xl shadow-xs">
                    <AllergyBadge allergen={a.allergen} severity={a.severity} size="sm" />
                    <span className="text-gray-650 text-[10px] leading-tight font-semibold mt-0.5">{a.reaction}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-gray-400 italic font-semibold">Tidak ada alergi tercatat</span>
            )}
          </div>
          {/* Transaksi Terakhir */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Transaksi Terakhir</p>
            {patient.last_transaction ? (
              <div className="p-3.5 bg-white border border-gray-150 rounded-xl space-y-1 shadow-xs">
                <p className="font-bold text-cyprus">{patient.last_transaction.product_name}</p>
                <p className="text-gray-500 font-semibold">{patient.last_transaction.quantity} {patient.last_transaction.unit}</p>
                <p className="text-green-700 font-bold">{formatCurrency(patient.last_transaction.total_amount)}</p>
                <p className="text-gray-455 font-mono text-[10px]">{formatDate(patient.last_transaction.transaction_date)}</p>
              </div>
            ) : (
              <span className="text-gray-400 italic font-semibold">Belum ada transaksi</span>
            )}
            {patient.emergency_contact_name && (
              <div className="mt-2.5 p-2.5 bg-red-50/50 border border-red-100 rounded-xl text-[10px] text-red-800 font-semibold">
                <span className="text-red-700 font-bold">Darurat: </span>
                {patient.emergency_contact_name} · {patient.emergency_contact_phone}
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function PatientDataTable({ patients = DUMMY_PATIENTS, onView, loading = false }) {
  const [search, setSearch]         = useState("");
  const [filterSeverity, setFilter] = useState("all"); // "all" | "critical" | "has_allergy"
  const [sortField, setSortField]   = useState("full_name");
  const [sortDir, setSortDir]       = useState("asc");
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage]             = useState(1);
  const PER_PAGE = 10;

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    let data = [...patients];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((p) =>
        p.full_name?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.phone?.includes(q) ||
        p.active_allergens?.some((a) => a.toLowerCase().includes(q)) ||
        p.medical_conditions?.some((c) => c.toLowerCase().includes(q))
      );
    }
    if (filterSeverity === "critical") data = data.filter((p) => p.has_critical_allergy);
    if (filterSeverity === "has_allergy") data = data.filter((p) => p.active_allergens?.length > 0);

    data.sort((a, b) => {
      let va = a[sortField] ?? "";
      let vb = b[sortField] ?? "";
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [patients, search, filterSeverity, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const TH = ({ label, field, className = "" }) => (
    <th
      onClick={() => field && handleSort(field)}
      className={`px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-150 ${field ? "cursor-pointer hover:text-gray-700 select-none group" : ""} ${className}`}
    >
      <span className="inline-flex items-center gap-0.5">
        {label}
        {field && <SortIcon dir={sortField === field ? sortDir : null} />}
      </span>
    </th>
  );

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm text-left">
      {/* ── Search & Filter Toolbar ── */}
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
        <div className="flex flex-wrap items-center gap-3 flex-1 max-w-2xl">
          {/* Search Query */}
          <div className="relative flex-1 min-w-[220px]">
            <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari nama, email, atau alergen..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green outline-none transition-all placeholder-gray-400 shadow-inner"
              id="patient-search"
            />
          </div>

          {/* Segment Tabs Filtering */}
          <div className="flex bg-gray-200/50 p-1 rounded-xl border border-gray-200/30">
            {[
              { value: "all",         label: "Semua" },
              { value: "critical",    label: "🚨 Life-Threat" },
              { value: "has_allergy", label: "Ada Alergi" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => { setFilter(f.value); setPage(1); }}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                  filterSeverity === f.value
                    ? "bg-white text-cyprus shadow-sm border border-gray-250/10"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
          Total: {filtered.length} Pasien
        </span>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <TH label="#" className="w-12 text-center" />
              <TH label="Nama Pasien" field="full_name" className="min-w-[180px]" />
              <TH label="Usia / Gol. Darah" className="w-36" />
              <TH label="Alergi Obat" className="min-w-[200px]" />
              <TH label="Kondisi Kronis" className="min-w-[200px]" />
              <TH label="Transaksi Terakhir" className="min-w-[180px]" />
              <TH label="Tgl. Transaksi" field="last_transaction" className="w-36" />
              <TH label="Aksi" className="w-24 text-center" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-150 bg-white font-medium text-gray-700">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-20 text-gray-500">
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5 text-ocean-green" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Memuat data pasien...
                  </span>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-20 text-gray-400">
                  Tidak ada data pasien yang cocok dengan pencarian.
                </td>
              </tr>
            ) : (
              paginated.map((patient, idx) => {
                const isCritical = patient.has_critical_allergy;
                const isExpanded = expandedId === patient.profile_id;
                const rowNum     = (page - 1) * PER_PAGE + idx + 1;

                return (
                  <React.Fragment key={patient.profile_id}>
                    <tr
                      className={`
                        group transition-colors cursor-pointer
                        ${isCritical ? "bg-red-50/20 hover:bg-red-50/40" : "hover:bg-gray-50/50"}
                        ${isExpanded ? "bg-blue-50/10" : ""}
                      `}
                      onClick={() => setExpandedId(isExpanded ? null : patient.profile_id)}
                    >
                      {/* No. */}
                      <td className="px-6 py-4 text-center text-gray-400 font-mono text-xs">
                        {rowNum}
                      </td>

                      {/* Nama */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border transition-colors ${
                            isCritical 
                              ? "bg-red-50 text-red-700 border-red-200" 
                              : "bg-aqua-spring text-ocean-green border-ocean-green/15"
                          }`}>
                            {patient.full_name?.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className={`font-semibold leading-tight ${isCritical ? "text-red-900" : "text-cyprus"}`}>
                              {isCritical && <span className="mr-1" title="Alergi Life-Threatening">🚨</span>}
                              {patient.full_name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{patient.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Usia / Gol. Darah */}
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-700">{patient.age} th</span>
                        {patient.blood_type && (
                          <span className="ml-2 text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md font-bold border border-gray-200">
                            {patient.blood_type}
                          </span>
                        )}
                      </td>

                      {/* Alergi */}
                      <td className="px-6 py-4">
                        {patient.active_allergens?.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {patient.active_allergens.map((allergen, i) => {
                              const severity = patient.allergy_severities?.[i] ?? "moderate";
                              return (
                                <AllergyBadge
                                  key={i}
                                  allergen={allergen}
                                  severity={severity}
                                  size="sm"
                                  showIcon={severity === "life_threatening" || severity === "severe"}
                                />
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-305 italic">Tidak ada</span>
                        )}
                      </td>

                      {/* Kondisi Kronis */}
                      <td className="px-6 py-4">
                        <ChronicGroup
                          conditions={patient.medical_conditions ?? []}
                          segments={patient.segment_names?.map((n, i) => ({ name: n, color: patient.segment_colors?.[i] })) ?? []}
                          maxShow={2}
                          size="sm"
                        />
                      </td>

                      {/* Transaksi Terakhir */}
                      <td className="px-6 py-4">
                        {patient.last_transaction ? (
                          <div>
                            <p className="font-semibold text-gray-800 leading-tight">{patient.last_transaction.product_name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{patient.last_transaction.quantity} {patient.last_transaction.unit} · {formatCurrency(patient.last_transaction.total_amount)}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-305 italic">—</span>
                        )}
                      </td>

                      {/* Tgl Transaksi */}
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap font-mono text-xs">
                        {patient.last_transaction ? formatDate(patient.last_transaction.transaction_date) : "—"}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); onView?.(patient); }}
                            className="p-1.5 text-indigo-650 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-lg transition-all cursor-pointer bg-white"
                            title="Lihat rekam medis 360°"
                            id={`btn-view-patient-${patient.profile_id}`}
                          >
                            <MdVisibility className="text-lg" />
                          </button>
                          <span className={`text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-90 text-gray-600" : ""}`}>
                            <MdChevronRight className="text-lg" />
                          </span>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && <PatientDetailRow patient={patient} onClose={() => setExpandedId(null)} />}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <span className="text-xs text-gray-400 font-semibold">
            Menampilkan {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} dari {filtered.length} pasien
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 text-xs rounded-lg font-bold transition-all cursor-pointer border ${p === page ? "bg-cyprus text-white border-cyprus shadow-sm" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
