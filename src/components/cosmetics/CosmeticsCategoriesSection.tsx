"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import MotionReveal from "@/components/MotionReveal";
import FormModal from "@/components/modals/FormModal";
import { Check } from "lucide-react";

export interface CategoryItem {
  title: string;
  slug: "skincare" | "personal_care" | "healthcare_cosmetics";
  subtitle: string;
  description: string;
  items: string[];
  imageUrl: string;
  imageAlt: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    title: "Skincare",
    slug: "skincare",
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
    slug: "personal_care",
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
    slug: "healthcare_cosmetics",
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

export default function CosmeticsCategoriesSection() {
  const [categories, setCategories] = useState<CategoryItem[]>(CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);

  useEffect(() => {
    fetch("/api/product-categories?page=cosmetics")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && data.categories.length > 0) {
          setCategories(
            data.categories.map((c: any) => ({
              title: c.title,
              slug: (c.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "_"),
              subtitle: c.subtitle || "",
              description: c.description || "",
              items: Array.isArray(c.features_json) ? c.features_json : [],
              imageUrl: c.image_url || "/images/cosmetics/category-skincare.jpg",
              imageAlt: `Lamstone ${c.title} collection`,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {categories.map((category, idx) => (
          <MotionReveal key={idx} delay={idx * 130} direction="up" className="h-full flex flex-col">
            <div className="group relative overflow-hidden flex flex-col justify-between rounded-[24px] bg-white p-7 sm:p-8 border border-[rgba(184,147,74,0.30)] hover:border-[rgba(184,147,74,0.70)] shadow-[0_1px_2px_rgba(15,42,74,0.05),0_12px_32px_-12px_rgba(15,42,74,0.18)] hover:shadow-[0_4px_8px_rgba(15,42,74,0.06),0_20px_40px_-12px_rgba(15,42,74,0.22)] hover:-translate-y-1.5 transition-all duration-300 ease-out h-full w-full">
              {/* Thin gold top accent border */}
              <div className="absolute top-0 left-0 w-12 group-hover:w-full h-[3px] bg-[#B8934A] rounded-full transition-all duration-300 ease-out z-10" />

              <div className="space-y-6 flex-1 flex flex-col">
                <div className="overflow-hidden rounded-xl aspect-[16/10] relative shrink-0">
                  <Image
                    src={category.imageUrl}
                    alt={category.imageAlt}
                    fill
                    className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                </div>
                <div className="shrink-0">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8934A]">
                    Category 0{idx + 1}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#0F2A4A] mt-1.5 leading-snug">
                    {category.title}
                  </h3>
                  <p className="text-xs text-[#0F2A4A]/70 font-sans font-medium uppercase tracking-wider mt-1">
                    {category.subtitle}
                  </p>
                </div>
                <p className="text-sm text-[#0F2A4A]/80 font-normal leading-[1.65] flex-1">
                  {category.description}
                </p>
                <ul className="space-y-2.5 pt-3 border-t border-[#0F2A4A]/10 shrink-0">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-[13.5px] text-[#0F2A4A]/85">
                      <Check className="h-4 w-4 shrink-0 text-[#B8934A] mt-0.5 stroke-[2.5]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-[#0F2A4A]/10 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className="w-full inline-flex items-center justify-center rounded-full py-3 px-5 text-xs sm:text-[12.5px] font-sans font-semibold uppercase tracking-[0.14em] border-2 border-[#0F2A4A] text-[#0F2A4A] bg-transparent hover:bg-[#0F2A4A] hover:text-white transition-all duration-300 shadow-2xs cursor-pointer"
                >
                  Inquire Distribution
                </button>
              </div>
            </div>
          </MotionReveal>
        ))}
      </div>

      <FormModal
        isOpen={selectedCategory !== null}
        onClose={() => setSelectedCategory(null)}
        title="Inquire Distribution"
        subtitle={
          selectedCategory
            ? `Partner with Lamstone for ${selectedCategory.title} retail & distribution.`
            : ""
        }
        badge="Distribution Inquiry"
        apiEndpoint="/api/distribution"
        extraPayload={{ category: selectedCategory?.slug ?? "skincare" }}
        fields={[
          { name: "name", label: "Full Name", required: true, placeholder: "Your full name" },
          { name: "email", label: "Email Address", type: "email", required: true, placeholder: "you@company.com" },
          { name: "phone", label: "Phone Number", type: "tel", required: true, placeholder: "+91 XXXXX XXXXX" },
          { name: "company", label: "Company / Store Name", required: true, placeholder: "Your business name" },
          {
            name: "message",
            label: "Inquiry Details",
            required: true,
            rows: 3,
            placeholder: "Tell us about your retail network or distribution requirements…",
          },
        ]}
        successMessage="Thank you for your distribution inquiry. Our commercial distribution team will review your requirements and respond within 24 hours."
      />
    </>
  );
}
