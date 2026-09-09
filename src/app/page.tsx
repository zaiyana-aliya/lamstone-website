import Image from "next/image";
import Link from "next/link";
import CTAButton from "@/components/CTAButton";
import MotionReveal from "@/components/MotionReveal";
import InvestCTASection from "@/components/InvestCTASection";
import HeroSection from "@/components/HeroSection";
import { ArrowRight, Sparkles, Building2, ExternalLink, ShieldCheck, Award, Cross, Droplets } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Premium Refined Text-Only Hero */}
      <HeroSection />

      {/* 2. Trust-Indicator Row — Cleanly Positioned Below Hero Without Overlap */}
      <section className="relative bg-cream pt-10 sm:pt-14 lg:pt-16 pb-8 sm:pb-10 lg:pb-12 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 lg:gap-8">
            {[
              {
                division: "Pharmacy Chain",
                indicator: "500+ Pharmacies Statewide",
                icon: Building2,
                watermark: Cross,
              },
              {
                division: "Cosmetics Division",
                indicator: "Trusted Global Brands",
                icon: Sparkles,
                watermark: Sparkles,
              },
              {
                division: "Lamé",
                indicator: "Clinically Tested, Cruelty-Free",
                icon: ShieldCheck,
                watermark: Droplets,
              },
              {
                division: "Overall",
                indicator: "Trust & Innovation Since 2019",
                icon: Award,
                watermark: Award,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              const Watermark = item.watermark;
              return (
                <MotionReveal key={i} delay={i * 90} direction="up">
                  <div className="group relative overflow-hidden flex items-center gap-4 p-6 pt-7 rounded-2xl bg-gradient-to-br from-white via-[#FAFDFB] to-[#F1F7F3] border border-[#BDD4C4] shadow-[0_12px_32px_-4px_rgba(10,30,18,0.12),0_4px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_42px_-6px_rgba(10,30,18,0.2),0_8px_16px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 hover:border-[#8FB799] transition-all duration-300">
                    {/* Top Gold Accent Line (3px) Echoing Site Design Language */}
                    <div
                      className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-gold/70 via-gold to-gold/70 group-hover:from-gold group-hover:to-gold transition-colors duration-300"
                      aria-hidden="true"
                    />

                    {/* Faint Theme Watermark Pattern (5-7% opacity) */}
                    <div
                      className="pointer-events-none absolute -right-2.5 -bottom-2.5 text-primary/[0.05] group-hover:text-primary/[0.08] transition-all duration-500 ease-out group-hover:scale-105 select-none z-0"
                      aria-hidden="true"
                    >
                      <Watermark className="h-24 w-24 sm:h-28 sm:w-28 stroke-[1.25]" />
                    </div>

                    {/* Foreground Content */}
                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-2xs">
                      <Icon className="h-6 w-6 shrink-0 transition-colors" />
                    </div>
                    <div className="relative z-10 min-w-0 space-y-0.5">
                      <span className="block text-[11px] uppercase tracking-wider font-semibold text-gold truncate">
                        {item.division}
                      </span>
                      <span className="block font-serif font-medium text-base text-primary leading-snug">
                        {item.indicator}
                      </span>
                    </div>
                  </div>
                </MotionReveal>
              );
            })}
          </div>
        </div>

        {/* Transition into Strategic Focus: Smooth Cream-to-Ivory Gradient Fade & Gold Accent Seam */}
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-ivory z-0" />
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent z-10" />
      </section>

      {/* 3. Section: Our Core Divisions */}
      <section id="divisions" className="relative bg-ivory pt-8 sm:pt-10 lg:pt-12 pb-16 sm:pb-20 lg:pb-24 px-6 sm:px-8 lg:px-12 scroll-mt-20">
        <div className="mx-auto max-w-7xl space-y-16">
          <MotionReveal direction="up">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-gold" />
                <span className="text-xs uppercase tracking-widest font-semibold text-gold-dark">
                  Strategic Focus
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-primary tracking-tight">
                Our Core Divisions
              </h2>
              <p className="text-base sm:text-lg text-charcoal-muted font-light leading-relaxed">
                Lamstone operates at the intersection of healthcare reliability and cosmetic innovation.
              </p>
            </div>
          </MotionReveal>

          {/* Division Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Card 1 - Pharmacy Chain */}
            <MotionReveal delay={100} direction="up">
              <div className="group flex flex-col justify-between rounded-2xl border border-border-subtle bg-white p-8 sm:p-10 shadow-xs hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 ease-out">
                <div className="space-y-6">
                  {/* Premium Unsplash image */}
                  <div className="overflow-hidden rounded-2xl aspect-video relative bg-ivory">
                    <Image
                      src="/images/home/lamchain.png"
                      alt="Lamstone Pharmacy Chain retail network"
                      fill
                      className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-dark">
                    <Building2 className="h-4 w-4" />
                    <span>Healthcare Division</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-primary">
                    Lamstone Pharmacy Chain
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-charcoal-muted font-light">
                    Lamstone is a rapidly expanding network of premium pharmacies across Kerala, committed to delivering authentic medicines, expert healthcare guidance, and a comprehensive range of wellness and personal care products. With a vision to redefine pharmaceutical retail excellence, Lamstone is strategically acquiring and integrating 500+ pharmacies across the state, building a trusted healthcare ecosystem that combines accessibility, innovation, and customer-centric care under one unified brand experience.
                  </p>
                </div>
                <div className="pt-8">
                  <Link
                    href="/pharmacy-chain"
                    className="group/link inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-gold-dark transition-colors"
                  >
                    <span>Our Pharmacies</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            </MotionReveal>

            {/* Card 2 - Cosmetics Division */}
            <MotionReveal delay={220} direction="up">
              <div className="group flex flex-col justify-between rounded-2xl border border-border-subtle bg-white p-8 sm:p-10 shadow-xs hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 ease-out">
                <div className="space-y-6">
                  {/* Real Live Site Image */}
                  <div className="overflow-hidden rounded-2xl aspect-video relative bg-ivory">
                    <Image
                      src="/images/home/cosmetics.png"
                      alt="Lamstone Cosmetics Division branded personal care and beauty collection"
                      fill
                      className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent" />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-dark">
                    <Sparkles className="h-4 w-4" />
                    <span>Personal Care &amp; Beauty</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-primary">
                    Cosmetics Division
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-charcoal-muted font-light">
                    Lamstone is a leading distributor of globally renowned beauty and personal care brands, including Dove, Pears, Mamaearth, Lotus, Jovees, Johnson &amp; Johnson, Cetaphil, Pantene, Ponds, Head &amp; Shoulders, and Sebamed. Committed to authenticity and quality, we supply high-demand cosmetic products across the region, catering to modern beauty, wellness, and personal care needs.
                  </p>
                </div>
                <div className="pt-8">
                  <Link
                    href="/cosmetics"
                    className="group/link inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-gold-dark transition-colors"
                  >
                    <span>Brand Collection</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* 4. Lamé Feature — Cinematic two-column with premium image */}
      <section className="relative overflow-hidden border-t border-border-subtle bg-cream py-14 sm:py-16 lg:py-20 px-6 sm:px-8 lg:px-12">
        {/* Ambient blurred blob */}
        <div
          className="pointer-events-none absolute -right-24 top-1/4 h-[500px] w-[500px] rounded-full bg-lame-rose/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <MotionReveal delay={100} direction="right">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-lame-rose" />
                  <span className="text-xs uppercase tracking-[0.3em] font-medium text-lame-rose-dark">
                    Signature Label
                  </span>
                </div>
              </MotionReveal>
              <MotionReveal delay={250} direction="right">
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-primary tracking-tight leading-[1.15]">
                  Bridging Clinical Science &amp; Luxury Beauty
                </h2>
              </MotionReveal>
              <MotionReveal delay={380} direction="right">
                <p className="text-base sm:text-lg text-charcoal-muted leading-relaxed font-light max-w-xl">
                  Developed with pharmaceutical precision, Lamé delivers clinically proven skincare and luxury fragrances that elevate your daily wellness routine.
                </p>
              </MotionReveal>
              <MotionReveal delay={480} direction="right">
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <CTAButton href="/lame" variant="green" size="md">
                    Explore Lamé Brand
                  </CTAButton>
                  <a
                    href="https://mylamstone.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-gold-dark px-4 py-2.5 rounded-lg border border-primary/20 hover:border-primary hover:scale-[1.02] transition-all duration-300"
                  >
                    <span>Shop Online</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </MotionReveal>
            </div>

            <MotionReveal className="lg:col-span-5" delay={80} direction="left">
              <div className="overflow-hidden rounded-2xl shadow-2xl aspect-4/3 relative group bg-white/50">
                <Image
                  src="/images/lame/lameimage.png"
                  alt="Lamé signature clinical dermocosmetics and luxury beauty collection"
                  fill
                  className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-lame-charcoal/20 via-transparent to-transparent" />
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* 5. Invest in Growth with Lamstone — Abstract growth/architecture visual with Parallax Decor */}
      <InvestCTASection />
    </div>
  );
}
