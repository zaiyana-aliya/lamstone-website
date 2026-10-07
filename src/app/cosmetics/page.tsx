import type { Metadata } from "next";
import CTAButton from "@/components/CTAButton";
import HeroBanner from "@/components/HeroBanner";
import MotionReveal from "@/components/MotionReveal";
import { Check } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Cosmetics Division — Lamstone HealthCare",
  description:
    "Lamstone Cosmetic Division is dedicated to bringing premium skincare, beauty, and personal care solutions to consumers through a robust distribution network.",
};

const BRANDS = [
  { name: "Lotus", tag: "Botanical & Natural", logo: "/images/brands/lotus.png" },
  { name: "Mamaearth", tag: "Toxin-Free Beauty", logo: "/images/brands/mamaearth.png" },
  { name: "Ponds", tag: "Classic Skincare", logo: "/images/brands/ponds.png" },
  { name: "Cetaphil", tag: "Dermatologist Recommended", logo: "/images/brands/cetaphil.png" },
  { name: "Lakmé", tag: "Iconic Color & Care", logo: "/images/brands/lakme.jpg" },
  { name: "Dove", tag: "Nourishing Care", logo: "/images/brands/dove.png" },
  { name: "Jovees", tag: "Herbal Formulations", logo: "/images/brands/jovees.jpg" },
  { name: "Sebamed", tag: "pH 5.5 Clinical Skincare", logo: "/images/brands/sebamed.jpg" },
  { name: "Femisafe", tag: "Intimate & Personal Wellness", logo: "/images/brands/femisafe.jpg" },
];

const CATEGORIES = [
  {
    title: "Skincare",
    subtitle: "Facial Care & Dermatological Formulations",
    description: "Engineered to cleanse, nourish, protect, and restore skin health across all skin types.",
    items: [
      "Deep Cleanse & Purifying Cleansers",
      "Barrier Repair & Hydration Creams",
      "Advanced Serums & Targeted Formulations",
      "Clinical Sunscreens & UV Protection",
      "Rejuvenating Night Creams & Treatments",
    ],
    imageUrl: "/images/cosmetics/category-skincare.jpg",
    imageAlt: "Lamstone Skincare collection featuring dermatological formulations",
  },
  {
    title: "Personal Care",
    subtitle: "Daily Wellness & Body Essentials",
    description: "Everyday hygienic and nourishing solutions sourced from internationally trusted brands.",
    items: [
      "Nourishing Shampoos & Conditioners",
      "Botanical & Antibacterial Body Washes",
      "Gentle Hydrating Soaps & Bath Bars",
      "Complete Oral Hygiene & Dental Care",
      "Therapeutic Hair Oils & Scalp Tonics",
    ],
    imageUrl: "/images/cosmetics/category-personal-care.png",
    imageAlt: "Lamstone Personal Care collection featuring daily body wellness essentials",
  },
  {
    title: "Healthcare Cosmetics",
    subtitle: "Medicated & Therapeutic Topicals",
    description: "Targeted formulations bridging cosmetic aesthetics with clinical dermatological efficacy.",
    items: [
      "Clinical Dermatological Ointments",
      "Medicated Hypoallergenic Soaps",
      "Intensive Barrier & Eczema Creams",
      "Therapeutic Scalp & Skin Treatments",
      "Post-Procedure Recovery Topicals",
    ],
    imageUrl: "/images/cosmetics/category-healthcare-cosmetics.png",
    imageAlt: "Lamstone Healthcare Cosmetics therapeutic topicals and medicated skincare",
  },
];

export default function CosmeticsPage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Cinematic Hero — Flat-lay of skincare & beauty products */}
      <HeroBanner
        eyebrow="Distribution & Retail"
        title="Cosmetics Division"
        description="Lamstone Cosmetic Division is dedicated to bringing premium skincare, beauty, and personal care solutions to consumers through a robust and expanding distribution network."
        imageUrl="/images/cosmetics/desktop.png"
        imageAlt="Lamstone Cosmetics Division collection showcasing global personal care products"
        theme="green"
        heightClassName="min-h-[70vh]"
      >
        <CTAButton href="/contact" variant="primary">
          Contact Distribution
        </CTAButton>
      </HeroBanner>

      {/* 2. Multi-Brand Portfolio — 9 Recognized Global Brands */}
      <section className="bg-white py-24 sm:py-32 px-6 sm:px-8 lg:px-12 border-b border-border-subtle">
        <div className="mx-auto max-w-7xl space-y-12">
          <MotionReveal direction="up">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold-dark uppercase tracking-wider">
                Authorized Distribution
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-primary tracking-tight">
                Our Multi-Brand Portfolio
              </h2>
              <p className="text-base text-charcoal-muted font-light">
                Partnered with globally established beauty, dermatological, and personal care manufacturers.
              </p>
            </div>
          </MotionReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {BRANDS.map((brand, i) => (
              <MotionReveal key={i} delay={i * 70} direction="up">
                <div className="group relative flex flex-col items-center justify-between min-h-[160px] rounded-2xl border border-border-subtle bg-white p-6 text-center shadow-2xs hover:border-gold/60 hover:shadow-xl hover:scale-[1.04] hover:-translate-y-1.5 transition-all duration-300 cursor-default">
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative h-14 w-full flex items-center justify-center p-1">
                    <Image
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      width={120}
                      height={48}
                      className="max-h-12 w-auto max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <span className="font-serif text-lg font-semibold tracking-wide text-primary group-hover:text-gold-dark transition-colors block">
                      {brand.name}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider text-charcoal-muted font-medium block mt-0.5">
                      {brand.tag}
                    </span>
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Product Categories */}
      <section className="bg-cream py-24 sm:py-32 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl space-y-16">
          <MotionReveal direction="up">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-gold" />
                <span className="text-xs uppercase tracking-widest font-semibold text-gold-dark">
                  Product Pillars
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-primary tracking-tight">
                Product Categories
              </h2>
            </div>
          </MotionReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {CATEGORIES.map((category, idx) => (
              <MotionReveal key={idx} delay={idx * 130} direction="up">
                <div className="group flex flex-col justify-between rounded-2xl border border-border-subtle bg-white p-8 shadow-xs hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300">
                  <div className="space-y-6">
                    {/* Premium Unsplash category image */}
                    <div className="overflow-hidden rounded-xl aspect-16/10 relative">
                      <Image
                        src={category.imageUrl}
                        alt={category.imageAlt}
                        fill
                        className="object-cover object-center group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark">
                        Category 0{idx + 1}
                      </span>
                      <h3 className="font-serif text-2xl font-medium text-primary mt-1">{category.title}</h3>
                      <p className="text-xs text-charcoal-muted font-medium uppercase tracking-wider mt-1">
                        {category.subtitle}
                      </p>
                    </div>
                    <p className="text-sm text-charcoal-muted font-light leading-relaxed">{category.description}</p>
                    <ul className="space-y-2.5 pt-2 border-t border-border-subtle/80">
                      {category.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-charcoal">
                          <Check className="h-4 w-4 shrink-0 text-gold-dark mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-8 mt-6 border-t border-border-subtle/60">
                    <CTAButton href="/contact" variant="outline" size="sm" className="w-full justify-center">
                      Inquire Distribution
                    </CTAButton>
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="bg-ivory py-20 px-6 sm:px-8 lg:px-12 border-t border-border-subtle text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <MotionReveal direction="up">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-primary">
              Partner With Lamstone as a Retailer or Brand Supplier
            </h2>
            <p className="text-base text-charcoal-muted font-light leading-relaxed mt-3">
              Gain access to a statewide retail footprint and professional logistics infrastructure.
            </p>
            <div className="pt-4">
              <CTAButton href="/contact" variant="primary" size="lg">
                Contact Distribution Team
              </CTAButton>
            </div>
          </MotionReveal>
        </div>
      </section>
    </div>
  );
}
