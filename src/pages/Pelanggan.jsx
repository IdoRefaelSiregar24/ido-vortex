import React, { useState, useEffect } from "react";
import OrderStatCard from "../components/OrderStatCard";
import CustomerOverviewChart from "../components/CustomerOverviewChart";
import CustomerTable from "../components/CustomerTable";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { supabase } from "../lib/supabase";
import { RefreshCw, Send, Users, Gift, Megaphone } from "lucide-react";

export default function Pelanggan() {
  const [customers, setCustomers] = useState([]);
  const [segments, setSegments] = useState([]);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Broadcast state
  const [selectedSegment, setSelectedSegment] = useState("");
  const [selectedPromo, setSelectedPromo] = useState("");
  const [messageTemplate, setMessageTemplate] = useState(
    "Halo {nama}, kami melihat riwayat resep obat rutin Anda di Apotek Sehat Pekanbaru. Khusus hari ini, gunakan kode promo {kode} untuk mendapatkan penawaran spesial pada tebus obat rutin Anda selanjutnya! Jaga kesehatan selalu ya."
  );
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch profiles
      const { data: profiles, error: pError } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, membership_status, membership_points");
      if (pError) throw pError;

      // 2. Fetch patient 360 summary view
      const { data: summary, error: sError } = await supabase
        .from("patient_360_summary")
        .select("*");
      if (sError) throw sError;

      // Merge profiles and medical summary
      const merged = (profiles || [])
        .filter(p => p.role === "member")
        .map(p => {
          const med = (summary || []).find(s => s.user_id === p.id) || {};
          return {
            id: p.id,
            name: p.full_name || "Pelanggan Apotek",
            email: p.email,
            phone: med.phone || "0812-3456-7890",
            membership_status: p.membership_status || "free",
            membership_points: p.membership_points || 0,
            active_allergens: med.active_allergens || [],
            segment_names: med.segment_names || [],
            segment_colors: med.segment_colors || [],
            age: med.age || 30
          };
        });
      setCustomers(merged);

      // 3. Fetch patient segments
      const { data: segData } = await supabase.from("patient_segments").select("*");
      setSegments(segData || []);

      // 4. Fetch active promos
      const { data: promoData } = await supabase.from("promos").select("*").eq("is_active", true);
      setPromos(promoData || []);

      if (segData && segData.length > 0) {
        setSelectedSegment(segData[0].name);
      }
      if (promoData && promoData.length > 0) {
        setSelectedPromo(promoData[0].code);
      }

    } catch (err) {
      console.error("Gagal memuat data pelanggan:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter targeted customers for broadcast preview
  const targetedCustomers = customers.filter(cust => {
    if (!selectedSegment) return false;
    return cust.segment_names.includes(selectedSegment);
  });

  const handleSendWA = (cust) => {
    let text = messageTemplate
      .replace(/{nama}/g, cust.name)
      .replace(/{kode}/g, selectedPromo || "HEALTHYPOIN");

    // Clean phone number format for WhatsApp web API (convert leading 0 to 62)
    let formattedPhone = cust.phone.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.substring(1);
    }

    const waUrl = `https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  const handleBroadcastAll = () => {
    if (targetedCustomers.length === 0) {
      alert("Tidak ada pelanggan yang terdaftar pada segmen ini.");
      return;
    }
    if (window.confirm(`Apakah Anda ingin mengirimkan pesan promosi ke ${targetedCustomers.length} pelanggan secara bergiliran?`)) {
      targetedCustomers.forEach((cust, idx) => {
        setTimeout(() => {
          handleSendWA(cust);
        }, idx * 1000); // 1s staggered delay to avoid browser popup blocks
      });
    }
  };

  return (
    <div className="flex flex-col space-y-6 w-full pb-10 text-left">
      
      {/* Header alert */}
      <Alert variant="default" className="bg-[#E8F5E9] border-green-200/50">
        <AlertTitle className="text-emerald-800 font-bold flex items-center gap-1.5">
          <Megaphone size={16} /> CRM Engine Status
        </AlertTitle>
        <AlertDescription className="text-emerald-700 font-semibold">
          Koneksi Supabase aktif. Otomatisasi pengelompokan segmen pasien (Tags Engine) berjalan pada tingkat database PostgreSQL.
        </AlertDescription>
      </Alert>

      {/* Stats Cards & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <OrderStatCard title="Total Member Terdaftar" value={customers.length.toString()} trendValue="+8.2%" trendDirection="up" period="Bulan ini" />
          <OrderStatCard title="Pasien Berkebutuhan Khusus" value={customers.filter(c => c.segment_names.length > 0).length.toString()} trendValue="Segmen Aktif" trendDirection="up" period="Tags Engine" />
          <OrderStatCard title="Rata-rata Poin Member" value={Math.round(customers.reduce((acc, curr) => acc + curr.membership_points, 0) / (customers.length || 1)).toString() + " pts"} trendValue="Loyalty Program" trendDirection="up" period="Rata-rata" />
        </div>
        <div className="lg:col-span-3">
          <CustomerOverviewChart />
        </div>
      </div>

      {/* Dynamic Segment Broadcast Control Panel */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="border-b border-gray-150 pb-3 mb-4 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
            <Send size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-cyprus tracking-tight">Broadcast Promo Tersegmentasi (WhatsApp)</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Mengirimkan promo personalisasi ke pasien berdasarkan kelompok riwayat medis mereka.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-450 uppercase tracking-wider block">1. Pilih Segmen Sasaran</label>
              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-green-600 outline-none font-semibold text-zinc-700 cursor-pointer"
              >
                {segments.map((seg) => (
                  <option key={seg.id} value={seg.name}>{seg.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-455 uppercase tracking-wider block">2. Pilih Voucher Promo</label>
              <select
                value={selectedPromo}
                onChange={(e) => setSelectedPromo(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-green-600 outline-none font-semibold text-zinc-700 cursor-pointer"
              >
                {promos.map((p) => (
                  <option key={p.id} value={p.code}>{p.code} - Diskon {p.discount_percentage || 5}%</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-[10px] font-bold text-gray-450 uppercase tracking-wider block">3. Template Pesan Personalisasi</label>
            <textarea
              rows="4"
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-white border border-gray-350 rounded-md focus:ring-1 focus:ring-green-600 outline-none font-medium text-zinc-700 resize-none"
              placeholder="Masukkan format pesan..."
            />
            <p className="text-[10px] text-gray-400 font-semibold mt-1">Gunakan tag variabel: <code className="bg-gray-100 px-1 py-0.5 rounded text-cyprus">{`{nama}`}</code> dan <code className="bg-gray-100 px-1 py-0.5 rounded text-cyprus">{`{kode}`}</code>.</p>
          </div>
        </div>

        {/* Targeted Preview list */}
        <div className="mt-5 border-t border-gray-100 pt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-cyprus bg-zinc-100 px-3 py-1 rounded border border-zinc-200">
              Ditemukan {targetedCustomers.length} pasien di segmen "{selectedSegment}"
            </span>
            {targetedCustomers.length > 0 && (
              <button
                onClick={handleBroadcastAll}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase rounded-md shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <Send size={12} /> Broadcast Segmen Ini
              </button>
            )}
          </div>

          {targetedCustomers.length > 0 && (
            <div className="max-h-36 overflow-y-auto border border-gray-150 rounded-lg divide-y divide-gray-100 bg-gray-50/50">
              {targetedCustomers.map((cust) => (
                <div key={cust.id} className="p-3 flex justify-between items-center text-xs">
                  <div className="text-left">
                    <span className="font-extrabold text-cyprus">{cust.name}</span>
                    <span className="text-gray-400 font-medium ml-2">({cust.phone})</span>
                  </div>
                  <button
                    onClick={() => handleSendWA(cust)}
                    className="px-2.5 py-1 bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-bold text-[10px] rounded transition-all flex items-center gap-1 cursor-pointer"
                  >
                    Kirim WA
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Customers List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm gap-3">
          <div>
            <h2 className="text-lg font-black text-cyprus">Basis Data CRM &amp; Poin Loyalitas</h2>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Daftar lengkap rekam medis segmentasi pasien otomatis</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input 
              type="text" 
              placeholder="Cari pelanggan berdasarkan nama/email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-3 pr-3 py-2 bg-gray-50 border border-gray-250/70 rounded-lg text-[12px] font-medium text-gray-700 outline-none focus:ring-1 focus:ring-green-600 text-left"
            />
            <button 
              onClick={fetchData} 
              className="p-2.5 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors shadow-sm cursor-pointer flex items-center justify-center"
              title="Refresh data"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-gray-100 p-20 text-center text-gray-500 shadow-sm">
            <RefreshCw className="animate-spin mx-auto text-4xl mb-3 text-emerald-600" />
            <p className="font-bold text-sm">Menghubungkan ke Supabase CRM Database...</p>
            <p className="text-xs text-gray-400 mt-1">Mengambil rekam medis, riwayat poin, dan status tier keanggotaan pasien.</p>
          </div>
        ) : (
          <CustomerTable customers={customers} searchQuery={searchQuery} />
        )}
      </div>

    </div>
  );
}
