"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  BookOpen,
  Eye,
  Target,
  Building,
  Edit2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RotateCcw,
  ImageIcon,
  Award,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

export interface AboutSectionRecord {
  id: string;
  section_key: string;
  eyebrow_label?: string | null;
  heading: string;
  description: string;
  image_url?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  extra_data?: Record<string, any>;
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
    tag: string;
  }
> = {
  hero: {
    title: "About Hero Section",
    subtitle: "Section 1 — Architectural panoramic backdrop, headline, lead statements, and trust metric chips.",
    icon: Compass,
    accentColor: "#0B2A4A",
    tag: "HERO BANNER",
  },
  story: {
    title: "Our Story",
    subtitle: "Section 2 — 'From a Vision to a Healthier Future' narrative and consultation dispensary imagery.",
    icon: BookOpen,
    accentColor: "#b00f23",
    tag: "OUR STORY",
  },
  vision: {
    title: "Our Vision Card",
    subtitle: "Section 3 (Card 1) — 'The Future We See' visionary roadmap statement.",
    icon: Eye,
    accentColor: "#C9A24B",
    tag: "VISION",
  },
  mission: {
    title: "Our Mission Card",
    subtitle: "Section 3 (Card 2) — 'The Promise We Keep' organizational commitment and clinical promise.",
    icon: Target,
    accentColor: "#154D2C",
    tag: "MISSION",
  },
  photo_band: {
    title: "Full-Width Photo Band",
    subtitle: "Section 3.5 — Headquarters architectural landscape photo band with centered editorial headline.",
    icon: ImageIcon,
    accentColor: "#17654A",
    tag: "PHOTO BAND",
  },
  campus: {
    title: "Our Campus",
    subtitle: "Section 5 — 'A Modern Infrastructure' life sciences industrial park headquarters and units card.",
    icon: Building,
    accentColor: "#143d6b",
    tag: "CAMPUS",
  },
  leadership: {
    title: "Core Leadership (MD's Note)",
    subtitle: "Section 6.5 — Rijas Rehman executive portrait, title, and visionary quote.",
    icon: Award,
    accentColor: "#1A3E6B",
    tag: "LEADERSHIP",
  },
};

const SECTION_ORDER: Record<string, number> = {
  hero: 1,
  story: 2,
  vision: 3,
  mission: 4,
  photo_band: 5,
  campus: 6,
  leadership: 7,
};

export default function AdminAboutPageContentPage() {
  const [sections, setSections] = useState<AboutSectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<AboutSectionRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [form, setForm] = useState({
    eyebrow_label: "",
    heading: "",
    description: "",
    image_url: "",
    cta_label: "",
    cta_url: "",
    is_active: true,
  });

  const [extraData, setExtraData] = useState<Record<string, any>>({});

  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/about-page");
      const contentType = res.headers.get("content-type") || "";

      if (res.status === 401) {
        window.location.href = "/admin/login?callbackUrl=/admin/about-page";
        return;
      }

      if (!contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. Please log in or refresh.");
      }

      const data = await res.json();
      if (res.ok) {
        setSections(data.sections || []);
      } else {
        setFeedback({ type: "error", msg: data.error || "Failed to load about page content" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message || "Network error loading about page content" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const openEditModal = (item: AboutSectionRecord) => {
    setEditingItem(item);
    setForm({
      eyebrow_label: item.eyebrow_label || "",
      heading: item.heading || "",
      description: item.description || "",
      image_url: item.image_url || "",
      cta_label: item.cta_label || "",
      cta_url: item.cta_url || "",
      is_active: item.is_active ?? true,
    });
    setExtraData(item.extra_data ? { ...item.extra_data } : {});
    setFeedback(null);
    setIsModalOpen(true);
  };

  const updateExtraField = (key: string, value: any) => {
    setExtraData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setSubmitting(true);
      setFeedback(null);

      const payload = {
        eyebrow_label: form.eyebrow_label.trim() || null,
        heading: form.heading.trim(),
        description: form.description.trim(),
        image_url: form.image_url.trim() || null,
        cta_label: form.cta_label.trim() || null,
        cta_url: form.cta_url.trim() || null,
        extra_data: extraData,
        is_active: form.is_active,
      };

      const res = await fetch(`/api/admin/about-page/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to update section content");
      }

      setFeedback({
        type: "success",
        msg: `Section "${SECTION_CONFIG[editingItem.section_key]?.title || editingItem.section_key}" updated successfully!`,
      });

      setIsModalOpen(false);
      fetchSections();
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message || "Failed to save changes" });
    } finally {
      setSubmitting(false);
    }
  };

  const hasImageField = (key: string) => ["hero", "story", "campus", "leadership", "photo_band"].includes(key);
  const hasCtaField = (key: string) => ["hero", "story"].includes(key);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#b00f23]">
            <span>Page Content</span>
            <span>•</span>
            <span>About</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B2A4A] mt-1">
            About Page — Core Sections
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Customize editorial copy, headings, photography, and trust markers for{" "}
            <code className="text-[#0B2A4A] font-mono font-medium">/about</code>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#0B2A4A] bg-white border border-neutral-200 hover:border-[#0B2A4A]/30 hover:bg-neutral-50 transition-all shadow-2xs"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View Live Page</span>
          </a>
          <button
            onClick={fetchSections}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 transition-all shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-center justify-between shadow-2xs transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <XCircle className="h-4 w-4 shrink-0 text-rose-600" />
            )}
            <span>{feedback.msg}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-neutral-400 hover:text-neutral-700 text-xs ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Sections Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-neutral-200/80 shadow-2xs">
          <RefreshCw className="h-8 w-8 text-[#0B2A4A] animate-spin mb-3" />
          <p className="text-xs text-neutral-500 font-medium">Loading About page content...</p>
        </div>
      ) : sections.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200 shadow-2xs">
          <Compass className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-semibold text-[#0B2A4A]">No sections found in database</h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1 mb-4">
            Run the seed script to populate default content for the About page:
          </p>
          <code className="px-3 py-1.5 bg-neutral-100 text-neutral-800 rounded font-mono text-xs block max-w-fit mx-auto">
            npx tsx scripts/seed-about-page.ts
          </code>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {[...sections]
            .sort((a, b) => (SECTION_ORDER[a.section_key] ?? 99) - (SECTION_ORDER[b.section_key] ?? 99))
            .map((sec) => {
            const config = SECTION_CONFIG[sec.section_key] || {
              title: sec.section_key,
              subtitle: "About section content",
              icon: Compass,
              accentColor: "#0B2A4A",
              tag: "SECTION",
            };
            const Icon = config.icon;

            return (
              <div
                key={sec.id}
                className="group relative bg-white rounded-2xl border border-neutral-200/80 shadow-[0_2px_12px_rgba(11,42,74,0.03)] hover:shadow-[0_8px_24px_rgba(11,42,74,0.07)] transition-all overflow-hidden"
              >
                <div
                  className="absolute top-0 inset-x-0 h-1"
                  style={{ backgroundColor: config.accentColor }}
                />

                <div className="p-6 sm:p-7">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-neutral-100">
                    <div className="flex items-start gap-3.5">
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                        style={{
                          backgroundColor: `${config.accentColor}15`,
                          color: config.accentColor,
                        }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-mono">
                            {config.tag}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            Key: {sec.section_key}
                          </span>
                          {!sec.is_active && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                              Inactive
                            </span>
                          )}
                        </div>
                        <h2 className="text-lg font-serif font-bold text-[#0B2A4A] mt-1">
                          {config.title}
                        </h2>
                        <p className="text-xs text-neutral-500 mt-0.5 max-w-2xl leading-relaxed">
                          {config.subtitle}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => openEditModal(sec)}
                      className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0B2A4A] hover:bg-[#b00f23] transition-colors shadow-2xs cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit Content</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
                    <div className="space-y-3 md:col-span-2">
                      {sec.eyebrow_label && (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            Eyebrow Label
                          </span>
                          <p className="text-xs font-semibold text-[#b00f23] mt-0.5">
                            {sec.eyebrow_label}
                          </p>
                        </div>
                      )}

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Main Heading
                        </span>
                        <h3 className="text-base font-serif font-semibold text-[#0B2A4A] mt-0.5 whitespace-pre-line">
                          {sec.heading}
                        </h3>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Description
                        </span>
                        <p className="text-xs text-neutral-600 mt-0.5 whitespace-pre-line leading-relaxed line-clamp-3">
                          {sec.description}
                        </p>
                      </div>

                      {sec.cta_label && (
                        <div className="pt-1 flex items-center gap-2 text-xs">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                            CTA:
                          </span>
                          <span className="font-semibold text-neutral-800">{sec.cta_label}</span>
                          {sec.cta_url && (
                            <span className="font-mono text-[11px] text-neutral-400">({sec.cta_url})</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 bg-neutral-50/70 p-4 rounded-xl border border-neutral-100 text-xs">
                      {sec.image_url ? (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                            Media Asset
                          </span>
                          <div className="relative h-24 w-full rounded-lg overflow-hidden border border-neutral-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={sec.image_url}
                              alt={sec.heading}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span className="font-mono text-[9.5px] text-neutral-400 truncate block mt-1">
                            {sec.image_url}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                            Media Asset
                          </span>
                          <p className="text-[11px] text-neutral-400 italic">No image configured</p>
                        </div>
                      )}

                      {sec.extra_data && Object.keys(sec.extra_data).length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                            Configured Attributes
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(sec.extra_data).map(([k, v]) => (
                              <span
                                key={k}
                                className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-[10px] text-neutral-700 font-medium"
                              >
                                <strong className="text-[#0B2A4A]">{k.replace(/_/g, " ")}:</strong>{" "}
                                {String(v).slice(0, 20)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal with Proper Form Controls */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="shrink-0 flex items-center justify-between px-6 py-4 sm:px-8 border-b border-neutral-100 bg-white">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-xs"
                  style={{ backgroundColor: SECTION_CONFIG[editingItem.section_key]?.accentColor || "#0B2A4A" }}
                >
                  <Edit2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0B2A4A]">
                    Edit Section: {SECTION_CONFIG[editingItem.section_key]?.title || editingItem.section_key}
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    Key: {editingItem.section_key}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-lg font-medium p-1 cursor-pointer leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col min-h-0 flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Eyebrow Label
                  </label>
                  <input
                    type="text"
                    value={form.eyebrow_label}
                    onChange={(e) => setForm({ ...form, eyebrow_label: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                    placeholder="e.g. About Us"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Heading <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.heading}
                    onChange={(e) => setForm({ ...form, heading: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                    placeholder="e.g. About Lamstone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  {editingItem.section_key === "photo_band"
                    ? "Image Alt Text / Description"
                    : "Description / Body Copy"}{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={editingItem.section_key === "photo_band" ? 2 : 4}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  placeholder={
                    editingItem.section_key === "photo_band"
                      ? "Accessible alt text describing the photo (e.g. Modern Lamstone Healthcare corporate headquarters)..."
                      : "Section body text..."
                  }
                />
              </div>

              {hasImageField(editingItem.section_key) && (
                <ImageUploadField
                  label="Section Photography Asset"
                  value={form.image_url}
                  onChange={(url) => setForm({ ...form, image_url: url })}
                  folder="about"
                  hint="Recommended: clean 16:9 or 4:3 high-resolution photography stored in /media/about/."
                />
              )}

              {hasCtaField(editingItem.section_key) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={form.cta_label}
                      onChange={(e) => setForm({ ...form, cta_label: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                      placeholder="e.g. Our Journey"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      CTA Target URL
                    </label>
                    <input
                      type="text"
                      value={form.cta_url}
                      onChange={(e) => setForm({ ...form, cta_url: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                      placeholder="e.g. #story or /contact"
                    />
                  </div>
                </div>
              )}

              {/* Specific Labeled Inputs for extra_data instead of raw JSON */}
              <div className="rounded-2xl border border-neutral-200 bg-[#FAFBFD] p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/80">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0B2A4A]">
                    Section Specific Attributes &amp; Badges
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    Auto-synchronized JSONB
                  </span>
                </div>

                {editingItem.section_key === "hero" && (
                  <div className="space-y-5">
                    {/* 1. Trust Badge 1 */}
                    <div className="p-3.5 rounded-xl border border-neutral-200/90 bg-white space-y-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B2A4A] block">
                        Trust Badge 1
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                            Icon
                          </label>
                          <select
                            value={extraData.badge1_icon ?? "ShieldCheck"}
                            onChange={(e) => updateExtraField("badge1_icon", e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white"
                          >
                            <option value="ShieldCheck">ShieldCheck (Shield)</option>
                            <option value="Building2">Building2 (HQ)</option>
                            <option value="Truck">Truck (Delivery)</option>
                            <option value="Award">Award (Badge)</option>
                            <option value="CheckCircle2">CheckCircle2 (Verified)</option>
                            <option value="Sparkles">Sparkles (Quality)</option>
                            <option value="Leaf">Leaf (Natural)</option>
                            <option value="Users">Users (Team)</option>
                            <option value="Heart">Heart (Care)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={extraData.badge1_title ?? (extraData.stat_trusted_year ? `Trusted since ${extraData.stat_trusted_year}` : "Trusted since 2019")}
                            onChange={(e) => updateExtraField("badge1_title", e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white"
                            placeholder="e.g. Trusted since 2019"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                            Subtitle (Optional)
                          </label>
                          <input
                            type="text"
                            value={extraData.badge1_subtitle ?? ""}
                            onChange={(e) => updateExtraField("badge1_subtitle", e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white"
                            placeholder="Optional subtitle"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. Trust Badge 2 */}
                    <div className="p-3.5 rounded-xl border border-neutral-200/90 bg-white space-y-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B2A4A] block">
                        Trust Badge 2
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                            Icon
                          </label>
                          <select
                            value={extraData.badge2_icon ?? "Building2"}
                            onChange={(e) => updateExtraField("badge2_icon", e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white"
                          >
                            <option value="Building2">Building2 (HQ)</option>
                            <option value="ShieldCheck">ShieldCheck (Shield)</option>
                            <option value="Truck">Truck (Delivery)</option>
                            <option value="Award">Award (Badge)</option>
                            <option value="CheckCircle2">CheckCircle2 (Verified)</option>
                            <option value="Sparkles">Sparkles (Quality)</option>
                            <option value="Leaf">Leaf (Natural)</option>
                            <option value="Users">Users (Team)</option>
                            <option value="Heart">Heart (Care)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={extraData.badge2_title ?? (extraData.stat_pharmacies_count ? `${extraData.stat_pharmacies_count} Pharmacies Network` : "500+ Pharmacies Network")}
                            onChange={(e) => updateExtraField("badge2_title", e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white"
                            placeholder="e.g. 500+ Pharmacies Network"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                            Subtitle (Optional)
                          </label>
                          <input
                            type="text"
                            value={extraData.badge2_subtitle ?? ""}
                            onChange={(e) => updateExtraField("badge2_subtitle", e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white"
                            placeholder="Optional subtitle"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. Trust Badge 3 */}
                    <div className="p-3.5 rounded-xl border border-neutral-200/90 bg-white space-y-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B2A4A] block">
                        Trust Badge 3
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                            Icon
                          </label>
                          <select
                            value={extraData.badge3_icon ?? "Truck"}
                            onChange={(e) => updateExtraField("badge3_icon", e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white"
                          >
                            <option value="Truck">Truck (Delivery)</option>
                            <option value="ShieldCheck">ShieldCheck (Shield)</option>
                            <option value="Building2">Building2 (HQ)</option>
                            <option value="Award">Award (Badge)</option>
                            <option value="CheckCircle2">CheckCircle2 (Verified)</option>
                            <option value="Sparkles">Sparkles (Quality)</option>
                            <option value="Leaf">Leaf (Natural)</option>
                            <option value="Users">Users (Team)</option>
                            <option value="Heart">Heart (Care)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={extraData.badge3_title ?? (extraData.stat_delivery_title ?? "Home Delivery")}
                            onChange={(e) => updateExtraField("badge3_title", e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white"
                            placeholder="e.g. Home Delivery"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                            Subtitle
                          </label>
                          <input
                            type="text"
                            value={extraData.badge3_subtitle ?? (extraData.stat_delivery_subtitle ?? "Straight to your door")}
                            onChange={(e) => updateExtraField("badge3_subtitle", e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white"
                            placeholder="e.g. Straight to your door"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 4. Stat Line: Partners & Districts */}
                    <div className="p-3.5 rounded-xl border border-neutral-200/90 bg-white space-y-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B2A4A] block">
                        Trust Metric Pill (Stats Strip)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                              Stat 1 Count
                            </label>
                            <input
                              type="text"
                              value={extraData.stat_partners_count ?? "9+"}
                              onChange={(e) => updateExtraField("stat_partners_count", e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white"
                              placeholder="e.g. 9+"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                              Stat 1 Label
                            </label>
                            <input
                              type="text"
                              value={extraData.stat_partners_label ?? "Brand Partners"}
                              onChange={(e) => updateExtraField("stat_partners_label", e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white"
                              placeholder="e.g. Brand Partners"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                              Stat 2 Count
                            </label>
                            <input
                              type="text"
                              value={extraData.stat_districts_count ?? "14"}
                              onChange={(e) => updateExtraField("stat_districts_count", e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white"
                              placeholder="e.g. 14"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                              Stat 2 Label
                            </label>
                            <input
                              type="text"
                              value={extraData.stat_districts_label ?? "Districts Reach"}
                              onChange={(e) => updateExtraField("stat_districts_label", e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white"
                              placeholder="e.g. Districts Reach"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 5. Tagline Row */}
                    <div className="p-3.5 rounded-xl border border-neutral-200/90 bg-white space-y-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0B2A4A]">
                        Hero Tagline Row (Bottom of Text Column)
                      </label>
                      <input
                        type="text"
                        value={extraData.hero_tagline ?? "Pharma • Cosmetics • Wellness"}
                        onChange={(e) => updateExtraField("hero_tagline", e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white"
                        placeholder="e.g. Pharma • Cosmetics • Wellness"
                      />
                    </div>

                    {/* 6. Narrative Subheading & Body */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Hero Subheading (Bold Lead)
                      </label>
                      <input
                        type="text"
                        value={extraData.subheading ?? ""}
                        onChange={(e) => updateExtraField("subheading", e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white"
                        placeholder="Lead statement..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Secondary Narrative Copy
                      </label>
                      <textarea
                        rows={3}
                        value={extraData.secondary_description ?? ""}
                        onChange={(e) => updateExtraField("secondary_description", e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white"
                        placeholder="Additional narrative text..."
                      />
                    </div>
                  </div>
                )}

                {editingItem.section_key === "story" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Lead Story Subheading
                      </label>
                      <input
                        type="text"
                        value={extraData.lead_subheading ?? ""}
                        onChange={(e) => updateExtraField("lead_subheading", e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white"
                        placeholder="Lead story line..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Secondary Body Narrative
                      </label>
                      <textarea
                        rows={3}
                        value={extraData.secondary_body ?? ""}
                        onChange={(e) => updateExtraField("secondary_body", e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white"
                        placeholder="Supporting body text..."
                      />
                    </div>
                  </div>
                )}

                {(editingItem.section_key === "vision" || editingItem.section_key === "mission") && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Pillar Tagline
                      </label>
                      <input
                        type="text"
                        value={extraData.tagline ?? ""}
                        onChange={(e) => updateExtraField("tagline", e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white"
                        placeholder="e.g. Aspirational Horizon"
                      />
                    </div>

                    {editingItem.section_key === "vision" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-neutral-200/80">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Section Main Heading (Optional Override)
                          </label>
                          <input
                            type="text"
                            value={extraData.section_heading ?? ""}
                            onChange={(e) => updateExtraField("section_heading", e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white"
                            placeholder="Default: Guided by Purpose & Principle"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Section Subtitle (Optional Override)
                          </label>
                          <input
                            type="text"
                            value={extraData.section_subtitle ?? ""}
                            onChange={(e) => updateExtraField("section_subtitle", e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white"
                            placeholder="Default: Our vision defines where we are headed..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {editingItem.section_key === "photo_band" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          Image Focal Point / Object Position
                        </label>
                        <input
                          type="text"
                          value={extraData.object_position ?? "center 35%"}
                          onChange={(e) => updateExtraField("object_position", e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white"
                          placeholder="e.g. center 35%, center, top"
                        />
                        <p className="text-[10px] text-neutral-400 mt-1">
                          Controls CSS object-position for photo alignment (default: <code className="font-mono text-neutral-600">center 35%</code>).
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          Subheadline / Caption (Optional)
                        </label>
                        <input
                          type="text"
                          value={extraData.subheadline ?? ""}
                          onChange={(e) => updateExtraField("subheadline", e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white"
                          placeholder="Optional subheadline below headline..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {editingItem.section_key === "leadership" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Designation / Role Title
                      </label>
                      <input
                        type="text"
                        value={extraData.designation ?? "Founder & Managing Director"}
                        onChange={(e) => updateExtraField("designation", e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white"
                        placeholder="e.g. Founder & Managing Director"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Signature Image URL (Optional)
                      </label>
                      <input
                        type="text"
                        value={extraData.signature_url ?? ""}
                        onChange={(e) => updateExtraField("signature_url", e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white"
                        placeholder="e.g. /images/home/test-blue-sign.jpg or image URL"
                      />
                      <p className="text-[10px] text-neutral-400 mt-1">
                        Recommended size: ~140px × 56px transparent PNG. Leave blank if none.
                      </p>
                    </div>
                  </div>
                )}

                {/* For any arbitrary keys or custom extensions */}
                {!["hero", "story", "vision", "mission", "photo_band", "leadership"].includes(editingItem.section_key) && (
                  <div className="space-y-3">
                    <p className="text-xs text-neutral-500 font-light">
                      No custom attributes configured for this section.
                    </p>
                  </div>
                )}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                <input
                  type="checkbox"
                  id="about_is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0B2A4A] focus:ring-[#0B2A4A]"
                />
                <label htmlFor="about_is_active" className="text-xs font-medium text-neutral-700 select-none">
                  Active on public website
                </label>
              </div>

              </div>

              <div className="shrink-0 flex items-center justify-end gap-3 px-6 py-4 sm:px-8 border-t border-neutral-200 bg-neutral-50/90">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#0B2A4A] hover:bg-[#b00f23] rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
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
