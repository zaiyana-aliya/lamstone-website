"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, RefreshCw, Sliders } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

export interface SlideFeatureItem {
  icon: string;
  title: string;
  caption: string;
}

interface HeroSlideRecord {
  id: string;
  page_name: string;
  eyebrow_label: string;
  heading: string;
  subtext: string;
  image_url: string;
  primary_cta_label: string | null;
  primary_cta_link: string | null;
  secondary_cta_label: string | null;
  secondary_cta_link: string | null;
  display_order: number;
  features?: SlideFeatureItem[] | null;
}

const DEFAULT_FEATURES: SlideFeatureItem[] = [
  { icon: "Shield", title: "Trusted Care", caption: "Evidence Based" },
  { icon: "Users", title: "Quality Assured", caption: "Global Standards" },
  { icon: "Leaf", title: "Lamstone Signature", caption: "Own Brands" },
  { icon: "Heart", title: "Community Wellness", caption: "Healthier Lives" },
];

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlideRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<HeroSlideRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    page_name: "home",
    eyebrow_label: "",
    heading: "",
    subtext: "",
    image_url: "",
    primary_cta_label: "",
    primary_cta_link: "",
    secondary_cta_label: "",
    secondary_cta_link: "",
    features: DEFAULT_FEATURES,
  });

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/hero-slides?page=home");
      const json = await res.json();
      if (res.ok) setSlides(json.slides ?? []);
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      page_name: "home",
      eyebrow_label: "",
      heading: "",
      subtext: "",
      image_url: "",
      primary_cta_label: "Explore Our Divisions",
      primary_cta_link: "#divisions",
      secondary_cta_label: "Invest With Us",
      secondary_cta_link: "/invest",
      features: DEFAULT_FEATURES.map((f) => ({ ...f })),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (slide: HeroSlideRecord) => {
    setEditingItem(slide);
    const slideFeatures =
      slide.features && slide.features.length > 0
        ? slide.features
        : DEFAULT_FEATURES;
    setForm({
      page_name: slide.page_name,
      eyebrow_label: slide.eyebrow_label,
      heading: slide.heading,
      subtext: slide.subtext,
      image_url: slide.image_url,
      primary_cta_label: slide.primary_cta_label || "",
      primary_cta_link: slide.primary_cta_link || "",
      secondary_cta_label: slide.secondary_cta_label || "",
      secondary_cta_link: slide.secondary_cta_link || "",
      features: slideFeatures.map((f) => ({ ...f })),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await fetch(`/api/admin/hero-slides/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, display_order: editingItem.display_order }),
        });
        if (res.ok) {
          setIsModalOpen(false);
          fetchSlides();
        }
      } else {
        const res = await fetch("/api/admin/hero-slides", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setIsModalOpen(false);
          fetchSlides();
        }
      }
    } catch {
      // error
    }
  };

  const handleDelete = async (id: string, heading: string) => {
    if (!window.confirm(`Delete slide "${heading}"?`)) return;
    try {
      const res = await fetch(`/api/admin/hero-slides/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSlides((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
      // error
    }
  };

  const moveOrder = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;

    const list = [...slides];
    const current = list[index];
    const target = list[targetIdx];

    const currentOrder = current.display_order;
    current.display_order = target.display_order;
    target.display_order = currentOrder;

    list[index] = target;
    list[targetIdx] = current;
    setSlides(list);

    await Promise.all([
      fetch(`/api/admin/hero-slides/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current),
      }),
      fetch(`/api/admin/hero-slides/${target.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(target),
      }),
    ]);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#0B2A4A] tracking-tight">
            Home Hero Carousel Slides
          </h1>
          <p className="text-sm text-neutral-500 font-light mt-1">
            Manage the cinematic rotating carousel slides on the homepage hero, reorder slides, and update imagery.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#b00f23] hover:bg-[#960d1e] text-white text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 shadow-[0_4px_16px_rgba(176,15,35,0.32)] hover:shadow-[0_8px_24px_rgba(176,15,35,0.48)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Plus className="h-4 w-4 text-[#E2C785]" />
          <span>Add New Slide</span>
        </button>
      </div>

      {/* Slides Table */}
      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-12 text-center text-sm text-neutral-400 flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-[#C9A227]" />
            <span>Loading hero slides…</span>
          </div>
        ) : slides.length === 0 ? (
          <div className="p-16 text-center text-sm text-neutral-400 font-light">
            No slides found. Click &quot;Add New Slide&quot; or run the seed script.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-700">
              <thead className="bg-[#FAFBFD] text-xs font-semibold uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="px-5 py-3.5 w-16">Order</th>
                  <th className="px-5 py-3.5 w-32">Image</th>
                  <th className="px-5 py-3.5">Eyebrow &amp; Heading</th>
                  <th className="px-5 py-3.5">Subtext</th>
                  <th className="px-5 py-3.5">CTAs</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {slides.map((slide, idx) => (
                  <tr key={slide.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => moveOrder(idx, "up")}
                          className="p-1 rounded text-neutral-400 hover:text-[#0B2A4A] disabled:opacity-20 cursor-pointer"
                          aria-label="Move Up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          disabled={idx === slides.length - 1}
                          onClick={() => moveOrder(idx, "down")}
                          className="p-1 rounded text-neutral-400 hover:text-[#0B2A4A] disabled:opacity-20 cursor-pointer"
                          aria-label="Move Down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="relative h-16 w-24 rounded-lg overflow-hidden border border-neutral-100 bg-neutral-100 shadow-2xs">
                        <Image
                          src={slide.image_url}
                          alt={slide.heading}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </td>

                    <td className="px-5 py-4 max-w-xs">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-[#b00f23] block mb-0.5">
                        {slide.eyebrow_label}
                      </span>
                      <span className="font-semibold text-[#0B2A4A] block leading-snug">
                        {slide.heading}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs text-neutral-500 font-light max-w-xs line-clamp-2">
                      {slide.subtext}
                    </td>

                    <td className="px-5 py-4 text-xs space-y-1">
                      {slide.primary_cta_label && (
                        <div className="text-neutral-700 font-medium">
                          1: {slide.primary_cta_label} <span className="text-neutral-400 font-light">({slide.primary_cta_link})</span>
                        </div>
                      )}
                      {slide.secondary_cta_label && (
                        <div className="text-neutral-500">
                          2: {slide.secondary_cta_label} <span className="text-neutral-400 font-light">({slide.secondary_cta_link})</span>
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(slide)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#0B2A4A]/20 bg-white hover:bg-[#0B2A4A] text-[#0B2A4A] hover:text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(slide.id, slide.heading)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200 bg-white hover:bg-red-600 text-red-600 hover:text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0B2A4A]/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="shrink-0 flex items-center justify-between border-b border-neutral-100 px-6 py-4 bg-white">
              <h3 className="font-serif text-xl font-semibold text-[#0B2A4A]">
                {editingItem ? "Edit Hero Slide" : "Add New Hero Slide"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer text-lg p-1 leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col min-h-0 flex-1 overflow-hidden text-sm">
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-neutral-600 uppercase">Eyebrow Label *</span>
                <input
                  type="text"
                  required
                  value={form.eyebrow_label}
                  onChange={(e) => setForm({ ...form, eyebrow_label: e.target.value })}
                  placeholder="e.g. Care Beyond Medicine or NOW OPEN"
                  className="rounded-xl border border-neutral-200 px-3.5 py-2 text-xs outline-none focus:border-[#0B2A4A]"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-neutral-600 uppercase">Slide Heading *</span>
                <input
                  type="text"
                  required
                  value={form.heading}
                  onChange={(e) => setForm({ ...form, heading: e.target.value })}
                  placeholder="e.g. Building a Healthier Tomorrow, Together."
                  className="rounded-xl border border-neutral-200 px-3.5 py-2 text-xs outline-none focus:border-[#0B2A4A]"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-neutral-600 uppercase">Subtext / Paragraph *</span>
                <textarea
                  rows={2}
                  required
                  value={form.subtext}
                  onChange={(e) => setForm({ ...form, subtext: e.target.value })}
                  placeholder="A premium ecosystem of pharmacy chains and cosmetic brands…"
                  className="rounded-xl border border-neutral-200 px-3.5 py-2 text-xs outline-none focus:border-[#0B2A4A] resize-none"
                />
              </label>

              {/* Direct Image Uploader */}
              <ImageUploadField
                label="Slide Background / Hero Image"
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
                required
                folder="home-slides"
                hint="High resolution photo for the cinematic background. Uploaded to Supabase Storage (/media/home-slides/)."
              />

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">Primary CTA Label</span>
                  <input
                    type="text"
                    value={form.primary_cta_label}
                    onChange={(e) => setForm({ ...form, primary_cta_label: e.target.value })}
                    placeholder="Explore Our Divisions"
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-xs outline-none focus:border-[#0B2A4A]"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">Primary CTA Link</span>
                  <input
                    type="text"
                    value={form.primary_cta_link}
                    onChange={(e) => setForm({ ...form, primary_cta_link: e.target.value })}
                    placeholder="#divisions"
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-xs outline-none focus:border-[#0B2A4A]"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">Secondary CTA Label</span>
                  <input
                    type="text"
                    value={form.secondary_cta_label}
                    onChange={(e) => setForm({ ...form, secondary_cta_label: e.target.value })}
                    placeholder="Invest With Us"
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-xs outline-none focus:border-[#0B2A4A]"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">Secondary CTA Link</span>
                  <input
                    type="text"
                    value={form.secondary_cta_link}
                    onChange={(e) => setForm({ ...form, secondary_cta_link: e.target.value })}
                    placeholder="/invest"
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-xs outline-none focus:border-[#0B2A4A]"
                  />
                </label>
              </div>

              {/* Slide Feature Highlights (4 Badges) */}
              <div className="space-y-3 pt-2 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Feature Highlights (4 Quick Cards)
                  </span>
                  <span className="text-[11px] text-neutral-400 font-light">
                    Display icons and metrics across the bottom of the slide
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {form.features.map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-3 rounded-xl border border-neutral-200/90 bg-[#FAFBFD] space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">
                          Card {fIdx + 1}
                        </span>
                        <select
                          value={feat.icon}
                          onChange={(e) => {
                            const updated = [...form.features];
                            updated[fIdx] = { ...updated[fIdx], icon: e.target.value };
                            setForm({ ...form, features: updated });
                          }}
                          className="text-xs rounded-lg border border-neutral-200 bg-white px-2 py-1 font-mono text-neutral-700 outline-none focus:border-[#0B2A4A]"
                        >
                          <option value="Shield">Shield (Trusted Care)</option>
                          <option value="Users">Users (Quality Assured)</option>
                          <option value="Leaf">Leaf (Wellness / Nature)</option>
                          <option value="Heart">Heart (Community / Health)</option>
                          <option value="Building2">Building2 (Pharmacy / Store)</option>
                          <option value="Sparkles">Sparkles (Luxury Beauty)</option>
                          <option value="MapPin">MapPin (Location / Reach)</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        value={feat.title}
                        onChange={(e) => {
                          const updated = [...form.features];
                          updated[fIdx] = { ...updated[fIdx], title: e.target.value };
                          setForm({ ...form, features: updated });
                        }}
                        placeholder="Title (e.g. Pharmacy & Rx)"
                        className="w-full rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-800 outline-none focus:border-[#0B2A4A]"
                      />
                      <input
                        type="text"
                        value={feat.caption}
                        onChange={(e) => {
                          const updated = [...form.features];
                          updated[fIdx] = { ...updated[fIdx], caption: e.target.value };
                          setForm({ ...form, features: updated });
                        }}
                        placeholder="Caption (e.g. Comprehensive Care)"
                        className="w-full rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-600 outline-none focus:border-[#0B2A4A]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              </div>

              <div className="shrink-0 border-t border-neutral-100 px-6 py-4 bg-neutral-50/90 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-neutral-200 bg-white text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#b00f23] hover:bg-[#960d1e] text-xs font-medium text-white tracking-wide transition-all duration-300 shadow-[0_4px_16px_rgba(176,15,35,0.32)] hover:shadow-[0_8px_24px_rgba(176,15,35,0.48)] cursor-pointer"
                >
                  <span>{editingItem ? "Save Changes" : "Create Slide"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
