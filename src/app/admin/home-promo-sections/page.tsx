"use client";

import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Edit2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Eye,
  ImageIcon,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

export interface HomePromoSectionRecord {
  id: string;
  section_key: string;
  eyebrow_label: string;
  heading: string;
  description: string;
  image_url: string;
  primary_cta_label: string;
  primary_cta_url: string;
  secondary_cta_label?: string | null;
  secondary_cta_url?: string | null;
  is_active: boolean;
  updated_at?: string;
}

const SECTION_CONFIG: Record<
  string,
  {
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }
> = {
  perfume_banner: {
    title: "Lamé Perfumes Showcase Banner",
    subtitle: "Section 4 — Dedicated luxury perfume banner featuring animated 3D flacon, prices, and store CTAs.",
    icon: Sparkles,
    accentColor: "#D9A74E",
  },
  lame_banner: {
    title: "Lamé Signature Banner",
    subtitle: "Section 5 — Full-bleed photography banner showcasing the Lamé luxury skincare & fragrance brand.",
    icon: Sparkles,
    accentColor: "#b00f23",
  },
  invest_banner: {
    title: "Invest in Growth Banner",
    subtitle: "Section 5 — Strategic investment opportunity card with interactive parallax and high-converting CTA.",
    icon: TrendingUp,
    accentColor: "#C9A24B",
  },
  photo_band: {
    title: "One Ecosystem Photo Band",
    subtitle: "Section 6 — Full-width editorial photo band bridging Invest and Footer, showcasing the healthcare ecosystem.",
    icon: ImageIcon,
    accentColor: "#0E2244",
  },
};

export default function AdminHomePromoSectionsPage() {
  const [sections, setSections] = useState<HomePromoSectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<HomePromoSectionRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [form, setForm] = useState({
    eyebrow_label: "",
    heading: "",
    description: "",
    image_url: "",
    primary_cta_label: "",
    primary_cta_url: "",
    secondary_cta_label: "",
    secondary_cta_url: "",
    is_active: true,
  });

  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/home-promo-sections");
      const contentType = res.headers.get("content-type") || "";

      if (res.status === 401) {
        window.location.href = "/admin/login?callbackUrl=/admin/home-promo-sections";
        return;
      }

      if (!contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. Please log in or refresh.");
      }

      const data = await res.json();
      if (res.ok) {
        setSections(data.sections || []);
      } else {
        setFeedback({ type: "error", msg: data.error || "Failed to load promo sections" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message || "Network error loading promo sections" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const openEditModal = (item: HomePromoSectionRecord) => {
    setEditingItem(item);
    setForm({
      eyebrow_label: item.eyebrow_label || "",
      heading: item.heading || "",
      description: item.description || "",
      image_url: item.image_url || "",
      primary_cta_label: item.primary_cta_label || "",
      primary_cta_url: item.primary_cta_url || "",
      secondary_cta_label: item.secondary_cta_label || "",
      secondary_cta_url: item.secondary_cta_url || "",
      is_active: item.is_active ?? true,
    });
    setFeedback(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!form.heading.trim() || !form.description.trim() || !form.image_url.trim()) {
      alert("Please fill in heading, description, and image URL.");
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/home-promo-sections/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eyebrow_label: form.eyebrow_label,
          heading: form.heading,
          description: form.description,
          image_url: form.image_url,
          primary_cta_label: form.primary_cta_label,
          primary_cta_url: form.primary_cta_url,
          secondary_cta_label: form.secondary_cta_label.trim() || null,
          secondary_cta_url: form.secondary_cta_url.trim() || null,
          is_active: form.is_active,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update section");
      }

      setIsModalOpen(false);
      fetchSections();
      setFeedback({
        type: "success",
        msg: `"${SECTION_CONFIG[editingItem.section_key]?.title || "Promo Section"}" updated successfully!`,
      });
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message || "Error saving section" });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (item: HomePromoSectionRecord) => {
    try {
      const res = await fetch(`/api/admin/home-promo-sections/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !item.is_active }),
      });
      if (res.ok) {
        setSections((prev) =>
          prev.map((s) => (s.id === item.id ? { ...s, is_active: !s.is_active } : s))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#0B2A4A] text-white flex items-center justify-center shadow-xs">
              <Megaphone className="h-5 w-5 text-[#E2C785]" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#0B2A4A]">Home Promo Sections</h1>
          </div>
          <p className="text-sm text-neutral-500 font-light mt-1">
            Manage the content for the two prominent promotional callout banners on the Home page:
            the Lamé Signature Banner and the Strategic Invest Banner.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchSections}
            disabled={loading}
            className="p-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between gap-3 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <span>{feedback.msg}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs opacity-60 hover:opacity-100 font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Content Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="h-8 w-8 text-[#0B2A4A] animate-spin" />
          <p className="text-sm font-light text-neutral-500">Loading promo sections...</p>
        </div>
      ) : sections.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-neutral-200 rounded-2xl bg-white/50 space-y-4">
          <Megaphone className="h-10 w-10 text-neutral-300 mx-auto" />
          <div>
            <h3 className="text-base font-semibold text-neutral-700">No promo sections found</h3>
            <p className="text-sm text-neutral-500 font-light mt-1 max-w-md mx-auto">
              Please run migration{" "}
              <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-700 text-xs">
                006_home_promo_sections.sql
              </code>{" "}
              in your Supabase SQL editor and run the seed script:
              <br />
              <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-700 text-xs font-mono mt-2 inline-block">
                npx tsx scripts/seed-home-promo-sections.ts
              </code>
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {sections.map((item) => {
            const config =
              SECTION_CONFIG[item.section_key] || {
                title: item.heading,
                subtitle: item.section_key,
                icon: Megaphone,
                accentColor: "#b00f23",
              };
            const Icon = config.icon;

            return (
              <div
                key={item.id}
                className={`flex flex-col justify-between rounded-2xl border bg-white overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 ${
                  item.is_active ? "border-neutral-200" : "border-neutral-200 opacity-60 bg-neutral-50/50"
                }`}
              >
                {/* Header Tag */}
                <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between gap-3 bg-neutral-50/80">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                      style={{ backgroundColor: config.accentColor }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm font-semibold text-neutral-800 truncate">
                        {config.title}
                      </h2>
                      <span className="text-[11px] font-mono text-neutral-400">
                        key: {item.section_key}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleActive(item)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                      item.is_active
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    {item.is_active ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5 text-neutral-400" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Banner Thumbnail */}
                <div className="relative aspect-[21/9] w-full bg-neutral-900 overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.heading}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/40">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                  {/* Eyebrow badge preview */}
                  <div className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#132a4e] shadow-sm">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: config.accentColor }}
                    />
                    <span>{item.eyebrow_label}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2.5">
                    <h3 className="font-serif text-xl font-medium text-[#132a4e]">
                      {item.heading}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* CTAs / Stats Summary */}
                  {(item.primary_cta_label || item.secondary_cta_label) && (
                    <div className="pt-3 border-t border-neutral-100 space-y-2 text-xs">
                      {item.primary_cta_label && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-neutral-500 font-medium">Primary CTA:</span>
                          <div className="flex items-center gap-1.5 text-right">
                            <span className="font-semibold text-[#b00f23]">
                              {item.primary_cta_label}
                            </span>
                            <span className="font-mono text-[11px] text-neutral-400">
                              ({item.primary_cta_url})
                            </span>
                          </div>
                        </div>
                      )}

                      {item.secondary_cta_label && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-neutral-500 font-medium">
                            {item.section_key === "invest_banner" ? "Stats Strip:" : "Secondary CTA:"}
                          </span>
                          <div className="flex items-center gap-1.5 text-right">
                            <span className="font-semibold text-neutral-700">
                              {item.secondary_cta_label}
                            </span>
                            {item.secondary_cta_url && (
                              <span className="font-mono text-[11px] text-neutral-400">
                                ({item.secondary_cta_url})
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Toolbar */}
                <div className="bg-neutral-50 px-6 py-3.5 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-neutral-400 font-light">
                    {config.subtitle}
                  </span>
                  <button
                    onClick={() => openEditModal(item)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#0B2A4A]/20 bg-white hover:bg-[#0B2A4A] text-[#0B2A4A] hover:text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-[#C9A24B]" />
                    <span>Edit Section</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-100 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0B2A4A] text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Edit {SECTION_CONFIG[editingItem.section_key]?.title || "Promo Section"}
                </h3>
                <p className="text-xs text-white/70 font-light mt-0.5">
                  Identifier key: <code className="text-[#E2C785]">{editingItem.section_key}</code>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-white/60 hover:text-white text-lg font-light cursor-pointer p-1 leading-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="flex flex-col min-h-0 flex-1 overflow-hidden">
              <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Eyebrow Label */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Eyebrow Label
                </label>
                <input
                  type="text"
                  required
                  value={form.eyebrow_label}
                  onChange={(e) => setForm({ ...form, eyebrow_label: e.target.value })}
                  placeholder="e.g. SIGNATURE LAMÉ or STRATEGIC INVESTMENT"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-light text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#0B2A4A] focus:ring-1 focus:ring-[#0B2A4A]/30 transition-colors uppercase tracking-wider text-xs font-bold"
                />
              </div>

              {/* Heading */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Main Heading
                </label>
                <input
                  type="text"
                  required
                  value={form.heading}
                  onChange={(e) => setForm({ ...form, heading: e.target.value })}
                  placeholder="e.g. Bridging Clinical Science & Luxury Beauty"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-light text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#0B2A4A] focus:ring-1 focus:ring-[#0B2A4A]/30 transition-colors font-medium"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Compelling promotional narrative..."
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-light text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#0B2A4A] focus:ring-1 focus:ring-[#0B2A4A]/30 transition-colors resize-y leading-relaxed"
                />
              </div>

              {/* Feature Image URL with Media Picker */}
              <ImageUploadField
                label="Background / Feature Image"
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
                required
                folder="home-cards"
                placeholder="e.g. /images/lame/lame-hero-bg.jpg"
                hint="Click 'Browse Media' to select or upload images from Supabase Storage (/media/home-cards/)."
              />
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-neutral-400 font-light">Quick Presets:</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image_url: "/images/lame/lame-hero-bg.jpg" })}
                  className="px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-[10px] text-neutral-600 cursor-pointer"
                >
                  Lamé Hero Background
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      image_url:
                        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
                    })
                  }
                  className="px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-[10px] text-neutral-600 cursor-pointer"
                >
                  Growth Architectural Unsplash
                </button>
              </div>

              {/* Primary CTA (Hidden for photo_band) */}
              {editingItem.section_key !== "photo_band" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                      Primary CTA Button Label
                    </label>
                    <input
                      type="text"
                      required={editingItem.section_key !== "photo_band"}
                      value={form.primary_cta_label}
                      onChange={(e) => setForm({ ...form, primary_cta_label: e.target.value })}
                      placeholder="e.g. Explore Lamé Brand"
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-light text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#0B2A4A] focus:ring-1 focus:ring-[#0B2A4A]/30 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                      Primary CTA Link URL
                    </label>
                    <input
                      type="text"
                      required={editingItem.section_key !== "photo_band"}
                      value={form.primary_cta_url}
                      onChange={(e) => setForm({ ...form, primary_cta_url: e.target.value })}
                      placeholder="e.g. /lame or /contact"
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-light text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#0B2A4A] focus:ring-1 focus:ring-[#0B2A4A]/30 transition-colors font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Secondary CTA / Stats Strip */}
              {editingItem.section_key === "invest_banner" ? (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                    Stats / Credibility Strip Line
                  </label>
                  <input
                    type="text"
                    value={form.secondary_cta_label}
                    onChange={(e) => setForm({ ...form, secondary_cta_label: e.target.value })}
                    placeholder="e.g. 500+ Target Pharmacies · 14 Districts · 9+ Brand Partners"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-light text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#0B2A4A] focus:ring-1 focus:ring-[#0B2A4A]/30 transition-colors"
                  />
                  <p className="text-[11px] text-neutral-400 font-light">
                    Items separated by · or • are styled as small-caps highlighted trust metrics beneath the CTA button.
                  </p>
                </div>
              ) : editingItem.section_key !== "photo_band" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                      Secondary CTA Label (Optional)
                    </label>
                    <input
                      type="text"
                      value={form.secondary_cta_label}
                      onChange={(e) => setForm({ ...form, secondary_cta_label: e.target.value })}
                      placeholder="e.g. Shop Online (or leave empty)"
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-light text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#0B2A4A] focus:ring-1 focus:ring-[#0B2A4A]/30 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                      Secondary CTA Link URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={form.secondary_cta_url}
                      onChange={(e) => setForm({ ...form, secondary_cta_url: e.target.value })}
                      placeholder="e.g. https://mylamstone.com/"
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-light text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#0B2A4A] focus:ring-1 focus:ring-[#0B2A4A]/30 transition-colors font-mono text-xs"
                    />
                  </div>
                </div>
              ) : null}

              {/* Active Toggle */}
              <label className="flex items-center gap-2.5 pt-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0B2A4A] focus:ring-[#0B2A4A]/30"
                />
                <span className="text-sm font-medium text-neutral-700">
                  Visible on Home Page (Active)
                </span>
              </label>

              {/* Live Preview Box */}
              <div className="pt-4 border-t border-neutral-100 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview</span>
                </div>
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-3">
                  <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#b00f23]">
                    <span className="h-[2px] w-5 bg-[#b00f23]" />
                    <span>{form.eyebrow_label || "EYEBROW"}</span>
                  </div>
                  <h4 className="font-serif text-lg font-medium text-[#132a4e]">
                    {form.heading || "Section Heading"}
                  </h4>
                  <p className="text-xs text-neutral-600 font-light leading-relaxed line-clamp-2">
                    {form.description || "Description preview text will show here..."}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="px-3 py-1 rounded-full bg-[#b00f23] text-white text-xs font-medium inline-flex items-center gap-1">
                      <span>{form.primary_cta_label || "Primary CTA"}</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                    {form.secondary_cta_label && (
                      <span className="px-3 py-1 rounded-full border border-[#b00f23] text-[#b00f23] text-xs font-medium inline-flex items-center gap-1">
                        <span>{form.secondary_cta_label}</span>
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>

              </div>

              {/* Modal Buttons (Fixed Footer) */}
              <div className="shrink-0 border-t border-neutral-200 px-6 py-4 bg-neutral-50/90 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-neutral-200 bg-white text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#b00f23] hover:bg-[#960d1e] text-xs font-medium text-white tracking-wide transition-all duration-300 shadow-[0_4px_16px_rgba(176,15,35,0.32)] hover:shadow-[0_8px_24px_rgba(176,15,35,0.48)] disabled:opacity-50 cursor-pointer"
                >
                  {submitting && <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#E2C785]" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
