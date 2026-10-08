"use client";

import React, { useState, useEffect } from "react";
import MotionReveal from "./MotionReveal";
import HexNetworkOverlay from "@/components/about/HexNetworkOverlay";
import {
  Building2,
  Sparkles,
  Pill,
  TrendingUp,
  Briefcase,
  Layers,
  MapPin,
  ArrowRight,
  X,
  Send,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { FieldError, FormAlert, getFieldInputClassName } from "./form/FormError";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Sparkles,
  Pill,
  TrendingUp,
  Briefcase,
  Layers,
};

interface Opportunity {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  icon: string;
}

const DEFAULT_OPPORTUNITIES: Opportunity[] = [
  {
    id: "attingal-hypermarket",
    title: "Attingal Healthcare Hypermarket",
    category: "Healthcare Retail Hypermarket",
    location: "Attingal, Thiruvananthapuram",
    description:
      "Partnership opportunity in Attingal — contact us for project prospectus, equity structure, and operational timeline.",
    icon: "Building2",
  },
  {
    id: "lame-kottarakara",
    title: "Lamé Cosmetics – Kottarakara",
    category: "Luxury Cosmetics & Personal Care",
    location: "Kottarakara, Kollam",
    description:
      "Partnership opportunity in Kottarakara — contact us for retail footprint, brand co-ownership, and projected returns.",
    icon: "Sparkles",
  },
  {
    id: "pharmacy-cosmetics-nagaroor",
    title: "Lamstone Pharmacy & Cosmetics, Nagaroor",
    category: "Pharmacy & Cosmetics Retail",
    location: "Nagaroor, Thiruvananthapuram",
    description:
      "Partnership opportunity in Nagaroor — contact us for branch financials, customer catchment details, and turnkey operations.",
    icon: "Pill",
  },
  {
    id: "pharmacy-kodungalloor",
    title: "Lamstone Pharmacy, Kodungalloor",
    category: "Retail Pharmacy Network",
    location: "Kodungalloor, Thrissur",
    description:
      "Partnership opportunity in Kodungalloor — contact us for branch location details, revenue forecasts, and partnership options.",
    icon: "Pill",
  },
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  opportunity: string;
  message: string;
}

export default function InvestmentOpportunitiesSection() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(DEFAULT_OPPORTUNITIES);
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    opportunity: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    let isMounted = true;

    async function loadOpportunities() {
      try {
        const res = await fetch("/api/investment-opportunities", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.opportunities) && json.opportunities.length > 0) {
          setOpportunities(
            json.opportunities.map((item: any) => ({
              id: item.id,
              title: item.title,
              category: item.category_tag || item.category,
              location: item.location,
              description: item.description,
              icon: item.icon || "Building2",
            }))
          );
        }
      } catch {
        // fallback to DEFAULT_OPPORTUNITIES
      }
    }

    loadOpportunities();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenModal = (opp: Opportunity) => {
    setSelectedOpportunity(opp.title);
    setForm({
      name: "",
      email: "",
      phone: "",
      opportunity: opp.title,
      message: `I am interested in learning more about the partnership and investment structure for ${opp.title}. Please share the prospectus and details.`,
    });
    setSubmitted(false);
    setApiError(null);
    setFieldErrors({});
  };

  const handleCloseModal = () => {
    setSelectedOpportunity(null);
    setSubmitted(false);
    setApiError(null);
    setFieldErrors({});
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedOpportunity) {
        handleCloseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedOpportunity]);

  // Prevent background body scrolling when modal is open
  useEffect(() => {
    if (selectedOpportunity) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedOpportunity]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    const errorKey = name === "opportunity" ? "opportunity_name" : name;
    if (fieldErrors[errorKey] || fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);
    setFieldErrors({});
    try {
      const res = await fetch("/api/invest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          request_type: "opportunity_inquiry",
          opportunity_name: form.opportunity,
          message: form.message,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.fields && Object.keys(json.fields).length > 0) {
          setFieldErrors(json.fields);
        } else {
          setApiError(
            json.error ?? "Something went wrong submitting your form — please try again"
          );
        }
      } else {
        setSubmitted(true);
      }
    } catch {
      setApiError("Something went wrong submitting your form — please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section
        id="opportunities"
        className="relative overflow-hidden bg-[#FBF7F0] py-20 sm:py-28 border-t border-[#0F2A4A]/10 border-b border-[#0F2A4A]/10 scroll-mt-24"
      >
        {/* Faint hexagon-network line pattern */}
        <HexNetworkOverlay opacity={0.12} />

        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12 space-y-12 sm:space-y-16">
          {/* Section Header */}
          <MotionReveal direction="up">
            <div className="text-center max-w-3xl mx-auto space-y-3.5">
              <div className="flex items-center justify-center gap-2.5">
                <span className="h-[1px] w-8 sm:w-10 bg-[#B8934A]" />
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-bold text-[#B8934A] font-sans">
                  Active Opportunities
                </span>
                <span className="h-[1px] w-8 sm:w-10 bg-[#B8934A]" />
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F2A4A] tracking-tight">
                Current Investment Opportunities
              </h2>

              <div className="flex items-center justify-center gap-2 pt-1 pb-1">
                <span className="h-[1px] w-12 bg-[#B8934A]/50" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#B8934A]" />
                <span className="h-[1px] w-12 bg-[#B8934A]/50" />
              </div>

              <p className="text-base sm:text-lg text-[#243E5E] font-normal leading-relaxed max-w-2xl mx-auto">
                Explore our high-growth healthcare and retail projects currently open for strategic equity, co-ownership, and franchise partnerships.
              </p>
            </div>
          </MotionReveal>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 lg:gap-8 items-stretch max-w-5xl mx-auto">
            {opportunities.map((opp, idx) => {
              const OppIcon = ICON_MAP[opp.icon] || Building2;
              return (
                <MotionReveal
                  key={opp.id}
                  delay={idx * 140}
                  direction="up"
                  className="h-full flex flex-col"
                >
                  <div className="group relative overflow-hidden rounded-[20px] border border-[#0F2A4A]/10 border-t-2 border-t-[#B8934A] bg-white p-8 sm:p-9 shadow-[0_4px_24px_rgba(15,42,74,0.06)] hover:shadow-[0_12px_36px_rgba(15,42,74,0.12)] hover:-translate-y-1.5 transition-all duration-300 ease-out h-full flex flex-col justify-between">
                    {/* Card Content Top */}
                    <div className="space-y-5 flex-1 flex flex-col">
                      {/* Top Header Row */}
                      <div className="flex items-center justify-between gap-4">
                        {/* Icon Badge: Navy circular badge with gold icon */}
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#0F2A4A] text-[#B8934A] shadow-[0_4px_12px_rgba(15,42,74,0.15)] group-hover:scale-105 transition-all duration-300 shrink-0">
                          <OppIcon className="h-5.5 w-5.5 text-[#B8934A] stroke-[1.8]" />
                        </div>
                        {/* Location Pill: white fill, gold hairline border, navy text, gold pin */}
                        <div className="inline-flex items-center gap-1.5 text-xs text-[#0F2A4A] font-medium bg-white px-3 py-1 rounded-full border border-[#B8934A]/35 shadow-2xs">
                          <MapPin className="h-3.5 w-3.5 text-[#B8934A] shrink-0" />
                          <span className="truncate">{opp.location.split(",")[0]}</span>
                        </div>
                      </div>

                      {/* Card Title & Category */}
                      <div className="space-y-2">
                        <span className="text-[11px] sm:text-xs uppercase tracking-[0.22em] font-sans font-semibold text-[#B8934A] block">
                          {opp.category}
                        </span>
                        <h3 className="font-serif text-[22px] sm:text-[25px] font-bold text-[#0F2A4A] tracking-tight leading-snug">
                          {opp.title}
                        </h3>
                      </div>

                      {/* Description: 1.7 line height, muted navy */}
                      <p className="text-[13.5px] sm:text-sm text-[#243E5E] leading-[1.7] font-normal flex-1">
                        {opp.description}
                      </p>
                    </div>

                    {/* Card Action: Inquire button with gold circle behind arrow, hover lift & nudge */}
                    <div className="pt-8 mt-auto">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(opp)}
                        className="group/btn relative w-full inline-flex items-center justify-center gap-3 rounded-full bg-[#0F2A4A] hover:bg-[#173A6B] text-white py-3.5 px-6 text-xs sm:text-[13px] font-sans font-semibold uppercase tracking-[0.16em] shadow-[0_4px_14px_rgba(15,42,74,0.18)] hover:shadow-[0_8px_24px_rgba(15,42,74,0.28)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 cursor-pointer"
                      >
                        <span>Inquire</span>
                        <div className="flex h-6 w-6 sm:h-6.5 sm:w-6.5 shrink-0 items-center justify-center rounded-full bg-[#B8934A] text-[#0F2A4A] shadow-xs group-hover/btn:scale-105 transition-transform duration-200">
                          <ArrowRight className="h-3.5 w-3.5 text-[#0F2A4A] transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                        </div>
                      </button>
                    </div>
                  </div>
                </MotionReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Inquiry Flow Modal */}
      {selectedOpportunity && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="inquiry-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[var(--primary-deep)]/70 backdrop-blur-sm transition-opacity"
            onClick={handleCloseModal}
            aria-hidden="true"
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-lg rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[0_24px_60px_-12px_var(--shadow-color)] overflow-hidden z-10 my-auto">
            {/* Top Accent Line */}
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-light)]" />

            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 rounded-full text-[var(--body)]/70 hover:text-[var(--heading)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
              aria-label="Close inquiry modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 sm:p-8">
              {submitted ? (
                /* Success Feedback State */
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-text)] ring-8 ring-[var(--accent-soft)]">
                    <CheckCircle2 className="h-9 w-9 text-[var(--accent-text)]" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-medium text-[var(--heading)]">
                      Inquiry Received
                    </h3>
                    <p className="text-sm text-[var(--body)] font-light leading-relaxed max-w-sm">
                      Thank you for your interest in{" "}
                      <strong className="font-semibold text-[var(--heading)]">
                        {form.opportunity}
                      </strong>
                      . Your submission has been tagged and dispatched to our investor relations team. We will contact you within 24 hours.
                    </p>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-deep)] transition-colors cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* Inquiry Form */
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
                  <div className="space-y-1.5 pr-8">
                    <div className="flex items-center gap-2">
                      <span className="h-[2px] w-6 bg-[var(--accent)]" />
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--accent-text)]">
                        Investment Inquiry
                      </span>
                    </div>
                    <h3
                      id="inquiry-modal-title"
                      className="font-serif text-2xl font-medium text-[var(--heading)]"
                    >
                      Inquire About Opportunity
                    </h3>
                    {/* Tagged Opportunity Badge */}
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent-soft)] text-[var(--accent-text)] border border-[var(--border)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                        {form.opportunity}
                      </span>
                    </div>
                  </div>

                  {/* Server / General Error Alert */}
                  <FormAlert message={apiError} />

                  {/* Form Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    <label className="flex flex-col gap-1">
                      <span className="text-xs uppercase tracking-wider font-semibold text-[var(--body)]">
                        Full Name *
                      </span>
                      <input
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className={getFieldInputClassName(
                          Boolean(fieldErrors.name),
                          "w-full rounded-xl bg-[var(--bg)] border border-[var(--border)] px-3.5 py-2.5 text-sm font-light text-[var(--heading)] placeholder-[var(--body)]/50 outline-none transition-colors"
                        )}
                      />
                      <FieldError error={fieldErrors.name} />
                    </label>

                    <label className="flex flex-col gap-1">
                      <span className="text-xs uppercase tracking-wider font-semibold text-[var(--body)]">
                        Email Address *
                      </span>
                      <input
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@email.com"
                        className={getFieldInputClassName(
                          Boolean(fieldErrors.email),
                          "w-full rounded-xl bg-[var(--bg)] border border-[var(--border)] px-3.5 py-2.5 text-sm font-light text-[var(--heading)] placeholder-[var(--body)]/50 outline-none transition-colors"
                        )}
                      />
                      <FieldError error={fieldErrors.email} />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <label className="flex flex-col gap-1">
                      <span className="text-xs uppercase tracking-wider font-semibold text-[var(--body)]">
                        Phone Number *
                      </span>
                      <input
                        name="phone"
                        type="tel"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className={getFieldInputClassName(
                          Boolean(fieldErrors.phone),
                          "w-full rounded-xl bg-[var(--bg)] border border-[var(--border)] px-3.5 py-2.5 text-sm font-light text-[var(--heading)] placeholder-[var(--body)]/50 outline-none transition-colors"
                        )}
                      />
                      <FieldError error={fieldErrors.phone} />
                    </label>

                    <label className="flex flex-col gap-1">
                      <span className="text-xs uppercase tracking-wider font-semibold text-[var(--body)]">
                        Opportunity *
                      </span>
                      <div className="relative">
                        <select
                          name="opportunity"
                          required
                          value={form.opportunity}
                          onChange={handleChange}
                          className={getFieldInputClassName(
                            Boolean(fieldErrors.opportunity || fieldErrors.opportunity_name),
                            "w-full appearance-none rounded-xl bg-[var(--bg)] border border-[var(--border)] px-3.5 py-2.5 pr-8 text-sm font-light text-[var(--heading)] outline-none transition-colors cursor-pointer"
                          )}
                        >
                          {opportunities.map((opp) => (
                            <option key={opp.id} value={opp.title} className="bg-[var(--surface)] text-[var(--heading)]">
                              {opp.title}
                            </option>
                          ))}
                          <option value="General Investment Inquiry" className="bg-[var(--surface)] text-[var(--heading)]">
                            General Investment Inquiry
                          </option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--body)]/70" />
                      </div>
                      <FieldError error={fieldErrors.opportunity || fieldErrors.opportunity_name} />
                    </label>
                  </div>

                  <label className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[var(--body)]">
                      Message *
                    </span>
                    <textarea
                      name="message"
                      required
                      value={form.message}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Describe your inquiry or partnership background…"
                      className={getFieldInputClassName(
                        Boolean(fieldErrors.message),
                        "w-full rounded-xl bg-[var(--bg)] border border-[var(--border)] px-3.5 py-2.5 text-sm font-light text-[var(--heading)] placeholder-[var(--body)]/50 outline-none resize-none transition-colors"
                      )}
                    />
                    <FieldError error={fieldErrors.message} />
                  </label>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-[image:var(--btn-solid-gradient)] px-7 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_var(--shadow-color)] hover:brightness-[1.08] hover:shadow-[0_10px_26px_var(--shadow-color)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                      <span>{loading ? "Submitting…" : "Submit Inquiry"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
