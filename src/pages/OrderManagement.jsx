import React from 'react';
import { MdAdd, MdMoreVert } from 'react-icons/md';
import OrderStatCard from '../components/OrderStatCard';
import OrderTable from '../components/OrderTable';
import Button from '../components/Button';

export default function OrderManagement() {
  return (
    <div className="flex flex-col space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
      
      {/* Header Section */}
      <div className="flex justify-between items-center pt-4">
          <h1 className="text-[22px] font-bold text-cyprus">Order List</h1>
          <div className="flex gap-3">
              <Button variant="primary" className="!px-4 !py-2 !rounded-lg !text-sm !shadow-sm !gap-1">
                  <MdAdd className="text-lg" /> Add Order
              </Button>
              <Button variant="accent" className="!px-4 !py-2 !rounded-lg !text-sm !shadow-sm !border-gray-200 !text-gray-700 hover:!bg-gray-50 !bg-white !gap-1">
                  More Action <MdMoreVert className="text-lg text-gray-500" />
              </Button>
          </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <OrderStatCard title="Total Orders" value="1,240" trendValue="14.4%" trendDirection="up" />
          <OrderStatCard title="New Orders" value="240" trendValue="20%" trendDirection="up" />
          <OrderStatCard title="Completed Orders" value="960" trendValue="85%" trendDirection="none" />
          <OrderStatCard title="Canceled Orders" value="87" trendValue="5%" trendDirection="down" />
      </div>

      {/* Table Section */}
      <div className="mt-4">
          <OrderTable />
      </div>

    </div>
  );
}
