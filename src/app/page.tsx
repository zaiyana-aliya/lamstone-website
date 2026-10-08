import Image from "next/image";
import Link from "next/link";
import CTAButton from "@/components/CTAButton";
import MotionReveal from "@/components/MotionReveal";
import InvestCTASection from "@/components/InvestCTASection";
import HeroSection from "@/components/HeroSection";
import HomeDivisionCards from "@/components/home/HomeDivisionCards";
import HomeCoreDivisions from "@/components/home/HomeCoreDivisions";
import HomePerfumesBanner from "@/components/home/HomePerfumesBanner";
import HomeLameBanner from "@/components/home/HomeLameBanner";
import HomePhotoBand from "@/components/home/HomePhotoBand";
import { ArrowRight, Sparkles, Building2, ExternalLink, ShieldCheck, Award, Cross, Droplets, ChevronRight } from "lucide-react";

export default function HomePage() {
  return (
    <div data-theme="home" className="flex flex-col w-full bg-[var(--bg)] text-[var(--body)]">
      {/* Combined Hero + Navy Stat Band Viewport Flex Container */}
      <div className="flex flex-col min-h-[calc(100vh-90px)]">
        {/* 1. Premium Refined Hero */}
        <HeroSection />

        {/* 2. Category Strip / Core Divisions Stat Card Row — Full-Width Editorial Dark Navy Band */}
        <section className="relative overflow-hidden bg-[image:var(--dark-gradient)] flex-1 flex items-center min-h-[220px] sm:min-h-[240px] py-8 sm:py-10 lg:py-12 border-b border-white/10 text-white">
          {/* Subtle background texture: storefront photography at 18% opacity blended into the navy */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
            <Image
              src="/images/banners/pharmacy-storefront.jpeg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center opacity-18 mix-blend-luminosity filter brightness-90 contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071224]/85 via-[#0E2244]/75 to-[#071224]/85" />
          </div>

          {/* Faint diagonal two-line stripe texture (white + gold at ~4% opacity) tucked into top-right corner */}
          <div className="pointer-events-none absolute top-0 right-0 w-48 sm:w-64 lg:w-80 h-36 sm:h-48 lg:h-56 overflow-hidden select-none z-0">
            <svg
              viewBox="0 0 200 150"
              preserveAspectRatio="none"
              className="w-full h-full"
              fill="none"
            >
              {/* White stripe (~4% opacity) */}
              <polygon points="200,30 200,44 80,150 66,150" fill="#ffffff" fillOpacity="0.04" />
              {/* Accent stripe (~4% opacity) */}
              <polygon points="200,54 200,68 104,150 90,150" fill="var(--accent-secondary)" fillOpacity="0.04" />
            </svg>
          </div>

          <div className="mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12 relative z-20">
            <HomeDivisionCards />
          </div>
        </section>
      </div>

      {/* 3. Section: Our Core Divisions */}
      <section id="divisions" className="relative bg-transparent pt-6 sm:pt-10 lg:pt-12 pb-16 sm:pb-20 lg:pb-24 scroll-mt-20">
        <div className="mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12 space-y-12 sm:space-y-16">
          <MotionReveal direction="up">
            <div className="max-w-2xl space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="h-[3.5px] w-8 bg-[var(--accent)] rounded-full" />
                <span className="text-xs uppercase tracking-widest font-bold text-[var(--accent-text)] font-sans drop-shadow-[0_1px_1px_var(--shadow-color)]">
                  Our Divisions
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[var(--heading)] tracking-tight">
                Our Core Divisions
              </h2>
              <p className="text-base sm:text-lg text-[var(--body)] font-light leading-relaxed">
                Lamstone operates at the intersection of healthcare, reliability and cosmetic innovation.
              </p>
            </div>
          </MotionReveal>

          {/* Dynamic Core Division Cards */}
          <HomeCoreDivisions />
        </div>
      </section>

      {/* 4. Lamé Haute Parfumerie Feature — Dedicated Perfumes Banner */}
      <HomePerfumesBanner />

      {/* 5. Lamé Clinical & Luxury Beauty Feature — Dynamic Signature Lamé Banner */}
      <HomeLameBanner />

      {/* 5. Invest in Growth with Lamstone — Dynamic Parallax Strategic Investment Card */}
      <InvestCTASection />

      {/* 6. Full-Width Photo Band before Footer — Dynamic Admin-Editable */}
      <HomePhotoBand />
    </div>
  );
}
