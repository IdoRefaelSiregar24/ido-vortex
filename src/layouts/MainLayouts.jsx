import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";
import Loading from "../components/Loading";

export default function MainLayout() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8F9FA] font-lato">
      {/* Sidebar: Sisi Kiri */}
      <Sidebar user={profile} />

      {/* Konten: Sisi Kanan */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header user={profile} />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet context={{ user: profile }} />
        </main>
      </div>
    </div>
  );
}