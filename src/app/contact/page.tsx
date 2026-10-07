"use client";

import React, { useState } from "react";
import CTAButton from "@/components/CTAButton";
import HeroBanner from "@/components/HeroBanner";
import MotionReveal from "@/components/MotionReveal";
import { MapPin, Mail, Phone, Send, CheckCircle2, ChevronDown, Clock, ShieldCheck, Building2 } from "lucide-react";

const ADDRESSES = [
  {
    label: "Office",
    company: "Lamstone HealthCare Pvt Ltd",
    street: "Z Avenue, 10/20/E-10/20/G, NH 66",
    city: "Mangalapuram, Kerala, India - 695317",
    phone: "+91 9746397686",
    email: "lamstonehealthcare@gmail.com",
  },
  {
    label: "Corporate Head Office",
    company: "Alverstone Healthcare Pvt Ltd",
    street: "Bio 360 Kerala Life Sciences Industries Park",
    city: "Trivandrum, Kerala, India - 695317",
    phone: "+91 9746397686",
    email: "lamstonehealthcare@gmail.com",
  },
];

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
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. Cinematic Hero */}
      <HeroBanner
        eyebrow="Let's Connect"
        title="Contact Lamstone"
        description="Have a query, partnership proposal, or investment inquiry? Our team will respond within 24 hours."
        imageUrl="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=85"
        imageAlt="Clean modern healthcare corporate office with light and plants"
        theme="green"
        heightClassName="min-h-[65vh]"
      >
        <CTAButton href="#contact-form" variant="primary">
          Send a Message
        </CTAButton>
      </HeroBanner>

      {/* 2. Contact Layout */}
      <section id="contact-form" className="bg-white py-24 sm:py-32 px-6 sm:px-8 lg:px-12 scroll-mt-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left: Address Info */}
            <div className="lg:col-span-4 space-y-8">
              <MotionReveal delay={100} direction="right">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-6 bg-gold" />
                    <span className="text-xs uppercase tracking-widest font-semibold text-gold-dark">
                      Our Offices
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-primary tracking-tight">
                    Find Us
                  </h2>
                </div>
              </MotionReveal>

              {/* Small Icon Highlights Set */}
              <MotionReveal delay={160} direction="right">
                <div className="grid grid-cols-3 gap-2.5 p-4 rounded-2xl border border-border-subtle bg-ivory text-center">
                  <div className="space-y-1">
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Clock className="h-4 w-4" />
                    </div>
                    <p className="text-[11px] font-semibold text-primary">24h Response</p>
                    <p className="text-[10px] text-charcoal-muted font-light leading-tight">Prompt Review</p>
                  </div>
                  <div className="space-y-1 border-x border-border-subtle px-1">
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 text-gold-dark">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <p className="text-[11px] font-semibold text-primary">Direct Line</p>
                    <p className="text-[10px] text-charcoal-muted font-light leading-tight">Verified Team</p>
                  </div>
                  <div className="space-y-1">
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <p className="text-[11px] font-semibold text-primary">Kerala, India</p>
                    <p className="text-[10px] text-charcoal-muted font-light leading-tight">HQ &amp; Operations</p>
                  </div>
                </div>
              </MotionReveal>

              {ADDRESSES.map((addr, i) => (
                <MotionReveal key={i} delay={200 + i * 160} direction="right">
                  <div className="group rounded-2xl border border-border-subtle bg-ivory p-6 sm:p-8 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-300">
                    <span className="text-xs uppercase tracking-wider font-semibold text-gold-dark">{addr.label}</span>
                    <div className="mt-4 space-y-3 text-sm text-charcoal-muted font-light">
                      <p className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <span>
                          <strong className="font-medium text-primary block">{addr.company}</strong>
                          {addr.street}
                          <br />
                          {addr.city}
                        </span>
                      </p>
                      <p className="flex items-center gap-3">
                        <Phone className="h-4 w-4 shrink-0 text-primary" />
                        <a href={`tel:${addr.phone.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">
                          {addr.phone}
                        </a>
                      </p>
                      <p className="flex items-center gap-3">
                        <Mail className="h-4 w-4 shrink-0 text-primary" />
                        <a href={`mailto:${addr.email}`} className="hover:text-primary transition-colors">
                          {addr.email}
                        </a>
                      </p>
                    </div>
                  </div>
                </MotionReveal>
              ))}
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-8">
              <MotionReveal delay={100} direction="left">
                <div className="rounded-2xl border border-border-subtle bg-ivory p-8 sm:p-10 shadow-xs">
                  {submitted ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
                      <CheckCircle2 className="h-16 w-16 text-primary" />
                      <div>
                        <h3 className="font-serif text-2xl font-medium text-primary">Message Received!</h3>
                        <p className="mt-2 text-base text-charcoal-muted font-light">
                          Thank you, {form.name}. Our team will respond within 24 hours.
                        </p>
                      </div>
                      <CTAButton
                        href="/"
                        variant="outline"
                      >
                        Back to Home
                      </CTAButton>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <h3 className="font-serif text-2xl font-medium text-primary">Send a Message</h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <label className="flex flex-col gap-1.5">
                          <span className="text-xs uppercase tracking-wider font-semibold text-charcoal-muted">Full Name *</span>
                          <input
                            name="name"
                            type="text"
                            required
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            className="w-full rounded-xl border border-border-subtle bg-white px-4 py-3 text-sm font-light text-charcoal placeholder-neutral-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                          />
                        </label>
                        <label className="flex flex-col gap-1.5">
                          <span className="text-xs uppercase tracking-wider font-semibold text-charcoal-muted">Email Address *</span>
                          <input
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@email.com"
                            className="w-full rounded-xl border border-border-subtle bg-white px-4 py-3 text-sm font-light text-charcoal placeholder-neutral-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <label className="flex flex-col gap-1.5">
                          <span className="text-xs uppercase tracking-wider font-semibold text-charcoal-muted">Phone Number</span>
                          <input
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+91 XXXXX XXXXX"
                            className="w-full rounded-xl border border-border-subtle bg-white px-4 py-3 text-sm font-light text-charcoal placeholder-neutral-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                          />
                        </label>
                        <label className="flex flex-col gap-1.5">
                          <span className="text-xs uppercase tracking-wider font-semibold text-charcoal-muted">Subject *</span>
                          <div className="relative">
                            <select
                              name="subject"
                              required
                              value={form.subject}
                              onChange={handleChange}
                              className="w-full appearance-none rounded-xl border border-border-subtle bg-white px-4 py-3 pr-10 text-sm font-light text-charcoal placeholder-neutral-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer"
                            >
                              <option value="" disabled>Select a subject…</option>
                              {SUBJECT_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-muted" />
                          </div>
                        </label>
                      </div>

                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs uppercase tracking-wider font-semibold text-charcoal-muted">Message *</span>
                        <textarea
                          name="message"
                          required
                          value={form.message}
                          onChange={handleChange}
                          rows={5}
                          placeholder="Describe your inquiry in detail…"
                          className="w-full rounded-xl border border-border-subtle bg-white px-4 py-3 text-sm font-light text-charcoal placeholder-neutral-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 resize-none transition-colors"
                        />
                      </label>

                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-xs hover:bg-primary-light hover:scale-[1.025] active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 cursor-pointer"
                      >
                        <Send className="h-4 w-4" />
                        Send Message
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
