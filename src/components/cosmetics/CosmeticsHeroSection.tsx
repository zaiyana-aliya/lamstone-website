"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MotionReveal from "@/components/MotionReveal";
import { ArrowRight, ShieldCheck, Sparkles, Heart } from "lucide-react";

export interface CosmeticsHeroData {
  eyebrow_label?: string | null;
  heading: string;
  description: string;
  image_url?: string | null;
  primary_cta_label?: string | null;
  primary_cta_url?: string | null;
  extra_data?: {
    subheading?: string;
    secondary_description?: string;
    stat_trusted_year?: string;
    stat_trusted_sub?: string;
    stat_partners_count?: string;
    stat_partners_sub?: string;
    stat_authentic_badge?: string;
    stat_authentic_sub?: string;
  };
  is_active?: boolean;
}

const DEFAULT_HERO_DATA: CosmeticsHeroData = {
  eyebrow_label: "Distribution & Retail",
  heading: "Cosmetics\nDivision",
  description:
    "Pioneering access to world-class beauty, dermatological, and personal care solutions across Kerala.\n\nLamstone Cosmetic Division is dedicated to bringing premium skincare, beauty, and personal care solutions to consumers through a robust and expanding distribution network.",
  image_url: "/images/cosmetics/lame-products-hero.jpg",
  primary_cta_label: "Contact Distribution",
  primary_cta_url: "/contact",
  extra_data: {
    subheading:
      "Pioneering access to world-class beauty, dermatological, and personal care solutions across Kerala.",
    secondary_description:
      "Lamstone Cosmetic Division is dedicated to bringing premium skincare, beauty, and personal care solutions to consumers through a robust and expanding distribution network.",
    stat_trusted_year: "2019",
    stat_partners_count: "9+",
    stat_authentic_badge: "100% Authentic",
    stat_authentic_sub: "Dermatologist Approved",
  },
  is_active: true,
};

function renderCosmeticsHeading(heading: string) {
  if (!heading) return null;
  const lines = heading.split("\n");
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(Division\.?)/i);
    return (
      <span key={lineIdx} className="block">
        {parts.map((part, partIdx) =>
          /Division\.?/i.test(part) ? (
            <span
              key={partIdx}
              className="text-[#B31942] tracking-tight inline-block"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 700,
              }}
            >
              {part}
            </span>
          ) : (
            <span key={partIdx} className="text-[#0F2A4A]">
              {part}
            </span>
          )
        )}
      </span>
    );
  });
}

function renderBadgeTitle(title: string) {
  if (!title) return null;
  const parts = title.split(/(\d+%?|\d+\+)/g);
  return (
    <>
      {parts.map((part, idx) =>
        /(\d+%?|\d+\+)/.test(part) ? (
          <span key={idx} className="text-[#B31942] font-bold">
            {part}
          </span>
        ) : (
          <span key={idx}>{part}</span>
        )
      )}
    </>
  );
}

export default function CosmeticsHeroSection() {
  const [data, setData] = useState<CosmeticsHeroData>(DEFAULT_HERO_DATA);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch("/api/cosmetics-page", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.sections)) {
          const row = json.sections.find((s: any) => s.section_key === "hero");
          if (row) {
            setData({
              eyebrow_label: row.eyebrow_label || DEFAULT_HERO_DATA.eyebrow_label,
              heading: row.heading || DEFAULT_HERO_DATA.heading,
              description: row.description || DEFAULT_HERO_DATA.description,
              image_url: row.image_url || DEFAULT_HERO_DATA.image_url,
              primary_cta_label: row.primary_cta_label || DEFAULT_HERO_DATA.primary_cta_label,
              primary_cta_url: row.primary_cta_url || DEFAULT_HERO_DATA.primary_cta_url,
              extra_data: {
                ...DEFAULT_HERO_DATA.extra_data,
                ...(row.extra_data || {}),
              },
              is_active: row.is_active ?? true,
            });
          }
        }
      } catch {
        // graceful fallback
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (data.is_active === false) return null;

  const paragraphs = (data.description || "").split("\n\n").filter(Boolean);
  const subheading =
    data.extra_data?.subheading ||
    paragraphs[0] ||
    "Pioneering access to world-class beauty, dermatological, and personal care solutions across Kerala.";
  const secondaryDesc =
    data.extra_data?.secondary_description ||
    (paragraphs.length > 1 ? paragraphs.slice(1).join("\n\n") : "") ||
    "Lamstone Cosmetic Division is dedicated to bringing premium skincare, beauty, and personal care solutions to consumers through a robust and expanding distribution network.";

  return (
    <section className="relative w-full overflow-hidden bg-[#F1E2CC] min-h-[560px] lg:h-[calc(100vh-76px)] lg:min-h-[600px] lg:max-h-[840px] 2xl:max-h-[900px] flex items-center">
      {/* 1. Background Photo with left-edge blend mask fading into Sand (#F1E2CC) */}
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
          src={data.image_url || "/images/cosmetics/lame-products-hero.jpg"}
          alt="Curated premium cosmetics, skincare, and personal care products portfolio"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 64vw"
          className="object-cover object-center lg:object-[82%_center] xl:object-[80%_center]"
        />

        {/* Mobile-only soft backdrop readability wash in sand */}
        <div className="block lg:hidden absolute inset-0 bg-[#F1E2CC]/90 backdrop-blur-[2px] pointer-events-none z-[2]" />
      </div>

      {/* Seam blend at the bottom */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 h-8 sm:h-12 bg-gradient-to-t from-[#F1E2CC] via-[#F1E2CC]/40 to-transparent z-10"
        aria-hidden="true"
      />

      {/* Foreground Content Container */}
      <div className="relative z-10 w-full pl-6 sm:pl-8 lg:pl-10 xl:pl-14 pr-6 sm:pr-8 lg:pr-12 py-10 sm:py-14 lg:py-0 h-full flex flex-col justify-center">
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

          {/* Main Headline: "Cosmetics" solid navy, "Division" Playfair italic brand red */}
          <MotionReveal delay={180} direction="up" className="!mt-2 sm:!mt-2.5">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[52px] xl:text-[56px] font-bold tracking-tight leading-[1.10]">
              {renderCosmeticsHeading(data.heading || "Cosmetics\nDivision")}
            </h1>
            {/* Thin gold hairline with a small dot beneath the heading */}
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
          {secondaryDesc && (
            <MotionReveal delay={360} direction="up">
              <p className="font-sans text-xs sm:text-[13px] text-[#0F2A4A]/80 leading-[1.7] font-normal">
                {secondaryDesc}
              </p>
            </MotionReveal>
          )}

          {/* 3. Unified Trust Bar: Single white rounded bar containing all three badges in ONE row on desktop */}
          <MotionReveal delay={420} direction="up" className="w-full lg:w-max max-w-[800px] pt-1.5 sm:pt-2">
            <div className="w-full rounded-[24px] sm:rounded-full bg-white border border-[rgba(184,147,74,0.35)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_36px_-14px_rgba(16,24,64,0.22)] px-5 sm:px-4 md:px-5 lg:px-7 py-4 sm:py-3.5 md:py-4 lg:py-5 select-none">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-2.5 md:gap-3.5 lg:gap-6">
                {/* Badge 1: Trusted since 2019 */}
                <div className="group/badge flex items-center gap-3 sm:gap-2 md:gap-2.5 lg:gap-3.5 shrink-0">
                  <div className="flex h-11 w-11 sm:h-9.5 sm:w-9.5 md:h-10.5 md:w-10.5 lg:h-[52px] lg:w-[52px] shrink-0 items-center justify-center rounded-full bg-[#0F2A4A] ring-2 ring-[#B8934A] ring-offset-[3px] ring-offset-white shadow-[0_2px_8px_rgba(15,42,74,0.18)] text-[#B8934A] transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:transform-none group-hover/badge:-translate-y-0.5 group-hover/badge:ring-[#C9A24B] group-hover/badge:shadow-[0_4px_14px_rgba(184,147,74,0.35)]">
                    <ShieldCheck className="h-5 w-5 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 lg:h-6 lg:w-6 stroke-[2]" />
                  </div>
                  <div className="flex flex-col justify-center text-left leading-tight">
                    <span className="font-serif text-[14.5px] sm:text-[12.5px] md:text-[13.5px] lg:text-[16.5px] font-bold text-[#0F2A4A] tracking-tight whitespace-nowrap">
                      {renderBadgeTitle(
                        data.extra_data?.stat_trusted_year
                          ? `Trusted since ${data.extra_data.stat_trusted_year}`
                          : "Trusted since 2019"
                      )}
                    </span>
                    <span className="font-sans text-[11px] sm:text-[9.5px] md:text-[10px] lg:text-[12px] text-[#0F2A4A]/70 font-normal tracking-[0.03em] sm:tracking-normal lg:tracking-[0.03em] mt-0.5 whitespace-nowrap">
                      {data.extra_data?.stat_trusted_sub || "Verified Quality"}
                    </span>
                  </div>
                </div>

                {/* Divider 1: Thin vertical gold line on desktop, horizontal on mobile */}
                <div className="hidden sm:block w-[1px] h-8 lg:h-9 bg-[rgba(184,147,74,0.35)] shrink-0 self-center" aria-hidden="true" />
                <div className="block sm:hidden w-full h-[1px] bg-[rgba(184,147,74,0.20)]" aria-hidden="true" />

                {/* Badge 2: 9+ Brand Partners */}
                <div className="group/badge flex items-center gap-3 sm:gap-2 md:gap-2.5 lg:gap-3.5 shrink-0">
                  <div className="flex h-11 w-11 sm:h-9.5 sm:w-9.5 md:h-10.5 md:w-10.5 lg:h-[52px] lg:w-[52px] shrink-0 items-center justify-center rounded-full bg-[#0F2A4A] ring-2 ring-[#B8934A] ring-offset-[3px] ring-offset-white shadow-[0_2px_8px_rgba(15,42,74,0.18)] text-[#B8934A] transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:transform-none group-hover/badge:-translate-y-0.5 group-hover/badge:ring-[#C9A24B] group-hover/badge:shadow-[0_4px_14px_rgba(184,147,74,0.35)]">
                    <Sparkles className="h-5 w-5 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 lg:h-6 lg:w-6 stroke-[2]" />
                  </div>
                  <div className="flex flex-col justify-center text-left leading-tight">
                    <span className="font-serif text-[14.5px] sm:text-[12.5px] md:text-[13.5px] lg:text-[16.5px] font-bold text-[#0F2A4A] tracking-tight whitespace-nowrap">
                      {renderBadgeTitle(
                        data.extra_data?.stat_partners_count
                          ? `${data.extra_data.stat_partners_count} Brand Partners`
                          : "9+ Brand Partners"
                      )}
                    </span>
                    <span className="font-sans text-[11px] sm:text-[9.5px] md:text-[10px] lg:text-[12px] text-[#0F2A4A]/70 font-normal tracking-[0.03em] sm:tracking-normal lg:tracking-[0.03em] mt-0.5 whitespace-nowrap">
                      {data.extra_data?.stat_partners_sub || "Authorized Network"}
                    </span>
                  </div>
                </div>

                {/* Divider 2: Thin vertical gold line on desktop, horizontal on mobile */}
                <div className="hidden sm:block w-[1px] h-8 lg:h-9 bg-[rgba(184,147,74,0.35)] shrink-0 self-center" aria-hidden="true" />
                <div className="block sm:hidden w-full h-[1px] bg-[rgba(184,147,74,0.20)]" aria-hidden="true" />

                {/* Badge 3: 100% Authentic */}
                <div className="group/badge flex items-center gap-3 sm:gap-2 md:gap-2.5 lg:gap-3.5 shrink-0">
                  <div className="flex h-11 w-11 sm:h-9.5 sm:w-9.5 md:h-10.5 md:w-10.5 lg:h-[52px] lg:w-[52px] shrink-0 items-center justify-center rounded-full bg-[#0F2A4A] ring-2 ring-[#B8934A] ring-offset-[3px] ring-offset-white shadow-[0_2px_8px_rgba(15,42,74,0.18)] text-[#B8934A] transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:transform-none group-hover/badge:-translate-y-0.5 group-hover/badge:ring-[#C9A24B] group-hover/badge:shadow-[0_4px_14px_rgba(184,147,74,0.35)]">
                    <Heart className="h-5 w-5 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5 lg:h-6 lg:w-6 stroke-[2]" />
                  </div>
                  <div className="flex flex-col justify-center text-left leading-tight">
                    <span className="font-serif text-[14.5px] sm:text-[12.5px] md:text-[13.5px] lg:text-[16.5px] font-bold text-[#0F2A4A] tracking-tight whitespace-nowrap">
                      {renderBadgeTitle(data.extra_data?.stat_authentic_badge || "100% Authentic")}
                    </span>
                    <span className="font-sans text-[11px] sm:text-[9.5px] md:text-[10px] lg:text-[12px] text-[#0F2A4A]/70 font-normal tracking-[0.03em] sm:tracking-normal lg:tracking-[0.03em] mt-0.5 whitespace-nowrap">
                      {data.extra_data?.stat_authentic_sub || "Dermatologist Approved"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </MotionReveal>

          {/* 4. Primary CTA: Navy pill button with gold arrow circle */}
          {data.primary_cta_label && (
            <MotionReveal delay={480} direction="up" className="pt-2 sm:pt-2.5">
              <div className="flex items-center">
                <Link
                  href={data.primary_cta_url || "/contact"}
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
