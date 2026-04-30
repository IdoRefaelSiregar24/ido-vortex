import { Link } from "react-router-dom";

export default function Register() {
    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Daftar Akun ✨</h2>
            <form>
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input type="text" placeholder="Nama lengkap" className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-hijau/20" />
                </div>
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" placeholder="email@contoh.com" className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-hijau/20" />
                </div>
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" placeholder="********" className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-hijau/20" />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                    <input type="password" placeholder="********" className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-hijau/20" />
                </div>
                <button type="submit" className="w-full bg-hijau hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300">Daftar</button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-500">Sudah punya akun? <Link to="/login" className="text-hijau hover:underline">Login</Link></p>
        </div>
    )
}
