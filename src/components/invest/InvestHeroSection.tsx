"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MotionReveal from "@/components/MotionReveal";
import FormModal from "@/components/modals/FormModal";
import { ArrowRight } from "lucide-react";

export interface InvestHeroData {
  eyebrow_label?: string | null;
  heading: string;
  description: string;
  image_url?: string | null;
  primary_cta_label?: string | null;
  primary_cta_url?: string | null;
  secondary_cta_label?: string | null;
  secondary_cta_url?: string | null;
  extra_data?: {
    subheading?: string;
    secondary_description?: string;
  };
  is_active?: boolean;
}

const DEFAULT_HERO_DATA: InvestHeroData = {
  eyebrow_label: "Partnership Opportunities",
  heading: "Invest in\nLamstone",
  description:
    "Join our rapidly expanding pharmacy chain and beauty ecosystem.\n\nWe offer transparent, secure, and lucrative partnership models for forward-thinking investors seeking defensive, high-growth healthcare ventures.",
  image_url: "/images/invest/invest-corporate-skyline-clean.jpg",
  primary_cta_label: "Request Investment Deck",
  primary_cta_url: "modal:deck",
  secondary_cta_label: "Why Lamstone",
  secondary_cta_url: "#why-invest",
  extra_data: {
    subheading: "Join our rapidly expanding pharmacy chain and beauty ecosystem.",
    secondary_description:
      "We offer transparent, secure, and lucrative partnership models for forward-thinking investors seeking defensive, high-growth healthcare ventures.",
  },
  is_active: true,
};

export default function InvestHeroSection() {
  const [data, setData] = useState<InvestHeroData>(DEFAULT_HERO_DATA);
  const [deckModalOpen, setDeckModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch("/api/invest-page", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.sections)) {
          const row = json.sections.find((s: any) => s.section_key === "hero");
          if (row) {
            setData({
              eyebrow_label: row.eyebrow_label || DEFAULT_HERO_DATA.eyebrow_label,
              heading: row.heading || DEFAULT_HERO_DATA.heading,
              description: row.description || DEFAULT_HERO_DATA.description,
              image_url: row.image_url || DEFAULT_HERO_DATA.image_url,
              primary_cta_label: row.primary_cta_label || DEFAULT_HERO_DATA.primary_cta_label,
              primary_cta_url: row.primary_cta_url || DEFAULT_HERO_DATA.primary_cta_url,
              secondary_cta_label: row.secondary_cta_label || DEFAULT_HERO_DATA.secondary_cta_label,
              secondary_cta_url: row.secondary_cta_url || DEFAULT_HERO_DATA.secondary_cta_url,
              extra_data: {
                ...DEFAULT_HERO_DATA.extra_data,
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

  const paragraphs = (data.description || "").split("\n\n").filter(Boolean);
  const subheading =
    data.extra_data?.subheading ||
    paragraphs[0] ||
    "Join our rapidly expanding pharmacy chain and beauty ecosystem.";
  const secondaryDesc =
    data.extra_data?.secondary_description ||
    (paragraphs.length > 1 ? paragraphs.slice(1).join("\n\n") : "") ||
    "We offer transparent, secure, and lucrative partnership models for forward-thinking investors seeking defensive, high-growth healthcare ventures.";

  const headingLines = (data.heading || "Invest in\nLamstone").split("\n");

  return (
    <>
      <section className="relative w-full overflow-hidden bg-[#F1E2CC] min-h-[540px] lg:min-h-[calc(100vh-80px)] lg:max-h-[880px] flex items-center">

        {/* Background Photo with Left Edge Fade into Sand (#F1E2CC) */}
        <div
          className="absolute inset-y-0 right-0 w-full lg:w-[64%] xl:w-[60%] 2xl:w-[56%] z-0 select-none overflow-hidden"
          style={{
            WebkitMaskImage:
              "linear-gradient(to left, #000 0%, #000 38%, rgba(0,0,0,0.85) 52%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.2) 84%, transparent 100%)",
            maskImage:
              "linear-gradient(to left, #000 0%, #000 38%, rgba(0,0,0,0.85) 52%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.2) 84%, transparent 100%)",
          }}
        >
          <Image
            src={data.image_url || "/images/invest/invest-corporate-skyline-clean.jpg"}
            alt="Modern corporate glass architectural headquarters representing sustainable healthcare investment growth"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover object-[center_35%] contrast-[1.02] saturate-[1.04]"
          />

          {/* Mobile-only soft backdrop readability wash in sand */}
          <div className="block lg:hidden absolute inset-0 bg-[#F1E2CC]/90 backdrop-blur-[2px] pointer-events-none z-3" />
        </div>

        {/* Bottom seam blend */}
        <div
          className="pointer-events-none absolute bottom-0 inset-x-0 h-8 sm:h-12 bg-gradient-to-t from-[#F1E2CC] via-[#F1E2CC]/40 to-transparent z-10"
          aria-hidden="true"
        />

        {/* Foreground Content Container */}
        <div className="relative z-10 w-full pl-6 sm:pl-8 lg:pl-10 xl:pl-12 pr-6 sm:pr-8 lg:pr-12 py-16 sm:py-20 lg:py-22 xl:py-24">
          <div className="max-w-md lg:max-w-[480px] xl:max-w-[580px] space-y-6 sm:space-y-7">
            {/* Eyebrow Label: Gold with thin lines */}
            {data.eyebrow_label && (
              <MotionReveal delay={80} direction="up">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span className="h-[1px] w-6 sm:w-10 bg-[#B8934A]/50" />
                  <span className="text-xs sm:text-[12.5px] uppercase tracking-[0.28em] font-sans font-semibold text-[#B8934A]">
                    {data.eyebrow_label}
                  </span>
                  <span className="h-[1px] w-6 sm:w-10 bg-[#B8934A]/50" />
                </div>
              </MotionReveal>
            )}

            {/* Main Headline */}
            <MotionReveal delay={180} direction="up">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[54px] xl:text-[58px] font-bold tracking-tight text-[#0F2A4A] leading-[1.10]">
                {headingLines.map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    {idx < headingLines.length - 1 && (
                      <>
                        <br className="hidden sm:inline" />
                        <span className="sm:hidden"> </span>
                      </>
                    )}
                  </React.Fragment>
                ))}
              </h1>
              {/* Thin gold hairline with a small dot beneath the heading */}
              <div className="flex items-center gap-1.5 mt-3 sm:mt-3.5" aria-hidden="true">
                <span className="w-14 sm:w-16 h-[1.5px] bg-[#B8934A]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8934A]" />
              </div>
            </MotionReveal>

            {/* Two-tier paragraph copy */}
            {subheading && (
              <MotionReveal delay={280} direction="up">
                <p className="font-serif text-base sm:text-[18px] text-[#0F2A4A] leading-[1.65] font-normal pt-0.5">
                  {subheading}
                </p>
              </MotionReveal>
            )}

            {secondaryDesc && (
              <MotionReveal delay={360} direction="up">
                <p className="text-xs sm:text-sm text-[#243E5E] leading-[1.75] font-normal">
                  {secondaryDesc}
                </p>
              </MotionReveal>
            )}

            {/* Primary & Secondary Action Buttons */}
            <MotionReveal delay={460} direction="up">
              <div className="pt-8 sm:pt-10 flex flex-wrap items-center gap-3.5">
                {data.primary_cta_label && (
                  data.primary_cta_url?.startsWith("modal:") || !data.primary_cta_url?.startsWith("/") ? (
                    <button
                      type="button"
                      onClick={() => setDeckModalOpen(true)}
                      className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#0F2A4A] hover:bg-[#173A6B] text-white px-7 py-3.5 text-xs sm:text-sm font-semibold tracking-wide shadow-[0_4px_16px_rgba(15,42,74,0.22)] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
                    >
                      <span>{data.primary_cta_label}</span>
                      <ArrowRight className="h-4 w-4 text-[#B8934A] transition-transform duration-300 ease-out group-hover:translate-x-1" />
                    </button>
                  ) : (
                    <Link
                      href={data.primary_cta_url}
                      className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#0F2A4A] hover:bg-[#173A6B] text-white px-7 py-3.5 text-xs sm:text-sm font-semibold tracking-wide shadow-[0_4px_16px_rgba(15,42,74,0.22)] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
                    >
                      <span>{data.primary_cta_label}</span>
                      <ArrowRight className="h-4 w-4 text-[#B8934A] transition-transform duration-300 ease-out group-hover:translate-x-1" />
                    </Link>
                  )
                )}

                {data.secondary_cta_label && (
                  <Link
                    href={data.secondary_cta_url || "#why-invest"}
                    className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#0F2A4A] text-[#0F2A4A] hover:bg-[#0F2A4A] hover:text-white bg-transparent px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wide shadow-xs hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  >
                    <span>{data.secondary_cta_label}</span>
                  </Link>
                )}
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* Deck Request Modal */}
      <FormModal
        isOpen={deckModalOpen}
        onClose={() => setDeckModalOpen(false)}
        title="Request Investment Deck"
        subtitle="Receive our comprehensive investor deck and company financial performance prospectus."
        badge="Investor Relations"
        apiEndpoint="/api/invest"
        extraPayload={{ request_type: "deck" }}
        fields={[
          { name: "name", label: "Full Name", required: true, placeholder: "Your full name" },
          { name: "email", label: "Corporate / Personal Email", type: "email", required: true, placeholder: "you@email.com" },
          { name: "phone", label: "Phone Number", type: "tel", required: true, placeholder: "+91 XXXXX XXXXX" },
          {
            name: "message",
            label: "Investment Profile / Background",
            required: true,
            rows: 3,
            placeholder: "Please outline your investment focus or questions for our investor relations team…",
          },
        ]}
        successMessage="Your investment deck request has been dispatched to our Investor Relations desk. You will receive the document within 24 hours."
      />
    </>
  );
}
