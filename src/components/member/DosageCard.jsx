import React, { useState } from "react";
import { Clock, CheckCircle2, Circle, Pill } from "lucide-react";

const INITIAL_DOSAGES = [
  { id: 1, time: "07:00", medicine: "Amlodipine 5mg", dose: "1 Tablet", taken: true },
  { id: 2, time: "13:00", medicine: "Vitamin C 500mg", dose: "1 Tablet", taken: false },
  { id: 3, time: "20:00", medicine: "Simvastatin 20mg", dose: "1 Tablet", taken: false },
];

export default function DosageCard() {
  const [dosages, setDosages] = useState(INITIAL_DOSAGES);

  const toggleTaken = (id) => {
    setDosages(
      dosages.map((item) =>
        item.id === id ? { ...item, taken: !item.taken } : item
      )
    );
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs text-left space-y-4">
      <div className="flex items-center justify-between border-b border-gray-50 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-ocean-green animate-pulse" />
          <h3 className="text-xs font-bold text-cyprus uppercase tracking-wider">Jadwal Obat Hari Ini</h3>
        </div>
        <span className="text-[10px] bg-aqua-spring text-ocean-green font-bold px-2 py-0.5 rounded-full border border-ocean-green/10">
          {dosages.filter((d) => d.taken).length}/{dosages.length} Selesai
        </span>
      </div>

      <div className="space-y-3">
        {dosages.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleTaken(item.id)}
            className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
              item.taken
                ? "bg-gray-50/50 border-gray-150/40 opacity-70"
                : "bg-white border-gray-100 hover:border-gray-250 hover:shadow-xs"
            }`}
          >
            <div className="flex items-center gap-3">
              {item.taken ? (
                <CheckCircle2 className="w-5 h-5 text-ocean-green flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300 hover:text-gray-400 flex-shrink-0" />
              )}
              <div>
                <p className={`text-xs font-bold leading-tight ${item.taken ? "line-through text-gray-400 font-semibold" : "text-cyprus"}`}>
                  {item.medicine}
                </p>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                  Dosis: {item.dose} · Jam {item.time}
                </p>
              </div>
            </div>
            <Pill className={`w-3.5 h-3.5 ${item.taken ? "text-gray-300" : "text-ocean-green"}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
