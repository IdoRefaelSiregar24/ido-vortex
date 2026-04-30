// ─────────────────────────────────────────────
// BottomBar.jsx — Customized for Ido
// ─────────────────────────────────────────────

const PHOTO_SRC = "/images/profile.png";

export default function BottomBar() {
  return (
    <footer className="bottombar">

      {/* Left: contact link */}
      <div className="bb-left">
        <span className="bb-label">Contact</span>
        <a
          href="mailto:idosiregar2006@gmail.com"
          className="bb-link"
        >
          idosiregar2006@gmail.com
        </a>
      </div>

      <div className="bb-divider" />

      {/* Right: profile card */}
      <div className="bb-right">
        <span className="bb-label">Profile</span>
        <div className="bb-pemateri-card">
          <div className="bb-avatar">
            <img src={PHOTO_SRC} alt="Ido Refael Siregar" />
          </div>
          <div>
            <p className="bb-name">Ido Refael Siregar</p>
            <p className="bb-role">
              Information Systems Student · Web & Data Analyst
            </p>
          </div>
        </div>
      </div>

    </footer>
  );
}