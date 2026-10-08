"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MotionReveal from "@/components/MotionReveal";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Building2,
  Leaf,
  Award,
  CheckCircle2,
  Users,
  Heart,
} from "lucide-react";

export interface AboutHeroData {
  eyebrow_label: string;
  heading: string;
  description: string;
  image_url?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  extra_data?: {
    subheading?: string;
    secondary_description?: string;
    badge1_icon?: string;
    badge1_title?: string;
    badge1_subtitle?: string;
    badge2_icon?: string;
    badge2_title?: string;
    badge2_subtitle?: string;
    badge3_icon?: string;
    badge3_title?: string;
    badge3_subtitle?: string;
    stat_trusted_year?: string;
    stat_pharmacies_count?: string;
    stat_delivery_title?: string;
    stat_delivery_subtitle?: string;
    stat_partners_count?: string;
    stat_partners_label?: string;
    stat_districts_count?: string;
    stat_districts_label?: string;
    hero_tagline?: string;
  };
  is_active?: boolean;
}

const DEFAULT_HERO_DATA: AboutHeroData = {
  eyebrow_label: "About Us",
  heading: "About\nLamstone",
  description:
    "Pioneering a holistic approach to wellness by integrating reliable pharmaceutical services with premium cosmetic solutions.\n\nLamstone is a diversified group with a strong presence in pharmaceuticals, cosmetics, personal care and investments. We are committed to improving lives through quality, innovation and care.",
  image_url: "/images/about/corporate-building-clean.jpg",
  cta_label: "Our Journey",
  cta_url: "#story",
  extra_data: {
    subheading:
      "Pioneering a holistic approach to wellness by integrating reliable pharmaceutical services with premium cosmetic solutions.",
    secondary_description:
      "Lamstone is a diversified group with a strong presence in pharmaceuticals, cosmetics, personal care and investments. We are committed to improving lives through quality, innovation and care.",
    badge1_icon: "ShieldCheck",
    badge1_title: "Trusted since 2019",
    badge1_subtitle: "",
    badge2_icon: "Building2",
    badge2_title: "500+ Pharmacies Network",
    badge2_subtitle: "",
    badge3_icon: "Truck",
    badge3_title: "Home Delivery",
    badge3_subtitle: "Straight to your door",
    stat_trusted_year: "2019",
    stat_pharmacies_count: "500+",
    stat_delivery_title: "Home Delivery",
    stat_delivery_subtitle: "Straight to your door",
    stat_partners_count: "9+",
    stat_partners_label: "Brand Partners",
    stat_districts_count: "14",
    stat_districts_label: "Districts Reach",
    hero_tagline: "Pharma • Cosmetics • Wellness",
  },
  is_active: true,
};

export default function AboutHeroSection() {
  const [data, setData] = useState<AboutHeroData>(DEFAULT_HERO_DATA);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch("/api/about-page", { cache: "no-store" });
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
              cta_label: row.cta_label || DEFAULT_HERO_DATA.cta_label,
              cta_url: row.cta_url || DEFAULT_HERO_DATA.cta_url,
              extra_data: {
                ...DEFAULT_HERO_DATA.extra_data,
                ...(row.extra_data || {}),
              },
              is_active: row.is_active ?? true,
            });
          }
        }
      } catch {
        // graceful fallback to DEFAULT_HERO_DATA
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

function renderBadgeIcon(iconName?: string) {
  switch (iconName) {
    case "Building2":
      return <Building2 className="h-4 w-4 stroke-[2.6] text-white" />;
    case "Truck":
      return <Truck className="h-4 w-4 stroke-[2.6] text-white" />;
    case "Award":
      return <Award className="h-4 w-4 stroke-[2.6] text-white" />;
    case "CheckCircle2":
      return <CheckCircle2 className="h-4 w-4 stroke-[2.6] text-white" />;
    case "Sparkles":
      return <Sparkles className="h-4 w-4 stroke-[2.6] text-white" />;
    case "Leaf":
      return <Leaf className="h-4 w-4 stroke-[2.6] text-white" />;
    case "Users":
      return <Users className="h-4 w-4 stroke-[2.6] text-white" />;
    case "Heart":
      return <Heart className="h-4 w-4 stroke-[2.6] text-white" />;
    case "ShieldCheck":
    default:
      return <ShieldCheck className="h-4 w-4 stroke-[2.6] text-white" />;
  }
}

  const subheading =
    data.extra_data?.subheading ||
    data.description.split("\n\n")[0] ||
    DEFAULT_HERO_DATA.extra_data?.subheading;

  // Badge 1
  const badge1Icon = data.extra_data?.badge1_icon || "ShieldCheck";
  const badge1Title =
    data.extra_data?.badge1_title ||
    (data.extra_data?.stat_trusted_year
      ? `Trusted since ${data.extra_data.stat_trusted_year}`
      : "Trusted since 2019");
  const badge1Subtitle = data.extra_data?.badge1_subtitle || "";

  // Badge 2
  const badge2Icon = data.extra_data?.badge2_icon || "Building2";
  const badge2Title =
    data.extra_data?.badge2_title ||
    (data.extra_data?.stat_pharmacies_count
      ? `${data.extra_data.stat_pharmacies_count} Pharmacies Network`
      : "500+ Pharmacies Network");
  const badge2Subtitle = data.extra_data?.badge2_subtitle || "";

  // Badge 3
  const badge3Icon = data.extra_data?.badge3_icon || "Truck";
  const badge3Title =
    data.extra_data?.badge3_title ||
    data.extra_data?.stat_delivery_title ||
    "Home Delivery";
  const badge3Subtitle =
    data.extra_data?.badge3_subtitle ||
    data.extra_data?.stat_delivery_subtitle ||
    "Straight to your door";

  return (
    <section className="relative w-full overflow-hidden min-h-[calc(100vh-76px)] min-h-[calc(100dvh-76px)] flex items-center bg-[#0D3366]">
      {/* Soft Ambient Radial Glow in upper-left area for depth and illumination */}
      <div
        className="pointer-events-none absolute -top-24 -left-20 w-[600px] sm:w-[720px] lg:w-[800px] h-[600px] sm:h-[720px] lg:h-[800px] rounded-full bg-[radial-gradient(circle_at_25%_25%,_rgba(255,255,255,0.06)_0%,_rgba(224,190,115,0.12)_28%,_rgba(13,51,102,0.4)_55%,_transparent_75%)] blur-3xl z-[1] select-none"
        aria-hidden="true"
      />

      {/* Dedicated Soft Dimensional Radial Glow behind the "About Lamstone" headline */}
      <div
        className="pointer-events-none absolute top-12 sm:top-16 left-8 sm:left-16 lg:left-24 w-[480px] sm:w-[600px] h-[320px] sm:h-[380px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(245,220,156,0.09)_0%,_rgba(255,255,255,0.035)_40%,_transparent_72%)] blur-3xl z-[1] select-none"
        aria-hidden="true"
      />

      {/* Subtle secondary depth glow in bottom-left */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/4 w-[480px] h-[360px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(22,66,128,0.45)_0%,_transparent_70%)] blur-2xl z-[1] select-none"
        aria-hidden="true"
      />

      {/* Corporate Building Photography with Crisp Visibility & Clean Left-Edge Blend */}
      <div
        className="absolute inset-y-0 right-0 w-full lg:w-[56%] xl:w-[54%] 2xl:w-[52%] z-0 select-none overflow-hidden pointer-events-none"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 6%, rgba(0,0,0,0.6) 12%, black 20%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 6%, rgba(0,0,0,0.6) 12%, black 20%, black 100%)",
        }}
      >
        <div className="relative h-full w-full">
          {/* Base Architectural Image — Rich Contrast & Subtle Natural Saturation Boost */}
          <Image
            src={data.image_url || "/images/about/corporate-building-clean.jpg"}
            alt="Lamstone Corporate Headquarters & Modern Architecture"
            fill
            priority
            unoptimized
            sizes="(max-width: 1024px) 100vw, 56vw"
            className="object-cover object-[78%_center] lg:object-[82%_center] xl:object-[85%_center] contrast-[1.07] saturate-[1.12]"
          />

          {/* Narrow Left-Edge Navy Fade (Affects Only the First 15-20% at the Seam) */}
          <div
            className="absolute inset-y-0 left-0 w-28 sm:w-36 lg:w-48 bg-gradient-to-r from-[#0D3366] via-[#0D3366]/60 to-transparent pointer-events-none z-[2]"
            aria-hidden="true"
          />

          {/* Focused Sunlight Glint on Glass Canopy / Windows */}
          <div
            className="pointer-events-none absolute top-[22%] right-[22%] w-20 sm:w-28 h-20 sm:h-28 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.75)_0%,_rgba(245,220,156,0.35)_40%,_transparent_70%)] blur-md z-[3] mix-blend-screen select-none"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute top-[18%] right-[18%] w-36 sm:w-48 h-36 sm:h-48 rounded-full bg-[radial-gradient(circle_at_center,_rgba(236,203,133,0.18)_0%,_transparent_65%)] blur-xl z-[3] mix-blend-screen select-none"
            aria-hidden="true"
          />

          {/* Subtle Warm Light Glow Near the Illuminated Entrance Canopy */}
          <div
            className="pointer-events-none absolute bottom-[26%] sm:bottom-[28%] right-[26%] sm:right-[30%] w-40 sm:w-56 h-40 sm:h-56 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,214,140,0.30)_0%,_rgba(224,175,80,0.14)_38%,_transparent_70%)] blur-2xl z-[3] mix-blend-screen select-none"
            aria-hidden="true"
          />

          {/* Subtle branded Lamstone leaf watermark in bottom-right corner */}
          <div className="absolute bottom-6 right-6 z-[4] pointer-events-none opacity-65 select-none">
            <svg
              viewBox="0 0 280 440"
              className="h-12 w-auto text-[#E0BE73] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M 62.342 24.258 C 46.641 52.743, 37.421 71.029, 28.441 91.500 C 21.333 107.703, 13.284 131.071, 9.636 146.098 C 4.709 166.393, 3.620 176.201, 4.292 194.225 C 5.348 222.531, 12.222 248.674, 28.424 286 C 36.447 304.483, 57.365 342.469, 59.409 342.267 C 61.417 342.068, 91.126 286.237, 101.322 263.500 C 111.689 240.383, 120.231 216.941, 124.462 200 C 138.072 145.499, 126.175 92.021, 83.694 16.753 C 79.469 9.267, 75.881 4.009, 75 4.012 C 74.086 4.015, 69.143 11.920, 62.342 24.258 M 246.425 31.426 C 219.441 44.354, 196.732 60.194, 184.779 74.427 C 167.680 94.785, 156.763 124.486, 147.441 176 C 146.097 183.425, 144.828 190.238, 144.621 191.139 C 144.414 192.041, 144.591 193.338, 145.013 194.021 C 145.996 195.612, 165.702 186.416, 182.009 176.756 C 222.416 152.818, 237.402 131.255, 250.990 77.500 C 256.490 55.744, 261.680 27.265, 260.375 26.006 C 259.892 25.540, 253.642 27.968, 246.425 31.426 M 265.500 188.720 C 254.962 191.291, 230.447 198.996, 217.500 203.806 C 143.156 231.426, 111.599 259.657, 78.677 328 C 69.656 346.726, 65.344 356.884, 57.027 379 C 49.069 400.161, 37.604 434.938, 38.343 435.676 C 39.019 436.353, 44.716 434.867, 66.500 428.330 C 112.506 414.526, 149.266 396.331, 174.500 374.871 C 188.351 363.092, 204.874 342.390, 215.501 323.500 C 231.589 294.903, 242.668 270.121, 256.186 232.500 C 260.841 219.547, 271 189.299, 271 188.394 C 271 187.904, 268.155 188.072, 265.500 188.720"
                fillRule="evenodd"
              />
            </svg>
          </div>

          {/* Mobile-only backdrop readability wash */}
          <div className="block lg:hidden absolute inset-0 bg-[#0D3366]/85 pointer-events-none z-[2]" />
        </div>
      </div>

      {/* Foreground Content Container — Balanced Banner Margin with Generous Breathing Room */}
      <div className="relative z-10 w-full pl-8 sm:pl-12 md:pl-16 lg:pl-20 xl:pl-24 2xl:pl-28 pr-6 sm:pr-8 lg:pr-12 py-16 sm:py-20 lg:py-24 my-auto">
        <div className="max-w-xl lg:max-w-2xl xl:max-w-[640px] 2xl:max-w-[700px] space-y-8 sm:space-y-9 lg:space-y-10">
          {/* Main Headline in Crisp White with Center-Bright Gold Gradient Underline */}
          <MotionReveal delay={40} direction="up">
            <div className="relative pt-1 sm:pt-2">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[76px] 2xl:text-[80px] leading-[1.01] sm:leading-[1.02] font-bold text-white tracking-tight">
                {data.heading.split("\n").map((line, idx) => {
                  const isLamstone = line.trim().toLowerCase().includes("lamstone");
                  return (
                    <span key={idx} className="block">
                      {isLamstone ? (
                        <span className="relative inline-block">
                          <span className="text-white font-bold">
                            {line}
                          </span>
                          {/* Refined Gold Gradient Underline Mark (Brighter Center, Fading Ends) */}
                          <span className="absolute -bottom-2 sm:-bottom-2.5 left-0 w-36 sm:w-44 h-[4.5px] rounded-full bg-gradient-to-r from-[#C6A15B]/30 via-[#F5DC9C] to-[#C6A15B]/20 shadow-[0_0_8px_rgba(245,220,156,0.35)]" />
                        </span>
                      ) : (
                        <span className="text-white">{line}</span>
                      )}
                    </span>
                  );
                })}
              </h1>
            </div>
          </MotionReveal>

          {/* Subheading in soft light blue for crisp legibility with increased breathing room */}
          <MotionReveal delay={120} direction="up">
            <p className="text-sm sm:text-base lg:text-[17px] xl:text-[18px] leading-relaxed text-blue-100/90 font-normal max-w-xl xl:max-w-2xl">
              {subheading}
            </p>
          </MotionReveal>

          {/* Row of 3 Badges: Gold-Tinted Shadow, Consistent Height & Hover Glow */}
          <MotionReveal delay={200} direction="up">
            <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-3 sm:gap-4">
              {/* 1. Badge 1 */}
              <div className="group flex items-center gap-3 px-5 sm:px-6 py-2.5 sm:py-3 min-h-[56px] sm:min-h-[60px] rounded-full bg-[#EEF4FB] border border-[#C6A15B]/40 text-[#001F3F] shadow-[0_4px_16px_-2px_rgba(198,161,91,0.22),0_2px_6px_rgba(0,18,40,0.18)] hover:shadow-[0_8px_24px_-2px_rgba(224,190,115,0.48),0_4px_12px_rgba(0,18,40,0.22)] hover:border-[#F5DC9C] hover:-translate-y-1 hover:bg-white transition-all duration-300 ease-out cursor-default">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C6A15B] text-white ring-2 ring-[#DCE7F5] group-hover:scale-110 group-hover:bg-[#B5892E] group-hover:ring-[#ECCB85] transition-all duration-300">
                  {renderBadgeIcon(badge1Icon)}
                </div>
                <div className="flex flex-col justify-center leading-tight">
                  <span className="font-sans text-xs sm:text-[13px] font-semibold text-[#001F3F] tracking-tight">
                    {badge1Title}
                  </span>
                  {badge1Subtitle && (
                    <span className="font-sans text-[10px] text-[#785A1D] font-medium mt-0.5">
                      {badge1Subtitle}
                    </span>
                  )}
                </div>
              </div>

              {/* 2. Badge 2 */}
              <div className="group flex items-center gap-3 px-5 sm:px-6 py-2.5 sm:py-3 min-h-[56px] sm:min-h-[60px] rounded-full bg-[#EEF4FB] border border-[#C6A15B]/40 text-[#001F3F] shadow-[0_4px_16px_-2px_rgba(198,161,91,0.22),0_2px_6px_rgba(0,18,40,0.18)] hover:shadow-[0_8px_24px_-2px_rgba(224,190,115,0.48),0_4px_12px_rgba(0,18,40,0.22)] hover:border-[#F5DC9C] hover:-translate-y-1 hover:bg-white transition-all duration-300 ease-out cursor-default">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C6A15B] text-white ring-2 ring-[#DCE7F5] group-hover:scale-110 group-hover:bg-[#B5892E] group-hover:ring-[#ECCB85] transition-all duration-300">
                  {renderBadgeIcon(badge2Icon)}
                </div>
                <div className="flex flex-col justify-center leading-tight">
                  <span className="font-sans text-xs sm:text-[13px] font-semibold text-[#001F3F] tracking-tight">
                    {badge2Title}
                  </span>
                  {badge2Subtitle && (
                    <span className="font-sans text-[10px] text-[#785A1D] font-medium mt-0.5">
                      {badge2Subtitle}
                    </span>
                  )}
                </div>
              </div>

              {/* 3. Badge 3 */}
              <div className="group flex items-center gap-3 px-5 sm:px-6 py-2.5 sm:py-3 min-h-[56px] sm:min-h-[60px] rounded-full bg-[#EEF4FB] border border-[#C6A15B]/40 text-[#001F3F] shadow-[0_4px_16px_-2px_rgba(198,161,91,0.22),0_2px_6px_rgba(0,18,40,0.18)] hover:shadow-[0_8px_24px_-2px_rgba(224,190,115,0.48),0_4px_12px_rgba(0,18,40,0.22)] hover:border-[#F5DC9C] hover:-translate-y-1 hover:bg-white transition-all duration-300 ease-out cursor-default">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C6A15B] text-white ring-2 ring-[#DCE7F5] group-hover:scale-110 group-hover:bg-[#B5892E] group-hover:ring-[#ECCB85] transition-all duration-300">
                  {renderBadgeIcon(badge3Icon)}
                </div>
                <div className="flex flex-col justify-center leading-tight">
                  <span className="font-sans text-xs sm:text-[13px] font-semibold text-[#001F3F] tracking-tight">
                    {badge3Title}
                  </span>
                  {badge3Subtitle && (
                    <span className="font-sans text-[10px] text-[#785A1D] font-medium mt-0.5">
                      {badge3Subtitle}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </MotionReveal>

          {/* CTA Button: Substantial Padding, Gold Gradient & Deepened Shadow on Hover */}
          {data.cta_label && (
            <MotionReveal delay={280} direction="up">
              <div className="pt-3 sm:pt-4">
                <Link
                  href={data.cta_url || "#story"}
                  className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#C6A15B] via-[#D4B06A] to-[#C6A15B] hover:from-[#B5892E] hover:via-[#C6A15B] hover:to-[#B5892E] text-white border border-[#ECCB85]/70 px-9 py-4 sm:px-10 sm:py-4.5 text-[13px] sm:text-sm font-bold uppercase tracking-[0.18em] font-sans shadow-[0_8px_26px_-4px_rgba(198,161,91,0.5),0_3px_10px_rgba(0,18,40,0.25)] hover:shadow-[0_16px_38px_-4px_rgba(224,190,115,0.7),0_6px_18px_rgba(0,18,40,0.3)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 ease-out cursor-pointer"
                >
                  <span>{data.cta_label}</span>
                  <ArrowRight className="h-4 w-4 text-white stroke-[2.5] transition-transform duration-200 ease-out group-hover:translate-x-1.5" />
                </Link>
              </div>
            </MotionReveal>
          )}
        </div>
      </div>
    </section>
  );
}

