import type { Metadata } from "next";
import CareersHeroSection from "@/components/careers/CareersHeroSection";
import CareersJobsSection from "@/components/careers/CareersJobsSection";
import FullWidthPhotoBand from "@/components/FullWidthPhotoBand";

export const metadata: Metadata = {
  title: "Careers at Lamstone — Join Our Growing Team",
  description:
    "Explore career opportunities at Lamstone HealthCare. Join our dynamic team across retail pharmacy, cosmetics distribution, and corporate operations.",
};

export default function CareersPage() {
  return (
    <div data-theme="careers" className="flex flex-col w-full bg-[#F1E2CC] text-[var(--body)] selection:bg-[#0F2A4A]/10 selection:text-[#0F2A4A]">
      {/* 1. Dynamic Careers Hero Section */}
      <CareersHeroSection />

      {/* Full-Width Visual Band: Corporate Team & Workplace Photo Band */}
      <FullWidthPhotoBand
        imageUrl="/images/careers/careers-team-collaborating.jpg"
        imageAlt="Lamstone Healthcare multidisciplinary corporate team collaborating in modern office"
        headline="Join Our Growing Team Across Kerala"
        overlayClass="bg-[linear-gradient(to_right,rgba(15,42,74,0.85)_0%,rgba(15,42,74,0.80)_55%,rgba(15,42,74,0.40)_100%)]"
        accentColor="bg-[#B8934A]"
        accentTextColor="text-[#B8934A]"
        headlineColor="text-white [text-shadow:0_2px_12px_rgba(10,31,61,0.5)] font-serif"
        subheadlineColor="text-white/85"
        ornamentalDividerWidth="w-16 sm:w-20"
        objectPosition="center 30%"
        className="border-t border-[#0F2A4A]/20"
      />

      {/* 2. Job Postings & Culture Values Section */}
      <CareersJobsSection />
    </div>
  );
}
