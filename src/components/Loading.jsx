export default function Loading() {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-white">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-teal-600 text-lg font-semibold">Memuat...</p>
        </div>
    );
}
