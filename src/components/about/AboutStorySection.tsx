"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MotionReveal from "@/components/MotionReveal";
import { ArrowRight } from "lucide-react";
import BotanicalLeafWatermark from "@/components/about/BotanicalLeafWatermark";

export interface AboutStoryData {
  eyebrow_label: string;
  heading: string;
  description: string;
  image_url?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  extra_data?: {
    lead_subheading?: string;
    secondary_body?: string;
  };
  is_active?: boolean;
}

const DEFAULT_STORY_DATA: AboutStoryData = {
  eyebrow_label: "Our Story",
  heading: "From a Vision\nto a Healthier Future",
  description:
    "What started as a single vision — to make quality healthcare and beauty accessible to all — has now grown into a diversified group, trusted by millions.\n\nOver the years, Lamstone has expanded its footprint across healthcare, skincare, personal care and investments, driven by a commitment to trust, quality and long-term value.",
  image_url: "/images/about/lamstone-about-story.jpg",
  cta_label: "Learn More About Us",
  cta_url: "/contact",
  extra_data: {
    lead_subheading:
      "What started as a single vision — to make quality healthcare and beauty accessible to all — has now grown into a diversified group, trusted by millions.",
    secondary_body:
      "Over the years, Lamstone has expanded its footprint across healthcare, skincare, personal care and investments, driven by a commitment to trust, quality and long-term value.",
  },
  is_active: true,
};

const STORY_DEFAULT_IMG = "/images/about/lamstone-about-story.jpg";

const STORY_DESKTOP_MASK_STYLE: React.CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(to right, #000 0%, #000 36%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
  WebkitMaskComposite: "source-in" as any,
  maskImage:
    "linear-gradient(to right, #000 0%, #000 36%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
  maskComposite: "intersect" as any,
};

const STORY_MOBILE_MASK_STYLE: React.CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%), linear-gradient(to bottom, #000 0%, #000 70%, transparent 100%)",
  WebkitMaskComposite: "source-in" as any,
  maskImage:
    "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%), linear-gradient(to bottom, #000 0%, #000 70%, transparent 100%)",
  maskComposite: "intersect" as any,
};

const PHOTO_FILTER_STYLE: React.CSSProperties = {
  filter: "saturate(0.94) contrast(1.04) sepia(0.06) brightness(1.01)",
  objectPosition: "15% center",
};

export default function AboutStorySection() {
  const [data, setData] = useState<AboutStoryData>(DEFAULT_STORY_DATA);
  const [imgSrc, setImgSrc] = useState<string>(
    data.image_url && data.image_url.trim() ? data.image_url : STORY_DEFAULT_IMG
  );

  const sectionRef = useRef<HTMLElement>(null);
  const [isSectionInView, setIsSectionInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < windowHeight && rect.bottom > 0) {
      setIsSectionInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSectionInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch("/api/about-page", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.sections)) {
          const row = json.sections.find((s: any) => s.section_key === "story");
          if (row) {
            const validImageUrl =
              row.image_url && typeof row.image_url === "string" && row.image_url.trim()
                ? row.image_url.trim()
                : STORY_DEFAULT_IMG;

            setData({
              eyebrow_label: row.eyebrow_label || DEFAULT_STORY_DATA.eyebrow_label,
              heading: row.heading || DEFAULT_STORY_DATA.heading,
              description: row.description || DEFAULT_STORY_DATA.description,
              image_url: validImageUrl,
              cta_label: row.cta_label || DEFAULT_STORY_DATA.cta_label,
              cta_url: row.cta_url || DEFAULT_STORY_DATA.cta_url,
              extra_data: {
                ...DEFAULT_STORY_DATA.extra_data,
                ...(row.extra_data || {}),
              },
              is_active: row.is_active ?? true,
            });
            setImgSrc(validImageUrl);
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

  const leadSubheading =
    data.extra_data?.lead_subheading ||
    data.description.split("\n\n")[0] ||
    DEFAULT_STORY_DATA.extra_data?.lead_subheading;

  const secondaryBody =
    data.extra_data?.secondary_body ||
    (data.description.includes("\n\n") ? data.description.split("\n\n")[1] : "") ||
    DEFAULT_STORY_DATA.extra_data?.secondary_body;

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative overflow-hidden py-28 sm:py-32 lg:py-36 xl:py-40 min-h-[620px] lg:min-h-[680px] bg-[#FBF7F0] bg-[var(--about-tint-cream,#FBF7F0)] border-t border-[#0F2A4A]/10 flex items-center"
    >
      {/* Desktop Full-Bleed Consultation Photo on Left Screen Edge (55vw) */}
      <div
        className="story-desktop-blend hidden lg:block absolute inset-y-0 left-0 w-[55vw] select-none pointer-events-none z-0 overflow-hidden"
        style={STORY_DESKTOP_MASK_STYLE}
      >
        <div
          className={`relative h-full w-full transition-transform duration-[1200ms] ease-out motion-reduce:transition-none motion-reduce:transform-none ${
            isSectionInView ? "scale-100" : "scale-[1.04]"
          }`}
        >
          <Image
            src={imgSrc || STORY_DEFAULT_IMG}
            alt="Lamstone Healthcare Consultation and Pharmacy Customer Care"
            fill
            priority
            unoptimized
            sizes="55vw"
            className="object-cover bg-transparent"
            style={PHOTO_FILTER_STYLE}
            onError={() => {
              if (imgSrc !== STORY_DEFAULT_IMG) {
                setImgSrc(STORY_DEFAULT_IMG);
              }
            }}
          />
        </div>
        {/* Faint inner vignette on left and bottom edges only (navy #0F2A4A at ~8% opacity) */}
        <div
          className="absolute inset-0 pointer-events-none z-[1] bg-[linear-gradient(to_right,rgba(15,42,74,0.08)_0%,transparent_16%),linear-gradient(to_top,rgba(15,42,74,0.08)_0%,transparent_20%)]"
          aria-hidden="true"
        />
      </div>

      {/* Faint Botanical Leaf Watermark at the right edge (10% opacity, enlarged) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 pointer-events-none z-[1] hidden md:block">
        <BotanicalLeafWatermark opacity={0.10} width={300} height={440} color="#B8934A" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl w-full px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Mobile Consultation Photo (above text, full-width with side and bottom fade) */}
          <div className="block lg:hidden w-full">
            <div
              className="story-mobile-blend relative w-full h-[320px] sm:h-[400px] overflow-hidden select-none bg-transparent"
              style={STORY_MOBILE_MASK_STYLE}
            >
              <div
                className={`relative h-full w-full transition-transform duration-[1200ms] ease-out motion-reduce:transition-none motion-reduce:transform-none ${
                  isSectionInView ? "scale-100" : "scale-[1.04]"
                }`}
              >
                <Image
                  src={imgSrc || STORY_DEFAULT_IMG}
                  alt="Lamstone Healthcare Consultation and Pharmacy Customer Care"
                  fill
                  priority
                  unoptimized
                  sizes="100vw"
                  className="object-cover bg-transparent"
                  style={PHOTO_FILTER_STYLE}
                  onError={() => {
                    if (imgSrc !== STORY_DEFAULT_IMG) {
                      setImgSrc(STORY_DEFAULT_IMG);
                    }
                  }}
                />
              </div>
              {/* Mobile faint bottom vignette */}
              <div
                className="absolute inset-0 pointer-events-none z-[1] bg-[linear-gradient(to_top,rgba(15,42,74,0.08)_0%,transparent_18%)]"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Desktop Left Spacer Column reserving space for the full-bleed photo */}
          <div className="hidden lg:block lg:col-span-6 min-h-[460px] lg:min-h-[520px] pointer-events-none" aria-hidden="true" />

          {/* Right Column: Narrative Editorial Copy in Dark Navy */}
          <div className="lg:col-span-6 relative z-10">
            {/* Top Eyebrow Label with Gold Thin Lines (Delay 0ms) */}
            <MotionReveal delay={0} direction="up">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="h-[1px] w-6 sm:w-10 bg-[#B8934A]/50" />
                <span className="text-[12px] sm:text-[13px] uppercase tracking-[0.28em] font-sans font-semibold text-[#B8934A]">
                  {(data.eyebrow_label || "Our Story").replace(/[✨\u2728]/g, "").trim()}
                </span>
                <span className="h-[1px] w-6 sm:w-10 bg-[#B8934A]/50" />
              </div>
            </MotionReveal>

            {/* Heading in Dark Navy Serif with "Since 2019" Detail (Delay 90ms) */}
            <MotionReveal delay={90} direction="up" className="mt-4 sm:mt-5">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[48px] xl:text-[52px] leading-[1.12] font-bold text-[#0F2A4A] tracking-[-0.01em] whitespace-pre-line">
                {data.heading}
                <span className="inline-flex items-center text-[11px] sm:text-xs font-sans font-medium tracking-[0.22em] uppercase text-[#B8934A] ml-4 sm:ml-4.5 px-3 py-0.5 rounded-full border border-[#B8934A]/40 bg-[#FBF7F0]/80 align-middle">
                  Since 2019
                </span>
              </h2>
            </MotionReveal>

            {/* Thin gold hairline (72px) with tiny gold dot (Delay 180ms) - ~20px gap below heading/badge */}
            <MotionReveal delay={180} direction="up" className="mt-5">
              <div className="flex items-center gap-1.5">
                <span className="w-[72px] h-[1px] bg-[#B8934A]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8934A]" />
              </div>
            </MotionReveal>

            {/* Paragraphs in Deep Navy at 1.75 Line-Height (Delay 270ms) - ~24px gap below hairline */}
            <MotionReveal delay={270} direction="up" className="mt-6">
              <div className="space-y-4 max-w-[520px]">
                {leadSubheading && (
                  <p className="font-sans text-base sm:text-[17px] text-[#0F2A4A] font-medium leading-[1.75]">
                    {leadSubheading}
                  </p>
                )}
                {secondaryBody && (
                  <p className="font-sans text-sm sm:text-[15px] text-[#0F2A4A]/75 font-normal leading-[1.75]">
                    {secondaryBody}
                  </p>
                )}
              </div>
            </MotionReveal>

            {/* CTA Button: Refined Navy Pill with gold circular icon badge and soft shadow (Delay 360ms) - generous space kept above button */}
            {data.cta_label && data.cta_url && (
              <MotionReveal delay={360} direction="up" className="pt-7 sm:pt-8">
                <Link
                  href={data.cta_url}
                  className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-[#0F2A4A] hover:bg-[#16365c] text-white pl-7 sm:pl-8 pr-2.5 sm:pr-3 py-2.5 sm:py-3 text-xs sm:text-[13px] font-sans font-semibold uppercase tracking-[0.18em] shadow-[0_8px_20px_rgba(15,42,74,0.18)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
                >
                  <span>{data.cta_label}</span>
                  <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#B8934A] text-white transition-transform duration-300 ease-out group-hover:translate-x-1">
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.2]" />
                  </span>
                </Link>
              </MotionReveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
