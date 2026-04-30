import { useState, useEffect, useRef } from "react";
import { FaBell, FaSearch, FaTimes, FaHeartbeat } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Header() {
    const [showModal, setShowModal] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navClass = ({ isActive }) =>
        `px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
            isActive ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
        }`;

    return (
        <div className="w-full bg-[#f4f7f6] border-b border-gray-200/60 z-10">
            <div id="header-container" className="flex justify-between items-center px-8 py-4">
                
                {/* Logo */}
                <div id="header-logo" className="flex items-center space-x-2">
                    <div className="text-emerald-600 text-2xl flex items-center justify-center">
                        <FaHeartbeat />
                    </div>
                    <span className="font-sans text-xl font-bold text-gray-900 tracking-tight">
                        Apotek Keluarga
                    </span>
                </div>

                {/* Top Nav */}
                <div className="hidden md:flex items-center space-x-1 bg-gray-100/50 p-1 rounded-full border border-gray-100/80">
                    <NavLink to="/" className={navClass}>Dashboard</NavLink>
                    <NavLink to="/obat" className={navClass}>Daftar Obat</NavLink>
                    <NavLink to="/transaksi" className={navClass}>Transaksi</NavLink>
                    <NavLink to="/pelanggan" className={navClass}>Pelanggan</NavLink>
                    <NavLink to="/laporan" className={navClass}>Laporan</NavLink>
                </div>

                {/* Right Side Icons */}
                <div id="icons-container" className="flex items-center space-x-4">
                    <button className="text-gray-500 hover:text-gray-900 p-2 rounded-full transition bg-white shadow-sm border border-gray-100" onClick={() => setShowModal(true)}>
                        <FaSearch />
                    </button>

                    <button className="relative text-gray-500 hover:text-gray-900 p-2 rounded-full transition bg-white shadow-sm border border-gray-100">
                        <FaBell />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>

                    {/* Profile */}
                    <div ref={profileRef} className="relative flex items-center">
                        <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 bg-white rounded-full p-1 border border-gray-100 shadow-sm focus:outline-none">
                            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=Sujon&background=059669&color=fff" alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-gray-700 text-sm hidden md:block pr-2 font-medium">Sujon</span>
                            <div className="text-gray-400 text-xs pr-2">
                                ▼
                            </div>
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-40">
                                <button className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Profil Saya</button>
                                <button className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Pengaturan</button>
                                <div className="border-t border-gray-100 my-1"></div>
                                <button className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Search Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-24 z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center p-4 border-b border-gray-100">
                            <FaSearch className="text-gray-400 text-xl mr-4" />
                            <input
                                className="text-xl w-full outline-none text-gray-700 bg-transparent placeholder-gray-400"
                                placeholder="Cari obat atau transaksi..."
                                autoFocus
                            />
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
