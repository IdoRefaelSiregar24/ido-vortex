import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("Semua field wajib diisi.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Password dan Konfirmasi Password tidak cocok.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password minimal 6 karakter.");
            return;
        }

        setLoading(true);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        role: "member"
                    }
                }
            });

            if (signUpError) {
                setError(signUpError.message);
            } else {
                setSuccess("Pendaftaran berhasil! Mengalihkan ke halaman login...");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (err) {
            setError(err.message || "Terjadi kesalahan saat mendaftar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Daftar Akun ✨</h2>
            
            {error && (
                <div className="bg-red-50 border border-red-200 mb-5 p-4 text-sm text-red-600 rounded-xl flex items-center">
                    <BsFillExclamationDiamondFill className="text-red-500 mr-3 text-lg flex-shrink-0" /> {error}
                </div>
            )}
            
            {success && (
                <div className="bg-emerald-50 border border-emerald-200 mb-5 p-4 text-sm text-emerald-600 rounded-xl flex items-center">
                    <ImSpinner2 className="mr-3 animate-spin text-emerald-600 text-lg flex-shrink-0" /> {success}
                </div>
            )}

            {loading && !success && (
                <div className="bg-gray-50 border border-gray-200 mb-5 p-4 text-sm text-gray-600 rounded-xl flex items-center">
                    <ImSpinner2 className="mr-3 animate-spin text-emerald-600 text-lg flex-shrink-0" /> Memproses pendaftaran...
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input 
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Nama lengkap" 
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-hijau/20" 
                        required
                    />
                </div>
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@contoh.com" 
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-hijau/20" 
                        required
                    />
                </div>
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input 
                        type="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="********" 
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-hijau/20" 
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                    <input 
                        type="password" 
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="********" 
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-hijau/20" 
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-hijau hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Mendaftar..." : "Daftar"}
                </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-500">Sudah punya akun? <Link to="/login" className="text-hijau hover:underline">Login</Link></p>
        </div>
    );
}

