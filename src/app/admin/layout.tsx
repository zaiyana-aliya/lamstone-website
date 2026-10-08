import React from "react";
import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/auth";
import AdminSidebarNav from "@/components/admin/AdminSidebarNav";
import {
  LogOut,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Admin Dashboard — Lamstone HealthCare",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return (
      <div className="min-h-screen bg-[#071c35] flex items-center justify-center p-4">
        {children}
      </div>
    );
  }

  const userEmail = session.user?.email || "admin@lamstone.com";
  const userRole =
    (session.user as { role?: string })?.role?.toUpperCase() || "SUPER_ADMIN";
  const initial = (userEmail[0] || "A").toUpperCase();

  return (
    <div
      data-admin-panel="true"
      className="min-h-screen bg-[#FAF8F3] text-charcoal flex flex-col font-sans selection:bg-[#0B2A4A] selection:text-[#E2C785]"
    >
      {/* 
        ========================================================================
        LAMSTONE BRANDED ADMIN HEADER
        Directly reflects the public site's iconic visual language:
        - Left crisp white logo container
        - Angled navy diagonal stripe accent (#0a2883)
        - Deep ruby crimson background (#b00f23)
        - Serif typography ("Admin Dashboard")
        - Warm Gold (#C9A24B) role badges and accents
        ========================================================================
      */}
      <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-[#630510] via-[#850917] to-[#9c0d1e] border-b border-black/25 shadow-[0_4px_24px_rgba(0,0,0,0.22)] relative">
        {/* Subtle gold bottom accent glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#E2C785]/80 to-transparent z-20" />

        {/* Header Main Bar */}
        <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-[74px]">
          {/* Section 1: Logo + First Divider + Portal Title */}
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-7">
            {/* Brand Logo with 100% Transparent Background (No white card/container) */}
            <Link
              href="/admin"
              className="flex items-center transition-all duration-200 hover:opacity-90 hover:scale-[1.02] shrink-0"
              aria-label="Lamstone Admin Portal Home"
            >
              <Image
                src="/images/lamstone-logo-white-text.png"
                alt="Lamstone HealthCare Logo"
                width={140}
                height={42}
                className="h-9 sm:h-10 w-auto object-contain drop-shadow-xs"
                priority
              />
            </Link>

            {/* Vertical Divider 1: Subtle low-opacity gold/white line between Logo and Title */}
            <div className="hidden sm:block h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent shrink-0" />

            {/* Title & Subtitle Stack */}
            <div className="hidden sm:flex flex-col justify-center">
              <div className="flex items-center gap-2.5">
                <span className="font-serif text-lg sm:text-xl lg:text-[21px] font-medium text-white tracking-tight leading-none drop-shadow-xs">
                  Admin <span className="text-[#E2C785] font-serif font-normal">Dashboard</span>
                </span>
                {/* Refined PORTAL Status Chip */}
                <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-[0.18em] bg-white/[0.07] text-[#FAF8F3]/90 border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]">
                  Portal
                </span>
              </div>
              {/* Refined MANAGEMENT CONSOLE Tagline */}
              <span className="text-[9.5px] uppercase tracking-[0.22em] font-light text-white/70 mt-1 selection:bg-none">
                Management Console
              </span>
            </div>
          </div>

          {/* Section 2: Right User Section with Second Divider + Profile + Ghost Logout */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
            {/* Vertical Divider 2: Subtle low-opacity divider before user profile section */}
            <div className="hidden md:block h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent shrink-0" />

            {/* User Profile Chip */}
            <div className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/15 text-white shadow-[0_2px_12px_rgba(0,0,0,0.12)] hover:bg-white/[0.09] transition-colors">
              {/* Circular Avatar with Gold Accent Ring and Soft Glow */}
              <div className="relative shrink-0">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#E8CF94] via-[#C9A24B] to-[#9C7524] text-[#132a4e] flex items-center justify-center text-xs font-bold shadow-xs ring-1.5 ring-[#E2C785]/70 ring-offset-1 ring-offset-[#6e0714]">
                  {initial}
                </div>
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-1.5 ring-[#6e0714]" />
              </div>

              {/* Email & Role Status Chip */}
              <div className="flex flex-col text-left leading-tight pr-1">
                <span className="font-medium text-white text-xs tracking-tight truncate max-w-[120px] sm:max-w-[170px]">
                  {userEmail}
                </span>
                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#E2C785] mt-0.5 drop-shadow-2xs">
                  {userRole === "SUPER_ADMIN" ? "Super Admin" : userRole}
                </span>
              </div>

              {/* Refined Status Chip: VERIFIED */}
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-[0.14em] bg-[#E2C785]/15 text-[#E2C785] border border-[#E2C785]/35 shadow-[inset_0_1px_0_0_rgba(226,199,133,0.2)]">
                Verified
              </span>
            </div>

            {/* Ghost / Outline Logout Button */}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button
                type="submit"
                className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/20 bg-transparent hover:bg-white/10 hover:border-white/40 text-white/90 hover:text-white text-xs font-medium tracking-wide backdrop-blur-xs transition-all duration-200 shadow-2xs hover:shadow-[0_0_12px_rgba(255,255,255,0.1)] active:scale-[0.98] cursor-pointer"
                title="Sign out of Admin Dashboard"
              >
                <LogOut className="h-3.5 w-3.5 text-white/70 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:text-white" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Admin Layout Body: Sidebar + Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-74px)]">
        {/* Left Sidebar */}
        <aside className="w-full md:w-64 bg-[#0B2A4A] text-white flex flex-col shrink-0 border-r border-[#0B2A4A]/20 shadow-[4px_0_24px_-4px_rgba(11,42,74,0.15)] z-20">
          {/* Sidebar Section Title */}
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-black/15">
            <span className="font-serif text-sm font-medium tracking-wide text-white">
              Navigation
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-[#E2C785] font-mono">
              26 Sections
            </span>
          </div>

          {/* Grouped & Styled Navigation Links */}
          <AdminSidebarNav />

          {/* Sidebar Footer: System Status */}
          <div className="p-4 border-t border-white/10 bg-black/20 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-white/90 font-medium tracking-tight">
                  Supabase Live Sync
                </span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                v1.0.4
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-white/40 font-light">
              <span>Lamstone HealthCare</span>
              <Link
                href="/"
                target="_blank"
                className="hover:text-[#E2C785] transition-colors inline-flex items-center gap-1"
              >
                <span>View Site</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Workspace Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#FAF8F3]">
          <div className="p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
