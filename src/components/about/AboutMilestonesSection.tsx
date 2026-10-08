"use client";

import { useEffect, useState } from "react";
import MotionReveal from "@/components/MotionReveal";

export interface AboutMilestoneRecord {
  id?: string;
  year: string;
  milestone_label: string;
  title: string;
  description: string;
  display_order?: number;
  is_active?: boolean;
}

const DEFAULT_MILESTONES: AboutMilestoneRecord[] = [
  {
    year: "2019",
    milestone_label: "MILESTONE 01",
    title: "Inception of Lamstone",
    description: "Lamstone's journey began with a vision to deliver affordable healthcare.",
  },
  {
    year: "2021",
    milestone_label: "MILESTONE 02",
    title: "Pharmacy Chain Expansion",
    description: "Opened multiple stores, locations across Kerala to increase accessibility.",
  },
  {
    year: "2023",
    milestone_label: "MILESTONE 03",
    title: "Cosmetics Division Launch",
    description: "Introduced high-quality beauty & personal care products.",
  },
  {
    year: "2024",
    milestone_label: "MILESTONE 04",
    title: "LAMÉ Brand & Global Reach",
    description: "Launched our proprietary cosmetics line, LAMÉ, and growing operations.",
  },
];

export default function AboutMilestonesSection() {
  const [milestones, setMilestones] = useState<AboutMilestoneRecord[]>(DEFAULT_MILESTONES);

  useEffect(() => {
    let isMounted = true;

    async function loadMilestones() {
      try {
        const res = await fetch("/api/about-milestones", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.milestones) && json.milestones.length > 0) {
          setMilestones(json.milestones);
        }
      } catch {
        // fallback
      }
    }

    loadMilestones();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative bg-[#173A6B] text-white py-28 sm:py-32 lg:py-36 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-6xl w-full px-6 sm:px-8 lg:px-12 space-y-14 sm:space-y-18">
        {/* Section Header */}
        <MotionReveal direction="up">
          <div className="max-w-2xl space-y-3.5">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="h-[1px] w-6 sm:w-10 bg-[#B8934A]/60" />
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-sans font-semibold text-[#B8934A]">
                Progress &amp; Milestones
              </span>
              <span className="h-[1px] w-6 sm:w-10 bg-[#B8934A]/60" />
            </div>
            <div className="space-y-3">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-bold tracking-tight text-white leading-[1.12]">
                Our Growth Roadmap
              </h2>
              <div className="w-16 sm:w-20 h-[2px] rounded-full bg-[#B8934A]" />
            </div>
            <p className="font-sans text-base sm:text-[1.05rem] text-[#FBF7F0]/90 font-medium leading-[1.7] pt-1">
              Strategic trajectory marking our expansion from inception to a stable healthcare integration.
            </p>
          </div>
        </MotionReveal>

        {/* Milestone Cards Grid with Connected Roadmap Timeline Track */}
        <div className="relative">
          {/* Fine horizontal timeline connecting cards on desktop in Gold */}
          <div
            className="hidden lg:block absolute top-[52px] inset-x-8 h-[1px] pointer-events-none z-0 select-none bg-[#B8934A]/30"
            aria-hidden="true"
          />

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 items-stretch">
            {milestones.map((step, idx) => {
              const displayStepNum = String(idx + 1).padStart(2, "0");
              return (
                <MotionReveal key={step.id || step.year + idx} delay={idx * 80} direction="up" className="h-full flex flex-col relative">
                  {/* Gold filled dot marker connecting to timeline on desktop */}
                  <div
                    className="hidden lg:block absolute -top-[5px] left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-[#B8934A] ring-4 ring-[#173A6B] z-20 pointer-events-none"
                    aria-hidden="true"
                  />

                  <div className="group relative overflow-hidden rounded-[22px] border border-[#B8934A]/25 bg-[#FBF7F0] p-7 shadow-[0_1px_2px_rgba(15,42,74,0.06),0_12px_32px_rgba(15,42,74,0.08)] hover:shadow-[0_4px_8px_rgba(15,42,74,0.08),0_16px_40px_rgba(184,147,74,0.12)] hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Top Row: Year Pill Badge + Step Number in Gold */}
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full bg-[#0F2A4A] text-white px-3.5 py-0.5 text-xs font-sans font-bold shadow-xs">
                          {step.year}
                        </span>
                        <span className="text-xs font-sans font-bold text-[#B8934A] uppercase tracking-[0.16em] px-2 py-0.5 rounded-md bg-[#B8934A]/10">
                          {displayStepNum}
                        </span>
                      </div>

                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0F2A4A] pt-1 tracking-tight leading-snug">
                        {step.title}
                      </h3>

                      <p className="font-sans text-xs sm:text-[1.05rem] text-[#0F2A4A]/80 font-normal leading-[1.7]">
                        {step.description}
                      </p>
                    </div>

                    {/* Bottom Milestone Label */}
                    <div className="mt-6 pt-4 border-t border-[#0F2A4A]/10 flex items-center min-h-[28px]">
                      <span className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.24em] font-sans font-semibold text-[#0F2A4A]">
                        {step.milestone_label}
                      </span>
                    </div>
                  </div>
                </MotionReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
