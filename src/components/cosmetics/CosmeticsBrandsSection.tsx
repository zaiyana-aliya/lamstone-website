"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import MotionReveal from "@/components/MotionReveal";

interface BrandItem {
  name: string;
  tag: string;
  logo: string;
}

const DEFAULT_BRANDS: BrandItem[] = [
  { name: "Lotus", tag: "Botanical & Natural", logo: "/images/brands/lotus.png" },
  { name: "Mamaearth", tag: "Toxin-Free Beauty", logo: "/images/brands/mamaearth.png" },
  { name: "Ponds", tag: "Classic Skincare", logo: "/images/brands/ponds.png" },
  { name: "Cetaphil", tag: "Dermatologist Recommended", logo: "/images/brands/cetaphil.png" },
  { name: "Lakmé", tag: "Iconic Color & Care", logo: "/images/brands/lakme.jpg" },
  { name: "Dove", tag: "Nourishing Care", logo: "/images/brands/dove.png" },
  { name: "Jovees", tag: "Herbal Formulations", logo: "/images/brands/jovees.jpg" },
  { name: "Sebamed", tag: "pH 5.5 Clinical Skincare", logo: "/images/brands/sebamed.jpg" },
  { name: "Femisafe", tag: "Intimate & Personal Wellness", logo: "/images/brands/femisafe.jpg" },
];

export default function CosmeticsBrandsSection() {
  const [brands, setBrands] = useState<BrandItem[]>(DEFAULT_BRANDS);

  useEffect(() => {
    fetch("/api/brand-partners?type=cosmetics")
      .then((res) => res.json())
      .then((data) => {
        if (data.partners && data.partners.length > 0) {
          setBrands(
            data.partners.map((p: any) => ({
              name: p.name,
              tag: p.category_label || "Brand Partner",
              logo: p.logo_url || "",
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-6 items-stretch">
      {brands.map((brand, i) => (
        <MotionReveal key={brand.name || i} delay={i * 70} direction="up" className="h-full">
          <div className="group relative flex flex-col items-center justify-between h-full min-h-[230px] sm:min-h-[245px] lg:min-h-[255px] rounded-[20px] bg-white pt-8 sm:pt-9 lg:pt-10 pb-7 sm:pb-8 px-5 sm:px-6 text-center border border-[rgba(184,147,74,0.30)] hover:border-[rgba(184,147,74,0.70)] shadow-[0_1px_2px_rgba(15,42,74,0.04),0_12px_28px_-8px_rgba(15,42,74,0.12)] hover:shadow-[0_4px_8px_rgba(15,42,74,0.06),0_20px_40px_-8px_rgba(15,42,74,0.20)] hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-default overflow-hidden">
            {/* Thin gold top accent border */}
            <div className="absolute top-0 left-0 w-10 group-hover:w-full h-[3px] bg-[#B8934A] rounded-full transition-all duration-300 ease-out z-20" />

            {/* Fixed-size logo container (88-96px desktop, 74-80px mobile/tablet, up to 70-75% card width) */}
            <div className="relative z-10 h-[76px] sm:h-[84px] lg:h-[96px] w-[78%] max-w-[275px] flex items-center justify-center">
              {brand.logo ? (
                <div
                  className={`relative w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
                    brand.name.toLowerCase().includes("mamaearth")
                      ? "scale-[1.38]"
                      : brand.name.toLowerCase().includes("lotus")
                      ? "scale-[1.20]"
                      : brand.name.toLowerCase().includes("ponds")
                      ? "scale-[1.12]"
                      : brand.name.toLowerCase().includes("dove")
                      ? "scale-[0.86]"
                      : brand.name.toLowerCase().includes("sebamed")
                      ? "scale-[0.88]"
                      : ""
                  }`}
                >
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    fill
                    sizes="(max-width: 640px) 180px, (max-width: 1024px) 220px, 275px"
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="h-8" />
              )}
            </div>

            {/* Brand text metadata (20-24px below logo) */}
            <div className="relative z-10 mt-5 sm:mt-6 text-center">
              <span className="font-serif text-lg sm:text-[19px] font-bold tracking-tight text-[#0F2A4A] group-hover:text-[#B8934A] transition-colors block leading-snug">
                {brand.name}
              </span>
              <span className="text-[11px] sm:text-[11.5px] uppercase tracking-wider text-[#0F2A4A]/60 font-sans font-medium block mt-1">
                {brand.tag}
              </span>
            </div>
          </div>
        </MotionReveal>
      ))}
    </div>
  );
}
