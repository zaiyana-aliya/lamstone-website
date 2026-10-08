"use client";

import React, { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import MotionReveal from "./MotionReveal";
import { ArrowRight, Sparkles } from "lucide-react";

const subscribePointerMedia = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(pointer: fine)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
};

const getPointerSnapshot = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
};

const getServerSnapshot = () => false;

interface InvestBannerData {
  eyebrow_label: string;
  heading: string;
  description: string;
  image_url: string;
  primary_cta_label: string;
  primary_cta_url: string;
  secondary_cta_label?: string | null;
  is_active: boolean;
}

const DEFAULT_INVEST_DATA: InvestBannerData = {
  eyebrow_label: "Strategic Investment",
  heading: "Invest in Growth with Lamstone",
  description:
    "Join our rapidly expanding pharmacy chain and beauty ecosystem. We offer transparent, secure, and lucrative partnership models for forward-thinking investors.",
  image_url: "/images/invest/invest-corporate-skyline-clean.jpg",
  primary_cta_label: "Talk to Us",
  primary_cta_url: "/contact",
  secondary_cta_label: "500+ Target Pharmacies · 14 Districts · 9+ Brand Partners",
  is_active: true,
};

export default function InvestCTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [data, setData] = React.useState<InvestBannerData>(DEFAULT_INVEST_DATA);

  React.useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetch("/api/home-promo-sections", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.sections)) {
          const row = json.sections.find((s: any) => s.section_key === "invest_banner");
          if (row) {
            setData({
              eyebrow_label: row.eyebrow_label || DEFAULT_INVEST_DATA.eyebrow_label,
              heading: row.heading || DEFAULT_INVEST_DATA.heading,
              description: row.description || DEFAULT_INVEST_DATA.description,
              image_url: row.image_url || DEFAULT_INVEST_DATA.image_url,
              primary_cta_label: row.primary_cta_label || DEFAULT_INVEST_DATA.primary_cta_label,
              primary_cta_url: row.primary_cta_url || DEFAULT_INVEST_DATA.primary_cta_url,
              secondary_cta_label: row.secondary_cta_label || DEFAULT_INVEST_DATA.secondary_cta_label,
              is_active: row.is_active ?? true,
            });
          }
        }
      } catch {
        // keep fallback
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const hasPointer = useSyncExternalStore(
    subscribePointerMedia,
    getPointerSnapshot,
    getServerSnapshot
  );

  // Smooth lerp / damped coords for desktop mouse parallax
  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const currentOffsetRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  const shape1Ref = useRef<HTMLDivElement>(null);
  const shape2Ref = useRef<HTMLDivElement>(null);
  const shape3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasPointer) return;

    const section = sectionRef.current;
    if (!section) return;

    // Animation loop using lerp for smooth damped motion
    const animate = () => {
      // Lerp factor (0.08 provides graceful, damped easing)
      currentOffsetRef.current.x +=
        (targetOffsetRef.current.x - currentOffsetRef.current.x) * 0.08;
      currentOffsetRef.current.y +=
        (targetOffsetRef.current.y - currentOffsetRef.current.y) * 0.08;

      const { x, y } = currentOffsetRef.current;

      // Shape 1: Brand Green Blob (18px max travel, factor 1.0)
      if (shape1Ref.current) {
        shape1Ref.current.style.transform = `translate3d(${x * 18}px, ${y * 18}px, 0)`;
      }

      // Shape 2: Warm Gold Subtle Blob (12px max travel, inverse factor -0.7)
      if (shape2Ref.current) {
        shape2Ref.current.style.transform = `translate3d(${-x * 12}px, ${-y * 12}px, 0)`;
      }

      // Shape 3: Soft Emerald/Gold Leaf Motif (15px max travel, factor 0.85)
      if (shape3Ref.current) {
        shape3Ref.current.style.transform = `translate3d(${x * 15}px, ${y * 15}px, 0)`;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // Mouse movement listener on section (relative -1 to +1 coordinates)
    let rafThrottled = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (rafThrottled) return;
      rafThrottled = true;

      requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        // Normalized from -1 (left/top) to +1 (right/bottom)
        const relX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const relY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

        // Clamp between -1 and 1
        targetOffsetRef.current = {
          x: Math.max(-1, Math.min(1, relX)),
          y: Math.max(-1, Math.min(1, relY)),
        };
        rafThrottled = false;
      });
    };

    const handleMouseLeave = () => {
      // Return gently to center when cursor exits
      targetOffsetRef.current = { x: 0, y: 0 };
    };

    section.addEventListener("mousemove", handleMouseMove, { passive: true });
    section.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [hasPointer]);

  // Determine whether to apply touch auto-drift animations
  // When hasPointer is false (touch device or mobile), enable auto-drift keyframe classes
  const isTouchDevice = hasPointer === false;

  if (!data.is_active) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-transparent pt-10 sm:pt-14 pb-12 sm:pb-16 border-t border-[var(--border)]"
    >

      {/* Main Content Container */}
      <div className="relative mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12 z-10">
        <MotionReveal direction="none">
          <div className="relative rounded-3xl border border-[var(--border)] bg-gradient-to-br from-white via-[var(--surface)] to-amber-50/20 overflow-hidden shadow-[0_12px_44px_-8px_rgba(14,34,68,0.12),0_4px_16px_-2px_rgba(198,161,91,0.16)] hover:shadow-[0_24px_56px_-10px_rgba(14,34,68,0.22),0_8px_24px_-4px_rgba(198,161,91,0.25)] hover:-translate-y-1 transition-all duration-500">
            {/* 4px Gradient Top Border (Gold to Deep Gold) matching Core Divisions */}
            <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#D4AF37] via-[#F0D58C] to-[#B38728] z-30" />

            {/* Subtle background texture: faint diagonal lines at 3.5% opacity */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none opacity-[0.035]">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="invest-diagonal-pattern" width="32" height="32" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="32" stroke="#0E2244" strokeWidth="2" />
                    <line x1="16" y1="0" x2="16" y2="32" stroke="#C6A15B" strokeWidth="1.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#invest-diagonal-pattern)" />
              </svg>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-8 sm:p-12 lg:p-14">
              <div className="lg:col-span-6 xl:col-span-7 space-y-5 sm:space-y-6 text-left">
                {/* Filled soft-gold badge with visual weight */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#EED596] via-[#E2C376] to-[#D4AF37] text-[#543E08] border border-[#C6A15B]/50 shadow-[0_2px_10px_rgba(198,161,91,0.28)] text-[11px] sm:text-xs font-bold tracking-widest uppercase select-none">
                  <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#543E08]" />
                  <span>{data.eyebrow_label}</span>
                </div>

                {/* Heading with 3.5px gold accent line and serif font */}
                <div className="space-y-3">
                  <span className="block h-[3.5px] w-12 bg-gradient-to-r from-[#D4AF37] to-[#B38728] rounded-full" />
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-[var(--heading)] tracking-tight leading-tight">
                    {data.heading}
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-[var(--body)] leading-relaxed font-light">
                  {data.description}
                </p>

                {data.primary_cta_label && data.primary_cta_url && (
                  <div className="pt-2 space-y-4">
                    <Link
                      href={data.primary_cta_url}
                      className="group/btn inline-flex items-center justify-center gap-3 rounded-full px-8 py-3.5 text-sm sm:text-base font-semibold tracking-wide text-white bg-gradient-to-r from-[#E0BE73] via-[#C9A24B] to-[#AE872E] border border-[#F0D58C]/40 shadow-[0_6px_22px_rgba(201,162,75,0.4),inset_0_1px_0_0_rgba(255,255,255,0.4)] hover:shadow-[0_12px_32px_rgba(201,162,75,0.55),inset_0_1px_0_0_rgba(255,255,255,0.5)] hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:scale-[0.98] transition-all duration-300 cursor-pointer"
                    >
                      <span>{data.primary_cta_label}</span>
                      <ArrowRight className="h-4 w-4 stroke-[2.5] text-white transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                    </Link>

                    {/* Small caps trust & credibility line */}
                    {data.secondary_cta_label && (
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs uppercase tracking-wider text-[var(--muted)] font-medium select-none">
                        {data.secondary_cta_label.split(/[·•]/).map((item, idx, arr) => (
                          <React.Fragment key={idx}>
                            <span className="font-semibold text-[var(--heading)]">{item.trim()}</span>
                            {idx < arr.length - 1 && <span className="text-[#C6A15B] font-bold">·</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Skyline Photo as a proper visual with navy-to-gold gradient overlay */}
              <div className="lg:col-span-6 xl:col-span-5 w-full">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] min-h-[260px] sm:min-h-[300px] lg:min-h-[330px] shadow-[0_20px_40px_-12px_rgba(7,18,36,0.32)] border border-[var(--border)] group">
                  <Image
                    src={data.image_url && !data.image_url.includes("unsplash") ? data.image_url : "/images/invest/invest-corporate-skyline-clean.jpg"}
                    alt={data.heading}
                    fill
                    className="object-cover object-[center_35%] group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                  {/* Subtle brand color-grading overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#0E2244]/75 via-[#071224]/30 to-[#C6A15B]/25 pointer-events-none mix-blend-multiply" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071224]/80 via-transparent to-transparent pointer-events-none" />

                  {/* Gradient caption bar (navy to transparent) blending into the photo */}
                  <div className="absolute inset-x-0 bottom-0 z-10 px-5 py-4 bg-gradient-to-t from-[#071224]/95 via-[#071224]/80 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-white">
                    <span className="font-serif tracking-wide text-[#F0D58C] text-xs sm:text-sm font-semibold drop-shadow-sm">
                      500+ Pharmacy Network Growth
                    </span>
                    <span className="text-white/80 text-[10px] sm:text-[10.5px] uppercase tracking-wider font-mono drop-shadow-sm">
                      Kerala &amp; South India
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
