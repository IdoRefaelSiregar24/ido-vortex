import axios from "axios";
import { useState } from "react";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dataForm, setDataForm] = useState({ email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(false);

        axios
            .post("https://dummyjson.com/user/login", {
                username: dataForm.email,
                password: dataForm.password,
            })
            .then((response) => {
                if (response.status !== 200) { setError(response.data.message); return; }
                navigate("/");
            })
            .catch((err) => {
                if (err.response) setError(err.response.data.message || "Terjadi kesalahan");
                else setError(err.message || "Kesalahan tidak diketahui");
            })
            .finally(() => setLoading(false));
    };

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm({ ...dataForm, [name]: value });
    };

    return (
        <div>
            {error && (
                <div className="bg-red-50 border border-red-200 mb-5 p-4 text-sm text-red-600 rounded-xl flex items-center">
                    <BsFillExclamationDiamondFill className="text-red-500 mr-3 text-lg" /> {error}
                </div>
            )}
            {loading && (
                <div className="bg-gray-50 border border-gray-200 mb-5 p-4 text-sm text-gray-600 rounded-xl flex items-center">
                    <ImSpinner2 className="mr-3 animate-spin text-emerald-600 text-lg" /> Autentikasi...
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Username</label>
                    <input type="text" name="email" onChange={handleChange} placeholder="emilys" className="w-full p-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <input type="password" name="password" onChange={handleChange} placeholder="••••••••" className="w-full p-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" />
                </div>
                <button type="submit" className="w-full mt-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-all shadow-sm">
                    Masuk ke Dashboard
                </button>
            </form>

            <div className="mt-6 flex items-center justify-center space-x-4 text-sm">
                <Link to="/forgot" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">Lupa Password?</Link>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">Daftar Akun</Link>
            </div>
        </div>
    );
}
