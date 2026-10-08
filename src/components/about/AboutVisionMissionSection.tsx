"use client";

import { useEffect, useState } from "react";
import MotionReveal from "@/components/MotionReveal";
import { Eye, Target, Sparkles } from "lucide-react";
import BotanicalLeafWatermark from "@/components/about/BotanicalLeafWatermark";
import HealthcarePatternOverlay from "@/components/about/HealthcarePatternOverlay";

export interface VisionMissionCardData {
  section_key: string;
  eyebrow_label: string;
  heading: string;
  description: string;
  extra_data?: Record<string, any>;
  is_active?: boolean;
}

const DEFAULT_VISION: VisionMissionCardData = {
  section_key: "vision",
  eyebrow_label: "Our Vision & Mission",
  heading: "The Future We See",
  description:
    "To be the most trusted healthcare and beauty destination, empowering individuals to live healthier, more confident lives.",
  is_active: true,
};

const DEFAULT_MISSION: VisionMissionCardData = {
  section_key: "mission",
  eyebrow_label: "Our Vision & Mission",
  heading: "The Promise We Keep",
  description:
    "To provide unparalleled access to genuine medicines, expert care, and scientifically-backed beauty products through continuous innovation.",
  is_active: true,
};

export default function AboutVisionMissionSection() {
  const [vision, setVision] = useState<VisionMissionCardData>(DEFAULT_VISION);
  const [mission, setMission] = useState<VisionMissionCardData>(DEFAULT_MISSION);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch("/api/about-page", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.sections)) {
          const v = json.sections.find((s: any) => s.section_key === "vision");
          if (v) {
            setVision({
              section_key: "vision",
              eyebrow_label: v.eyebrow_label || DEFAULT_VISION.eyebrow_label,
              heading: v.heading || DEFAULT_VISION.heading,
              description: v.description || DEFAULT_VISION.description,
              extra_data: v.extra_data,
              is_active: v.is_active ?? true,
            });
          }
          const m = json.sections.find((s: any) => s.section_key === "mission");
          if (m) {
            setMission({
              section_key: "mission",
              eyebrow_label: m.eyebrow_label || DEFAULT_MISSION.eyebrow_label,
              heading: m.heading || DEFAULT_MISSION.heading,
              description: m.description || DEFAULT_MISSION.description,
              extra_data: m.extra_data,
              is_active: m.is_active ?? true,
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

  const eyebrow = vision.eyebrow_label || mission.eyebrow_label || "Our Vision & Mission";
  const sectionHeading =
    vision.extra_data?.section_heading ||
    mission.extra_data?.section_heading ||
    "Guided by Purpose & Principle";
  const sectionSubtitle =
    vision.extra_data?.section_subtitle ||
    mission.extra_data?.section_subtitle ||
    "Our vision defines where we are headed, while our mission anchors every step of how we get there.";

  return (
    <section className="relative overflow-hidden py-28 sm:py-32 lg:py-36 bg-[var(--brand-red,#B31942)]">
      {/* Seamless Healthcare Line-Icon Pattern in white at ~7.5% opacity */}
      <HealthcarePatternOverlay variant="white" opacity={0.075} />

      <div className="relative z-10 mx-auto max-w-6xl w-full px-6 sm:px-8 lg:px-12 space-y-14 sm:space-y-18">
        {/* Centered Eyebrow & Section Header */}
        <MotionReveal direction="up">
          <div className="text-center max-w-2xl mx-auto space-y-3.5">
            {/* Top Eyebrow with Thin Gold Lines */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-3">
              <span className="h-[1px] w-6 sm:w-10 bg-[#F0D9A0]/40" />
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-sans font-semibold text-[#F0D9A0]">
                {eyebrow}
              </span>
              <span className="h-[1px] w-6 sm:w-10 bg-[#F0D9A0]/40" />
            </div>

            {/* Heading in Crisp White Serif */}
            <div className="space-y-3">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-bold text-white tracking-tight leading-[1.12]">
                {sectionHeading}
              </h2>
              {/* Gold hairline with small dot at its end */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                <span className="w-16 sm:w-20 h-[1.5px] bg-[#F0D9A0]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0D9A0]" />
              </div>
            </div>

            {/* Subtitle in Cream #FFF3E0 at font-weight 500 */}
            <p className="font-sans text-base sm:text-[1.05rem] text-[#FFF3E0] font-medium leading-[1.7] max-w-lg mx-auto pt-1">
              {sectionSubtitle}
            </p>
          </div>
        </MotionReveal>

        {/* 2 Dual Cards: White Vision card, Warm Ivory Mission card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-stretch pt-2">
          {/* Card 1: Our Vision (White) */}
          <MotionReveal delay={100} direction="up" className="h-full flex flex-col">
            <div className="group relative flex flex-col justify-between h-full rounded-[22px] border border-[rgba(240,217,160,0.6)] bg-white p-8 sm:p-10 shadow-[0_18px_40px_rgba(0,0,0,0.22)] hover:shadow-[0_22px_48px_rgba(0,0,0,0.28)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              {/* Faint Botanical Leaf Watermark in the corner */}
              <div className="pointer-events-none select-none absolute -bottom-6 -right-6 hidden sm:block">
                <BotanicalLeafWatermark opacity={0.08} width={160} height={200} color="#B8934A" />
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  {/* Navy Circular Icon Badge with White Icon */}
                  <div className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-[#0F2A4A] text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <Eye className="h-5 w-5 stroke-[2] text-white" />
                  </div>

                  {/* Vision Pill Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#B8934A]/30 bg-[#B8934A]/10 text-[10.5px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#0F2A4A]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8934A]" />
                    <span>Vision</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2A4A] tracking-tight">
                    {vision.heading}
                  </h3>
                  <p className="font-sans text-sm sm:text-[1.05rem] text-[#0F2A4A]/85 font-normal leading-[1.7]">
                    {vision.description}
                  </p>
                </div>
              </div>
            </div>
          </MotionReveal>

          {/* Card 2: Our Mission (Ivory #FFFDF9) */}
          <MotionReveal delay={200} direction="up" className="h-full flex flex-col">
            <div className="group relative flex flex-col justify-between h-full rounded-[22px] border border-[rgba(240,217,160,0.6)] bg-[#FFFDF9] p-8 sm:p-10 shadow-[0_18px_40px_rgba(0,0,0,0.22)] hover:shadow-[0_22px_48px_rgba(0,0,0,0.28)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              {/* Faint Botanical Leaf Watermark in the corner */}
              <div className="pointer-events-none select-none absolute -bottom-6 -right-6 hidden sm:block">
                <BotanicalLeafWatermark opacity={0.08} width={160} height={200} color="#B8934A" />
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  {/* Navy Circular Icon Badge with White Icon */}
                  <div className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-[#0F2A4A] text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <Target className="h-5 w-5 stroke-[2] text-white" />
                  </div>

                  {/* Mission Pill Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#B8934A]/30 bg-[#B8934A]/10 text-[10.5px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#0F2A4A]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8934A]" />
                    <span>Mission</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2A4A] tracking-tight">
                    {mission.heading}
                  </h3>
                  <p className="font-sans text-sm sm:text-[1.05rem] text-[#0F2A4A]/85 font-normal leading-[1.7]">
                    {mission.description}
                  </p>
                </div>
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}

