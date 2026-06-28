import React, { useState } from 'react';
import { MdOutlineChat, MdDeleteOutline, MdSend } from 'react-icons/md';
import { RiShieldUserLine } from 'react-icons/ri';
import Pagination from './Pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export default function CustomerTable({ customers = [], searchQuery = "" }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
    
    let formattedPhone = cust.phone.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.substring(1);
    }

    const waUrl = `https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
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
                    <div className="flex flex-wrap gap-1">
                      {cust.segment_names && cust.segment_names.length > 0 ? (
                        cust.segment_names.map((segName, idx) => {
                          const color = cust.segment_colors?.[idx] || '#71717a';
                          return (
                            <span 
                              key={idx} 
                              style={{
                                backgroundColor: color + '15',
                                color: color,
                                borderColor: color + '40'
                              }}
                              className="px-2 py-0.5 rounded text-[10px] font-bold border"
                            >
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
    </div>
  );
}
