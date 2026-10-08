"use client";

import React, { useEffect, useState } from "react";
import MotionReveal from "@/components/MotionReveal";
import CTAButton from "@/components/CTAButton";

export interface LameQuoteData {
  eyebrow_label?: string | null;
  heading: string;
  description?: string | null;
  primary_cta_label?: string | null;
  primary_cta_url?: string | null;
  extra_data?: {
    quote?: string;
  };
  is_active?: boolean;
}

const DEFAULT_QUOTE_DATA: LameQuoteData = {
  heading: "Inquire About Lamé Retail Partnerships",
  description: "",
  primary_cta_label: "Inquire About Lamé Retail Partnerships",
  primary_cta_url: "/contact",
  extra_data: {
    quote: "True beauty is synonymous with health.",
  },
  is_active: true,
};

export default function LameQuoteCtaSection() {
  const [data, setData] = useState<LameQuoteData>(DEFAULT_QUOTE_DATA);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch("/api/lame-page", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.sections)) {
          const row = json.sections.find((s: any) => s.section_key === "quote_cta");
          if (row) {
            setData({
              eyebrow_label: row.eyebrow_label,
              heading: row.heading || DEFAULT_QUOTE_DATA.heading,
              description: row.description,
              primary_cta_label: row.primary_cta_label || DEFAULT_QUOTE_DATA.primary_cta_label,
              primary_cta_url: row.primary_cta_url || DEFAULT_QUOTE_DATA.primary_cta_url,
              extra_data: {
                ...DEFAULT_QUOTE_DATA.extra_data,
                ...(row.extra_data || {}),
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

  const quoteText = data.extra_data?.quote || data.heading || "True beauty is synonymous with health.";

  return (
    <section className="relative overflow-hidden bg-[#FBF7F0] py-24 sm:py-28 text-center border-t border-[#B8934A]/20">
      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl space-y-6">
          <MotionReveal direction="up">
            {data.eyebrow_label && (
              <div className="flex items-center justify-center gap-2.5 sm:gap-3 mb-3">
                <span className="h-[1px] w-6 sm:w-10 bg-[#B8934A]/50" />
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-bold text-[#B8934A] font-sans">
                  {data.eyebrow_label}
                </span>
                <span className="h-[1px] w-6 sm:w-10 bg-[#B8934A]/50" />
              </div>
            )}
            <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#0F2A4A] font-normal italic leading-relaxed max-w-3xl mx-auto">
              &ldquo;{quoteText}&rdquo;
            </p>
            {/* Thin gold hairline with a small dot beneath the quote */}
            <div className="flex items-center justify-center gap-1.5 pt-3" aria-hidden="true">
              <span className="w-16 h-[1.5px] bg-[#B8934A]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8934A]" />
            </div>
            {data.description && (
              <p className="text-sm sm:text-base text-[#243E5E] max-w-xl mx-auto pt-2">
                {data.description}
              </p>
            )}
            {data.primary_cta_label && (
              <div className="pt-6">
                <CTAButton
                  href={data.primary_cta_url || "/contact"}
                  variant="navy"
                  size="lg"
                  className="rounded-full shadow-[0_4px_16px_rgba(15,42,74,0.18)] hover:shadow-md"
                >
                  {data.primary_cta_label}
                </CTAButton>
              </div>
            )}
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
