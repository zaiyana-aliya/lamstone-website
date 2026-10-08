import type { Metadata } from "next";
import MotionReveal from "@/components/MotionReveal";
import LameHeroSection from "@/components/lame/LameHeroSection";
import LameProductsSection from "@/components/lame/LameProductsSection";
import LameNotifySection from "@/components/LameNotifySection";
import LameQuoteCtaSection from "@/components/lame/LameQuoteCtaSection";
import FullWidthPhotoBand from "@/components/FullWidthPhotoBand";

export const metadata: Metadata = {
  title: "Lamé — Haute Dermocosmetics & Skincare",
  description:
    "Born from pharmaceutical expertise, Lamé bridges clinical efficacy and luxurious self-care with rigorously formulated skincare and fragrances.",
};

export default function LamePage() {
  return (
    <div data-theme="lame" className="flex flex-col w-full bg-[#F1E2CC] text-[var(--body)] selection:bg-[#0F2A4A]/10 selection:text-[#0F2A4A]">
      {/* 1. Dynamic Luxury Hero (Warm Sand #F1E2CC) */}
      <LameHeroSection />

      {/* 2. Signature Collection — 4 Product Cards (Solid Vibrant Red #B31942) */}
      <section
        id="collection"
        className="relative overflow-hidden bg-[#B31942] py-24 sm:py-28 lg:py-32 border-t border-[#0F2A4A]/10 border-b border-[#0F2A4A]/10 scroll-mt-24"
      >
        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12 space-y-12 sm:space-y-14">
          <MotionReveal direction="up">
            <div className="text-center max-w-3xl mx-auto space-y-3.5">
              <div className="flex items-center justify-center gap-2.5 sm:gap-3">
                <span className="h-[1px] w-6 sm:w-10 bg-[#F0D9A0]/70" />
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-bold text-white/90 font-sans">
                  Formulated For Efficacy
                </span>
                <span className="h-[1px] w-6 sm:w-10 bg-[#F0D9A0]/70" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                Signature Collection
              </h2>
              {/* Thin gold hairline with a small dot */}
              <div className="flex items-center justify-center gap-1.5 pt-1" aria-hidden="true">
                <span className="w-16 h-[1.5px] bg-[#F0D9A0]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0D9A0]" />
              </div>
              <p className="text-base sm:text-lg text-white/90 font-normal leading-relaxed max-w-2xl mx-auto pt-1">
                Carefully curated active ingredients designed to replenish, refine, and harmonize skin health.
              </p>
            </div>
          </MotionReveal>

          {/* 4-Card Grid with Per-Product Notify Modal */}
          <LameProductsSection />
        </div>
      </section>

      {/* 3. Launch Notification Form (Light Blue Tint #EAEFF5 matching About's "Our Story") */}
      <section className="relative overflow-hidden bg-[#EAEFF5] py-20 sm:py-24 lg:py-28 border-b border-[#0F2A4A]/10">
        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12">
          <LameNotifySection />
        </div>
      </section>

      {/* 4. Full-Width Visual Band: Green Silk & Products with Dark Navy Overlay */}
      <FullWidthPhotoBand
        imageUrl="/images/lame/lame-products-hero.jpg"
        imageAlt="Lamé signature dermocosmetics and fragrances on emerald green silk"
        headline="Beauty Inspired By Nature"
        overlayClass="bg-[#0F2A4A]/75"
        accentColor="bg-[#B8934A]"
        accentTextColor="text-[#F0D9A0]"
        objectPosition="center 70%"
      />

      {/* 5. Dynamic Closing Quote & Retail Inquiry CTA (Warm Ivory #FBF7F0) */}
      <LameQuoteCtaSection />
    </div>
  );
}
