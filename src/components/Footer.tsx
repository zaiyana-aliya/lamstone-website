"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "./SocialIcons";
import CTAButton from "./CTAButton";

const QUICK_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/pharmacy-chain", label: "Our Pharmacies" },
  { href: "/cosmetics", label: "Cosmetics Division" },
  { href: "/lame", label: "Lamé Brand" },
  { href: "/invest", label: "Invest With Us" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-white/10 bg-primary text-white">
      <div className="mx-auto max-w-7xl w-full px-6 py-10 sm:py-12 lg:py-14 sm:px-8 lg:px-12">
        {/* Main 4-Column Grid with Precise Alignment */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1: Brand Logo & Tagline */}
          <div className="flex flex-col space-y-5">
            <Link
              href="/"
              className="inline-flex w-fit transition-transform hover:scale-[1.02] duration-200"
              aria-label="Lamstone HealthCare Home"
            >
              <Image
                src="/images/logo-white.svg"
                alt="Lamstone HealthCare Logo"
                width={180}
                height={56}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed text-emerald-50/90">
              A trusted healthcare and beauty ecosystem dedicated to enhancing wellness and confidence through premium pharmacy chains and cosmetic brands.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-emerald-50 hover:bg-gold hover:text-primary transition-all duration-200"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-emerald-50 hover:bg-gold hover:text-primary transition-all duration-200"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-emerald-50 hover:bg-gold hover:text-primary transition-all duration-200"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col">
            <h3 className="font-serif text-base font-semibold tracking-wide text-gold">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center text-sm text-emerald-50/80 hover:text-white transition-colors"
                  >
                    <span className="h-[1px] w-0 bg-gold transition-all duration-200 group-hover:w-2 group-hover:mr-2" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Details & Locations */}
          <div className="flex flex-col">
            <h3 className="font-serif text-base font-semibold tracking-wide text-gold">
              Contact & Locations
            </h3>
            <ul className="mt-5 space-y-3.5 text-xs text-emerald-50/90 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-gold mt-0.5" />
                <div>
                  <span className="text-[10px] text-emerald-200/80 uppercase tracking-wider block">Phone & WhatsApp</span>
                  <a href="tel:+919746397686" className="text-white hover:text-gold font-medium">
                    +91 9746397686
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-gold mt-0.5" />
                <div>
                  <span className="text-[10px] text-emerald-200/80 uppercase tracking-wider block">Email</span>
                  <a href="mailto:lamstonehealthcare@gmail.com" className="text-white hover:text-gold font-medium break-all">
                    lamstonehealthcare@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <MapPin className="h-4 w-4 shrink-0 text-gold mt-0.5" />
                <div>
                  <span className="text-[10px] text-emerald-200/80 uppercase tracking-wider block font-semibold text-gold">Office</span>
                  <span className="font-medium text-white block">Lamstone HealthCare Pvt Ltd</span>
                  <span>Z Avenue, 10/20/E-10/20/G, NH 66, Mangalapuram, Kerala, India - 695317</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-gold mt-0.5" />
                <div>
                  <span className="text-[10px] text-emerald-200/80 uppercase tracking-wider block font-semibold text-gold">Corporate Head Office</span>
                  <span className="font-medium text-white block">Alverstone Healthcare Pvt Ltd</span>
                  <span>Bio 360 Kerala Life Sciences Industries Park, Trivandrum, Kerala, India - 695317</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Signup */}
          <div className="flex flex-col">
            <h3 className="font-serif text-base font-semibold tracking-wide text-gold">
              Newsletter
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-emerald-50/90">
              Subscribe for the latest healthcare insights and product updates.
            </p>
            {subscribed ? (
              <div className="mt-4 rounded-lg bg-gold/15 border border-gold/30 p-3 text-xs text-gold">
                ✓ Thank you for subscribing to Lamstone HealthCare.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="mt-4 flex flex-col gap-2.5">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder-emerald-100/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                />
                <CTAButton type="submit" variant="primary" size="sm" className="w-full">
                  Subscribe
                </CTAButton>
              </form>
            )}
          </div>
        </div>

        {/* Section Divider & Legal Footer */}
        <div className="mt-10 sm:mt-12 border-t border-white/10 pt-6 sm:pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/80">
          <p>&copy; 2026 Lamstone HealthCare Pvt Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-gold transition-colors">
              Privacy Policy
            </a>
            <span className="text-emerald-300/40">&bull;</span>
            <a href="#terms" className="hover:text-gold transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
