import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { FaAward, FaGift, FaUserCheck, FaRocket, FaClock, FaCheckCircle } from "react-icons/fa";
import RefillAlert from "../components/member/RefillAlert";
import DoseReminder from "../components/crm/DoseReminder";
import LiveChatConsultation from "../components/crm/LiveChatConsultation";


export default function MemberDashboard() {
    const { user, fetchProfile } = useOutletContext();
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        document.title = "Dashboard Anggota - Apotek Sehat Pekanbaru";
    }, []);

    // Simulate claiming a benefit
    const claimBenefit = async (cost, rewardName) => {
        if (!user) return;
        if (user.membership_points < cost) {
            setMessage({ text: `Poin Anda tidak mencukupi untuk klaim ${rewardName}.`, type: "error" });
            return;
        }

        setActionLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const newPoints = user.membership_points - cost;
            const { error } = await supabase
                .from("profiles")
                .update({ membership_points: newPoints })
                .eq("id", user.id);

            if (error) {
                setMessage({ text: "Gagal klaim benefit: " + error.message, type: "error" });
            } else {
                setMessage({ text: `Sukses klaim ${rewardName}! ${cost} poin telah didebit.`, type: "success" });
                fetchProfile(user.id);
            }
        } catch (err) {
            setMessage({ text: "Terjadi kesalahan saat klaim.", type: "error" });
        } finally {
            setActionLoading(false);
        }
    };

    // Simulate upgrading membership
    const upgradeTier = async (newTier, pointBonus) => {
        if (!user) return;
        setActionLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const { error } = await supabase
                .from("profiles")
                .update({ 
                    membership_status: newTier,
                    membership_points: user.membership_points + pointBonus
                })
                .eq("id", user.id);

            if (error) {
                setMessage({ text: "Gagal upgrade keanggotaan: " + error.message, type: "error" });
            } else {
                setMessage({ 
                    text: `Selamat! Keanggotaan Anda telah berhasil di-upgrade menjadi ${newTier.toUpperCase()}. Poin bonus +${pointBonus} ditambahkan!`, 
                    type: "success" 
                });
                fetchProfile(user.id);
            }
        } catch (err) {
            setMessage({ text: "Terjadi kesalahan saat upgrade.", type: "error" });
        } finally {
            setActionLoading(false);
        }
    };

    const initials = user?.full_name
        ? user.full_name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
        : "M";

    let badgeColor = "bg-[#eaf8e7] text-ocean-green border border-ocean-green/20";
    let tierText = "Free Member";
    if (user?.membership_status === "premium") {
        badgeColor = "bg-indigo-50 text-indigo-700 border border-indigo-200";
        tierText = "Premium Member";
    } else if (user?.membership_status === "vip") {
        badgeColor = "bg-rose-50 text-rose-700 border border-rose-200";
        tierText = "VIP Member";
    }

    return (
        <div className="bg-[#f8faf9] min-h-screen font-lato pb-16">

            <main className="max-w-6xl mx-auto px-4 md:px-6 pt-8 space-y-8">
                {/* Welcome Hero Banner */}
                <div className="bg-gradient-to-br from-[#023337] via-[#034a45] to-[#045953] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5">
                    {/* Floating Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-ocean-green/10 rounded-full blur-3xl -translate-y-12 translate-x-12 animate-pulse"></div>
                    <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-aqua-spring/5 rounded-full blur-2xl"></div>

                    <div className="space-y-3 text-center md:text-left z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md text-aqua-spring text-xs font-bold uppercase tracking-wider rounded-full border border-white/10">
                            ✨ Portal Member Sehat
                        </span>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                            Halo, {user?.full_name}! 👋
                        </h1>
                        <p className="text-sm text-teal-150 max-w-xl">
                            Akses riwayat medis Anda, klaim reward kesehatan menarik, dan pantau pengingat resep obat rutin Anda dalam satu tempat.
                        </p>
                    </div>

                    <div className="z-10 shrink-0">
                        <span className={`inline-block px-5 py-2 font-black text-xs uppercase tracking-widest rounded-2xl shadow-md border ${badgeColor}`}>
                            ⭐ {tierText}
                        </span>
                    </div>
                </div>

                {/* Refill Alert Banner */}
                <RefillAlert 
                    medicineName="Amlodipine" 
                    message="Halo Pak Budi, jangan lupa konsumsi Amlodipine Anda hari ini untuk menjaga tekanan darah tetap stabil." 
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Panel: Stats and Benefits */}
                    <div className="lg:col-span-8 space-y-8">
                        {message.text && (
                            <div className={`p-4 text-xs font-bold rounded-2xl flex items-center shadow-sm border animate-fade-in ${
                                message.type === "success" 
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-150" 
                                    : "bg-red-50 text-red-700 border-red-150"
                            }`}>
                                <FaCheckCircle className="mr-3 text-lg flex-shrink-0" />
                                <span>{message.text}</span>
                            </div>
                        )}

                        {/* Scorecard Keanggotaan */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                            {/* Card Member (VIP-style card design) */}
                            <div className="md:col-span-7 bg-white border border-gray-150/60 p-6 rounded-3xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-aqua-spring/40 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-500"></div>
                                <div className="space-y-4 z-10">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Digital Loyalty Card</span>
                                        <span className="text-[10px] font-bold text-gray-400">ID: AK-{user?.id ? user.id.substring(0, 6).toUpperCase() : "99827"}</span>
                                    </div>
                                    <div className="flex items-center gap-4 pt-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ocean-green to-cyprus text-white flex items-center justify-center font-black text-xl shadow-md">
                                            {initials}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-lg font-black text-cyprus leading-none">{user?.full_name}</h3>
                                            <p className="text-xs text-grey font-medium mt-1">{user?.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6 flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 mt-6 z-10">
                                    <span>Bergabung Sejak:</span>
                                    <span className="font-bold text-cyprus">
                                        {user?.membership_joined_at ? new Date(user.membership_joined_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : "-"}
                                    </span>
                                </div>
                            </div>

                            {/* Card Poin (Teal-glowing accent card) */}
                            <div className="md:col-span-5 bg-gradient-to-br from-cyprus to-[#034a45] text-white p-6 rounded-3xl shadow-md flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                                <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full"></div>
                                <div className="space-y-1 text-left z-10">
                                    <span className="text-[10px] text-surf-crest font-black uppercase tracking-widest block">Loyalty Points</span>
                                    <h2 className="text-5xl font-black tracking-tight mt-1 flex items-baseline gap-1.5">
                                        {user?.membership_points.toLocaleString("id-ID")}{" "}
                                        <span className="text-sm font-bold text-surf-crest/80">pts</span>
                                    </h2>
                                </div>
                                <p className="text-[11px] text-teal-150 leading-relaxed mt-6 text-left z-10">
                                    Gunakan poin belanja obat Anda untuk ditukarkan dengan potongan harga obat atau tebus produk suplemen secara gratis.
                                </p>
                            </div>
                        </div>

                        {/* Klaim Benefit Section */}
                        <div className="space-y-4 text-left">
                            <h2 className="text-lg font-extrabold text-cyprus flex items-center gap-2">
                                <FaGift className="text-ocean-green" /> Klaim Benefit & Voucher
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Benefit 1 (Voucher Ticket style) */}
                                <div className="bg-white border border-gray-150/60 rounded-3xl p-5 shadow-xs flex items-center justify-between gap-4 relative overflow-hidden group hover:border-ocean-green/30 hover:shadow-md transition-all duration-300">
                                    {/* Ticket Cutout Left & Right */}
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-[#f8faf9] border-r border-gray-150/60 rounded-r-full"></div>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-[#f8faf9] border-l border-gray-150/60 rounded-l-full"></div>

                                    <div className="space-y-1.5 pl-3 text-left">
                                        <h3 className="font-extrabold text-cyprus text-sm leading-tight">Voucher Potongan Rp 10.000</h3>
                                        <p className="text-[10px] text-grey font-bold uppercase tracking-wider">Tukar 100 Poin</p>
                                    </div>
                                    <button
                                        onClick={() => claimBenefit(100, "Voucher Diskon Rp 10.000")}
                                        disabled={actionLoading || (user?.membership_points || 0) < 100}
                                        className="mr-3 px-4 py-2.5 bg-gradient-to-br from-ocean-green to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-100 disabled:to-gray-100 disabled:text-gray-400 text-white font-extrabold text-[11px] rounded-xl transition-all shadow-sm cursor-pointer"
                                    >
                                        Klaim
                                    </button>
                                </div>

                                {/* Benefit 2 (Voucher Ticket style) */}
                                <div className="bg-white border border-gray-150/60 rounded-3xl p-5 shadow-xs flex items-center justify-between gap-4 relative overflow-hidden group hover:border-ocean-green/30 hover:shadow-md transition-all duration-300">
                                    {/* Ticket Cutout Left & Right */}
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-[#f8faf9] border-r border-gray-150/60 rounded-r-full"></div>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-[#f8faf9] border-l border-gray-150/60 rounded-l-full"></div>

                                    <div className="space-y-1.5 pl-3 text-left">
                                        <h3 className="font-extrabold text-cyprus text-sm leading-tight">Gratis Suplemen Vitamin C</h3>
                                        <p className="text-[10px] text-grey font-bold uppercase tracking-wider">Tukar 250 Poin</p>
                                    </div>
                                    <button
                                        onClick={() => claimBenefit(250, "Gratis Suplemen Vitamin C")}
                                        disabled={actionLoading || (user?.membership_points || 0) < 250}
                                        className="mr-3 px-4 py-2.5 bg-gradient-to-br from-ocean-green to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-100 disabled:to-gray-100 disabled:text-gray-400 text-white font-extrabold text-[11px] rounded-xl transition-all shadow-sm cursor-pointer"
                                    >
                                        Klaim
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Upgrade Membership Area */}
                        {user?.membership_status !== "vip" && (
                            <div className="bg-white border border-gray-150/60 p-6 rounded-3xl shadow-sm space-y-4 text-left hover:shadow-md transition-all duration-300">
                                <h2 className="text-lg font-extrabold text-cyprus flex items-center gap-2">
                                    <FaRocket className="text-ocean-green" /> Tingkatkan Keanggotaan Member
                                </h2>
                                <p className="text-xs text-grey font-semibold leading-relaxed">
                                    Tingkatkan level akun keanggotaan Anda untuk melipatgandakan perolehan poin transaksi pada setiap pembelian, layanan jalur prioritas bebas antrean tebus obat, serta gratis biaya pengiriman instan.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-2">
                                    {user?.membership_status === "free" && (
                                        <button
                                            onClick={() => upgradeTier("premium", 200)}
                                            disabled={actionLoading}
                                            className="px-5 py-3 bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                                        >
                                            Upgrade Premium (+200 Poin Bonus)
                                        </button>
                                    )}
                                    <button
                                        onClick={() => upgradeTier("vip", 500)}
                                        disabled={actionLoading}
                                        className="px-5 py-3 bg-gradient-to-br from-rose-600 to-red-650 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs rounded-2xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                                    >
                                        Upgrade VIP (+500 Poin Bonus)
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Sidebar Widget */}
                    <div className="lg:col-span-4 space-y-6">
                        <DoseReminder />
                        <LiveChatConsultation />

                        {/* Riwayat Aktivitas singkat */}
                        <div className="space-y-4 text-left">
                            <h2 className="text-lg font-extrabold text-cyprus flex items-center gap-2">
                                <FaClock className="text-ocean-green" /> Aktivitas Member
                            </h2>
                            <div className="bg-white border border-gray-150/60 rounded-3xl divide-y divide-gray-100 shadow-sm overflow-hidden">
                                <div className="p-4 flex items-center justify-between text-xs text-gray-500">
                                    <span className="flex items-center gap-2 font-semibold text-cyprus text-left">
                                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shrink-0"></span>
                                        Bergabung di Portal Sehat Pekanbaru
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-bold shrink-0">Hari ini</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
