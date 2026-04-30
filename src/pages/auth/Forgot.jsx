import { Link } from "react-router-dom";

export default function Forgot() {
    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2 text-center">Lupa Password?</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">Masukkan email kamu dan kami akan kirim link reset password.</p>
            <form>
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" placeholder="email@contoh.com" className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-hijau/20" />
                </div>
                <button type="submit" className="w-full bg-hijau hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300">Kirim Link Reset</button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-500">Ingat password? <Link to="/login" className="text-hijau hover:underline">Login</Link></p>
        </div>
    )
}
