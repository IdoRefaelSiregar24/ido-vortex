// ═══════════════════════════════════════════════════════════
// BiodataDiri.jsx — Parent Component
//
// Tree:
//  BiodataDiri
//  ├── Navbar       (child 1) — top nav bar
//  ├── HeroLeft     (child 2) — title, quote, CTA, info blocks
//  ├── HeroRight    (child 3) — photo + floating profile chip
//  ├── TabSection   (child 4) — Profile/Skills/Projects/Education
//  ├── BottomBar    (child 5) — booking link + pemateri card
//  └── SocialBar    (child 6) — floating vertical social links
// ═══════════════════════════════════════════════════════════

import "./custom.css";

import Navbar from "./components/Navbar";
import HeroLeft from "./components/HeroLeft";
import HeroRight from "./components/HeroRight";
import TabSection from "./components/TabSection";
import BottomBar from "./components/BottomBar";
import SocialBar from "./components/SocialBar";

export default function BiodataDiri() {
  return (
    <div className="page">

      {/* 1 — Navigation */}
      <Navbar />

      {/* Hero: two-column layout */}
      <section className="hero">
        {/* 2 — Left: text content */}
        <HeroLeft />

        {/* 3 — Right: photo showcase */}
        <HeroRight />
      </section>

      {/* 4 — Tab content section */}
      <TabSection />

      {/* 5 — Footer bar */}
      <BottomBar />

      {/* 6 — Floating social sidebar */}
      <SocialBar />

    </div>
  );
}
