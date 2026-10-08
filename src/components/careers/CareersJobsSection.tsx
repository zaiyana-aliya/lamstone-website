"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import MotionReveal from "@/components/MotionReveal";
import CareersModal from "@/components/modals/CareersModal";
import BotanicalLeafWatermark from "@/components/about/BotanicalLeafWatermark";
import HealthcarePatternOverlay from "@/components/about/HealthcarePatternOverlay";
import {
  Briefcase,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight,
  MapPin,
  Mail,
  Clock,
  ShieldCheck,
  Heart,
  Award,
  Target,
} from "lucide-react";

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: "full-time" | "part-time" | "internship" | "contract";
  description: string;
}

export interface CultureValueItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  display_order: number;
  is_active: boolean;
}

export interface CultureIntroData {
  eyebrow_label?: string | null;
  heading?: string;
  description?: string;
  primary_cta_label?: string | null;
  primary_cta_url?: string | null;
  secondary_cta_label?: string | null;
  secondary_cta_url?: string | null;
  extra_data?: Record<string, any>;
}

const DEFAULT_CULTURE_PILLARS: CultureValueItem[] = [
  {
    id: "def-1",
    icon: "Users",
    title: "Inclusive & Empowering Culture",
    description:
      "We foster an environment where talent is recognized, mentorship is active, and ideas thrive across every division.",
    display_order: 1,
    is_active: true,
  },
  {
    id: "def-2",
    icon: "TrendingUp",
    title: "Accelerated Career Pathways",
    description:
      "As our retail pharmacy footprint and cosmetics distribution expand, new leadership and clinical roles emerge rapidly.",
    display_order: 2,
    is_active: true,
  },
  {
    id: "def-3",
    icon: "Sparkles",
    title: "Community-Centric Impact",
    description:
      "Every prescription filled and customer consultation delivered helps elevate patient well-being across local neighborhoods.",
    display_order: 3,
    is_active: true,
  },
];

const DEFAULT_CULTURE_INTRO: CultureIntroData = {
  eyebrow_label: "Opportunities",
  heading: "Join Our Healthcare & Beauty Team",
  description:
    "We are actively expanding our retail pharmacy network, cosmetics distribution teams, and corporate operations across Kerala and South India. If you are passionate about healthcare innovation and excellence, we would love to connect.",
  primary_cta_label: "Send Resume / Connect",
  primary_cta_url: "modal:apply",
  secondary_cta_label: "Learn About Lamstone",
  secondary_cta_url: "/about",
  extra_data: {
    subheading: "Explore career opportunities across our clinical, cosmetics, and corporate network.",
    secondary_description:
      "We are actively expanding our retail pharmacy network, cosmetics distribution teams, and corporate operations across Kerala and South India. If you are passionate about healthcare innovation and excellence, we would love to connect.",
  },
};

const AVAILABLE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  TrendingUp,
  Sparkles,
  Briefcase,
  ShieldCheck,
  Heart,
  Award,
  Target,
};

const EMPLOYMENT_LABELS: Record<string, string> = {
  "full-time": "Full-Time",
  "part-time": "Part-Time",
  internship: "Internship",
  contract: "Contract",
};

export default function CareersJobsSection() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [cultureIntro, setCultureIntro] = useState<CultureIntroData>(DEFAULT_CULTURE_INTRO);
  const [cultureValues, setCultureValues] = useState<CultureValueItem[]>(DEFAULT_CULTURE_PILLARS);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [generalApplyOpen, setGeneralApplyOpen] = useState(false);

  useEffect(() => {
    // 1. Fetch active jobs from existing /api/jobs
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data.jobs && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // 2. Fetch culture_intro section from /api/careers-page
    fetch("/api/careers-page")
      .then((res) => res.json())
      .then((data) => {
        if (data.sections && Array.isArray(data.sections)) {
          const intro = data.sections.find((s: any) => s.section_key === "culture_intro");
          if (intro) {
            setCultureIntro({
              eyebrow_label: intro.eyebrow_label ?? DEFAULT_CULTURE_INTRO.eyebrow_label,
              heading: intro.heading ?? DEFAULT_CULTURE_INTRO.heading,
              description: intro.description ?? DEFAULT_CULTURE_INTRO.description,
              primary_cta_label: intro.primary_cta_label ?? DEFAULT_CULTURE_INTRO.primary_cta_label,
              primary_cta_url: intro.primary_cta_url ?? DEFAULT_CULTURE_INTRO.primary_cta_url,
              secondary_cta_label: intro.secondary_cta_label ?? DEFAULT_CULTURE_INTRO.secondary_cta_label,
              secondary_cta_url: intro.secondary_cta_url ?? DEFAULT_CULTURE_INTRO.secondary_cta_url,
              extra_data: {
                ...DEFAULT_CULTURE_INTRO.extra_data,
                ...(intro.extra_data || {}),
              },
            });
          }
        }
      })
      .catch(() => {});

    // 3. Fetch repeatable culture cards from /api/careers-culture-values
    fetch("/api/careers-culture-values")
      .then((res) => res.json())
      .then((data) => {
        if (data.values && Array.isArray(data.values) && data.values.length > 0) {
          setCultureValues(data.values);
        }
      })
      .catch(() => {});
  }, []);

  const hasActiveJobs = !loading && jobs.length > 0;

  const introExtra = cultureIntro.extra_data || {};
  const introSubheading =
    introExtra.subheading ||
    cultureIntro.description?.split("\n\n")[0] ||
    DEFAULT_CULTURE_INTRO.extra_data?.subheading;
  const introSecondary =
    introExtra.secondary_description ||
    cultureIntro.description?.split("\n\n")[1] ||
    DEFAULT_CULTURE_INTRO.extra_data?.secondary_description;

  return (
    <>
      <section id="careers-notice" className="relative overflow-hidden bg-[#EAEFF5] py-20 sm:py-28 border-t border-[#0F2A4A]/10 scroll-mt-24">
        {/* Faint Seamless Medical Pattern Watermark */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035]" aria-hidden="true">
          <HealthcarePatternOverlay />
        </div>

        {/* Faint Botanical Leaf Watermark at the right edge */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 pointer-events-none z-[1] hidden md:block opacity-[0.08]" aria-hidden="true">
          <BotanicalLeafWatermark width={320} height={460} color="#B8934A" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl w-full px-6 sm:px-8 lg:px-12">
          {hasActiveJobs ? (
            /* 1. Dynamic Open Roles Listing (switches automatically when jobs are published) */
            <div className="space-y-10">
              <MotionReveal direction="up">
                <div className="text-center max-w-2xl mx-auto space-y-3.5">
                  <div className="flex items-center justify-center gap-2.5 sm:gap-3">
                    <span className="h-[1px] w-6 sm:w-8 bg-[#B8934A]/50" />
                    <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-bold text-[#B8934A] font-sans">
                      Current Openings
                    </span>
                    <span className="h-[1px] w-6 sm:w-8 bg-[#B8934A]/50" />
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F2A4A] tracking-tight">
                    Explore Open Opportunities
                  </h2>

                  {/* Thin gold hairline with dot */}
                  <div className="flex items-center justify-center gap-1.5 mt-2" aria-hidden="true">
                    <span className="w-14 h-[1.5px] bg-[#B8934A]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8934A]" />
                  </div>

                  <p className="text-base text-[#243E5E] font-normal leading-relaxed pt-1">
                    Join our rapidly growing teams across retail pharmacy, multi-brand cosmetics distribution, and corporate operations.
                  </p>
                </div>
              </MotionReveal>

              {/* Jobs Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {jobs.map((job, idx) => (
                  <MotionReveal key={job.id} delay={idx * 80} direction="up" className="h-full">
                    <div className="group relative flex flex-col justify-between rounded-2xl border border-[#0F2A4A]/10 bg-white p-7 shadow-[0_4px_20px_-4px_rgba(15,42,74,0.08)] hover:shadow-[0_16px_36px_-8px_rgba(15,42,74,0.16)] hover:border-[#B8934A]/50 hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden">
                      {/* Top Thin Gold Accent Line */}
                      <div className="absolute top-0 inset-x-0 h-[2.5px] bg-[#B8934A]" />

                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0F2A4A]/10 text-[#0F2A4A]">
                            {job.department}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8C6D14] bg-[#B8934A]/15 px-2.5 py-0.5 rounded-full">
                            <Clock className="h-3 w-3 text-[#B8934A]" />
                            {EMPLOYMENT_LABELS[job.employment_type] || job.employment_type}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-serif text-xl font-bold text-[#0F2A4A] group-hover:text-[#B8934A] transition-colors leading-snug">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-[#243E5E]/70 mt-1.5">
                            <MapPin className="h-3.5 w-3.5 text-[#B8934A] shrink-0" />
                            <span>{job.location}</span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-[#243E5E]/85 font-normal leading-relaxed whitespace-pre-line">
                          {job.description}
                        </p>
                      </div>

                      <div className="pt-6 mt-6 border-t border-[#0F2A4A]/10 flex items-center justify-between gap-3">
                        <span className="text-[11px] text-[#243E5E]/60 font-normal">
                          Full Application &amp; CV Upload
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedRole(job.title)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-[#0F2A4A] hover:bg-[#173A6B] transition-colors shadow-xs cursor-pointer"
                        >
                          <span>Apply Now</span>
                          <ArrowRight className="h-3.5 w-3.5 text-[#B8934A]" />
                        </button>
                      </div>
                    </div>
                  </MotionReveal>
                ))}
              </div>

              {/* General Application Banner underneath open roles */}
              <MotionReveal delay={120} direction="up">
                <div className="relative overflow-hidden rounded-2xl border border-[#0F2A4A]/10 bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_4px_20px_-4px_rgba(15,42,74,0.08)] text-center sm:text-left">
                  <div className="absolute top-0 inset-x-0 h-[2.5px] bg-[#B8934A]" />
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg font-bold text-[#0F2A4A]">
                      Don&apos;t see an exact fit?
                    </h3>
                    <p className="text-xs sm:text-sm text-[#243E5E] font-normal">
                      Submit a general application with your CV and our talent team will review your profile for upcoming openings.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGeneralApplyOpen(true)}
                    className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-[#0F2A4A] hover:bg-[#173A6B] text-white px-7 py-3 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-[0_4px_16px_rgba(15,42,74,0.22)] hover:shadow-[0_8px_24px_rgba(15,42,74,0.32)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  >
                    <Mail className="h-4 w-4 mr-1 text-[#B8934A]" />
                    <span>Send Resume / Connect</span>
                  </button>
                </div>
              </MotionReveal>
            </div>
          ) : (
            /* 2. Fallback: Dynamic "Open Roles Coming Soon" card with culture values */
            <MotionReveal delay={100} direction="up">
              <div className="relative overflow-hidden rounded-3xl border border-[#0F2A4A]/10 bg-white p-8 sm:p-12 lg:p-16 shadow-[0_12px_36px_-6px_rgba(15,42,74,0.08)] text-center">
                {/* Thin Gold Top Border */}
                <div className="absolute top-0 inset-x-0 h-[3px] bg-[#B8934A]" />

                {/* Icon Badge: Navy circular badge with gold icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0F2A4A] shadow-[0_4px_16px_rgba(15,42,74,0.18)] ring-4 ring-[#B8934A]/20 text-[#B8934A]">
                  <Briefcase className="h-8 w-8 stroke-[1.8] text-[#B8934A]" />
                </div>

                {/* Eyebrow marker */}
                {cultureIntro.eyebrow_label && (
                  <div className="mt-6 flex items-center justify-center gap-2.5 sm:gap-3">
                    <span className="h-[1px] w-6 sm:w-8 bg-[#B8934A]/50" />
                    <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-bold text-[#B8934A] font-sans">
                      {cultureIntro.eyebrow_label}
                    </span>
                    <span className="h-[1px] w-6 sm:w-8 bg-[#B8934A]/50" />
                  </div>
                )}

                {/* Main Heading */}
                <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F2A4A] tracking-tight whitespace-pre-line">
                  {cultureIntro.heading}
                </h2>

                {/* Thin gold hairline with dot */}
                <div className="flex items-center justify-center gap-1.5 mt-3 mb-1" aria-hidden="true">
                  <span className="w-14 h-[1.5px] bg-[#B8934A]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8934A]" />
                </div>

                {introSubheading && (
                  <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-[#0F2A4A] font-medium leading-relaxed">
                    {introSubheading}
                  </p>
                )}

                {introSecondary && (
                  <p className="mt-2 max-w-2xl mx-auto text-sm sm:text-base text-[#243E5E] font-normal leading-relaxed whitespace-pre-line">
                    {introSecondary}
                  </p>
                )}

                {/* Culture Pillars Grid */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  {cultureValues.map((pillar) => {
                    const Icon = AVAILABLE_ICONS[pillar.icon] || Users;
                    return (
                      <div
                        key={pillar.id}
                        className="group relative rounded-2xl border border-[#0F2A4A]/10 bg-white p-6 shadow-[0_2px_12px_rgba(15,42,74,0.05)] hover:shadow-[0_12px_28px_rgba(15,42,74,0.12)] hover:border-[#B8934A]/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                      >
                        {/* Thin Gold Top Border */}
                        <div className="absolute top-0 inset-x-0 h-[2.5px] bg-[#B8934A]" />

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F2A4A] text-[#B8934A] shadow-[0_2px_8px_rgba(15,42,74,0.18)] transition-transform duration-300 group-hover:scale-105">
                          <Icon className="h-5 w-5 stroke-[2] text-[#B8934A]" />
                        </div>
                        <h3 className="mt-4 font-serif text-lg font-bold text-[#0F2A4A] group-hover:text-[#B8934A] transition-colors leading-snug">
                          {pillar.title}
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm text-[#243E5E]/85 font-normal leading-relaxed whitespace-pre-line">
                          {pillar.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                  {cultureIntro.primary_cta_label && (
                    <button
                      type="button"
                      onClick={() => setGeneralApplyOpen(true)}
                      className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#0F2A4A] hover:bg-[#173A6B] text-white px-8 py-3.5 text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.16em] shadow-[0_4px_16px_rgba(15,42,74,0.22)] hover:shadow-[0_8px_24px_rgba(15,42,74,0.32)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                    >
                      <Mail className="h-4 w-4 mr-0.5 text-[#B8934A]" />
                      <span>{cultureIntro.primary_cta_label}</span>
                    </button>
                  )}
                  {cultureIntro.secondary_cta_label && (
                    <Link
                      href={cultureIntro.secondary_cta_url || "/about"}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0F2A4A]/25 hover:border-[#0F2A4A]/50 bg-white hover:bg-[#0F2A4A]/5 text-[#0F2A4A] px-7 py-3.5 text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.16em] shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                    >
                      <span>{cultureIntro.secondary_cta_label}</span>
                      <ArrowRight className="h-4 w-4 ml-0.5 text-[#B8934A]" />
                    </Link>
                  )}
                </div>
              </div>
            </MotionReveal>
          )}
        </div>
      </section>

      {/* Role-specific application modal */}
      <CareersModal
        isOpen={selectedRole !== null}
        onClose={() => setSelectedRole(null)}
        defaultPosition={selectedRole ?? undefined}
      />

      {/* General application modal */}
      <CareersModal
        isOpen={generalApplyOpen}
        onClose={() => setGeneralApplyOpen(false)}
        defaultPosition="General Application"
      />
    </>
  );
}
