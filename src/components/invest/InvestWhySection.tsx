"use client";

import React, { useEffect, useState } from "react";
import MotionReveal from "@/components/MotionReveal";
import { TrendingUp, ShieldCheck, Users, Layers, Award, Sparkles } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  ShieldCheck,
  Users,
  Layers,
  Award,
  Sparkles,
};

export interface ValuePropCard {
  icon?: string;
  title: string;
  description: string;
}

export interface InvestWhyData {
  eyebrow_label?: string | null;
  heading: string;
  description: string;
  extra_data?: {
    cards?: ValuePropCard[];
  };
  is_active?: boolean;
}

const DEFAULT_CARDS: ValuePropCard[] = [
  {
    icon: "TrendingUp",
    title: "Proven Growth Trajectory",
    description:
      "Lamstone is aggressively expanding through a strategic pharmacy acquisition plan, with each integrated pharmacy representing an existing revenue-generating asset.",
  },
  {
    icon: "ShieldCheck",
    title: "Recession-Resistant Industry",
    description:
      "Healthcare is a fundamental, non-discretionary market. The pharmacy sector remains resilient across economic cycles, providing stable, long-term returns.",
  },
  {
    icon: "Users",
    title: "Expert Management & Operations",
    description:
      "Our team combines deep pharmaceutical knowledge with modern retail management, brand building, and supply chain optimization expertise.",
  },
];

const DEFAULT_WHY_DATA: InvestWhyData = {
  eyebrow_label: "The Investment Case",
  heading: "Why Invest in Lamstone?",
  description:
    "Healthcare retail is one of the most defensible, scalable industries in emerging markets — and Lamstone is positioned at its frontier.",
  extra_data: {
    cards: DEFAULT_CARDS,
  },
  is_active: true,
};

export default function InvestWhySection() {
  const [data, setData] = useState<InvestWhyData>(DEFAULT_WHY_DATA);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch("/api/invest-page", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.sections)) {
          const row = json.sections.find((s: any) => s.section_key === "why_invest");
          if (row) {
            setData({
              eyebrow_label: row.eyebrow_label || DEFAULT_WHY_DATA.eyebrow_label,
              heading: row.heading || DEFAULT_WHY_DATA.heading,
              description: row.description || DEFAULT_WHY_DATA.description,
              extra_data: {
                cards: Array.isArray(row.extra_data?.cards) && row.extra_data.cards.length > 0
                  ? row.extra_data.cards
                  : DEFAULT_CARDS,
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

  const cards = data.extra_data?.cards || DEFAULT_CARDS;

  return (
    <section id="why-invest" className="bg-[#B31942] py-24 sm:py-32 border-t border-[#0F2A4A]/10 border-b border-[#0F2A4A]/10 scroll-mt-24">
      <div className="mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12 space-y-16">
        <MotionReveal direction="up">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            {data.eyebrow_label && (
              <div className="flex items-center justify-center gap-2.5 sm:gap-3">
                <span className="h-[1px] w-6 sm:w-10 bg-[#F0D9A0]/70" />
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-bold text-white/90 font-sans">
                  {data.eyebrow_label}
                </span>
                <span className="h-[1px] w-6 sm:w-10 bg-[#F0D9A0]/70" />
              </div>
            )}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              {data.heading}
            </h2>
            {/* Thin gold hairline with a small dot */}
            <div className="flex items-center justify-center gap-1.5 pt-1" aria-hidden="true">
              <span className="w-16 h-[1.5px] bg-[#F0D9A0]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#F0D9A0]" />
            </div>
            <p className="text-base sm:text-lg text-white/90 font-normal leading-relaxed max-w-2xl mx-auto pt-1 whitespace-pre-line">
              {data.description}
            </p>
          </div>
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {cards.map((card, i) => {
            const IconComponent = (card.icon && ICON_MAP[card.icon]) || TrendingUp;

            return (
              <MotionReveal key={i} delay={i * 140} direction="up" className="h-full flex flex-col">
                <div className="group relative overflow-hidden flex flex-col justify-between rounded-2xl border border-[#B8934A]/30 border-t-2 border-t-[#B8934A] bg-white p-8 sm:p-10 shadow-[0_4px_20px_-4px_rgba(15,42,74,0.12),0_2px_6px_-2px_rgba(15,42,74,0.06)] hover:shadow-[0_16px_36px_-8px_rgba(15,42,74,0.20)] hover:border-[#B8934A]/60 hover:-translate-y-1.5 transition-all duration-300 h-full w-full">
                  <div className="space-y-5 flex-1 flex flex-col">
                    {/* Navy icon badge with gold icon */}
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F2A4A] text-[#B8934A] border border-[#B8934A]/30 shadow-xs ring-2 ring-[#B8934A]/20 group-hover:scale-105 transition-all duration-300 shrink-0">
                      <IconComponent className="h-6 w-6 stroke-[2] text-[#B8934A]" />
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0F2A4A] shrink-0">
                      {card.title}
                    </h3>
                    <p
                      className="text-sm sm:text-base text-[#243E5E] font-normal leading-relaxed flex-1 whitespace-pre-line"
                      dangerouslySetInnerHTML={{ __html: card.description }}
                    />
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
