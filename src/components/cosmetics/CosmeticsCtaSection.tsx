"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MotionReveal from "@/components/MotionReveal";
import { ArrowRight } from "lucide-react";

export interface CosmeticsCtaData {
  eyebrow_label?: string | null;
  heading: string;
  description: string;
  image_url?: string | null;
  primary_cta_label?: string | null;
  primary_cta_url?: string | null;
  extra_data?: Record<string, any>;
  is_active?: boolean;
}

const DEFAULT_CTA_DATA: CosmeticsCtaData = {
  eyebrow_label: null,
  heading: "Partner With Lamstone as a Retailer or Brand Supplier",
  description: "Gain access to a statewide retail footprint and professional logistics infrastructure.",
  primary_cta_label: "Contact Distribution Team",
  primary_cta_url: "/contact",
  is_active: true,
};

export default function CosmeticsCtaSection() {
  const [data, setData] = useState<CosmeticsCtaData>(DEFAULT_CTA_DATA);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch("/api/cosmetics-page", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.sections)) {
          const row = json.sections.find((s: any) => s.section_key === "cta_banner");
          if (row) {
            setData({
              eyebrow_label: row.eyebrow_label,
              heading: row.heading || DEFAULT_CTA_DATA.heading,
              description: row.description || DEFAULT_CTA_DATA.description,
              image_url: row.image_url,
              primary_cta_label: row.primary_cta_label || DEFAULT_CTA_DATA.primary_cta_label,
              primary_cta_url: row.primary_cta_url || DEFAULT_CTA_DATA.primary_cta_url,
              extra_data: row.extra_data || {},
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

  return (
    <section className="relative overflow-hidden bg-[#FBF7F0] py-24 sm:py-28 lg:py-32 border-t border-[#0F2A4A]/10 text-center">
      {/* Subtle gold top and bottom hairlines */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-[rgba(184,147,74,0.40)] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-[rgba(184,147,74,0.40)] pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl space-y-6">
          <MotionReveal direction="up">
            {data.eyebrow_label && (
              <div className="flex items-center justify-center gap-2.5 sm:gap-3 mb-3">
                <span className="h-[1px] w-6 sm:w-8 bg-[#B8934A]/50" />
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-sans font-semibold text-[#B8934A]">
                  {data.eyebrow_label}
                </span>
                <span className="h-[1px] w-6 sm:w-8 bg-[#B8934A]/50" />
              </div>
            )}

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0F2A4A] tracking-tight leading-[1.10]">
              {data.heading}
            </h2>

            {/* Gold hairline with small dot */}
            <div className="flex items-center justify-center gap-1.5 mt-3.5 sm:mt-4" aria-hidden="true">
              <span className="w-16 sm:w-20 h-[1.5px] bg-[#B8934A]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8934A]" />
            </div>

            <p className="text-base sm:text-[17px] text-[#0F2A4A]/80 font-normal leading-[1.7] mt-4 max-w-[60ch] mx-auto whitespace-pre-line">
              {data.description}
            </p>

            {data.primary_cta_label && (
              <div className="pt-6">
                <Link
                  href={data.primary_cta_url || "/contact"}
                  className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-[#0F2A4A] hover:bg-[#173A6B] text-white pl-8 pr-3.5 py-3.5 sm:pl-9 sm:pr-4 sm:py-4 text-xs sm:text-[13px] font-sans font-semibold uppercase tracking-[0.16em] shadow-[0_4px_16px_rgba(15,42,74,0.18)] hover:shadow-[0_8px_24px_rgba(15,42,74,0.28)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
                >
                  <span>{data.primary_cta_label}</span>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#B8934A] text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
                    <ArrowRight className="h-3.5 w-3.5 text-white group-hover:translate-x-0.5 transition-transform duration-200" />
                  </div>
                </Link>
              </div>
            )}
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
