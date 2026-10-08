"use client";

import React from "react";
import { Mail, Phone, ShoppingBag, ArrowRight } from "lucide-react";

interface PerfumesConciergeSectionProps {
  onShopNow?: () => void;
  onEnquire?: () => void;
}

export default function PerfumesConciergeSection({
  onShopNow,
  onEnquire,
}: PerfumesConciergeSectionProps) {
  return (
    <section
      id="contact"
      className="relative w-full bg-[#0A1628] text-[#FAF4EB] py-14 sm:py-18 px-6 sm:px-10 lg:px-16 border-b border-[#C69A4C]/30 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Compact Luxury Concierge Box */}
        <div className="rounded-[22px] bg-[#101D33] border border-[#C69A4C]/45 p-6 sm:p-10 shadow-[0_20px_48px_rgba(0,0,0,0.65)] space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#C69A4C]/20 pb-6">
            <div>
              <p className="text-[11px] sm:text-xs tracking-[0.28em] text-[#E5BA62] font-semibold uppercase">
                HAUTE PERFUMERY CONCIERGE
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF4EB] tracking-tight mt-1">
                Private Orders &amp; Regional Boutique Allocations
              </h2>
            </div>
            <div className="font-bimbo text-3xl sm:text-4xl text-[#F0C366] select-none shrink-0">
              Lamstone.ae
            </div>
          </div>

          {/* Quick Contact & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
            <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-[#E5BA62] font-semibold block">Email</span>
              <a href="mailto:mail@lamstone.ae" className="text-[#FAF4EB] hover:text-[#F0C366] font-medium transition-colors block truncate">
                mail@lamstone.ae
              </a>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-[#E5BA62] font-semibold block">Concierge Hotline</span>
              <a href="tel:+971547401777" className="text-[#FAF4EB] hover:text-[#F0C366] font-medium transition-colors block">
                +971 54 740 1777
              </a>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-[#E5BA62] font-semibold block">Availability</span>
              <span className="text-[#F0C366] font-medium block">
                Now Available · Global Shipping
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <a
                href="#collection"
                onClick={(e) => {
                  e.preventDefault();
                  if (onShopNow) onShopNow();
                  else {
                    const el = document.getElementById("collection");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="btn-gold-lift inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C69A4C] to-[#E2BC6A] text-[#0A1628] text-xs sm:text-sm font-bold tracking-wide shadow-[0_6px_20px_rgba(198,154,76,0.35)] cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                <span>Shop Collection</span>
              </a>

              <button
                type="button"
                onClick={onEnquire}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#182B49] text-[#FAF4EB] border border-[#C69A4C]/50 text-xs sm:text-sm font-semibold tracking-wide hover:bg-[#20375C] transition-colors cursor-pointer"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-[#D8CDBC]">
              Dispatched with bespoke luxury gift packaging and insured global delivery.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
