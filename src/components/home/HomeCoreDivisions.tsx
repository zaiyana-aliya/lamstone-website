"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MotionReveal from "@/components/MotionReveal";
import { ArrowRight, Building2, Sparkles } from "lucide-react";

export interface CoreDivisionItem {
  id?: string;
  badge_label: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  cta_label?: string;
  display_order?: number;
  is_active?: boolean;
}

const DEFAULT_CORE_DIVISIONS: CoreDivisionItem[] = [
  {
    id: "default-pharmacy",
    badge_label: "Pharmacy Chain",
    title: "Lamstone Pharmacy Chain",
    description:
      "Lamstone is a rapidly expanding network of premium pharmacies across Kerala, committed to delivering authentic medicines, expert healthcare guidance, and a comprehensive range of wellness and personal care products. With a vision to redefine pharmaceutical retail excellence, Lamstone is strategically acquiring and integrating 500+ pharmacies across the state, building a trusted healthcare ecosystem that combines accessibility, innovation, and customer-centric care under one unified brand experience.",
    image_url: "/images/home-pharmacy-card.jpg",
    link_url: "/pharmacy-chain",
    cta_label: "Our Pharmacies",
    display_order: 1,
  },
  {
    id: "default-cosmetics",
    badge_label: "Cosmetics Division",
    title: "Lamstone Cosmetics Division",
    description:
      "Lamstone is a leading distributor of globally renowned beauty and personal care brands, including Dove, Pears, Mamaearth, Lotus, Jovees, Johnson & Johnson, Cetaphil, Pantene, Ponds, Head & Shoulders, and Sebamed. Committed to authenticity and quality, we supply high-demand cosmetic products across the region, catering to modern beauty, wellness, and personal care needs.",
    image_url: "/images/home-cosmetics-card.jpg",
    link_url: "/cosmetics",
    cta_label: "Brand Collection",
    display_order: 2,
  },
];

function resolveBadgeIcon(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes("cosmetic") || normalized.includes("beauty") || normalized.includes("lame") || normalized.includes("lamé")) {
    return <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />;
  }
  return <Building2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />;
}

export default function HomeCoreDivisions() {
  const [divisions, setDivisions] = useState<CoreDivisionItem[]>(DEFAULT_CORE_DIVISIONS);

  useEffect(() => {
    let isMounted = true;

    async function loadDivisions() {
      try {
        const res = await fetch("/api/core-divisions", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && Array.isArray(data.divisions) && data.divisions.length > 0) {
          setDivisions(data.divisions);
        }
      } catch {
        // Keep default divisions if network or DB table is unavailable
      }
    }

    loadDivisions();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      className={`grid grid-cols-1 ${
        divisions.length === 1
          ? "max-w-3xl mx-auto"
          : divisions.length === 2
          ? "lg:grid-cols-2"
          : "md:grid-cols-2 lg:grid-cols-3"
      } gap-8 sm:gap-10 items-stretch`}
    >
      {divisions.map((item, index) => {
        const badgeIcon = resolveBadgeIcon(item.badge_label);

        return (
          <MotionReveal
            key={item.id || item.title || index}
            delay={100 + index * 120}
            direction="up"
            className="h-full flex flex-col"
          >
            <div className="group flex flex-col justify-between rounded-2xl border border-[var(--border)] border-t-4 border-t-[var(--accent)] bg-[var(--surface)] p-8 sm:p-10 lg:p-12 shadow-[0_4px_24px_-4px_var(--shadow-color)] hover:shadow-[0_24px_48px_-10px_var(--shadow-color)] hover:-translate-y-1.5 transition-all duration-300 ease-out h-full w-full">
              <div className="flex-1 flex flex-col">
                {/* Division Photography with ratio 16/10 */}
                <div
                  className="overflow-hidden rounded-2xl aspect-[16/10] relative bg-neutral-900 shrink-0"
                  style={{ aspectRatio: "16 / 10" }}
                >
                  {(() => {
                    const isCosmetics =
                      item.badge_label.toLowerCase().includes("cosmetic") ||
                      item.title.toLowerCase().includes("cosmetic");

                    return (
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className={`object-cover ${
                          isCosmetics ? "object-top" : "object-center"
                        } group-hover:scale-105 transition-transform duration-700 ease-out`}
                        style={{ objectPosition: isCosmetics ? "center top" : "center" }}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    );
                  })()}
                  {/* Subtle brand color-grading overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)]/[0.08] to-[var(--accent)]/[0.03] pointer-events-none mix-blend-multiply" />

                  {/* Dark gradient overlay fading from bottom for pill badge contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent pointer-events-none" />

                  {/* Solid colorful category pill badge overlay */}
                  {(() => {
                    const isPharmacy = item.badge_label.toLowerCase().includes("pharmacy");
                    const pillBg = isPharmacy
                      ? "bg-emerald-700 border-emerald-500/50 text-white shadow-[0_4px_14px_rgba(5,150,105,0.45)]"
                      : "bg-[#9E1B2A] border-rose-500/50 text-white shadow-[0_4px_14px_rgba(158,27,42,0.45)]";
                    const iconBg = isPharmacy ? "bg-emerald-800/80 text-emerald-100" : "bg-rose-900/80 text-rose-100";

                    return (
                      <div className={`absolute bottom-4 left-4 z-10 inline-flex items-center gap-2 rounded-full ${pillBg} border px-3.5 py-1.5 select-none`}>
                        <div className={`flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full ${iconBg} shrink-0`}>
                          {badgeIcon}
                        </div>
                        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white drop-shadow-xs">
                          {item.badge_label}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* Text content area with breathing room */}
                <div className="pt-7 sm:pt-9 space-y-6 flex-1 flex flex-col">
                  <div className="space-y-3 shrink-0">
                    <span className="block h-[3.5px] w-12 bg-[var(--accent)]" />
                    <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[var(--heading)]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-[var(--body)] font-light flex-1">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action link */}
              <div className="pt-8 mt-8 border-t border-[var(--border)]">
                <Link
                  href={item.link_url || "/about"}
                  className="group/link inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-text)] hover:text-[var(--primary)] transition-colors duration-200"
                >
                  <span>{item.cta_label || "Learn More"}</span>
                  <ArrowRight className="h-4 w-4 text-inherit transition-transform duration-200 group-hover/link:translate-x-1.5" />
                </Link>
              </div>
            </div>
          </MotionReveal>
        );
      })}
    </div>
  );
}
