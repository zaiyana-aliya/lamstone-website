"use client";

import React, { useState } from "react";
import Image from "next/image";
import HeroBanner from "@/components/HeroBanner";
import CTAButton from "@/components/CTAButton";
import MotionReveal from "@/components/MotionReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import { MapPin, ShieldCheck, Building2, Clock, PhoneCall } from "lucide-react";

interface PharmacyLocation {
  name: string;
  locality: string;
  district: string;
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

export default function PharmacyChainPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");

  const districts = [
    "All",
    ...Array.from(new Set(PHARMACY_LOCATIONS.map((loc) => loc.district))),
  ];

  const filteredLocations =
    selectedDistrict === "All"
      ? PHARMACY_LOCATIONS
      : PHARMACY_LOCATIONS.filter((loc) => loc.district === selectedDistrict);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Cinematic Hero Banner matching About page pattern */}
      <HeroBanner
        eyebrow="Pharmacy Network"
        title="Trusted Medicines. Every Neighborhood."
        description="Expanding access to authentic, high-quality pharmaceuticals across Kerala through community-first dispensaries and expert pharmacist care."
        imageUrl="/images/banners/pharmacy-interior-shelves.jpg"
        imageAlt="Modern pharmacy dispensary interior with organized medicine shelving"
        theme="green"
        heightClassName="min-h-[70vh]"
      >
        <CTAButton href="#locations" variant="primary">
          Our Pharmacies
        </CTAButton>
        <CTAButton href="/contact" variant="outline-light">
          Partner With Us
        </CTAButton>
      </HeroBanner>

      {/* 2. Stats Row */}
      <section className="bg-primary border-y border-white/10 py-10 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-white text-center">
            {[
              { value: 500, suffix: "+", label: "Pharmacies (Target)" },
              { value: 8, suffix: "", label: "Active Locations" },
              { value: 14, suffix: "", label: "Kerala Districts" },
            ].map((stat, i) => (
              <MotionReveal key={i} delay={i * 120} direction="up">
                <div className="space-y-1">
                  <div className="font-serif text-4xl sm:text-5xl font-semibold text-gold">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-xs uppercase tracking-widest text-emerald-100/70 font-medium">
                    {stat.label}
                  </p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Strategic Vision Overview */}
      <section className="bg-white py-20 sm:py-28 px-6 sm:px-8 lg:px-12 border-b border-border-subtle">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <MotionReveal delay={100} direction="right">
                <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-3.5 py-1 text-xs font-semibold text-gold-dark uppercase tracking-wider">
                  Statewide Integration
                </div>
              </MotionReveal>
              <MotionReveal delay={220} direction="right">
                <h2 className="font-serif text-3xl sm:text-4xl font-medium text-primary tracking-tight">
                  Redefining Pharmaceutical Retail in Kerala
                </h2>
              </MotionReveal>
              <MotionReveal delay={340} direction="right">
                <p className="text-base sm:text-lg text-charcoal leading-relaxed font-light">
                  Lamstone is strategically acquiring and integrating 500+ pharmacies across Kerala. We unite neighborhood accessibility with institutional pharmacy rigor, cold-chain integrity, and digitized prescription fulfillment.
                </p>
              </MotionReveal>
              <MotionReveal delay={440} direction="right">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 items-stretch">
                  {[
                    { icon: ShieldCheck, title: "100% Authentic", desc: "Verified pharmaceutical sourcing & safety." },
                    { icon: Building2, title: "500+ Goal", desc: "Expanding across all 14 districts." },
                    { icon: Clock, title: "Expert Care", desc: "Registered pharmacists for consultations." },
                  ].map(({ icon: Icon, title, desc }, i) => (
                    <div key={i} className="group rounded-xl border border-border-subtle p-5 bg-ivory hover:shadow-md hover:scale-[1.03] transition-all duration-300 h-full flex flex-col justify-between">
                      <div>
                        <Icon className="h-6 w-6 text-gold mb-2" />
                        <h4 className="font-serif text-lg font-semibold text-primary">{title}</h4>
                        <p className="text-xs text-charcoal-muted mt-1">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </MotionReveal>
            </div>

            <MotionReveal className="lg:col-span-5" delay={80} direction="left">
              <div className="overflow-hidden rounded-2xl shadow-xl aspect-4/3 relative group">
                <Image
                  src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=85"
                  alt="Pharmacist providing expert consultation at a modern dispensary"
                  fill
                  className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent rounded-2xl" />
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* Storefront Feature — Secondary custom banner before locations */}
      <section className="bg-white py-16 sm:py-24 px-6 sm:px-8 lg:px-12 border-b border-border-subtle">
        <div className="mx-auto max-w-7xl space-y-8">
          <MotionReveal direction="up">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-gold" />
                <span className="text-xs uppercase tracking-widest font-semibold text-gold-dark">
                  Physical Footprint
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-primary tracking-tight">
                Modern Community Dispensaries
              </h2>
              <p className="text-base text-charcoal-muted font-light">
                Standardized, clinical dispensary storefronts combining transparent pharmacy service with genuine personal care access.
              </p>
            </div>
          </MotionReveal>

          <MotionReveal delay={120} direction="up">
            <div className="relative overflow-hidden rounded-3xl border border-border-subtle shadow-xl group">
              <div className="relative w-full aspect-16/10 sm:aspect-21/9 min-h-[300px] max-h-[620px] overflow-hidden">
                <Image
                  src="/images/banners/pharmacy-storefront.jpeg"
                  alt="Lamstone Healthcare Pharmacy storefront with modern glass dispensary and clean exterior"
                  fill
                  sizes="100vw"
                  className="object-cover object-center group-hover:scale-[1.025] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
                  <div className="space-y-1.5 max-w-xl">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                      <Building2 className="h-3.5 w-3.5" />
                      Unified Pharmacy Network
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-medium tracking-tight drop-shadow-sm">
                      Lamstone Healthcare Pharmacy
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-50/90 font-light drop-shadow-xs">
                      Prescriptions • Healthcare Products • Personal Care • Baby Care • Wellness
                    </p>
                  </div>
                  <CTAButton href="/contact" variant="primary" size="sm" className="self-start sm:self-auto">
                    Partner With Us
                  </CTAButton>
                </div>
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* 4. Pharmacy Locations Directory */}
      <section id="locations" className="bg-cream py-24 sm:py-32 px-6 sm:px-8 lg:px-12 scroll-mt-24">
        <div className="mx-auto max-w-7xl space-y-12">
          <MotionReveal direction="up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="h-px w-6 bg-gold" />
                  <span className="text-xs uppercase tracking-widest font-semibold text-gold-dark">
                    Store Locator
                  </span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-medium text-primary tracking-tight">
                  Our Established Pharmacy Locations
                </h2>
                <p className="text-base text-charcoal-muted font-light">
                  Discover Lamstone pharmacy network branches actively serving communities across Kerala.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {districts.map((district) => (
                  <button
                    key={district}
                    type="button"
                    onClick={() => setSelectedDistrict(district)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer hover:scale-[1.04] ${
                      selectedDistrict === district
                        ? "bg-primary text-white shadow-xs"
                        : "bg-white text-charcoal-muted hover:bg-white/80 border border-border-subtle"
                    }`}
                  >
                    {district}
                  </button>
                ))}
              </div>
            </div>
          </MotionReveal>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {filteredLocations.map((pharmacy, idx) => (
              <MotionReveal key={idx} delay={idx * 80} direction="up" className="h-full flex flex-col">
                <div className="group flex flex-col justify-between rounded-xl border border-border-subtle bg-white p-6 shadow-2xs hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 h-full w-full">
                  <div className="space-y-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-between shrink-0">
                      <span className="inline-flex items-center rounded-md bg-gold/15 px-2.5 py-0.5 text-[11px] font-semibold text-gold-dark">
                        {pharmacy.district}
                      </span>
                      <span className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-gold transition-colors">
                        <MapPin className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-xl font-medium text-primary">{pharmacy.name}</h3>
                      <p className="text-sm text-charcoal-muted font-light mt-2 flex items-center gap-2">
                        <Image
                          src="/images/pharmacy/locationicon.png"
                          alt="Location"
                          width={16}
                          height={16}
                          className="h-4 w-4 object-contain shrink-0"
                        />
                        <span>{pharmacy.locality}</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-primary font-medium shrink-0">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                      Open &amp; Dispensing
                    </span>
                    <a href="tel:+919746397686" className="hover:text-gold transition-colors inline-flex items-center gap-1">
                      <PhoneCall className="h-3 w-3" />
                      Call
                    </a>
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>

          {/* Table View */}
          <MotionReveal delay={200} direction="up">
            <div className="mt-12 overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-2xs">
              <div className="px-6 py-4 border-b border-border-subtle bg-ivory">
                <h3 className="font-serif text-lg font-medium text-primary">Directory Table View</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border-subtle bg-neutral-50/70 text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
                      <th className="py-3.5 px-6">Pharmacy Name</th>
                      <th className="py-3.5 px-6">Locality</th>
                      <th className="py-3.5 px-6">District</th>
                      <th className="py-3.5 px-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle text-charcoal">
                    {filteredLocations.map((pharmacy, i) => (
                      <tr key={i} className="hover:bg-ivory/80 transition-colors">
                        <td className="py-4 px-6 font-medium text-primary">{pharmacy.name}</td>
                        <td className="py-4 px-6 text-charcoal-muted">{pharmacy.locality}</td>
                        <td className="py-4 px-6">
                          <span className="inline-flex rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
                            {pharmacy.district}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right text-xs font-medium text-emerald-700">Operational</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* 5. Partnership Callout */}
      <section className="bg-ivory py-20 px-6 sm:px-8 lg:px-12 border-t border-border-subtle text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <MotionReveal direction="up">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-primary">
              Are You a Pharmacy Owner Interested in Joining Lamstone?
            </h2>
            <p className="text-base text-charcoal-muted font-light leading-relaxed mt-4">
              We partner with independent pharmacy owners across Kerala, offering transparent acquisition pathways and growth models.
            </p>
            <div className="pt-4">
              <CTAButton href="/contact" variant="primary" size="lg">
                Explore Pharmacy Partnership
              </CTAButton>
            </div>
          </MotionReveal>
        </div>
      </section>
    </div>
  );
}
