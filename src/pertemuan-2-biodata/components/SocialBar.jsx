// ─────────────────────────────────────────────
// SocialBar.jsx — Child Component 6
// Floating vertical social media links on the
// right edge of the viewport
// ─────────────────────────────────────────────

const SOCIALS = [
  { icon: "in",  label: "LinkedIn", href: "https://linkedin.com" },
  { icon: "gh",  label: "GitHub",   href: "https://github.com"   },
  { icon: "be",  label: "Behance",  href: "https://behance.net"  },
  { icon: "ig",  label: "Instagram",href: "https://instagram.com"},
];

export default function SocialBar() {
  return (
    <aside className="social-bar">
      {SOCIALS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          className="social-link"
          target="_blank"
          rel="noreferrer"
          aria-label={s.label}
          title={s.label}
        >
          <span className="social-icon">{s.icon}</span>
          <span className="social-label">{s.label}</span>
        </a>
      ))}
      <div className="social-line" />
    </aside>
  );
}
