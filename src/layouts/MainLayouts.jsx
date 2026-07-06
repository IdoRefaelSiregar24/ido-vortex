import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";
import Loading from "../components/Loading";

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("Dashboard");

  // Sync title when location changes as default fallback
  useEffect(() => {
    const getPageTitle = (pathname) => {
      if (pathname.startsWith('/dashboard')) return 'Dashboard';
      if (pathname.startsWith('/obat')) return 'Daftar Obat';
      if (pathname.startsWith('/transaksi')) return 'Transaction';
      if (pathname.startsWith('/order-management')) return 'Order Management';
      if (pathname.startsWith('/pelanggan')) return 'Customers';
      if (pathname.startsWith('/products/')) return 'Product Detail';
      if (pathname.startsWith('/products')) return 'Product List';
      if (pathname.startsWith('/components')) return 'Components';
      if (pathname.startsWith('/user-management')) return 'User Management';
      if (pathname.startsWith('/coupon')) return 'Coupon Codes';
      if (pathname.startsWith('/medical-records')) return 'Medical Records';
      return 'Dashboard';
    };
    setPageTitle(getPageTitle(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!currentSession) {
        navigate("/login", { replace: true });
        return;
      }

      if (mounted) {
        supabase
          .from("profiles")
          .select("*")
          .eq("id", currentSession.user.id)
          .single()
          .then(({ data: profileData, error }) => {
            if (mounted) {
              if (profileData) {
                if (profileData.role === "member") {
                  navigate("/member-dashboard", { replace: true });
                  return;
                }
                setProfile(profileData);
              } else {
                const fallbackRole = currentSession.user.user_metadata?.role || "staff";
                if (fallbackRole === "member") {
                  navigate("/member-dashboard", { replace: true });
                  return;
                }
                setProfile({
                  full_name: currentSession.user.user_metadata?.full_name || "User",
                  email: currentSession.user.email,
                  role: fallbackRole
                });
              }
              setLoading(false);
            }
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!newSession) {
        navigate("/login", { replace: true });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8F9FA] font-lato relative">
      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar: Sisi Kiri */}
      <Sidebar user={profile} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Konten: Sisi Kanan */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header user={profile} title={pageTitle} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet context={{ user: profile, setPageTitle }} />
        </main>
      </div>
    </div>
  );
}
