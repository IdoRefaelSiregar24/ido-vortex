// ─────────────────────────────────────────────
// Navbar.jsx — Customized for Ido
// ─────────────────────────────────────────────

export default function Navbar() {
  const links = [
    { label: "Portfolio", href: "#portfolio" },
    { label: "Projects",  href: "#projects"  },
    { label: "About",     href: "#about"     },
    { label: "Contact",   href: "#contact"   },
  ];

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-logo">
        <div className="nav-logo-mark">✦</div>
        <span className="nav-logo-text">Ido Refael Siregar</span>
      </div>

      {/* Links */}
      <ul className="nav-links">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="nav-link">{l.label}</a>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a href="mailto:idosiregar2006@gmail.com" className="btn-nav">
        Contact Me
      </a>
    </nav>
  );
}