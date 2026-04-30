import { useNavigate } from "react-router-dom";

export default function ErrorPage({ kodeError, deskripsiError }) {
    const navigate = useNavigate();
    const errorMessages = { 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Halaman Tidak Ditemukan" };
    const label = errorMessages[kodeError] ?? "Error Tidak Diketahui";

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8">
            <div className="text-[120px] font-bold text-teal-100 leading-none">{kodeError}</div>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">{label}</h2>
            <p className="text-gray-500 mt-2 max-w-md">{deskripsiError}</p>
            <button onClick={() => navigate("/")} className="mt-8 px-8 py-3 bg-hijau text-white font-bold rounded-xl hover:bg-teal-700 transition-all shadow-lg">
                ← Kembali ke Dashboard
            </button>
        </div>
    );
}

export const ERROR_CONFIG = {
    404: { kodeError: 404, deskripsiError: "Halaman yang kamu cari tidak ditemukan." },
    400: { kodeError: 400, deskripsiError: "Ada yang salah dengan permintaanmu." },
    401: { kodeError: 401, deskripsiError: "Kamu harus login terlebih dahulu." },
    403: { kodeError: 403, deskripsiError: "Kamu tidak punya akses ke halaman ini." },
};
