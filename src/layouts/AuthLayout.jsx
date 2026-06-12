import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Loading from "../components/Loading";

export default function AuthLayout() {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate("/", { replace: true });
            } else {
                setChecking(false);
            }
        });
    }, [navigate]);

    if (checking) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-inter">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md">
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-2xl font-bold mb-3">
                        +
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        Apotek Keluarga
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Portal Manajemen Farmasi</p>
                </div>

                <Outlet />

                <p className="text-center text-xs text-gray-400 mt-8">
                    © 2026 Apotek Keluarga. All rights reserved.
                </p>
            </div>
        </div>
    );
}

