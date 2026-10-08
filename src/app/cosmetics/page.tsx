import type { Metadata } from "next";
import CosmeticsHeroSection from "@/components/cosmetics/CosmeticsHeroSection";
import CosmeticsBrandsSection from "@/components/cosmetics/CosmeticsBrandsSection";
import CosmeticsCategoriesSection from "@/components/cosmetics/CosmeticsCategoriesSection";
import CosmeticsCtaSection from "@/components/cosmetics/CosmeticsCtaSection";
import CosmeticsVisualBand from "@/components/cosmetics/CosmeticsVisualBand";
import MotionReveal from "@/components/MotionReveal";

export const metadata: Metadata = {
  title: "Cosmetics Division — Lamstone HealthCare",
  description:
    "Lamstone Cosmetic Division is dedicated to bringing premium skincare, beauty, and personal care solutions to consumers through a robust distribution network.",
};

export default function CosmeticsPage() {
  return (
    <div data-theme="cosmetics" className="flex flex-col w-full bg-[var(--bg)] text-[var(--body)]">
      {/* 1. Dynamic Cosmetics Division Hero */}
      <CosmeticsHeroSection />

      {/* 2. Multi-Brand Portfolio — 9 Recognized Global Brands */}
      <section className="relative bg-[#B31942] py-24 sm:py-28 lg:py-32 border-t border-[#0F2A4A]/10 border-b border-[#0F2A4A]/10">
        <div className="mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12 space-y-12">
          <MotionReveal direction="up">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="flex items-center justify-center gap-2.5">
                <span className="h-[1px] w-8 bg-[#F0D9A0]/70" />
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-bold text-white/90 font-sans">
                  Authorized Distribution
                </span>
                <span className="h-[1px] w-8 bg-[#F0D9A0]/70" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                Our Multi-Brand Portfolio
              </h2>
              {/* Thin gold hairline with a small dot */}
              <div className="flex items-center justify-center gap-1.5 pt-1" aria-hidden="true">
                <span className="w-16 h-[1.5px] bg-[#F0D9A0]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0D9A0]" />
              </div>
              <p className="text-base sm:text-lg text-white/90 font-normal max-w-2xl mx-auto leading-relaxed pt-1">
                Partnered with globally established beauty, dermatological, and personal care manufacturers.
              </p>
            </div>
          </MotionReveal>

          <CosmeticsBrandsSection />
        </div>
      </section>

      {/* 3. Global Brands Band: 9+ Global Brands, One Trusted Distributor */}
      <CosmeticsVisualBand />

      {/* 4. Product Categories */}
      <section className="relative overflow-hidden bg-[#173A6B] py-24 sm:py-28 lg:py-32 border-t border-[#0F2A4A]/20 border-b border-[#0F2A4A]/20">
        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12 space-y-16">
          <MotionReveal direction="up">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="h-[1px] w-8 bg-[#B8934A]/50" />
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-bold text-[#B8934A] font-sans">
                  Product Pillars
                </span>
                <span className="h-[1px] w-8 bg-[#B8934A]/50" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                Product Categories
              </h2>
              {/* Thin gold hairline with dot */}
              <div className="flex items-center gap-1.5 pt-1" aria-hidden="true">
                <span className="w-16 h-[1.5px] bg-[#B8934A]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8934A]" />
              </div>
            </div>
          </MotionReveal>

          <CosmeticsCategoriesSection />
        </div>
      </section>

      {/* 5. Dynamic CTA Banner */}
      <CosmeticsCtaSection />
    </div>
  );
}
