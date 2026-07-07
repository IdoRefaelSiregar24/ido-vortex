import { useState, useRef, useEffect } from "react";
import { MdAdd, MdSearch, MdFilterList, MdOutlineInventory2 } from "react-icons/md";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import { obatData } from "../data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

export default function Obat() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [obat] = useState(obatData);
    const searchInputRef = useRef(null);

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    const getKategoriStyle = (kategori) => {
        switch (kategori) {
            case "Obat Bebas": return "bg-green-500/10 text-green-700";
            case "Obat Bebas Terbatas": return "bg-yellow-500/10 text-yellow-700";
            case "Obat Keras": return "bg-red-500/10 text-red-700";
            case "Suplemen": return "bg-blue-500/10 text-blue-700";
            default: return "bg-gray-500/10 text-gray-700";
        }
    };

    const getKategoriDotColor = (kategori) => {
        switch (kategori) {
            case "Obat Bebas": return "bg-green-500";
            case "Obat Bebas Terbatas": return "bg-yellow-500";
            case "Obat Keras": return "bg-red-500";
            case "Suplemen": return "bg-blue-500";
            default: return "bg-gray-400";
        }
    };

    return (
        <div className="flex flex-col space-y-6 w-full pb-10">
            <PageHeader title="Daftar Obat" breadcrumb={["Apotek", "Daftar Obat"]}>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all shadow-sm"
                >
                    <MdAdd className="mr-2 text-lg" />
                    Tambah Obat
                </button>
            </PageHeader>

            {/* Search */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-left">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Cari obat..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                        />
                    </div>
                    <button className="flex items-center justify-center space-x-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors px-3 py-2 rounded-lg border border-gray-200 sm:border-transparent cursor-pointer">
                        <MdFilterList className="text-lg" />
                        <span className="text-sm font-medium">Filter</span>
                    </button>
                </div>
                <div className="hidden sm:block text-gray-500 text-sm">
                    Menampilkan <span className="font-medium text-gray-900">{obat.length}</span> obat
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table className="min-w-full divide-y divide-gray-200">
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Obat</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</TableHead>
                                <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</TableHead>
                                <TableHead className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kadaluarsa</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-white divide-y divide-gray-200">
                            {obat.map((item) => (
                                <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</TableCell>
                                    <TableCell className="px-6 py-4 text-left">
                                        <div className="text-sm font-medium text-gray-900">{item.nama}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{item.deskripsi}</div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${getKategoriStyle(item.kategori)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${getKategoriDotColor(item.kategori)}`} />
                                            {item.kategori}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.harga)}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`text-sm font-medium ${item.stok < 100 ? 'text-red-600' : 'text-gray-900'}`}>
                                            {item.stok}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.kadaluarsa}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Add Obat Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Obat Baru">
                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Kode Obat</label>
                            <input type="text" placeholder="OBT-XXX" className="w-full p-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Kategori</label>
                            <select className="w-full p-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all">
                                <option value="Obat Bebas">Obat Bebas</option>
                                <option value="Obat Bebas Terbatas">Obat Bebas Terbatas</option>
                                <option value="Obat Keras">Obat Keras</option>
                                <option value="Suplemen">Suplemen</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Nama Obat</label>
                        <input type="text" placeholder="Masukkan nama obat" className="w-full p-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Harga</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                                <input type="number" placeholder="0" className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Stok</label>
                            <input type="number" placeholder="0" className="w-full p-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all">
                            Batal
                        </button>
                        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-all shadow-sm">
                            Simpan Obat
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
