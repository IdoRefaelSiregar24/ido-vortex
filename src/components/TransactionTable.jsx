import React from 'react';
import { MdFilterList } from 'react-icons/md';
import Button from './Button';

const transactions = [
  { no: '1.', id: '#6545', date: '01 Oct | 11:29 am', status: 'Paid', amount: '$64' },
  { no: '2.', id: '#5412', date: '01 Oct | 11:29 am', status: 'Pending', amount: '$557' },
  { no: '3.', id: '#6622', date: '01 Oct | 11:29 am', status: 'Paid', amount: '$156' },
  { no: '4.', id: '#6462', date: '01 Oct | 11:29 am', status: 'Paid', amount: '$265' },
  { no: '5.', id: '#6462', date: '01 Oct | 11:29 am', status: 'Paid', amount: '$265' },
];

const TransactionTable = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 w-full font-sans">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Transaction</h3>
        <Button variant="primary" className="!px-4 !py-1.5 !text-sm !rounded-md !gap-1">
          Filter <MdFilterList size={16} />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-500 text-sm border-b border-gray-100">
              <th className="pb-3 font-medium w-16">No</th>
              <th className="pb-3 font-medium">Id Customer</th>
              <th className="pb-3 font-medium">Order Date</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trx, idx) => (
              <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="py-4 text-sm text-gray-800">{trx.no}</td>
                <td className="py-4 text-sm text-gray-800">{trx.id}</td>
                <td className="py-4 text-sm text-gray-500">{trx.date}</td>
                <td className="py-4 text-sm font-medium flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${trx.status === 'Paid' ? 'bg-success' : 'bg-pending'}`}></span>
                  <span className="text-gray-800">{trx.status}</span>
                </td>
                <td className="py-4 text-sm font-semibold text-gray-800 text-right">{trx.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4">
        <Button variant="accent" className="!px-6 !py-1.5 !text-sm !border-primary-cta !text-primary-cta hover:!bg-indigo-50">
          Details
        </Button>
      </div>
    </div>
  );
};

export default TransactionTable;
