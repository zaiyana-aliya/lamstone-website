"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import MotionReveal from "@/components/MotionReveal";
import { Sparkles, ArrowRight, ShieldCheck, TrendingUp } from "lucide-react";

export interface CareersHeroData {
  eyebrow_label?: string | null;
  heading?: string;
  description?: string;
  image_url?: string | null;
  primary_cta_label?: string | null;
  primary_cta_url?: string | null;
  secondary_cta_label?: string | null;
  secondary_cta_url?: string | null;
  extra_data?: Record<string, any>;
}

const DEFAULT_HERO: CareersHeroData = {
  eyebrow_label: "Join Our Team",
  heading: "Careers at\nLamstone",
  description:
    "Be part of a growing healthcare, pharmaceutical, and beauty ecosystem.\n\nJoin our passionate team across retail pharmacies, cosmetics distribution, and corporate operations. Open roles will be posted here soon.",
  image_url: "/images/careers/careers-team-collaborating.jpg",
  primary_cta_label: "View Open Roles",
  primary_cta_url: "#careers-notice",
  extra_data: {
    subheading: "Be part of a growing healthcare, pharmaceutical, and beauty ecosystem.",
    secondary_description:
      "Join our passionate team across retail pharmacies, cosmetics distribution, and corporate operations. Open roles will be posted here soon.",
    badge1_label: "Equal",
    badge1_title: "Opportunity",
    badge2_label: "Growth",
    badge2_title: "Ecosystem",
    badge3_title: "Expanding Network",
    badge3_subtitle: "Kerala & South India",
  },
};

export default function CareersHeroSection({ initialData }: { initialData?: CareersHeroData }) {
  const [data, setData] = useState<CareersHeroData>(initialData || DEFAULT_HERO);

  useEffect(() => {
    fetch("/api/careers-page")
      .then((res) => res.json())
      .then((json) => {
        if (json.sections && Array.isArray(json.sections)) {
          const heroSec = json.sections.find((s: any) => s.section_key === "hero");
          if (heroSec) {
            setData({
              eyebrow_label: heroSec.eyebrow_label ?? DEFAULT_HERO.eyebrow_label,
              heading: heroSec.heading ?? DEFAULT_HERO.heading,
              description: heroSec.description ?? DEFAULT_HERO.description,
              image_url: heroSec.image_url ?? DEFAULT_HERO.image_url,
              primary_cta_label: heroSec.primary_cta_label ?? DEFAULT_HERO.primary_cta_label,
              primary_cta_url: heroSec.primary_cta_url ?? DEFAULT_HERO.primary_cta_url,
              secondary_cta_label: heroSec.secondary_cta_label ?? DEFAULT_HERO.secondary_cta_label,
              secondary_cta_url: heroSec.secondary_cta_url ?? DEFAULT_HERO.secondary_cta_url,
              extra_data: {
                ...DEFAULT_HERO.extra_data,
                ...(heroSec.extra_data || {}),
              },
            });
          }
        }
      })
      .catch(() => {});
  }, []);

  const extra = data.extra_data || {};
  const subheading =
    extra.subheading ||
    data.description?.split("\n\n")[0] ||
    DEFAULT_HERO.extra_data?.subheading;
  const secondaryDescription =
    extra.secondary_description ||
    data.description?.split("\n\n")[1] ||
    DEFAULT_HERO.extra_data?.secondary_description;

  const bgImage = data.image_url || "/images/careers/careers-team-collaborating.jpg";

  return (
    <section
      className="relative w-full overflow-hidden bg-[#F1E2CC] min-h-[calc(100vh-var(--header-height,77px))] min-h-[calc(100svh-var(--header-height,77px))] flex items-center"
      style={{
        minHeight: "calc(100svh - var(--header-height, 77px))",
      }}
    >
      {/* Background Photo — Right-anchored with smooth left dissolution */}
      <div
        className="absolute inset-y-0 right-0 w-full lg:w-[64%] xl:w-[62%] 2xl:w-[60%] z-0 select-none overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to left, #000 0%, #000 38%, rgba(0,0,0,0.85) 52%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.2) 84%, transparent 100%)",
          maskImage:
            "linear-gradient(to left, #000 0%, #000 38%, rgba(0,0,0,0.85) 52%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.2) 84%, transparent 100%)",
        }}
      >
        <Image
          src={bgImage}
          alt={data.heading || "Lamstone HealthCare team members collaborating"}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover object-[72%_22%] lg:object-[72%_24%] contrast-[1.04] saturate-[1.08]"
        />

        {/* Soft atmospheric fade on the left edge where image meets text */}
        <div
          className="hidden lg:block absolute inset-y-0 left-0 w-44 xl:w-56 bg-gradient-to-r from-[#F1E2CC] via-[#F1E2CC]/80 to-transparent pointer-events-none z-2"
          aria-hidden="true"
        />

        {/* Mobile-only soft backdrop readability wash */}
        <div className="block lg:hidden absolute inset-0 bg-[#F1E2CC]/90 backdrop-blur-[2px] pointer-events-none z-3" />
      </div>

      {/* Bottom seam blend matching page theme */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 h-8 sm:h-12 bg-gradient-to-t from-[#F1E2CC] via-[#F1E2CC]/40 to-transparent z-10"
        aria-hidden="true"
      />

      {/* Foreground Content Container */}
      <div className="relative z-10 w-full pl-6 sm:pl-8 lg:pl-10 xl:pl-14 pr-6 sm:pr-8 lg:pr-12 py-16 sm:py-16 lg:py-16 xl:py-20 h-full flex flex-col justify-center">
        <div className="max-w-md sm:max-w-2xl lg:max-w-[580px] xl:max-w-[650px] 2xl:max-w-[690px] space-y-4 sm:space-y-4.5 lg:space-y-3.5 xl:space-y-4 my-auto">
          {/* Eyebrow Label: Gold with wide tracking and flanking thin lines */}
          {data.eyebrow_label && (
            <MotionReveal delay={80} direction="up">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="h-[1px] w-6 sm:w-10 bg-[#B8934A]/50" />
                <span className="text-xs sm:text-[12.5px] uppercase tracking-[0.28em] font-sans font-semibold text-[#B8934A]">
                  {data.eyebrow_label}
                </span>
                <span className="h-[1px] w-6 sm:w-10 bg-[#B8934A]/50" />
              </div>
            </MotionReveal>
          )}

          {/* Main Headline: Dark Navy Serif with thin gold hairline and dot */}
          <MotionReveal delay={180} direction="up" className="!mt-2 sm:!mt-2.5">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[52px] xl:text-[56px] font-bold text-[#0F2A4A] tracking-tight leading-[1.10] whitespace-pre-line">
              {data.heading}
            </h1>
            <div className="flex items-center gap-1.5 mt-3 sm:mt-3.5" aria-hidden="true">
              <span className="w-14 sm:w-16 h-[1.5px] bg-[#B8934A]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8934A]" />
            </div>
          </MotionReveal>

          {/* Lead Subheading */}
          {subheading && (
            <MotionReveal delay={280} direction="up">
              <p className="font-serif text-[17px] sm:text-[18px] text-[#0F2A4A] leading-[1.65] font-normal pt-0.5">
                {subheading}
              </p>
            </MotionReveal>
          )}

          {/* Secondary Paragraph */}
          {secondaryDescription && (
            <MotionReveal delay={360} direction="up">
              <p className="font-sans text-xs sm:text-[13px] text-[#0F2A4A]/80 leading-[1.7] font-normal whitespace-pre-line">
                {secondaryDescription}
              </p>
            </MotionReveal>
          )}

          {/* Unified Trust Bar: Single white rounded bar containing all badges in ONE row on desktop */}
          <MotionReveal delay={420} direction="up" className="w-full lg:w-max max-w-[840px] pt-1.5 sm:pt-2">
            <div className="w-full rounded-[24px] sm:rounded-full bg-white border border-[rgba(184,147,74,0.35)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_36px_-14px_rgba(16,24,64,0.18)] px-5 sm:px-4 md:px-5 lg:px-7 py-4 sm:py-3.5 md:py-4 lg:py-4.5 select-none">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-2.5 md:gap-3.5 lg:gap-6">
                {/* Badge 1: Equal Opportunity */}
                <div className="group/badge flex items-center gap-3 sm:gap-2 md:gap-2.5 lg:gap-3.5 shrink-0">
                  <div className="flex h-11 w-11 sm:h-9.5 sm:w-9.5 md:h-10.5 md:w-10.5 lg:h-[48px] lg:w-[48px] shrink-0 items-center justify-center rounded-full bg-[#0F2A4A] ring-2 ring-[#B8934A] ring-offset-[3px] ring-offset-white shadow-[0_2px_8px_rgba(15,42,74,0.18)] text-[#B8934A] transition-all duration-300 ease-out group-hover/badge:-translate-y-0.5 group-hover/badge:ring-[#C9A24B] group-hover/badge:shadow-[0_4px_14px_rgba(184,147,74,0.35)]">
                    <ShieldCheck className="h-5 w-5 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 lg:h-5.5 lg:w-5.5 stroke-[2]" />
                  </div>
                  <div className="flex flex-col justify-center text-left leading-tight">
                    <span className="font-serif text-[14px] sm:text-[12px] md:text-[13px] lg:text-[15.5px] font-bold text-[#0F2A4A] tracking-tight whitespace-nowrap">
                      {extra.badge1_label ? `${extra.badge1_label} ` : ""}
                      {extra.badge1_title || "Opportunity"}
                    </span>
                    <span className="font-sans text-[11px] sm:text-[9.5px] md:text-[10px] lg:text-[11.5px] text-[#0F2A4A]/70 font-normal tracking-[0.03em] sm:tracking-normal lg:tracking-[0.03em] mt-0.5 whitespace-nowrap">
                      {extra.badge1_subtitle || "Fair Workplace"}
                    </span>
                  </div>
                </div>

                {/* Divider 1 */}
                <div className="hidden sm:block w-[1px] h-8 lg:h-9 bg-[rgba(184,147,74,0.35)] shrink-0 self-center" aria-hidden="true" />
                <div className="block sm:hidden w-full h-[1px] bg-[rgba(184,147,74,0.20)]" aria-hidden="true" />

                {/* Badge 2: Growth Ecosystem */}
                <div className="group/badge flex items-center gap-3 sm:gap-2 md:gap-2.5 lg:gap-3.5 shrink-0">
                  <div className="flex h-11 w-11 sm:h-9.5 sm:w-9.5 md:h-10.5 md:w-10.5 lg:h-[48px] lg:w-[48px] shrink-0 items-center justify-center rounded-full bg-[#0F2A4A] ring-2 ring-[#B8934A] ring-offset-[3px] ring-offset-white shadow-[0_2px_8px_rgba(15,42,74,0.18)] text-[#B8934A] transition-all duration-300 ease-out group-hover/badge:-translate-y-0.5 group-hover/badge:ring-[#C9A24B] group-hover/badge:shadow-[0_4px_14px_rgba(184,147,74,0.35)]">
                    <TrendingUp className="h-5 w-5 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 lg:h-5.5 lg:w-5.5 stroke-[2]" />
                  </div>
                  <div className="flex flex-col justify-center text-left leading-tight">
                    <span className="font-serif text-[14px] sm:text-[12px] md:text-[13px] lg:text-[15.5px] font-bold text-[#0F2A4A] tracking-tight whitespace-nowrap">
                      {extra.badge2_label ? `${extra.badge2_label} ` : ""}
                      {extra.badge2_title || "Ecosystem"}
                    </span>
                    <span className="font-sans text-[11px] sm:text-[9.5px] md:text-[10px] lg:text-[11.5px] text-[#0F2A4A]/70 font-normal tracking-[0.03em] sm:tracking-normal lg:tracking-[0.03em] mt-0.5 whitespace-nowrap">
                      {extra.badge2_subtitle || "Active Pathways"}
                    </span>
                  </div>
                </div>

                {/* Divider 2 */}
                <div className="hidden sm:block w-[1px] h-8 lg:h-9 bg-[rgba(184,147,74,0.35)] shrink-0 self-center" aria-hidden="true" />
                <div className="block sm:hidden w-full h-[1px] bg-[rgba(184,147,74,0.20)]" aria-hidden="true" />

                {/* Badge 3: Expanding Network */}
                <div className="group/badge flex items-center gap-3 sm:gap-2 md:gap-2.5 lg:gap-3.5 shrink-0">
                  <div className="flex h-11 w-11 sm:h-9.5 sm:w-9.5 md:h-10.5 md:w-10.5 lg:h-[48px] lg:w-[48px] shrink-0 items-center justify-center rounded-full bg-[#0F2A4A] ring-2 ring-[#B8934A] ring-offset-[3px] ring-offset-white shadow-[0_2px_8px_rgba(15,42,74,0.18)] text-[#B8934A] transition-all duration-300 ease-out group-hover/badge:-translate-y-0.5 group-hover/badge:ring-[#C9A24B] group-hover/badge:shadow-[0_4px_14px_rgba(184,147,74,0.35)]">
                    <Sparkles className="h-5 w-5 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 lg:h-5.5 lg:w-5.5 stroke-[2]" />
                  </div>
                  <div className="flex flex-col justify-center text-left leading-tight">
                    <span className="font-serif text-[14px] sm:text-[12px] md:text-[13px] lg:text-[15.5px] font-bold text-[#0F2A4A] tracking-tight whitespace-nowrap">
                      {extra.badge3_title || "Expanding Network"}
                    </span>
                    <span className="font-sans text-[11px] sm:text-[9.5px] md:text-[10px] lg:text-[11.5px] text-[#0F2A4A]/70 font-normal tracking-[0.03em] sm:tracking-normal lg:tracking-[0.03em] mt-0.5 whitespace-nowrap">
                      {extra.badge3_subtitle || "Kerala & South India"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </MotionReveal>

          {/* Primary CTA: Navy pill button with gold arrow circle */}
          {data.primary_cta_label && (
            <MotionReveal delay={480} direction="up" className="pt-2 sm:pt-2.5">
              <div className="flex items-center">
                <Link
                  href={data.primary_cta_url || "#careers-notice"}
                  className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-[#0F2A4A] hover:bg-[#173A6B] text-white pl-8 pr-3.5 py-3.5 sm:pl-9 sm:pr-4 sm:py-4 text-xs sm:text-[13px] font-sans font-semibold uppercase tracking-[0.16em] shadow-[0_4px_18px_rgba(15,42,74,0.22)] hover:shadow-[0_8px_26px_rgba(15,42,74,0.32)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                >
                  <span>{data.primary_cta_label}</span>
                  <div className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full bg-[#B8934A] text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white group-hover:translate-x-0.5 transition-transform duration-200" />
                  </div>
                </Link>
              </div>
            </MotionReveal>
          )}
        </div>
      </div>
    </section>
  );
}
