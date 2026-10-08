"use client";

import React, { useState } from "react";
import PerfumesTopBanner from "./PerfumesTopBanner";
import PerfumesHeroSection from "./PerfumesHeroSection";
import PerfumesCategoryGrid from "./PerfumesCategoryGrid";
import PerfumesProductsSection from "./PerfumesProductsSection";
import PerfumesScentMatcher from "./PerfumesScentMatcher";
import PerfumesOlfactiveSection from "./PerfumesOlfactiveSection";
import PerfumesConciergeSection from "./PerfumesConciergeSection";
import PerfumesMarquee from "./PerfumesMarquee";
import FormModal from "@/components/modals/FormModal";

export default function PerfumesPageClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("General Fragrance Enquiry");

  const handleOpenEnquire = (productName?: string) => {
    setSelectedProduct(productName || "General Fragrance Enquiry");
    setIsModalOpen(true);
  };

  const handleShopNow = () => {
    const el = document.getElementById("collection");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    const el = document.getElementById("collection");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      data-theme="perfumes"
      className="relative flex flex-col w-full bg-[#0A1628] text-[#FAF4EB] min-h-screen selection:bg-[#C69A4C]/40 selection:text-white"
    >
      {/* 1. Animated Top Announcement Ticker (Inspired by MYOP) */}
      <PerfumesTopBanner />

      {/* 2. Hero Section: 3D Motion Graphic Bottle, Rotating God Rays, Illuminated Dais, and CTAs */}
      <PerfumesHeroSection
        onShopNow={handleShopNow}
        onEnquire={() => handleOpenEnquire("Lamé Barqat Imperial")}
      />

      {/* 3. Explore Scents by Olfactive Family (Inspired by MYOP Explore Scents: Fresh, Floral, Woody) */}
      <PerfumesCategoryGrid
        onSelectCategory={handleSelectCategory}
      />

      {/* 4. Our Best Sellers: 3 Core Fragrances with Ratings, Size Pills, Quantity Steppers & Dual Pricing */}
      <PerfumesProductsSection
        onSelectProduct={(name) => handleOpenEnquire(name)}
      />

      {/* 5. Interactive Scent Matcher / Mood Discovery (MYOP Interactive Feature) */}
      <PerfumesScentMatcher
        onShopProduct={(name) => handleOpenEnquire(name)}
        onEnquireProduct={(name) => handleOpenEnquire(name)}
      />

      {/* 6. Olfactive Architecture & Note Pyramid */}
      <PerfumesOlfactiveSection />

      {/* 7. Streamlined Concierge & Direct Orders */}
      <PerfumesConciergeSection
        onShopNow={handleShopNow}
        onEnquire={() => handleOpenEnquire("Concierge Suite Enquiry")}
      />

      {/* 9. Radiant Bottom Gold Marquee Ticker */}
      <PerfumesMarquee />

      {/* Order & Concierge Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Fragrance Concierge & Order Enquiry"
        subtitle={`Connect with our private fragrance specialist regarding ${selectedProduct}.`}
        badge="HAUTE PARFUMERIE CONCIERGE"
        apiEndpoint="/api/lame-notify"
        extraPayload={{ product_name: selectedProduct }}
        fields={[
          {
            name: "name",
            label: "Full Name",
            type: "text",
            required: true,
            placeholder: "Your name",
          },
          {
            name: "email",
            label: "Email Address",
            type: "email",
            required: true,
            placeholder: "you@email.com",
          },
          {
            name: "phone",
            label: "Phone / WhatsApp (Optional)",
            type: "tel",
            required: false,
            placeholder: "+971 50 000 0000",
          },
        ]}
        successMessage={`Thank you. Our luxury concierge will contact you regarding ${selectedProduct} within 24 hours.`}
      />
    </div>
  );
}
