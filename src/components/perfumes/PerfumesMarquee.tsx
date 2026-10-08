"use client";

import React from "react";

const MARQUEE_ITEMS = [
  "LAMÉ HAUTE PARFUMERIE",
  "NOW AVAILABLE",
  "SIGNATURE FLACONS",
  "RARE BOTANICAL ESSENCES",
  "WORLDWIDE CONCIERGE",
  "LAMSTONE HEALTHCARE",
  "LAMÉ HAUTE PARFUMERIE",
  "NOW AVAILABLE",
  "SIGNATURE FLACONS",
  "RARE BOTANICAL ESSENCES",
  "WORLDWIDE CONCIERGE",
  "LAMSTONE HEALTHCARE",
];

export default function PerfumesMarquee() {
  return (
    <aside
      className="relative w-full overflow-hidden bg-gradient-to-r from-[#7D5A1B] via-[#9E7A31] to-[#735216] border-y border-[#F0C366]/50 py-5 select-none shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
      aria-label="Perfumes Ticker"
    >
      <div className="flex w-max animate-marquee-smooth items-center">
        {MARQUEE_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-6 sm:space-x-10 px-4 sm:px-6 shrink-0"
          >
            <span
              className={`font-serif text-lg sm:text-2xl md:text-3xl tracking-wider uppercase font-bold drop-shadow-xs transition-colors ${
                idx % 2 === 0
                  ? "text-[#081220]"
                  : "text-[#FFF8EC]"
              }`}
            >
              {item}
            </span>
            <span
              aria-hidden="true"
              className="w-2 h-2 rounded-full bg-[#FFF8EC]/80 shadow-[0_0_6px_#FFF8EC]"
            />
          </div>
        ))}
      </div>
    </aside>
  );
}
