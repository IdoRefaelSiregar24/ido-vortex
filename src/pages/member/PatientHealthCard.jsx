import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AllergyBadge from "../../components/patient/AllergyBadge";
import ChronicBadge, { ChronicGroup } from "../../components/patient/ChronicBadge";

// ─── Dummy data Budi Santoso ──────────────────────────────────────────────────
const PATIENT_DATA = {
  full_name:     "Budi Santoso",
  email:         "budi.santoso@email.com",
  phone:         "0812-3456-7890",
  date_of_birth: "1992-03-15",
  age:           34,
  gender:        "male",
  blood_type:    "B+",
  weight_kg:     72.5,
  height_cm:     170.0,
  bmi:           25.1,
  membership_status: "premium",
  membership_points: 1250,
  medical_conditions: ["Hipertensi Kronis"],
  segment_names: ["Pasien Hipertensi"],
  segment_colors: ["#3498DB"],
  allergies: [
    {
      allergen:       "Amoxicillin",
      severity:       "severe",
      reaction:       "Ruam kulit & sesak napas",
      diagnosed_date: "2021-04-10",
      diagnosed_by:   "Dr. Ahmad Rifai, SpPD",
    },
  ],
  last_transaction: {
    product_name:     "Amlodipine 5mg",
    quantity:         10,
    unit:             "Strip",
    total_amount:     185000,
    transaction_date: "2026-06-12",
    order_id:         "ORD-20260612-0047",
  },
  transaction_history: [
    { product_name: "Amlodipine 5mg",      quantity: 10, unit: "Strip",  total_amount: 185000, transaction_date: "2026-06-12" },
    { product_name: "Candesartan 8mg",      quantity: 30, unit: "Tab",    total_amount:  95000, transaction_date: "2026-05-08" },
    { product_name: "Hydrochlorothiazide",  quantity: 30, unit: "Tab",    total_amount:  42000, transaction_date: "2026-04-01" },
    { product_name: "Amlodipine 5mg",      quantity: 10, unit: "Strip",  total_amount: 185000, transaction_date: "2026-03-10" },
  ],
  emergency_contact_name:  "Sari Santoso",
  emergency_contact_phone: "0812-9999-8888",
  notes: "Pasien rutin kontrol tekanan darah setiap bulan. Hindari golongan penisilin dan amoxicillin.",
  joined_at: "2024-01-10",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}
function formatCurrency(v) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);
}
function bmiCategory(bmi) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-600" };
  if (bmi < 25)   return { label: "Normal",       color: "text-green-600" };
  if (bmi < 30)   return { label: "Overweight",   color: "text-amber-600" };
  return               { label: "Obesitas",        color: "text-red-600"   };
}

// ─── Shadcn-style primitives ──────────────────────────────────────────────────
const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}>{children}</div>
);
const CardHeader = ({ children, className = "" }) => (
  <div className={`px-5 py-4 border-b border-gray-100 ${className}`}>{children}</div>
);
const CardContent = ({ children, className = "" }) => (
  <div className={`px-5 py-4 ${className}`}>{children}</div>
);
const Label = ({ children }) => (
  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">{children}</p>
);
const Value = ({ children, className = "" }) => (
  <p className={`text-sm font-medium text-gray-800 ${className}`}>{children}</p>
);
const Separator = () => <hr className="border-gray-100 my-1" />;

// ─── Section Title ────────────────────────────────────────────────────────────
function SectionTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-gray-400">{icon}</span>
      <h2 className="text-xs font-bold text-gray-700 uppercase tracking-widest">{title}</h2>
    </div>
  );
}

// ─── Vital Sign Mini Card ─────────────────────────────────────────────────────
function VitalCard({ label, value, unit, note, noteColor = "text-gray-400" }) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 flex flex-col gap-0.5">
      <Label>{label}</Label>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-black text-gray-900">{value}</span>
        {unit && <span className="text-xs text-gray-400">{unit}</span>}
      </div>
      {note && <span className={`text-[10px] font-medium ${noteColor}`}>{note}</span>}
    </div>
  );
}

// ─── Timeline Item ────────────────────────────────────────────────────────────
function TimelineItem({ tx, isFirst }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${isFirst ? "bg-gray-900" : "bg-gray-200"}`} />
        <div className="w-px flex-1 bg-gray-100 mt-1" />
      </div>
      <div className="pb-4 min-w-0">
        <p className="text-xs font-semibold text-gray-800">{tx.product_name}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">
          {tx.quantity} {tx.unit} · {formatCurrency(tx.total_amount)}
        </p>
        <p className="text-[10px] text-gray-300 mt-0.5">{formatDate(tx.transaction_date)}</p>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function PatientHealthCard() {
  const navigate   = useNavigate();
  const patient    = PATIENT_DATA; // Ganti dengan fetch dari Supabase saat produksi
  const bmi        = bmiCategory(patient.bmi);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "history"

  const initials = patient.full_name
    .split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

  const tierBadge = {
    premium: { label: "Premium", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
    vip:     { label: "VIP",     bg: "bg-rose-50",   text: "text-rose-700",   border: "border-rose-200"   },
    free:    { label: "Free",    bg: "bg-gray-50",    text: "text-gray-600",   border: "border-gray-200"   },
  }[patient.membership_status] ?? { label: "Member", bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-16" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>

      {/* ── Top Nav ── */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-gray-700 transition-colors p-1 cursor-pointer"
              id="btn-back-health-card"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-sm font-semibold text-gray-700">Kartu Kesehatan Digital</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-400 transition-all cursor-pointer"
              id="btn-download-health-card"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Unduh PDF
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 pt-6 space-y-4">

        {/* ── Hero Card — Profile ── */}
        <Card className="overflow-hidden">
          {/* Accent bar top */}
          <div className="h-1 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-300" />
          <CardContent className="pt-5">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xl font-black text-gray-600">
                  {initials}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="white"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/></svg>
                </div>
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h1 className="text-lg font-black text-gray-900 leading-tight">{patient.full_name}</h1>
                    <p className="text-xs text-gray-400 mt-0.5">{patient.email}</p>
                  </div>
                  <span className={`flex-shrink-0 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border ${tierBadge.bg} ${tierBadge.text} ${tierBadge.border}`}>
                    {tierBadge.label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    Lahir {formatDate(patient.date_of_birth)}
                  </span>
                  <span>·</span>
                  <span>{patient.age} tahun</span>
                  <span>·</span>
                  <span className="font-semibold text-gray-700 px-1.5 py-0.5 bg-gray-100 rounded text-[10px] border border-gray-200">{patient.blood_type}</span>
                  <span>·</span>
                  <span>{patient.gender === "male" ? "Laki-laki" : "Perempuan"}</span>
                </div>
              </div>
            </div>

            {/* Points */}
            <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div>
                <Label>Loyalty Points</Label>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-gray-900">{patient.membership_points.toLocaleString("id-ID")}</span>
                  <span className="text-xs text-gray-400">pts</span>
                </div>
              </div>
              <div className="text-right">
                <Label>Member Sejak</Label>
                <Value className="text-xs">{formatDate(patient.joined_at)}</Value>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Allergy Alert Card ── */}
        {patient.allergies.length > 0 && (
          <div className="border border-red-200 bg-red-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-red-100 border border-red-200 rounded-lg flex items-center justify-center text-red-600">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-red-800 mb-1.5">Peringatan Alergi Obat</p>
                <div className="flex flex-wrap gap-1.5">
                  {patient.allergies.map((a, i) => (
                    <AllergyBadge key={i} allergen={a.allergen} severity={a.severity} size="md" />
                  ))}
                </div>
                <p className="text-[10px] text-red-500 mt-2">
                  Informasikan kepada apoteker setiap kali membeli obat baru.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex border-b border-gray-200">
          {[
            { key: "overview", label: "Ikhtisar Kesehatan" },
            { key: "history",  label: "Riwayat Transaksi" },
          ].map((tab) => (
            <button
              key={tab.key}
              id={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === tab.key
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════ TAB: OVERVIEW ══════════════════════ */}
        {activeTab === "overview" && (
          <div className="space-y-4">

            {/* Vital Signs */}
            <Card>
              <CardHeader>
                <SectionTitle
                  icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
                  title="Data Vital"
                />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <VitalCard label="Berat Badan"  value={patient.weight_kg} unit="kg" />
                  <VitalCard label="Tinggi Badan" value={patient.height_cm} unit="cm" />
                  <VitalCard
                    label="BMI"
                    value={patient.bmi}
                    note={bmi.label}
                    noteColor={bmi.color}
                  />
                  <VitalCard label="Gol. Darah" value={patient.blood_type} />
                </div>
              </CardContent>
            </Card>

            {/* Kondisi Medis */}
            <Card>
              <CardHeader>
                <SectionTitle
                  icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>}
                  title="Kondisi Medis & Segmen"
                />
              </CardHeader>
              <CardContent>
                <ChronicGroup
                  conditions={patient.medical_conditions}
                  segments={patient.segment_names.map((n, i) => ({ name: n, color: patient.segment_colors[i] }))}
                  maxShow={6}
                />
                {patient.notes && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <Label>Catatan Apoteker</Label>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{patient.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Riwayat Alergi Detail */}
            <Card>
              <CardHeader>
                <SectionTitle
                  icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>}
                  title="Detail Riwayat Alergi"
                />
              </CardHeader>
              <CardContent>
                {patient.allergies.map((a, i) => (
                  <div key={i} className="flex flex-col gap-2 p-3 border border-gray-100 rounded-lg">
                    <div className="flex items-center justify-between">
                      <AllergyBadge allergen={a.allergen} severity={a.severity} />
                      <span className="text-[10px] text-gray-400">{formatDate(a.diagnosed_date)}</span>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Reaksi</Label>
                        <Value className="text-xs">{a.reaction}</Value>
                      </div>
                      <div>
                        <Label>Diagnosa Oleh</Label>
                        <Value className="text-xs">{a.diagnosed_by}</Value>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Transaksi Terakhir */}
            <Card>
              <CardHeader>
                <SectionTitle
                  icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/></svg>}
                  title="Pembelian Terakhir"
                />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
                  <div>
                    <Value className="font-bold">{patient.last_transaction.product_name}</Value>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {patient.last_transaction.quantity} {patient.last_transaction.unit}
                      <span className="mx-1.5">·</span>
                      {patient.last_transaction.order_id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900">{formatCurrency(patient.last_transaction.total_amount)}</p>
                    <p className="text-[10px] text-gray-400">{formatDate(patient.last_transaction.transaction_date)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Kontak Darurat */}
            <Card>
              <CardHeader>
                <SectionTitle
                  icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>}
                  title="Kontak Darurat"
                />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Nama</Label>
                    <Value>{patient.emergency_contact_name}</Value>
                  </div>
                  <a
                    href={`tel:${patient.emergency_contact_phone.replace(/-/g, "")}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all"
                    id="btn-call-emergency"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    {patient.emergency_contact_phone}
                  </a>
                </div>
              </CardContent>
            </Card>

          </div>
        )}

        {/* ══════════════════════ TAB: HISTORY ══════════════════════ */}
        {activeTab === "history" && (
          <Card>
            <CardHeader>
              <SectionTitle
                icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 0 .5-4.5"/><polyline points="3 3 3 7 7 7"/></svg>}
                title="Riwayat Pembelian Obat"
              />
            </CardHeader>
            <CardContent>
              <div className="mt-1">
                {patient.transaction_history.map((tx, i) => (
                  <TimelineItem key={i} tx={tx} isFirst={i === 0} />
                ))}
              </div>
              <div className="mt-2 pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-[10px] text-gray-400">{patient.transaction_history.length} transaksi terakhir</span>
                <button
                  className="text-[10px] font-semibold text-gray-700 hover:underline cursor-pointer"
                  id="btn-lihat-semua-transaksi"
                >
                  Lihat semua →
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Footer Note ── */}
        <p className="text-center text-[10px] text-gray-300 pb-4">
          Kartu Kesehatan Digital · Apotek Sehat Pekanbaru · Data diperbarui secara real-time
        </p>

      </main>
    </div>
  );
}
