import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout() {
    return (
        <div id="app-container" className="bg-[#f4f7f6] min-h-screen flex w-full font-inter">
            <div id="layout-wrapper" className="flex flex-col w-full h-screen overflow-hidden">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <div id="main-content" className="flex-1 overflow-y-auto px-6 pb-10">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}