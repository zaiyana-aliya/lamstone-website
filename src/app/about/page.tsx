import type { Metadata } from "next";
import LeadershipSection from "@/components/LeadershipSection";
import AboutHeroSection from "@/components/about/AboutHeroSection";
import AboutStorySection from "@/components/about/AboutStorySection";
import AboutVisionMissionSection from "@/components/about/AboutVisionMissionSection";
import AboutValuesSection from "@/components/about/AboutValuesSection";
import AboutCampusSection from "@/components/about/AboutCampusSection";
import AboutMilestonesSection from "@/components/about/AboutMilestonesSection";
import AboutPhotoBandSection from "@/components/about/AboutPhotoBandSection";
import AboutWhyLamstoneSection from "@/components/about/AboutWhyLamstoneSection";

export const metadata: Metadata = {
  title: "About Us — Lamstone HealthCare",
  description:
    "Pioneering a holistic approach to wellness by integrating reliable pharmaceutical services with premium cosmetic solutions.",
};

export default function AboutPage() {
  return (
    <div data-theme="about" className="flex flex-col w-full bg-[var(--bg)] text-[var(--body)]">
      {/* Section 1: Dynamic Hero (Architectural Backdrop, Statements & Credibility Badges) */}
      <AboutHeroSection />

      {/* Gentle Hairline Divider between Blue Hero and Cream Story */}
      <div
        className="w-full h-[1px] bg-[#0F2A4A]/15"
        aria-hidden="true"
      />

      {/* Section 2: Dynamic "From a Vision to a Healthier Future" (Our Story) */}
      <AboutStorySection />

      {/* Section 3: Dynamic "Our Vision & Mission" (Vision & Mission Dual Cards) */}
      <AboutVisionMissionSection />

      {/* Section 3.5: Dynamic Full-Width Visual Band (Ecosystem Architectural Photo Band) */}
      <AboutPhotoBandSection />

      {/* Section 4: Dynamic "Explore How Lamstone Shapes Us" (OUR VALUES) */}
      <AboutValuesSection />

      {/* Section 5: Dynamic "A Modern Infrastructure" (OUR CAMPUS) */}
      <AboutCampusSection />

      {/* Section 6: Dynamic "OUR GROWTH ROADMAP" (PROGRESS & MILESTONES) */}
      <AboutMilestonesSection />

      {/* Section 6.5: CORE LEADERSHIP (MD'S NOTE) */}
      <LeadershipSection />

      {/* Section 7: "WHY LAMSTONE?" (THE LAMSTONE DIFFERENCE) */}
      <AboutWhyLamstoneSection />
    </div>
  );
}
