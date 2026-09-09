"use client";

import React, { useState } from "react";
import MotionReveal from "./MotionReveal";
import { Bell, CheckCircle2, Sparkles } from "lucide-react";

export default function LameNotifySection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <div id="notify" className="pt-16 scroll-mt-24">
      <MotionReveal direction="up">
        <div className="mx-auto max-w-2xl rounded-2xl border border-lame-border/70 bg-white/90 backdrop-blur-md p-8 sm:p-10 shadow-sm text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-lame-rose/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-lame-rose-dark mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Launch Notification</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-light text-lame-charcoal tracking-tight">
            Be Notified When Lamé Launches
          </h3>

          <p className="text-sm text-neutral-600 font-light mt-2 max-w-lg mx-auto leading-relaxed">
            Our signature formulations are entering their release phase. Leave your email to receive early-access ordering invitations as soon as products go live on our store.
          </p>

          {submitted ? (
            <div className="mt-6 flex items-center justify-center gap-2.5 rounded-xl bg-emerald-50 border border-emerald-200/70 p-4 text-emerald-800 text-sm font-medium">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>Thank you! We&apos;ll notify you the moment Lamé formulations become available for purchase.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-lame-rose focus:outline-none focus:ring-2 focus:ring-lame-rose/20 transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-lame-rose hover:bg-lame-rose-dark text-white px-6 py-3 text-sm font-medium tracking-wide transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <span>Subscribing...</span>
                ) : (
                  <>
                    <Bell className="h-4 w-4" />
                    <span>Notify Me</span>
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-[11px] text-neutral-400 font-light mt-3">
            We respect your privacy. No spam — only launch updates and formulation releases.
          </p>
        </div>
      </MotionReveal>
    </div>
  );
}
