import type { Metadata } from "next";
import InvestHeroSection from "@/components/invest/InvestHeroSection";
import InvestWhySection from "@/components/invest/InvestWhySection";
import InvestmentOpportunitiesSection from "@/components/InvestmentOpportunitiesSection";
import InvestPathwaysSection from "@/components/invest/InvestPathwaysSection";
import InvestCtaBannerSection from "@/components/invest/InvestCtaBannerSection";
import FullWidthPhotoBand from "@/components/FullWidthPhotoBand";

export const metadata: Metadata = {
  title: "Invest in Lamstone — Healthcare Investment Opportunities",
  description:
    "Join our rapidly expanding pharmacy chain and beauty ecosystem. Transparent, secure, and lucrative investment partnership models for forward-thinking investors.",
};

export default function InvestPage() {
  return (
    <div data-theme="invest" className="flex flex-col w-full bg-[var(--bg)] text-[var(--body)]">
      {/* 1. Dynamic Invest Hero */}
      <InvestHeroSection />

      {/* 2. Dynamic Why Invest Section */}
      <InvestWhySection />

      {/* Full-Width Visual Band: Corporate Skyline & Architecture Photo Band */}
      <FullWidthPhotoBand
        imageUrl="/images/invest/invest-corporate-skyline-clean.jpg"
        imageAlt="Modern commercial architectural skyline representing strategic growth and capital assets"
        headline="500+ Target Pharmacies, 14 Districts"
        overlayClass="bg-[#0F2A4A]/75"
        accentColor="bg-[#B8934A]"
        accentTextColor="text-[#F0D9A0]"
        objectPosition="center 30%"
      />

      {/* 3. Dynamic Current Investment Opportunities Grid */}
      <InvestmentOpportunitiesSection />

      {/* 4. Dynamic Strategic Growth Model & Pathways Section */}
      <InvestPathwaysSection />

      {/* 5. Dynamic CTA Banner */}
      <InvestCtaBannerSection />
    </div>
  );
}
