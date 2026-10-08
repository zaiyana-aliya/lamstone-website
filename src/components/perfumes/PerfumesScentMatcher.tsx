"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, ShoppingBag, ArrowRight, CheckCircle2, Crown, Wind, Sun } from "lucide-react";

interface PerfumesScentMatcherProps {
  onShopProduct?: (productName: string) => void;
  onEnquireProduct?: (productName: string) => void;
}

export default function PerfumesScentMatcher({
  onShopProduct,
  onEnquireProduct,
}: PerfumesScentMatcherProps) {
  const [selectedMood, setSelectedMood] = useState<"regal" | "fresh" | "citrus">("regal");

  const moods = [
    {
      id: "regal",
      label: "Regal & Magnetic",
      icon: Crown,
      accord: "Rare Cambodian Oud & Golden Amber",
      perfume: {
        id: "barqat",
        name: "Lamé Barqat",
        subtitle: "Imperial Crown Eau de Parfum",
        priceInr: "₹3,999",
        priceAed: "175 AED",
        imageUrl: "/images/perfumes/bottle-trimmed.png",
        imageAlt: "Lamé Barqat Flacon",
        size: "100 ml / 3.4 FL. OZ.",
        bestFor: "Evening Galas, Royal Receptions & High-Impact Presence",
        topNotes: "Saffron, Pink Pepper, Sicilian Bergamot",
        heartNotes: "Taif Rose, Royal Jasmine, Amberwood",
        baseNotes: "Aged Cambodian Oud, Bourbon Vanilla, Velvet Musk",
        cardBg: "from-[#241307] via-[#1A0E05] to-[#100803]",
        accentColor: "text-[#F0C366]",
        borderColor: "border-[#C69A4C]/50",
      },
    },
    {
      id: "fresh",
      label: "Crisp & Oceanic",
      icon: Wind,
      accord: "Aquatic Amber & French Lavender",
      perfume: {
        id: "blue-mirage",
        name: "Blue Mirage",
        subtitle: "Aquatic Amber Sensorial Extrait",
        priceInr: "₹2,999",
        priceAed: "130 AED",
        imageUrl: "/images/lame/blue-mirage.jpg",
        imageAlt: "Lamé Blue Mirage Flacon",
        size: "100 ml / 3.4 FL. OZ.",
        bestFor: "Daytime Excursions, Coastal Retreats & Executive Meetings",
        topNotes: "Marine Breeze, Sea Salt, Calabrian Lemon",
        heartNotes: "French Lavender, Geranium, Sage",
        baseNotes: "Virginia Cedarwood, Patchouli, Oceanic Amber",
        cardBg: "from-[#0D2242] via-[#09172E] to-[#050E1C]",
        accentColor: "text-[#7EC4FF]",
        borderColor: "border-[#4A90E2]/50",
      },
    },
    {
      id: "citrus",
      label: "Luminous & Sun-Drenched",
      icon: Sun,
      accord: "White Florals & Fine Sandalwood",
      perfume: {
        id: "mayscent",
        name: "Mayscent",
        subtitle: "Sun-Drenched Citrus & Fine Sandalwood",
        priceInr: "₹499",
        priceAed: "22 AED",
        imageUrl: "/images/lame/mayscent.jpg",
        imageAlt: "Lamé Mayscent Flacon",
        size: "100 ml / 3.4 FL. OZ.",
        bestFor: "Daily Signature Wear, Casual Brunches & All-Day Freshness",
        topNotes: "Sparkling Tangerine, Crisp Pear, Neroli",
        heartNotes: "White Jasmine, Orange Blossom, Lily of the Valley",
        baseNotes: "Mysore Sandalwood, Cashmere Musk, Soft Amber",
        cardBg: "from-[#2A1E08] via-[#1C1405] to-[#100B02]",
        accentColor: "text-[#F5CD63]",
        borderColor: "border-[#E5B842]/50",
      },
    },
  ];

  const current = moods.find((m) => m.id === selectedMood) || moods[0];

  return (
    <section
      id="scent-finder"
      className="relative w-full bg-[#180E07] text-[#FAF4EB] py-16 sm:py-22 px-6 sm:px-10 lg:px-16 border-t border-[#C69A4C]/35 overflow-hidden"
    >
      {/* Background radial atmosphere */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none blur-[160px] opacity-25"
        style={{
          background: "radial-gradient(circle, #C69A4C 0%, #180E07 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto w-full relative z-10 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C69A4C]/15 border border-[#C69A4C]/35 text-[11px] tracking-[0.25em] text-[#F0C366] font-semibold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE SCENT MATCHER</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FAF4EB] tracking-tight">
            Discover Your Signature Accord
          </h2>
          <p className="text-[15px] sm:text-[17px] text-[#D8CDBC] leading-[1.6]">
            Select your desired presence to reveal your ideal olfactive formulation.
          </p>
        </div>

        {/* Mood Selection Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {moods.map((m) => {
            const Icon = m.icon;
            const isSelected = m.id === selectedMood;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMood(m.id as any)}
                className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-[#C69A4C] to-[#E2BC6A] text-[#0A1628] shadow-[0_4px_20px_rgba(198,154,76,0.4)] scale-105"
                    : "bg-white/5 text-[#FAF4EB]/80 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-[#0A1628]" : "text-[#F0C366]"}`} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Match Showcase Card */}
        <div
          className={`rounded-[26px] bg-gradient-to-br ${current.perfume.cardBg} border ${current.perfume.borderColor} p-6 sm:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.7)] transition-all duration-500`}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: Flacon Showcase */}
            <div className="md:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-[180px] sm:w-[220px] aspect-[4/5] flex items-center justify-center">
                {/* Backlight halo */}
                <div
                  className="absolute inset-0 rounded-full blur-[45px] opacity-50 -z-10"
                  style={{
                    background: "radial-gradient(circle, #F0C366 0%, transparent 70%)",
                  }}
                />
                <Image
                  src={current.perfume.imageUrl}
                  alt={current.perfume.imageAlt}
                  fill
                  className="object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)] animate-float-soft"
                />
              </div>

              {/* Anchored contact shadow */}
              <div className="w-[160px] h-3 rounded-[100%] bg-black/85 blur-[3px] -mt-3 mx-auto" />
            </div>

            {/* Right: Olfactive Profile Details & Action */}
            <div className="md:col-span-7 space-y-5 text-left">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E5BA62] block">
                  RECOMMENDED FOR YOU
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF4EB] tracking-tight mt-1">
                  {current.perfume.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#D8CDBC] font-medium mt-0.5">
                  {current.perfume.subtitle} · {current.perfume.size}
                </p>
              </div>

              {/* Occasion / Sillage note */}
              <div className="p-3.5 rounded-xl bg-black/35 border border-white/5 space-y-1">
                <span className="text-[11px] font-semibold text-[#F0C366] uppercase tracking-wider block">
                  Ideal Occasion &amp; Sillage
                </span>
                <p className="text-xs text-[#E8DED1]">
                  {current.perfume.bestFor}
                </p>
              </div>

              {/* Pyramid Notes */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-black/25 border border-white/5">
                  <span className="text-[10px] text-[#A89A88] uppercase block">Top</span>
                  <span className="text-[#FAF4EB] text-[11px] font-medium block truncate">
                    {current.perfume.topNotes.split(",")[0]}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/25 border border-white/5">
                  <span className="text-[10px] text-[#A89A88] uppercase block">Heart</span>
                  <span className="text-[#FAF4EB] text-[11px] font-medium block truncate">
                    {current.perfume.heartNotes.split(",")[0]}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/25 border border-white/5">
                  <span className="text-[10px] text-[#A89A88] uppercase block">Base</span>
                  <span className="text-[#FAF4EB] text-[11px] font-medium block truncate">
                    {current.perfume.baseNotes.split(",")[0]}
                  </span>
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="font-serif font-bold text-2xl text-[#FAF4EB]">
                    {current.perfume.priceInr}
                  </span>
                  <span className="text-xs font-bold text-[#0A1628] bg-gradient-to-r from-[#F0C366] to-[#E5BA62] px-2.5 py-0.5 rounded-full shadow-xs">
                    {current.perfume.priceAed}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href="https://mylamstone.com/collections/perfumes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold-lift inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#D9A74E] via-[#F0C366] to-[#C69A4C] text-[#0A1628] text-xs sm:text-sm font-bold tracking-wide shadow-[0_6px_20px_rgba(240,195,102,0.35)] cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                    <span>Shop on MyLamstone</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      if (onEnquireProduct) onEnquireProduct(current.perfume.name);
                    }}
                    className="text-xs font-semibold text-[#E5BA62] hover:text-white px-3 py-2 border-b border-[#C69A4C]/35 hover:border-white transition-colors cursor-pointer"
                  >
                    Enquire
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
