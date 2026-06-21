import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaPaperPlane } from "react-icons/fa";
import { MdChatBubbleOutline, MdDoneAll } from "react-icons/md";

export default function LiveChatConsultation() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "pharmacist",
      text: "Halo Pak Budi, saya melihat Anda baru saja mengaktifkan Member Gold dan menebus Amlodipine 5mg. Karena Anda memiliki riwayat Hipertensi Kronis dan Alergi Amoxicillin, mohon pastikan obat dikonsumsi rutin di pagi hari dan hindari konsumsi obat golongan penisilin. Apakah ada keluhan lain?",
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
  const chatEndRef = useRef(null);

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
    
    // Simulate auto pharmacist reply after a short delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "pharmacist",
          text: "Baik Pak Budi, silakan tanyakan kembali jika ada keluhan lainnya atau ingin konsultasi obat tambahan. Kami siap melayani 24/7.",
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }, 1500);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-white border border-zinc-200 rounded-lg shadow-xs flex flex-col h-[400px] text-left">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-650 font-bold border border-zinc-200">
            RH
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900 leading-tight">apt. Rian Hidayat, S.Farm.</h4>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Online · CHAT-7721
            </p>
          </div>
        </div>
        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded">Apoteker</span>
      </div>

      {/* Message Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-zinc-50/30">
        {messages.map((msg) => {
          const isPharmacist = msg.sender === "pharmacist";
          return (
            <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isPharmacist ? "mr-auto text-left" : "ml-auto flex-row-reverse text-right"}`}>
              {isPharmacist && (
                <div className="w-6 h-6 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-650 flex-shrink-0 mt-1">
                  RH
                </div>
              )}
              <div className="space-y-1">
                <div className={`p-3.5 rounded-lg text-xs leading-relaxed ${
                  isPharmacist 
                    ? "bg-white border border-zinc-200 text-zinc-800" 
                    : "bg-zinc-900 text-white text-left font-medium"
                }`}>
                  {msg.text}
                </div>
                <div className="flex items-center justify-end gap-1 text-[9px] text-zinc-400 font-semibold px-1">
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
      <form onSubmit={sendMessage} className="p-3 border-t border-zinc-100 flex gap-2 items-center bg-white">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tulis pesan konsultasi..."
          className="flex-1 px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none placeholder-zinc-400 font-medium"
          id="chat-input-field"
        />
        <button
          type="submit"
          className="w-8 h-8 rounded-md bg-zinc-900 text-white hover:bg-zinc-800 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer shadow-xs"
        >
          <FaPaperPlane className="text-xs" />
        </button>
      </form>
    </div>
  );
}
