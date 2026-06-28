import React, { useState } from "react";
import PatientDataTable, { DUMMY_PATIENTS } from "../components/patient/PatientDataTable";
import AllergyBadge from "../components/patient/AllergyBadge";
import ChronicBadge, { ChronicGroup } from "../components/patient/ChronicBadge";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";

// ─── Icons ────────────────────────────────────────────────────────────────────
import { FaUsers, FaExclamationTriangle, FaPills } from "react-icons/fa";
import { MdOutlineSick, MdShield } from "react-icons/md";

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, accent = "gray", critical = false }) {
  const accentColors = {
    red: "text-red-600 bg-red-50 border-red-100",
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    green: "text-emerald-600 bg-emerald-50 border-emerald-100",
    gray: "text-gray-600 bg-gray-50 border-gray-100",
  };
  const colorClass = accentColors[accent] || accentColors.gray;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm relative overflow-hidden flex items-center justify-between text-left">
      {critical && (
        <div className="absolute inset-0 border-2 border-red-500 rounded-xl animate-pulse pointer-events-none opacity-20" />
      )}
      <div className="flex flex-col justify-between h-full">
        <span className="text-[13px] font-semibold text-gray-550">{label}</span>
        <div className="flex items-baseline gap-2 mt-2">
          <h2 className="text-3xl font-bold text-cyprus">{value}</h2>
          {sub && <span className="text-xs text-gray-400 font-medium">{sub}</span>}
        </div>
      </div>
      <div className={`w-11 h-11 rounded-xl border ${colorClass} flex items-center justify-center flex-shrink-0`}>
        <Icon className="text-xl" />
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function MedicalRecordDashboard() {
  const [selectedPatient, setSelectedPatient] = useState(null);

  const totalPatients   = DUMMY_PATIENTS.length;
  const criticalCount   = DUMMY_PATIENTS.filter((p) => p.has_critical_allergy).length;
  const allergyCount    = DUMMY_PATIENTS.filter((p) => p.active_allergens?.length > 0).length;
  const chronicCount    = DUMMY_PATIENTS.filter((p) => (p.medical_conditions?.length ?? 0) > 0 || (p.segment_names?.length ?? 0) > 0).length;

  const handleExportCSV = () => {
    // Generate CSV contents
    const headers = ["Nama Pasien", "Email", "Telepon", "Usia", "Gol. Darah", "Alergi", "Kondisi Medis"];
    const rows = DUMMY_PATIENTS.map((p) => [
      p.full_name,
      p.email,
      p.phone,
      p.age,
      p.blood_type || "-",
      p.active_allergens?.join("; ") || "-",
      p.medical_conditions?.join("; ") || "-",
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rekam_medis_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-left pb-10">
      {/* ── Page Header ── */}
      <PageHeader title="Rekam Medis Pasien" breadcrumb={["Apotek", "Rekam Medis"]}>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-ocean-green text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 hover:shadow-md transition-all cursor-pointer shadow-sm w-fit"
          id="btn-export-patient-data"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export CSV
        </button>
      </PageHeader>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Pasien" value={totalPatients} sub="terdaftar" icon={FaUsers} accent="gray" />
        <StatCard label="Alergi Kritis" value={criticalCount} sub="butuh tindakan" icon={FaExclamationTriangle} accent="red" critical={criticalCount > 0} />
        <StatCard label="Riwayat Alergi" value={allergyCount} sub="teridentifikasi" icon={MdOutlineSick} accent="amber" />
        <StatCard label="Kondisi Kronis" value={chronicCount} sub="segmen aktif" icon={MdShield} accent="blue" />
      </div>

      {/* ── Critical Alert Banner ── */}
      {criticalCount > 0 && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800 flex items-start gap-3">
          <FaExclamationTriangle className="text-red-650 text-lg flex-shrink-0 mt-0.5" />
          <div>
            <AlertTitle className="font-bold text-red-900">Perhatian: Pasien Berisiko Tinggi</AlertTitle>
            <AlertDescription className="text-xs text-red-700 font-medium mt-0.5">
              Terdapat {criticalCount} pasien dengan riwayat alergi LIFE-THREATENING. Wajib memverifikasi ulang data alergi sebelum menyerahkan atau meresepkan obat.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* ── Data Table Section ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-cyprus">Daftar Rekam Medis &amp; Pasien</h2>
            <p className="text-xs text-gray-500 mt-0.5">Klik baris untuk expand info cepat · Klik tombol mata untuk detail 360°</p>
          </div>
          <div className="hidden sm:block text-xs text-gray-400 uppercase tracking-wider font-bold">
            Total: {DUMMY_PATIENTS.length} Pasien
          </div>
        </div>

        <PatientDataTable
          patients={DUMMY_PATIENTS}
          onView={(patient) => setSelectedPatient(patient)}
          loading={false}
        />
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500 border-t border-gray-200 pt-4 font-medium">
        <span className="font-bold uppercase tracking-wider text-gray-400">Tingkat Keparahan Alergi:</span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-red-600 text-white rounded font-bold">🚨 Life-Threatening</span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-orange-500 text-white rounded font-bold">⚠️ Severe</span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-400 text-amber-900 rounded font-bold">Moderate</span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-bold border border-gray-200">Mild</span>
        <span className="ml-auto text-gray-450 font-normal">Data simulasi untuk keperluan demo &amp; testing</span>
      </div>

      {/* ── Modal Detail Pasien ── */}
      <Modal
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        title={
          selectedPatient ? (
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black ${selectedPatient.has_critical_allergy ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                {selectedPatient.full_name?.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
              </div>
              <div className="text-left">
                <h2 className="text-lg font-bold text-cyprus flex items-center gap-1.5 leading-none">
                  {selectedPatient.full_name}
                  {selectedPatient.has_critical_allergy && <span className="text-red-500 text-base animate-pulse" title="Alergi Life-Threatening">🚨</span>}
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-1">{selectedPatient.email} · {selectedPatient.phone}</p>
              </div>
            </div>
          ) : ""
        }
        size="lg"
      >
        {selectedPatient && (
          <div className="space-y-6 text-left">
            {/* Critical Alert Banner inside Modal */}
            {selectedPatient.has_critical_allergy && (
              <div className="p-3 bg-red-55/10 border border-red-200 rounded-xl text-xs text-red-800 font-semibold flex items-center gap-2">
                <FaExclamationTriangle className="text-red-600 text-base flex-shrink-0 animate-bounce" />
                <span>PERHATIAN: Pasien memiliki riwayat alergi LIFE-THREATENING. Harap lakukan verifikasi sebelum memberikan obat!</span>
              </div>
            )}

            {/* Grid Informasi Biodata */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Informasi Demografis &amp; Fisik</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  ["Tanggal Lahir", selectedPatient.date_of_birth ? new Date(selectedPatient.date_of_birth).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "—"],
                  ["Usia", `${selectedPatient.age} tahun`],
                  ["Jenis Kelamin", selectedPatient.gender === "male" ? "Laki-laki" : selectedPatient.gender === "female" ? "Perempuan" : "—"],
                  ["Golongan Darah", selectedPatient.blood_type ?? "—"],
                  ["Berat Badan", selectedPatient.weight_kg ? `${selectedPatient.weight_kg} kg` : "—"],
                  ["Tinggi Badan", selectedPatient.height_cm ? `${selectedPatient.height_cm} cm` : "—"],
                ].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{k}</p>
                    <p className="text-sm font-semibold text-cyprus">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Row Alergi & Kondisi Medis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Alergi */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Riwayat Alergi</h4>
                <div className="space-y-2">
                  {selectedPatient.allergies?.length > 0 ? (
                    selectedPatient.allergies.map((a, i) => (
                      <div key={i} className={`p-3 rounded-xl border ${a.severity === "life_threatening" ? "border-red-200 bg-red-50/50" : "border-gray-100 bg-gray-50/50"}`}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <AllergyBadge allergen={a.allergen} severity={a.severity} size="sm" />
                        </div>
                        <p className="text-xs text-gray-600 font-medium">Reaksi: <span className="text-gray-800 font-semibold">{a.reaction}</span></p>
                        <p className="text-[10px] text-gray-400 mt-1 font-mono">Didiagnosis: {a.diagnosed_date ? new Date(a.diagnosed_date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">Tidak ada riwayat alergi yang tercatat</p>
                  )}
                </div>
              </div>

              {/* Kondisi Medis & Transaksi Terakhir */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Kondisi Medis &amp; Segmen</h4>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <ChronicGroup
                      conditions={selectedPatient.medical_conditions ?? []}
                      segments={selectedPatient.segment_names?.map((n, i) => ({ name: n, color: selectedPatient.segment_colors?.[i] })) ?? []}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Transaksi Terakhir</h4>
                  {selectedPatient.last_transaction ? (
                    <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-3.5 space-y-1 text-xs">
                      <p className="font-bold text-cyprus flex items-center gap-1.5 text-sm">
                        <FaPills className="text-emerald-600" /> {selectedPatient.last_transaction.product_name}
                      </p>
                      <p className="text-gray-600 font-medium">{selectedPatient.last_transaction.quantity} {selectedPatient.last_transaction.unit}</p>
                      <p className="text-sm font-black text-emerald-700">
                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(selectedPatient.last_transaction.total_amount)}
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono">
                        Tanggal: {new Date(selectedPatient.last_transaction.transaction_date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Belum ada transaksi</p>
                  )}
                </div>
              </div>
            </div>

            {/* Catatan Khusus */}
            {selectedPatient.notes && (
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Catatan Apoteker</h4>
                <p className="text-xs text-gray-700 bg-amber-50/70 border border-amber-100 rounded-xl p-3 leading-relaxed font-medium">
                  {selectedPatient.notes}
                </p>
              </div>
            )}

            {/* Footer buttons */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="px-5 py-2 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border border-gray-200"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
