"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import MotionReveal from "@/components/MotionReveal";
import FormModal from "@/components/modals/FormModal";
import { Clock, ArrowRight, ExternalLink } from "lucide-react";

export interface LameProduct {
  id: string;
  category: string;
  name: string;
  tag: string;
  detail?: string;
  description: string;
  highlights: string[];
  imageUrl: string;
  imageAlt: string;
  isLive: boolean;
  storeUrl?: string;
}

const SIGNATURE_PRODUCTS: LameProduct[] = [
  {
    id: "gel-cleanser",
    category: "Cleanser",
    name: "2% Salicylic Acid Gel Cleanser",
    tag: "Active BHA Exfoliant",
    detail: "Gentle Pore-Refining Cleanser",
    description:
      "Deep-cleansing clinical gel formulated with 2% salicylic acid to exfoliate dead skin cells, clear congested pores, and prevent acne formation while maintaining natural barrier hydration.",
    highlights: ["Exfoliate dead skin", "Prevent acne formation"],
    imageUrl: "/images/products/facewash.jpeg",
    imageAlt: "Lamé 2% Salicylic Acid Gel Cleanser",
    isLive: false,
  },
  {
    id: "body-scrub",
    category: "Body Care",
    name: "Derma Polish Body Scrub",
    tag: "Micro-Exfoliation Polish",
    detail: "Pollution Defense & Renewal",
    description:
      "Gentle dermocosmetic body scrub engineered to eliminate environmental pollutants and dead cellular buildup, leaving skin velvety smooth, supple, and revitalized.",
    highlights: ["Gentle Exfoliation & Pollution Removal", "For Smooth, Refreshed skin"],
    imageUrl: "/images/products/scrub.jpeg",
    imageAlt: "Lamé Derma Polish Body Scrub",
    isLive: false,
  },
  {
    id: "sugar-days",
    category: "Fragrance",
    name: "Sugar DAYS Eau de Parfum",
    tag: "100ml Luxury Parfum",
    detail: "Artisanal Fine Fragrance",
    description:
      "Artisanal luxury eau de parfum featuring a sophisticated, long-lasting sensorial profile crafted with delicate sweet notes and fine botanical essences for an enduring signature scent.",
    highlights: ["Long-lasting sensorial profile", "Artisanal fine fragrance blend"],
    imageUrl: "/images/products/sugardays.jpeg",
    imageAlt: "Lamé Sugar DAYS Eau de Parfum",
    isLive: false,
  },
  {
    id: "gel-moisturizer",
    category: "Moisturizer",
    name: "DermaBarrier Gel Moisturizer",
    tag: "Ceramides + Hyaluronic Acid",
    detail: "Oil-Free Clinical Hydration",
    description:
      "Oil-free barrier repair formulation enriched with essential ceramides and hyaluronic acid for deep cellular hydration, soothing compromised skin without clogging pores.",
    highlights: ["Barrier Repair & Deep Hydration", "Non-comedogenic clinical hydration"],
    imageUrl: "/images/products/moisturizer.jpeg",
    imageAlt: "Lamé DermaBarrier Gel Moisturizer",
    isLive: false,
  },
];

export default function LameProductsSection() {
  const [products, setProducts] = useState<LameProduct[]>(SIGNATURE_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/lame-products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProducts(
            data.products.map((p: any) => ({
              id: p.id,
              category: p.category,
              name: p.name,
              tag: p.tag_line || "",
              detail: p.category,
              description: p.description || "",
              highlights: Array.isArray(p.highlights_json) ? p.highlights_json : [],
              imageUrl: p.image_url || "/images/products/facewash.jpeg",
              imageAlt: `Lamé ${p.name}`,
              isLive: p.status === "available",
              storeUrl: p.store_url || undefined,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 lg:gap-8 items-stretch max-w-5xl mx-auto">
        {products.map((product, idx) => {
          return (
            <MotionReveal
              key={product.id}
              delay={idx * 140}
              direction="up"
              className="h-full flex flex-col"
            >
              <div className="group relative overflow-hidden rounded-2xl border border-[#B8934A]/30 border-t-2 border-t-[#B8934A] bg-white p-7 sm:p-9 shadow-[0_4px_20px_-4px_rgba(15,42,74,0.12),0_2px_6px_-2px_rgba(15,42,74,0.06)] hover:shadow-[0_16px_36px_-8px_rgba(15,42,74,0.20)] hover:border-[#B8934A]/60 hover:-translate-y-1.5 transition-all duration-300 ease-out h-full flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="overflow-hidden rounded-xl shadow-xs aspect-square relative group/img bg-[#FBF7F0] shrink-0">
                    <Image
                      src={product.imageUrl}
                      alt={product.imageAlt}
                      fill
                      className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F2A4A]/10 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-3.5 right-3.5 z-10 inline-flex items-center gap-1.5 text-xs text-[#0F2A4A] font-medium bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#B8934A]/30 shadow-xs">
                      {product.isLive ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                          <span className="truncate">Available Now</span>
                        </>
                      ) : (
                        <>
                          <span className="h-2 w-2 rounded-full bg-[#B8934A] shrink-0" />
                          <span className="truncate">Available on Order</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-[#B8934A]">
                        {product.category}
                      </span>
                      <span className="text-[11px] text-[#243E5E]/70 font-medium">
                        {product.tag}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0F2A4A] tracking-tight leading-snug">
                      {product.name}
                    </h3>
                  </div>

                  <p className="text-sm text-[#243E5E] leading-relaxed font-normal">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {product.highlights.map((item, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 text-xs text-[#243E5E] bg-[#FBF7F0] px-2.5 py-1 rounded-md border border-[#B8934A]/25 font-normal"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#B8934A] shrink-0" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-7 mt-auto">
                  {product.isLive && product.storeUrl ? (
                    <a
                      href={product.storeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 px-5 text-sm font-semibold tracking-wide text-[#0F2A4A] bg-[#B8934A] hover:bg-[#A37F38] border border-[#B8934A]/50 shadow-[0_4px_14px_rgba(184,147,74,0.30)] hover:shadow-[0_8px_24px_rgba(184,147,74,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 cursor-pointer"
                    >
                      <span>Shop Now</span>
                      <ExternalLink className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(product.name)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 px-5 text-sm font-semibold tracking-wide text-[#0F2A4A] bg-[#B8934A] hover:bg-[#A37F38] border border-[#B8934A]/50 shadow-[0_4px_14px_rgba(184,147,74,0.30)] hover:shadow-[0_8px_24px_rgba(184,147,74,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 cursor-pointer"
                    >
                      <span>Enquire Now</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                    </button>
                  )}
                </div>
              </div>
            </MotionReveal>
          );
        })}
      </div>

      <FormModal
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        title="Product & Order Enquiry"
        subtitle={selectedProduct ? `Request priority order details for ${selectedProduct}.` : ""}
        badge="Order Enquiry"
        apiEndpoint="/api/lame-notify"
        extraPayload={{ product_name: selectedProduct ?? "General" }}
        fields={[
          {
            name: "email",
            label: "Email Address",
            type: "email",
            required: true,
            placeholder: "you@email.com",
          },
        ]}
        successMessage={`Thank you! Our concierge team will connect with you regarding ${selectedProduct}.`}
      />
    </>
  );
}
