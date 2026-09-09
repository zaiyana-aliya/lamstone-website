"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import CTAButton from "./CTAButton";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pharmacy-chain", label: "Pharmacy Chain" },
  { href: "/cosmetics", label: "Cosmetics" },
  { href: "/lame", label: "Lamé" },
  { href: "/invest", label: "Invest" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Check if user is currently on the Lamé page
  const isLamePage = pathname.startsWith("/lame");

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        isLamePage
          ? "bg-lame-bg/95 border-b border-lame-border text-lame-charcoal shadow-[0_4px_20px_-4px_rgba(80,40,40,0.06)] backdrop-blur-md"
          : "bg-white/95 border-b border-border-subtle text-charcoal shadow-[0_4px_20px_-4px_rgba(20,50,30,0.07)] backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-14 xl:px-16 h-20">
        {/* Transparent Full-Color Logo on Light Header */}
        <Link
          href="/"
          className="group flex items-center transition-transform hover:scale-[1.02] duration-200 py-1"
          aria-label="Lamstone HealthCare Home"
        >
          <Image
            src="/images/logo.svg"
            alt="Lamstone HealthCare Logo"
            width={180}
            height={56}
            className="h-12 sm:h-[56px] w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative text-sm tracking-wide transition-colors py-1 ${
                  isActive
                    ? isLamePage
                      ? "text-lame-rose font-medium"
                      : "text-primary font-semibold"
                    : isLamePage
                    ? "text-neutral-600 hover:text-lame-charcoal"
                    : "text-charcoal/80 hover:text-primary"
                }`}
              >
                <span>{link.label}</span>
                {/* Underline Animation */}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300 ease-out ${
                    isActive
                      ? isLamePage
                        ? "w-full bg-lame-rose"
                        : "w-full bg-gold"
                      : isLamePage
                      ? "w-0 bg-lame-rose group-hover:w-full"
                      : "w-0 bg-gold group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Action Button (Desktop) */}
        <div className="hidden lg:flex items-center">
          <CTAButton
            href="/contact"
            variant={isLamePage ? "lame" : "primary"}
            size="sm"
          >
            Inquire Now
          </CTAButton>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors ${
              isLamePage
                ? "text-lame-charcoal hover:bg-lame-cream"
                : "text-charcoal hover:bg-neutral-100 hover:text-primary"
            }`}
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
        <div
          className={`lg:hidden border-b px-6 pt-4 pb-8 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200 ${
            isLamePage
              ? "bg-lame-bg border-lame-border text-lame-charcoal shadow-xl"
              : "bg-white border-border-subtle text-charcoal shadow-xl"
          }`}
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base tracking-wide transition-colors ${
                  isActive
                    ? isLamePage
                      ? "bg-lame-rose/15 text-lame-rose-dark font-medium"
                      : "bg-gold/15 text-primary font-semibold"
                    : isLamePage
                    ? "text-neutral-700 hover:bg-lame-cream"
                    : "text-charcoal/80 hover:bg-neutral-50 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-4 px-2">
            <CTAButton
              href="/contact"
              variant={isLamePage ? "lame" : "primary"}
              size="md"
              className="w-full justify-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Inquire Now
            </CTAButton>
          </div>
        </div>
      )}
    </header>
  );
}
