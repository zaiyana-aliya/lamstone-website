"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "./SocialIcons";

const DEFAULT_QUICK_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/pharmacy-chain", label: "Our Pharmacies" },
  { href: "/cosmetics", label: "Cosmetics Division" },
  { href: "/perfumes", label: "Perfumes & Scents" },
  { href: "/lame", label: "Lamé Brand" },
  { href: "/invest", label: "Invest With Us" },
];

const DEFAULT_FOOTER_CONTENT = {
  company_description:
    "A trusted healthcare and beauty ecosystem dedicated to enhancing wellness and confidence through premium pharmacy chains and cosmetic brands.",
  phone: "+91 9746397686",
  email: "mail@lamstonehealthcare.com",
  office_address:
    "Lamstone HealthCare Pvt Ltd\nZ Avenue, 10/20/E-10/20/G, NH 66, Mangalapuram, Kerala, India - 695317",
  corporate_office_address:
    "Alverstone Healthcare Pvt Ltd\nBio 360 Kerala Life Sciences Industries Park, Trivandrum, Kerala, India - 695317",
  social_links: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  },
  copyright_text: "© 2026 Lamstone HealthCare Pvt Ltd. All rights reserved.",
  quick_links: DEFAULT_QUICK_LINKS,
  newsletter_heading: "Newsletter",
  newsletter_description:
    "Subscribe for the latest healthcare insights and product updates.",
  is_active: true,
};

export default function Footer() {
  const pathname = usePathname();
  const [footer, setFooter] = useState(DEFAULT_FOOTER_CONTENT);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadFooterContent() {
      try {
        const res = await fetch("/api/footer-content", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data.footer) {
          setFooter({
            ...DEFAULT_FOOTER_CONTENT,
            ...data.footer,
            social_links: {
              ...DEFAULT_FOOTER_CONTENT.social_links,
              ...(data.footer.social_links || {}),
            },
            quick_links: Array.isArray(data.footer.quick_links) && data.footer.quick_links.length > 0
              ? data.footer.quick_links
              : DEFAULT_QUICK_LINKS,
          });
        }
      } catch {
        // graceful fallback to initial static content
      }
    }
    loadFooterContent();
    return () => {
      isMounted = false;
    };
  }, []);

  // Do not render public footer on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setNewsError("Email address is required");
      return;
    }
    setLoading(true);
    setNewsError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setSubscribed(true);
        setEmail("");
      } else {
        const errorMsg =
          json.fields?.email?.[0] ||
          json.error ||
          "Something went wrong submitting your form — please try again";
        setNewsError(errorMsg);
      }
    } catch {
      setNewsError("Something went wrong submitting your form — please try again");
    } finally {
      setLoading(false);
    }
  };

  const renderAddress = (addr: string) => {
    const lines = addr.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return null;
    if (lines.length === 1) return <span>{lines[0]}</span>;
    return (
      <>
        <span className="font-medium text-white block">{lines[0]}</span>
        <span>{lines.slice(1).join(", ")}</span>
      </>
    );
  };

  return (
    <footer
      data-theme-fixed="true"
      className="relative overflow-hidden bg-[#002450] text-white border-t border-white/10"
    >
      {/* Subtle 3-Line Tapered Diagonal Corner Accent (45-Degree, Behind Content) */}
      <div className="pointer-events-none absolute bottom-0 right-0 w-32 sm:w-40 lg:w-48 h-24 sm:h-32 lg:h-36 overflow-hidden select-none z-0">
        <svg
          viewBox="0 0 160 120"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Three parallel diagonal lines at 45 degrees */}
          <line
            x1="152"
            y1="22"
            x2="72"
            y2="102"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="161"
            y1="31"
            x2="81"
            y2="111"
            stroke="rgba(176,15,35,0.20)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="170"
            y1="40"
            x2="90"
            y2="120"
            stroke="rgba(226,199,133,0.25)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="relative z-20 mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12 py-10 sm:py-12 lg:py-14">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1: Brand Logo & Tagline */}
          <div className="flex flex-col space-y-5">
            <Link
              href="/"
              className="inline-flex w-fit transition-transform hover:scale-[1.02] duration-200"
              aria-label="Lamstone HealthCare Home"
            >
              <Image
                src="/images/lamstone-logo-white.png"
                alt="Lamstone HealthCare Logo"
                width={180}
                height={55}
                loading="eager"
                unoptimized
                className="h-11 sm:h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed text-white/75 font-light">
              {footer.company_description}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {footer.social_links.facebook && (
                <a
                  href={footer.social_links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-[#b00f23] transition-all duration-200"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
              )}
              {footer.social_links.instagram && (
                <a
                  href={footer.social_links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-[#b00f23] transition-all duration-200"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              )}
              {footer.social_links.linkedin && (
                <a
                  href={footer.social_links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-[#b00f23] transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col">
            <h3 className="font-serif text-base font-semibold tracking-wide text-white">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3">
              {footer.quick_links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center text-sm text-white/80 hover:text-white transition-colors"
                  >
                    <span className="h-[1px] w-0 bg-[#b00f23] transition-all duration-200 group-hover:w-2 group-hover:mr-2" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Details & Locations */}
          <div className="flex flex-col">
            <h3 className="font-serif text-base font-semibold tracking-wide text-white">
              Contact Information
            </h3>
            <ul className="mt-5 space-y-3.5 text-xs text-white/85 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <div>
                  <span className="text-[10px] text-white/60 uppercase tracking-wider block">Phone &amp; WhatsApp</span>
                  <a href={`tel:${footer.phone.replace(/\s+/g, "")}`} className="text-white hover:text-rose-300 font-medium">
                    {footer.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <div>
                  <span className="text-[10px] text-white/60 uppercase tracking-wider block">Email</span>
                  <a href={`mailto:${footer.email}`} className="text-white hover:text-rose-300 font-medium break-all">
                    {footer.email}
                  </a>
                </div>
              </li>
              {footer.office_address && (
                <li className="flex items-start gap-2.5 pt-1">
                  <MapPin className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-white/60 uppercase tracking-wider block font-semibold text-rose-300">Office</span>
                    {renderAddress(footer.office_address)}
                  </div>
                </li>
              )}
              {footer.corporate_office_address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-white/60 uppercase tracking-wider block font-semibold text-rose-300">Corporate Head Office</span>
                    {renderAddress(footer.corporate_office_address)}
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Newsletter Signup */}
          <div className="flex flex-col">
            <h3 className="font-serif text-base font-semibold tracking-wide text-white">
              {footer.newsletter_heading || "Newsletter"}
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-white/75 font-light">
              {footer.newsletter_description || "Subscribe for the latest healthcare insights and product updates."}
            </p>
            {subscribed ? (
              <div className="mt-4 rounded-xl bg-white/10 border border-white/20 p-3 text-xs text-white">
                ✓ Thank you for subscribing to Lamstone HealthCare.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="mt-4 space-y-3" noValidate>
                <div
                  className={`relative flex items-center bg-[#071c35] border rounded-full p-1 pl-4 transition-colors ${
                    newsError
                      ? "border-red-400 ring-1 ring-red-400/40"
                      : "border-white/20 focus-within:border-white"
                  }`}
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (newsError) setNewsError(null);
                    }}
                    className="w-full bg-transparent text-sm text-white placeholder-white/50 focus:outline-none pr-2"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    aria-label="Subscribe"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#b00f23] hover:bg-[#8f0c1c] text-white transition-transform hover:scale-105 disabled:opacity-60 cursor-pointer"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                {newsError && (
                  <p role="alert" className="text-xs text-rose-300 font-medium animate-in fade-in duration-150">
                    {newsError}
                  </p>
                )}
                <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-white/30 bg-white/10 text-[#b00f23] focus:ring-0"
                  />
                  <span>I agree to the privacy policy</span>
                </label>
              </form>
            )}
          </div>
        </div>

        {/* Section Divider & Legal Footer */}
        <div className="mt-10 sm:mt-12 border-t border-white/10 pt-6 sm:pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>{footer.copyright_text}</p>
          <div className="flex gap-6 pr-12 sm:pr-24 lg:pr-32">
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <span className="text-white/30">&bull;</span>
            <a href="#terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <span className="text-white/30">&bull;</span>
            <a href="#sitemap" className="hover:text-white transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
