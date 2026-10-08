"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import MotionReveal from "@/components/MotionReveal";
import CTAButton from "@/components/CTAButton";
import { ShieldCheck, Heart, ExternalLink } from "lucide-react";

export interface LameHeroData {
  eyebrow_label?: string | null;
  heading: string;
  description: string;
  image_url?: string | null;
  primary_cta_label?: string | null;
  primary_cta_url?: string | null;
  secondary_cta_label?: string | null;
  secondary_cta_url?: string | null;
  extra_data?: {
    badge_1?: string;
    badge_2?: string;
    badges?: string[];
  };
  is_active?: boolean;
}

const DEFAULT_HERO_DATA: LameHeroData = {
  eyebrow_label: "HAUTE DERMOCOSMETICS",
  heading: "Lamé\nBorn from Expertise",
  description:
    "Lamé is not just another cosmetic brand; it is the culmination of years of pharmaceutical expertise and a deep understanding of dermatological science. Created by Lamstone, Lamé bridges the gap between clinical efficacy and luxurious self-care.\n\nEvery product in the Lamé lineup is rigorously formulated, tested, and refined to ensure it meets the highest standards of safety and visible results. We believe that true beauty is synonymous with health.",
  image_url: "/images/lame/lame-products-hero.jpg",
  primary_cta_label: "Explore Signature Collection",
  primary_cta_url: "#collection",
  secondary_cta_label: "Shop Online",
  secondary_cta_url: "https://mylamstone.com/",
  extra_data: {
    badge_1: "CRUELTY FREE",
    badge_2: "CLINICALLY TESTED",
  },
  is_active: true,
};

export default function LameHeroSection() {
  const [data, setData] = useState<LameHeroData>(DEFAULT_HERO_DATA);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch("/api/lame-page", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.sections)) {
          const row = json.sections.find((s: any) => s.section_key === "hero");
          if (row) {
            setData({
              eyebrow_label: row.eyebrow_label || DEFAULT_HERO_DATA.eyebrow_label,
              heading: row.heading || DEFAULT_HERO_DATA.heading,
              description: row.description || DEFAULT_HERO_DATA.description,
              image_url:
                row.image_url && !row.image_url.includes("lam3") && !row.image_url.includes("newbanner")
                  ? row.image_url
                  : "/images/lame/lame-products-hero.jpg",
              primary_cta_label: row.primary_cta_label || DEFAULT_HERO_DATA.primary_cta_label,
              primary_cta_url: row.primary_cta_url || DEFAULT_HERO_DATA.primary_cta_url,
              secondary_cta_label: row.secondary_cta_label || DEFAULT_HERO_DATA.secondary_cta_label,
              secondary_cta_url: row.secondary_cta_url || DEFAULT_HERO_DATA.secondary_cta_url,
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

  const headingParts = (data.heading || "Lamé\nBorn from Expertise").split("\n");
  const mainTitle = headingParts[0] || "Lamé";
  const subtitle = headingParts.slice(1).join(" ") || "";

  const paragraphs = (data.description || "").split("\n\n").filter(Boolean);
  const badge1 = data.extra_data?.badge_1 || "CRUELTY FREE";
  const badge2 = data.extra_data?.badge_2 || "CLINICALLY TESTED";

  return (
    <section className="relative overflow-hidden min-h-[580px] lg:min-h-[640px] xl:min-h-[680px] flex items-center bg-[#F1E2CC]">

      {/* Background Photo with Left Edge Fade matching Cosmetics Hero */}
      <div
        className="absolute inset-y-0 right-0 w-full lg:w-[62%] xl:w-[60%] 2xl:w-[58%] z-0 select-none overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to left, #000 0%, #000 38%, rgba(0,0,0,0.85) 52%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.2) 84%, transparent 100%)",
          maskImage:
            "linear-gradient(to left, #000 0%, #000 38%, rgba(0,0,0,0.85) 52%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.2) 84%, transparent 100%)",
        }}
      >
        <Image
          src={data.image_url || "/images/lame/lame-products-hero.jpg"}
          alt="Lamé Signature Collection dermocosmetics products on emerald green silk"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover object-[center_60%] lg:object-[center_60%] contrast-[1.02] saturate-[1.04]"
        />

        {/* Mobile-only soft backdrop readability wash in sand */}
        <div className="block lg:hidden absolute inset-0 bg-[#F1E2CC]/90 backdrop-blur-[2px] pointer-events-none z-3" />
      </div>

      {/* Bottom seam blend */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 h-8 sm:h-12 bg-gradient-to-t from-[#F1E2CC] via-[#F1E2CC]/40 to-transparent z-10"
        aria-hidden="true"
      />

      {/* Foreground Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24">
        <div className="max-w-md lg:max-w-[460px] xl:max-w-[500px] 2xl:max-w-[540px] space-y-7 sm:space-y-8">
          {data.eyebrow_label && (
            <MotionReveal delay={100} direction="up">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="h-[1px] w-6 sm:w-10 bg-[#B8934A]/50" />
                <span className="text-xs sm:text-[12.5px] uppercase tracking-[0.28em] font-sans font-semibold text-[#B8934A]">
                  {data.eyebrow_label}
                </span>
                <span className="h-[1px] w-6 sm:w-10 bg-[#B8934A]/50" />
              </div>
            </MotionReveal>
          )}

          <MotionReveal delay={250} direction="up">
            <div>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#0F2A4A] leading-[1.06]">
                {mainTitle}
              </h1>
              {subtitle && (
                <h2 className="font-serif text-2xl sm:text-3xl text-[#0F2A4A] font-normal mt-2">
                  {subtitle.includes("Expertise") ? (
                    <>
                      {subtitle.replace("Expertise", "").trim()}{" "}
                      <span className="italic text-[#B31942] font-semibold">Expertise</span>
                    </>
                  ) : (
                    subtitle
                  )}
                </h2>
              )}
              {/* Thin gold hairline with a small dot beneath the heading */}
              <div className="flex items-center gap-1.5 mt-3 sm:mt-3.5" aria-hidden="true">
                <span className="w-14 sm:w-16 h-[1.5px] bg-[#B8934A]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8934A]" />
              </div>
            </div>
          </MotionReveal>

          {paragraphs.map((para, idx) => (
            <MotionReveal key={idx} delay={380 + idx * 80} direction="up">
              <p
                className="text-base sm:text-lg font-light leading-relaxed text-[#243E5E]"
              >
                {para}
              </p>
            </MotionReveal>
          ))}

          {/* Badges */}
          {(badge1 || badge2) && (
            <MotionReveal delay={540} direction="up">
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {badge1 && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#B8934A]/40 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#0F2A4A] shadow-[0_2px_8px_rgba(15,42,74,0.06)] hover:border-[#B8934A] transition-colors">
                    <Heart className="h-4 w-4 text-[#B8934A]" />
                    <span>{badge1}</span>
                  </div>
                )}
                {badge2 && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#B8934A]/40 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#0F2A4A] shadow-[0_2px_8px_rgba(15,42,74,0.06)] hover:border-[#B8934A] transition-colors">
                    <ShieldCheck className="h-4 w-4 text-[#B8934A]" />
                    <span>{badge2}</span>
                  </div>
                )}
              </div>
            </MotionReveal>
          )}

          {/* CTAs */}
          {(data.primary_cta_label || data.secondary_cta_label) && (
            <MotionReveal delay={620} direction="up">
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {data.primary_cta_label && (
                  <CTAButton
                    href={data.primary_cta_url || "#collection"}
                    variant="navy"
                    size="lg"
                    className="rounded-full shadow-[0_4px_16px_rgba(15,42,74,0.22)] hover:shadow-md"
                  >
                    {data.primary_cta_label}
                  </CTAButton>
                )}
                {data.secondary_cta_label && (
                  <a
                    href={data.secondary_cta_url || "https://mylamstone.com/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-[#0F2A4A] text-[#0F2A4A] hover:bg-[#0F2A4A] hover:text-white bg-transparent px-6 py-3.5 text-xs sm:text-sm font-semibold transition-all duration-300 shadow-2xs hover:shadow-xs"
                  >
                    <span>{data.secondary_cta_label}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </MotionReveal>
          )}
        </div>
      </div>
    </section>
  );
}
