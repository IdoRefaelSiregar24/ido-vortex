import { useState, useEffect } from "react";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dataForm, setDataForm] = useState({ email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: dataForm.email,
                password: dataForm.password,
            });

            if (signInError) {
                setError(signInError.message);
            } else {
                navigate("/");
            }
        } catch (err) {
            setError(err.message || "Terjadi kesalahan saat masuk.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Masuk ke Akun Anda - Apotek Keluarga";
    }, []);

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm({ ...dataForm, [name]: value });
    };

    return (
        <div>
            {error && (
                <div className="bg-red-50 border border-red-200 mb-5 p-4 text-sm text-red-650 rounded-xl flex items-center">
                    <BsFillExclamationDiamondFill className="text-red-500 mr-3 text-lg flex-shrink-0" /> {error}
                </div>
            )}
            {loading && (
                <div className="bg-gray-50 border border-gray-200 mb-5 p-4 text-sm text-gray-600 rounded-xl flex items-center">
                    <ImSpinner2 className="mr-3 animate-spin text-ocean-green text-lg flex-shrink-0" /> Autentikasi...
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-medium text-gray-705">Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={dataForm.email}
                        onChange={handleChange} 
                        placeholder="email@contoh.com" 
                        className="w-full p-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green outline-none transition-all" 
                        required
                    />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-medium text-gray-705">Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={dataForm.password}
                        onChange={handleChange} 
                        placeholder="••••••••" 
                        className="w-full p-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-green/20 focus:border-ocean-green outline-none transition-all" 
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full mt-2 px-4 py-2.5 bg-ocean-green text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {loading ? "Memproses..." : "Masuk ke Dashboard"}
                </button>
            </form>

            <div className="mt-6 flex items-center justify-center space-x-4 text-sm">
                <Link to="/forgot" className="text-ocean-green hover:text-emerald-700 font-bold transition-colors">Lupa Password?</Link>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <Link to="/register" className="text-ocean-green hover:text-emerald-700 font-bold transition-colors">Daftar Akun</Link>
            </div>
        </div>
    );
}

