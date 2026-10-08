"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Crown, Sparkles, Plus, Minus, Check } from "lucide-react";

export interface PerfumeItem {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  olfactiveCategory: string;
  notes: string;
  size: string;
  priceInr: string;
  priceAed: string;
  imageUrl: string;
  imageAlt: string;
  storeUrl?: string;
  cardBg: string;
  borderColor: string;
  chamberBg: string;
  glowColor: string;
  podiumGradient: string;
  notesColor: string;
}

const SIGNATURE_PERFUMES: PerfumeItem[] = [
  {
    id: "barqat",
    name: "Lamé Barqat",
    badge: "🔥 SELLING FAST · IMPERIAL CROWN",
    tagline: "Imperial Crown Eau de Parfum",
    olfactiveCategory: "ORIENTAL WOOD · EXTRAIT · UNISEX",
    notes: "RARE AMBER · CAMBODIAN OUD · TAIF ROSE",
    size: "100 ml / 3.4 FL. OZ.",
    priceInr: "₹3,999",
    priceAed: "175 AED",
    imageUrl: "/images/perfumes/bottle-trimmed.png",
    imageAlt: "Lamé Barqat Eau De Parfum Flacon",
    storeUrl: "https://mylamstone.com/collections/perfumes",
    cardBg: "bg-[#1C1208]",
    borderColor: "border-[#C69A4C]/50 hover:border-[#F0C366]",
    chamberBg: "bg-[#27180A]",
    glowColor: "rgba(240, 195, 102, 0.25)",
    podiumGradient: "from-[#4E3816] via-[#35250E] to-[#1F1508]",
    notesColor: "text-[#F0C366]",
  },
  {
    id: "blue-mirage",
    name: "Blue Mirage",
    badge: "🌊 BEST SELLER · SENSORIAL EXTRAIT",
    tagline: "Aquatic Amber Sensorial Extrait",
    olfactiveCategory: "AQUATIC FRESH · EXTRAIT · UNISEX",
    notes: "AQUATIC AMBER · FRENCH LAVENDER · CEDARWOOD",
    size: "100 ml / 3.4 FL. OZ.",
    priceInr: "₹2,999",
    priceAed: "130 AED",
    imageUrl: "/images/lame/blue-mirage.jpg",
    imageAlt: "Lamé Blue Mirage Eau De Parfum",
    storeUrl: "https://mylamstone.com/collections/perfumes",
    cardBg: "bg-[#0A182E]",
    borderColor: "border-[#3A78C4]/50 hover:border-[#68B2FF]",
    chamberBg: "bg-[#0E2242]",
    glowColor: "rgba(74, 144, 226, 0.25)",
    podiumGradient: "from-[#1D406E] via-[#122A4A] to-[#0A182B]",
    notesColor: "text-[#7EC4FF]",
  },
  {
    id: "mayscent",
    name: "Mayscent",
    badge: "☀️ EVERYDAY LUXURY · SIGNATURE",
    tagline: "Sun-Drenched Citrus & Fine Sandalwood",
    olfactiveCategory: "FLORAL CITRUS · ALL DAY · UNISEX",
    notes: "WHITE FLORALS · CRISP CITRUS · SANDALWOOD",
    size: "100 ml / 3.4 FL. OZ.",
    priceInr: "₹499",
    priceAed: "22 AED",
    imageUrl: "/images/lame/mayscent.jpg",
    imageAlt: "Lamé Mayscent Eau De Parfum",
    storeUrl: "https://mylamstone.com/collections/perfumes",
    cardBg: "bg-[#1E1707]",
    borderColor: "border-[#D9A736]/50 hover:border-[#F5CD63]",
    chamberBg: "bg-[#2C210A]",
    glowColor: "rgba(229, 184, 66, 0.25)",
    podiumGradient: "from-[#553E12] via-[#3B2A0A] to-[#201605]",
    notesColor: "text-[#F5CD63]",
  },
];

interface PerfumesProductsSectionProps {
  onSelectProduct?: (productName: string) => void;
}

export default function PerfumesProductsSection({ onSelectProduct }: PerfumesProductsSectionProps) {
  const [perfumes, setPerfumes] = useState<PerfumeItem[]>(SIGNATURE_PERFUMES);
  const [quantities, setQuantities] = useState<Record<string, number>>({
    barqat: 1,
    "blue-mirage": 1,
    mayscent: 1,
  });

  const handleQuantity = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  useEffect(() => {
    fetch("/api/lame-products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          const fragranceProducts = data.products.filter(
            (p: any) =>
              p.category_label?.toLowerCase().includes("fragrance") ||
              p.category_label?.toLowerCase().includes("perfume") ||
              p.name?.toLowerCase().includes("parfum") ||
              p.name?.toLowerCase().includes("scent")
          );

          if (fragranceProducts.length > 0) {
            const merged = SIGNATURE_PERFUMES.map((item) => {
              const match = fragranceProducts.find(
                (p: any) => p.name?.toLowerCase() === item.name.toLowerCase()
              );
              if (match) {
                return {
                  ...item,
                  tagline: match.descriptor || item.tagline,
                  notes: Array.isArray(match.features_json)
                    ? match.features_json.join(" · ").toUpperCase()
                    : item.notes,
                  imageUrl: match.image_url || item.imageUrl,
                  storeUrl: match.store_url || item.storeUrl,
                };
              }
              return item;
            });
            setPerfumes(merged);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section
      id="collection"
      className="relative w-full bg-[#091526] text-[#FAF4EB] py-16 sm:py-20 lg:py-24 px-6 sm:px-10 lg:px-16 overflow-hidden"
    >
      {/* Ambient Sapphire & Amber Highlights */}
      <div
        className="absolute top-1/3 -right-20 w-[450px] h-[450px] rounded-full pointer-events-none blur-[140px] opacity-25"
        style={{
          background: "radial-gradient(circle, #215EA8 0%, #091526 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none blur-[140px] opacity-20"
        style={{
          background: "radial-gradient(circle, #C69A4C 0%, #091526 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Section Header (Inspired by MYOP Best Sellers) */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C69A4C]/15 border border-[#C69A4C]/35 text-[11px] tracking-[0.25em] text-[#F0C366] font-semibold uppercase">
            <Crown className="w-3.5 h-3.5" />
            <span>OUR BEST SELLERS · SIGNATURE FLACONS</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FAF4EB] tracking-tight">
            Curated Haute Parfumerie
          </h2>
          <p className="text-[15px] sm:text-[17px] text-[#D8CDBC] leading-[1.6]">
            Mastercrafted with precious absolutes and aged oils for an intimate, royal sillage.
          </p>
        </div>

        {/* 3 Core Fragrance Cards (Barkat, Mirage, Mayscent) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {perfumes.map((perfume) => {
            const qty = quantities[perfume.id] || 1;
            return (
              <div
                key={perfume.id}
                className={`group relative flex flex-col justify-between rounded-[24px] ${perfume.cardBg} border ${perfume.borderColor} p-6 sm:p-7 shadow-[0_18px_40px_rgba(0,0,0,0.65)] hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(0,0,0,0.85)] transition-all duration-300`}
              >
                <div>
                  {/* Flacon standing on luxury showcase chamber */}
                  <div className={`relative flex flex-col items-center justify-end w-full aspect-[4/5] rounded-[20px] ${perfume.chamberBg} border border-white/5 p-4 mb-5 overflow-hidden`}>
                    {/* Badge Pill (MYOP Style) */}
                    <div className="absolute top-3.5 left-3.5 z-20">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] sm:text-[11px] font-semibold text-[#F5DE9B] tracking-wider uppercase">
                        {perfume.badge}
                      </span>
                    </div>

                    {/* Radial Atmosphere Glow behind flacon */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-60 group-hover:opacity-90 transition-opacity duration-500 -z-0"
                      style={{
                        background: `radial-gradient(circle at 50% 55%, ${perfume.glowColor} 0%, transparent 65%)`,
                      }}
                      aria-hidden="true"
                    />

                    {/* Bottle Image with smooth hover lift */}
                    <div className="relative z-10 w-full h-[76%] flex items-center justify-center transition-transform duration-500 ease-out group-hover:-translate-y-2.5">
                      <Image
                        src={perfume.imageUrl}
                        alt={perfume.imageAlt}
                        fill
                        className="object-contain filter drop-shadow-[0_16px_30px_rgba(0,0,0,0.7)]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>

                    {/* Soft Contact Shadow directly under base */}
                    <div
                      className="w-[62%] h-3.5 rounded-[100%] bg-black/85 blur-[4px] -mt-2 z-10 mx-auto"
                      aria-hidden="true"
                    />

                    {/* Stone Podium / Plinth */}
                    <div
                      className={`relative w-[85%] h-7 rounded-md bg-gradient-to-b ${perfume.podiumGradient} border border-white/15 shadow-[0_12px_24px_rgba(0,0,0,0.6)] -mt-1 z-0 overflow-hidden`}
                      aria-hidden="true"
                    >
                      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-black/80" />
                    </div>
                  </div>

                  {/* Olfactive Tag */}
                  <div className="mb-2">
                    <span className="text-[11px] text-[#E5BA62] uppercase tracking-[0.2em] font-semibold">
                      {perfume.olfactiveCategory}
                    </span>
                  </div>

                  {/* Name in Serif */}
                  <div className="space-y-1">
                    <h3 className="font-serif text-2xl font-bold text-[#FAF4EB] tracking-tight group-hover:text-[#F0C366] transition-colors">
                      {perfume.name}
                    </h3>
                    <p className="text-xs text-[#D8CDBC] font-medium">
                      {perfume.tagline}
                    </p>
                  </div>

                  {/* Fragrance Notes in small tracked caps */}
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className={`text-[11px] tracking-[0.2em] font-semibold ${perfume.notesColor} uppercase leading-relaxed`}>
                      {perfume.notes}
                    </p>
                  </div>

                  {/* Size Display */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-[#F0C366]/40 text-xs font-semibold text-[#FAF4EB]">
                      <Check className="w-3 h-3 text-[#F0C366]" />
                      <span>{perfume.size}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Quantity Stepper, Prices (INR & AED), and Shop on MyLamstone */}
                <div className="mt-5 pt-4 border-t border-white/10 space-y-4">
                  {/* Price Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-2xl text-[#FAF4EB]">
                        {perfume.priceInr}
                      </span>
                      <span className="text-xs font-bold text-[#0A1628] bg-gradient-to-r from-[#F0C366] to-[#E5BA62] px-2.5 py-0.5 rounded-full shadow-[0_2px_8px_rgba(240,195,102,0.3)]">
                        {perfume.priceAed}
                      </span>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center rounded-full bg-black/40 border border-white/15 px-2 py-0.5">
                      <button
                        type="button"
                        onClick={() => handleQuantity(perfume.id, -1)}
                        className="w-5 h-5 flex items-center justify-center text-[#D8CDBC] hover:text-white"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-[#FAF4EB]">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantity(perfume.id, 1)}
                        className="w-5 h-5 flex items-center justify-center text-[#D8CDBC] hover:text-white"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Primary CTA: Shop on MyLamstone */}
                  <a
                    href={perfume.storeUrl || "https://mylamstone.com/collections/perfumes"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold-lift w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-full bg-gradient-to-r from-[#D9A74E] via-[#F0C366] to-[#C69A4C] text-[#0A1628] text-xs sm:text-sm font-bold tracking-wide shadow-[0_6px_22px_rgba(240,195,102,0.35)] hover:shadow-[0_10px_30px_rgba(240,195,102,0.55)] cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 stroke-[2.3]" />
                    <span>Shop on MyLamstone</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.3] transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
