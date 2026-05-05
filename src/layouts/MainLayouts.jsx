import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8F9FA] font-lato">
      {/* Sidebar: Sisi Kiri */}
      <Sidebar />

      {/* Konten: Sisi Kanan */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}