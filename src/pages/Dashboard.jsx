import { FaMedkit, FaPlus, FaCalendarAlt, FaChevronDown, FaPills, FaFileInvoiceDollar, FaUsers, FaExclamationTriangle, FaArrowRight } from "react-icons/fa";
import { MdTrendingUp, MdCheckCircle, MdPending, MdCancel, MdOutlineInventory2 } from "react-icons/md";
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { obatData, transaksiData } from "../data";

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
        <div className="font-inter text-gray-800 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Ringkasan Apotek</h1>
                    <p className="text-sm text-gray-500 mt-1">Pantau pendapatan, stok obat, dan aktivitas hari ini.</p>
                </div>
                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                    <button className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </button>
                    <button className="flex items-center bg-hijau border border-transparent rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition">
                        <FaPlus className="mr-2" />
                        Transaksi Baru
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Pendapatan</p>
                            <h3 className="text-2xl font-semibold text-gray-900 mt-1">{formatRupiah(totalPendapatan)}</h3>
                        </div>
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <FaFileInvoiceDollar className="text-emerald-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <MdTrendingUp className="text-emerald-500 mr-1" />
                        <span className="text-emerald-600 font-medium">+12.5%</span>
                        <span className="text-gray-400 ml-2">dari bulan lalu</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Transaksi Selesai</p>
                            <h3 className="text-2xl font-semibold text-gray-900 mt-1">{totalTransaksi}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <MdCheckCircle className="text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-gray-500">Total transaksi bulan ini</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Obat Stok Rendah</p>
                            <h3 className="text-2xl font-semibold text-gray-900 mt-1">{stokRendah.length}</h3>
                        </div>
                        <div className="p-2 bg-red-50 rounded-lg">
                            <FaExclamationTriangle className="text-red-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-red-500 font-medium">Perlu restock segera</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Left Column - 2 spans */}
                <div className="xl:col-span-2 flex flex-col space-y-6">
                    
                    {/* Charts */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-gray-900">Pendapatan Bulanan</h3>
                            <select className="text-sm border-gray-200 rounded-md text-gray-500 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 outline-none">
                                <option>Tahun ini</option>
                                <option>Tahun lalu</option>
                            </select>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `${val/1000000}M`} />
                                    <Tooltip 
                                        cursor={{fill: '#f9fafb'}} 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
                                        {barData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.active ? '#059669' : '#a7f3d0'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900">Transaksi Terbaru</h3>
                            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center">
                                Lihat Semua <FaArrowRight className="ml-1 text-xs" />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelanggan</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transaksiData.slice(0, 5).map((trx, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trx.transaksiId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{trx.pelanggan}</div>
                                                <div className="text-sm text-gray-500">{trx.items.length} item</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(trx.tanggal).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    trx.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                                                    trx.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {trx.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                                {formatRupiah(trx.totalHarga)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column - 1 span */}
                <div className="flex flex-col space-y-6">
                    
                    {/* Low Stock Alert */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                                <MdOutlineInventory2 className="mr-2 text-gray-400" /> Stok Rendah
                            </h3>
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{stokRendah.length} Obat</span>
                        </div>
                        <div className="space-y-4">
                            {stokRendah.map((obat, idx) => (
                                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{obat.nama}</p>
                                        <p className="text-xs text-gray-500">{obat.kategori}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-red-600">{obat.stok}</p>
                                        <p className="text-xs text-gray-500">Sisa</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 bg-white border border-gray-200 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition shadow-sm">
                            Kelola Inventaris
                        </button>
                    </div>

                    {/* Visitors Area Chart */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="font-semibold text-gray-900 mb-1">Pengunjung Harian</h3>
                        <p className="text-sm text-gray-500 mb-6">Minggu ini</p>
                        
                        <div className="h-40 w-full -ml-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={areaData}>
                                    <defs>
                                        <linearGradient id="colorVisitor" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#059669" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitor)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
