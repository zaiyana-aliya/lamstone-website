"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import MotionReveal from "@/components/MotionReveal";
import FormModal from "@/components/modals/FormModal";

export interface InvestPathwaysData {
  eyebrow_label?: string | null;
  heading: string;
  description: string;
  image_url?: string | null;
  primary_cta_label?: string | null;
  primary_cta_url?: string | null;
  extra_data?: {
    bullet_points?: string[];
  };
  is_active?: boolean;
}

const DEFAULT_BULLETS = [
  "Strategic pharmacy acquisition",
  "Brand distribution equity",
  "Lamé co-branding opportunities",
];

const DEFAULT_PATHWAYS_DATA: InvestPathwaysData = {
  eyebrow_label: "Partnership Model",
  heading: "Transparent & Structured Investment Pathways",
  description:
    "We believe that informed investors are long-term partners. Our investor relations team provides clear financial projections, regular reporting, and direct access to operations leadership.",
  image_url:
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
  primary_cta_label: "Request Partnership Details",
  primary_cta_url: "modal:partnership",
  extra_data: {
    bullet_points: DEFAULT_BULLETS,
  },
  is_active: true,
};

export default function InvestPathwaysSection() {
  const [data, setData] = useState<InvestPathwaysData>(DEFAULT_PATHWAYS_DATA);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch("/api/invest-page", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.sections)) {
          const row = json.sections.find((s: any) => s.section_key === "pathways");
          if (row) {
            setData({
              eyebrow_label: row.eyebrow_label || DEFAULT_PATHWAYS_DATA.eyebrow_label,
              heading: row.heading || DEFAULT_PATHWAYS_DATA.heading,
              description: row.description || DEFAULT_PATHWAYS_DATA.description,
              image_url: row.image_url || DEFAULT_PATHWAYS_DATA.image_url,
              primary_cta_label: row.primary_cta_label || DEFAULT_PATHWAYS_DATA.primary_cta_label,
              primary_cta_url: row.primary_cta_url || DEFAULT_PATHWAYS_DATA.primary_cta_url,
              extra_data: {
                bullet_points:
                  Array.isArray(row.extra_data?.bullet_points) && row.extra_data.bullet_points.length > 0
                    ? row.extra_data.bullet_points
                    : DEFAULT_BULLETS,
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

  const bullets = data.extra_data?.bullet_points || DEFAULT_BULLETS;

  return (
    <>
      <section className="relative overflow-hidden bg-[#0F2A4A] py-20 sm:py-28 lg:py-32 min-h-[580px] lg:min-h-[640px] xl:min-h-[680px] flex items-center border-t border-[#0F2A4A]/20 border-b border-[#0F2A4A]/20">
        {/* Desktop Full-Bleed Photo Blend spanning right window edge with seamless left mask */}
        <div
          className="hidden lg:block absolute inset-y-0 right-0 w-[48%] xl:w-[47%] 2xl:w-[48%] pointer-events-none select-none z-0"
          style={{
            WebkitMaskImage:
              "linear-gradient(to left, #000 0%, #000 55%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)",
            WebkitMaskComposite: "source-in",
            maskImage:
              "linear-gradient(to left, #000 0%, #000 55%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)",
            maskComposite: "intersect",
          }}
        >
          <div className="relative h-full w-full">
            <Image
              src={data.image_url || "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85"}
              alt="Modern architectural executive workspace and strategic boardroom"
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover object-center"
              style={{ filter: "saturate(0.95) contrast(1.05) brightness(0.95)" }}
            />
            {/* Blend mask overlay with navy background */}
            <div className="absolute inset-0 bg-[#0F2A4A]/30 mix-blend-multiply" />
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column: Narrative Copy & Bullets */}
            <div className="lg:col-span-7 xl:col-span-6 space-y-6">
              <MotionReveal delay={100} direction="right">
                <div className="space-y-6">
                  {data.eyebrow_label && (
                    <div className="flex items-center gap-2.5">
                      <span className="h-[3.5px] w-8 bg-[#B8934A] rounded-full" />
                      <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-bold text-[#F0D9A0] font-sans">
                        {data.eyebrow_label}
                      </span>
                    </div>
                  )}
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight">
                    {data.heading}
                  </h2>
                  <div className="h-[2px] w-20 bg-[#B8934A] rounded-full" />
                  <p className="text-base sm:text-lg text-white/90 font-light leading-relaxed whitespace-pre-line">
                    {data.description}
                  </p>
                  <div className="space-y-3 pt-2">
                    {bullets.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm sm:text-base text-white/90">
                        <span className="h-2 w-2 rounded-full bg-[#B8934A] shrink-0" />
                        <span className="font-light">{item}</span>
                      </div>
                    ))}
                  </div>
                  {data.primary_cta_label && (
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B8934A] hover:bg-[#A37F38] text-[#0F2A4A] px-7 py-3.5 text-sm font-semibold tracking-wide shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                      >
                        <span>{data.primary_cta_label}</span>
                      </button>
                    </div>
                  )}
                </div>
              </MotionReveal>
            </div>

            {/* Mobile/Tablet Fallback Photo (hidden on lg, with fade on bottom edge) */}
            <div className="block lg:hidden w-full pt-4 sm:pt-6">
              <div
                className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-2xl shadow-xl"
              >
                <div className="relative h-full w-full">
                  <Image
                    src={data.image_url || "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85"}
                    alt="Modern architectural executive workspace and strategic boardroom"
                    fill
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-[#0F2A4A]/25" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Partnership Details"
        subtitle="Connect regarding structured co-investment, retail acquisition, or co-branding."
        badge="Strategic Partnership"
        apiEndpoint="/api/invest"
        extraPayload={{ request_type: "opportunity_inquiry", opportunity_name: "Strategic Partnership Details" }}
        fields={[
          { name: "name", label: "Full Name", required: true, placeholder: "Your full name" },
          { name: "email", label: "Email Address", type: "email", required: true, placeholder: "you@email.com" },
          { name: "phone", label: "Phone Number", type: "tel", required: true, placeholder: "+91 XXXXX XXXXX" },
          {
            name: "message",
            label: "Partnership Objectives",
            required: true,
            rows: 3,
            placeholder: "Describe the nature of partnership you are interested in exploring…",
          },
        ]}
        successMessage="Thank you. Our corporate strategy team will contact you shortly with the partnership prospectus."
      />
    </>
  );
}
