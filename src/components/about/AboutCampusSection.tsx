"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import MotionReveal from "@/components/MotionReveal";
import { MapPin, ArrowRight } from "lucide-react";

export interface AboutCampusData {
  eyebrow_label: string;
  heading: string;
  description: string;
  image_url?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  extra_data?: {
    badge_subtitle?: string;
    image_caption?: string;
  };
  is_active?: boolean;
}

const DEFAULT_CAMPUS_IMAGE = "/images/about/corporate-head-office.jpg";

const DEFAULT_CAMPUS_DATA: AboutCampusData = {
  eyebrow_label: "Our Campus",
  heading: "A Modern Infrastructure",
  description:
    "Our state-of-the-art facilities are designed to support innovation, research and world-class manufacturing. With cutting-edge technology and strict quality standards, we ensure that every product meets the highest level of excellence.",
  image_url: DEFAULT_CAMPUS_IMAGE,
  cta_label: "Our Manufacturing Units",
  cta_url: "/pharmacy-chain",
  extra_data: {
    badge_subtitle: "Pharma | Cosmetics | Personal Care",
    image_caption: "Corporate Head Office — Bio 360, Kerala Life Sciences Industrial Park",
  },
  is_active: true,
};

const PHOTO_FILTER_STYLE: React.CSSProperties = {
  filter: "saturate(0.96) contrast(1.04) sepia(0.03) brightness(1.01)",
};

const CAMPUS_DESKTOP_MASK_STYLE: React.CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(to left, #000 0%, #000 36%, transparent 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 10%, #000 94%, transparent 100%)",
  WebkitMaskComposite: "source-in",
  maskImage:
    "linear-gradient(to left, #000 0%, #000 36%, transparent 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 10%, #000 94%, transparent 100%)",
  maskComposite: "intersect",
};

const CAMPUS_MOBILE_MASK_STYLE: React.CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%)",
  maskImage:
    "linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%)",
};

function renderCampusHeading(heading: string) {
  if (!heading) return null;
  const parts = heading.split(/(Modern)/i);
  if (parts.length > 1) {
    return parts.map((part, idx) =>
      part.toLowerCase() === "modern" ? (
        <span
          key={idx}
          className="text-[#B8934A] inline-block"
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

export default function AboutCampusSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [data, setData] = useState<AboutCampusData>(DEFAULT_CAMPUS_DATA);
  const [imgSrc, setImgSrc] = useState<string>(DEFAULT_CAMPUS_IMAGE);
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
          const row = json.sections.find((s: any) => s.section_key === "campus");
          if (row) {
            const validImageUrl =
              row.image_url && typeof row.image_url === "string" && row.image_url.trim()
                ? row.image_url.trim()
                : DEFAULT_CAMPUS_IMAGE;

            setData({
              eyebrow_label: row.eyebrow_label || DEFAULT_CAMPUS_DATA.eyebrow_label,
              heading: row.heading || DEFAULT_CAMPUS_DATA.heading,
              description: row.description || DEFAULT_CAMPUS_DATA.description,
              image_url: validImageUrl,
              cta_label: row.cta_label || DEFAULT_CAMPUS_DATA.cta_label,
              cta_url: row.cta_url || DEFAULT_CAMPUS_DATA.cta_url,
              extra_data: {
                ...DEFAULT_CAMPUS_DATA.extra_data,
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

  const badgeSubtitle =
    data.extra_data?.badge_subtitle || DEFAULT_CAMPUS_DATA.extra_data?.badge_subtitle;
  const chips = (badgeSubtitle || "Pharma | Cosmetics | Personal Care")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  const imageCaption =
    data.extra_data?.image_caption || DEFAULT_CAMPUS_DATA.extra_data?.image_caption;

  return (
    <section
      ref={sectionRef}
      id="campus"
      className="relative overflow-hidden py-28 sm:py-32 lg:py-36 xl:py-40 min-h-[620px] lg:min-h-[680px] flex items-center"
      style={{
        background:
          "var(--about-campus-gradient, linear-gradient(to bottom, #FFFDF9 0%, #F6F1E8 30%, #E9EDF0 65%, #D6E2EE 100%))",
      }}
    >
      {/* Desktop Full-Bleed Campus Building Photo on Right Screen Edge (58vw) */}
      <div
        className="campus-desktop-blend hidden lg:block absolute inset-y-0 right-0 w-[58vw] select-none pointer-events-none z-0 overflow-hidden"
        style={CAMPUS_DESKTOP_MASK_STYLE}
      >
        <div
          className={`relative h-full w-full transition-transform duration-[1200ms] ease-out motion-reduce:transition-none motion-reduce:transform-none ${
            isSectionInView ? "scale-100" : "scale-[1.04]"
          }`}
        >
          <Image
            src={imgSrc || DEFAULT_CAMPUS_IMAGE}
            alt="Lamstone Corporate Head Office — Bio 360, Kerala Life Sciences Industrial Park"
            fill
            priority
            unoptimized
            sizes="58vw"
            className="object-cover object-center bg-transparent"
            style={PHOTO_FILTER_STYLE}
            onError={() => {
              if (imgSrc !== DEFAULT_CAMPUS_IMAGE) {
                setImgSrc(DEFAULT_CAMPUS_IMAGE);
              }
            }}
          />
        </div>
      </div>

      {/* Caption Pill in Bottom-Right of Campus Photo Area (Desktop) */}
      {imageCaption && (
        <div className="hidden lg:block absolute bottom-8 right-8 xl:bottom-12 xl:right-16 z-10 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF9]/92 backdrop-blur-xs border border-[#B8934A]/40 text-xs font-sans font-medium select-none text-[#0F2A4A] shadow-[0_4px_16px_rgba(15,42,74,0.10)]">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#B8934A] text-white shrink-0">
              <MapPin className="h-2.5 w-2.5 text-white" />
            </div>
            <span className="tracking-tight text-[#0F2A4A] font-sans">
              {imageCaption}
            </span>
          </div>
        </div>
      )}

      {/* Fine line branch watermark: stroke only 1.2px, no filled blobs, in navy rgba(23,58,107,.10), ~90px tall, 48px from left & bottom */}
      <div className="absolute left-[48px] bottom-[48px] pointer-events-none select-none z-0 hidden md:block">
        <svg
          width="54"
          height="90"
          viewBox="0 0 54 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="pointer-events-none select-none"
          aria-hidden="true"
        >
          <path
            d="M26 88 C25 64 22 36 30 4"
            stroke="rgba(23, 58, 107, 0.10)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M25 72 C14 69 9 58 13 46 C21 47 25 58 25 72 Z"
            stroke="rgba(23, 58, 107, 0.10)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M25 64 C36 61 41 50 37 38 C29 39 25 50 25 64 Z"
            stroke="rgba(23, 58, 107, 0.10)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M24 46 C15 43 11 34 14 24 C21 25 24 35 24 46 Z"
            stroke="rgba(23, 58, 107, 0.10)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M26 38 C35 35 39 26 36 16 C29 17 26 27 26 38 Z"
            stroke="rgba(23, 58, 107, 0.10)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M29 18 C25 11 28 5 30 4 C32 6 34 11 29 18 Z"
            stroke="rgba(23, 58, 107, 0.10)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl w-full px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Mobile Campus Photo (above text, full-width with bottom edge fade) */}
          <div className="block lg:hidden w-full">
            <div
              className="relative w-full h-[300px] sm:h-[380px] overflow-hidden select-none bg-transparent"
              style={CAMPUS_MOBILE_MASK_STYLE}
            >
              <div
                className={`relative h-full w-full transition-transform duration-[1200ms] ease-out motion-reduce:transition-none motion-reduce:transform-none ${
                  isSectionInView ? "scale-100" : "scale-[1.04]"
                }`}
              >
                <Image
                  src={imgSrc || DEFAULT_CAMPUS_IMAGE}
                  alt="Lamstone Corporate Head Office — Bio 360, Kerala Life Sciences Industrial Park"
                  fill
                  priority
                  unoptimized
                  sizes="100vw"
                  className="object-cover object-center bg-transparent"
                  style={PHOTO_FILTER_STYLE}
                  onError={() => {
                    if (imgSrc !== DEFAULT_CAMPUS_IMAGE) {
                      setImgSrc(DEFAULT_CAMPUS_IMAGE);
                    }
                  }}
                />
              </div>
            </div>

            {/* Mobile Caption Pill */}
            {imageCaption && (
              <div className="pt-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF9]/92 border border-[#B8934A]/40 text-xs font-sans font-medium text-[#0F2A4A] shadow-xs">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#B8934A] text-white shrink-0">
                    <MapPin className="h-2.5 w-2.5 text-white" />
                  </div>
                  <span className="tracking-tight text-[#0F2A4A] font-sans">
                    {imageCaption}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Left Column: Campus Narrative Editorial Copy in Dark Navy (on clean sand) */}
          <div className="lg:col-span-6 relative z-10">
            {/* Top Eyebrow Label with Gold Thin Lines (Delay 0ms) */}
            <MotionReveal delay={0} direction="up">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="h-[1px] w-6 sm:w-10 bg-[#B8934A]/50" />
                <span className="text-[12px] sm:text-[13px] uppercase tracking-[0.28em] font-sans font-semibold text-[#B8934A]">
                  {(data.eyebrow_label || "Our Campus").replace(/[✨\u2728]/g, "").trim()}
                </span>
                <span className="h-[1px] w-6 sm:w-10 bg-[#B8934A]/50" />
              </div>
            </MotionReveal>

            {/* Heading: ~1.12x size with "Modern" in gold italic (Delay 90ms) */}
            <MotionReveal delay={90} direction="up" className="mt-4 sm:mt-5">
              <h2 className="font-serif text-[34px] sm:text-[40px] lg:text-[54px] xl:text-[58px] leading-[1.12] font-bold text-[#0F2A4A] tracking-[-0.01em]">
                {renderCampusHeading(data.heading)}
              </h2>
            </MotionReveal>

            {/* Thin gold hairline (72px) with small gold dot (Delay 90ms) */}
            <MotionReveal delay={90} direction="up" className="mt-5">
              <div className="flex items-center gap-1.5">
                <span className="w-[72px] h-[1px] bg-[#B8934A]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8934A]" />
              </div>
            </MotionReveal>

            {/* Description: navy-grey, line-height 1.75, max-w-[440px] (Delay 180ms) */}
            <MotionReveal delay={180} direction="up" className="mt-6">
              <p className="max-w-[440px] font-sans text-sm sm:text-[15px] text-[#0F2A4A]/80 leading-[1.75] font-normal">
                {data.description}
              </p>
            </MotionReveal>

            {/* Manufacturing Units Card: two rows, frosted glass, 24px 28px padding, 20px row gap (Delay 270ms) */}
            {data.cta_label && data.cta_url && (
              <MotionReveal delay={270} direction="up" className="pt-7 sm:pt-8">
                <Link
                  href={data.cta_url}
                  className="group relative overflow-hidden flex flex-col gap-5 rounded-2xl sm:rounded-[24px] bg-white/85 backdrop-blur-md border border-[#B8934A]/35 px-6 py-5 sm:px-7 sm:py-6 shadow-[0_14px_32px_rgba(15,42,74,0.12)] hover:-translate-y-[3px] transition-all duration-300 w-full max-w-[490px]"
                >
                  {/* Top Row: Navy Pin Circle (44px), Label beside it, and Navy Arrow Button (40px) on far right */}
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                      <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#0F2A4A] shadow-xs group-hover:scale-105 transition-transform duration-300">
                        <MapPin className="h-5 w-5 text-[#D9B96C] stroke-[2]" />
                      </div>
                      <span className="text-[11px] sm:text-xs uppercase tracking-[0.22em] font-sans font-semibold text-[#B8934A] truncate">
                        {data.cta_label}
                      </span>
                    </div>

                    <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#0F2A4A] text-white shadow-xs transition-all duration-300 group-hover:bg-[#173A6B]">
                      <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Bottom Row: Chips spanning the full width with 10px gap, 8px 16px padding */}
                  {chips.length > 0 && (
                    <div className="w-full flex flex-wrap sm:flex-nowrap items-center gap-[10px]">
                      {chips.map((chip, idx) => (
                        <span
                          key={idx}
                          className="inline-flex flex-1 min-w-fit items-center justify-center gap-1.5 px-4 py-2 rounded-full border border-[#B8934A]/40 bg-transparent font-serif text-[0.88rem] sm:text-[0.9rem] font-semibold text-[#0F2A4A] shadow-[0_1px_2px_rgba(15,42,74,0.03)] whitespace-nowrap"
                        >
                          <span className="w-[5px] h-[5px] rounded-full bg-[#B8934A] shrink-0" />
                          <span>{chip}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </MotionReveal>
            )}
          </div>

          {/* Desktop Right Spacer Column: reserves space for the full-bleed photo on the right */}
          <div className="hidden lg:block lg:col-span-6 min-h-[460px] lg:min-h-[520px] pointer-events-none" aria-hidden="true" />
        </div>
      </div>

      {/* 1px gold hairline (rgba(184,147,74,.6)) along the very bottom meeting the navy Roadmap */}
      <div
        className="absolute bottom-0 inset-x-0 h-[1px] bg-[rgba(184,147,74,0.6)] z-20 pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}
