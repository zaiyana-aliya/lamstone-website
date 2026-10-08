"use client";

import { useEffect, useState } from "react";
import MotionReveal from "@/components/MotionReveal";

export interface CosmeticsVisualBandData {
  heading: string;
  is_active?: boolean;
}

const DEFAULT_BAND_DATA: CosmeticsVisualBandData = {
  heading: "9+ Global Brands, One Trusted Distributor",
  is_active: true,
};

export default function CosmeticsVisualBand() {
  const [data, setData] = useState<CosmeticsVisualBandData>(DEFAULT_BAND_DATA);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch("/api/cosmetics-page", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.sections)) {
          const row = json.sections.find((s: any) => s.section_key === "visual_band");
          if (row) {
            setData({
              heading: row.heading || DEFAULT_BAND_DATA.heading,
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
    <section className="relative w-full overflow-hidden bg-[#EAEFF5] py-16 sm:py-20 lg:py-24 select-none border-y border-[#0F2A4A]/10">
      <div className="relative z-10 mx-auto max-w-5xl w-full px-6 sm:px-8 lg:px-12 text-center">
        <MotionReveal direction="up">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0F2A4A] tracking-tight leading-tight">
              {data.heading}
            </h2>

            {/* Gold ornamental underline with center dot */}
            <div className="flex items-center justify-center gap-1.5 pt-2" aria-hidden="true">
              <span className="w-16 sm:w-20 h-[1.5px] bg-[#B8934A]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8934A]" />
              <span className="w-16 sm:w-20 h-[1.5px] bg-[#B8934A]" />
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
