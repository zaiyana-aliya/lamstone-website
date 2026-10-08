"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Lightbulb,
  Users,
  Leaf,
} from "lucide-react";
import HealthcarePatternOverlay from "@/components/about/HealthcarePatternOverlay";

interface WhyPoint {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}

const DEFAULT_WHY_LAMSTONE = {
  eyebrow_label: "THE LAMSTONE DIFFERENCE",
  heading: "Why Lamstone?",
  description:
    "We go beyond business. We build trust, create value and make a meaningful difference — in people's lives and in the world around us.",
  image_url: "/images/about/hands-holding-sprout.jpg",
  cta_label: "Join Our Journey",
  cta_url: "/contact",
};

const DEFAULT_POINTS: WhyPoint[] = [
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    subtitle: "In everything we do.",
  },
  {
    icon: Lightbulb,
    title: "Innovation-Driven",
    subtitle: "For a better tomorrow.",
  },
  {
    icon: Users,
    title: "People-Centric",
    subtitle: "Because they matter most.",
  },
  {
    icon: Leaf,
    title: "Sustainable Impact",
    subtitle: "For generations to come.",
  },
];

function renderWhyHeading(heading: string) {
  if (!heading) return null;
  const parts = heading.split(/(Lamstone)/i);
  if (parts.length > 1) {
    return parts.map((part, idx) =>
      part.toLowerCase() === "lamstone" ? (
        <span
          key={idx}
          className="text-[#B8934A]"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 700,
          }}
        >
          {part}
        </span>
      ) : (
        <span key={idx}>{part}</span>
      )
    );
  }
  return heading;
}

export default function AboutWhyLamstoneSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [data, setData] = useState(DEFAULT_WHY_LAMSTONE);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch("/api/about-page", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.sections)) {
          const row = json.sections.find(
            (s: any) => s.section_key === "why_lamstone" || s.section_key === "why"
          );
          if (row) {
            setData((prev) => ({
              ...prev,
              eyebrow_label: row.eyebrow_label || prev.eyebrow_label,
              heading: row.heading || prev.heading,
              description: row.description || prev.description,
              image_url: row.image_url || prev.image_url,
              cta_label: row.cta_label || prev.cta_label,
              cta_url: row.cta_url || prev.cta_url,
            }));
          }
        }
      } catch {
        // fallback to default
      }
    }

    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener("content_updated", handleUpdate);

    const el = sectionRef.current;
    if (!el) return;

    const checkInitialVisibility = () => {
      const rect = el.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < windowHeight + 80 && rect.bottom > 0) {
        setIsInView(true);
        return true;
      }
      return false;
    };

    if (checkInitialVisibility()) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!isMounted) return;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);

    return () => {
      isMounted = false;
      window.removeEventListener("content_updated", handleUpdate);
      observer.unobserve(el);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-lamstone"
      className="scroll-mt-28 relative overflow-hidden py-24 sm:py-28 lg:py-32 bg-[#FFFDF9]"
    >
      {/* 1px gold hairline (rgba(184,147,74,.6)) along the very bottom edge where it meets navy footer */}
      <div
        className="absolute bottom-0 inset-x-0 h-[1px] bg-[rgba(184,147,74,0.60)] pointer-events-none z-20"
        aria-hidden="true"
      />

      {/* Seamless Healthcare Line-Icon Pattern Overlay (subtle 4.5% opacity) */}
      <HealthcarePatternOverlay
        opacity={0.045}
        mask="radial-gradient(ellipse at center, transparent 30%, #000 78%)"
      />

      <div className="relative z-10 mx-auto max-w-6xl w-full px-6 sm:px-8 lg:px-12">
        {/* Top Row: Two Columns (Text Left, Photo Right on Desktop; Photo 1st, Text 2nd on Mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-center">
          {/* Column 1: Heading & Text (Left on Desktop, 2nd on Mobile) */}
          <div className="order-2 lg:order-1 space-y-6 sm:space-y-7">
            {/* Eyebrow Label: THE LAMSTONE DIFFERENCE on one line in gold with 0.28em wide tracking */}
            <div
              className={`flex items-center gap-2.5 sm:gap-3 transition-all duration-500 ease-out will-change-transform motion-reduce:transition-none motion-reduce:transform-none ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
            >
              <span className="h-[1px] w-6 sm:w-10 bg-[#B8934A]/40 shrink-0" />
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-sans font-semibold text-[#B8934A] whitespace-nowrap">
                {data.eyebrow_label}
              </span>
              <span className="h-[1px] w-6 sm:w-10 bg-[#B8934A]/40 shrink-0" />
            </div>

            {/* Heading: +10% size, italic gold "Lamstone", navy "Why" and "?", tight -0.01em tracking, line-height 1.12 */}
            <div
              className={`space-y-3 transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none motion-reduce:transform-none ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <h2 className="font-serif text-[38px] sm:text-[46px] lg:text-[52px] xl:text-[58px] font-bold text-[#0F2A4A] tracking-[-0.01em] leading-[1.12]">
                {renderWhyHeading(data.heading)}
              </h2>

              {/* Gold hairline with a small dot at its end (replacing plain underline) */}
              <div className="flex items-center gap-0 w-20 sm:w-24 pt-1" aria-hidden="true">
                <span className="flex-1 h-[1.5px] bg-[#B8934A]" />
                <span className="w-2 h-2 rounded-full bg-[#B8934A] shrink-0" />
              </div>
            </div>

            {/* Description: navy-grey, line-height 1.75, max-width ~460px */}
            <div
              className={`transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none motion-reduce:transform-none ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <p className="font-sans text-[15px] sm:text-base text-[#0F2A4A]/80 font-normal leading-[1.75] max-w-[460px]">
                {data.description}
              </p>
            </div>

            {/* Button: spacing above button and before divider */}
            <div
              className={`pt-3 sm:pt-4 transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none motion-reduce:transform-none ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <Link
                href={data.cta_url || "/contact"}
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-full bg-[#0F2A4A] hover:bg-[#173A6B] text-white px-8 py-3.5 text-xs sm:text-[13px] font-sans font-semibold uppercase tracking-[0.18em] shadow-[0_1px_2px_rgba(15,42,74,0.12),0_4px_12px_rgba(15,42,74,0.08)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <span>{data.cta_label || "Join Our Journey"}</span>
                <ArrowRight className="h-4 w-4 text-white stroke-[2.2] transition-transform duration-200 ease-out group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Column 2: Circular Photo (Centre on Desktop, 1st on Mobile, increased by ~10%) */}
          <div className="order-1 lg:order-2 flex justify-center items-center py-4 lg:py-0 select-none">
            <div className="relative w-[310px] h-[310px] sm:w-[365px] sm:h-[365px] lg:w-[390px] lg:h-[390px] xl:w-[410px] xl:h-[410px] flex items-center justify-center">
              {/* Solid champagne circle behind photo (#F3E6D3), offset about 20px down and to the left */}
              <div
                className={`absolute inset-0 -translate-x-[20px] translate-y-[20px] rounded-full bg-[#F3E6D3] pointer-events-none z-0 transition-all duration-1000 ease-out will-change-transform motion-reduce:transition-none motion-reduce:transform-none ${
                  isInView ? "opacity-100 scale-100" : "opacity-0 scale-[1.04]"
                }`}
                aria-hidden="true"
              />

              {/* Thin gold ring (1.5px, #B8934A at ~70%) around photo with 10px gap */}
              <div
                className={`absolute -inset-[10px] rounded-full border-[1.5px] border-[#B8934A]/70 pointer-events-none z-10 transition-opacity duration-1000 ease-out motion-reduce:transition-none ${
                  isInView ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden="true"
              >
                {/* Tiny gold leaf icon badge at top-right */}
                <div
                  className="absolute top-[14%] right-[14%] -translate-y-1/2 translate-x-1/2 w-[28px] h-[28px] rounded-full bg-[#FFFDF9] border border-[#B8934A]/60 flex items-center justify-center shadow-[0_2px_6px_rgba(15,42,74,0.08)] z-20 pointer-events-none select-none"
                  aria-hidden="true"
                >
                  <Leaf className="w-3.5 h-3.5 text-[#B8934A] stroke-[2] rotate-12" />
                </div>

                {/* Symmetrical tiny gold leaf icon badge at bottom-left */}
                <div
                  className="absolute bottom-[14%] left-[14%] translate-y-1/2 -translate-x-1/2 w-[28px] h-[28px] rounded-full bg-[#FFFDF9] border border-[#B8934A]/60 flex items-center justify-center shadow-[0_2px_6px_rgba(15,42,74,0.08)] z-20 pointer-events-none select-none"
                  aria-hidden="true"
                >
                  <Leaf className="w-3.5 h-3.5 text-[#B8934A] stroke-[2] -rotate-168" />
                </div>
              </div>

              {/* Circular Photo Container: strengthened shadow, 4px white border */}
              <div
                className={`relative w-full h-full rounded-full overflow-hidden shadow-[0_28px_56px_rgba(15,42,74,0.22),0_8px_20px_rgba(15,42,74,0.08)] border-4 border-white bg-[#F3E6D3] z-10 transition-all duration-1000 ease-out will-change-transform motion-reduce:transition-none motion-reduce:transform-none ${
                  isInView ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                }`}
              >
                <Image
                  src={data.image_url || "/images/about/hands-holding-sprout.jpg"}
                  alt="Hands gently holding soil with growing green plant seedling"
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 640px) 310px, (max-width: 1024px) 365px, 410px"
                  className="object-cover object-center"
                  style={{
                    filter: "saturate(0.96) contrast(1.04) sepia(0.04)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Full-width gold hairline divider with delicate centered diamond */}
        <div
          className={`w-full flex items-center justify-center gap-3 mt-14 sm:mt-16 mb-9 sm:mb-11 transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none motion-reduce:transform-none ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ transitionDelay: "260ms" }}
          aria-hidden="true"
        >
          <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#B8934A]/30 to-[#B8934A]/60" />
          <span className="w-2 h-2 rotate-45 bg-[#B8934A] shrink-0 shadow-sm" />
          <span className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#B8934A]/30 to-[#B8934A]/60" />
        </div>

        {/* Second Row: Four Feature Pills with depth, gradient, top gold bar, and 52px badges */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-5 xl:gap-6 items-stretch">
            {DEFAULT_POINTS.map((pt, idx) => {
              const PtIcon = pt.icon;

              return (
                <div
                  key={pt.title}
                  style={{ transitionDelay: `${250 + idx * 90}ms` }}
                  className={`h-full flex flex-col transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none motion-reduce:transform-none ${
                    isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                >
                  <div className="group relative flex items-center gap-3.5 sm:gap-4 px-5 sm:px-5 lg:px-4 xl:px-5 py-4 sm:py-5 min-h-[102px] sm:min-h-[106px] h-full rounded-2xl sm:rounded-[26px] bg-gradient-to-b from-[#FFFEFB] to-[#FBF6EC] border border-[#B8934A]/35 shadow-[0_2px_4px_rgba(15,42,74,0.04),0_16px_32px_rgba(15,42,74,0.10)] hover:shadow-[0_4px_14px_rgba(15,42,74,0.08),0_22px_44px_rgba(184,147,74,0.18)] hover:border-[#B8934A]/80 hover:-translate-y-1 transition-all duration-300 ease-out cursor-default overflow-hidden">
                    {/* Small gold top accent bar (matching cards elsewhere on the site) */}
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-12 sm:w-14 h-[2px] bg-[#B8934A]/80 group-hover:bg-[#B8934A] group-hover:w-16 transition-all duration-300 rounded-b-sm"
                      aria-hidden="true"
                    />

                    {/* Navy #0F2A4A circle badge (about 52px) with gold line icon and thin gold ring */}
                    <div className="relative flex h-[52px] w-[52px] min-w-[52px] shrink-0 items-center justify-center rounded-full bg-[#0F2A4A] ring-1 ring-[#B8934A]/45 ring-offset-2 ring-offset-[#FBF6EC] group-hover:bg-[#B8934A] group-hover:ring-[#B8934A] shadow-[0_3px_10px_rgba(15,42,74,0.12)] transition-all duration-300">
                      <PtIcon className="h-5 w-5 stroke-[1.8] text-[#D9B96C] group-hover:text-white transition-colors duration-300" />
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* Title in navy serif: full untruncated text, wrapping gracefully if needed */}
                      <h4 className="font-serif text-[0.96rem] sm:text-[1.02rem] lg:text-[0.96rem] xl:text-[1.04rem] font-bold text-[#0F2A4A] tracking-tight leading-snug">
                        {pt.title}
                      </h4>
                      {/* Descriptor in navy-grey: full untruncated text */}
                      <p className="font-sans text-xs sm:text-[13px] text-[#0F2A4A]/70 font-normal leading-snug pt-1">
                        {pt.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
