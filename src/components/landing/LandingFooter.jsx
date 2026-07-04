import { Link, useNavigate, useLocation } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const footerLinks = {
  layanan: [
    { label: "Katalog Obat", to: "/member-obat" },
    { label: "Konsultasi Apoteker", to: "/" },
    { label: "Antar Obat Express", to: "/" },
    { label: "Cek Kesehatan", to: "/" },
    { label: "Resep Digital", to: "/" },
  ],
  member: [
    { label: "Daftar Member", to: "/register" },
    { label: "Masuk Akun", to: "/login" },
    { label: "Dashboard Member", to: "/member-dashboard" },
    { label: "Poin & Reward", to: "/member-dashboard" },
    { label: "Kartu Digital", to: "/health-card" },
  ],
  perusahaan: [
    { label: "Tentang Kami", tab: "profile" },
    { label: "Layanan Kami", tab: "services" },
    { label: "Hubungi Kami", tab: "contact" },
    { label: "Kebijakan Privasi", to: "/" },
    { label: "Syarat & Ketentuan", to: "/" },
  ],
};

/**
 * LandingFooter — Multi-column pharmacy footer
 * @param {function} setActiveTab - Tab setter for same-page navigation
 */
export default function LandingFooter({ setActiveTab }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSectionNav = (tabName) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { activeTab: tabName } });
    } else {
      setActiveTab(tabName);
    }
  };

  return (
    <footer className="bg-cyprus text-white">
      {/* Main Footer Grid */}
      <div className="w-full px-6 md:px-12 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand Column */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-ocean-green rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-ocean-green/30">
              +
            </div>
            <div>
              <p className="font-extrabold text-white leading-tight">Apotek Sehat</p>
              <p className="text-xs text-ocean-green font-semibold">Pekanbaru</p>
            </div>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">
            Apotek modern berbasis digital dengan layanan farmasi klinis terpercaya. 
            Menjaga kesehatan Anda dan keluarga adalah prioritas kami.
          </p>

          {/* Contact Info */}
          <div className="space-y-2.5 text-sm text-white/60">
            <div className="flex items-start gap-2.5">
              <MapPin size={14} className="text-ocean-green mt-0.5 shrink-0" />
              <span>Jl. Jenderal Sudirman No. 124, Pekanbaru, Riau</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone size={14} className="text-ocean-green shrink-0" />
              <span>+62 812-3456-7890</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={14} className="text-ocean-green shrink-0" />
              <span>support@apoteksehat.com</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock size={14} className="text-ocean-green shrink-0" />
              <span>Buka 24 Jam — Setiap Hari</span>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex items-center gap-3 pt-1">
            {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-ocean-green flex items-center justify-center transition-colors duration-200"
                aria-label="social"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Layanan */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
            Layanan
          </h4>
          <ul className="space-y-2.5">
            {footerLinks.layanan.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="text-sm text-white/60 hover:text-ocean-green transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Member */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
            Program Member
          </h4>
          <ul className="space-y-2.5">
            {footerLinks.member.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="text-sm text-white/60 hover:text-ocean-green transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Perusahaan + Newsletter */}
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Perusahaan
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.perusahaan.map(({ label, to, tab }) =>
                tab ? (
                  <li key={label}>
                    <button
                      onClick={() => handleSectionNav(tab)}
                      className="text-sm text-white/60 hover:text-ocean-green transition-colors cursor-pointer"
                    >
                      {label}
                    </button>
                  </li>
                ) : (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-white/60 hover:text-ocean-green transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-bold text-white">📬 Info Promo Terbaru</p>
            <p className="text-[11px] text-white/50">
              Daftarkan email untuk dapatkan notifikasi promo eksklusif
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="email@anda.com"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/30 outline-none focus:border-ocean-green/50 transition-colors"
              />
              <button className="px-3 py-2 bg-ocean-green hover:bg-surf-crest hover:text-cyprus text-white text-xs font-bold rounded-lg transition-all cursor-pointer">
                OK
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-5 px-6">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© 2026 Apotek Sehat Pekanbaru. Semua hak dilindungi.</p>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-ocean-green rounded-full animate-pulse" />
            <span>Layanan Online • Terverifikasi BPOM</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
