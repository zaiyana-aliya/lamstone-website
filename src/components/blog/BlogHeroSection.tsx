"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MotionReveal from "@/components/MotionReveal";
import { BookOpen, Sparkles, ArrowRight, Layers } from "lucide-react";

export interface BlogHeroData {
  eyebrow_label?: string | null;
  heading: string;
  description: string;
  image_url?: string | null;
  primary_cta_label?: string | null;
  primary_cta_url?: string | null;
  extra_data?: {
    subheading?: string;
    secondary_description?: string;
    badge_1_label?: string;
    badge_1_value?: string;
    badge_2_value?: string;
    badge_2_label?: string;
    badge_3_title?: string;
    badge_3_sub?: string;
  };
  is_active?: boolean;
}

const DEFAULT_HERO_DATA: BlogHeroData = {
  eyebrow_label: "Insights & Perspectives",
  heading: "Blogs &\nPerspectives",
  description:
    "Thought leadership, healthcare innovations, skincare science, and ecosystem milestones.\n\nExplore in-depth articles, scientific perspectives, and executive insights from the teams shaping Lamstone HealthCare.",
  image_url: "/images/blog-hero-reading.jpg",
  primary_cta_label: "Explore Articles",
  primary_cta_url: "#articles",
  extra_data: {
    subheading: "Thought leadership, healthcare innovations, skincare science, and ecosystem milestones.",
    secondary_description:
      "Explore in-depth articles, scientific perspectives, and executive insights from the teams shaping Lamstone HealthCare.",
    badge_1_label: "Curated",
    badge_1_value: "Insights",
    badge_2_value: "3",
    badge_2_label: "Core Pillars",
    badge_3_title: "Regular Edition",
    badge_3_sub: "Healthcare & Science",
  },
  is_active: true,
};

export default function BlogHeroSection() {
  const [data, setData] = useState<BlogHeroData>(DEFAULT_HERO_DATA);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch("/api/blog-page", { cache: "no-store" });
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
    "Thought leadership, healthcare innovations, skincare science, and ecosystem milestones.";
  const secondaryDesc =
    data.extra_data?.secondary_description ||
    (paragraphs.length > 1 ? paragraphs.slice(1).join("\n\n") : "") ||
    "Explore in-depth articles, scientific perspectives, and executive insights from the teams shaping Lamstone HealthCare.";

  const headingLines = (data.heading || "Blogs &\nPerspectives").split("\n");

  const badge1Label = data.extra_data?.badge_1_label || "Curated";
  const badge1Val = data.extra_data?.badge_1_value || "Insights";
  const badge2Val = data.extra_data?.badge_2_value || "3";
  const badge2Label = data.extra_data?.badge_2_label || "Core Pillars";
  const badge3Title = data.extra_data?.badge_3_title || "Regular Edition";
  const badge3Sub = data.extra_data?.badge_3_sub || "Healthcare & Science";

  return (
    <section className="relative w-full overflow-hidden bg-[#F1E2CC] min-h-[560px] lg:min-h-[600px] xl:min-h-[640px] flex items-center">

      {/* Background Photo with Left Edge Fade into Sand (#F1E2CC) */}
      <div
        className="absolute inset-y-0 right-0 w-full lg:w-[64%] xl:w-[60%] 2xl:w-[56%] z-0 select-none overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to left, #000 0%, #000 38%, rgba(0,0,0,0.85) 52%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.2) 84%, transparent 100%)",
          maskImage:
            "linear-gradient(to left, #000 0%, #000 38%, rgba(0,0,0,0.85) 52%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.2) 84%, transparent 100%)",
        }}
      >
        <Image
          src={data.image_url || "/images/blog-hero-reading.jpg"}
          alt="Editorial journal, healthcare research, and perspectives"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover object-[78%_center] contrast-[1.02] saturate-[1.04]"
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
      <div className="relative z-10 w-full pl-6 sm:pl-8 lg:pl-10 xl:pl-12 pr-6 sm:pr-8 lg:pr-12 py-16 sm:py-20 lg:py-22 xl:py-24">
        <div className="max-w-md lg:max-w-[480px] xl:max-w-[540px] space-y-6 sm:space-y-7">
          {/* Eyebrow Label: Gold with thin lines */}
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

          {/* Main Headline */}
          <MotionReveal delay={180} direction="up">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[54px] xl:text-[58px] font-bold tracking-tight text-[#0F2A4A] leading-[1.10]">
              {headingLines.map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  {idx < headingLines.length - 1 && (
                    <>
                      <br className="hidden sm:inline" />
                      <span className="sm:hidden"> </span>
                    </>
                  )}
                </React.Fragment>
              ))}
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
              <p className="font-serif text-base sm:text-[18px] text-[#0F2A4A] leading-[1.65] font-normal pt-0.5">
                {subheading}
              </p>
            </MotionReveal>
          )}

          {/* Secondary Paragraph */}
          {secondaryDesc && (
            <MotionReveal delay={360} direction="up">
              <p className="text-xs sm:text-sm text-[#243E5E] leading-[1.75] font-normal">
                {secondaryDesc}
              </p>
            </MotionReveal>
          )}

          {/* Primary Action Button & Badges */}
          <MotionReveal delay={460} direction="up">
            <div className="space-y-6 pt-3">
              {data.primary_cta_label && (
                <div className="flex items-center">
                  <Link
                    href={data.primary_cta_url || "#articles"}
                    className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#0F2A4A] hover:bg-[#173A6B] text-white px-7 py-3.5 text-xs sm:text-sm font-semibold tracking-wide shadow-[0_4px_16px_rgba(15,42,74,0.22)] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
                  >
                    <span>{data.primary_cta_label}</span>
                    <ArrowRight className="h-4 w-4 text-[#B8934A] transition-transform duration-300 ease-out group-hover:translate-x-1" />
                  </Link>
                </div>
              )}

              {/* Bottom Badge Row */}
              <div className="flex flex-wrap items-center gap-3 pt-1 select-none">
                {/* Badge 1: Curated Insights */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-[#B8934A]/40 bg-white px-4 py-2 text-xs shadow-[0_2px_8px_rgba(15,42,74,0.06)] hover:border-[#B8934A] transition-colors">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0F2A4A] text-[#B8934A] shrink-0">
                    <BookOpen className="h-3.5 w-3.5 text-[#B8934A]" />
                  </div>
                  <div className="flex items-center gap-1.5 font-sans">
                    <span className="text-[#243E5E] font-normal">{badge1Label}</span>
                    <span className="font-serif font-semibold text-[#0F2A4A]">{badge1Val}</span>
                  </div>
                </div>

                {/* Badge 2: 3 Core Pillars */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-[#B8934A]/40 bg-white px-4 py-2 text-xs shadow-[0_2px_8px_rgba(15,42,74,0.06)] hover:border-[#B8934A] transition-colors">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0F2A4A] text-[#B8934A] shrink-0">
                    <Layers className="h-3.5 w-3.5 text-[#B8934A]" />
                  </div>
                  <div className="flex items-center gap-1.5 font-sans">
                    <span className="font-serif font-semibold text-[#0F2A4A]">{badge2Val}</span>
                    <span className="text-[#243E5E] font-normal">{badge2Label}</span>
                  </div>
                </div>

                {/* Badge 3: Regular Edition / Healthcare & Science */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-[#B8934A]/40 bg-white px-4 py-2 text-xs shadow-[0_2px_8px_rgba(15,42,74,0.06)] hover:border-[#B8934A] transition-colors">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0F2A4A] text-[#B8934A] shrink-0">
                    <Sparkles className="h-3.5 w-3.5 text-[#B8934A]" />
                  </div>
                  <div className="flex items-center gap-1.5 font-sans">
                    <span className="font-serif font-semibold text-[#0F2A4A]">{badge3Title}</span>
                    <span className="text-[#243E5E]/70 font-normal">/ {badge3Sub}</span>
                  </div>
                </div>
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
