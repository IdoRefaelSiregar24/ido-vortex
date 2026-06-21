import React, { useState } from "react";
import { FaClock, FaCheckCircle, FaRegCircle } from "react-icons/fa";

export default function DoseReminder() {
  const [reminders, setReminders] = useState([
    {
      id: 1,
      medicineName: "Amlodipine 5mg",
      instruction: "1 tablet sekali sehari - Menjaga tekanan darah",
      time: "08:00 WIB (Pagi)",
      taken: false,
      notes: "Sesudah makan"
    },
    {
      id: 2,
      medicineName: "Vitamin C 1000mg",
      instruction: "1 tablet sekali sehari - Suplemen daya tahan tubuh",
      time: "12:00 WIB (Siang)",
      taken: true,
      notes: "Sesudah makan"
    }
  ]);

  const toggleDose = (id) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, taken: !r.taken } : r))
    );
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
          <FaClock className="text-zinc-650" /> Jadwal Minum Obat Hari Ini
        </h4>
        <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
          {reminders.filter((r) => r.taken).length} / {reminders.length} Selesai
        </span>
      </div>

      <div className="space-y-3 pt-1">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            onClick={() => toggleDose(reminder.id)}
            className={`border rounded-lg p-4 flex items-start justify-between gap-4 cursor-pointer transition-all ${
              reminder.taken
                ? "bg-zinc-50/50 border-zinc-200 opacity-60"
                : "bg-white border-zinc-200 hover:border-zinc-350 shadow-xs"
            }`}
          >
            <div className="space-y-1">
              <h5 className={`text-xs font-bold ${reminder.taken ? "line-through text-zinc-400" : "text-zinc-900"}`}>
                {reminder.medicineName}
              </h5>
              <p className="text-[10px] text-zinc-500 leading-snug font-medium">{reminder.instruction}</p>
              <div className="flex gap-2 items-center text-[9px] text-zinc-400 font-semibold pt-1">
                <span className="bg-zinc-100 px-1.5 py-0.2 rounded border border-zinc-200/50">{reminder.time}</span>
                <span>·</span>
                <span>{reminder.notes}</span>
              </div>
            </div>

            <button className="text-base text-zinc-800 focus:outline-none flex-shrink-0 mt-0.5">
              {reminder.taken ? (
                <FaCheckCircle className="text-zinc-800" />
              ) : (
                <FaRegCircle className="text-zinc-400 hover:text-zinc-700" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
