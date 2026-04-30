import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
                <div className="flex items-center justify-center mb-6">
                    <h1 className="text-3xl font-poppins font-extrabold text-gray-800">
                        <span className="text-hijau">Apotek</span>
                        <span className="text-gray-800"> Sehat</span>
                    </h1>
                </div>

                <Outlet />

                <p className="text-center text-sm text-gray-400 mt-6">
                    © 2026 Apotek Sehat Pekanbaru. All rights reserved.
                </p>
            </div>
        </div>
    )
}
