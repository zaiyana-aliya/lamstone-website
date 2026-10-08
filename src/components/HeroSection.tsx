"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Users,
  Leaf,
  Heart,
  ArrowRight,
  MapPin,
  ChevronRight,
  Sparkles,
  Building2,
} from "lucide-react";

interface SlideFeature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  caption: string;
}

interface Slide {
  id: string;
  eyebrow: string;
  titlePart1: string;
  titlePart2: string;
  description: string;
  features: SlideFeature[];
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  image: string;
  imageAlt: string;
  imagePosition?: string;
}

const SLIDES: Slide[] = [
  {
    id: "slide-1",
    eyebrow: "Care Beyond Medicine",
    titlePart1: "Building a Healthier Tomorrow, ",
    titlePart2: "Together.",
    description:
      "A premium ecosystem of pharmacy chains and cosmetic brands, built on trust, clinical integrity, and continuous innovation.",
    features: [
      { icon: Shield, title: "Trusted Care", caption: "Evidence Based" },
      { icon: Users, title: "Quality Assured", caption: "Global Standards" },
      { icon: Leaf, title: "Lamstone Signature", caption: "Own Brands" },
      { icon: Heart, title: "Community Wellness", caption: "Healthier Lives" },
    ],
    primaryCta: { label: "Explore Our Divisions", href: "#divisions" },
    secondaryCta: { label: "Invest With Us", href: "/invest" },
    image: "/images/home/hero-caregiver-patient.jpg",
    imageAlt: "Compassionate healthcare pharmacist warmly caring for an older patient",
    imagePosition: "object-[center_24%]",
  },
  {
    id: "slide-2",
    eyebrow: "OPENING SOON",
    titlePart1: "Introducing Lamstone ",
    titlePart2: "Healthcare Hypermarket.",
    description:
      "One destination for pharmacy, wellness, and beauty — all under one roof.",
    features: [
      { icon: Building2, title: "Pharmacy & Rx", caption: "Comprehensive Care" },
      { icon: Sparkles, title: "Luxury Beauty", caption: "Premium Brands" },
      { icon: Leaf, title: "Health & Wellness", caption: "Vitamins & Nutrition" },
      { icon: Heart, title: "Holistic Care", caption: "Expert Consultations" },
    ],
    primaryCta: { label: "Explore the Hypermarket", href: "/pharmacy-chain" },
    secondaryCta: { label: "Find a Location", href: "/pharmacy-chain#locations" },
    image: "/images/banners/pharmacy-interior-shelves.jpg",
    imageAlt: "Spacious modern interior of Lamstone Healthcare Hypermarket with apothecary, wellness, and beauty departments",
    imagePosition: "object-[center_35%]",
  },
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Users,
  Leaf,
  Heart,
  Sparkles,
  Building2,
  MapPin,
};

export default function HeroSection() {
  const [slides, setSlides] = useState<Slide[]>(SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetch("/api/hero-slides?page=home")
      .then((res) => res.json())
      .then((data) => {
        if (data.slides && data.slides.length > 0) {
          const mapped: Slide[] = data.slides.map((s: any, idx: number) => {
            const fallbackSlide = SLIDES[idx % SLIDES.length] || SLIDES[0];
            const commaIndex = s.heading.indexOf(",");
            let p1 = s.heading;
            let p2 = "";
            if (commaIndex !== -1) {
              p1 = s.heading.substring(0, commaIndex + 1) + " ";
              p2 = s.heading.substring(commaIndex + 1).trim();
            }
            return {
              id: s.id,
              eyebrow: s.eyebrow_label,
              titlePart1: p1,
              titlePart2: p2,
              description: s.subtext,
              features:
                Array.isArray(s.features) && s.features.length > 0
                  ? s.features.map((f: any) => ({
                      icon: ICON_MAP[f.icon] || Shield,
                      title: f.title,
                      caption: f.caption,
                    }))
                  : fallbackSlide.features,
              primaryCta: {
                label: s.primary_cta_label || fallbackSlide.primaryCta.label,
                href: s.primary_cta_link || fallbackSlide.primaryCta.href,
              },
              secondaryCta: {
                label: s.secondary_cta_label || fallbackSlide.secondaryCta.label,
                href: s.secondary_cta_link || fallbackSlide.secondaryCta.href,
              },
              image: s.image_url,
              imageAlt: s.heading,
              imagePosition: idx === 1 ? "object-[center_35%]" : "object-[center_24%]",
            };
          });
          setSlides(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Auto-advance to next slide every 7 seconds; paused when hovering
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [isPaused, currentSlide, slides.length]);

  const handleNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handleGoToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative z-30 w-full overflow-x-clip bg-transparent text-[var(--body)] py-0 group/hero lg:h-[550px]"
      aria-roledescription="carousel"
      aria-label="Home page hero banners"
    >

      {/* Foreground Blurred Plant Foliage at Bottom-Left Corner of Hero Area (Slide 1 only) */}
      <div
        className={`pointer-events-none absolute left-0 bottom-0 w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 select-none z-10 mix-blend-multiply transition-opacity duration-700 ${
          currentSlide === 0 ? "opacity-50" : "opacity-0"
        }`}
        style={{
          maskImage: "radial-gradient(ellipse at bottom left, black 35%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at bottom left, black 35%, transparent 75%)",
        }}
      >
        <Image
          src="/images/home/foreground-foliage-left.jpg"
          alt=""
          fill
          sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, 208px"
          className="object-cover blur-[2px]"
          aria-hidden="true"
        />
      </div>

      {/* Desktop Blended Background Photo with CSS Gradient Mask Fade (Crossfade between slides) */}
      <div
        className="hidden lg:block absolute inset-y-0 right-0 w-1/2 xl:w-[54%] 2xl:w-[56%] z-0 select-none overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 40%, black 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 40%, black 100%)",
        }}
      >
        {slides.map((slide, index) => {
          const isActive = currentSlide === index;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
              style={
                index === 1
                  ? {
                      maskImage:
                        "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.06) 12%, rgba(0,0,0,0.45) 28%, black 44%, black 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.06) 12%, rgba(0,0,0,0.45) 28%, black 44%, black 100%)",
                    }
                  : undefined
              }
            >
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                priority={index === 0}
                sizes="56vw"
                className={`object-cover ${slide.imagePosition || "object-[center_24%]"}`}
              />

              {/* Slide 2 Premium Photo Blend: Smooth cream gradient veil dissolving the left edge seam */}
              {index === 1 && (
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/90 via-35% to-transparent z-10 select-none"
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
        {/* Subtle bottom vignette to ensure contrast for the floating pharmacy card */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/25 via-black/5 to-transparent pointer-events-none z-20" />
      </div>

      {/* Standard Container Wrapper */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[510px] lg:h-[550px] items-center">
          {/* Left Column: Text & Features Content */}
          <div className="lg:col-span-6 xl:col-span-6 py-6 lg:py-0 relative z-10 flex flex-col justify-center">
            {/* Slide Content Area with Fixed Height and Centered Alignment */}
            <div className="relative w-full h-[395px] sm:h-[410px] lg:h-[400px]">
              {slides.map((slide, index) => {
                const isActive = currentSlide === index;
                return (
                  <div
                    key={slide.id}
                    className={`space-y-4 sm:space-y-4.5 text-left w-full max-w-lg xl:max-w-xl transition-all duration-700 ease-in-out absolute inset-0 flex flex-col justify-center ${
                      isActive
                        ? "opacity-100 translate-x-0 pointer-events-auto z-10"
                        : "opacity-0 -translate-x-4 pointer-events-none z-0"
                    }`}
                    aria-hidden={!isActive}
                  >
                    {/* Eyebrow Label / Badge */}
                    {index === 1 ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 shadow-xs w-fit whitespace-nowrap shrink-0">
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                        </span>
                        <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[var(--accent)] font-sans whitespace-nowrap">
                          {slide.eyebrow}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <span className="h-[3.5px] w-8 bg-[var(--accent)] rounded-full" />
                        <span className="text-xs uppercase tracking-widest font-bold text-[var(--accent-text)] font-sans drop-shadow-[0_1px_1px_var(--shadow-color)]">
                          {slide.eyebrow}
                        </span>
                      </div>
                    )}

                    {/* Headline / Subheadline */}
                    <div className="space-y-2">
                      <h1 className="font-serif text-3xl sm:text-4xl lg:text-[36px] xl:text-[42px] 2xl:text-[45px] font-medium leading-[1.14] tracking-tight">
                        <span className="text-[var(--heading)]">
                          {slide.titlePart1}
                        </span>
                        <span className="text-[var(--accent)] font-bold drop-shadow-[0_1px_2px_rgba(158,27,42,0.15)]">
                          {slide.titlePart2}
                        </span>
                      </h1>
                      <p className="text-xs sm:text-sm lg:text-[13.5px] text-[var(--body)] font-light leading-relaxed max-w-md">
                        {slide.description}
                      </p>
                    </div>

                    {/* Row of 4 Icon + Label Points */}
                    {index === 1 ? (
                      <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-3 sm:gap-0 pt-0.5">
                        {slide.features.map((item, fIdx) => {
                          const ItemIcon = item.icon;
                          return (
                            <React.Fragment key={item.title}>
                              <div className="flex flex-col items-start sm:flex-1 sm:px-3 first:pl-0 last:pr-0">
                                <div className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gradient-to-br from-white via-[var(--accent-soft)]/50 to-[var(--accent)]/[0.08] text-[var(--accent)] border border-[var(--accent)]/30 ring-2 ring-[var(--accent)]/15 mb-1.5 shadow-[0_2px_8px_-2px_rgba(158,27,42,0.15),inset_0_1px_1.5px_rgba(255,255,255,0.9)]">
                                  <ItemIcon className="h-4 w-4 stroke-[2]" />
                                </div>
                                <span className="text-xs font-semibold text-[var(--heading)] leading-snug">
                                  {item.title}
                                </span>
                                <span className="text-[11px] text-[var(--body)] font-light mt-0.5 leading-snug">
                                  {item.caption}
                                </span>
                              </div>
                              {fIdx < slide.features.length - 1 && (
                                <span
                                  className="hidden sm:block h-7 w-[1.5px] bg-[var(--border)] rounded-full self-center mx-1 shrink-0"
                                  aria-hidden="true"
                                />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-0.5">
                        {slide.features.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <div key={item.title} className="flex flex-col items-start">
                              <div className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/15 ring-1 ring-[var(--primary)]/10 mb-1.5 shadow-2xs">
                                <ItemIcon className="h-4 w-4 stroke-[2]" />
                              </div>
                              <span className="text-xs font-semibold text-[var(--heading)] leading-snug">
                                {item.title}
                              </span>
                              <span className="text-[11px] text-[var(--body)] font-light mt-0.5 leading-snug">
                                {item.caption}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Two CTA Buttons Side by Side */}
                    {index === 1 ? (
                      <div className="flex flex-wrap items-center gap-3 pt-0.5">
                        {/* Explore the Hypermarket CTA: Navy to deeper navy gradient + soft shadow glow on hover */}
                        <Link
                          href={slide.primaryCta.href}
                          className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0E2244] via-[#0B1B36] to-[#071224] text-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-300 shadow-[0_4px_16px_rgba(14,34,68,0.28)] hover:shadow-[0_8px_24px_rgba(14,34,68,0.45)] hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 cursor-pointer border border-white/10"
                        >
                          <span>{slide.primaryCta.label}</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>

                        {/* Find a Location CTA: Red outline with smooth fill-in transition on hover */}
                        <Link
                          href={slide.secondaryCta.href}
                          className="group relative inline-flex items-center justify-center rounded-full border-2 border-[var(--accent)] text-[var(--accent)] hover:text-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-300 ease-out cursor-pointer shadow-xs hover:shadow-[0_6px_20px_rgba(158,27,42,0.3)] hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
                        >
                          <span className="absolute inset-0 bg-[var(--accent)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center" />
                          <span className="relative z-10 transition-colors duration-300">{slide.secondaryCta.label}</span>
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-3 pt-0.5">
                        <Link
                          href={slide.primaryCta.href}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-[image:var(--btn-solid-gradient)] hover:brightness-110 text-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all shadow-[0_4px_16px_var(--shadow-color)] hover:shadow-md cursor-pointer"
                        >
                          <span>{slide.primaryCta.label}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                          href={slide.secondaryCta.href}
                          className="inline-flex items-center justify-center rounded-full border-2 border-[var(--accent)] text-[var(--accent-text)] bg-transparent hover:bg-[var(--accent)] hover:text-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer shadow-xs"
                        >
                          {slide.secondaryCta.label}
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Fixed Dot Indicators with Slide Counter (Consistently positioned across all slides) */}
            <div className="flex items-center gap-2.5 pt-3 select-none z-20">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleGoToSlide(idx)}
                  className="group flex items-center transition-all duration-500 cursor-pointer p-1 -m-1 focus:outline-none"
                  aria-label={`Go to slide ${idx + 1}: ${s.eyebrow}`}
                  aria-current={currentSlide === idx ? "true" : "false"}
                >
                  <span
                    className={`block rounded-full transition-all duration-500 ${
                      currentSlide === idx
                        ? idx === 1
                          ? "w-8 sm:w-9 h-2 bg-gradient-to-r from-[var(--accent)] via-[#B82334] to-[var(--accent)] shadow-[0_0_10px_rgba(158,27,42,0.45),0_1px_3px_rgba(158,27,42,0.3)] ring-1 ring-[var(--accent)]/25"
                          : "w-7 sm:w-8 h-2 bg-[var(--accent)] shadow-xs"
                        : "w-2 h-2 bg-neutral-300 group-hover:bg-neutral-400"
                    }`}
                  />
                </button>
              ))}
              <span className="text-[11px] font-medium text-charcoal-muted/70 tracking-wider uppercase ml-1 font-mono">
                0{currentSlide + 1} / 0{slides.length}
              </span>
            </div>
          </div>

          {/* =========================================================================
              MOBILE RIGHT COLUMN: Photo with Rounded Corners and Floating Pill
             ========================================================================= */}
          <div className="block lg:hidden relative w-full min-h-[320px] sm:min-h-[400px] rounded-2xl overflow-hidden my-6 shadow-md">
            {slides.map((slide, index) => {
              const isActive = currentSlide === index;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.imageAlt}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className={`object-cover ${slide.imagePosition || "object-[center_24%]"}`}
                  />
                </div>
              );
            })}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/35 via-black/10 to-transparent pointer-events-none z-20" />
            <div className="absolute bottom-4 left-4 right-4 z-30">
              <Link
                href="/pharmacy-chain#locations"
                className="group flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-white/60 shadow-lg text-left"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)] shadow-xs">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-[var(--heading)]">Find a Lamstone Pharmacy</span>
                  <span className="block text-[11px] text-[var(--body)] truncate">Explore our 500+ pharmacy locations</span>
                </div>
                <ChevronRight className="h-4 w-4 text-[var(--accent)] shrink-0" />
              </Link>
            </div>

            {/* Mobile Next Slide Arrow Button */}
            <button
              type="button"
              onClick={handleNextSlide}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-deep)]/85 hover:bg-[var(--primary-deep)] text-white border border-[var(--accent-secondary)]/55 shadow-md active:scale-95 transition-all duration-300 cursor-pointer backdrop-blur-xs"
              aria-label="Next banner slide"
            >
              <ChevronRight className="h-5 w-5 text-[var(--accent-secondary)]" />
            </button>
          </div>

          {/* =========================================================================
              DESKTOP RIGHT COLUMN SPACER
             ========================================================================= */}
          <div className="hidden lg:block lg:col-span-6 xl:col-span-6 min-h-[510px] lg:min-h-[550px]" />
        </div>

        {/* =========================================================================
            DESKTOP FLOATING CARD: Glassmorphic luxury card straddling Hero & Navy Stat Band
           ========================================================================= */}
        <div className="hidden lg:block absolute bottom-0 right-6 sm:right-8 lg:right-12 translate-y-1/2 z-40 w-full max-w-[27rem]">
          <Link
            href="/pharmacy-chain#locations"
            className="group relative flex items-center gap-4 sm:gap-4.5 px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl border border-[var(--accent-secondary)]/35 shadow-[0_30px_65px_-15px_var(--shadow-color),0_12px_28px_-6px_rgba(0,0,0,0.12),inset_0_1px_1px_0_rgba(255,255,255,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-secondary)]/60 hover:shadow-[0_40px_80px_-15px_var(--shadow-color),0_16px_36px_-6px_rgba(0,0,0,0.18)] overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(14, 34, 68, 0.38) 100%)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            {/* Subtle Animated Glass Light Streak / Shimmer */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
              <div className="absolute -inset-y-8 -left-24 w-24 bg-gradient-to-r from-transparent via-white/[0.14] to-transparent animate-glass-shimmer pointer-events-none" />
            </div>

            {/* Top Inner Specular Highlight Line (Glass light-catching reflection) */}
            <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

            {/* Subtle Accent Edge Line */}
            <span className="absolute left-0 inset-y-3 w-[2.5px] rounded-r-full bg-gradient-to-b from-[var(--accent-secondary)] via-[var(--accent)] to-[var(--accent-text)] shadow-[0_0_8px_var(--shadow-color)]" />

            {/* Refined Radial Gradient Icon Badge with 1px Gold Ring & Hover Scale */}
            <div
              className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border border-[var(--accent-secondary)]/75 shadow-[0_4px_14px_-2px_rgba(0,0,0,0.4),inset_0_1px_2px_0_rgba(255,255,255,0.4)] group-hover:scale-105 transition-transform duration-300 ease-out"
              style={{
                background: "radial-gradient(circle at 45% 38%, var(--primary) 0%, var(--primary) 62%, var(--primary-deep) 100%)",
              }}
            >
              {/* Bespoke Location Pin with Gradient Fill and Concentric Jewel Detail */}
              <svg
                viewBox="0 0 24 24"
                className="h-4.5 w-4.5 sm:h-5 sm:w-5 drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.4)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="bespokePinGrad" x1="12" y1="2.75" x2="12" y2="21.25" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="65%" stopColor="#F9F6F0" />
                    <stop offset="100%" stopColor="#EAE1C8" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 2.75C8.41 2.75 5.5 5.66 5.5 9.25C5.5 14.15 12 21.25 12 21.25C12 21.25 18.5 14.15 18.5 9.25C18.5 5.66 15.59 2.75 12 2.75Z"
                  fill="url(#bespokePinGrad)"
                  stroke="rgba(198,161,91,0.55)"
                  strokeWidth="0.75"
                />
                <circle cx="12" cy="9.25" r="2.5" fill="var(--primary)" />
                <circle cx="12" cy="9.25" r="1.2" fill="#FFFFFF" />
              </svg>
            </div>

            {/* Typography Hierarchy with Cormorant Garamond Editorial Heading & Sans-Serif Caption */}
            <div className="text-left pr-2 min-w-0 flex-1">
              <span
                className="block text-[15.5px] sm:text-[16.5px] font-semibold tracking-[0.025em] text-white leading-tight truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Garamond, serif" }}
              >
                Find a Lamstone Pharmacy
              </span>
              <span
                className="block text-[10px] sm:text-[11px] tracking-[0.04em] text-white/70 font-sans font-light leading-snug mt-1.5 truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
                style={{ fontFamily: "var(--font-manrope), var(--font-sans), sans-serif" }}
              >
                Accessible. Reliable. Always Near You.
              </span>
            </div>

            {/* Refined Chevron with subtle hover shift */}
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.08] border border-white/20 group-hover:border-[var(--accent-secondary)]/60 group-hover:bg-[var(--accent-secondary)]/20 transition-all duration-300 ml-2">
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[var(--accent-secondary)] group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
            </div>
          </Link>
        </div>
      </div>

      {/* Right-Arrow Navigation Control (Vertically Centered on Right Edge on Desktop) */}
      <button
        type="button"
        onClick={handleNextSlide}
        className="group hidden lg:flex absolute right-6 lg:right-8 top-1/2 -translate-y-1/2 z-40 h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-deep)]/85 hover:bg-[var(--primary-deep)] text-white border border-[var(--accent-secondary)]/55 shadow-[0_8px_24px_var(--shadow-color),0_2px_6px_rgba(0,0,0,0.12)] ring-2 ring-[var(--accent-secondary)]/20 hover:ring-[var(--accent-secondary)]/60 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer backdrop-blur-xs"
        aria-label="Next banner slide"
      >
        <ChevronRight className="h-6 w-6 text-[var(--accent-secondary)] group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
      </button>
    </section>
  );
}
