"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MotionReveal from "@/components/MotionReveal";
import {
  Building2,
  Sparkles,
  ShieldCheck,
  Award,
  ChevronRight,
  Cross,
  Droplets,
  Heart,
  Stethoscope,
  Activity,
  Layers,
  LucideIcon,
} from "lucide-react";

export interface DivisionCardData {
  id?: string;
  title: string;
  subtitle: string;
  icon?: string | null;
  link_url?: string | null;
  display_order?: number;
  is_active?: boolean;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Building2,
  Sparkles,
  ShieldCheck,
  Award,
  Cross,
  Droplets,
  Heart,
  Stethoscope,
  Activity,
  Layers,
};

const DEFAULT_CARDS: DivisionCardData[] = [
  {
    title: "Pharmacy Chain",
    subtitle: "500+ Pharmacies Statewide",
    icon: "Building2",
    link_url: "/pharmacy-chain",
  },
  {
    title: "Cosmetics Division",
    subtitle: "Trusted Global Brands",
    icon: "Sparkles",
    link_url: "/cosmetics",
  },
  {
    title: "Lamé",
    subtitle: "Clinically Tested, Cruelty-Free",
    icon: "ShieldCheck",
    link_url: "/lame",
  },
  {
    title: "Overall",
    subtitle: "Trust & Innovation Since 2019",
    icon: "Award",
    link_url: "/about",
  },
];

function resolveIcon(iconKey?: string | null): LucideIcon {
  if (!iconKey) return Layers;
  return ICON_MAP[iconKey] || Layers;
}

const CARD_THEMES: Record<string, {
  topBorder: string;
  iconTile: string;
  chevronHover: string;
}> = {
  "pharmacy chain": {
    topBorder: "bg-[#10B981]", // green
    iconTile: "bg-emerald-500/20 border-emerald-400/40 text-emerald-400 group-hover:bg-emerald-500/30",
    chevronHover: "group-hover:text-emerald-400",
  },
  "cosmetics division": {
    topBorder: "bg-[#C3394B]", // wine
    iconTile: "bg-rose-500/20 border-rose-400/40 text-rose-300 group-hover:bg-rose-500/30",
    chevronHover: "group-hover:text-rose-400",
  },
  "lamé": {
    topBorder: "bg-gradient-to-r from-[#10B981] via-[#D4AF37] to-[#C6A15B]", // emerald-gold
    iconTile: "bg-amber-500/20 border-amber-400/40 text-amber-300 group-hover:bg-amber-500/30",
    chevronHover: "group-hover:text-amber-400",
  },
  "overall": {
    topBorder: "bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#C6A15B]", // navy-gold
    iconTile: "bg-blue-500/20 border-blue-400/40 text-blue-300 group-hover:bg-blue-500/30",
    chevronHover: "group-hover:text-blue-400",
  },
};

const INDEX_THEMES = [
  {
    topBorder: "bg-[#10B981]",
    iconTile: "bg-emerald-500/20 border-emerald-400/40 text-emerald-400 group-hover:bg-emerald-500/30",
    chevronHover: "group-hover:text-emerald-400",
  },
  {
    topBorder: "bg-[#C3394B]",
    iconTile: "bg-rose-500/20 border-rose-400/40 text-rose-300 group-hover:bg-rose-500/30",
    chevronHover: "group-hover:text-rose-400",
  },
  {
    topBorder: "bg-gradient-to-r from-[#10B981] via-[#D4AF37] to-[#C6A15B]",
    iconTile: "bg-amber-500/20 border-amber-400/40 text-amber-300 group-hover:bg-amber-500/30",
    chevronHover: "group-hover:text-amber-400",
  },
  {
    topBorder: "bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#C6A15B]",
    iconTile: "bg-blue-500/20 border-blue-400/40 text-blue-300 group-hover:bg-blue-500/30",
    chevronHover: "group-hover:text-blue-400",
  },
];

export default function HomeDivisionCards() {
  const [cards, setCards] = useState<DivisionCardData[]>(DEFAULT_CARDS);

  useEffect(() => {
    let isMounted = true;

    async function loadCards() {
      try {
        const res = await fetch("/api/division-cards", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && Array.isArray(data.cards) && data.cards.length > 0) {
          setCards(data.cards);
        }
      } catch {
        // Keep default cards on error or offline
      }
    }

    loadCards();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7 items-stretch">
      {cards.map((item, i) => {
        const IconComponent = resolveIcon(item.icon);
        const normalized = (item.title || "").toLowerCase();
        const theme = CARD_THEMES[normalized] || INDEX_THEMES[i % INDEX_THEMES.length];

        const cardInner = (
          <div className="group relative overflow-hidden flex items-center justify-between gap-3 px-4 py-5 sm:px-5 sm:py-6 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300 w-full h-full min-h-[96px] backdrop-blur-md">
            {/* Top Accent: Distinct thin top border in each card's theme color */}
            <div className={`absolute top-0 left-0 right-0 h-[3.5px] ${theme.topBorder} transition-all duration-300`} />

            {/* Left content: Icon Tile + Text */}
            <div className="relative z-10 flex items-center gap-3.5 min-w-0">
              {/* Colorful Icon Tile */}
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-all duration-300 ${theme.iconTile}`}>
                <IconComponent className="h-5 w-5 shrink-0 stroke-[2.2]" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <span className="block font-bold text-sm sm:text-[14px] xl:text-[15px] text-white leading-snug whitespace-nowrap">
                  {item.title}
                </span>
                <span className="block text-xs sm:text-[12px] xl:text-[13px] text-white/80 font-light leading-snug">
                  {item.subtitle}
                </span>
              </div>
            </div>

            {/* Right Chevron */}
            <div className="relative z-10 flex items-center shrink-0 self-center">
              <ChevronRight className={`h-4 w-4 text-white/40 ${theme.chevronHover} group-hover:translate-x-1 transition-all duration-300`} />
            </div>
          </div>
        );

        return (
          <MotionReveal key={item.id || item.title || i} delay={i * 90} direction="up" className="h-full flex flex-col">
            {item.link_url ? (
              <Link href={item.link_url} className="h-full flex flex-col focus:outline-hidden rounded-2xl">
                {cardInner}
              </Link>
            ) : (
              <div className="h-full flex flex-col">
                {cardInner}
              </div>
            )}
          </MotionReveal>
        );
      })}
    </div>
  );
}
