import { MdDashboard, MdMedication, MdReceipt, MdPeople, MdOutlineSettings, MdLogout } from "react-icons/md";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
    const menuClass = ({ isActive }) =>
        `flex justify-center items-center w-12 h-12 rounded-full mb-3 transition-all duration-200 cursor-pointer
        ${isActive ?
            "bg-emerald-700 text-white shadow-md shadow-emerald-700/30" :
            "text-gray-400 bg-white hover:text-emerald-700 hover:bg-emerald-50 border border-gray-100/50"
        }`;

    return (
        <div id="sidebar" className="flex flex-col items-center min-h-full w-24 py-6 z-10 bg-[#f4f7f6]">
            {/* Top Icons Container */}
            <div className="flex flex-col items-center bg-white rounded-full py-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100">
                <NavLink id="menu-dashboard" to="/" className={menuClass} title="Dashboard">
                    <MdDashboard className="text-xl" />
                </NavLink>
                <NavLink id="menu-obat" to="/obat" className={menuClass} title="Daftar Obat">
                    <MdMedication className="text-xl" />
                </NavLink>
                <NavLink id="menu-transaksi" to="/transaksi" className={menuClass} title="Transaksi">
                    <MdReceipt className="text-xl" />
                </NavLink>
                <NavLink id="menu-pelanggan" to="/pelanggan" className={menuClass} title="Pelanggan">
                    <MdPeople className="text-xl" />
                </NavLink>
            </div>

            {/* Bottom Section */}
            <div className="mt-auto flex flex-col items-center bg-white rounded-full py-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100">
                <button className="flex justify-center items-center w-12 h-12 rounded-full mb-3 transition-all duration-200 cursor-pointer text-gray-400 bg-white hover:text-emerald-700 hover:bg-emerald-50 border border-gray-100/50" title="Pengaturan">
                    <MdOutlineSettings className="text-xl" />
                </button>
                <button className="flex justify-center items-center w-12 h-12 rounded-full transition-all duration-200 cursor-pointer text-gray-400 bg-white hover:text-red-500 hover:bg-red-50 border border-gray-100/50" title="Logout">
                    <MdLogout className="text-xl" />
                </button>
            </div>
        </div>
    );
}
