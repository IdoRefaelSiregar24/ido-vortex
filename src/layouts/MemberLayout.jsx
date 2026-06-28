import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation, Outlet } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ImSpinner2 } from "react-icons/im";
import { FaSignOutAlt, FaAward, FaCalendarAlt, FaPills } from "react-icons/fa";

// Helper to calculate age from birthdate
function calculateAge(birthDateStr) {
  if (!birthDateStr) return 0;
  const today = new Date();
  const birthDate = new Date(birthDateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function MemberLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    try {
      // 1. Ambil data profile dasar (termasuk membership points & status)
      const { data: profile, error: pError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (pError) throw pError;

      // 2. Ambil data profil kesehatan klinis
      const { data: healthProfile } = await supabase
        .from("patient_health_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      // 3. Ambil data alergi aktif
      const { data: allergies } = await supabase
        .from("patient_allergies")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true);

      // 4. Ambil data segmen pasien
      const { data: segments } = await supabase
        .from("patient_segment_members")
        .select(`
          segment_id,
          patient_segments (
            name,
            color
          )
        `)
        .eq("user_id", userId);

      // 5. Gabungkan data database dengan fallback data dummy Budi Santoso untuk tujuan demo
      const baseFullName = profile?.full_name || "Budi Santoso";
      const baseEmail = profile?.email || "budi.santoso@email.com";
      const basePhone = profile?.phone || "0812-3456-7890";
      
      const mergedData = {
        full_name: baseFullName,
        email: baseEmail,
        phone: basePhone,
        date_of_birth: healthProfile?.date_of_birth || "1992-03-15",
        age: healthProfile?.date_of_birth ? calculateAge(healthProfile.date_of_birth) : 34,
        gender: healthProfile?.gender || "male",
        blood_type: healthProfile?.blood_type || "B+",
        weight_kg: healthProfile?.weight_kg ? parseFloat(healthProfile.weight_kg) : 72.5,
        height_cm: healthProfile?.height_cm ? parseFloat(healthProfile.height_cm) : 170.0,
        bmi: (healthProfile?.weight_kg && healthProfile?.height_cm)
          ? Number((parseFloat(healthProfile.weight_kg) / Math.pow(parseFloat(healthProfile.height_cm) / 100, 2)).toFixed(1))
          : 25.1,
        membership_status: profile?.membership_status || "premium",
        membership_points: profile?.membership_points ?? 1250,
        medical_conditions: healthProfile?.medical_conditions || ["Hipertensi Kronis"],
        segment_names: (segments && segments.length > 0)
          ? segments.map(s => s.patient_segments?.name).filter(Boolean)
          : ["Pasien Hipertensi"],
        segment_colors: (segments && segments.length > 0)
          ? segments.map(s => s.patient_segments?.color).filter(Boolean)
          : ["#3498DB"],
        allergies: (allergies && allergies.length > 0)
          ? allergies.map(a => ({
              allergen: a.allergen,
              severity: a.severity,
              reaction: a.reaction || "Ruam kulit & gatal",
              diagnosed_date: a.diagnosed_date || "2021-04-10",
              diagnosed_by: a.diagnosed_by || "Dr. Ahmad Rifai, SpPD"
            }))
          : [
              {
                allergen: "Amoxicillin",
                severity: "severe",
                reaction: "Ruam kulit & sesak napas",
                diagnosed_date: "2021-04-10",
                diagnosed_by: "Dr. Ahmad Rifai, SpPD",
              }
            ],
        last_transaction: {
          product_name: "Amlodipine 5mg",
          quantity: 10,
          unit: "Strip",
          total_amount: 185000,
          transaction_date: "2026-06-12",
          order_id: "ORD-20260612-0047",
        },
        transaction_history: [
          { product_name: "Amlodipine 5mg", quantity: 10, unit: "Strip", total_amount: 185000, transaction_date: "2026-06-12" },
          { product_name: "Candesartan 8mg", quantity: 30, unit: "Tab", total_amount: 95000, transaction_date: "2026-05-08" },
          { product_name: "Hydrochlorothiazide", quantity: 30, unit: "Tab", total_amount: 42000, transaction_date: "2026-04-01" },
          { product_name: "Amlodipine 5mg", quantity: 10, unit: "Strip", total_amount: 185000, transaction_date: "2026-03-10" },
        ],
        emergency_contact_name: healthProfile?.emergency_contact_name || "Sari Santoso",
        emergency_contact_phone: healthProfile?.emergency_contact_phone || "0812-9999-8888",
        notes: healthProfile?.notes || "Pasien rutin kontrol tekanan darah setiap bulan. Hindari golongan penisilin dan amoxicillin.",
        joined_at: profile?.membership_joined_at || "2024-01-10",
      };

      setUser(profile);
      setPatientData(mergedData);
    } catch (err) {
      console.error("Error loading member data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login", { replace: true });
        return;
      }
      if (mounted) {
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login", { replace: true });
      } else if (mounted) {
        fetchProfile(session.user.id);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      await supabase.auth.signOut();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center gap-3">
        <ImSpinner2 className="animate-spin text-ocean-green text-4xl" />
        <span className="text-sm font-semibold text-gray-500">Memuat Member Portal...</span>
      </div>
    );
  }

  const initials = patientData?.full_name
    ? patientData.full_name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "M";

  let tierBadge = {
    premium: "bg-indigo-50 text-indigo-700 border-indigo-200",
    vip: "bg-rose-50 text-rose-700 border-rose-200",
    free: "bg-gray-50 text-gray-600 border-gray-200"
  }[patientData?.membership_status] || "bg-gray-50 text-gray-600 border-gray-200";

  return (
    <div className="bg-[#FAFBFB] min-h-screen font-inter flex flex-col">
      {/* Universal Header with Navigation Tabs */}
      <header className="bg-white border-b border-gray-250/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-ocean-green rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm">
              +
            </div>
            <div className="text-left">
              <span className="font-extrabold text-cyprus tracking-tight text-sm md:text-base block leading-none">Portal Member</span>
              <span className="text-[9px] text-zinc-400 font-extrabold tracking-wider uppercase mt-0.5">Apotek Sehat Pekanbaru</span>
            </div>
          </div>

          {/* Navigation Links (Tabs style) */}
          <nav className="hidden md:flex items-center h-full gap-1">
            {[
              { path: "/member-dashboard", label: "Dashboard" },
              { path: "/health-card", label: "Kartu Kesehatan" },
              { path: "/member-obat", label: "Katalog Obat" }
            ].map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    isActive
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          {/* User profile details & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-black text-zinc-800">{patientData?.full_name}</span>
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                {patientData?.membership_points?.toLocaleString("id-ID")} pts · <span className={`px-1.5 py-0.2 rounded border ${tierBadge}`}>{patientData?.membership_status}</span>
              </span>
            </div>
            
            <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-50 border border-emerald-200/50 flex items-center justify-center text-emerald-700 font-bold text-xs">
              {initials}
            </div>

            <div className="w-px h-6 bg-zinc-200 hidden md:block" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-650 bg-red-50 hover:bg-red-100 rounded-lg transition-all cursor-pointer shadow-2xs border border-red-200/30"
              title="Keluar dari akun"
            >
              <FaSignOutAlt className="text-xs" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden border-t border-gray-100 flex items-center justify-around py-2 px-2 bg-white">
          {[
            { path: "/member-dashboard", label: "Dashboard" },
            { path: "/health-card", label: "Kartu Kesehatan" },
            { path: "/member-obat", label: "Katalog Obat" }
          ].map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all ${
                  isActive
                    ? "bg-gray-900 text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet context={{ user, patientData, fetchProfile }} />
      </main>
    </div>
  );
}
