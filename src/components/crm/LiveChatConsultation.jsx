import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaPaperPlane, FaUserCheck, FaUserTimes } from "react-icons/fa";
import { MdChatBubbleOutline, MdDoneAll } from "react-icons/md";
import { supabase } from "../../lib/supabase";
import Modal from "../Modal";

export default function LiveChatConsultation() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "pharmacist",
      text: "Halo Pak Budi, saya melihat Anda baru saja melakukan transaksi resep rutin. Karena Anda memiliki riwayat Hipertensi Kronis dan Alergi Amoxicillin, mohon pastikan obat dikonsumsi rutin di pagi hari dan hindari konsumsi obat golongan penisilin. Apakah ada keluhan lain?",
      time: "20:00"
    },
    {
      id: 2,
      sender: "patient",
      text: "Terima kasih apoteker. Apakah Amlodipine ini aman diminum sebelum makan?",
      time: "20:02"
    },
    {
      id: 3,
      sender: "pharmacist",
      text: "Aman Pak Budi, namun lebih disarankan diminum sesudah makan untuk mengurangi potensi ketidaknyamanan lambung. Jaga asupan garam juga ya Pak.",
      time: "20:04"
    }
  ]);
  
  const [inputText, setInputText] = useState("");
  const [patient360, setPatient360] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const chatEndRef = useRef(null);

  // Load Patient 360 Data from Supabase
  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        let targetId = null;
        if (session) {
          targetId = session.user.id;
        }

        // Query view patient_360_summary
        let query = supabase.from("patient_360_summary").select("*");
        
        if (targetId) {
          query = query.eq("user_id", targetId);
        } else {
          // Fallback to seeded Budi Santoso
          query = query.eq("email", "budi.santoso@email.com");
        }

        const { data, error } = await query.maybeSingle();

        if (!error && data) {
          setPatient360(data);
        } else {
          // If no specific row, try getting the first row in the table as seed fallback
          const { data: firstRow } = await supabase.from("patient_360_summary").select("*").limit(1).maybeSingle();
          if (firstRow) setPatient360(firstRow);
        }
      } catch (err) {
        console.error("Gagal mengambil data Patient 360 dari database:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      sender: "patient",
      text: inputText,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages([...messages, newMsg]);
    setInputText("");
    
    // Simulate pharmacist auto reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "pharmacist",
          text: "Baik Pak, silakan tanyakan kembali jika ada keluhan lainnya atau ingin konsultasi obat tambahan. Kami siap melayani 24/7.",
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }, 1500);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[400px] text-left relative w-full">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-zinc-100 flex items-center justify-between bg-white z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-700 font-extrabold text-xs">
            RH
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900 leading-tight">apt. Rian H.</h4>
            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Online
            </p>
          </div>
        </div>
        
        {/* Toggle Medical Modal Button */}
        <button 
          type="button"
          onClick={() => setShowMedicalModal(true)}
          className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-755 border border-green-250 font-bold text-[9px] rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
          title="Lihat rekam medis Patient 360° Anda"
        >
          <span>📋 Rekam Medis</span>
        </button>
      </div>

      {/* Message Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-50/20">
        {messages.map((msg) => {
          const isPharmacist = msg.sender === "pharmacist";
          return (
            <div key={msg.id} className={`flex gap-2 max-w-[85%] ${isPharmacist ? "mr-auto text-left" : "ml-auto flex-row-reverse text-right"}`}>
              {isPharmacist && (
                <div className="w-5.5 h-5.5 rounded-full bg-green-55 border border-green-100 flex items-center justify-center text-[9px] font-bold text-green-755 flex-shrink-0 mt-1">
                  RH
                </div>
              )}
              <div className="space-y-1">
                <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                  isPharmacist 
                    ? "bg-white border border-zinc-200 text-zinc-800" 
                    : "bg-zinc-900 text-white text-left font-medium shadow-2xs"
                }`}>
                  {msg.text}
                </div>
                <div className="flex items-center justify-end gap-1 text-[8px] text-zinc-400 font-semibold px-1">
                  <span>{msg.time}</span>
                  {!isPharmacist && <MdDoneAll className="text-zinc-500" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={sendMessage} className="p-2.5 border-t border-zinc-100 flex gap-2 items-center bg-white">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tulis pesan konsultasi obat..."
          className="flex-1 px-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none placeholder-zinc-400 font-semibold text-zinc-700"
          id="chat-input-field"
        />
        <button
          type="submit"
          className="w-7 h-7 rounded-md bg-zinc-900 text-white hover:bg-zinc-850 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer shadow-2xs"
        >
          <FaPaperPlane className="text-[10px]" />
        </button>
      </form>

      {/* Patient 360° Pop-up Modal */}
      <Modal
        isOpen={showMedicalModal}
        onClose={() => setShowMedicalModal(false)}
        title={
          <div className="flex items-center gap-2 text-left">
            <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block animate-pulse"></span>
            <h3 className="text-sm font-extrabold text-zinc-900">Profil Patient 360° Pasien</h3>
          </div>
        }
        size="sm"
      >
        {patient360 ? (
          <div className="space-y-4 text-xs font-semibold text-zinc-650 text-left pt-2">
            {/* Demographic Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-755 border border-zinc-200">
                {patient360.full_name ? patient360.full_name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : 'P'}
              </div>
              <div className="text-left">
                <h5 className="font-extrabold text-zinc-900 text-xs leading-none">{patient360.full_name}</h5>
                <p className="text-[10px] text-gray-405 font-bold mt-1.5">{patient360.age || '35'} tahun · {patient360.gender || 'Laki-laki'}</p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-1 bg-zinc-50 border border-zinc-250/70 p-2.5 rounded-lg text-[10px]">
              <div className="flex justify-between text-zinc-500 font-medium">
                <span>Surel:</span>
                <span className="text-zinc-850 font-bold">{patient360.email}</span>
              </div>
              <div className="flex justify-between text-zinc-500 font-medium mt-1">
                <span>No. Telepon:</span>
                <span className="text-zinc-850 font-bold">{patient360.phone || '0812-3456-7890'}</span>
              </div>
            </div>

            {/* Riwayat Alergi (Glowing Red Warning if Critical) */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Riwayat Alergi Obat</label>
              {patient360.active_allergens && patient360.active_allergens.length > 0 ? (
                <div className="space-y-1.5">
                  <div className="flex flex-wrap gap-1">
                    {patient360.active_allergens.map((allergen, idx) => {
                      const severity = patient360.allergy_severities?.[idx] || 'moderate';
                      const isCritical = severity === 'severe' || severity === 'life_threatening';
                      return (
                        <span 
                          key={idx} 
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                            isCritical 
                              ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' 
                              : 'bg-zinc-100 text-zinc-650 border-zinc-200'
                          }`}
                        >
                          {allergen} ({severity})
                        </span>
                      );
                    })}
                  </div>
                  {patient360.has_critical_allergy && (
                    <div className="p-2 bg-red-650 text-white rounded-md text-[9px] font-extrabold flex items-center justify-center gap-1 shadow-2xs uppercase tracking-wider">
                      <span>⚠ ALERGI TINGKAT TINGGI (MEMATIKAN)</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-zinc-400 font-medium italic">Tidak ada alergi terdeteksi.</p>
              )}
            </div>

            {/* Medical Conditions */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Kondisi Medis Aktif</label>
              {patient360.medical_conditions && patient360.medical_conditions.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {patient360.medical_conditions.map((cond, idx) => (
                    <span key={idx} className="bg-zinc-100 border border-zinc-200 text-zinc-800 px-2 py-0.5 rounded text-[10px] font-bold">
                      {cond}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-zinc-400 font-medium italic">Tidak ada kondisi kronis.</p>
              )}
            </div>

            {/* Automatic Segment Badges */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Tag Segmentasi CRM (Otomatis)</label>
              {patient360.segment_names && patient360.segment_names.length > 0 ? (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {patient360.segment_names.map((segName, i) => {
                    const color = patient360.segment_colors?.[i] || '#71717a';
                    return (
                      <span
                        key={segName}
                        style={{
                          backgroundColor: color + '15',
                          color: color,
                          borderColor: color + '40'
                        }}
                        className="px-2 py-0.5 rounded text-[10px] font-extrabold border"
                      >
                        {segName}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[11px] text-zinc-400 font-medium italic">Belum termasuk segmen manapun.</p>
              )}
            </div>

            {/* Doctor/Pharmacist Notes */}
            {patient360.notes && (
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Catatan Medis Tambahan</label>
                <p className="p-2.5 bg-amber-50/50 border border-amber-150 text-[10px] text-amber-850 rounded-md font-medium italic leading-relaxed">
                  "{patient360.notes}"
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 text-zinc-400 text-[11px] font-bold uppercase tracking-wider">
            {loading ? 'Memuat rekam medis...' : 'Profil medis tidak ditemukan'}
          </div>
        )}
      </Modal>

    </div>
  );
}
