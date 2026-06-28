import { FaMedkit, FaPlus, FaCalendarAlt, FaChevronDown, FaPills, FaFileInvoiceDollar, FaUsers, FaExclamationTriangle, FaArrowRight } from "react-icons/fa";
import { MdTrendingUp, MdCheckCircle, MdPending, MdCancel, MdOutlineInventory2, MdMoreVert } from "react-icons/md";
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { obatData, transaksiData } from "../data";
import ReportChart from "../components/ReportChart";
import UsersActiveCard from "../components/UsersActiveCard";
import TransactionTable from "../components/TransactionTable";
import BestSellingProduct from "../components/BestSellingProduct";
import TopProducts from "../components/TopProducts";
import AddNewProduct from "../components/AddNewProduct";

export default function Dashboard() {
    const totalTransaksi = transaksiData.length;
    const totalPendapatan = transaksiData
        .filter(t => t.status === "Selesai")
        .reduce((sum, t) => sum + t.totalHarga, 0);

    const stokRendah = obatData.filter(o => o.stok < 100).slice(0, 5);

    const barData = [
        { name: 'Jan', value: 2000000 },
        { name: 'Feb', value: 4500000 },
        { name: 'Mar', value: 3000000 },
        { name: 'Apr', value: 6500000, active: true },
        { name: 'May', value: 4000000 },
        { name: 'Jun', value: 3500000 },
    ];

    const areaData = [
        { name: 'Sen', value: 45 },
        { name: 'Sel', value: 52 },
        { name: 'Rab', value: 38 },
        { name: 'Kam', value: 65 },
        { name: 'Jum', value: 48 },
        { name: 'Sab', value: 85 },
        { name: 'Min', value: 70 },
    ];

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    return (
        <div className="text-gray-800 pb-10 pt-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
           
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                
                {/* Card 1: Total Sales */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-800">Total Sales</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                            <MdMoreVert size={24} />
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 mb-6">Last 7 days</p>
                    
                    <div className="flex items-baseline mb-6 gap-3">
                        <h1 className="text-4xl xl:text-5xl font-bold text-[#082f2d] tracking-tight">$350K</h1>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[15px] font-medium text-gray-800">Sales</span>
                            <span className="text-[14px] font-medium text-[#22c55e]">
                                ↑ 10.4%
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-end mt-auto">
                        <p className="text-[14px] text-gray-500 pb-1">
                            Previous 7days <span className="text-[#605dec] font-medium">($235)</span>
                        </p>
                        <button className="px-5 xl:px-6 py-1.5 border border-[#605dec] text-[#605dec] text-[14px] xl:text-[15px] font-medium rounded-full hover:bg-indigo-50 transition-colors">
                            Details
                        </button>
                    </div>
                </div>

                {/* Card 2: Total Orders */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-800">Total Orders</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                            <MdMoreVert size={24} />
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 mb-6">Last 7 days</p>
                    
                    <div className="flex items-baseline mb-6 gap-3">
                        <h1 className="text-4xl xl:text-5xl font-bold text-[#082f2d] tracking-tight">10.7K</h1>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[15px] font-medium text-gray-800">order</span>
                            <span className="text-[14px] font-medium text-[#22c55e]">
                                ↑ 14.4%
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-end mt-auto">
                        <p className="text-[14px] text-gray-500 pb-1">
                            Previous 7days <span className="text-[#605dec] font-medium">(7.6k)</span>
                        </p>
                        <button className="px-5 xl:px-6 py-1.5 border border-[#605dec] text-[#605dec] text-[14px] xl:text-[15px] font-medium rounded-full hover:bg-indigo-50 transition-colors">
                            Details
                        </button>
                    </div>
                </div>

                {/* Card 3: Pending & Canceled */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-800">Pending & Canceled</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                            <MdMoreVert size={24} />
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 mb-6">Last 7 days</p>
                    
                    <div className="flex mb-6 gap-4 xl:gap-6">
                        <div className="flex-1">
                            <p className="text-[14px] font-medium text-gray-800 mb-1">Pending</p>
                            <div className="flex items-baseline gap-2">
                                <h1 className="text-3xl xl:text-4xl font-bold text-[#082f2d]">509</h1>
                                <span className="text-[12px] xl:text-[13px] font-medium text-[#22c55e]">user 204</span>
                            </div>
                        </div>
                        <div className="w-px bg-gray-200"></div>
                        <div className="flex-1">
                            <p className="text-[14px] font-medium text-gray-800 mb-1">Canceled</p>
                            <div className="flex items-baseline gap-2">
                                <h1 className="text-3xl xl:text-4xl font-bold text-red-500">94</h1>
                                <span className="text-[12px] xl:text-[13px] font-medium text-red-500">↓ 14.4%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-end mt-auto">
                        <button className="px-5 xl:px-6 py-1.5 border border-[#605dec] text-[#605dec] text-[14px] xl:text-[15px] font-medium rounded-full hover:bg-indigo-50 transition-colors">
                            Details
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Left Column - 2 spans */}
                <div className="xl:col-span-2 flex flex-col space-y-6">
                    
                    {/* Charts */}
                    <ReportChart />

                    {/* Left Column Bottom Components */}
                    <TransactionTable />
                    <BestSellingProduct />
                </div>

                {/* Right Column - 1 span */}
                <div className="flex flex-col space-y-6">
                    
                    {/* Right Column Bottom Components */}
                    <TopProducts />
                    <AddNewProduct />

                    {/* Visitors Area Chart */}
                    <UsersActiveCard />

                </div>
            </div>
        </div>
    );
}
