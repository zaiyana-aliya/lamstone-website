"use client";

import { useEffect, useState } from "react";
import FullWidthPhotoBand from "@/components/FullWidthPhotoBand";

export interface AboutPhotoBandData {
  eyebrow_label?: string | null;
  heading: string;
  description: string;
  image_url?: string | null;
  extra_data?: {
    object_position?: string;
    subheadline?: string;
  };
  is_active?: boolean;
}

const DEFAULT_PHOTO_BAND_DATA: AboutPhotoBandData = {
  eyebrow_label: "",
  heading: "A Growing Healthcare Ecosystem Since 2019",
  description: "Modern Lamstone Healthcare corporate headquarters and clinical campus",
  image_url: "/images/about/lamstone-healthcare-headquarters.jpg",
  extra_data: {
    object_position: "center 35%",
    subheadline: "",
  },
  is_active: true,
};

export default function AboutPhotoBandSection() {
  const [data, setData] = useState<AboutPhotoBandData>(DEFAULT_PHOTO_BAND_DATA);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch("/api/about-page", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.sections)) {
          const row = json.sections.find((s: any) => s.section_key === "photo_band");
          if (row) {
            setData({
              eyebrow_label: row.eyebrow_label || "",
              heading: row.heading || DEFAULT_PHOTO_BAND_DATA.heading,
              description: row.description || DEFAULT_PHOTO_BAND_DATA.description,
              image_url: row.image_url || DEFAULT_PHOTO_BAND_DATA.image_url,
              extra_data: {
                ...DEFAULT_PHOTO_BAND_DATA.extra_data,
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

  return (
    <FullWidthPhotoBand
      imageUrl={data.image_url || DEFAULT_PHOTO_BAND_DATA.image_url!}
      imageAlt={data.description || DEFAULT_PHOTO_BAND_DATA.description}
      eyebrow={data.eyebrow_label && data.eyebrow_label.trim() ? data.eyebrow_label : undefined}
      headline={data.heading}
      subheadline={data.extra_data?.subheadline || undefined}
      overlayClass="bg-[linear-gradient(to_right,rgba(15,42,74,0.80)_0%,rgba(15,42,74,0.80)_55%,rgba(15,42,74,0.25)_100%)]"
      objectPosition={data.extra_data?.object_position || "center 35%"}
      accentColor="bg-[#B8934A]"
      accentTextColor="text-[#B8934A]"
      headlineColor="text-white [text-shadow:0_2px_12px_rgba(10,31,61,0.5)]"
      subheadlineColor="text-white/85"
      ornamentalDividerWidth="w-16 sm:w-20"
      contentPaddingClass="py-12 sm:py-16"
      minHeightClass="min-h-[420px] h-[60vh] lg:h-[65vh]"
      textAlign="left"
      contentContainerClass="relative z-10 mx-auto max-w-6xl w-full px-8 sm:px-14 lg:px-20 xl:px-28 py-12 sm:py-16 text-left"
      className="border-t border-[#0F2A4A]/20"
    />
  );
}
