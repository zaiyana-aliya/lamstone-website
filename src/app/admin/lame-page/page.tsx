"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Edit2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Bell,
  Quote,
  Heart,
  ShieldCheck,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

export interface LameSectionRecord {
  id: string;
  section_key: string;
  eyebrow_label?: string | null;
  heading: string;
  description: string;
  image_url?: string | null;
  primary_cta_label?: string | null;
  primary_cta_url?: string | null;
  secondary_cta_label?: string | null;
  secondary_cta_url?: string | null;
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
    title: "Lamé Luxury Hero Banner",
    subtitle: "Section 1 — Editorial product visual, headline, paragraphs, collection & online shop CTAs, and trust badges (Cruelty Free, Clinically Tested).",
    icon: Sparkles,
    accentColor: "#0B2A4A",
    tag: "HERO BANNER",
  },
  notify_banner: {
    title: "Launch Notification Banner",
    subtitle: "Section 2 — Early-access launch email capture card with editable headline, introductory copy, and privacy note.",
    icon: Bell,
    accentColor: "#b00f23",
    tag: "EMAIL CAPTURE",
  },
  quote_cta: {
    title: "Closing Quote & Partnership CTA",
    subtitle: "Section 3 — Closing philosophical quote and retail distribution partnership inquiry button.",
    icon: Quote,
    accentColor: "#C9A24B",
    tag: "CLOSING QUOTE",
  },
};

export default function AdminLamePageContentPage() {
  const [sections, setSections] = useState<LameSectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<LameSectionRecord | null>(null);
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

  const [extraData, setExtraData] = useState<Record<string, any>>({});

  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/lame-page");
      const contentType = res.headers.get("content-type") || "";
      if (res.status === 401 || !contentType.includes("application/json")) {
        setFeedback({
          type: "error",
          msg: "Session expired or database table not yet initialized. Please verify migration 011_lame_page.sql is run.",
        });
        setSections([]);
        return;
      }
      const data = await res.json();
      if (data.sections) {
        setSections(data.sections);
      }
    } catch (err: any) {
      console.error("Error fetching Lamé page sections:", err);
      setFeedback({ type: "error", msg: "Failed to connect to backend service." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const openEditModal = (item: LameSectionRecord) => {
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
      is_active: item.is_active,
    });
    setExtraData(item.extra_data ? JSON.parse(JSON.stringify(item.extra_data)) : {});
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setSubmitting(true);
      setFeedback(null);

      const res = await fetch(`/api/admin/lame-page/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eyebrow_label: form.eyebrow_label.trim() || null,
          heading: form.heading.trim(),
          description: form.description.trim(),
          image_url: form.image_url.trim() || null,
          primary_cta_label: form.primary_cta_label.trim() || null,
          primary_cta_url: form.primary_cta_url.trim() || null,
          secondary_cta_label: form.secondary_cta_label.trim() || null,
          secondary_cta_url: form.secondary_cta_url.trim() || null,
          extra_data: extraData,
          is_active: form.is_active,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to update section.");
      }

      setFeedback({ type: "success", msg: `Section "${editingItem.section_key}" updated successfully.` });
      setIsModalOpen(false);
      fetchSections();
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message || "Failed to save changes." });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActiveStatus = async (item: LameSectionRecord) => {
    try {
      const res = await fetch(`/api/admin/lame-page/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_active: !item.is_active,
        }),
      });
      if (res.ok) {
        setSections((prev) =>
          prev.map((s) => (s.id === item.id ? { ...s, is_active: !item.is_active } : s))
        );
        setFeedback({
          type: "success",
          msg: `Section "${item.section_key}" is now ${!item.is_active ? "Active (Live)" : "Draft (Hidden)"}.`,
        });
      }
    } catch (err) {
      setFeedback({ type: "error", msg: "Could not toggle section visibility." });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#b00f23]">
            <Sparkles className="h-4 w-4 text-[#b00f23]" />
            <span>Page Editorial Content</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B2A4A] tracking-tight mt-1">
            Lamé Page — Content
          </h1>
          <p className="text-sm text-charcoal-muted mt-1 max-w-2xl">
            Manage the luxury hero banner, launch notification copy, and closing quote CTA on the public Lamé Dermocosmetics page (<code className="text-xs bg-neutral-100 px-1.5 py-0.5 rounded text-[#0B2A4A]">/lame</code>).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSections}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#0B2A4A] bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-[#b00f23]" : ""}`} />
            Refresh
          </button>
          <a
            href="/lame"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-[#0B2A4A] rounded-lg hover:bg-[#143d6b] shadow-sm transition-colors cursor-pointer"
          >
            <ExternalLink className="h-3.5 w-3.5 text-[#E2C785]" />
            View Live Page
          </a>
        </div>
      </div>

      {/* Notifications / Feedback Bar */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between border transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.msg}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-semibold hover:underline opacity-70 cursor-pointer ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Sections List */}
      {loading && sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-neutral-200 shadow-sm text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-[#b00f23] mb-3" />
          <p className="text-sm font-medium text-[#0B2A4A]">Loading Lamé page sections...</p>
        </div>
      ) : sections.length === 0 ? (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 sm:p-8 text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800 mb-1">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-base font-serif font-bold text-[#0B2A4A]">No Lamé Page Content Found</h3>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-lg mx-auto">
            The database table <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[11px]">lame_page_content</code> has not been seeded yet. Please run migration <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[11px]">011_lame_page.sql</code> in Supabase and run the seed script.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sections.map((sec) => {
            const conf = SECTION_CONFIG[sec.section_key] || {
              title: sec.section_key.toUpperCase(),
              subtitle: "Custom page section content.",
              icon: Sparkles,
              accentColor: "#0B2A4A",
              tag: "SECTION",
            };
            const Icon = conf.icon;

            return (
              <div
                key={sec.id}
                className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-neutral-50 to-white border-b border-neutral-200/70 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-white border border-neutral-200 flex items-center justify-center shadow-xs">
                      <Icon className="h-4 w-4 text-[#0B2A4A]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200 uppercase">
                          {sec.section_key}
                        </span>
                        <h2 className="text-sm font-serif font-bold text-[#0B2A4A]">
                          {conf.title}
                        </h2>
                      </div>
                      <p className="text-[11px] text-charcoal-muted mt-0.5">
                        {conf.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleActiveStatus(sec)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                        sec.is_active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-neutral-100 text-neutral-500 border border-neutral-200 hover:bg-neutral-200"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${sec.is_active ? "bg-emerald-500" : "bg-neutral-400"}`} />
                      {sec.is_active ? "Active" : "Draft"}
                    </button>

                    <button
                      onClick={() => openEditModal(sec)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0B2A4A] bg-neutral-50 hover:bg-[#0B2A4A] hover:text-white border border-neutral-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Edit Content
                    </button>
                  </div>
                </div>

                {/* Content Details Preview */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className={`space-y-4 ${sec.image_url ? "lg:col-span-8" : "lg:col-span-12"}`}>
                    {sec.eyebrow_label && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#b00f23] block">
                          Eyebrow Label
                        </span>
                        <p className="text-xs font-semibold text-neutral-800 mt-0.5">
                          {sec.eyebrow_label}
                        </p>
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                        Headline / Title
                      </span>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-[#0B2A4A] whitespace-pre-line mt-0.5">
                        {sec.heading}
                      </h3>
                    </div>

                    {sec.description && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                          Main Body Description
                        </span>
                        <p className="text-xs text-neutral-600 whitespace-pre-line mt-0.5 leading-relaxed bg-neutral-50/70 p-3 rounded-lg border border-neutral-100">
                          {sec.description}
                        </p>
                      </div>
                    )}

                    {/* CTAs Summary */}
                    {(sec.primary_cta_label || sec.secondary_cta_label) && (
                      <div className="pt-2 flex flex-wrap items-center gap-4">
                        {sec.primary_cta_label && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-neutral-400">Primary CTA:</span>
                            <span className="text-xs font-semibold text-[#0B2A4A] bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                              {sec.primary_cta_label}
                            </span>
                            {sec.primary_cta_url && (
                              <span className="text-xs text-neutral-400 font-mono">
                                → {sec.primary_cta_url}
                              </span>
                            )}
                          </div>
                        )}
                        {sec.secondary_cta_label && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-neutral-400">Secondary CTA:</span>
                            <span className="text-xs font-semibold text-[#0B2A4A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {sec.secondary_cta_label}
                            </span>
                            {sec.secondary_cta_url && (
                              <span className="text-xs text-neutral-400 font-mono">
                                → {sec.secondary_cta_url}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Extra data summary badge preview */}
                    {sec.extra_data && Object.keys(sec.extra_data).length > 0 && (
                      <div className="pt-3 border-t border-neutral-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                          Configured Parameters &amp; Badges
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {sec.extra_data.badge_1 && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] bg-red-50 text-[#b00f23] border border-red-200">
                              <Heart className="h-3 w-3 text-[#b00f23]" />
                              <strong>{sec.extra_data.badge_1}</strong>
                            </span>
                          )}
                          {sec.extra_data.badge_2 && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] bg-amber-50 text-amber-800 border border-amber-200">
                              <ShieldCheck className="h-3 w-3 text-[#C9A227]" />
                              <strong>{sec.extra_data.badge_2}</strong>
                            </span>
                          )}
                          {sec.extra_data.quote && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] bg-neutral-100 text-[#0B2A4A] border border-neutral-200 italic">
                              <Quote className="h-3 w-3 text-neutral-400" />
                              <span>&ldquo;{sec.extra_data.quote}&rdquo;</span>
                            </span>
                          )}
                          {sec.extra_data.privacy_note && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] bg-neutral-50 text-neutral-600 border border-neutral-200">
                              <span className="text-neutral-400">Privacy:</span>
                              <span className="truncate max-w-xs">{sec.extra_data.privacy_note}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right column: Image preview */}
                  {sec.image_url && (
                    <div className="lg:col-span-4 flex flex-col justify-start">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                        Active Image Asset
                      </span>
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-inner group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sec.image_url}
                          alt={sec.heading}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
            {/* Modal Header */}
            <div className="shrink-0 px-6 py-4 bg-[#0B2A4A] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Edit2 className="h-4 w-4 text-[#E2C785]" />
                <h3 className="font-serif font-bold text-base">
                  Edit Section: {SECTION_CONFIG[editingItem.section_key]?.title || editingItem.section_key}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-white/70 hover:text-white text-xl p-1 leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="flex flex-col min-h-0 flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Eyebrow Label */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Eyebrow Label
                  </label>
                  <input
                    type="text"
                    value={form.eyebrow_label}
                    onChange={(e) => setForm({ ...form, eyebrow_label: e.target.value })}
                    placeholder="e.g. Haute Dermocosmetics"
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  />
                </div>

                {/* Section Key (Read only) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Section Key (Read Only)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={editingItem.section_key}
                    className="w-full text-xs px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-neutral-500 font-mono"
                  />
                </div>
              </div>

              {/* Heading */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Heading / Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.heading}
                  onChange={(e) => setForm({ ...form, heading: e.target.value })}
                  placeholder="Section headline (newline creates subtitle on hero)"
                  className="w-full text-xs font-serif text-[#0B2A4A] font-semibold px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Description / Paragraphs
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Primary copy. Double linebreaks will separate paragraphs."
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] leading-relaxed"
                />
              </div>

              {/* Image Uploader */}
              <div>
                <ImageUploadField
                  label={editingItem.section_key === "hero" ? "Hero Image Asset" : "Section Visual / Background Asset"}
                  value={form.image_url}
                  onChange={(url) => setForm({ ...form, image_url: url })}
                  folder="lame"
                  hint="Select or upload luxury dermocosmetics imagery stored in /media/lame/."
                />
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Primary CTA Label
                  </label>
                  <input
                    type="text"
                    value={form.primary_cta_label}
                    onChange={(e) => setForm({ ...form, primary_cta_label: e.target.value })}
                    placeholder="e.g. Explore Signature Collection"
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Primary CTA URL
                  </label>
                  <input
                    type="text"
                    value={form.primary_cta_url}
                    onChange={(e) => setForm({ ...form, primary_cta_url: e.target.value })}
                    placeholder="e.g. #collection or /contact"
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Secondary CTA Label
                  </label>
                  <input
                    type="text"
                    value={form.secondary_cta_label}
                    onChange={(e) => setForm({ ...form, secondary_cta_label: e.target.value })}
                    placeholder="e.g. Shop Online"
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Secondary CTA URL
                  </label>
                  <input
                    type="text"
                    value={form.secondary_cta_url}
                    onChange={(e) => setForm({ ...form, secondary_cta_url: e.target.value })}
                    placeholder="e.g. https://mylamstone.com/"
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  />
                </div>
              </div>

              {/* Section-Specific Form Fields */}
              {editingItem.section_key === "hero" && (
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B2A4A]">
                    <Sparkles className="h-4 w-4 text-[#C9A24B]" />
                    <span>Hero Trust Badges</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Trust Badge 1
                      </label>
                      <input
                        type="text"
                        value={extraData.badge_1 || ""}
                        onChange={(e) => setExtraData({ ...extraData, badge_1: e.target.value })}
                        placeholder="e.g. Cruelty Free"
                        className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Trust Badge 2
                      </label>
                      <input
                        type="text"
                        value={extraData.badge_2 || ""}
                        onChange={(e) => setExtraData({ ...extraData, badge_2: e.target.value })}
                        placeholder="e.g. Clinically Tested"
                        className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {editingItem.section_key === "notify_banner" && (
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B2A4A]">
                    <Bell className="h-4 w-4 text-[#b00f23]" />
                    <span>Email Capture Settings</span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Privacy Note / Sub-text
                    </label>
                    <textarea
                      rows={2}
                      value={extraData.privacy_note || ""}
                      onChange={(e) => setExtraData({ ...extraData, privacy_note: e.target.value })}
                      placeholder="e.g. We respect your privacy. No spam — only launch updates and formulation releases."
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white"
                    />
                  </div>
                </div>
              )}

              {editingItem.section_key === "quote_cta" && (
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B2A4A]">
                    <Quote className="h-4 w-4 text-[#C9A24B]" />
                    <span>Philosophical Quote</span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Featured Brand Quote
                    </label>
                    <textarea
                      rows={2}
                      value={extraData.quote || ""}
                      onChange={(e) => setExtraData({ ...extraData, quote: e.target.value })}
                      placeholder="e.g. True beauty is synonymous with health."
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white italic"
                    />
                  </div>
                </div>
              )}

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-3 border-t border-neutral-100">
                <input
                  type="checkbox"
                  id="modal_is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0B2A4A] focus:ring-[#0B2A4A] cursor-pointer"
                />
                <label htmlFor="modal_is_active" className="text-xs font-semibold text-neutral-700 cursor-pointer">
                  Active (Section is publicly rendered on the Lamé page)
                </label>
              </div>

              </div>

              {/* Modal Actions (Fixed Footer) */}
              <div className="shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-100 bg-neutral-50/90">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#0B2A4A] rounded-lg hover:bg-[#143d6b] transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
