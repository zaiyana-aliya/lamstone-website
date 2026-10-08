"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import CTAButton from "./CTAButton";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pharmacy-chain", label: "Pharmacy Chain" },
  { href: "/cosmetics", label: "Cosmetics Division" },
  { href: "/perfumes", label: "Perfumes" },
  { href: "/lame", label: "Lamé" },
  { href: "/blog", label: "Blogs" },
  { href: "/invest", label: "Invest" },
  { href: "/careers", label: "Careers" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Do not render public header on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      data-theme-fixed="true"
      className="sticky top-0 z-50 w-full transition-colors duration-300 relative bg-white border-b border-black/15 shadow-[0_4px_20px_0_rgba(0,0,0,0.12)]"
    >
      {/* Dynamic Background matching brand identity: White left, diagonal navy stripe, deep red right */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        {/* Base white background */}
        <div className="absolute inset-0 bg-white" />

        {/* Navy blue diagonal accent stripe */}
        <div
          className="absolute top-0 bottom-0 bg-[#0a2883]"
          style={{
            left: "max(200px, calc(50vw - 440px))",
            width: "66px",
            clipPath: "polygon(56px 0, 66px 0, 10px 100%, 0 100%)",
          }}
        />

        {/* Deep red/maroon main navbar background */}
        <div
          className="absolute top-0 bottom-0 right-0 bg-[var(--brand-red,#B31942)]"
          style={{
            left: "max(220px, calc(50vw - 420px))",
            clipPath: "polygon(56px 0, 100% 0, 100% 100%, 0 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl w-full items-center justify-between px-4 sm:px-6 lg:px-6 xl:px-10 2xl:px-12 h-[76px]">
        {/* Transparent Full-Color Logo on Light Header */}
        <Link
          href="/"
          className="group flex items-center transition-transform hover:scale-[1.02] duration-200 shrink-0 relative lg:-left-[12px] xl:-left-[52px] 2xl:-left-[64px]"
          aria-label="Lamstone HealthCare Home"
        >
          <Image
            src="/images/lamstone-logo.png"
            alt="Lamstone HealthCare Logo"
            width={160}
            height={49}
            className="h-10 sm:h-11 md:h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-4 xl:gap-6 2xl:gap-7 ml-16 xl:ml-20 2xl:ml-24 mr-2 xl:mr-4">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative text-[13px] xl:text-sm tracking-tight xl:tracking-normal whitespace-nowrap transition-colors py-1 ${
                  isActive
                    ? "text-white font-semibold"
                    : "text-white/85 hover:text-white font-normal"
                }`}
              >
                <span>{link.label}</span>
                {/* Underline for Active & Hover */}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300 ease-out ${
                    isActive
                      ? "w-full bg-white"
                      : "w-0 bg-white/70 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Action Button (Desktop) */}
        <div className="hidden lg:flex items-center shrink-0">
          <CTAButton
            href="/contact"
            variant="primary"
            size="sm"
            className="rounded-full px-3.5 xl:px-5 py-2 text-xs xl:text-sm font-medium whitespace-nowrap"
          >
            <span>Inquire Now</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </CTAButton>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-lg transition-colors text-white bg-[var(--brand-red,#B31942)] hover:brightness-90"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b px-6 pt-4 pb-8 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200 relative z-20 bg-[var(--brand-red,#B31942)] border-white/15 text-white shadow-xl">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base tracking-wide transition-colors ${
                  isActive
                    ? "bg-white/20 text-white font-semibold underline"
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-4 px-2">
            <CTAButton
              href="/contact"
              variant="primary"
              size="md"
              className="w-full justify-center rounded-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Inquire Now</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </CTAButton>
          </div>
        </div>
      )}
    </header>
  );
}
