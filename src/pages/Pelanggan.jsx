import React from "react";
import OrderStatCard from "../components/OrderStatCard";
import CustomerOverviewChart from "../components/CustomerOverviewChart";
import CustomerTable from "../components/CustomerTable";

export default function Pelanggan() {
    return (
        <div className="flex flex-col space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-4 bg-gray-50 min-h-screen">
            
            {/* Top Section: Stats & Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Left: Stat Cards */}
                <div className="lg:col-span-1 flex flex-col gap-6 h-full">
                    <div className="flex-1">
                        <OrderStatCard title="Total Customers" value="11,040" trendValue="14.4%" trendDirection="up" period="Last 7 days" />
                    </div>
                    <div className="flex-1">
                        <OrderStatCard title="New Customers" value="2,370" trendValue="20%" trendDirection="up" period="Last 7 days" />
                    </div>
                    <div className="flex-1">
                        <OrderStatCard title="Visitor" value="250k" trendValue="20%" trendDirection="up" period="Last 7 days" />
                    </div>
                </div>

                {/* Right: Chart */}
                <div className="lg:col-span-3">
                    <CustomerOverviewChart />
                </div>

            </div>

            {/* Bottom Section: Table */}
            <div className="mt-2">
                <CustomerTable />
            </div>

        </div>
    );
}
