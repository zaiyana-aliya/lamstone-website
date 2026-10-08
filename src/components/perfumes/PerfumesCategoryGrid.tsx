"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Sparkles, Wind, Flame, Sun } from "lucide-react";

interface PerfumesCategoryGridProps {
  onSelectCategory?: (productId: string) => void;
}

export default function PerfumesCategoryGrid({ onSelectCategory }: PerfumesCategoryGridProps) {
  const categories = [
    {
      id: "barqat",
      family: "ORIENTAL OUD & AMBER",
      subtitle: "Exotic · Regal · Majestic",
      description: "Rare Cambodian oud distilled with warm golden amber and velvety Taif rose for an imperial, long-lasting signature.",
      featuredProduct: "Lamé Barqat",
      price: "₹3,999 · 175 AED",
      icon: Flame,
      iconColor: "text-[#F0C366]",
      bgGradient: "from-[#2A170B] via-[#1D1007] to-[#120904]",
      borderColor: "border-[#C69A4C]/45 hover:border-[#F0C366]",
      glowColor: "rgba(240, 195, 102, 0.22)",
      badgeBg: "bg-[#3D2510]/80 text-[#F5DE9B] border-[#C69A4C]/40",
      accentTag: "EXTREME LONGEVITY (16h+)",
    },
    {
      id: "blue-mirage",
      family: "AQUATIC & OCEAN FRESH",
      subtitle: "Energize · Oceanic · Vitalize",
      description: "Sea salt breezes blended with French lavender and crisp Virginia cedarwood for effortless, invigorating elegance.",
      featuredProduct: "Blue Mirage",
      price: "₹2,999 · 130 AED",
      icon: Wind,
      iconColor: "text-[#7EC4FF]",
      bgGradient: "from-[#0D2244] via-[#09172E] to-[#050E1C]",
      borderColor: "border-[#3A78C4]/45 hover:border-[#7EC4FF]",
      glowColor: "rgba(74, 144, 226, 0.25)",
      badgeBg: "bg-[#0E2952]/80 text-[#B8E1FF] border-[#4A90E2]/40",
      accentTag: "INVIGORATING SILLAGE",
    },
    {
      id: "mayscent",
      family: "FLORAL & BRIGHT CITRUS",
      subtitle: "Luminous · Sun-Drenched · Bloom",
      description: "Sparkling Italian bergamot layered with white florals and soothing Mysore sandalwood for all-day luminous warmth.",
      featuredProduct: "Mayscent",
      price: "₹499 · 22 AED",
      icon: Sun,
      iconColor: "text-[#F5CD63]",
      bgGradient: "from-[#2E2008] via-[#1E1505] to-[#120C03]",
      borderColor: "border-[#D9A736]/45 hover:border-[#F5CD63]",
      glowColor: "rgba(229, 184, 66, 0.22)",
      badgeBg: "bg-[#3D2C0C]/80 text-[#FFE7A8] border-[#E5B842]/40",
      accentTag: "EVERYDAY LUXURY",
    },
  ];

  const handleCategoryClick = (id: string) => {
    if (onSelectCategory) {
      onSelectCategory(id);
    } else {
      const el = document.getElementById("collection");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="categories"
      className="relative w-full bg-[#081426] text-[#FAF4EB] py-16 sm:py-20 px-6 sm:px-10 lg:px-16 border-t border-[#C69A4C]/25 overflow-hidden"
    >
      {/* Ambient Jewel Glows */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[300px] rounded-full pointer-events-none blur-[150px] opacity-20"
        style={{ background: "radial-gradient(circle, #C69A4C 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[300px] rounded-full pointer-events-none blur-[150px] opacity-20"
        style={{ background: "radial-gradient(circle, #1E4F8A 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto w-full relative z-10 space-y-12">
        {/* Section Header (Inspired by MYOP "Explore Scents") */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C69A4C]/15 border border-[#C69A4C]/35 text-[11px] tracking-[0.25em] text-[#F0C366] font-semibold uppercase">
            <Sparkles className="w-3 h-3" />
            <span>OLFACTIVE FAMILIES</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FAF4EB] tracking-tight">
            Explore Scents by Accord
          </h2>
          <p className="text-[15px] sm:text-[17px] text-[#D8CDBC] leading-[1.6]">
            Every fragrance is an invitation to evoke a distinct sensation. Discover the scent family crafted for your personality.
          </p>
        </div>

        {/* 3 Interactive Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`group relative flex flex-col justify-between rounded-[24px] bg-gradient-to-b ${cat.bgGradient} border ${cat.borderColor} p-7 sm:p-8 shadow-[0_18px_40px_rgba(0,0,0,0.6)] hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer overflow-hidden`}
              >
                {/* Radial Glow on hover */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0"
                  style={{
                    background: `radial-gradient(circle at 50% 20%, ${cat.glowColor} 0%, transparent 75%)`,
                  }}
                  aria-hidden="true"
                />

                <div className="relative z-10 space-y-5">
                  {/* Top Row: Icon + Accent Tag */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center ${cat.iconColor} shadow-inner`}>
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full border text-[10px] font-semibold tracking-wider uppercase ${cat.badgeBg}`}>
                      {cat.accentTag}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#FAF4EB] tracking-tight group-hover:text-[#F0C366] transition-colors">
                      {cat.family}
                    </h3>
                    <p className={`text-xs font-semibold uppercase tracking-wider mt-1 ${cat.iconColor}`}>
                      {cat.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-[13px] text-[#D8CDBC] leading-[1.65]">
                    {cat.description}
                  </p>
                </div>

                {/* Bottom Row: Featured Fragrance & Direct CTA */}
                <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#A69B8B] block font-medium">Signature Flacon</span>
                    <span className="text-sm font-bold text-[#FAF4EB] block">
                      {cat.featuredProduct}
                    </span>
                    <span className="text-xs font-semibold text-[#F0C366]">
                      {cat.price}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-[#F0C366] group-hover:bg-[#F0C366] group-hover:text-[#0A1628] group-hover:border-[#F0C366] transition-all duration-300">
                    <ArrowRight className="w-4 h-4 stroke-[2.3] transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
