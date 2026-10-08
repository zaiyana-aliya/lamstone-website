"use client";

import React, { useState, useEffect } from "react";
import CTAButton from "@/components/CTAButton";
import HeroBanner from "@/components/HeroBanner";
import MotionReveal from "@/components/MotionReveal";
import {
  MapPin,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  ChevronDown,
  Clock,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { FieldError, FormAlert, getFieldInputClassName } from "@/components/form/FormError";

export interface ContactOfficeItem {
  id: string;
  label: string;
  company_name?: string | null;
  address: string;
  phone: string;
  email: string;
  display_order?: number;
}

export interface ContactHeroData {
  eyebrow_label?: string | null;
  heading: string;
  description: string;
  image_url?: string | null;
  primary_cta_label?: string | null;
  primary_cta_url?: string | null;
  extra_data?: Record<string, any>;
}

const DEFAULT_HERO: ContactHeroData = {
  eyebrow_label: "Let's Connect",
  heading: "Contact Lamstone",
  description:
    "Have a query, partnership proposal, or investment inquiry? Our team will respond within 24 hours.",
  image_url:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=85",
  primary_cta_label: "Send a Message",
  primary_cta_url: "#contact-form",
  extra_data: {
    badges: [
      {
        icon: "Clock",
        title: "24h Response",
        subtitle: "Prompt Review",
      },
      {
        icon: "ShieldCheck",
        title: "Direct Line",
        subtitle: "Verified Team",
      },
      {
        icon: "Building2",
        title: "Kerala, India",
        subtitle: "HQ & Operations",
      },
    ],
    offices_eyebrow: "Our Offices",
    offices_heading: "Customer Happiness Center",
  },
};

const DEFAULT_OFFICES: ContactOfficeItem[] = [
  {
    id: "def-off-1",
    label: "Office",
    company_name: "Lamstone HealthCare Pvt Ltd",
    address: "Z Avenue, 10/20/E-10/20/G, NH 66\nMangalapuram, Kerala, India - 695317",
    phone: "+91 9746397686",
    email: "mail@lamstonehealthcare.com",
    display_order: 1,
  },
  {
    id: "def-off-2",
    label: "Corporate Head Office",
    company_name: "Alverstone Healthcare Pvt Ltd",
    address: "Bio 360 Kerala Life Sciences Industries Park\nTrivandrum, Kerala, India - 695317",
    phone: "+91 9746397686",
    email: "mail@lamstonehealthcare.com",
    display_order: 2,
  },
  {
    id: "def-off-3",
    label: "Customer Happiness Center",
    company_name: "Lamstone HealthCare Pvt Ltd",
    address: "5th Floor, SPTI Building, Technopark Phase-1\nKazhakuttom, 695581",
    phone: "+91 9746397686",
    email: "mail@lamstonehealthcare.com",
    display_order: 3,
  },
];

const BADGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Clock,
  ShieldCheck,
  Building2,
  MapPin,
  Phone,
  Mail,
};

const SUBJECT_OPTIONS = [
  "General Enquiry",
  "Pharmacy Franchise / Partnership",
  "Cosmetics Distribution",
  "Lamé Brand Enquiry",
  "Investment / Investor Relations",
  "Career Opportunities",
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  // 1. Dynamic Contact Content State
  const [hero, setHero] = useState<ContactHeroData>(DEFAULT_HERO);
  const [offices, setOffices] = useState<ContactOfficeItem[]>(DEFAULT_OFFICES);

  // 2. Existing Contact Form State (unmodified)
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    // Fetch hero and trust elements
    fetch("/api/contact-page")
      .then((res) => res.json())
      .then((json) => {
        if (json.sections && Array.isArray(json.sections)) {
          const heroSec = json.sections.find((s: any) => s.section_key === "hero");
          if (heroSec) {
            setHero({
              eyebrow_label: heroSec.eyebrow_label ?? DEFAULT_HERO.eyebrow_label,
              heading: heroSec.heading ?? DEFAULT_HERO.heading,
              description: heroSec.description ?? DEFAULT_HERO.description,
              image_url: heroSec.image_url ?? DEFAULT_HERO.image_url,
              primary_cta_label: heroSec.primary_cta_label ?? DEFAULT_HERO.primary_cta_label,
              primary_cta_url: heroSec.primary_cta_url ?? DEFAULT_HERO.primary_cta_url,
              extra_data: {
                ...DEFAULT_HERO.extra_data,
                ...(heroSec.extra_data || {}),
              },
            });
          }
        }
      })
      .catch(() => {});

    // Fetch repeatable office cards
    fetch("/api/contact-offices")
      .then((res) => res.json())
      .then((json) => {
        if (json.offices && Array.isArray(json.offices) && json.offices.length > 0) {
          setOffices(json.offices);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    const errorKey = name === "name" ? "full_name" : name;
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, full_name: form.name }),
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

  const extra = hero.extra_data || {};
  const badges = (Array.isArray(extra.badges) && extra.badges.length > 0)
    ? extra.badges
    : (DEFAULT_HERO.extra_data?.badges || []);

  const officesEyebrow = extra.offices_eyebrow || "Our Offices";
  const officesHeading = extra.offices_heading || "Customer Happiness Center";

  return (
    <div data-theme="contact" className="flex flex-col w-full bg-[var(--bg)] text-[var(--body)]">
      {/* 1. Cinematic Hero */}
      <HeroBanner
        eyebrow={hero.eyebrow_label || "Let's Connect"}
        title={hero.heading}
        description={hero.description}
        imageUrl={hero.image_url || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=85"}
        imageAlt="Clean modern healthcare corporate office with light and plants"
        theme="navy"
        eyebrowTheme="red"
        heightClassName="min-h-[65vh]"
      >
        <CTAButton href={hero.primary_cta_url || "#contact-form"} variant="theme-solid">
          {hero.primary_cta_label || "Send a Message"}
        </CTAButton>
      </HeroBanner>

      {/* 2. Contact Layout */}
      <section id="contact-form" className="bg-transparent py-24 sm:py-32 scroll-mt-24">
        <div className="mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left: Address Info */}
            <div className="lg:col-span-4 space-y-8">
              <MotionReveal delay={100} direction="right">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="h-[3.5px] w-8 bg-[var(--accent)] rounded-full" />
                    <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-bold text-[var(--accent-text)] font-sans">
                      {officesEyebrow}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[var(--heading)] tracking-tight">
                    {officesHeading}
                  </h2>
                </div>
              </MotionReveal>

              {/* Small Icon Highlights Set (Trust Badges) */}
              <MotionReveal delay={160} direction="right">
                <div className="grid grid-cols-3 gap-2.5 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xs text-center">
                  {badges.map((b: any, idx: number) => {
                    const IconComp = BADGE_ICONS[b.icon] || Clock;
                    const isMiddle = idx === 1;
                    return (
                      <div
                        key={idx}
                        className={`space-y-1 ${isMiddle ? "border-x border-[var(--border)] px-1" : ""}`}
                      >
                        <div
                          className={`mx-auto flex h-9 w-9 items-center justify-center rounded-xl ${
                            isMiddle
                              ? "bg-[var(--accent-secondary)]/15 text-[var(--accent-secondary)]"
                              : "bg-[var(--primary-soft)] text-[var(--primary)]"
                          }`}
                        >
                          <IconComp className="h-4 w-4" />
                        </div>
                        <p className="text-[11px] font-semibold text-[var(--heading)]">{b.title}</p>
                        <p className="text-[10px] text-[var(--body)] font-light leading-tight">
                          {b.subtitle}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </MotionReveal>

              {/* Repeatable Office Location Cards */}
              {offices.map((addr, i) => (
                <MotionReveal key={addr.id || i} delay={200 + i * 160} direction="right">
                  <div className="group relative overflow-hidden rounded-2xl border border-[var(--border)] border-t-4 border-t-[var(--accent)] bg-[var(--surface)] p-6 sm:p-8 shadow-xs hover:shadow-md hover:border-[var(--accent)]/40 transition-all duration-300">
                    <span className="text-xs uppercase tracking-wider font-bold text-[var(--accent-text)]">
                      {addr.label}
                    </span>
                    <div className="mt-4 space-y-3 text-sm text-[var(--body)] font-light">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 shrink-0 text-[var(--accent-secondary)] group-hover:text-[var(--primary)] mt-0.5 transition-colors" />
                        <div>
                          {addr.company_name && (
                            <strong className="font-medium text-[var(--heading)] block">
                              {addr.company_name}
                            </strong>
                          )}
                          <span className="whitespace-pre-line leading-relaxed">
                            {addr.address}
                          </span>
                        </div>
                      </div>
                      <p className="flex items-center gap-3">
                        <Phone className="h-4 w-4 shrink-0 text-[var(--accent-secondary)] group-hover:text-[var(--primary)] transition-colors" />
                        <a
                          href={`tel:${addr.phone.replace(/\s/g, "")}`}
                          className="hover:text-[var(--heading)] transition-colors font-medium"
                        >
                          {addr.phone}
                        </a>
                      </p>
                      <p className="flex items-center gap-3">
                        <Mail className="h-4 w-4 shrink-0 text-[var(--accent-secondary)] group-hover:text-[var(--primary)] transition-colors" />
                        <a
                          href={`mailto:${addr.email}`}
                          className="hover:text-[var(--heading)] transition-colors font-medium"
                        >
                          {addr.email}
                        </a>
                      </p>
                    </div>
                  </div>
                </MotionReveal>
              ))}
            </div>

            {/* Right: Contact Form (Unmodified Submission Logic) */}
            <div className="lg:col-span-8">
              <MotionReveal delay={100} direction="left">
                <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] border-t-4 border-t-[var(--accent)] bg-[var(--surface)] p-8 sm:p-10 shadow-[0_4px_24px_-6px_var(--shadow-color)]">
                  {submitted ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
                      <CheckCircle2 className="h-16 w-16 text-[var(--accent)]" />
                      <div>
                        <h3 className="font-serif text-2xl font-medium text-[var(--heading)]">Message Received!</h3>
                        <p className="mt-2 text-base text-[var(--body)] font-light">
                          Thank you, {form.name}. Our team will respond within 24 hours.
                        </p>
                      </div>
                      <CTAButton href="/" variant="theme-outline">
                        Back to Home
                      </CTAButton>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                      <h3 className="font-serif text-2xl font-medium text-[var(--heading)]">Send a Message</h3>

                      <FormAlert message={apiError} />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <label className="flex flex-col gap-1.5">
                          <span className="text-xs uppercase tracking-wider font-semibold text-[var(--body)]">Full Name *</span>
                          <input
                            name="name"
                            type="text"
                            required
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            className={getFieldInputClassName(
                              Boolean(fieldErrors.full_name || fieldErrors.name),
                              "w-full rounded-xl bg-[var(--bg)] border border-[var(--border)] px-4 py-3 text-sm font-light text-[var(--heading)] placeholder-[var(--body)]/50 outline-none transition-colors"
                            )}
                          />
                          <FieldError error={fieldErrors.full_name || fieldErrors.name} />
                        </label>
                        <label className="flex flex-col gap-1.5">
                          <span className="text-xs uppercase tracking-wider font-semibold text-[var(--body)]">Email Address *</span>
                          <input
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@email.com"
                            className={getFieldInputClassName(
                              Boolean(fieldErrors.email),
                              "w-full rounded-xl bg-[var(--bg)] border border-[var(--border)] px-4 py-3 text-sm font-light text-[var(--heading)] placeholder-[var(--body)]/50 outline-none transition-colors"
                            )}
                          />
                          <FieldError error={fieldErrors.email} />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <label className="flex flex-col gap-1.5">
                          <span className="text-xs uppercase tracking-wider font-semibold text-[var(--body)]">Phone Number</span>
                          <input
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+91 XXXXX XXXXX"
                            className={getFieldInputClassName(
                              Boolean(fieldErrors.phone),
                              "w-full rounded-xl bg-[var(--bg)] border border-[var(--border)] px-4 py-3 text-sm font-light text-[var(--heading)] placeholder-[var(--body)]/50 outline-none transition-colors"
                            )}
                          />
                          <FieldError error={fieldErrors.phone} />
                        </label>
                        <label className="flex flex-col gap-1.5">
                          <span className="text-xs uppercase tracking-wider font-semibold text-[var(--body)]">Subject *</span>
                          <div className="relative">
                            <select
                              name="subject"
                              required
                              value={form.subject}
                              onChange={handleChange}
                              className={getFieldInputClassName(
                                Boolean(fieldErrors.subject),
                                "w-full appearance-none rounded-xl bg-[var(--bg)] border border-[var(--border)] px-4 py-3 pr-10 text-sm font-light text-[var(--heading)] placeholder-[var(--body)]/50 outline-none transition-colors cursor-pointer"
                              )}
                            >
                              <option value="" disabled className="bg-[var(--surface)] text-[var(--heading)]">Select a subject…</option>
                              {SUBJECT_OPTIONS.map((opt) => (
                                <option key={opt} value={opt} className="bg-[var(--surface)] text-[var(--heading)]">{opt}</option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--body)]/70" />
                          </div>
                          <FieldError error={fieldErrors.subject} />
                        </label>
                      </div>

                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs uppercase tracking-wider font-semibold text-[var(--body)]">Message *</span>
                        <textarea
                          name="message"
                          required
                          value={form.message}
                          onChange={handleChange}
                          rows={5}
                          placeholder="Describe your inquiry in detail…"
                          className={getFieldInputClassName(
                            Boolean(fieldErrors.message),
                            "w-full rounded-xl bg-[var(--bg)] border border-[var(--border)] px-4 py-3 text-sm font-light text-[var(--heading)] placeholder-[var(--body)]/50 outline-none resize-none transition-colors"
                          )}
                        />
                        <FieldError error={fieldErrors.message} />
                      </label>

                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[image:var(--btn-solid-gradient)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_4px_16px_var(--shadow-color)] hover:shadow-[0_10px_26px_var(--shadow-color)] hover:brightness-[1.08] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <Send className="h-4 w-4" />
                        {loading ? "Sending…" : "Send Message"}
                      </button>
                    </form>
                  )}
                </div>
              </MotionReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
