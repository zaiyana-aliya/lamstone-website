"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import MotionReveal from "@/components/MotionReveal";
import { ArrowRight, ShoppingBag, Sparkles, Droplets, ExternalLink } from "lucide-react";

interface PerfumeHighlight {
  id: string;
  name: string;
  priceInr: string;
  priceAed: string;
  notes: string;
  tagline: string;
}

const PERFUMES_LIST: PerfumeHighlight[] = [
  {
    id: "barqat",
    name: "Lamé Barqat",
    priceInr: "₹3,999",
    priceAed: "175 AED",
    notes: "Rare Amber · Cambodian Oud · Taif Rose",
    tagline: "Imperial Crown Flacon",
  },
  {
    id: "blue-mirage",
    name: "Blue Mirage",
    priceInr: "₹2,999",
    priceAed: "130 AED",
    notes: "Aquatic Amber · French Lavender · Cedarwood",
    tagline: "Aquatic Sensorial Extrait",
  },
  {
    id: "mayscent",
    name: "Mayscent",
    priceInr: "₹499",
    priceAed: "22 AED",
    notes: "White Florals · Crisp Citrus · Sandalwood",
    tagline: "Sun-Drenched Everyday Luxury",
  },
];

export interface PerfumeBannerData {
  eyebrow_label: string;
  heading: string;
  description: string;
  primary_cta_label: string;
  primary_cta_url: string;
  secondary_cta_label: string;
  secondary_cta_url: string;
  is_active: boolean;
}

const DEFAULT_BANNER_DATA: PerfumeBannerData = {
  eyebrow_label: "LAMÉ HAUTE PARFUMERIE · DUBAI",
  heading: "The Art of Enduring Fragrance",
  description:
    "Mastercrafted with rare Cambodian oud, warm amber, and noble botanical essences. Discover our launched signature fragrances designed for an intimate, royal sillage.",
  primary_cta_label: "Explore Perfumes Collection",
  primary_cta_url: "/perfumes",
  secondary_cta_label: "Shop on MyLamstone",
  secondary_cta_url: "https://mylamstone.com/collections/perfumes",
  is_active: true,
};

export default function HomePerfumesBanner() {
  const [data, setData] = useState<PerfumeBannerData>(DEFAULT_BANNER_DATA);
  const [selectedPerfume, setSelectedPerfume] = useState<PerfumeHighlight>(PERFUMES_LIST[0]);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetch("/api/home-promo-sections", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.sections)) {
          const row = json.sections.find((s: any) => s.section_key === "perfume_banner");
          if (row) {
            setData({
              eyebrow_label: row.eyebrow_label || DEFAULT_BANNER_DATA.eyebrow_label,
              heading: row.heading || DEFAULT_BANNER_DATA.heading,
              description: row.description || DEFAULT_BANNER_DATA.description,
              primary_cta_label: row.primary_cta_label || DEFAULT_BANNER_DATA.primary_cta_label,
              primary_cta_url: row.primary_cta_url || DEFAULT_BANNER_DATA.primary_cta_url,
              secondary_cta_label: row.secondary_cta_label || DEFAULT_BANNER_DATA.secondary_cta_label,
              secondary_cta_url: row.secondary_cta_url || DEFAULT_BANNER_DATA.secondary_cta_url,
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({
      x: -y * 10,
      y: x * 12,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  if (!data.is_active) return null;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24 text-[#FAF4EB] select-none border-y border-[#C69A4C]/30"
      style={{
        background: "linear-gradient(135deg, #071224 0%, #0B1A33 40%, #10274D 70%, #071224 100%)",
      }}
    >
      {/* Ambient Jewel Glow Blooms */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[130px] opacity-40 mix-blend-screen"
        style={{ background: "radial-gradient(circle, #1F5296 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-0 lg:right-28 w-[480px] h-[480px] rounded-full blur-[140px] opacity-30 mix-blend-screen"
        style={{ background: "radial-gradient(circle, #C69A4C 0%, transparent 75%)" }}
        aria-hidden="true"
      />

      {/* Subtle fine diagonal gold texture stripe */}
      <div className="pointer-events-none absolute top-0 right-0 w-72 h-44 overflow-hidden select-none z-0 opacity-15">
        <svg viewBox="0 0 200 150" preserveAspectRatio="none" className="w-full h-full" fill="none">
          <polygon points="200,20 200,34 90,150 76,150" fill="#F0C366" />
          <polygon points="200,44 200,56 114,150 102,150" fill="#C69A4C" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Brand & Fragrance Info */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 sm:space-y-7">
            
            {/* Eyebrow with gold jewel badge */}
            <MotionReveal delay={100} direction="up">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#C69A4C]/25 via-[#F0C366]/20 to-[#C69A4C]/25 border border-[#F0C366]/40 text-[#F5DE9B] text-xs font-semibold tracking-wider uppercase shadow-[0_2px_14px_rgba(198,154,76,0.25)]">
                <span className="w-2 h-2 rounded-full bg-[#F0C366] shadow-[0_0_8px_#F0C366] animate-pulse" />
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F0C366]" />
                  {data.eyebrow_label}
                </span>
              </div>
            </MotionReveal>

            {/* Headline */}
            <MotionReveal delay={200} direction="up">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#FAF4EB] leading-[1.15]">
                {data.heading}
              </h2>
            </MotionReveal>

            {/* Description */}
            <MotionReveal delay={300} direction="up">
              <p className="text-base sm:text-lg text-[#D8CDBC] font-light leading-relaxed max-w-xl">
                {data.description}
              </p>
            </MotionReveal>

            {/* Interactive Scent Picker Pills */}
            <MotionReveal delay={400} direction="up">
              <div className="w-full space-y-3">
                <p className="text-xs uppercase tracking-widest text-[#E5BA62] font-semibold">
                  Featured Signature Scents:
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                  {PERFUMES_LIST.map((perfume) => {
                    const isSelected = selectedPerfume.id === perfume.id;
                    return (
                      <button
                        key={perfume.id}
                        type="button"
                        onClick={() => setSelectedPerfume(perfume)}
                        className={`group px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 text-left cursor-pointer border ${
                          isSelected
                            ? "bg-gradient-to-r from-[#2A1C0E] to-[#1F150B] border-[#F0C366] text-[#FAF4EB] shadow-[0_4px_16px_rgba(240,195,102,0.25)] scale-[1.02]"
                            : "bg-white/5 hover:bg-white/10 border-white/10 text-[#C7BEAF] hover:text-[#FAF4EB]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-[#F0C366]" : "bg-white/30"}`} />
                          <span className="font-semibold">{perfume.name}</span>
                          <span className="text-[11px] font-bold text-[#E5BA62] ml-1">
                            {perfume.priceInr} · {perfume.priceAed}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Selected Notes Preview Banner */}
                <div className="rounded-xl bg-[#071224]/70 border border-[#F0C366]/25 p-3.5 text-xs text-[#FAF4EB]/90 flex items-center justify-between flex-wrap gap-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-[#F0C366] shrink-0" />
                    <span>
                      <strong className="text-[#F0C366] font-semibold">{selectedPerfume.name}:</strong>{" "}
                      {selectedPerfume.notes}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#F0C366]/20 text-[#FFE08C] border border-[#F0C366]/30">
                    {selectedPerfume.priceInr} / {selectedPerfume.priceAed}
                  </span>
                </div>
              </div>
            </MotionReveal>

            {/* CTAs: Explore Perfumes + Shop on MyLamstone */}
            <MotionReveal delay={500} direction="up">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 sm:gap-4 pt-2">
                {/* Primary CTA: Explore dedicated /perfumes page */}
                {data.primary_cta_label && data.primary_cta_url && (
                  <Link
                    href={data.primary_cta_url}
                    className="btn-gold-lift inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#D9A74E] via-[#F0C366] to-[#C69A4C] text-[#0A1628] text-xs sm:text-sm font-bold tracking-wide shadow-[0_6px_24px_rgba(240,195,102,0.4)] hover:shadow-[0_10px_32px_rgba(240,195,102,0.6)] cursor-pointer"
                  >
                    <span>{data.primary_cta_label}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                )}

                {/* Secondary CTA: Direct store checkout */}
                {data.secondary_cta_label && data.secondary_cta_url && (
                  <a
                    href={data.secondary_cta_url}
                    target={data.secondary_cta_url.startsWith("http") ? "_blank" : undefined}
                    rel={data.secondary_cta_url.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-[#F0C366]/40 hover:border-[#F0C366] text-xs sm:text-sm font-semibold text-[#FAF4EB] hover:text-[#F0C366] transition-all duration-300 cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#F0C366]" />
                    <span>{data.secondary_cta_label}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
              </div>
            </MotionReveal>
          </div>

          {/* Right Column: Motion Graphic Flacon Showcase Stage */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative w-full pt-4 lg:pt-0">
            
            {/* Ambient Golden Backlight Glow (Clean studio illumination, NO rings/circles) */}
            <div
              className="absolute w-[340px] h-[400px] pointer-events-none blur-[90px] opacity-40 -z-10 transition-transform duration-700 ease-out"
              style={{
                background: "radial-gradient(ellipse at center, #F0C366 0%, #C69A4C 45%, transparent 75%)",
                transform: `translate(${rotate.y * -1.5}px, ${rotate.x * -1.5}px)`,
              }}
              aria-hidden="true"
            />

            {/* Rising Fragrance Micro-Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-5">
              <span className="absolute top-[60%] left-[22%] w-2 h-2 rounded-full bg-[#F0C366] blur-[0.5px] animate-particle-1" />
              <span className="absolute top-[68%] right-[20%] w-2.5 h-2.5 rounded-full bg-[#FFE29A] blur-[0.8px] animate-particle-2" />
              <span className="absolute top-[52%] left-[18%] w-1.5 h-1.5 rounded-full bg-[#E5BA62] animate-particle-3" />
              <span className="absolute top-[62%] right-[24%] w-2 h-2 rounded-full bg-[#F0C366] blur-[0.5px] animate-particle-4" />
            </div>

            {/* 3D Flacon & Dais Presentation */}
            <div
              className="relative flex flex-col items-center w-full max-w-[320px] sm:max-w-[360px] transition-transform duration-300 ease-out cursor-grab active:cursor-grabbing"
              style={{
                transform: `perspective(1200px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Floating Flacon Levitation Wrapper */}
              <div className="relative z-10 w-full flex flex-col items-center animate-flacon-float">
                <div className="relative w-[170px] sm:w-[200px] md:w-[220px] aspect-[528/1321] mx-auto filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden">
                  <Image
                    src="/images/perfumes/bottle-trimmed.png"
                    alt="Lamé Barqat Eau De Parfum 100ml Flacon"
                    width={528}
                    height={1321}
                    priority
                    className="w-full h-auto object-contain select-none"
                  />

                  {/* Caustic Glint Sweep */}
                  <div
                    className="absolute inset-0 pointer-events-none animate-flacon-glint"
                    style={{
                      background:
                        "linear-gradient(110deg, transparent 30%, rgba(255, 248, 220, 0.4) 46%, rgba(255, 255, 255, 0.85) 50%, rgba(255, 248, 220, 0.4) 54%, transparent 70%)",
                      width: "220%",
                      height: "100%",
                    }}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Mirror Reflection of Flacon Base onto Dais */}
              <div
                className="relative w-[170px] sm:w-[200px] md:w-[220px] h-10 overflow-hidden pointer-events-none -mt-1 opacity-25 blur-[1px] select-none z-10"
                style={{
                  maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 80%)",
                  WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 80%)",
                }}
                aria-hidden="true"
              >
                <div className="transform scale-y-[-1] -translate-y-[calc(100%-40px)]">
                  <Image
                    src="/images/perfumes/bottle-trimmed.png"
                    alt=""
                    width={528}
                    height={1321}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>

              {/* Contact Shadow */}
              <div
                className="w-[160px] sm:w-[190px] h-3 rounded-[100%] bg-black/95 blur-[2.5px] -mt-10 z-20 mx-auto"
                aria-hidden="true"
              />

              {/* Polished Obsidian & Gold Presentation Dais */}
              <div className="relative w-full flex flex-col items-center -mt-1 z-10 select-none">
                {/* Upper Tier */}
                <div
                  className="relative w-[250px] sm:w-[290px] h-7 rounded-[100%] bg-gradient-to-r from-[#2B1B0A] via-[#483114] to-[#2B1B0A] border-t-2 border-[#F0C366] shadow-[0_0_22px_rgba(240,195,102,0.45),0_8px_20px_rgba(0,0,0,0.8)] overflow-hidden"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/60 rounded-[100%]" />
                  <div className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFF0C2] to-transparent shadow-[0_0_8px_#F0C366]" />
                </div>

                {/* Lower Tier */}
                <div
                  className="relative w-[290px] sm:w-[330px] h-5 rounded-[100%] bg-gradient-to-b from-[#1C1206] to-[#0A0704] border-t border-[#C69A4C]/40 shadow-[0_20px_45px_rgba(0,0,0,0.95)] -mt-3 z-0"
                  aria-hidden="true"
                >
                  <div className="absolute inset-x-10 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#C69A4C]/60 to-transparent" />
                </div>

                {/* Ambient Golden Floor Pool */}
                <div
                  className="w-[250px] sm:w-[300px] h-5 rounded-[100%] bg-[#F0C366]/20 blur-[14px] -mt-2 -z-10"
                  aria-hidden="true"
                />
              </div>

              {/* Floating Price Callout Badge */}
              <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#071224]/85 border border-[#F0C366]/40 backdrop-blur-md text-xs font-semibold text-[#FAF4EB] shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0C366] animate-ping" />
                <span className="text-[#E5BA62] font-bold">100ml Eau De Parfum</span>
                <span className="text-white/40">·</span>
                <span className="text-[#FAF4EB]">From ₹499 (22 AED)</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
