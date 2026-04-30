// ─────────────────────────────────────────────
// HeroRight.jsx — Child Component 3
// Right column: blue backdrop, photo, profile chip
// ─────────────────────────────────────────────

const PHOTO_SRC = "/images/profile.png";

export default function HeroRight() {
  return (
    <div className="hero-right">

      {/* Blue card backdrop */}
      <div className="photo-backdrop">
        <div className="geo-white" />
      </div>

      {/* Photo + floating chip */}
      <div className="photo-wrap">
        <img
          src={PHOTO_SRC}
          alt="Ido Refael Siregar"
          className="photo-img"
        />

        {/* Floating profile chip */}
        <div className="profile-chip">
          <div className="chip-avatar">
            <img src={PHOTO_SRC} alt="Ido Refael Siregar" />
          </div>
          <div className="chip-info">
            <p className="chip-name">Ido Refael Siregar</p>
            <p className="chip-role">[ Frontend Dev · UI Designer ]</p>
          </div>
        </div>
      </div>

    </div>
  );
}
