import React, { useState } from 'react';
import { MdOutlineChat, MdDeleteOutline } from 'react-icons/md';
import Pagination from './Pagination';

const dummyCustomers = [
  { id: '#CUST001', name: 'John Doe', phone: '+1234567890', orderCount: 25, totalSpend: '3,450.00', status: 'Active' },
  { id: '#CUST002', name: 'John Doe', phone: '+1234567890', orderCount: 25, totalSpend: '3,450.00', status: 'Active' },
  { id: '#CUST003', name: 'John Doe', phone: '+1234567890', orderCount: 25, totalSpend: '3,450.00', status: 'Active' },
  { id: '#CUST004', name: 'John Doe', phone: '+1234567890', orderCount: 25, totalSpend: '3,450.00', status: 'Active' },
  { id: '#CUST005', name: 'Jane Smith', phone: '+1234567890', orderCount: 5, totalSpend: '250.00', status: 'Inactive' },
  { id: '#CUST006', name: 'Emily Davis', phone: '+1234567890', orderCount: 30, totalSpend: '4,600.00', status: 'VIP' },
  { id: '#CUST007', name: 'Jane Smith', phone: '+1234567890', orderCount: 5, totalSpend: '250.00', status: 'Inactive' },
  { id: '#CUST008', name: 'John Doe', phone: '+1234567890', orderCount: 25, totalSpend: '3,450.00', status: 'Active' },
  { id: '#CUST009', name: 'Emily Davis', phone: '+1234567890', orderCount: 30, totalSpend: '4,600.00', status: 'VIP' },
];

export default function CustomerTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(dummyCustomers.length / itemsPerPage);
  
  const currentCustomers = dummyCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'text-success';
      case 'Inactive': return 'text-error';
      case 'VIP': return 'text-pending';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'Active': return 'bg-success';
      case 'Inactive': return 'bg-error';
      case 'VIP': return 'bg-pending';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm w-full font-sans overflow-hidden flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-aqua-spring text-cyprus text-[13px] font-semibold">
              <th className="py-4 px-6">Customer Id</th>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Phone</th>
              <th className="py-4 px-6 text-center">Order Count</th>
              <th className="py-4 px-6 text-right">Total Spend</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((cust, idx) => (
              <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 text-[14px] font-medium text-gray-700">{cust.id}</td>
                <td className="py-4 px-6 text-[14px] font-medium text-gray-800">{cust.name}</td>
                <td className="py-4 px-6 text-[14px] font-medium text-gray-800">{cust.phone}</td>
                <td className="py-4 px-6 text-[14px] font-medium text-gray-800 text-center">{cust.orderCount}</td>
                <td className="py-4 px-6 text-[14px] font-medium text-gray-800 text-right">{cust.totalSpend}</td>
                <td className="py-4 px-6 text-[13px] font-medium text-center">
                  <div className={`inline-flex items-center gap-1.5 ${getStatusColor(cust.status)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusBg(cust.status)}`}></span>
                    {cust.status}
                  </div>
                </td>
                <td className="py-4 px-6 text-[18px] text-gray-400">
                  <div className="flex items-center justify-center gap-3">
                    <button className="hover:text-ocean-green transition-colors"><MdOutlineChat /></button>
                    <button className="hover:text-error transition-colors"><MdDeleteOutline /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 pb-6">
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={(page) => setCurrentPage(page)} 
        />
      </div>
    </div>
  );
}
