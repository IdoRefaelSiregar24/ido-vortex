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
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
                Selamat Datang 💊
            </h2>

            {error && (
                <div className="bg-red-100 mb-5 p-4 text-sm text-red-700 rounded-lg flex items-center">
                    <BsFillExclamationDiamondFill className="text-red-500 mr-2 text-lg" /> {error}
                </div>
            )}
            {loading && (
                <div className="bg-gray-100 mb-5 p-4 text-sm rounded-lg flex items-center">
                    <ImSpinner2 className="mr-2 animate-spin" /> Mohon Tunggu...
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input type="text" name="email" onChange={handleChange} placeholder="emilys" className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-hijau/20" />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" name="password" onChange={handleChange} placeholder="********" className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-hijau/20" />
                </div>
                <button type="submit" className="w-full bg-hijau hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300">
                    Login
                </button>
            </form>

            <div className="mt-4 text-center text-sm">
                <Link to="/forgot" className="text-hijau hover:underline">Lupa Password?</Link>
                <span className="text-gray-400 mx-2">•</span>
                <Link to="/register" className="text-hijau hover:underline">Daftar Akun</Link>
            </div>
        </div>
    );
}
