"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/submissions";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="relative overflow-hidden rounded-3xl bg-white border border-white/20 p-8 sm:p-10 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.5)]">
        {/* Top Gold Accent Line */}
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#0B2A4A] via-[#C9A227] to-[#E2C785]" />

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B2A4A] text-[#C9A227] shadow-md">
            <Lock className="h-6 w-6" />
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2A4A] tracking-tight">
            Lamstone <span className="text-[#C9A227]">Admin</span>
          </h1>

          <p className="text-xs text-neutral-500 font-light">
            Sign in with your administrative credentials to manage submissions and content.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-wider font-semibold text-neutral-600">
              Admin Email
            </span>
            <div className="relative flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lamstonehealthcare.com"
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 pl-10 text-sm font-light text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#0B2A4A] focus:ring-1 focus:ring-[#0B2A4A]/30 transition-colors"
              />
              <Mail className="pointer-events-none absolute left-3.5 h-4 w-4 text-neutral-400" />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-wider font-semibold text-neutral-600">
              Password
            </span>
            <div className="relative flex items-center">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 pl-10 text-sm font-light text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#0B2A4A] focus:ring-1 focus:ring-[#0B2A4A]/30 transition-colors"
              />
              <Lock className="pointer-events-none absolute left-3.5 h-4 w-4 text-neutral-400" />
            </div>
          </label>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#b00f23] px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(176,15,35,0.32)] hover:bg-[#960d1e] hover:shadow-[0_10px_26px_rgba(176,15,35,0.48)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{loading ? "Verifying…" : "Sign In to Portal"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-center gap-2 text-[11px] text-neutral-400">
          <ShieldCheck className="h-3.5 w-3.5 text-neutral-400" />
          <span>Encrypted Session · Service Role Authorized</span>
        </div>
      </div>
    </div>
  );
}
