"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MotionReveal from "@/components/MotionReveal";
import { ArrowRight, Sparkles } from "lucide-react";

export interface LameBannerData {
  eyebrow_label: string;
  heading: string;
  description: string;
  image_url: string;
  primary_cta_label: string;
  primary_cta_url: string;
  secondary_cta_label?: string | null;
  secondary_cta_url?: string | null;
  is_active: boolean;
}

const DEFAULT_LAME_DATA: LameBannerData = {
  eyebrow_label: "Signature Lamé",
  heading: "Bridging Clinical Science & Luxury Beauty",
  description:
    "Developed with pharmaceutical precision, Lamé delivers clinically proven skincare and luxury fragrances that elevate your daily wellness routine.",
  image_url: "/images/lame/lame-hero-bg.jpg",
  primary_cta_label: "Explore Lamé Brand",
  primary_cta_url: "/lame",
  secondary_cta_label: "Shop Online",
  secondary_cta_url: "https://mylamstone.com/",
  is_active: true,
};

export default function HomeLameBanner() {
  const [data, setData] = useState<LameBannerData>(DEFAULT_LAME_DATA);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch("/api/home-promo-sections", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.sections)) {
          const row = json.sections.find((s: any) => s.section_key === "lame_banner");
          if (row) {
            setData({
              eyebrow_label: row.eyebrow_label || DEFAULT_LAME_DATA.eyebrow_label,
              heading: row.heading || DEFAULT_LAME_DATA.heading,
              description: row.description || DEFAULT_LAME_DATA.description,
              image_url: row.image_url || DEFAULT_LAME_DATA.image_url,
              primary_cta_label: row.primary_cta_label || DEFAULT_LAME_DATA.primary_cta_label,
              primary_cta_url: row.primary_cta_url || DEFAULT_LAME_DATA.primary_cta_url,
              secondary_cta_label: row.secondary_cta_label,
              secondary_cta_url: row.secondary_cta_url,
              is_active: row.is_active ?? true,
            });
          }
        }
      } catch {
        // keep default
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!data.is_active) return null;

  return (
    <section
      className="relative overflow-hidden border-y border-[#88BDD6]/70 py-16 sm:py-20 lg:py-24 min-h-[500px] sm:min-h-[540px] lg:min-h-[580px] flex items-center"
      style={{
        background: "linear-gradient(135deg, #B2D8F2 0%, #C9E5F9 35%, #88C4DE 75%, #6BAECF 100%)",
      }}
    >
      {/* Soft warm luminous glow in top-right corner behind the woman's shoulder */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-[#FFF4D1]/45 via-[#E8D499]/25 to-transparent blur-3xl z-10 select-none mix-blend-screen"
        aria-hidden="true"
      />
      {/* Delicate floating gold sparkle accents in top-right */}
      <div
        className="pointer-events-none absolute top-8 right-16 sm:top-12 sm:right-28 z-10 select-none opacity-35"
        aria-hidden="true"
      >
        <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-[#FFE8A3] animate-pulse" />
      </div>

      {/* Full-bleed Lamé product photo background layer with soft gradient mask dissolving on left */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-full sm:w-[75%] lg:w-[65%] xl:w-[62%] z-0 select-none overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.03) 6%, rgba(0,0,0,0.2) 15%, rgba(0,0,0,0.65) 28%, black 42%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.03) 6%, rgba(0,0,0,0.2) 15%, rgba(0,0,0,0.65) 28%, black 42%, black 100%)",
        }}
      >
        <Image
          src={data.image_url || "/images/lame/lame-hero-bg.jpg"}
          alt="Lamé clinical skincare and luxury beauty collection"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 65vw"
          className="object-cover object-[center_right] lg:object-center"
        />

        {/* Mobile-only soft backdrop readability wash */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#B2D8F2]/95 via-[#B2D8F2]/65 to-transparent sm:hidden pointer-events-none"
        />
      </div>

      <div className="mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="max-w-xl lg:max-w-xl xl:max-w-2xl space-y-7 sm:space-y-8">
          {/* Eyebrow badge with richer red-gold line, sparkle, and bold text */}
          <MotionReveal delay={100} direction="right">
            <div className="flex items-center gap-3">
              <span className="h-[3.5px] w-10 bg-gradient-to-r from-[#9E1B2A] to-[#D4AF37] rounded-full" />
              <div className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#B88728]" />
                <span className="text-xs uppercase tracking-[0.3em] font-extrabold text-[#8C1625] font-sans drop-shadow-xs">
                  {data.eyebrow_label}
                </span>
              </div>
            </div>
          </MotionReveal>

          {/* Heading */}
          <MotionReveal delay={250} direction="right">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#071224] tracking-tight leading-[1.15]">
              {data.heading}
            </h2>
          </MotionReveal>

          <MotionReveal delay={380} direction="right">
            <p className="text-base sm:text-lg text-[#1B365D] leading-relaxed font-light max-w-xl">
              {data.description}
            </p>
          </MotionReveal>

          <MotionReveal delay={480} direction="right">
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Primary CTA: Rich Navy Gradient with Gold Highlight and sliding arrow */}
              {data.primary_cta_label && data.primary_cta_url && (
                <Link
                  href={data.primary_cta_url}
                  className="group/explore inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#071224] via-[#0E2A4A] to-[#12415C] text-white border border-[#C6A15B]/40 px-7 py-3.5 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shadow-[0_6px_22px_rgba(7,18,36,0.35),0_2px_8px_rgba(198,161,91,0.2)] hover:shadow-[0_10px_30px_rgba(7,18,36,0.48),0_4px_14px_rgba(198,161,91,0.35)] hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0"
                >
                  <span>{data.primary_cta_label}</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5] text-[#F0D58C] transition-transform duration-300 group-hover/explore:translate-x-1.5" />
                </Link>
              )}

              {/* Secondary CTA: Gold outline with filled gold hover state */}
              {data.secondary_cta_label && data.secondary_cta_url && (
                <a
                  href={data.secondary_cta_url}
                  target={data.secondary_cta_url.startsWith("http") ? "_blank" : undefined}
                  rel={data.secondary_cta_url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group/shop inline-flex items-center gap-2 rounded-full border-2 border-[#B38728] text-[#543E08] bg-[#F7E7BE]/50 hover:bg-gradient-to-r hover:from-[#E5C378] hover:to-[#C6A15B] hover:text-[#071224] hover:border-[#D4AF37] px-6 py-3 text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 shadow-[0_2px_10px_rgba(198,161,91,0.2)] hover:shadow-[0_6px_20px_rgba(198,161,91,0.4)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>{data.secondary_cta_label}</span>
                  <ArrowRight className="h-3.5 w-3.5 stroke-[2.5] transition-transform duration-300 group-hover/shop:translate-x-1" />
                </a>
              )}
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
