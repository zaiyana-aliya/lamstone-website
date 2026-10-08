"use client";

import { useEffect, useState } from "react";
import MotionReveal from "@/components/MotionReveal";
import HexNetworkOverlay from "@/components/about/HexNetworkOverlay";
import BotanicalLeafWatermark from "@/components/about/BotanicalLeafWatermark";
import {
  ShieldCheck,
  Lightbulb,
  Users,
  Heart,
  Sparkles,
  Leaf,
  Target,
  Eye,
  Award,
  LucideIcon,
} from "lucide-react";

export interface AboutValueRecord {
  id?: string;
  icon: string;
  title: string;
  description: string;
  display_order?: number;
  is_active?: boolean;
}

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  Lightbulb,
  Users,
  Heart,
  Sparkles,
  Leaf,
  Target,
  Eye,
  Award,
};

const DEFAULT_VALUES: AboutValueRecord[] = [
  {
    icon: "ShieldCheck",
    title: "Quality First",
    description: "We never compromise on quality, safety or integrity.",
  },
  {
    icon: "Lightbulb",
    title: "Innovation",
    description: "We embrace change and invest in better solutions for tomorrow.",
  },
  {
    icon: "Users",
    title: "People & Communities",
    description: "We care for our people, our partners and the communities we serve.",
  },
  {
    icon: "Heart",
    title: "Loyalty & Customer Care",
    description: "We put our customers first, building lasting trust through care and reliability.",
  },
];

export default function AboutValuesSection() {
  const [values, setValues] = useState<AboutValueRecord[]>(DEFAULT_VALUES);

  useEffect(() => {
    let isMounted = true;

    async function loadValues() {
      try {
        const res = await fetch("/api/about-values", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.values) && json.values.length > 0) {
          setValues(json.values);
        }
      } catch {
        // fallback to DEFAULT_VALUES
      }
    }

    loadValues();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden py-28 sm:py-32 lg:py-36 bg-[#FFFDF9] border-t border-[#0F2A4A]/10">
      {/* Refined Honeycomb Lattice Pattern: ~8-9% blue lines, ~14% gold accents on left & right */}
      <HexNetworkOverlay opacity={0.14} />

      <div className="relative z-10 mx-auto max-w-6xl w-full px-6 sm:px-8 lg:px-12 space-y-14 sm:space-y-18">
        {/* Centered Heading Block */}
        <MotionReveal direction="up">
          <div className="text-center max-w-3xl mx-auto space-y-3.5">
            {/* Top Eyebrow with Thin Gold Lines */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-3">
              <span className="h-[1px] w-6 sm:w-10 bg-[#B8934A]/40" />
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-sans font-semibold text-[#B8934A]">
                Our Values
              </span>
              <span className="h-[1px] w-6 sm:w-10 bg-[#B8934A]/40" />
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-bold text-[#0F2A4A] tracking-tight leading-[1.12]">
                Explore How Lamstone Shapes Us
              </h2>
              {/* Gold accent mark */}
              <div className="mx-auto w-16 sm:w-20 h-[2px] rounded-full bg-[#B8934A]" />
            </div>

            <p className="font-sans text-xs sm:text-sm text-[#0F2A4A]/80 font-normal leading-[1.7] max-w-2xl mx-auto pt-1">
              Our values are the foundation of everything we do — shaping our culture, guiding our decisions and inspiring a healthier tomorrow.
            </p>
          </div>
        </MotionReveal>

        {/* Dynamic Values Cards Grid: 4 equal cards in subtle gradient with gold hairline border & layered shadows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 lg:gap-8 items-stretch pt-2">
          {values.map((val, idx) => {
            const ValIcon = ICON_MAP[val.icon] || ShieldCheck;

            return (
              <MotionReveal
                key={val.id || val.title}
                delay={idx * 90}
                duration={0.5}
                direction="up"
                className="h-full flex flex-col"
              >
                <div className="group relative overflow-hidden rounded-[24px] border border-[rgba(184,147,74,0.30)] hover:border-[rgba(184,147,74,0.65)] bg-gradient-to-b from-[#FFFFFF] to-[#FBF6EC] p-8 sm:p-9 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(15,42,74,0.05),0_20px_44px_rgba(15,42,74,0.10)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_8px_rgba(15,42,74,0.06),0_26px_54px_rgba(15,42,74,0.15)] hover:-translate-y-1.5 transition-all duration-300 ease-out w-full h-full flex flex-col justify-start">
                  {/* Top accent: 3px gold bar, 96px wide with rounded ends, expanding to full width on hover */}
                  <div className="absolute top-0 left-0 w-24 group-hover:w-full h-[3px] bg-[#B8934A] rounded-full transition-all duration-300 ease-out z-20" />

                  {/* Faint botanical leaf watermark in bottom-right corner */}
                  <div className="pointer-events-none select-none absolute -bottom-3 -right-3 z-0">
                    <BotanicalLeafWatermark opacity={0.08} width={70} height={120} color="#B8934A" />
                  </div>

                  <div className="relative z-10 flex flex-col flex-1">
                    {/* Icon badge: deep navy #0F2A4A circle (68px) with gold line icon (#D9B96C, 1.75px), outer gold ring with 4px gap and soft gold glow */}
                    <div className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#0F2A4A] group-hover:bg-[#B8934A] shadow-[0_8px_20px_rgba(184,147,74,0.25)] shrink-0 ring-1 ring-[#B8934A]/40 ring-offset-4 ring-offset-white transition-all duration-300">
                      <ValIcon className="h-7 w-7 text-[#D9B96C] group-hover:text-white stroke-[1.75] transition-colors duration-300" />
                    </div>

                    {/* Title area: navy serif at ~1.4rem with tight letter-spacing (-0.005em), reserved 2 lines of height */}
                    <div className="mt-6 sm:mt-7 space-y-3">
                      <h3 className="font-serif text-[1.4rem] font-bold text-[#0F2A4A] tracking-[-0.005em] leading-[1.25] h-[3.5rem] sm:h-[3.6rem] flex items-start">
                        {val.title}
                      </h3>
                      {/* Hairline with small 6px gold diamond in the middle */}
                      <div className="flex items-center gap-1.5 py-0.5">
                        <span className="w-4 h-[1px] bg-[#B8934A]" />
                        <span className="w-1.5 h-1.5 rotate-45 bg-[#B8934A] shrink-0" />
                        <span className="w-4 h-[1px] bg-[#B8934A]" />
                      </div>
                    </div>

                    {/* Description: navy-grey, line-height 1.75, ~0.98rem */}
                    <p className="pt-4 sm:pt-4.5 font-sans text-[0.98rem] text-[#0F2A4A]/80 leading-[1.75] font-normal">
                      {val.description}
                    </p>
                  </div>
                </div>
              </MotionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
