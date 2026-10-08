"use client";

import React, { useEffect, useState } from "react";
import FullWidthPhotoBand from "@/components/FullWidthPhotoBand";

interface PhotoBandData {
  eyebrow_label?: string;
  heading: string;
  description?: string;
  image_url: string;
  is_active: boolean;
}

const DEFAULT_PHOTO_BAND: PhotoBandData = {
  eyebrow_label: "INTEGRATED CARE",
  heading: "One Ecosystem. Pharmacy, Beauty, and Wellness — Built on Trust.",
  description: "",
  image_url: "/images/careers/careers-team-collaborating.jpg",
  is_active: true,
};

export default function HomePhotoBand() {
  const [data, setData] = useState<PhotoBandData>(DEFAULT_PHOTO_BAND);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetch("/api/home-promo-sections", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.sections)) {
          const row = json.sections.find((s: any) => s.section_key === "photo_band");
          if (row) {
            setData({
              eyebrow_label: row.eyebrow_label ?? DEFAULT_PHOTO_BAND.eyebrow_label,
              heading: row.heading || DEFAULT_PHOTO_BAND.heading,
              description: row.description || DEFAULT_PHOTO_BAND.description,
              image_url: row.image_url || DEFAULT_PHOTO_BAND.image_url,
              is_active: row.is_active ?? true,
            });
          }
        }
      } catch {
        // keep fallback
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!data.is_active) return null;

  return (
    <FullWidthPhotoBand
      imageUrl={data.image_url}
      imageAlt={data.heading}
      eyebrow={data.eyebrow_label}
      headline={data.heading}
      subheadline={data.description}
      overlayClass="bg-gradient-to-r from-[#071224]/88 via-[#0E2244]/82 to-[#071224]/88"
      objectPosition="center 35%"
    />
  );
}
