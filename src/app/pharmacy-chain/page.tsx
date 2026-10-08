"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import CTAButton from "@/components/CTAButton";
import MotionReveal from "@/components/MotionReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import FormModal from "@/components/modals/FormModal";
import BotanicalLeafWatermark from "@/components/about/BotanicalLeafWatermark";
import HealthcarePatternOverlay from "@/components/about/HealthcarePatternOverlay";
import HexNetworkOverlay from "@/components/about/HexNetworkOverlay";
import {
  MapPin,
  ShieldCheck,
  Building2,
  Store,
  Clock,
  Table,
  Pill,
  Cross,
  Apple,
  Baby,
  Sparkles,
  ArrowRight,
  LucideIcon,
} from "lucide-react";

function MortarPestleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m19 5.5-6.5 6.5" />
      <path d="M4.5 10h15c0 4.4-3.1 8-7.5 8s-7.5-3.6-7.5-8z" />
      <path d="M8 18h8" />
    </svg>
  );
}

interface PharmacyLocation {
  name: string;
  locality: string;
  district: string;
  phone?: string | null;
  status?: string;
}

const PHARMACY_LOCATIONS: PharmacyLocation[] = [
  { name: "Puthalath Medicals", locality: "Villiapally, Vadakara", district: "Calicut" },
  { name: "Janananma Medicals", locality: "Angadipuram", district: "Malappuram" },
  { name: "Medcity Medicals", locality: "Mulleria", district: "Kasaragod" },
  { name: "Meditech Medicals", locality: "Kambil", district: "Kannur" },
  { name: "Illikal Medicals", locality: "Koottilangadi", district: "Malappuram" },
  { name: "Sahakar Medicals", locality: "Edappaly, Kochi", district: "Ernakulam" },
  { name: "Shobha Medicals", locality: "East Fort", district: "Thiruvananthapuram" },
  { name: "Gulf Medicals", locality: "Mankavu", district: "Calicut" },
];

const PHARMACY_CATEGORIES = [
  { icon: Pill, title: "Medicines", desc: "Prescription and general medicines" },
  { icon: Cross, title: "OTC Products", desc: "Over-the-counter healthcare essentials" },
  { icon: Apple, title: "Food Products", desc: "Nutrition and wellness food items" },
  { icon: Baby, title: "Baby Care", desc: "Baby and infant care essentials" },
  { icon: Sparkles, title: "Cosmetics", desc: "Beauty and personal care products" },
];

interface PharmaPartner {
  name: string;
  tag: string;
  logo?: string;
  logoStyle?: "wide" | "square" | "standard";
}

const PHARMA_PARTNERS: PharmaPartner[] = [
  { name: "Sun Pharmaceutical Industries", tag: "Formulations", logo: "/images/pharma-partners/sun-pharma.svg", logoStyle: "square" },
  { name: "Abbott India", tag: "Nutrition & Care", logo: "/images/pharma-partners/abbott-india.png", logoStyle: "square" },
  { name: "Cipla", tag: "Respiratory Care", logo: "/images/pharma-partners/cipla.svg", logoStyle: "wide" },
  { name: "Mankind Pharma", tag: "Therapeutics & OTC", logo: "/images/pharma-partners/mankind-pharma.png", logoStyle: "wide" },
  { name: "Alkem Laboratories", tag: "Anti-Infectives", logo: "/images/pharma-partners/alkem-laboratories.png", logoStyle: "square" },
  { name: "Torrent Pharmaceuticals", tag: "Cardiovascular", logo: "/images/pharma-partners/torrent-pharmaceuticals.png", logoStyle: "square" },
  { name: "Lupin", tag: "Formulations", logo: "/images/pharma-partners/lupin.png", logoStyle: "square" },
  { name: "Zydus Lifesciences", tag: "Biologics", logo: "/images/pharma-partners/zydus-lifesciences.png", logoStyle: "square" },
  { name: "Dr. Reddy's Laboratories", tag: "Biosimilars", logo: "/images/pharma-partners/dr-reddys.svg", logoStyle: "wide" },
  { name: "Intas Pharmaceuticals", tag: "Biopharma", logo: "/images/pharma-partners/intas-pharmaceuticals.svg", logoStyle: "wide" },
  { name: "Macleods Pharmaceuticals", tag: "Essential Meds", logo: "/images/pharma-partners/macleods-pharmaceuticals.png", logoStyle: "square" },
  { name: "Glenmark Pharmaceuticals", tag: "Dermatology", logo: "/images/pharma-partners/glenmark-pharmaceuticals.jpg", logoStyle: "square" },
  { name: "USV", tag: "Cardio-Diabetic", logo: "/images/pharma-partners/usv.png", logoStyle: "wide" },
  { name: "Aristo Pharmaceuticals", tag: "Prescriptions", logo: "/images/pharma-partners/aristo-pharmaceuticals.png", logoStyle: "square" },
  { name: "Micro Labs", tag: "Cardio Care", logo: "/images/pharma-partners/micro-labs.png", logoStyle: "standard" },
  { name: "IPCA Laboratories", tag: "Formulations", logo: "/images/pharma-partners/ipca-laboratories.png", logoStyle: "wide" },
  { name: "Eris Lifesciences", tag: "Chronic Therapy", logo: "/images/pharma-partners/eris-lifesciences.png", logoStyle: "standard" },
  { name: "Ajanta Pharma", tag: "Specialty Pharma", logo: "/images/pharma-partners/ajanta-pharma.png", logoStyle: "wide" },
  { name: "Emcure Pharmaceuticals", tag: "Cardiology", logo: "/images/pharma-partners/emcure-pharmaceuticals.png", logoStyle: "square" },
  { name: "Alembic Pharmaceuticals", tag: "Active Ingredients", logo: "/images/pharma-partners/alembic-pharmaceuticals.png", logoStyle: "square" },
  { name: "Aurobindo Pharma", tag: "Generics", logo: "/images/pharma-partners/aurobindo-pharma.png", logoStyle: "standard" },
  { name: "Hetero", tag: "Therapeutics", logo: "/images/pharma-partners/hetero.png", logoStyle: "standard" },
  { name: "Biocon", tag: "Biotechnology", logo: "/images/pharma-partners/biocon.png", logoStyle: "square" },
  { name: "Sanofi India", tag: "Vaccines & Care", logo: "/images/pharma-partners/sanofi-india.svg", logoStyle: "square" },
  { name: "Pfizer India", tag: "Biopharma", logo: "/images/pharma-partners/pfizer-india.svg", logoStyle: "square" },
  { name: "GSK India", tag: "Vaccines", logo: "/images/pharma-partners/gsk-india.png", logoStyle: "square" },
  { name: "Merck", tag: "Specialty Care", logo: "/images/pharma-partners/merck.png", logoStyle: "square" },
  { name: "Novo Nordisk", tag: "Diabetes Care", logo: "/images/pharma-partners/novo-nordisk.png", logoStyle: "standard" },
  { name: "Eli Lilly", tag: "Endocrinology", logo: "/images/pharma-partners/eli-lilly.png", logoStyle: "wide" },
  { name: "Himalaya Wellness", tag: "Herbal Wellness", logo: "/images/pharma-partners/himalaya-wellness.png", logoStyle: "standard" },
];

function PharmaPartnerCard({ brand }: { brand: PharmaPartner }) {
  const [imgError, setImgError] = useState(false);

  const logoSizeClass =
    brand.logoStyle === "wide"
      ? "max-w-[85%] max-h-[44px]"
      : brand.logoStyle === "square"
      ? "max-h-[50px] max-w-[56px]"
      : "max-h-[48px] max-w-[75%]";

  return (
    <div className="group flex flex-col items-center w-full text-center cursor-default">
      {/* Logo Area: Fixed height for identical baseline alignment across all logos */}
      <div className="w-full h-[58px] sm:h-[64px] flex items-center justify-center">
        {brand.logo && !imgError ? (
          <Image
            src={brand.logo}
            alt={`${brand.name} logo`}
            width={140}
            height={64}
            unoptimized
            className={`${logoSizeClass} w-auto block mx-auto object-contain object-center transition-transform duration-300 ease-out group-hover:scale-105`}
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="font-serif text-lg font-semibold text-[#0F2A4A]/70">
            {brand.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Brand Name: Small serif font, centred under logo, dark navy, top-aligned */}
      <div className="w-full mt-3 sm:mt-3.5 h-[36px] flex items-start justify-center px-1">
        <span className="font-serif text-[12.5px] sm:text-[13px] font-semibold tracking-tight text-[#0F2A4A] leading-[1.3] text-center line-clamp-2">
          {brand.name}
        </span>
      </div>
    </div>
  );
}

// Default static content fallback for the 4 sections
const DEFAULT_HERO = {
  eyebrow_label: "Pharmacy Network",
  heading: "Trusted Medicines.\nEvery Neighborhood.",
  description:
    "Expanding access to authentic, high-quality pharmaceuticals across Kerala.\n\nDelivering reliable community-first dispensaries, cold-chain integrity, and expert pharmacist care to every neighborhood.",
  image_url: "/images/pharmacy/pharmacy-hero-clean.jpg",
  primary_cta_label: "Our Pharmacies",
  primary_cta_url: "#locations",
  secondary_cta_label: "Partner With Us",
  secondary_cta_url: "modal:partner",
  extra_data: {
    stat_target_count: 500,
    stat_target_label: "Pharmacies (Target)",
    stat_active_count: 8,
    stat_active_label: "Active Locations",
    stat_districts_count: 14,
    stat_districts_label: "Kerala Districts",
  },
};

const DEFAULT_REDEFINING = {
  eyebrow_label: "Statewide Integration",
  heading: "Redefining Pharmaceutical Retail in Kerala",
  description:
    "Lamstone is strategically acquiring and integrating 500+ pharmacies across Kerala. We unite neighborhood accessibility with institutional pharmacy rigor, cold-chain integrity, and digitized prescription fulfillment.",
  image_url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=85",
  extra_data: {
    badges: [
      { icon: "ShieldCheck", title: "100% Authentic", desc: "Verified pharmaceutical sourcing & safety." },
      { icon: "Building2", title: "500+ Goal", desc: "Expanding across all 14 districts." },
      { icon: "Clock", title: "Expert Care", desc: "Registered pharmacists for consultations." },
    ],
  },
};

const DEFAULT_DISPENSARIES = {
  eyebrow_label: "Physical Footprint",
  heading: "Modern Community Dispensaries",
  description:
    "Standardized, clinical dispensary storefronts combining transparent pharmacy service with genuine personal care access.",
  image_url: "/images/banners/pharmacy-storefront.jpeg",
  primary_cta_label: "Partner With Us",
  primary_cta_url: "/contact",
  extra_data: {
    badge_tag: "Unified Pharmacy Network",
    card_title: "Lamstone Healthcare Pharmacy",
    card_subtitle: "Prescriptions • Healthcare Products • Personal Care • Baby Care • Wellness",
  },
};

const DEFAULT_CTA_BANNER = {
  heading: "Are You a Pharmacy Owner Interested in Joining Lamstone?",
  description:
    "We partner with independent pharmacy owners across Kerala, offering transparent acquisition pathways and growth models.",
  primary_cta_label: "Explore Pharmacy Partnership",
  primary_cta_url: "modal:partner",
};

const BADGE_ICONS: Record<string, LucideIcon> = {
  ShieldCheck,
  Building2,
  Clock,
  Pill,
};

const PHARMACY_PHOTO_FILTER_STYLE: React.CSSProperties = {
  filter: "saturate(0.95) contrast(1.04) sepia(0.05)",
};

const PHARMACY_DESKTOP_MASK_STYLE: React.CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(to left, #000 0%, #000 38%, rgba(0,0,0,0.85) 52%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.2) 84%, transparent 100%)",
  maskImage:
    "linear-gradient(to left, #000 0%, #000 38%, rgba(0,0,0,0.85) 52%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.2) 84%, transparent 100%)",
};

function renderHeroMainHeading(heading: string) {
  if (!heading) return null;
  const parts = heading.split(/(Neighborhood\.?)/i);
  if (parts.length > 1) {
    return parts.map((part, idx) =>
      part.toLowerCase().includes("neighborhood") ? (
        <span
          key={idx}
          className="inline-block text-[#B31942]"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 700,
          }}
        >
          {part}
        </span>
      ) : (
        <span key={idx} className="text-[#0F2A4A]">{part}</span>
      )
    );
  }

  return <span className="text-[#0F2A4A]">{heading}</span>;
}

function renderRedefiningHeading(heading: string) {
  if (!heading) return null;
  const parts = heading.split(/(Kerala\.?)/i);
  if (parts.length > 1) {
    return parts.map((part, idx) =>
      part.toLowerCase().includes("kerala") ? (
        <span
          key={idx}
          className="inline-block text-[#B8934A]"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 700,
          }}
        >
          {part}
        </span>
      ) : (
        <span key={idx} className="text-[#0F2A4A]">{part}</span>
      )
    );
  }

  return <span className="text-[#0F2A4A]">{heading}</span>;
}

function renderRedefiningDescription(description: string) {
  if (!description) return null;
  const match = description.match(/^([^.?!]+[.?!])\s*([\s\S]*)$/);
  if (match && match[1] && match[2]) {
    return (
      <div className="space-y-2.5">
        <p className="font-serif text-[17px] sm:text-[18px] lg:text-[19px] text-[#0F2A4A] leading-[1.65] font-normal">
          {match[1]}
        </p>
        <p className="font-sans text-sm sm:text-[14.5px] text-[#0F2A4A]/80 leading-[1.7] font-normal">
          {match[2]}
        </p>
      </div>
    );
  }
  return (
    <p className="font-serif text-[16px] sm:text-[17px] text-[#0F2A4A] leading-[1.7] font-normal">
      {description}
    </p>
  );
}

function renderStockHeading(heading: string) {
  if (!heading) return null;
  const parts = heading.split(/(Pharmacies|Stock\.?)/i);
  if (parts.length > 1) {
    return parts.map((part, idx) =>
      part.toLowerCase().includes("pharmacies") ? (
        <span
          key={idx}
          className="inline-block text-[#F0D9A0]"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 700,
          }}
        >
          {part}
        </span>
      ) : (
        <span key={idx} className="text-white">{part}</span>
      )
    );
  }
  return <span className="text-white">{heading}</span>;
}

function renderPartnersHeading(heading: string) {
  if (!heading) return null;
  const parts = heading.split(/(Partners\.?)/i);
  if (parts.length > 1) {
    return parts.map((part, idx) =>
      part.toLowerCase().includes("partners") ? (
        <span
          key={idx}
          className="inline-block text-[#B8934A]"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 700,
          }}
        >
          {part}
        </span>
      ) : (
        <span key={idx} className="text-[#0F2A4A]">{part}</span>
      )
    );
  }
  return <span className="text-[#0F2A4A]">{heading}</span>;
}

function renderDispensariesHeading(heading: string) {
  if (!heading) return null;
  const parts = heading.split(/(Dispensaries\.?)/i);
  if (parts.length > 1) {
    return parts.map((part, idx) =>
      part.toLowerCase().includes("dispensaries") ? (
        <span
          key={idx}
          className="inline-block text-[#B8934A]"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 700,
          }}
        >
          {part}
        </span>
      ) : (
        <span key={idx} className="text-[#0F2A4A]">{part}</span>
      )
    );
  }
  return <span className="text-[#0F2A4A]">{heading}</span>;
}

function renderLocationsHeading(heading: string) {
  if (!heading) return null;
  const parts = heading.split(/(Locations\.?)/i);
  if (parts.length > 1) {
    return parts.map((part, idx) =>
      part.toLowerCase().includes("locations") ? (
        <span
          key={idx}
          className="inline-block text-[#F0D9A0]"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 700,
          }}
        >
          {part}
        </span>
      ) : (
        <span key={idx} className="text-white">{part}</span>
      )
    );
  }
  return <span className="text-white">{heading}</span>;
}

function renderCtaHeading(heading: string) {
  if (!heading) return null;
  const parts = heading.split(/(Joining|Lamstone\.?)/i);
  if (parts.length > 1) {
    return parts.map((part, idx) =>
      part.toLowerCase().includes("joining") || part.toLowerCase().includes("lamstone") ? (
        <span
          key={idx}
          className="inline-block text-[#B8934A]"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 700,
          }}
        >
          {part}
        </span>
      ) : (
        <span key={idx} className="text-[#0F2A4A]">{part}</span>
      )
    );
  }
  return <span className="text-[#0F2A4A]">{heading}</span>;
}

export default function PharmacyChainPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");
  const [showTableView, setShowTableView] = useState<boolean>(false);
  const [locations, setLocations] = useState<PharmacyLocation[]>(PHARMACY_LOCATIONS);
  const [partners, setPartners] = useState<PharmaPartner[]>(PHARMA_PARTNERS);
  const [categories, setCategories] = useState(PHARMACY_CATEGORIES);
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const redefiningSectionRef = useRef<HTMLElement>(null);
  const [isRedefiningInView, setIsRedefiningInView] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsHeroLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const el = redefiningSectionRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < windowHeight && rect.bottom > 0) {
      setIsRedefiningInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRedefiningInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Dynamic Content for the 4 Sections
  const [heroData, setHeroData] = useState(DEFAULT_HERO);
  const [redefiningData, setRedefiningData] = useState(DEFAULT_REDEFINING);
  const [dispensariesData, setDispensariesData] = useState(DEFAULT_DISPENSARIES);
  const [ctaBannerData, setCtaBannerData] = useState(DEFAULT_CTA_BANNER);

  useEffect(() => {
    // 1. Fetch dynamic sections
    fetch("/api/pharmacy-page")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.sections) && data.sections.length > 0) {
          const heroRow = data.sections.find((s: any) => s.section_key === "hero");
          if (heroRow) {
            setHeroData({
              eyebrow_label: heroRow.eyebrow_label || DEFAULT_HERO.eyebrow_label,
              heading: heroRow.heading || DEFAULT_HERO.heading,
              description: heroRow.description || DEFAULT_HERO.description,
              image_url: heroRow.image_url || DEFAULT_HERO.image_url,
              primary_cta_label: heroRow.primary_cta_label || DEFAULT_HERO.primary_cta_label,
              primary_cta_url: heroRow.primary_cta_url || DEFAULT_HERO.primary_cta_url,
              secondary_cta_label: heroRow.secondary_cta_label || DEFAULT_HERO.secondary_cta_label,
              secondary_cta_url: heroRow.secondary_cta_url || DEFAULT_HERO.secondary_cta_url,
              extra_data: { ...DEFAULT_HERO.extra_data, ...(heroRow.extra_data || {}) },
            });
          }

          const redefRow = data.sections.find((s: any) => s.section_key === "redefining");
          if (redefRow) {
            setRedefiningData({
              eyebrow_label: redefRow.eyebrow_label || DEFAULT_REDEFINING.eyebrow_label,
              heading: redefRow.heading || DEFAULT_REDEFINING.heading,
              description: redefRow.description || DEFAULT_REDEFINING.description,
              image_url: redefRow.image_url || DEFAULT_REDEFINING.image_url,
              extra_data: { ...DEFAULT_REDEFINING.extra_data, ...(redefRow.extra_data || {}) },
            });
          }

          const dispRow = data.sections.find((s: any) => s.section_key === "dispensaries");
          if (dispRow) {
            setDispensariesData({
              eyebrow_label: dispRow.eyebrow_label || DEFAULT_DISPENSARIES.eyebrow_label,
              heading: dispRow.heading || DEFAULT_DISPENSARIES.heading,
              description: dispRow.description || DEFAULT_DISPENSARIES.description,
              image_url: dispRow.image_url || DEFAULT_DISPENSARIES.image_url,
              primary_cta_label: dispRow.primary_cta_label || DEFAULT_DISPENSARIES.primary_cta_label,
              primary_cta_url: dispRow.primary_cta_url || DEFAULT_DISPENSARIES.primary_cta_url,
              extra_data: { ...DEFAULT_DISPENSARIES.extra_data, ...(dispRow.extra_data || {}) },
            });
          }

          const ctaRow = data.sections.find((s: any) => s.section_key === "cta_banner");
          if (ctaRow) {
            setCtaBannerData({
              heading: ctaRow.heading || DEFAULT_CTA_BANNER.heading,
              description: ctaRow.description || DEFAULT_CTA_BANNER.description,
              primary_cta_label: ctaRow.primary_cta_label || DEFAULT_CTA_BANNER.primary_cta_label,
              primary_cta_url: ctaRow.primary_cta_url || DEFAULT_CTA_BANNER.primary_cta_url,
            });
          }
        }
      })
      .catch(() => {});

    // 2. Fetch locations
    fetch("/api/pharmacy-locations")
      .then((res) => res.json())
      .then((data) => {
        if (data.locations && data.locations.length > 0) {
          setLocations(
            data.locations.map((loc: { name: string; area: string; district: string; phone?: string | null; status?: string }) => ({
              name: loc.name,
              locality: loc.area,
              district: loc.district,
              phone: loc.phone,
              status: loc.status,
            }))
          );
        }
      })
      .catch(() => {});

    // 3. Fetch partners
    fetch("/api/brand-partners?type=pharmacy")
      .then((res) => res.json())
      .then((data) => {
        if (data.partners && data.partners.length > 0) {
          setPartners(
            data.partners.map((p: any) => ({
              name: p.name,
              tag: p.category_label || "Formulations",
              logo: p.logo_url || undefined,
            }))
          );
        }
      })
      .catch(() => {});

    // 4. Fetch product categories
    fetch("/api/product-categories?page=pharmacy")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && data.categories.length > 0) {
          setCategories(
            data.categories.map((c: any) => {
              const lower = (c.title || "").toLowerCase();
              let matchedIcon = Pill;
              if (lower.includes("otc")) matchedIcon = Cross;
              else if (lower.includes("food")) matchedIcon = Apple;
              else if (lower.includes("baby")) matchedIcon = Baby;
              else if (lower.includes("cosmetic")) matchedIcon = Sparkles;

              return {
                icon: matchedIcon,
                title: c.title,
                desc: c.description || c.subtitle || "",
              };
            })
          );
        }
      })
      .catch(() => {});
  }, []);

  const districts = [
    "All",
    ...Array.from(new Set(locations.map((loc) => loc.district))),
  ];

  const filteredLocations =
    selectedDistrict === "All"
      ? locations
      : locations.filter((loc) => loc.district === selectedDistrict);

  // Hero helper stats & paragraphs
  const heroParagraphs = heroData.description.split("\n\n");
  const heroSubheading = heroParagraphs[0] || "";
  const heroSecondary = heroParagraphs[1] || "";

  // Parse hero eyebrow & main heading from admin data
  let heroEyebrow = "Trusted Medicines.";
  let heroHeading = "Every Neighborhood.";

  if (heroData.heading) {
    if (heroData.heading.includes("\n")) {
      const [line1, ...rest] = heroData.heading.split("\n");
      heroEyebrow = line1.trim() || heroEyebrow;
      heroHeading = rest.join(" ").trim() || "Every Neighborhood.";
    } else if (
      heroData.heading.toLowerCase().includes("trusted medicines") &&
      heroData.heading.toLowerCase().includes("every neighborhood")
    ) {
      heroEyebrow = "Trusted Medicines.";
      heroHeading = "Every Neighborhood.";
    } else {
      if (heroData.eyebrow_label && heroData.eyebrow_label !== "Pharmacy Network") {
        heroEyebrow = heroData.eyebrow_label;
      }
      heroHeading = heroData.heading;
    }
  }

  const targetCount = heroData.extra_data?.stat_target_count ?? 500;
  const targetLabel = heroData.extra_data?.stat_target_label ?? "Pharmacies (Target)";
  const activeCount = heroData.extra_data?.stat_active_count ?? (locations.length || 8);
  const activeLabel = heroData.extra_data?.stat_active_label ?? "Active Locations";
  const districtsCount = heroData.extra_data?.stat_districts_count ?? (districts.length > 1 ? districts.length - 1 : 14);
  const districtsLabel = heroData.extra_data?.stat_districts_label ?? "Kerala Districts";

  const badgesList = redefiningData.extra_data?.badges || DEFAULT_REDEFINING.extra_data.badges;

  return (
    <div data-theme="pharmacy" className="flex flex-col w-full bg-[var(--bg)] text-[var(--body)]">
      {/* 1. Dynamic Pharmacy Chain Hero — Elevated Premium Editorial */}
      <section className="relative w-full overflow-hidden bg-[#F1E2CC] min-h-[560px] lg:h-[calc(100vh-76px)] lg:min-h-0 lg:max-h-[calc(100vh-76px)] flex items-center">
        {/* Background Photo with Multi-Stop Mask & Warm Grade */}
        <div
          className="absolute inset-y-0 right-0 w-full lg:w-[65%] xl:w-[62%] 2xl:w-[58%] z-0 select-none overflow-hidden"
          style={PHARMACY_DESKTOP_MASK_STYLE}
        >
          <div
            className={`relative h-full w-full transition-transform duration-[1200ms] ease-out motion-reduce:transition-none motion-reduce:transform-none ${
              isHeroLoaded ? "scale-100" : "scale-[1.04]"
            }`}
          >
            <Image
              src={heroData.image_url || "/images/pharmacy/pharmacy-hero-clean.jpg"}
              alt="Modern pharmacy dispensary interior with organized medicine shelving and pharmacist care"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-[center_35%]"
              style={PHARMACY_PHOTO_FILTER_STYLE}
            />
          </div>

          {/* Soft atmospheric fade on the left edge where image meets text */}
          <div
            className="hidden lg:block absolute inset-y-0 left-0 w-44 xl:w-56 bg-gradient-to-r from-[#F1E2CC] via-[#F1E2CC]/80 to-transparent pointer-events-none z-2"
            aria-hidden="true"
          />

          {/* Subtle brand tint overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-tr from-[#0F2A4A]/[0.04] via-transparent to-[#B8934A]/[0.03] pointer-events-none mix-blend-multiply z-1"
            aria-hidden="true"
          />

          {/* Top subtle blending wash */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#F1E2CC]/35 via-[#F1E2CC]/10 to-transparent pointer-events-none z-2" aria-hidden="true" />

          <div className="block lg:hidden absolute inset-0 bg-[#F1E2CC]/90 backdrop-blur-[2px] pointer-events-none z-3" />
        </div>

        {/* Elegant thin vertical divider seam between text & photo on desktop */}
        <div
          className="hidden lg:block absolute inset-y-0 right-[44%] xl:right-[41%] 2xl:right-[38%] w-[1px] bg-gradient-to-b from-transparent via-[#B8934A]/30 to-transparent z-1 pointer-events-none blur-[0.5px]"
          aria-hidden="true"
        />

        {/* Content Column with Refined Spacing for 100vh Viewport */}
        <div className="relative z-10 w-full pl-6 sm:pl-8 lg:pl-10 xl:pl-14 pr-6 sm:pr-8 lg:pr-12 py-10 sm:py-14 lg:py-0 h-full flex flex-col justify-center">
          <div className="max-w-md lg:max-w-[580px] xl:max-w-[640px] space-y-3.5 sm:space-y-4 lg:space-y-2.5 xl:space-y-3.5 my-auto">
            {/* 1. Tracked-Caps Eyebrow Line */}
            <MotionReveal delay={0} direction="up">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="h-[1px] w-6 sm:w-8 bg-[#B8934A]/60" />
                <p className="font-sans text-[11px] sm:text-xs tracking-[0.25em] uppercase font-semibold text-[#0F2A4A] select-none">
                  {heroEyebrow}
                </p>
              </div>
            </MotionReveal>

            {/* 2. Main Heading: "Every Neighborhood." */}
            <MotionReveal delay={60} direction="up" className="!mt-1 sm:!mt-1.5">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[54px] xl:text-[60px] font-semibold text-[#0F2A4A] tracking-tight leading-[1.05] whitespace-pre-line">
                {renderHeroMainHeading(heroHeading)}
              </h1>
              {/* Thin gold hairline with a small dot under the heading */}
              <div className="flex items-center gap-1.5 mt-3 sm:mt-3.5" aria-hidden="true">
                <span className="w-14 sm:w-16 h-[1.5px] bg-[#B8934A]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8934A]" />
              </div>
            </MotionReveal>

            {/* 3. Body paragraphs: Lead in larger serif (deep navy, 1.5), Second in sans (1.7) */}
            <MotionReveal delay={180} direction="up" className="mt-2.5 sm:mt-3 lg:mt-2 xl:mt-2.5">
              <div className="space-y-1.5 sm:space-y-2">
                {heroSubheading && (
                  <p className="font-serif text-[18px] sm:text-[20px] lg:text-[21px] text-[#0F2A4A] leading-[1.5] font-normal max-w-xl xl:max-w-[60ch]">
                    {heroSubheading}
                  </p>
                )}
                {heroSecondary && (
                  <p className="font-sans text-[15px] sm:text-[16px] text-[#0F2A4A]/80 leading-[1.7] font-normal max-w-xl xl:max-w-[60ch]">
                    {heroSecondary}
                  </p>
                )}
              </div>
            </MotionReveal>

            {/* 4. Buttons Row */}
            <MotionReveal delay={270} direction="up" className="pt-1 sm:pt-2">
              <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
                {/* Primary CTA: Solid navy with small gold arrow-in-circle */}
                {heroData.primary_cta_label && (
                  <Link
                    href={heroData.primary_cta_url || "#locations"}
                    className="group relative inline-flex items-center justify-center gap-2.5 rounded-full bg-[#0F2A4A] hover:bg-[#173A6B] text-white pl-7 pr-3 py-3 text-xs sm:text-[12.5px] font-sans font-semibold uppercase tracking-[0.16em] shadow-[0_4px_16px_rgba(15,42,74,0.18)] hover:shadow-[0_8px_24px_rgba(15,42,74,0.28)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                  >
                    <span>{heroData.primary_cta_label}</span>
                    <div className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full bg-[#B8934A] text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
                      <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white group-hover:translate-x-0.5 transition-transform duration-200" />
                    </div>
                  </Link>
                )}

                {/* Secondary CTA: Thin gold hairline outline button */}
                {heroData.secondary_cta_label && (
                  <button
                    type="button"
                    onClick={() => setPartnerModalOpen(true)}
                    className="group relative inline-flex items-center justify-center rounded-full border border-[#B8934A] hover:border-[#B8934A] bg-transparent hover:bg-[#B8934A]/10 text-[#0F2A4A] px-7 py-3 text-xs sm:text-[12.5px] font-sans font-semibold uppercase tracking-[0.16em] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                  >
                    <span>{heroData.secondary_cta_label}</span>
                  </button>
                )}
              </div>
            </MotionReveal>

            {/* 5. Stats bar: 3 Individual Icon Badges + Crisp White Pill Card */}
            <MotionReveal delay={300} direction="up" className="pt-2 sm:pt-2.5 select-none w-full lg:w-max max-w-[880px]">
              <div className="w-full rounded-full border border-[rgba(184,147,74,0.30)] bg-white px-6 sm:px-7 py-3 sm:py-3.5 shadow-[0_1px_2px_rgba(15,42,74,0.04),0_12px_32px_-12px_rgba(15,42,74,0.14)]">
                {/* Desktop 3-column layout with individual icon badges & visible dividers */}
                <div className="hidden sm:flex sm:items-center sm:gap-6 md:gap-7 lg:gap-8">
                  {/* Stat 1: 500+ Pharmacies (Target) */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 sm:h-11 sm:w-11 min-w-10 sm:min-w-11 shrink-0 items-center justify-center rounded-full bg-[#0F2A4A] ring-1 ring-[#B8934A]/40 ring-offset-2 ring-offset-white shadow-[0_2px_8px_rgba(15,42,74,0.18)]">
                      <Store className="h-4.5 w-4.5 stroke-[2] text-[#B8934A]" />
                    </div>
                    <div className="flex flex-col items-start justify-center min-w-0">
                      <span className="font-serif text-[1.45rem] sm:text-[1.65rem] font-bold text-[#0F2A4A] leading-none tracking-tight">
                        <AnimatedCounter target={targetCount} suffix="+" />
                      </span>
                      <span className="font-sans text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0F2A4A]/70 mt-1 whitespace-nowrap">
                        {targetLabel}
                      </span>
                    </div>
                  </div>

                  {/* Divider 1: Clear, visible thin line full height */}
                  <div className="w-[1px] h-9 bg-[rgba(184,147,74,0.35)] shrink-0" aria-hidden="true" />

                  {/* Stat 2: 8 Active Locations */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 sm:h-11 sm:w-11 min-w-10 sm:min-w-11 shrink-0 items-center justify-center rounded-full bg-[#0F2A4A] ring-1 ring-[#B8934A]/40 ring-offset-2 ring-offset-white shadow-[0_2px_8px_rgba(15,42,74,0.18)]">
                      <MapPin className="h-4.5 w-4.5 stroke-[2] text-[#B8934A]" />
                    </div>
                    <div className="flex flex-col items-start justify-center min-w-0">
                      <span className="font-serif text-[1.45rem] sm:text-[1.65rem] font-bold text-[#0F2A4A] leading-none tracking-tight">
                        <AnimatedCounter target={activeCount} suffix="" />
                      </span>
                      <span className="font-sans text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0F2A4A]/70 mt-1 whitespace-nowrap">
                        {activeLabel}
                      </span>
                    </div>
                  </div>

                  {/* Divider 2: Clear, visible thin line full height */}
                  <div className="w-[1px] h-9 bg-[rgba(184,147,74,0.35)] shrink-0" aria-hidden="true" />

                  {/* Stat 3: 14 Kerala Districts */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 sm:h-11 sm:w-11 min-w-10 sm:min-w-11 shrink-0 items-center justify-center rounded-full bg-[#0F2A4A] ring-1 ring-[#B8934A]/40 ring-offset-2 ring-offset-white shadow-[0_2px_8px_rgba(15,42,74,0.18)]">
                      <MortarPestleIcon className="h-4.5 w-4.5 text-[#B8934A]" />
                    </div>
                    <div className="flex flex-col items-start justify-center min-w-0">
                      <span className="font-serif text-[1.45rem] sm:text-[1.65rem] font-bold text-[#0F2A4A] leading-none tracking-tight">
                        <AnimatedCounter target={districtsCount} suffix="" />
                      </span>
                      <span className="font-sans text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0F2A4A]/70 mt-1 whitespace-nowrap">
                        {districtsLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile vertical stack layout */}
                <div className="flex sm:hidden flex-col gap-4 py-2">
                  {/* Stat 1 */}
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 min-w-11 shrink-0 items-center justify-center rounded-full bg-[#0F2A4A] ring-1 ring-[#B8934A]/40 ring-offset-2 ring-offset-white shadow-[0_2px_8px_rgba(15,42,74,0.18)]">
                      <Store className="h-5 w-5 stroke-[2] text-[#B8934A]" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-serif text-[1.65rem] font-bold text-[#0F2A4A] leading-none tracking-tight">
                        <AnimatedCounter target={targetCount} suffix="+" />
                      </span>
                      <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0F2A4A]/70 mt-1">
                        {targetLabel}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-[1px] bg-[rgba(184,147,74,0.30)]" aria-hidden="true" />

                  {/* Stat 2 */}
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 min-w-11 shrink-0 items-center justify-center rounded-full bg-[#0F2A4A] ring-1 ring-[#B8934A]/40 ring-offset-2 ring-offset-white shadow-[0_2px_8px_rgba(15,42,74,0.18)]">
                      <MapPin className="h-5 w-5 stroke-[2] text-[#B8934A]" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-serif text-[1.65rem] font-bold text-[#0F2A4A] leading-none tracking-tight">
                        <AnimatedCounter target={activeCount} suffix="" />
                      </span>
                      <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0F2A4A]/70 mt-1">
                        {activeLabel}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-[1px] bg-[rgba(184,147,74,0.30)]" aria-hidden="true" />

                  {/* Stat 3 */}
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 min-w-11 shrink-0 items-center justify-center rounded-full bg-[#0F2A4A] ring-1 ring-[#B8934A]/40 ring-offset-2 ring-offset-white shadow-[0_2px_8px_rgba(15,42,74,0.18)]">
                      <MortarPestleIcon className="h-5 w-5 text-[#B8934A]" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-serif text-[1.65rem] font-bold text-[#0F2A4A] leading-none tracking-tight">
                        <AnimatedCounter target={districtsCount} suffix="" />
                      </span>
                      <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0F2A4A]/70 mt-1">
                        {districtsLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* 2. Dynamic Strategic Vision Overview ("Statewide Integration") */}
      <section
        ref={redefiningSectionRef}
        className="relative bg-[#EAEFF5] py-20 sm:py-28 border-t border-[#0F2A4A]/10 border-b border-[#0F2A4A]/10 overflow-hidden"
      >
        {/* Seamless Healthcare Line-Icon Pattern at very low opacity */}
        <HealthcarePatternOverlay opacity={0.035} />

        {/* Faint Botanical Leaf Watermark at the right edge */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 pointer-events-none z-[1] hidden md:block">
          <BotanicalLeafWatermark opacity={0.07} width={300} height={440} color="#B8934A" />
        </div>

        {/* Desktop Full-Bleed Photo Blend spanning right window edge with seamless left mask */}
        <div
          className="hidden lg:block absolute inset-y-0 right-0 w-[47%] xl:w-[46%] 2xl:w-[48%] pointer-events-none select-none z-[1]"
          style={{
            WebkitMaskImage:
              "linear-gradient(to left, #000 0%, #000 48%, transparent 88%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%), linear-gradient(to top, transparent 0%, #000 10%, #000 90%, transparent 100%)",
            maskImage:
              "linear-gradient(to left, #000 0%, #000 48%, transparent 88%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        >
          <div
            className={`relative h-full w-full transition-transform duration-[1200ms] ease-out motion-reduce:transition-none motion-reduce:transform-none ${
              isRedefiningInView ? "scale-100" : "scale-[1.04]"
            }`}
          >
            <Image
              src={redefiningData.image_url || "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=85"}
              alt="Pharmacist providing expert consultation at a modern dispensary"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover object-[center_35%]"
              style={{ filter: "saturate(1.0) contrast(1.04) brightness(1.01)" }}
            />
          </div>

          {/* Small frosted-glass caption pill sitting directly on the photo */}
          <div className="absolute bottom-8 right-8 xl:right-12 z-10 pointer-events-none select-none">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(15,42,74,0.08)] border border-[rgba(184,147,74,0.35)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B8934A] shrink-0" />
              <span className="tracking-wider text-[11px] sm:text-xs font-sans font-semibold uppercase text-[#0F2A4A]">
                Standardized Clinical Care
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column: Narrative Copy & 3 Equal Feature Cards */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-6 sm:space-y-7">
              {/* Eyebrow with thin gold lines on both sides */}
              <MotionReveal delay={60} direction="up">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span className="h-[1px] w-6 sm:w-8 bg-[#B8934A]/50" />
                  <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-sans font-semibold text-[#B8934A]">
                    {redefiningData.eyebrow_label}
                  </span>
                  <span className="h-[1px] w-6 sm:w-8 bg-[#B8934A]/50" />
                </div>
              </MotionReveal>

              {/* Main Heading with "Kerala" in italic gold & hairline with dot */}
              <MotionReveal delay={140} direction="up" className="!mt-3 sm:!mt-4">
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-semibold text-[#0F2A4A] tracking-tight leading-[1.10]">
                  {renderRedefiningHeading(redefiningData.heading)}
                </h2>
                {/* Thin gold hairline with a small dot beneath the heading */}
                <div className="flex items-center gap-1.5 mt-3.5 sm:mt-4" aria-hidden="true">
                  <span className="w-14 sm:w-16 h-[1.5px] bg-[#B8934A]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8934A]" />
                </div>
              </MotionReveal>

              {/* Description Paragraph */}
              <MotionReveal delay={200} direction="up">
                <div className="max-w-[60ch]">
                  {renderRedefiningDescription(redefiningData.description)}
                </div>
              </MotionReveal>

              {/* 3 Dynamic Feature Cards (White/Ivory, thin gold top border, navy ring badges) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-5 xl:gap-6 pt-3 sm:pt-5 items-stretch">
                {badgesList.map((badge: any, i: number) => {
                  const Icon = BADGE_ICONS[badge.icon] || ShieldCheck;
                  return (
                    <MotionReveal
                      key={i}
                      delay={260 + i * 90}
                      direction="up"
                      className="h-full flex flex-col"
                    >
                      <div className="group relative overflow-hidden rounded-[20px] sm:rounded-[24px] border border-[rgba(184,147,74,0.30)] hover:border-[rgba(184,147,74,0.70)] bg-white p-7 sm:p-8 shadow-[0_1px_2px_rgba(15,42,74,0.05),0_12px_32px_-12px_rgba(15,42,74,0.15)] hover:shadow-[0_4px_8px_rgba(15,42,74,0.06),0_20px_40px_-12px_rgba(15,42,74,0.20)] hover:-translate-y-1.5 transition-all duration-300 ease-out h-full flex flex-col justify-between">
                        {/* Top Gold Accent Bar */}
                        <div className="absolute top-0 left-0 w-12 group-hover:w-full h-[3px] bg-[#B8934A] rounded-full transition-all duration-300 ease-out z-10" />

                        <div>
                          {/* Icon Badge: Navy circle with gold icon */}
                          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#0F2A4A] ring-1 ring-[#B8934A]/40 ring-offset-2 ring-offset-white shadow-[0_4px_12px_rgba(15,42,74,0.20)] shrink-0 group-hover:scale-105 transition-all duration-300 mb-5">
                            <Icon className="h-5.5 w-5.5 text-[#B8934A] stroke-[2] drop-shadow-xs" />
                          </div>

                          <h3 className="font-serif text-[1.2rem] sm:text-[1.25rem] font-bold text-[#0F2A4A] tracking-tight leading-snug">
                            {badge.title}
                          </h3>

                          <p className="font-sans text-[13px] sm:text-[14px] text-[#0F2A4A]/75 mt-2 leading-[1.65] font-normal">
                            {badge.desc}
                          </p>
                        </div>
                      </div>
                    </MotionReveal>
                  );
                })}
              </div>
            </div>

            {/* Mobile/Tablet Fallback Photo */}
            <div className="block lg:hidden lg:col-span-5 w-full pt-4 sm:pt-6">
              <div
                className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-2xl"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, #000 0%, #000 70%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to bottom, #000 0%, #000 70%, transparent 100%)",
                }}
              >
                <div
                  className={`relative h-full w-full transition-transform duration-[1200ms] ease-out motion-reduce:transition-none motion-reduce:transform-none ${
                    isRedefiningInView ? "scale-100" : "scale-[1.04]"
                  }`}
                >
                  <Image
                    src={redefiningData.image_url || "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=85"}
                    alt="Pharmacist providing expert consultation at a modern dispensary"
                    fill
                    sizes="100vw"
                    className="object-cover object-[center_35%]"
                    style={{ filter: "saturate(1.0) contrast(1.04) brightness(1.01)" }}
                  />
                </div>

                {/* Mobile Frosted Caption Pill */}
                <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-6 z-10 pointer-events-none select-none">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-[12px] shadow-[0_4px_16px_rgba(15,42,74,0.08)] border border-[rgba(184,147,74,0.30)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#B8934A] shrink-0" />
                    <span className="tracking-tight text-[11.5px] font-sans font-medium text-[#0F2A4A]">
                      Standardized Clinical Care
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Product Categories */}
      <section className="relative overflow-hidden bg-[#B31942] py-24 sm:py-28 lg:py-32">
        {/* Seamless Healthcare Line-Icon Pattern in white */}
        <HealthcarePatternOverlay variant="white" opacity={0.075} />

        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12 space-y-12 sm:space-y-16">
          <MotionReveal direction="up">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="h-[1px] w-6 sm:w-8 bg-[#F0D9A0]/70" />
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-sans font-semibold text-white/90">
                  Dispensary Range
                </span>
                <span className="h-[1px] w-6 sm:w-8 bg-[#F0D9A0]/70" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-bold text-white tracking-tight leading-[1.10]">
                {renderStockHeading("What Our Pharmacies Stock")}
              </h2>
              {/* Gold hairline with small dot */}
              <div className="flex items-center gap-1.5 mt-3 sm:mt-3.5">
                <span className="w-16 sm:w-20 h-[1.5px] bg-[#F0D9A0]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0D9A0]" />
              </div>
              <p className="text-base sm:text-[17px] text-white/90 font-light leading-[1.7] pt-1 max-w-[60ch]">
                Comprehensive, verified product categories curated for essential community health, daily wellness, and family care.
              </p>
            </div>
          </MotionReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4.5 sm:gap-6 items-stretch">
            {categories.map((category, idx) => {
              const Icon = category.icon;
              return (
                <MotionReveal
                  key={category.title}
                  delay={idx * 90}
                  direction="up"
                  className={`h-full flex flex-col ${idx === 4 ? "col-span-2 sm:col-span-1" : "col-span-1"}`}
                >
                  <div className="group relative overflow-hidden rounded-[20px] sm:rounded-[24px] border border-[rgba(184,147,74,0.30)] hover:border-[rgba(184,147,74,0.70)] bg-white p-6 sm:p-7 shadow-[0_1px_2px_rgba(15,42,74,0.05),0_12px_32px_-12px_rgba(15,42,74,0.18)] hover:shadow-[0_4px_8px_rgba(15,42,74,0.06),0_20px_40px_-12px_rgba(15,42,74,0.22)] hover:-translate-y-1.5 transition-all duration-300 ease-out h-full flex flex-col justify-between">
                    <div className="absolute top-0 left-0 w-12 group-hover:w-full h-[3px] bg-[#B8934A] rounded-full transition-all duration-300 ease-out z-10" />
                    <div>
                      <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#0F2A4A] text-[#B8934A] ring-1 ring-[#B8934A]/40 ring-offset-2 ring-offset-white shadow-[0_4px_12px_rgba(15,42,74,0.22)] group-hover:scale-105 transition-all duration-300 shrink-0 mb-4">
                        <Icon className="h-5.5 w-5.5 stroke-[2] text-[#B8934A]" />
                      </div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0F2A4A] leading-snug">
                        {category.title}
                      </h3>
                      <p className="text-xs sm:text-[13.5px] text-[#0F2A4A]/75 mt-2 leading-[1.65] font-normal">
                        {category.desc}
                      </p>
                    </div>
                  </div>
                </MotionReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Pharmaceutical Partners */}
      <section className="relative overflow-hidden bg-[#FBF7F0] pt-24 sm:pt-28 lg:pt-32 pb-20 border-t border-[#0F2A4A]/10 border-b border-[#0F2A4A]/10">
        {/* Hexagon Honeycomb Network Overlay with visible line pattern */}
        <HexNetworkOverlay opacity={0.20} />

        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12 space-y-14 sm:space-y-18">
          <MotionReveal direction="up">
            <div className="text-center max-w-3xl mx-auto space-y-3.5">
              <div className="flex items-center justify-center gap-2.5 sm:gap-3">
                <span className="h-[1px] w-6 sm:w-8 bg-[#B8934A]/50" />
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-sans font-semibold text-[#B8934A]">
                  Authorized Distribution Network
                </span>
                <span className="h-[1px] w-6 sm:w-8 bg-[#B8934A]/50" />
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-[#0F2A4A] tracking-tight leading-[1.10]">
                {renderPartnersHeading("Our Pharmaceutical Partners")}
              </h2>

              {/* Gold hairline with small dot */}
              <div className="flex items-center justify-center gap-1.5 mt-3.5 sm:mt-4" aria-hidden="true">
                <span className="w-16 sm:w-20 h-[1.5px] bg-[#B8934A]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8934A]" />
              </div>

              <p className="text-base sm:text-[17px] text-[#0F2A4A]/80 font-normal max-w-[60ch] mx-auto leading-[1.7] pt-2">
                Authorized distribution partnerships with India&apos;s leading pharmaceutical and healthcare innovators, maintaining rigorous cold-chain custody and direct manufacturer integrity.
              </p>
            </div>
          </MotionReveal>

          {/* Luxury Showcase Pavilion Frame - Solid White Card on Coloured Band */}
          <div className="relative rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 lg:p-12 bg-white border border-[rgba(184,147,74,0.35)] shadow-[0_1px_2px_rgba(15,42,74,0.04),0_16px_48px_-12px_rgba(15,42,74,0.10)]">
            <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12 lg:gap-y-14">
              {partners.map((brand, i) => (
                <MotionReveal
                  key={brand.name}
                  delay={(i % 6) * 40}
                  direction="up"
                  className="w-[calc(50%-8px)] sm:w-[calc(33.333%-16px)] md:w-[calc(25%-18px)] xl:w-[calc(16.666%-20px)] flex justify-center"
                >
                  <PharmaPartnerCard brand={brand} />
                </MotionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width Solid Navy Band: Statewide Network */}
      <section className="relative overflow-hidden bg-[#173A6B] py-16 sm:py-20 lg:py-28 border-t border-[#0F2A4A]/20 border-b border-[#0F2A4A]/20 select-none">
        <div className="relative z-10 mx-auto max-w-5xl w-full px-6 sm:px-8 lg:px-12 text-center">
          <MotionReveal direction="up">
            <div className="space-y-4 sm:space-y-5 text-center">
              <div className="flex items-center justify-center gap-3">
                <span className="h-[1px] w-6 sm:w-10 bg-[#B8934A]" />
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-semibold text-[#B8934A] font-sans">
                  Statewide Network
                </span>
                <span className="h-[1px] w-6 sm:w-10 bg-[#B8934A]" />
              </div>

              <div className="space-y-3">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-[46px] font-bold text-white tracking-tight leading-[1.12] max-w-4xl mx-auto">
                  500+ Pharmacies Across Kerala — Trusted, Verified, Always Nearby
                </h2>
                <div className="mx-auto w-20 sm:w-28 h-[2px] rounded-full bg-[#B8934A]" />
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* 5. Dynamic Modern Community Dispensaries Storefront Banner */}
      <section className="relative overflow-hidden bg-[#EAEFF5] py-24 sm:py-28 lg:py-32 border-t border-[#0F2A4A]/10 border-b border-[#0F2A4A]/10">
        <div className="mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12 space-y-10 sm:space-y-12">
          <MotionReveal direction="up">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="h-[1px] w-6 sm:w-8 bg-[#B8934A]/50" />
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-sans font-semibold text-[#B8934A]">
                  {dispensariesData.eyebrow_label}
                </span>
                <span className="h-[1px] w-6 sm:w-8 bg-[#B8934A]/50" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-bold text-[#0F2A4A] tracking-tight leading-[1.10]">
                {renderDispensariesHeading(dispensariesData.heading)}
              </h2>
              {/* Thin gold hairline with a small dot beneath the heading */}
              <div className="flex items-center gap-1.5 mt-3.5 sm:mt-4" aria-hidden="true">
                <span className="w-14 sm:w-16 h-[1.5px] bg-[#B8934A]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8934A]" />
              </div>
              <p className="text-base sm:text-[17px] text-[#0F2A4A]/80 font-normal leading-[1.7] max-w-[60ch] pt-1">
                {dispensariesData.description}
              </p>
            </div>
          </MotionReveal>

          <MotionReveal delay={120} direction="up">
            {(() => {
              const servicesList = (
                dispensariesData.extra_data?.card_subtitle
                  ? dispensariesData.extra_data.card_subtitle.split("•").map((s: string) => s.trim())
                  : ["Prescriptions", "Healthcare Products", "Personal Care", "Baby Care", "Wellness"]
              ).filter(Boolean);

              return (
                <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] border border-[rgba(184,147,74,0.35)] ring-1 ring-[#B8934A]/20 shadow-[0_1px_2px_rgba(15,42,74,0.06),0_20px_50px_-12px_rgba(15,42,74,0.22)] group bg-[#0F2A4A] flex flex-col lg:flex-row lg:h-[490px]">
                  {/* Left Column: Image (56% desktop width) */}
                  <div className="relative w-full lg:w-[56%] aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden shrink-0">
                    <Image
                      src={dispensariesData.image_url || "/images/banners/pharmacy-storefront.jpeg"}
                      alt="Lamstone Healthcare Pharmacy storefront with modern glass dispensary and clean exterior"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 750px"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-600 ease-out"
                      style={{ objectPosition: "50% 15%" }}
                    />
                    {/* Soft gradient on image's right edge blending into the navy panel */}
                    <div className="hidden lg:block absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent via-[#0F2A4A]/40 to-[#0F2A4A] pointer-events-none z-10" />
                    {/* Mobile/tablet blend into panel below */}
                    <div className="lg:hidden absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0F2A4A] to-transparent pointer-events-none z-10" />
                  </div>

                  {/* Right Column: Info Panel (44% desktop width) - NAVY card with white text and gold accents */}
                  <div className="relative w-full lg:w-[44%] flex flex-col justify-between p-8 sm:p-10 lg:p-12 bg-gradient-to-br from-[#0F2A4A] via-[#173A6B] to-[#0F2A4A] text-white z-10 space-y-7 lg:space-y-0">
                    {/* Top: Gold Pill Badge */}
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#B8934A]/15 border border-[#B8934A]/35 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#B8934A] shadow-xs">
                        <Building2 className="h-3.5 w-3.5 text-[#B8934A]" />
                        {dispensariesData.extra_data?.badge_tag || "Unified Pharmacy Network"}
                      </span>
                    </div>

                    {/* Middle: Title, Gold Divider Line, & 2-Column Services List */}
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h3 className="font-serif text-3xl sm:text-4xl lg:text-[38px] font-medium tracking-tight text-white leading-[1.15]">
                          {dispensariesData.extra_data?.card_title || "Lamstone Healthcare Pharmacy"}
                        </h3>
                        <div className="h-[2px] w-14 bg-[#B8934A] rounded-full" />
                      </div>

                      {/* Tidy 2-column list with gold diamond bullets */}
                      <div className="grid grid-cols-2 gap-x-5 gap-y-3 pt-1">
                        {servicesList.map((service, idx) => (
                          <div key={idx} className="flex items-center gap-2.5">
                            <span className="h-1.5 w-1.5 rotate-45 bg-[#B8934A] shrink-0 shadow-[0_0_8px_rgba(184,147,74,0.6)]" />
                            <span className="text-xs sm:text-sm text-white/90 font-light tracking-wide">
                              {service}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom: Gold/White Outline Button */}
                    {dispensariesData.primary_cta_label && (
                      <div className="pt-2 lg:pt-0">
                        <Link
                          href={dispensariesData.primary_cta_url || "/contact"}
                          className="group/btn inline-flex items-center justify-center gap-2.5 rounded-full border border-[#B8934A] bg-transparent hover:bg-[#B8934A] text-white hover:text-[#0F2A4A] px-7 py-3 text-xs sm:text-[12.5px] font-sans font-semibold uppercase tracking-[0.14em] transition-all duration-300 cursor-pointer"
                        >
                          <span>{dispensariesData.primary_cta_label}</span>
                          <span className="text-white group-hover/btn:text-[#0F2A4A] transition-all duration-300 group-hover/btn:translate-x-1">→</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </MotionReveal>
        </div>
      </section>

      {/* 6. Pharmacy Locations Directory */}
      <section id="locations" className="relative overflow-hidden bg-[#173A6B] text-white py-24 sm:py-32 scroll-mt-24 border-t border-[#0F2A4A]/20">
        <div className="mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12 space-y-12 sm:space-y-14">
          <MotionReveal direction="up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span className="h-[1px] w-6 sm:w-8 bg-[#F0D9A0]/70" />
                  <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-sans font-semibold text-white/90">
                    Store Locator
                  </span>
                  <span className="h-[1px] w-6 sm:w-8 bg-[#F0D9A0]/70" />
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-bold text-white tracking-tight leading-[1.10]">
                  {renderLocationsHeading("Our Established Pharmacy Locations")}
                </h2>
                {/* Gold hairline with small dot */}
                <div className="flex items-center gap-1.5 mt-3.5 sm:mt-4" aria-hidden="true">
                  <span className="w-16 sm:w-20 h-[1.5px] bg-[#F0D9A0]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F0D9A0]" />
                </div>
                <p className="text-base sm:text-[17px] text-[#FBF7F0]/90 font-light leading-[1.7] max-w-2xl pt-1">
                  Discover Lamstone pharmacy network branches actively serving communities across Kerala.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowTableView((prev) => !prev)}
                    aria-expanded={showTableView}
                    aria-controls="pharmacy-directory-table"
                    className={`group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.14em] border transition-all duration-200 cursor-pointer shadow-xs ${
                      showTableView
                        ? "bg-[#B8934A] text-white border-[#B8934A]"
                        : "bg-[#0F2A4A] text-white hover:bg-[#0B1E36] border-[#B8934A]/40"
                    }`}
                  >
                    <Table className="h-3.5 w-3.5 text-[#B8934A]" />
                    <span>{showTableView ? "Hide Directory Table" : "View Directory Table"}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#B8934A] transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                  </button>
                </div>
              </div>

              {/* District Filter Chips */}
              <div className="flex flex-wrap gap-2">
                {districts.map((district) => (
                  <button
                    key={district}
                    type="button"
                    onClick={() => setSelectedDistrict(district)}
                    className={`px-4 py-2 rounded-full text-xs font-sans font-semibold uppercase tracking-[0.08em] transition-all duration-200 cursor-pointer shadow-xs ${
                      selectedDistrict === district
                        ? "bg-[#B8934A] text-white"
                        : "bg-[#0F2A4A] text-white/80 hover:text-white hover:bg-[#0B1E36] border border-[#B8934A]/35"
                    }`}
                  >
                    {district}
                  </button>
                ))}
              </div>
            </div>
          </MotionReveal>

          {/* Location Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {filteredLocations.map((pharmacy) => (
              <MotionReveal key={pharmacy.name} delay={60} direction="up" className="h-full flex flex-col">
                <div className="group rounded-[20px] sm:rounded-[24px] border border-[rgba(184,147,74,0.30)] hover:border-[rgba(184,147,74,0.70)] bg-white p-6 shadow-[0_4px_20px_rgba(11,30,54,0.20)] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between">
                  <div className="absolute top-0 left-0 w-12 group-hover:w-full h-[3px] bg-[#B8934A] rounded-full transition-all duration-300 ease-out z-10" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex rounded-full bg-[#B8934A]/15 px-3 py-1 text-[11px] font-semibold text-[#0F2A4A] border border-[#B8934A]/25 tracking-wide">
                        {pharmacy.district}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Operational
                      </span>
                    </div>
                    <h3 className="font-serif text-lg sm:text-[1.25rem] font-bold text-[#0F2A4A] group-hover:text-[#B8934A] transition-colors leading-snug mt-2 mb-2">
                      {pharmacy.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 flex items-start gap-2 text-xs sm:text-[13px] text-[#0F2A4A]/75 leading-relaxed border-t border-[#0F2A4A]/08">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#B8934A] mt-0.5" />
                    <span>{pharmacy.locality}</span>
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>

          {/* Directory Table View (Toggleable) */}
          <div
            id="pharmacy-directory-table"
            role="region"
            aria-label="Pharmacy directory table"
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              showTableView ? "max-h-[2000px] opacity-100 mt-8" : "max-h-0 opacity-0 mt-0 pointer-events-none"
            }`}
          >
            <div className="rounded-2xl border border-[#B8934A]/30 bg-white shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#0F2A4A]/10 bg-[#FBF7F0] flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F2A4A]">
                  Complete Store Directory ({filteredLocations.length} Locations)
                </span>
                <span className="text-xs text-[#0F2A4A]/70">Sorted by district</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-[#0F2A4A]/10 bg-[#FBF7F0] text-xs text-[#0F2A4A] uppercase font-semibold">
                    <tr>
                      <th scope="col" className="py-3 px-6 font-semibold">Store Name</th>
                      <th scope="col" className="py-3 px-6 font-semibold">Locality / Area</th>
                      <th scope="col" className="py-3 px-6 font-semibold">District</th>
                      <th scope="col" className="py-3 px-6 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0F2A4A]/10">
                    {filteredLocations.map((pharmacy, i) => (
                      <tr key={i} className="hover:bg-[#FBF7F0]/80 transition-colors">
                        <td className="py-4 px-6 font-medium text-[#0F2A4A]">{pharmacy.name}</td>
                        <td className="py-4 px-6 text-[#0F2A4A]/80">{pharmacy.locality}</td>
                        <td className="py-4 px-6">
                          <span className="inline-flex rounded-full bg-[#B8934A]/15 border border-[#B8934A]/30 px-2.5 py-0.5 text-xs text-[#0F2A4A] font-medium">
                            {pharmacy.district}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right text-xs font-semibold text-emerald-700">Operational</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Dynamic Partnership Callout */}
      <section className="relative overflow-hidden bg-[#F1E2CC] py-24 sm:py-32 border-t border-[#0F2A4A]/10 text-center">
        {/* Subtle gold top and bottom hairlines */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-[rgba(184,147,74,0.40)] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-[rgba(184,147,74,0.40)] pointer-events-none" aria-hidden="true" />

        <div className="mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl space-y-6">
            <MotionReveal direction="up">
              <div className="flex items-center justify-center gap-2.5 sm:gap-3 mb-3">
                <span className="h-[1px] w-6 sm:w-8 bg-[#B8934A]/50" />
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-sans font-semibold text-[#B8934A]">
                  Partnership Pathways
                </span>
                <span className="h-[1px] w-6 sm:w-8 bg-[#B8934A]/50" />
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-bold text-[#0F2A4A] tracking-tight leading-[1.10]">
                {renderCtaHeading(ctaBannerData.heading)}
              </h2>

              {/* Gold hairline with small dot */}
              <div className="flex items-center justify-center gap-1.5 mt-3.5 sm:mt-4" aria-hidden="true">
                <span className="w-16 sm:w-20 h-[1.5px] bg-[#B8934A]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8934A]" />
              </div>

              <p className="text-base sm:text-[17px] text-[#0F2A4A]/80 font-normal leading-[1.7] mt-4 max-w-[60ch] mx-auto">
                {ctaBannerData.description}
              </p>
              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => setPartnerModalOpen(true)}
                  className="group relative inline-flex items-center justify-center gap-2.5 rounded-full bg-[#0F2A4A] hover:bg-[#173A6B] text-white pl-8 pr-3.5 py-3.5 text-xs sm:text-[13px] font-sans font-semibold uppercase tracking-[0.16em] shadow-[0_4px_16px_rgba(15,42,74,0.18)] hover:shadow-[0_8px_24px_rgba(15,42,74,0.28)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
                >
                  <span>{ctaBannerData.primary_cta_label}</span>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#B8934A] text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
                    <ArrowRight className="h-3.5 w-3.5 text-white group-hover:translate-x-0.5 transition-transform duration-200" />
                  </div>
                </button>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      <FormModal
        isOpen={partnerModalOpen}
        onClose={() => setPartnerModalOpen(false)}
        title="Pharmacy Partnership"
        subtitle="Connect with Lamstone regarding pharmacy acquisition, branding, or retail franchise."
        badge="Network Expansion"
        apiEndpoint="/api/partnership"
        extraPayload={{ inquiry_type: "pharmacy_partner" }}
        fields={[
          { name: "name", label: "Full Name", required: true, placeholder: "Your full name" },
          { name: "email", label: "Email Address", type: "email", required: true, placeholder: "you@email.com" },
          { name: "phone", label: "Phone Number", type: "tel", required: true, placeholder: "+91 XXXXX XXXXX" },
          {
            name: "message",
            label: "Pharmacy & Locality Details",
            required: true,
            rows: 3,
            placeholder: "Current pharmacy name, district, daily turnover or partnership interest…",
          },
        ]}
        successMessage="Thank you for reaching out! Our pharmacy acquisition and partnership team will review your details and contact you within 24 hours."
      />
    </div>
  );
}
