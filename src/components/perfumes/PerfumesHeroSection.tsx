"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles, ShoppingBag } from "lucide-react";

interface PerfumesHeroSectionProps {
  onShopNow?: () => void;
  onEnquire?: () => void;
}

export default function PerfumesHeroSection({ onShopNow, onEnquire }: PerfumesHeroSectionProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setRotate({
      x: -y * 12, // tilt X up to 6 deg
      y: x * 15,  // tilt Y up to 7.5 deg
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const scrollToCollection = () => {
    const el = document.getElementById("collection");
    if (el) {
      const headerOffset = 76;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full bg-[#0A1628] text-[#FAF4EB] overflow-hidden min-h-[calc(100vh-76px)] lg:h-[calc(100vh-76px)] max-h-[920px] flex items-center justify-center py-12 lg:py-0 px-6 sm:px-10 lg:px-16 select-none"
    >
      {/* Ambient Jewel Color Blooms (Sapphire & Amber Gold) */}
      <div
        className="absolute -top-32 -left-32 w-[580px] h-[580px] rounded-full pointer-events-none blur-[140px] opacity-45"
        style={{
          background: "radial-gradient(circle, #184888 0%, #0A1628 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 right-0 lg:right-24 w-[600px] h-[600px] rounded-full pointer-events-none blur-[150px] opacity-35"
        style={{
          background: "radial-gradient(circle, #C69A4C 0%, #0A1628 75%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Eyebrow, serif headline, attributes, copy, and CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            {/* Small "Now Available" radiant gold badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#C69A4C]/20 via-[#F0C366]/15 to-[#C69A4C]/20 border border-[#F0C366]/40 text-[#F5DE9B] text-[11px] sm:text-xs font-semibold tracking-wider uppercase shadow-[0_2px_14px_rgba(198,154,76,0.25)]">
              <span className="w-2 h-2 rounded-full bg-[#F0C366] shadow-[0_0_8px_#F0C366] animate-pulse" />
              <span>Now Available · Complimentary Worldwide Delivery</span>
            </div>

            {/* Eyebrow with gold ornamental rules */}
            <div className="flex items-center gap-3">
              <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#E5BA62]" />
              <p className="text-xs sm:text-sm tracking-[0.3em] text-[#E5BA62] font-semibold uppercase font-sans">
                LAMÉ HAUTE PARFUMERIE · DUBAI
              </p>
              <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#E5BA62]" />
            </div>

            {/* Headline in elegant serif with metallic gold gradient */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-bold text-[#FAF4EB] leading-[1.08] tracking-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)]">
              Haute Parfumerie of{" "}
              <span className="bg-gradient-to-r from-[#FFF0C2] via-[#E5BA62] to-[#C69A4C] bg-clip-text text-transparent drop-shadow-[0_2px_14px_rgba(240,195,102,0.35)]">
                Enduring Elegance
              </span>
            </h1>

            {/* Concise copy */}
            <p className="text-[16px] sm:text-[18px] text-[#D8CDBC] max-w-xl font-normal leading-[1.7]">
              Mastercrafted with rare Cambodian oud, golden amber, and noble botanical essences for an intimate, regal sillage.
            </p>

            {/* CTAs: Shop Now (primary) + Explore Collection (secondary) */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6">
              <a
                href="#collection"
                onClick={(e) => {
                  e.preventDefault();
                  if (onShopNow) onShopNow();
                  else scrollToCollection();
                }}
                className="btn-gold-lift inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D9A74E] via-[#F0C366] to-[#C69A4C] text-[#0A1628] text-sm sm:text-[15px] font-bold tracking-wide shadow-[0_8px_28px_rgba(240,195,102,0.45)] hover:shadow-[0_12px_36px_rgba(240,195,102,0.65)] cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.3]" />
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </a>

              <button
                type="button"
                onClick={scrollToCollection}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-[#F0C366]/40 hover:border-[#F0C366] text-sm sm:text-[15px] font-semibold text-[#FAF4EB] hover:text-[#F0C366] transition-all duration-300 cursor-pointer"
              >
                <span>Explore Collection</span>
                <span className="text-[#F0C366] transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>

          {/* Right Column: Motion Graphic Haute Perfumerie Stage */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative w-full pt-4 lg:pt-0">
            {/* Soft Seamless Golden Ambient Backlight (with mouse parallax shift) */}
            <div
              className="absolute w-[360px] h-[440px] pointer-events-none blur-[95px] opacity-45 -z-10 transition-transform duration-700 ease-out"
              style={{
                background: "radial-gradient(ellipse at center, #F0C366 0%, #C69A4C 40%, transparent 70%)",
                transform: `translate(${rotate.y * -1.8}px, ${rotate.x * -1.8}px)`,
              }}
              aria-hidden="true"
            />

            {/* Floating Golden Fragrance Droplet Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-5">
              <span className="absolute top-[60%] left-[22%] w-2 h-2 rounded-full bg-[#F0C366] blur-[0.5px] animate-particle-1" />
              <span className="absolute top-[68%] right-[20%] w-2.5 h-2.5 rounded-full bg-[#FFE29A] blur-[0.8px] animate-particle-2" />
              <span className="absolute top-[50%] left-[16%] w-1.5 h-1.5 rounded-full bg-[#E5BA62] animate-particle-3" />
              <span className="absolute top-[58%] right-[26%] w-2 h-2 rounded-full bg-[#F0C366] blur-[0.5px] animate-particle-4" />
              <span className="absolute top-[72%] left-[28%] w-1.5 h-1.5 rounded-full bg-[#FFE29A] animate-particle-2" />
              <span className="absolute top-[64%] right-[16%] w-2 h-2 rounded-full bg-[#C69A4C] blur-[0.4px] animate-particle-1" />
            </div>

            {/* Interactive 3D Flacon & Luxury Dais Stage */}
            <div
              className="relative flex flex-col items-center w-full max-w-[340px] sm:max-w-[390px] transition-transform duration-300 ease-out cursor-grab active:cursor-grabbing"
              style={{
                transform: `perspective(1200px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Levitation Wrapper for Bottle */}
              <div className="relative z-10 w-full flex flex-col items-center animate-flacon-float">
                {/* Flacon Image with Specular Light Caustic Glint */}
                <div className="relative w-[190px] sm:w-[220px] md:w-[245px] aspect-[528/1321] mx-auto filter drop-shadow-[0_24px_45px_rgba(0,0,0,0.75)] overflow-hidden">
                  <Image
                    src="/images/perfumes/bottle-trimmed.png"
                    alt="Lamé Barqat Eau De Parfum 100ml Flacon"
                    width={528}
                    height={1321}
                    priority
                    className="w-full h-auto object-contain select-none"
                  />

                  {/* Specular Diagonal Caustic Light Glint Sweep across flacon glass */}
                  <div
                    className="absolute inset-0 pointer-events-none animate-flacon-glint"
                    style={{
                      background:
                        "linear-gradient(110deg, transparent 30%, rgba(255, 248, 220, 0.4) 46%, rgba(255, 255, 255, 0.85) 50%, rgba(255, 248, 220, 0.4) 54%, transparent 70%)",
                      width: "220%",
                      height: "100%",
                    }}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Mirror Reflection of Flacon Base onto Dais */}
              <div
                className="relative w-[190px] sm:w-[220px] md:w-[245px] h-12 overflow-hidden pointer-events-none -mt-1 opacity-25 blur-[1px] select-none z-10"
                style={{
                  maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 80%)",
                  WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 80%)",
                }}
                aria-hidden="true"
              >
                <div className="transform scale-y-[-1] -translate-y-[calc(100%-48px)]">
                  <Image
                    src="/images/perfumes/bottle-trimmed.png"
                    alt=""
                    width={528}
                    height={1321}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>

              {/* Anchored Dark Contact Shadow directly where bottle touches dais */}
              <div
                className="w-[180px] sm:w-[210px] h-3.5 rounded-[100%] bg-black/95 blur-[2.5px] -mt-12 z-20 mx-auto"
                aria-hidden="true"
              />

              {/* Luxury Tiered Obsidian & Champagne-Gold Presentation Dais */}
              <div className="relative w-full flex flex-col items-center -mt-1.5 z-10 select-none">
                {/* Upper Tier: Polished Mirrored Elliptical Disc with Illuminated Gold Rim */}
                <div
                  className="relative w-[280px] sm:w-[320px] h-8 rounded-[100%] bg-gradient-to-r from-[#2B1B0A] via-[#483114] to-[#2B1B0A] border-t-2 border-[#F0C366] shadow-[0_0_25px_rgba(240,195,102,0.45),0_10px_25px_rgba(0,0,0,0.8)] overflow-hidden"
                  aria-hidden="true"
                >
                  {/* Top mirror radial reflection */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/60 rounded-[100%]" />
                  {/* Center radial highlight line */}
                  <div className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFF0C2] to-transparent shadow-[0_0_8px_#F0C366]" />
                </div>

                {/* Lower Tier: Deep Pedestal Foundation with Warm Ambient Drop Glow */}
                <div
                  className="relative w-[320px] sm:w-[360px] h-6 rounded-[100%] bg-gradient-to-b from-[#1C1206] to-[#0A0704] border-t border-[#C69A4C]/40 shadow-[0_24px_50px_rgba(0,0,0,0.95)] -mt-3.5 z-0"
                  aria-hidden="true"
                >
                  {/* Foundation bevel rim */}
                  <div className="absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#C69A4C]/60 to-transparent" />
                </div>

                {/* Ambient Warm Golden Floor Pool */}
                <div
                  className="w-[280px] sm:w-[340px] h-6 rounded-[100%] bg-[#F0C366]/20 blur-[15px] -mt-2 -z-10"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
