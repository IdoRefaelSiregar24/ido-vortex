import React, { useState, useRef, useEffect } from "react";
import { MdAdd, MdMoreVert, MdSearch, MdFilterList, MdSwapVert, MdMoreHoriz } from "react-icons/md";
import OrderStatCard from "../components/OrderStatCard";
import Modal from "../components/Modal";
import { transaksiData } from "../data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

export default function Transaksi() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transaksi, setTransaksi] = useState(transaksiData);

    const [activeTab, setActiveTab] = useState("All order");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Popover states & refs
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);

    const filterRef = useRef(null);
    const sortRef = useRef(null);
    const moreRef = useRef(null);

    // Sorting & Filtering Options
    const [sortBy, setSortBy] = useState("date-desc"); // date-desc, date-asc, price-desc, price-asc
    const [filterMethod, setFilterMethod] = useState("All"); // All, CC, PayPal, Bank
    const [filterStatus, setFilterStatus] = useState("All"); // All, Complete, Pending, Canceled

    // Outside Click Handling
    useEffect(() => {
        function handleClickOutside(event) {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
            if (moreRef.current && !moreRef.current.contains(event.target)) {
                setIsMoreOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Helper to map Indonesian statuses to English UI matching the design
    const mapStatus = (indStatus) => {
        switch (indStatus) {
            case "Selesai": return "Complete";
            case "Pending": return "Pending";
            case "Dibatalkan": return "Canceled";
            default: return "Complete";
        }
    };

    // Helper to get status colors matching the design
    const getStatusStyle = (status) => {
        switch (status) {
            case "Complete": return "text-emerald-700 font-semibold";
            case "Pending": return "text-amber-600 font-semibold";
            case "Canceled": return "text-rose-600 font-semibold";
            default: return "text-gray-600";
        }
    };

    const getStatusDotColor = (status) => {
        switch (status) {
            case "Complete": return "bg-emerald-500";
            case "Pending": return "bg-amber-400";
            case "Canceled": return "bg-rose-500";
            default: return "bg-gray-400";
        }
    };

    // Sync active tab filter with status filter
    useEffect(() => {
        if (activeTab === "All order") setFilterStatus("All");
        else if (activeTab === "Completed") setFilterStatus("Complete");
        else if (activeTab === "Pending") setFilterStatus("Pending");
        else if (activeTab === "Canceled") setFilterStatus("Canceled");
    }, [activeTab]);

    // Data Pipeline (Filtering, Mapping, Sorting)
    const processedTransaksi = transaksi.map((trx, idx) => {
        const methods = ["CC", "PayPal", "Bank"];
        return {
            ...trx,
            customerId: `#${trx.pelangganDetail?.id.replace("PLG-", "CUST") || "CUST001"}`,
            mappedStatus: mapStatus(trx.status),
            method: methods[idx % methods.length],
            // Format IDR (e.g. 120000) to USD equivalent (e.g. 1200.00)
            priceUSD: trx.totalHarga / 100
        };
    }).filter((trx) => {
        // Tab / Status filter
        let statusMatch = true;
        if (filterStatus !== "All") {
            statusMatch = trx.mappedStatus === filterStatus;
        } else {
            if (activeTab === "Completed") statusMatch = trx.mappedStatus === "Complete";
            else if (activeTab === "Pending") statusMatch = trx.mappedStatus === "Pending";
            else if (activeTab === "Canceled") statusMatch = trx.mappedStatus === "Canceled";
        }

        // Method Filter
        const methodMatch = filterMethod === "All" || trx.method === filterMethod;

        // Search Filter
        const searchMatch = trx.pelanggan.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            trx.customerId.toLowerCase().includes(searchQuery.toLowerCase());

        return statusMatch && methodMatch && searchMatch;
    });

    // Sorting
    const sortedTransaksi = [...processedTransaksi].sort((a, b) => {
        if (sortBy === "date-desc") {
            return new Date(b.tanggal) - new Date(a.tanggal);
        }
        if (sortBy === "date-asc") {
            return new Date(a.tanggal) - new Date(b.tanggal);
        }
        if (sortBy === "price-desc") {
            return b.priceUSD - a.priceUSD;
        }
        if (sortBy === "price-asc") {
            return a.priceUSD - b.priceUSD;
        }
        return 0;
    });

    // Pagination
    const totalPages = Math.ceil(sortedTransaksi.length / itemsPerPage) || 1;
    const currentTransaksi = sortedTransaksi.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset pagination on filter updates
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchQuery, sortBy, filterMethod, filterStatus]);

    // Dummy tabs matching design
    const tabs = [
        { name: "All order", count: 240 }, // Using mock number from the design
        { name: "Completed", count: null },
        { name: "Pending", count: null },
        { name: "Canceled", count: null }
    ];

    const handleNewTransactionSubmit = (e) => {
        e.preventDefault();
        alert("Transaksi baru berhasil disimpan! (Prototyping)");
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col space-y-6 w-full pb-10 text-left">
            {/* Header Section */}
            <div className="flex justify-end items-center">
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="bg-ocean-green hover:opacity-95 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                    <MdAdd className="text-lg" /> Transaksi Baru
                </button>
            </div>

            {/* Top Stat Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stat Cards Column */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <OrderStatCard title="Total Revenue" value="$15,045" trendValue="14.4%" trendDirection="up" />
                    <OrderStatCard title="Completed Transactions" value="3,150" trendValue="20%" trendDirection="up" />
                    <OrderStatCard title="Pending Transactions" value="150" trendValue="85%" trendDirection="up" />
                    <OrderStatCard title="Failed Transactions" value="75" trendValue="15%" trendDirection="down" />
                </div>

                {/* Payment Method Column */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[15px] font-bold text-cyprus">Payment Method</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                            <MdMoreVert size={20} />
                        </button>
                    </div>

                    {/* Card & Details row */}
                    <div className="flex flex-col xl:flex-row gap-4 items-center xl:items-start mb-4">
                        {/* CC Mockup */}
                        <div className="w-[210px] h-[130px] rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 p-4 text-white flex flex-col justify-between shadow-md relative overflow-hidden flex-shrink-0">
                            <div className="flex justify-between items-start">
                                <span className="text-[11px] font-extrabold tracking-wide">Finaci</span>
                                {/* MasterCard translucent circles */}
                                <div className="flex -space-x-2">
                                    <div className="w-5 h-5 rounded-full bg-white/20 border border-white/10" />
                                    <div className="w-5 h-5 rounded-full bg-white/30" />
                                </div>
                            </div>
                            <span className="text-sm font-semibold tracking-widest font-mono my-2 block">•••• •••• •••• 2345</span>
                            <div className="flex justify-between items-end text-[9px] font-medium uppercase text-white/80">
                                <div className="flex flex-col text-left">
                                    <span className="text-[7px] text-white/50 lowercase">card holder name</span>
                                    <span>Noman Manzoor</span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-[7px] text-white/50 lowercase">expiry date</span>
                                    <span>02/30</span>
                                </div>
                            </div>
                        </div>

                        {/* CC Stats */}
                        <div className="flex flex-col gap-1.5 text-left w-full xl:w-auto">
                            <div className="text-xs font-semibold text-gray-500">
                                Status: <span className="text-emerald-600 font-bold">Active</span>
                            </div>
                            <div className="text-xs font-semibold text-gray-500">
                                Transactions: <span className="text-cyprus font-bold">1,250</span>
                            </div>
                            <div className="text-xs font-semibold text-gray-500">
                                Revenue: <span className="text-cyprus font-bold">$50,000</span>
                            </div>
                            <button 
                                onClick={() => alert("Redirect to payment transactions (Prototype)")}
                                className="text-xs font-bold text-ocean-green hover:underline mt-2 text-left cursor-pointer"
                            >
                                View Transactions
                            </button>
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex gap-2 border-t border-gray-50 pt-4">
                        <button 
                            onClick={() => alert("Add credit card pop-up (Prototype)")}
                            className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                        >
                            <MdAdd className="text-sm" /> Add Card
                        </button>
                        <button 
                            onClick={() => alert("Are you sure you want to deactivate this card? (Prototype)")}
                            className="px-3 py-2 border border-rose-100 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50/50 active:scale-95 transition-all cursor-pointer"
                        >
                            Deactivate
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 w-full font-sans">
                
                {/* Table Header toolbar */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    {/* Tabs */}
                    <div className="flex bg-aqua-spring p-1 rounded-lg overflow-x-auto w-full lg:w-max">
                        {tabs.map((tab) => (
                            <button
                                key={tab.name}
                                onClick={() => {
                                    setActiveTab(tab.name);
                                    setFilterStatus("All");
                                }}
                                className={`whitespace-nowrap px-4 py-2 text-[13px] font-semibold rounded-md transition-all cursor-pointer ${
                                    activeTab === tab.name 
                                        ? 'bg-white shadow-sm text-cyprus' 
                                        : 'text-gray-500 hover:text-cyprus'
                                }`}
                            >
                                {tab.name} {tab.count && <span className={activeTab === tab.name ? 'text-ocean-green' : 'text-gray-400'}>({tab.count})</span>}
                            </button>
                        ))}
                    </div>

                    {/* Toolbar Right controls */}
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-64">
                            <input 
                                type="text" 
                                placeholder="Search payment history" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-4 pr-10 py-2 bg-[#f8fafc] border-none rounded-lg text-[13px] font-medium text-gray-700 outline-none focus:ring-1 focus:ring-ocean-green" 
                            />
                            <MdSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>

                        {/* Filter Popover */}
                        <div className="relative" ref={filterRef}>
                            <button 
                                onClick={() => setIsFilterOpen(!isFilterOpen)} 
                                className={`p-2 border rounded-lg text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer ${isFilterOpen ? 'bg-aqua-spring text-ocean-green border-ocean-green/30' : 'border-gray-200'}`}
                            >
                                <MdFilterList size={18} />
                            </button>
                            {isFilterOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg z-50 p-4 text-left">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Filters</h4>
                                    
                                    {/* Payment Method */}
                                    <div className="space-y-1.5 mb-4">
                                        <label className="text-[11px] font-bold text-gray-500 uppercase">Method</label>
                                        <select 
                                            value={filterMethod}
                                            onChange={(e) => setFilterMethod(e.target.value)}
                                            className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-cyprus outline-none focus:ring-1 focus:ring-ocean-green cursor-pointer"
                                        >
                                            <option value="All">All Methods</option>
                                            <option value="CC">Credit Card (CC)</option>
                                            <option value="PayPal">PayPal</option>
                                            <option value="Bank">Bank Transfer</option>
                                        </select>
                                    </div>

                                    {/* Status */}
                                    <div className="space-y-1.5 mb-4">
                                        <label className="text-[11px] font-bold text-gray-500 uppercase">Status</label>
                                        <select 
                                            value={filterStatus}
                                            onChange={(e) => {
                                                setFilterStatus(e.target.value);
                                                // Sync back to tabs
                                                if (e.target.value === "All") setActiveTab("All order");
                                                else if (e.target.value === "Complete") setActiveTab("Completed");
                                                else if (e.target.value === "Pending") setActiveTab("Pending");
                                                else if (e.target.value === "Canceled") setActiveTab("Canceled");
                                            }}
                                            className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-cyprus outline-none focus:ring-1 focus:ring-ocean-green cursor-pointer"
                                        >
                                            <option value="All">All Statuses</option>
                                            <option value="Complete">Complete</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Canceled">Canceled</option>
                                        </select>
                                    </div>

                                    {/* Reset */}
                                    <button 
                                        onClick={() => { setFilterMethod("All"); setFilterStatus("All"); setActiveTab("All order"); setIsFilterOpen(false); }}
                                        className="w-full py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:text-error text-center text-xs font-semibold text-gray-600 rounded-lg transition-colors cursor-pointer"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Sort Popover */}
                        <div className="relative" ref={sortRef}>
                            <button 
                                onClick={() => setIsSortOpen(!isSortOpen)} 
                                className={`p-2 border rounded-lg text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer ${isSortOpen ? 'bg-aqua-spring text-ocean-green border-ocean-green/30' : 'border-gray-200'}`}
                            >
                                <MdSwapVert size={18} />
                            </button>
                            {isSortOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1.5 text-left">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-2 border-b border-gray-50">Sort By</h4>
                                    {[
                                        { id: 'date-desc', label: 'Newest First' },
                                        { id: 'date-asc', label: 'Oldest First' },
                                        { id: 'price-desc', label: 'Highest Amount' },
                                        { id: 'price-asc', label: 'Lowest Amount' },
                                    ].map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => { setSortBy(option.id); setIsSortOpen(false); }}
                                            className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors cursor-pointer hover:bg-aqua-spring hover:text-ocean-green ${sortBy === option.id ? 'text-ocean-green bg-aqua-spring/30' : 'text-gray-700'}`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* More Menu */}
                        <div className="relative" ref={moreRef}>
                            <button 
                                onClick={() => setIsMoreOpen(!isMoreOpen)} 
                                className={`p-2 border rounded-lg text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer ${isMoreOpen ? 'bg-aqua-spring text-ocean-green border-ocean-green/30' : 'border-gray-200'}`}
                            >
                                <MdMoreHoriz size={18} />
                            </button>
                            {isMoreOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1.5 text-left">
                                    <button 
                                        onClick={() => { alert("Export data (Prototype)"); setIsMoreOpen(false); }}
                                        className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-aqua-spring hover:text-ocean-green transition-colors cursor-pointer"
                                    >
                                        Export Table
                                    </button>
                                    <button 
                                        onClick={() => { alert("Clear history logs (Prototype)"); setIsMoreOpen(false); }}
                                        className="w-full text-left px-4 py-2 text-xs font-semibold text-error hover:bg-error/5 transition-colors cursor-pointer"
                                    >
                                        Clear History
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table list */}
                <div className="overflow-x-auto">
                    <Table className="w-full text-left border-collapse min-w-[800px]">
                        <TableHeader>
                            <TableRow className="bg-aqua-spring text-cyprus text-[13px] font-semibold border-none">
                                <TableHead className="py-3.5 px-4 rounded-l-xl">Customer Id</TableHead>
                                <TableHead className="py-3.5 px-4">Name</TableHead>
                                <TableHead className="py-3.5 px-4">Date</TableHead>
                                <TableHead className="py-3.5 px-4">Total</TableHead>
                                <TableHead className="py-3.5 px-4">Method</TableHead>
                                <TableHead className="py-3.5 px-4">Status</TableHead>
                                <TableHead className="py-3.5 px-4 rounded-r-xl">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100">
                            {currentTransaksi.length > 0 ? (
                                currentTransaksi.map((trx) => (
                                    <TableRow key={trx.transaksiId} className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="py-4 px-4 text-[13px] font-semibold text-gray-500">{trx.customerId}</TableCell>
                                        <TableCell className="py-4 px-4 text-[13px] font-bold text-cyprus">{trx.pelanggan}</TableCell>
                                        <TableCell className="py-4 px-4 text-[13px] font-semibold text-gray-500">
                                            {new Date(trx.tanggal).toLocaleDateString("en-GB").replace(/\//g, "-")}
                                        </TableCell>
                                        <TableCell className="py-4 px-4 text-[13px] font-bold text-cyprus">
                                            {trx.priceUSD.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                                        </TableCell>
                                        <TableCell className="py-4 px-4 text-[13px] font-bold text-gray-700">{trx.method}</TableCell>
                                        <TableCell className="py-4 px-4 text-[12px]">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(trx.mappedStatus)}`} />
                                                <span className={getStatusStyle(trx.mappedStatus)}>{trx.mappedStatus}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-4 text-[13px] font-bold text-ocean-green">
                                            <button 
                                                onClick={() => alert(`Detail Transaksi: ${trx.transaksiId}\nCustomer: ${trx.pelanggan}`)}
                                                className="hover:underline cursor-pointer"
                                            >
                                                View Details
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="7" className="py-12 text-center text-gray-400 font-bold text-xs uppercase tracking-widest">
                                        Tidak ada transaksi ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6 border-t border-gray-50 pt-6">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="px-4 py-2 border border-gray-200 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all cursor-pointer"
                        >
                            &larr; Previous
                        </button>
                        <div className="flex items-center gap-1 text-xs">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-7 h-7 rounded-lg font-bold transition-all cursor-pointer ${currentPage === page ? 'bg-ocean-green text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className="px-4 py-2 border border-gray-200 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all cursor-pointer"
                        >
                            Next &rarr;
                        </button>
                    </div>
                )}
            </div>

            {/* Modal Baru */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Transaksi Baru">
                <form onSubmit={handleNewTransactionSubmit} className="space-y-4">
                    <div className="flex flex-col space-y-1.5 text-left">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Nama Pelanggan</label>
                        <input type="text" placeholder="Masukkan nama" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-cyprus font-medium outline-none focus:ring-1 focus:ring-ocean-green focus:border-ocean-green" required />
                    </div>
                    <div className="flex flex-col space-y-1.5 text-left">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Obat</label>
                        <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-cyprus font-semibold outline-none focus:ring-1 focus:ring-ocean-green focus:border-ocean-green cursor-pointer">
                            <option>Paracetamol 500mg</option>
                            <option>Amoxicillin 500mg</option>
                            <option>Vitamin C 1000mg</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="flex flex-col space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Jumlah</label>
                            <input type="number" min="1" placeholder="0" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-cyprus font-medium outline-none focus:ring-1 focus:ring-ocean-green focus:border-ocean-green" required />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total ($)</label>
                            <input type="number" step="0.01" placeholder="0" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-cyprus font-medium outline-none focus:ring-1 focus:ring-ocean-green focus:border-ocean-green" required />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-50 active:scale-95 transition-all cursor-pointer">Batal</button>
                        <button type="submit" className="flex-1 px-4 py-2.5 bg-ocean-green text-white font-semibold text-sm rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-md">Simpan</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
