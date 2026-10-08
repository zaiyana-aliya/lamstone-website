"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Edit2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Megaphone,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

export interface CosmeticsSectionRecord {
  id: string;
  section_key: string;
  eyebrow_label?: string | null;
  heading: string;
  description: string;
  image_url?: string | null;
  primary_cta_label?: string | null;
  primary_cta_url?: string | null;
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
    title: "Cosmetics Hero Banner",
    subtitle: "Section 1 — Editorial product staging visual, headline, narrative paragraphs, CTA, and 3 trust markers (Trusted Since 2019, 9+ Brand Partners, 100% Authentic badge).",
    icon: Sparkles,
    accentColor: "#b00f23",
    tag: "HERO BANNER",
  },
  visual_band: {
    title: "Brands Visual Band",
    subtitle: "Section 3 — Blush gradient banner with headline and gold underline.",
    icon: Sparkles,
    accentColor: "#7A1F3D",
    tag: "VISUAL BAND",
  },
  cta_banner: {
    title: "Distribution & Retail CTA Banner",
    subtitle: "Section 6 — Closing invitation for retailers and brand suppliers seeking statewide distribution across Kerala.",
    icon: Megaphone,
    accentColor: "#0B2A4A",
    tag: "DISTRIBUTION CTA",
  },
};

export default function AdminCosmeticsPageContentPage() {
  const [sections, setSections] = useState<CosmeticsSectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<CosmeticsSectionRecord | null>(null);
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
    is_active: true,
  });

  const [extraData, setExtraData] = useState<Record<string, any>>({});

  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/cosmetics-page");
      const contentType = res.headers.get("content-type") || "";

      if (res.status === 401) {
        window.location.href = "/admin/login?callbackUrl=/admin/cosmetics-page";
        return;
      }

      if (!contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. Please log in or refresh.");
      }

      const data = await res.json();
      if (res.ok) {
        setSections(data.sections || []);
      } else {
        setFeedback({ type: "error", msg: data.error || "Failed to load cosmetics page content" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message || "Network error loading cosmetics page content" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const openEditModal = (item: CosmeticsSectionRecord) => {
    setEditingItem(item);
    setForm({
      eyebrow_label: item.eyebrow_label || "",
      heading: item.heading || "",
      description: item.description || "",
      image_url: item.image_url || "",
      primary_cta_label: item.primary_cta_label || "",
      primary_cta_url: item.primary_cta_url || "",
      is_active: item.is_active ?? true,
    });
    setExtraData(item.extra_data ? JSON.parse(JSON.stringify(item.extra_data)) : {});
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
        primary_cta_label: form.primary_cta_label.trim() || null,
        primary_cta_url: form.primary_cta_url.trim() || null,
        extra_data: extraData,
        is_active: form.is_active,
      };

      const res = await fetch(`/api/admin/cosmetics-page/${editingItem.id}`, {
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

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#b00f23]">
            <span>Page Content</span>
            <span>•</span>
            <span>Cosmetics Division</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B2A4A] mt-1">
            Cosmetics Page — Content
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Customize editorial copy, photography, CTA links, and brand trust badges on{" "}
            <code className="text-[#0B2A4A] font-mono font-medium">/cosmetics</code>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/cosmetics"
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
          <p className="text-xs text-neutral-500 font-medium">Loading Cosmetics page content...</p>
        </div>
      ) : sections.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200 shadow-2xs">
          <Sparkles className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-semibold text-[#0B2A4A]">No sections found in database</h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1 mb-4">
            Run the seed script to populate default content for the Cosmetics Division page:
          </p>
          <code className="px-3 py-1.5 bg-neutral-100 text-neutral-800 rounded font-mono text-xs block max-w-fit mx-auto">
            npx tsx scripts/seed-cosmetics-page.ts
          </code>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sections.map((sec) => {
            const config = SECTION_CONFIG[sec.section_key] || {
              title: sec.section_key,
              subtitle: "Cosmetics page section",
              icon: Sparkles,
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

                      {sec.primary_cta_label && (
                        <div className="pt-1 flex items-center gap-2 text-xs">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                            CTA:
                          </span>
                          <span className="font-semibold text-neutral-800">{sec.primary_cta_label}</span>
                          {sec.primary_cta_url && (
                            <span className="font-mono text-[11px] text-neutral-400">({sec.primary_cta_url})</span>
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
                            Configured Badges &amp; Stats
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(sec.extra_data).map(([k, v]) => (
                              <span
                                key={k}
                                className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-[10px] text-neutral-700 font-medium"
                              >
                                <strong className="text-[#0B2A4A]">{k.replace(/_/g, " ")}:</strong>{" "}
                                {String(v).slice(0, 18)}
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

      {/* Edit Modal with Form Controls */}
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
                    placeholder="e.g. Distribution & Retail"
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
                    placeholder="e.g. Cosmetics
Division"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Description / Body Copy <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  placeholder="Section body text..."
                />
              </div>

              <ImageUploadField
                label={editingItem.section_key === "hero" ? "Hero Product Staging Asset" : "Section Photography / Banner Asset"}
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
                folder="cosmetics"
                hint="Recommended: high-end cosmetics photography stored in /media/cosmetics/."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Primary CTA Label
                  </label>
                  <input
                    type="text"
                    value={form.primary_cta_label}
                    onChange={(e) => setForm({ ...form, primary_cta_label: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                    placeholder="e.g. Contact Distribution"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Primary CTA URL
                  </label>
                  <input
                    type="text"
                    value={form.primary_cta_url}
                    onChange={(e) => setForm({ ...form, primary_cta_url: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                    placeholder="e.g. /contact"
                  />
                </div>
              </div>

              {/* Section-Specific Form Inputs for extra_data */}
              {editingItem.section_key === "hero" && (
                <div className="rounded-2xl border border-neutral-200 bg-[#FAFBFD] p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200/80">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0B2A4A]">
                      Hero Trust Badges &amp; Metrics
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      Auto-synchronized JSONB
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Trusted Since (Year)
                      </label>
                      <input
                        type="text"
                        value={extraData.stat_trusted_year ?? "2019"}
                        onChange={(e) => updateExtraField("stat_trusted_year", e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white"
                        placeholder="e.g. 2019"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Brand Partners Count
                      </label>
                      <input
                        type="text"
                        value={extraData.stat_partners_count ?? "9+"}
                        onChange={(e) => updateExtraField("stat_partners_count", e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white"
                        placeholder="e.g. 9+"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Authentic Badge Title
                      </label>
                      <input
                        type="text"
                        value={extraData.stat_authentic_badge ?? "100% Authentic"}
                        onChange={(e) => updateExtraField("stat_authentic_badge", e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white"
                        placeholder="e.g. 100% Authentic"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Authentic Badge Subtitle
                      </label>
                      <input
                        type="text"
                        value={extraData.stat_authentic_sub ?? "Dermatologist Approved"}
                        onChange={(e) => updateExtraField("stat_authentic_sub", e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white"
                        placeholder="e.g. Dermatologist Approved"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Lead Subheading (Bold Lead Line)
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
                      Secondary Description
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

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                <input
                  type="checkbox"
                  id="cosmetics_is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0B2A4A] focus:ring-[#0B2A4A]"
                />
                <label htmlFor="cosmetics_is_active" className="text-xs font-medium text-neutral-700 select-none">
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
