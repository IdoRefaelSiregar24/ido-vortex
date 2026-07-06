import React, { useState, useRef, useEffect } from 'react';
import { MdOutlineChat, MdDeleteOutline, MdSend, MdCheckCircleOutline, MdAutorenew, MdClose } from 'react-icons/md';
import { RiShieldUserLine } from 'react-icons/ri';
import Pagination from './Pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export default function CustomerTable({ customers = [], searchQuery = "" }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Loyalty points modal states
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customMessage, setCustomMessage] = useState("");
  const [broadcastStatus, setBroadcastStatus] = useState("idle"); // idle, sending, success
  const [progress, setProgress] = useState(0);

  const modalRef = useRef(null);

  // Filter based on search query
  const filteredCustomers = customers.filter((cust) => {
    const q = searchQuery.toLowerCase();
    return (
      (cust.name || "").toLowerCase().includes(q) ||
      (cust.email || "").toLowerCase().includes(q) ||
      (cust.phone || "").toLowerCase().includes(q) ||
      cust.segment_names.some(name => name.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const currentCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Click outside to close loyalty points modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // Prevent closing during simulated sending
        if (broadcastStatus !== "sending") {
          setSelectedCustomer(null);
          setBroadcastStatus("idle");
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [broadcastStatus]);

  // Simulated sending progress
  useEffect(() => {
    let interval;
    if (broadcastStatus === 'sending') {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setBroadcastStatus('success');
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [broadcastStatus]);

  const getTierColor = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'vip':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'premium':
        return 'text-indigo-755 bg-indigo-50 border-indigo-200';
      case 'gold':
      case 'gold member':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default: // free
        return 'text-zinc-600 bg-zinc-100 border-zinc-200';
    }
  };

  const handleWAQuickSend = (cust) => {
    const text = `Halo ${cust.name}, ini dari apotek Sehat Pekanbaru. Kami ingin mengabarkan bahwa poin loyalitas Anda saat ini adalah ${cust.membership_points.toLocaleString("id-ID")} pts. Jangan lupa tukarkan poin Anda di pemesanan berikutnya untuk potongan diskon hingga 50%!`;
    
    setSelectedCustomer(cust);
    setCustomMessage(text);
    setBroadcastStatus("idle");
    setProgress(0);
  };

  const triggerRealWASend = () => {
    if (!selectedCustomer) return;
    let formattedPhone = selectedCustomer.phone.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.substring(1);
    }
    const waUrl = `https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(customMessage)}`;
    window.open(waUrl, "_blank");
    setSelectedCustomer(null);
  };

  const triggerSimulatedBroadcast = () => {
    setBroadcastStatus("sending");
    setProgress(0);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm w-full overflow-hidden flex flex-col text-left">
      <div className="overflow-x-auto flex-1 p-2">
        <Table className="min-w-[950px]">
          <TableHeader className="bg-aqua-spring text-cyprus border-b border-gray-150">
            <TableRow>
              <TableHead className="py-4 px-6 font-extrabold text-[12px] w-24">ID Member</TableHead>
              <TableHead className="py-4 px-6 font-extrabold text-[12px]">Nama Pasien</TableHead>
              <TableHead className="py-4 px-6 font-extrabold text-[12px]">No. Telepon</TableHead>
              <TableHead className="py-4 px-6 font-extrabold text-[12px]">Status Tier</TableHead>
              <TableHead className="py-4 px-6 font-extrabold text-[12px] text-right">Poin CRM</TableHead>
              <TableHead className="py-4 px-6 font-extrabold text-[12px]">Tag Segmen Medis</TableHead>
              <TableHead className="py-4 px-6 font-extrabold text-[12px] text-center w-32">Kirim Promo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100">
            {currentCustomers.length > 0 ? (
              currentCustomers.map((cust) => (
                <TableRow key={cust.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-[12px] font-mono font-bold text-gray-500">
                    #{cust.id.substring(0, 8).toUpperCase()}
                  </td>
                  <td className="py-4 px-6 text-[13px] font-extrabold text-cyprus">
                    <div className="flex flex-col text-left">
                      <span>{cust.name}</span>
                      <span className="text-[10px] text-gray-400 font-medium mt-0.5">{cust.email} · {cust.age}th</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[13px] font-semibold text-gray-700">{cust.phone}</td>
                  <td className="py-4 px-6 text-[12px] font-bold">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border uppercase tracking-wider ${getTierColor(cust.membership_status)}`}>
                      {cust.membership_status || 'free'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[13px] font-black text-cyprus text-right">
                    {cust.membership_points.toLocaleString("id-ID")} <span className="text-[10px] text-gray-400 font-normal">pts</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1.5">
                      {cust.segment_names && cust.segment_names.length > 0 ? (
                        cust.segment_names.map((segName, idx) => {
                          const color = cust.segment_colors?.[idx] || '#64748b';
                          return (
                            <span 
                              key={idx} 
                              style={{
                                backgroundColor: color + '12', // 7% opacity
                                color: color,
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border-none"
                            >
                              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                              {segName}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">No Segment</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleWAQuickSend(cust)}
                        className="px-2.5 py-1 bg-emerald-55 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-250 font-bold text-[10px] rounded transition-all flex items-center gap-1 cursor-pointer"
                        title="Kirim info poin via WhatsApp"
                      >
                        <MdSend size={12} />
                        Kirim Poin
                      </button>
                    </div>
                  </td>
                </TableRow>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-12 text-center text-gray-400 font-bold text-xs uppercase tracking-widest">
                  Tidak ada pelanggan terdaftar.
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 pb-6 pt-4 border-t border-gray-100 bg-white">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={(page) => setCurrentPage(page)} 
          />
        </div>
      )}

      {/* Pop-up Konfirmasi / Broadcast Poin */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyprus/40 backdrop-blur-sm p-4 transition-opacity duration-200">
          <div 
            ref={modalRef}
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transition-all duration-300 transform scale-100 text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-aqua-spring/50">
              <h2 className="text-xs font-bold text-cyprus uppercase tracking-wider">Kirim Info Poin</h2>
              {broadcastStatus !== 'sending' && (
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-cyprus hover:bg-gray-100 p-1 rounded-full transition-colors cursor-pointer"
                >
                  <MdClose size={18} />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {broadcastStatus === 'idle' && (
                <div className="space-y-4">
                  {/* Customer Info */}
                  <div className="bg-aqua-spring/30 border border-aqua-spring rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-xs font-extrabold text-gray-400 uppercase">Penerima</span>
                    <span className="text-sm font-black text-cyprus">{selectedCustomer.name}</span>
                    <span className="text-xs text-gray-500 font-semibold">{selectedCustomer.phone} · <span className="text-ocean-green font-bold">{selectedCustomer.membership_points.toLocaleString("id-ID")} pts</span></span>
                  </div>

                  {/* Message Template */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Pesan WhatsApp (Dapat Diedit)</label>
                    <textarea 
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-cyprus font-semibold outline-none focus:ring-1 focus:ring-ocean-green focus:border-ocean-green resize-none leading-relaxed"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 pt-2">
                    <button 
                      onClick={triggerRealWASend}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <MdSend size={14} /> Buka WhatsApp Web
                    </button>
                    <button 
                      onClick={triggerSimulatedBroadcast}
                      className="w-full py-2.5 bg-ocean-green hover:opacity-90 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <MdOutlineChat size={14} /> Simulasi Broadcast WhatsApp
                    </button>
                    <button 
                      onClick={() => setSelectedCustomer(null)}
                      className="w-full py-2.5 border border-gray-200 text-gray-500 hover:bg-gray-50 font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}

              {broadcastStatus === 'sending' && (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                  <MdAutorenew className="text-ocean-green animate-spin" size={48} />
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-cyprus uppercase tracking-wide">Menghubungkan ke API WhatsApp</h3>
                    <p className="text-xs text-gray-400 font-semibold">Mengirimkan promo & info poin loyalitas...</p>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2 max-w-[200px] overflow-hidden">
                    <div 
                      className="bg-ocean-green h-full rounded-full transition-all duration-150" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {broadcastStatus === 'success' && (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                    <MdCheckCircleOutline size={36} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-cyprus uppercase tracking-wide">Pesan Berhasil Terkirim!</h3>
                    <p className="text-xs text-gray-400 font-semibold">Simulasi broadcast WhatsApp ke {selectedCustomer.name} sukses.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedCustomer(null);
                      setBroadcastStatus("idle");
                    }}
                    className="px-6 py-2 bg-cyprus text-white font-bold text-xs rounded-xl shadow-md hover:bg-cyprus/90 transition-all cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
