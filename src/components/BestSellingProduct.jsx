import React from 'react';
import { MdFilterList } from 'react-icons/md';
import Button from './Button';

const products = [
  { 
    name: 'Paracetamol 500mg', 
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=40&h=40&q=80',
    orders: 104, 
    status: 'Stock', 
    price: '$5.99' 
  },
  { 
    name: 'Ibuprofen 400mg', 
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=40&h=40&q=80',
    orders: 56, 
    status: 'Stock out', 
    price: '$6.99' 
  },
  { 
    name: 'Amoxicillin 250mg', 
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=40&h=40&q=80',
    orders: 266, 
    status: 'Stock', 
    price: '$8.99' 
  },
  { 
    name: 'Vitamin C 1000mg', 
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=40&h=40&q=80',
    orders: 506, 
    status: 'Stock', 
    price: '$4.99' 
  },
];

const BestSellingProduct = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 w-full font-sans">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Obat Terlaris</h3>
        <Button variant="primary" className="!px-4 !py-1.5 !text-sm !rounded-md !gap-1">
          Filter <MdFilterList size={16} />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-aqua-spring text-gray-500 text-[11px] font-semibold uppercase tracking-wider">
              <th className="py-3 px-4 rounded-l-md">OBAT</th>
              <th className="py-3 px-4">TOTAL ORDER</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4 rounded-r-md">PRICE</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod, idx) => (
              <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 flex items-center gap-3">
                  <img src={prod.image} alt={prod.name} className="w-8 h-8 rounded-md object-cover" />
                  <span className="text-[14px] font-bold text-cyprus">{prod.name}</span>
                </td>
                <td className="py-4 px-4 text-[14px] text-gray-600">{prod.orders}</td>
                <td className="py-4 px-4 text-[14px] font-medium flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${prod.status === 'Stock' ? 'bg-success' : 'bg-error'}`}></span>
                  <span className={prod.status === 'Stock' ? 'text-success' : 'text-error'}>{prod.status}</span>
                </td>
                <td className="py-4 px-4 text-[14px] font-bold text-cyprus">{prod.price}</td>
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

export default BestSellingProduct;
