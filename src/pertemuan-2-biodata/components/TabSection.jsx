// ─────────────────────────────────────────────
// TabSection.jsx — Fully Synced with CV
// ─────────────────────────────────────────────
import { useState } from "react";

// ── SKILLS (REALISTIC & MATCH CV) ─────────────

const SKILLS = [
  { icon: "🌐", name: "HTML/CSS" },
  { icon: "🟨", name: "JavaScript" },
  { icon: "🐘", name: "PHP" },
  { icon: "🧩", name: "CodeIgniter 4" },
  { icon: "🛠️", name: "Laravel" },
  { icon: "🗄️", name: "MySQL" },
  { icon: "📊", name: "Data Visualization" },
  { icon: "📈", name: "Business Analysis" },
  { icon: "🎨", name: "UI/UX Design (Figma)" },
  { icon: "🐙", name: "Git/GitHub" },
];

// ── PROJECTS (AMBIL DARI CV LANGSUNG) ─────────

const PROJECTS = [
  {
    year: "2025",
    title: "Kenari Cake & Bakery System",
    stack: "CodeIgniter · MySQL · Chart.js",
    desc: "End-to-end web ordering system with multi-role authentication, admin dashboard, and sales visualization.",
  },
  {
    year: "2025",
    title: "Sejiwa – Mental Health Platform",
    stack: "CodeIgniter 4 · OTP Auth · MySQL",
    desc: "Postpartum mental health platform with secure OTP authentication and CMS for content delivery.",
  },
  {
    year: "2025",
    title: "Village Project Monitoring System",
    stack: "Laravel · MySQL · Leaflet.js",
    desc: "Infrastructure monitoring system with progress tracking, mapping integration, and decision-support dashboard.",
  },
  {
    year: "2026",
    title: "IKATANI Management System",
    stack: "Laravel · CMS · MySQL",
    desc: "Alumni & content management system with role-based dashboard and dynamic publishing workflow.",
  },
  {
    year: "2024",
    title: "DiffableCare (UI/UX)",
    stack: "Figma · Design Thinking",
    desc: "Mobile app design for monitoring special needs children with user research and usability testing.",
  },
];

// ── EDUCATION ────────────────────────────────

const EDUCATION = [
  {
    period: "2024–2028",
    degree: "D4 Information Systems",
    school: "Politeknik Caltex Riau",
    note: "Focus: Web Development, System Analysis, Data & Business Intelligence",
  },
  {
    period: "Ongoing",
    degree: "Self Learning & Certification",
    school: "Independent Study",
    note: "React, Data Analysis, System Design, UI/UX",
  },
];

// ── PROFILE PANEL (SYNC SUMMARY CV) ──────────

function ProfilePanel() {
  return (
    <div className="tab-profile">
      <p className="p-bio">
        Hi! I'm <strong>Ido Refael Siregar</strong>, a fourth-semester Information Systems
        student at Politeknik Caltex Riau with a strong interest in web application
        development and UI/UX design.
      </p>
      <p className="p-bio">
        I have experience building fullstack web applications using PHP frameworks such
        as Laravel and CodeIgniter, as well as designing user-centered interfaces based on
        research and usability testing. I enjoy solving problems, analyzing systems, and
        continuously improving my technical and analytical skills.
      </p>

      <div className="p-stats">
        {[
          { n: "5+",  l: "Projects Built" },
          { n: "3+",  l: "Frameworks Used" },
          { n: "1",   l: "National Finalist" },
        ].map((s) => (
          <div className="p-stat" key={s.l}>
            <span className="p-stat-n">{s.n}</span>
            <span className="p-stat-l">{s.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PANELS ───────────────────────────────────

function SkillsPanel() {
  return (
    <div className="skills-grid">
      {SKILLS.map((s) => (
        <div className="skill-card" key={s.name}>
          <span className="skill-icon">{s.icon}</span>
          <span className="skill-name">{s.name}</span>
        </div>
      ))}
    </div>
  );
}

function ProjectsPanel() {
  return (
    <div className="projects-list">
      {PROJECTS.map((p) => (
        <div className="project-item" key={p.title}>
          <span className="project-year">{p.year}</span>
          <div className="project-body">
            <p className="project-title">{p.title}</p>
            <p className="project-stack">{p.stack}</p>
            <p className="project-desc">{p.desc}</p>
          </div>
          <span className="project-arrow">↗</span>
        </div>
      ))}
    </div>
  );
}

function EducationPanel() {
  return (
    <div className="edu-list">
      {EDUCATION.map((e) => (
        <div className="edu-item" key={e.degree}>
          <span className="edu-period">{e.period}</span>
          <div className="edu-body">
            <p className="edu-degree">{e.degree}</p>
            <p className="edu-school">{e.school}</p>
            <p className="edu-note">{e.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── MAIN ─────────────────────────────────────

const TABS = [
  { key: "profile",   label: "Profile",   Panel: ProfilePanel },
  { key: "skills",    label: "Skills",    Panel: SkillsPanel },
  { key: "projects",  label: "Projects",  Panel: ProjectsPanel },
  { key: "education", label: "Education", Panel: EducationPanel },
];

export default function TabSection() {
  const [active, setActive] = useState("profile");
  const { Panel } = TABS.find((t) => t.key === active);

  return (
    <section className="tabs-section" id="portfolio">
      <div className="tabs-header">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`t-btn${active === t.key ? " t-btn--active" : ""}`}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="tab-panel-wrap">
        <Panel />
      </div>
    </section>
  );
}