"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import BotanicalLeafWatermark from "@/components/about/BotanicalLeafWatermark";

const DEFAULT_LEADERSHIP = {
  eyebrow_label: "Core Leadership",
  heading: "Rijas Rehman",
  description:
    "We must consider not just the needs of individual patients but also the collective health of our communities.",
  image_url: "/images/about/rijas-rehman.jpg",
  designation: "Founder & Managing Director",
  signature_url: "" as string | null | undefined,
};

const LEADERSHIP_DESKTOP_MASK_STYLE: React.CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0.96) 65%, rgba(0,0,0,0.82) 74%, rgba(0,0,0,0.6) 82%, rgba(0,0,0,0.38) 89%, rgba(0,0,0,0.18) 95%, rgba(0,0,0,0.06) 98%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, transparent 100%)",
  WebkitMaskComposite: "source-in" as any,
  maskImage:
    "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0.96) 65%, rgba(0,0,0,0.82) 74%, rgba(0,0,0,0.6) 82%, rgba(0,0,0,0.38) 89%, rgba(0,0,0,0.18) 95%, rgba(0,0,0,0.06) 98%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, transparent 100%)",
  maskComposite: "intersect" as any,
};

const LEADERSHIP_MOBILE_MASK_STYLE: React.CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)",
  WebkitMaskComposite: "source-in" as any,
  maskImage:
    "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)",
  maskComposite: "intersect" as any,
};

function renderQuoteText(text: string) {
  if (!text) return null;
  const targetPhrase = "collective health of our communities";
  const regex = new RegExp(`(${targetPhrase})`, "i");
  const parts = text.split(regex);
  if (parts.length > 1) {
    return parts.map((part, idx) =>
      part.toLowerCase() === targetPhrase.toLowerCase() ? (
        <span key={idx} className="text-[#B8934A]">
          {part}
        </span>
      ) : (
        <span key={idx}>{part}</span>
      )
    );
  }
  return text;
}

function renderHeadingWithCrossbar(name: string) {
  if (!name) return null;
  return name.split("").map((char, idx) => {
    if (char === "H" || char === "h") {
      return (
        <span key={idx} className="relative inline-block">
          {char}
          <span
            className="absolute left-[18%] right-[18%] top-[48%] h-[2px] bg-[#0F2A4A] pointer-events-none select-none"
            aria-hidden="true"
          />
        </span>
      );
    }
    return char;
  });
}

export default function LeadershipSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [data, setData] = useState(DEFAULT_LEADERSHIP);
  const [portraitSrc, setPortraitSrc] = useState(DEFAULT_LEADERSHIP.image_url);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch("/api/about-page", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.sections)) {
          const row = json.sections.find((s: any) => s.section_key === "leadership");
          if (row) {
            const validImageUrl =
              row.image_url && typeof row.image_url === "string" && row.image_url.trim()
                ? row.image_url.trim()
                : DEFAULT_LEADERSHIP.image_url;

            const signatureUrl =
              (row.extra_data?.signature_url && typeof row.extra_data.signature_url === "string")
                ? row.extra_data.signature_url.trim()
                : (row.signature_url && typeof row.signature_url === "string")
                ? row.signature_url.trim()
                : "";

            setData({
              eyebrow_label: row.eyebrow_label || DEFAULT_LEADERSHIP.eyebrow_label,
              heading: row.heading || DEFAULT_LEADERSHIP.heading,
              description: row.description || DEFAULT_LEADERSHIP.description,
              image_url: validImageUrl,
              designation:
                row.extra_data?.designation || DEFAULT_LEADERSHIP.designation,
              signature_url: signatureUrl,
            });
            setPortraitSrc(validImageUrl);
          }
        }
      } catch {
        // fallback
      }
    }

    loadData();

    const el = sectionRef.current;
    if (!el) return;

    // 1. Immediate check: if section is already within (or near) the viewport on initial load,
    // reveal immediately so content already on screen animates in without requiring any scroll
    const checkInitialVisibility = () => {
      const rect = el.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < windowHeight + 80 && rect.bottom > 0) {
        setIsInView(true);
        return true;
      }
      return false;
    };

    if (checkInitialVisibility()) {
      return;
    }

    // 2. IntersectionObserver for when the section is scrolled into view
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);

    return () => {
      isMounted = false;
      observer.unobserve(el);
    };
  }, []);

  const displayEyebrow = data.eyebrow_label
    ? data.eyebrow_label.replace(/^[—\s-]+/, "")
    : "Core Leadership";

  return (
    <section
      ref={sectionRef}
      id="leadership"
      className="relative overflow-hidden min-h-[700px] lg:min-h-[80vh] bg-[#F6EEDF] flex items-center py-16 lg:py-20 scroll-mt-24"
    >
      {/* 1px gold hairline along section top and bottom edges (rgba(184,147,74,.55)) */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-[rgba(184,147,74,0.55)] pointer-events-none z-20" aria-hidden="true" />
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-[rgba(184,147,74,0.55)] pointer-events-none z-20" aria-hidden="true" />

      {/* Desktop Full-Bleed Portrait on Left Screen Edge (46vw, mask applied directly to image element, no scaled parent mask) */}
      <div className="leadership-desktop-blend hidden lg:block absolute inset-y-0 left-0 w-[46vw] select-none pointer-events-none z-0">
        <div
          className={`relative h-full w-full transition-transform duration-[1200ms] ease-out motion-reduce:transition-none motion-reduce:transform-none ${
            isInView ? "scale-100" : "scale-[1.04]"
          }`}
        >
          <Image
            src={portraitSrc || "/images/about/rijas-rehman.jpg"}
            alt={`${data.heading || "Rijas Rehman"}, ${data.designation || "Founder & Managing Director of Lamstone HealthCare"}`}
            fill
            priority
            unoptimized
            sizes="46vw"
            className="object-cover bg-transparent"
            style={{
              ...LEADERSHIP_DESKTOP_MASK_STYLE,
              objectPosition: "30% 8%",
              filter: "saturate(0.95) contrast(1.05) brightness(1.02) sepia(0.05)",
            }}
            onError={() => {
              if (portraitSrc !== "/images/about/rijas-rehman.jpg") {
                setPortraitSrc("/images/about/rijas-rehman.jpg");
              }
            }}
          />
        </div>
      </div>

      {/* Faint Botanical Leaf Watermark at the right edge */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 pointer-events-none z-0 hidden md:block">
        <BotanicalLeafWatermark opacity={0.08} width={260} height={380} color="#B8934A" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl w-full px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          {/* Mobile Portrait (above quote, full-width with bottom edge fade) */}
          <div className="block lg:hidden w-full mb-2">
            <div
              className="relative w-full h-[380px] sm:h-[440px] select-none bg-transparent"
              style={LEADERSHIP_MOBILE_MASK_STYLE}
            >
              <div
                className={`relative h-full w-full transition-transform duration-[1200ms] ease-out motion-reduce:transition-none motion-reduce:transform-none ${
                  isInView ? "scale-100" : "scale-[1.04]"
                }`}
              >
                <Image
                  src={portraitSrc || "/images/about/rijas-rehman.jpg"}
                  alt={`${data.heading || "Rijas Rehman"}, ${data.designation || "Founder & Managing Director of Lamstone HealthCare"}`}
                  fill
                  priority
                  unoptimized
                  sizes="100vw"
                  className="object-cover bg-transparent"
                  style={{
                    ...LEADERSHIP_MOBILE_MASK_STYLE,
                    objectPosition: "30% 8%",
                    filter: "saturate(0.95) contrast(1.05) brightness(1.02) sepia(0.05)",
                  }}
                  onError={() => {
                    if (portraitSrc !== "/images/about/rijas-rehman.jpg") {
                      setPortraitSrc("/images/about/rijas-rehman.jpg");
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Desktop Left Spacer Column reserving space for the 46vw full-bleed photo */}
          <div className="hidden lg:block lg:col-span-5 min-h-[460px] lg:min-h-[520px] pointer-events-none" aria-hidden="true" />

          {/* Right Column: Editorial Quote & Name Block (starts at ~52vw, vertically centred against photo) */}
          <div className="lg:col-span-7 lg:pl-6 xl:pl-10 relative z-10 flex flex-col justify-center space-y-6 sm:space-y-7">
            {/* Top Eyebrow Label with Gold Thin Lines */}
            <div
              className={`flex items-center gap-2.5 sm:gap-3 transition-all duration-500 ease-out will-change-transform motion-reduce:transition-none motion-reduce:transform-none ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: "90ms" }}
            >
              <span className="h-[1px] w-6 sm:w-10 bg-[#B8934A]/50" />
              <span
                className="text-[14px] sm:text-[15px] uppercase tracking-[0.28em] font-sans font-extrabold text-[#B8934A]"
                style={{ fontSize: "15px", fontWeight: 800 }}
              >
                {displayEyebrow}
              </span>
              <span className="h-[1px] w-6 sm:w-10 bg-[#B8934A]/50" />
            </div>

            {/* Editorial Quote Block with thin vertical line accent to its left */}
            <div className="relative">
              {/* Quote text block (fades up in sequence: delay 180ms) */}
              <div
                className={`relative transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none motion-reduce:transform-none ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "180ms" }}
              >
                {/* Thin vertical gold line: 1.5px wide, gold at 55% opacity, spans full height of quote block */}
                <div
                  className="hidden sm:block absolute -left-[28px] top-1 bottom-1 pointer-events-none select-none"
                  style={{
                    width: "1.5px",
                    backgroundColor: "rgba(184, 147, 74, 0.55)",
                  }}
                  aria-hidden="true"
                />

                {/* Opening quote mark: raised to ~60px with ~10px space below */}
                <span
                  className="block font-serif text-[60px] leading-none text-[#B8934A] select-none pointer-events-none mb-[10px]"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                {/* Quote text: italic serif navy #0F2A4A, line-height 1.5, increased by 6%, max-w 580px, key phrase in gold */}
                <blockquote className="font-serif italic text-[27.5px] sm:text-[29.5px] lg:text-[32.5px] text-[#0F2A4A] leading-[1.5] max-w-[580px] tracking-tight">
                  {renderQuoteText(data.description)}
                  <span
                    className="text-[#B8934A] font-serif not-italic ml-1 inline-block select-none"
                    aria-hidden="true"
                  >
                    &rdquo;
                  </span>
                </blockquote>
              </div>

              {/* Thin gold hairline (about 72px) with small diamond under quote (fades up in sequence: delay 270ms) */}
              <div
                className={`flex items-center gap-1.5 w-[72px] mt-7 sm:mt-8 transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none motion-reduce:transform-none ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "270ms" }}
                aria-hidden="true"
              >
                <span className="flex-1 h-[1px] bg-[#B8934A]/70" />
                <span className="w-1.5 h-1.5 rotate-45 bg-[#B8934A] shrink-0" />
                <span className="flex-1 h-[1px] bg-[#B8934A]/70" />
              </div>

              {/* Name & Title block in quote column below diamond hairline (fades up in sequence: delay 360ms) */}
              <div
                className={`mt-[18px] transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none motion-reduce:transform-none ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "360ms" }}
              >
                {/* Name: plain uppercase style with visible crossbar and 0.1em tracking */}
                <h3
                  className="font-serif text-[1.68rem] font-extrabold text-[#0F2A4A] tracking-[0.1em] leading-tight"
                  style={{
                    fontSize: "1.68rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    fontVariantLigatures: "none",
                    fontFeatureSettings: "normal",
                    fontKerning: "normal",
                  }}
                >
                  {renderHeadingWithCrossbar(data.heading)}
                </h3>
                <p
                  className="mt-[8px] font-sans text-[0.9rem] uppercase tracking-[0.24em] font-extrabold text-[#B8934A] leading-none"
                  style={{ fontSize: "0.9rem", fontWeight: 800 }}
                >
                  {data.designation}
                </p>

                {/* Signature area: reserve space (about 140px × 56px) if uploaded in admin panel; if none uploaded, show nothing and leave no gap */}
                {data.signature_url && data.signature_url.trim() ? (
                  <div className="mt-3.5 relative w-[140px] h-[56px] select-none pointer-events-none">
                    <Image
                      src={data.signature_url.trim()}
                      alt={`${data.heading} signature`}
                      fill
                      unoptimized
                      className="object-contain object-left"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
