const INFO_BLOCKS = [
  { label: "Status",     value: "Undergraduate",  sub: "Information Systems" },
  { label: "Focus",      value: "Web & Data",     sub: "Frontend · Analyst"  },
  { label: "Open To",    value: "Internship",     sub: "Project · Freelance" },
];

export default function HeroLeft() {
  return (
    <div className="hero-left">

      {/* Pill tag */}
      <div className="hero-tag">
        <span className="hero-tag-dot" />
        Information Systems Student &amp; Aspiring Developer
      </div>

      {/* Main title */}
      <h1 className="hero-title">
        Ido Refael Siregar <span className="hero-title--serif">Digital</span>
        <br />
        Portfolio <span className="hero-title--arrow">→</span>
      </h1>

      {/* Quote / sub */}
      <p className="hero-sub">
        "Exploring technology through code and data — building web applications,
        analyzing problems, and turning ideas into meaningful digital solutions."
      </p>

      {/* CTA row */}
      <div className="cta-row">
        <button className="btn-primary">
          View My Work <span className="btn-icon">↗</span>
        </button>
        <a href="#about" className="btn-secondary">About Me</a>
      </div>

      {/* Info blocks */}
      <div className="info-row">
        {INFO_BLOCKS.map((b) => (
          <div className="info-block" key={b.label}>
            <span className="info-label">{b.label}</span>
            <span className="info-value">{b.value}</span>
            <span className="info-sub">{b.sub}</span>
          </div>
        ))}
      </div>

    </div>
  );
}