import type { Metadata } from "next";
import Image from "next/image";
import CTAButton from "@/components/CTAButton";
import HeroBanner from "@/components/HeroBanner";
import MotionReveal from "@/components/MotionReveal";
import { Eye, Target, CheckCircle2, Building2, Sparkles, Globe, Compass, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — Lamstone HealthCare",
  description:
    "Pioneering a holistic approach to wellness by integrating reliable pharmaceutical services with premium cosmetic solutions.",
};

// Growth Roadmap Milestones
const ROADMAP_STEPS = [
  {
    year: "2019",
    title: "Inception of Lamstone",
    description:
      "Lamstone (pharmacy chain and cosmetic) were established as a unified entity.",
    icon: Compass,
  },
  {
    year: "2021",
    title: "Pharmacy Chain Expansion",
    description:
      "Opened multiple strategic locations across Kerala to increase accessibility.",
    icon: Building2,
  },
  {
    year: "2023",
    title: "Cosmetics Division Launch",
    description:
      "Partnered with global brands to distribute premium cosmetic lines across the region.",
    icon: Sparkles,
  },
  {
    year: "2024",
    title: "Lamé Brand & Global Reach",
    description:
      "Launching our proprietary cosmetic line, Lamé, and expanding operations.",
    icon: Globe,
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Cinematic Hero */}
      <HeroBanner
        eyebrow="Corporate Profile"
        title="About Lamstone"
        description="Pioneering a holistic approach to wellness by integrating reliable pharmaceutical services with premium cosmetic solutions."
        imageUrl="https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=2400&q=85"
        imageAlt="Premium healthcare leadership meeting in a modern corporate office"
        theme="green"
        heightClassName="min-h-[70vh]"
      >
        <CTAButton href="/pharmacy-chain" variant="primary">
          Our Pharmacies
        </CTAButton>
        <CTAButton href="/contact" variant="outline">
          Get in Touch
        </CTAButton>
      </HeroBanner>

      {/* 2. Our Story Section — Warm Healthcare Moment Image */}
      <section className="bg-white py-24 sm:py-32 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 space-y-6">
              <MotionReveal delay={100} direction="right">
                <div className="flex items-center gap-3">
                  <span className="h-px w-6 bg-gold" />
                  <span className="text-xs uppercase tracking-widest font-semibold text-gold-dark">
                    Our Origins
                  </span>
                </div>
              </MotionReveal>
              <MotionReveal delay={220} direction="right">
                <h2 className="font-serif text-3xl sm:text-4xl font-medium text-primary tracking-tight">
                  Our Story
                </h2>
              </MotionReveal>
              <MotionReveal delay={340} direction="right">
                <p className="text-base sm:text-lg text-charcoal leading-relaxed font-light">
                  Lamstone HealthCare Pvt Ltd was founded with a unified vision: to make high-quality healthcare and beauty products accessible to everyone. We understand that true wellness radiates from the inside out, which is why our ecosystem bridges the gap between medical necessities and personal care.
                </p>
              </MotionReveal>
              <MotionReveal delay={440} direction="right">
                <p className="text-base sm:text-lg text-charcoal-muted leading-relaxed font-light">
                  As a dynamic corporate entity, we operate an expanding chain of trusted pharmacies across Kerala and serve as a premier distributor for globally recognized cosmetic brands.
                </p>
              </MotionReveal>
              <MotionReveal delay={540} direction="right">
                <CTAButton href="/contact" variant="primary">
                  Connect With Our Leadership
                </CTAButton>
              </MotionReveal>
            </div>

            <MotionReveal className="lg:col-span-5" delay={80} direction="left">
              <div className="overflow-hidden rounded-2xl shadow-xl aspect-4/3 relative group bg-ivory">
                <Image
                  src="/images/about/lamstone-about-image.png"
                  alt="Lamstone Healthcare corporate journey and vision"
                  fill
                  className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/15 via-transparent to-transparent rounded-2xl" />
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* 3. Vision & Mission Section — Icon-style graphic per section */}
      <section className="border-t border-border-subtle bg-cream py-24 sm:py-32 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            <MotionReveal delay={100} direction="up" className="h-full flex flex-col">
              <div className="group relative overflow-hidden rounded-2xl border border-border-subtle bg-white p-8 sm:p-12 space-y-6 shadow-xs hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 h-full w-full flex flex-col justify-between">
                <div>
                  <div className="pointer-events-none absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-gold/10 blur-2xl group-hover:bg-gold/20 transition-all duration-500" />
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold-dark group-hover:bg-gold/25 group-hover:scale-105 transition-all shadow-2xs">
                      <Eye className="h-7 w-7" />
                    </div>
                    <span className="text-xs uppercase tracking-widest font-semibold text-gold-dark">
                      Guiding Light
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-primary mt-6">
                    Our Vision
                  </h3>
                  <p className="text-base sm:text-lg text-charcoal-muted font-light leading-relaxed mt-4">
                    To be the most trusted healthcare and beauty destination, empowering individuals to live healthier, more confident lives.
                  </p>
                </div>
              </div>
            </MotionReveal>

            <MotionReveal delay={220} direction="up" className="h-full flex flex-col">
              <div className="group relative overflow-hidden rounded-2xl border border-border-subtle bg-white p-8 sm:p-12 space-y-6 shadow-xs hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 h-full w-full flex flex-col justify-between">
                <div>
                  <div className="pointer-events-none absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-gold group-hover:bg-primary-light group-hover:scale-105 transition-all shadow-2xs">
                      <Target className="h-7 w-7" />
                    </div>
                    <span className="text-xs uppercase tracking-widest font-semibold text-gold-dark">
                      Operational Core
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-primary mt-6">
                    Our Mission
                  </h3>
                  <p className="text-base sm:text-lg text-charcoal-muted font-light leading-relaxed mt-4">
                    To provide unparalleled access to genuine medicines, expert care, and scientifically-backed beauty products through continuous innovation.
                  </p>
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* 4. Corporate Head Office — Alverstone Healthcare */}
      <section className="border-t border-border-subtle bg-white py-24 sm:py-32 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <MotionReveal className="lg:col-span-6" delay={100} direction="right">
              <figure className="space-y-3">
                <div className="overflow-hidden rounded-2xl shadow-xl aspect-16/10 relative group bg-ivory">
                  <Image
                    src="/images/about/corporate-head-office.jpg"
                    alt="Corporate Head Office — Bio 360 Kerala Life Sciences Industries Park"
                    fill
                    className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent rounded-2xl" />
                </div>
                <figcaption className="text-center sm:text-left text-xs sm:text-sm text-charcoal-muted font-medium tracking-wide flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                  <span>Corporate Head Office — Bio 360 Kerala Life Sciences Industries Park</span>
                </figcaption>
              </figure>
            </MotionReveal>

            <div className="lg:col-span-6 space-y-6">
              <MotionReveal delay={150} direction="left">
                <div className="flex items-center gap-3">
                  <span className="h-px w-6 bg-gold" />
                  <span className="text-xs uppercase tracking-widest font-semibold text-gold-dark">
                    Corporate Headquarters
                  </span>
                </div>
              </MotionReveal>
              <MotionReveal delay={250} direction="left">
                <h2 className="font-serif text-3xl sm:text-4xl font-medium text-primary tracking-tight">
                  Alverstone Healthcare Pvt Ltd
                </h2>
              </MotionReveal>
              <MotionReveal delay={350} direction="left">
                <p className="text-base sm:text-lg text-charcoal leading-relaxed font-light">
                  Our corporate operations and strategic governance are anchored at the Bio 360 Kerala Life Sciences Industries Park in Trivandrum. This world-class life sciences and biotechnology cluster provides the infrastructure and research ecosystem empowering our statewide pharmaceutical network.
                </p>
              </MotionReveal>
              <MotionReveal delay={450} direction="left">
                <div className="rounded-2xl border border-border-subtle bg-ivory p-6 space-y-3">
                  <div className="flex items-center gap-2.5 text-primary">
                    <MapPin className="h-4 w-4 text-gold-dark" />
                    <span className="text-xs uppercase tracking-wider font-semibold">
                      Registered Head Office
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed font-light">
                    Alverstone Healthcare Pvt Ltd<br />
                    Bio 360 Kerala Life Sciences Industries Park, Trivandrum, Kerala, India - 695317
                  </p>
                </div>
              </MotionReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Growth Roadmap — Visual timeline with connecting line & icons */}
      <section className="border-t border-border-subtle bg-cream py-24 sm:py-32 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl space-y-16">
          <MotionReveal direction="up">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-gold" />
                <span className="text-xs uppercase tracking-widest font-semibold text-gold-dark">
                  Progress &amp; Milestones
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-primary tracking-tight">
                Our Growth Roadmap
              </h2>
              <p className="text-base sm:text-lg text-charcoal-muted font-light leading-relaxed">
                Strategic trajectory marking our expansion from inception to statewide healthcare integration.
              </p>
            </div>
          </MotionReveal>

          <div className="relative">
            {/* Horizontal Connecting Line for Desktop */}
            <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-gold/20 via-gold to-gold/20 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 items-stretch">
              {ROADMAP_STEPS.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <MotionReveal key={index} delay={index * 130} direction="up" className="h-full flex flex-col">
                    <div className="group relative flex flex-col justify-between rounded-2xl border border-border-subtle bg-ivory p-6 sm:p-8 shadow-2xs hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 h-full w-full">
                      <div className="space-y-4 flex-1 flex flex-col">
                        <div className="flex items-center justify-between shrink-0">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-gold shadow-xs group-hover:bg-primary-light group-hover:scale-110 transition-all duration-300">
                              <StepIcon className="h-5 w-5" />
                            </div>
                            <span className="inline-flex items-center rounded-md bg-gold/15 px-2.5 py-1 font-sans text-xs font-semibold text-gold-dark">
                              {step.year}
                            </span>
                          </div>
                          <span className="text-xs font-serif font-semibold text-primary/40 group-hover:text-gold-dark transition-colors">
                            0{index + 1}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl font-medium text-primary pt-1 shrink-0">
                          {step.title}
                        </h3>
                        <p className="text-sm text-charcoal-muted font-light leading-relaxed flex-1">
                          {step.description}
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-border-subtle/70 flex items-center justify-between text-[11px] uppercase tracking-wider text-neutral-400 font-medium shrink-0">
                        <span>Milestone 0{index + 1}</span>
                        <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
                      </div>
                    </div>
                  </MotionReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom Callout */}
      <section className="border-t border-border-subtle bg-ivory py-20 px-6 sm:px-8 lg:px-12 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <MotionReveal direction="up">
            <h2 className="font-serif text-2xl sm:text-3xl text-primary font-medium">
              Explore How Lamstone Shapes Healthcare
            </h2>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <CTAButton href="/pharmacy-chain" variant="primary">
                Our Pharmacies
              </CTAButton>
              <CTAButton href="/cosmetics" variant="outline">
                Cosmetics Portfolio
              </CTAButton>
            </div>
          </MotionReveal>
        </div>
      </section>
    </div>
  );
}
