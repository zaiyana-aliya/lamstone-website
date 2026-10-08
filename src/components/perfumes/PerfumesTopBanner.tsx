"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export default function PerfumesTopBanner() {
  const announcements = [
    "SIGNATURE HAUTE PARFUMERIE COLLECTION",
    "NOW AVAILABLE IN INDIA & UAE",
    "EXTRAIT DE PARFUM · ARTISANAL MASTERPIECES",
    "FREE EXPRESS DISPATCH",
    "HAND-CRAFTED HAUTE PARFUMERIE FLACONS",
    "100% NOBLE BOTANICAL ABSOLUTES",
  ];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#593F0F] via-[#8C6822] to-[#593F0F] border-b border-[#F0C366]/40 py-2.5 text-xs text-[#FFF8EC] font-semibold tracking-wider uppercase select-none z-20">
      <div className="flex w-max animate-marquee-smooth items-center">
        {[...announcements, ...announcements].map((text, idx) => (
          <div key={idx} className="flex items-center space-x-6 px-6 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#FFE39B] fill-[#FFE39B]/30" />
            <span className="drop-shadow-xs font-sans tracking-[0.18em] text-[11px] sm:text-xs">
              {text}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFE39B]/80" />
          </div>
        ))}
      </div>
    </div>
  );
}
