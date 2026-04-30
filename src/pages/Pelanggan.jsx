import { useState } from "react";
import { MdAdd, MdSearch, MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import { pelangganData } from "../data";

export default function Pelanggan() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pelanggan] = useState(pelangganData);

    return (
        <div className="flex flex-col space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <PageHeader title="Pelanggan" breadcrumb={["Apotek", "Pelanggan"]}>
                <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all shadow-sm">
                    <MdAdd className="mr-2 text-lg" /> Tambah Pelanggan
                </button>
            </PageHeader>

            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative w-full md:w-80">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                    <input type="text" placeholder="Cari pelanggan..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" />
                </div>
                <div className="hidden md:block text-gray-500 text-sm">
                    Total <span className="font-medium text-gray-900">{pelanggan.length}</span> pelanggan
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pelanggan.map((p) => (
                    <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 text-xl font-bold border border-emerald-100">
                                {p.nama.charAt(0)}
                            </div>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">{p.id}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors mb-4">{p.nama}</h3>
                        <div className="space-y-3 mt-auto">
                            <div className="flex items-center text-gray-600 text-sm">
                                <MdEmail className="mr-3 text-gray-400 text-base" /> {p.email}
                            </div>
                            <div className="flex items-center text-gray-600 text-sm">
                                <MdPhone className="mr-3 text-gray-400 text-base" /> {p.telepon}
                            </div>
                            <div className="flex items-start text-gray-600 text-sm">
                                <MdLocationOn className="mr-3 text-gray-400 text-base mt-0.5" /> <span className="flex-1 leading-tight">{p.alamat}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Pelanggan">
                <form className="space-y-4">
                    <div className="flex flex-col space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <input type="text" placeholder="Masukkan nama" className="w-full p-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input type="email" placeholder="email@contoh.com" className="w-full p-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Telepon</label>
                        <input type="tel" placeholder="0812..." className="w-full p-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Alamat</label>
                        <input type="text" placeholder="Alamat di Pekanbaru" className="w-full p-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                    </div>
                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-all shadow-sm">Simpan</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
