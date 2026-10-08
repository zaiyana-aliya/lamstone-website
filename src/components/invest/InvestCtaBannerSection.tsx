"use client";

import React, { useEffect, useState } from "react";
import MotionReveal from "@/components/MotionReveal";
import FormModal from "@/components/modals/FormModal";

export interface InvestCtaBannerData {
  eyebrow_label?: string | null;
  heading: string;
  description: string;
  primary_cta_label?: string | null;
  primary_cta_url?: string | null;
  is_active?: boolean;
}

const DEFAULT_CTA_DATA: InvestCtaBannerData = {
  heading: "Ready to Grow With Lamstone?",
  description:
    "Connect with our leadership to explore structured investment, strategic co-branding, or network partnerships.",
  primary_cta_label: "Request Information Memorandum",
  primary_cta_url: "modal:memorandum",
  is_active: true,
};

export default function InvestCtaBannerSection() {
  const [data, setData] = useState<InvestCtaBannerData>(DEFAULT_CTA_DATA);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch("/api/invest-page", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.sections)) {
          const row = json.sections.find((s: any) => s.section_key === "cta_banner");
          if (row) {
            setData({
              eyebrow_label: row.eyebrow_label,
              heading: row.heading || DEFAULT_CTA_DATA.heading,
              description: row.description || DEFAULT_CTA_DATA.description,
              primary_cta_label: row.primary_cta_label || DEFAULT_CTA_DATA.primary_cta_label,
              primary_cta_url: row.primary_cta_url || DEFAULT_CTA_DATA.primary_cta_url,
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
    <>
      <section className="relative bg-[#F1E2CC] py-20 sm:py-24 text-center overflow-hidden border-t border-[#0F2A4A]/10">
        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl space-y-6">
            <MotionReveal direction="up">
              {data.eyebrow_label && (
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="h-[1px] w-8 sm:w-10 bg-[#B8934A]" />
                  <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-bold text-[#B8934A] font-sans">
                    {data.eyebrow_label}
                  </span>
                  <span className="h-[1px] w-8 sm:w-10 bg-[#B8934A]" />
                </div>
              )}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F2A4A] tracking-tight">
                {data.heading}
              </h2>
              <div className="flex items-center justify-center gap-2 pt-1 pb-1">
                <span className="h-[1px] w-12 bg-[#B8934A]/50" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#B8934A]" />
                <span className="h-[1px] w-12 bg-[#B8934A]/50" />
              </div>
              <p className="text-base sm:text-lg text-[#243E5E] font-normal leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
                {data.description}
              </p>
              {data.primary_cta_label && (
                <div className="pt-4 flex flex-wrap justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-[#0F2A4A] hover:bg-[#173A6B] text-white px-8 py-4 text-xs sm:text-[13px] font-sans font-semibold uppercase tracking-[0.16em] shadow-[0_4px_16px_rgba(15,42,74,0.18)] hover:shadow-[0_8px_24px_rgba(15,42,74,0.28)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                  >
                    <span>{data.primary_cta_label}</span>
                  </button>
                </div>
              )}
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* Memorandum Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Information Memorandum"
        subtitle="Request the detailed Information Memorandum covering corporate governance, asset holdings, and projected unit economics."
        badge="Confidential Prospectus"
        apiEndpoint="/api/invest"
        extraPayload={{ request_type: "memorandum" }}
        fields={[
          { name: "name", label: "Full Name", required: true, placeholder: "Your full name" },
          { name: "email", label: "Email Address", type: "email", required: true, placeholder: "you@email.com" },
          { name: "phone", label: "Phone Number", type: "tel", required: true, placeholder: "+91 XXXXX XXXXX" },
          {
            name: "message",
            label: "Entity / Entity Details",
            required: true,
            rows: 3,
            placeholder: "Family office, institutional, or private high-net-worth investor profile…",
          },
        ]}
        successMessage="Thank you. Our investor relations director will review your request and dispatch the Information Memorandum under NDA."
      />
    </>
  );
}
