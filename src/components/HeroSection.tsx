import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Shield, Users, Leaf, Heart, ArrowRight, MapPin, ChevronRight } from "lucide-react";

export default function HeroSection() {
  const trustPoints = [
    {
      icon: Shield,
      title: "Trusted Care",
      caption: "Evidence Based",
    },
    {
      icon: Users,
      title: "Quality Assured",
      caption: "Global Standards",
    },
    {
      icon: Leaf,
      title: "Lamstone Signature",
      caption: "Own Brands",
    },
    {
      icon: Heart,
      title: "Community Wellness",
      caption: "Healthier Lives",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-white text-charcoal border-b border-border-subtle/50">
      {/* Two-Column Flex Container: Left ~44% text, Right ~56% image with right-edge bleed */}
      <div className="w-full flex flex-col lg:flex-row items-stretch min-h-[520px] lg:min-h-[560px] xl:min-h-[600px]">
        
        {/* =========================================================================
            LEFT COLUMN: Pure White Background, 100% Distinct Text Content
           ========================================================================= */}
        <div className="relative w-full lg:w-[46%] xl:w-[44%] 2xl:w-[42%] bg-white z-10 flex flex-col justify-center px-6 sm:px-10 lg:pl-10 lg:pr-6 xl:pl-16 xl:pr-8 py-10 sm:py-12 lg:py-14">
          
          {/* Foreground Blurred Plant Foliage at Bottom-Left Corner */}
          <div className="pointer-events-none absolute -left-6 -bottom-8 w-28 h-28 sm:w-36 sm:h-36 select-none z-0 mix-blend-multiply opacity-60 rotate-12">
            <Image
              src="/images/home/foreground-foliage-left.jpg"
              alt=""
              fill
              sizes="(max-width: 640px) 112px, 144px"
              className="object-cover blur-[2px]"
              aria-hidden="true"
            />
          </div>

          <div className="relative z-10 space-y-5 sm:space-y-6 text-left max-w-md xl:max-w-lg">
            {/* Eyebrow Label with Site-Wide Gold Line Treatment */}
            <div className="flex items-center gap-2.5">
              <span className="h-px w-6 bg-gold" />
              <span className="text-xs uppercase tracking-widest font-semibold text-gold-dark font-sans">
                Care Beyond Medicine
              </span>
            </div>

            {/* Headline / Subheadline */}
            <div className="space-y-3">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] xl:text-[48px] 2xl:text-[52px] font-medium text-primary leading-[1.15] tracking-tight">
                Building a<br />
                Healthier Tomorrow.<br />
                Together.
              </h1>
              <p className="text-xs sm:text-sm lg:text-[14px] text-charcoal-muted font-light leading-relaxed max-w-md">
                A premium ecosystem of pharmacy chains and cosmetic brands, built on trust, clinical integrity, and continuous innovation.
              </p>
            </div>

            {/* Row of 4 Icon + Label Trust Points */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 pt-1">
              {trustPoints.map((item) => (
                <div key={item.title} className="flex flex-col items-start">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[#D0DCD2] bg-[#F7F9F7] text-primary mb-2 shadow-2xs">
                    <item.icon className="h-4 w-4 stroke-[1.75]" />
                  </div>
                  <span className="text-xs font-semibold text-primary leading-snug">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-charcoal-muted font-light mt-0.5 leading-snug">
                    {item.caption}
                  </span>
                </div>
              ))}
            </div>

            {/* Two CTA Buttons Side by Side */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="#divisions"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#183B24] hover:bg-[#112B1A] text-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all shadow-xs hover:shadow-sm"
              >
                <span>Explore Our Divisions</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/invest"
                className="inline-flex items-center justify-center rounded-full border border-border-subtle hover:border-primary text-primary hover:text-primary-dark bg-white/80 hover:bg-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all"
              >
                Invest With Us
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: Warm Caregiver-Patient Photo with Rounded Corners & Right-Edge Bleed
           ========================================================================= */}
        <div className="relative w-full lg:w-[54%] xl:w-[56%] 2xl:w-[58%] min-h-[380px] sm:min-h-[460px] lg:min-h-full overflow-hidden bg-[#F4F7F4]">
          <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[540px] xl:min-h-[600px] lg:rounded-l-3xl overflow-hidden shadow-[-10px_0_30px_-8px_rgba(0,0,0,0.1)]">
            
            {/* Authentic AI-Generated High-Resolution Healthcare Photograph */}
            <Image
              src="/images/home/hero-caregiver-patient.jpg"
              alt="Compassionate healthcare pharmacist warmly caring for an older patient"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-[center_28%]"
            />

            {/* Subtle soft gradient fade on left edge inside the image column */}
            <div className="hidden lg:block absolute inset-y-0 left-0 w-12 xl:w-20 bg-gradient-to-r from-white via-white/25 to-transparent pointer-events-none z-10" />


            {/* Real HTML/CSS "Find a Lamstone Pharmacy" Floating Card — Centered horizontally, shifted to lower-third to preserve subjects */}
            <div className="absolute top-[74%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-max max-w-[92%]">
              <Link
                href="/pharmacy-chain#locations"
                className="group flex items-center gap-3 sm:gap-3.5 px-5 py-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-black/5 shadow-[0_12px_28px_-6px_rgba(0,0,0,0.18)] hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-[#183B24]/10 text-[#183B24]">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 fill-[#183B24]" />
                </div>
                <div className="text-left pr-1">
                  <span className="block font-serif text-xs sm:text-[13px] font-bold text-[#14261B] leading-tight">
                    Find a Lamstone Pharmacy
                  </span>
                  <span className="block text-[10px] sm:text-[11px] text-[#6E7F74] font-normal leading-tight mt-0.5">
                    Accessible. Reliable. Always Near You.
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-[#8A9B90] group-hover:translate-x-0.5 group-hover:text-[#183B24] transition-all ml-1" />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
