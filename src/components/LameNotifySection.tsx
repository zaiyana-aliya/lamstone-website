"use client";

import React, { useState, useEffect } from "react";
import MotionReveal from "./MotionReveal";
import { Bell, CheckCircle2, Sparkles } from "lucide-react";
import { FieldError, getFieldInputClassName } from "./form/FormError";

interface LameNotifySectionProps {
  productName?:
    | "2% Salicylic Acid Gel Cleanser"
    | "Derma Polish Body Scrub"
    | "Sugar DAYS Eau de Parfum"
    | "DermaBarrier Gel Moisturizer"
    | "General";
}

interface LameNotifyContentData {
  eyebrow_label?: string | null;
  heading: string;
  description: string;
  primary_cta_label?: string | null;
  extra_data?: {
    privacy_note?: string;
  };
}

const DEFAULT_NOTIFY_DATA: LameNotifyContentData = {
  eyebrow_label: "Concierge Allocation",
  heading: "Experience Lamé Haute Formulations",
  description:
    "Our signature dermocosmetics and fine fragrances are now available. Leave your email to receive priority concierge allocation and exclusive formulation releases.",
  primary_cta_label: "Request Allocation",
  extra_data: {
    privacy_note: "We respect your privacy. No spam — only exclusive product releases and concierge updates.",
  },
};

export default function LameNotifySection({ productName = "General" }: LameNotifySectionProps) {
  const [content, setContent] = useState<LameNotifyContentData>(DEFAULT_NOTIFY_DATA);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch("/api/lame-page", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && Array.isArray(json.sections)) {
          const row = json.sections.find((s: any) => s.section_key === "notify_banner");
          if (row) {
            setContent({
              eyebrow_label: row.eyebrow_label || DEFAULT_NOTIFY_DATA.eyebrow_label,
              heading: row.heading || DEFAULT_NOTIFY_DATA.heading,
              description: row.description || DEFAULT_NOTIFY_DATA.description,
              primary_cta_label: row.primary_cta_label || DEFAULT_NOTIFY_DATA.primary_cta_label,
              extra_data: {
                ...DEFAULT_NOTIFY_DATA.extra_data,
                ...(row.extra_data || {}),
              },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email address is required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/lame-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, product_name: productName }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errorMsg =
          json.fields?.email?.[0] ||
          json.error ||
          "Something went wrong submitting your form — please try again";
        setError(errorMsg);
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Something went wrong submitting your form — please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="notify" className="scroll-mt-24 w-full">
      <MotionReveal direction="up">
        <div className="relative overflow-hidden mx-auto max-w-2xl rounded-2xl border border-[#0F2A4A]/10 bg-white p-8 sm:p-12 shadow-[0_10px_32px_-6px_rgba(15,42,74,0.08)] text-center">
          {/* Subtle top accent line */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-[#B8934A]" />

          {content.eyebrow_label && (
            <div className="inline-flex items-center gap-2 rounded-full border border-[#B8934A]/40 bg-[#FBF7F0] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#B8934A] mb-4 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#B8934A]" />
              <span>{content.eyebrow_label}</span>
            </div>
          )}

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2A4A] tracking-tight">
            {content.heading}
          </h3>

          {/* Thin gold hairline with a small dot beneath the heading */}
          <div className="flex items-center justify-center gap-1.5 mt-2.5 mb-3" aria-hidden="true">
            <span className="w-12 h-[1.5px] bg-[#B8934A]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8934A]" />
          </div>

          <p className="text-sm sm:text-base text-[#243E5E] font-normal max-w-lg mx-auto leading-relaxed whitespace-pre-line">
            {content.description}
          </p>

          {submitted ? (
            <div className="mt-6 flex items-center justify-center gap-2.5 rounded-xl bg-emerald-50 border border-emerald-200/70 p-4 text-emerald-800 text-sm font-medium">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>Thank you! We&apos;ll notify you the moment Lamé formulations become available for purchase.</span>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" noValidate>
                <div className="flex-1 flex flex-col items-start">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter your email address"
                    className={getFieldInputClassName(
                      Boolean(error),
                      "w-full rounded-xl bg-white px-4 py-3 text-sm text-[#0F2A4A] border border-[#0F2A4A]/20 placeholder:text-[#243E5E]/40 outline-none focus:border-[#B8934A] focus:ring-2 focus:ring-[#B8934A]/25 transition-all"
                    )}
                  />
                  {error && <FieldError error={error} className="mt-1.5" />}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="self-start sm:self-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F2A4A] hover:bg-[#173A6B] text-white px-6 py-3 text-sm font-semibold tracking-wide transition-all shadow-[0_4px_16px_rgba(15,42,74,0.18)] hover:shadow-[0_8px_24px_rgba(15,42,74,0.25)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <span>Subscribing...</span>
                  ) : (
                    <>
                      <Bell className="h-4 w-4" />
                      <span>{content.primary_cta_label || "Request Allocation"}</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {content.extra_data?.privacy_note && (
            <p className="text-xs text-[#243E5E]/70 font-normal mt-4">
              {content.extra_data.privacy_note}
            </p>
          )}
        </div>
      </MotionReveal>
    </div>
  );
}
