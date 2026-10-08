"use client";

import React from "react";
import { Sparkles, Flower2, Flame, ShieldCheck, Clock, Compass, RotateCcw } from "lucide-react";

export default function PerfumesOlfactiveSection() {
  const notes = [
    {
      stage: "TOP NOTES",
      name: "Sparkling Opening",
      elements: "Bergamot · Pink Pepper · Saffron",
      icon: Sparkles,
      color: "text-[#F0C366]",
      bgColor: "bg-[#2A1A0D]",
      borderColor: "border-[#E5BA62]/30",
    },
    {
      stage: "HEART NOTES",
      name: "Noble Floral Core",
      elements: "Damascus Rose · Royal Jasmine · Amberwood",
      icon: Flower2,
      color: "text-[#F7A6B4]",
      bgColor: "bg-[#260D17]",
      borderColor: "border-[#D97D8A]/30",
    },
    {
      stage: "BASE NOTES",
      name: "Precious Woods & Amber",
      elements: "Aged Cambodian Oud · Bourbon Vanilla · Velvet Musk",
      icon: Flame,
      color: "text-[#E2BA6A]",
      bgColor: "bg-[#1B110B]",
      borderColor: "border-[#C69A4C]/30",
    },
  ];

  const highlights = [
    { icon: ShieldCheck, text: "100% Authentic Artisanal Naturals" },
    { icon: Clock, text: "14+ Hour Enduring Sillage" },
    { icon: Compass, text: "Engineered for Kerala & GCC Climates" },
    { icon: RotateCcw, text: "Luxury Presentation Box" },
  ];

  return (
    <section
      id="olfactive"
      className="relative w-full bg-[#180E07] text-[#FAF4EB] py-14 sm:py-18 px-6 sm:px-10 lg:px-16 border-y border-[#C69A4C]/35 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto w-full relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs sm:text-sm tracking-[0.28em] text-[#E5BA62] font-semibold uppercase">
            THE HOUSE OF LAMÉ · OLFACTIVE ARCHITECTURE
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF4EB] tracking-tight">
            A Symphony of Precious Accords
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#D8CDBC] leading-[1.6]">
            Every formulation is distilled with high concentrations of noble absolutes and pure vintage oud, delivering an intimate signature that deepens on warm skin throughout the day.
          </p>
        </div>

        {/* Compact 3-Step Olfactive Pyramid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {notes.map((note, idx) => {
            const Icon = note.icon;
            return (
              <div
                key={idx}
                className={`flex flex-col items-center text-center p-6 rounded-[18px] ${note.bgColor} border ${note.borderColor} shadow-[0_10px_24px_rgba(0,0,0,0.4)]`}
              >
                <div className={`w-11 h-11 rounded-full bg-black/40 ${note.color} border border-white/10 flex items-center justify-center mb-3.5`}>
                  <Icon className="w-5 h-5 stroke-[1.8]" />
                </div>
                <span className="text-[11px] tracking-[0.24em] font-semibold text-[#E5BA62] uppercase mb-1">
                  {note.stage}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#FAF4EB] mb-1.5">
                  {note.name}
                </h3>
                <p className="text-xs text-[#D8CDBC] font-medium leading-relaxed">
                  {note.elements}
                </p>
              </div>
            );
          })}
        </div>

        {/* Compact Trust Highlights Ribbon */}
        <div className="pt-2 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#F0C366] font-medium">
                <Icon className="w-4 h-4 shrink-0 text-[#E5BA62]" />
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
