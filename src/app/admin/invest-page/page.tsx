"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Edit2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Layers,
  Megaphone,
  Plus,
  Trash2,
  Users,
  Sparkles,
  Building2,
  Pill,
  Award,
  Heart,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

export interface InvestSectionRecord {
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
    title: "Invest Hero Banner",
    subtitle: "Section 1 — Corporate architectural skyline, headline, paragraphs, deck CTA, and 4 stat indicators (500+ Target, 14 Districts, 9+ Partners, 100% Authentic).",
    icon: TrendingUp,
    accentColor: "#b00f23",
    tag: "HERO BANNER",
  },
  why_invest: {
    title: "Why Invest in Lamstone (The Investment Case)",
    subtitle: "Section 3 — Headline, narrative copy, and 3 value proposition cards configured via extra_data (Proven Growth Trajectory, Recession-Resistant Industry, Expert Management).",
    icon: ShieldCheck,
    accentColor: "#0B2A4A",
    tag: "VALUE PROPOSITIONS",
  },
  pathways: {
    title: "Strategic Growth Model & Investment Pathways",
    subtitle: "Section 5 — Narrative copy, executive boardroom visual, partnership button, and 3 structured pathway bullet points.",
    icon: Layers,
    accentColor: "#C9A24B",
    tag: "STRATEGIC MODEL",
  },
  cta_banner: {
    title: "Bottom Information Memorandum Callout",
    subtitle: "Section 6 — Bottom navy callout banner with Information Memorandum request CTA button.",
    icon: Megaphone,
    accentColor: "#850917",
    tag: "BOTTOM CALLOUT",
  },
};

const ICON_OPTIONS = [
  "TrendingUp",
  "ShieldCheck",
  "Users",
  "Sparkles",
  "Building2",
  "Pill",
  "Award",
  "Heart",
  "CheckCircle2",
];

export default function AdminInvestPageContentPage() {
  const [sections, setSections] = useState<InvestSectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<InvestSectionRecord | null>(null);
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
      const res = await fetch("/api/admin/invest-page");
      const contentType = res.headers.get("content-type") || "";
      if (res.status === 401 || !contentType.includes("application/json")) {
        setFeedback({
          type: "error",
          msg: "Session expired or database table not yet initialized. Please verify migration 013_invest_page.sql is run.",
        });
        setSections([]);
        return;
      }
      const data = await res.json();
      if (data.sections) {
        setSections(data.sections);
      }
    } catch (err: any) {
      console.error("Error fetching invest page sections:", err);
      setFeedback({ type: "error", msg: "Failed to connect to backend service." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const openEditModal = (item: InvestSectionRecord) => {
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

      const res = await fetch(`/api/admin/invest-page/${editingItem.id}`, {
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

  const toggleActiveStatus = async (item: InvestSectionRecord) => {
    try {
      const res = await fetch(`/api/admin/invest-page/${item.id}`, {
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

  // Helpers for why_invest cards
  const whyCards = Array.isArray(extraData.cards) ? extraData.cards : [];
  const handleAddWhyCard = () => {
    setExtraData({
      ...extraData,
      cards: [
        ...whyCards,
        { icon: "TrendingUp", title: "New Value Proposition", description: "" },
      ],
    });
  };
  const handleUpdateWhyCard = (index: number, field: string, val: string) => {
    const updated = [...whyCards];
    updated[index] = { ...updated[index], [field]: val };
    setExtraData({ ...extraData, cards: updated });
  };
  const handleRemoveWhyCard = (index: number) => {
    const updated = whyCards.filter((_: any, i: number) => i !== index);
    setExtraData({ ...extraData, cards: updated });
  };

  // Helpers for pathways bullet_points
  const pathwayBullets = Array.isArray(extraData.bullet_points) ? extraData.bullet_points : [];
  const handleAddPathwayBullet = () => {
    setExtraData({
      ...extraData,
      bullet_points: [...pathwayBullets, ""],
    });
  };
  const handleUpdatePathwayBullet = (index: number, val: string) => {
    const updated = [...pathwayBullets];
    updated[index] = val;
    setExtraData({ ...extraData, bullet_points: updated });
  };
  const handleRemovePathwayBullet = (index: number) => {
    const updated = pathwayBullets.filter((_: any, i: number) => i !== index);
    setExtraData({ ...extraData, bullet_points: updated });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#b00f23]">
            <TrendingUp className="h-4 w-4 text-[#b00f23]" />
            <span>Page Editorial Content</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B2A4A] tracking-tight mt-1">
            Invest Page — Content
          </h1>
          <p className="text-sm text-charcoal-muted mt-1 max-w-2xl">
            Manage the hero banner, value proposition cards, investment pathways, and memorandum callouts on the public Invest page (<code className="text-xs bg-neutral-100 px-1.5 py-0.5 rounded text-[#0B2A4A]">/invest</code>).
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
            href="/invest"
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
          <p className="text-sm font-medium text-[#0B2A4A]">Loading Invest page sections...</p>
        </div>
      ) : sections.length === 0 ? (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 sm:p-8 text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800 mb-1">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h3 className="text-base font-serif font-bold text-[#0B2A4A]">No Invest Page Content Found</h3>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-lg mx-auto">
            The database table <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[11px]">invest_page_content</code> has not been seeded yet. Please run migration <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[11px]">013_invest_page.sql</code> in Supabase and run the seed script.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sections.map((sec) => {
            const conf = SECTION_CONFIG[sec.section_key] || {
              title: sec.section_key.toUpperCase(),
              subtitle: "Custom page section content.",
              icon: TrendingUp,
              accentColor: "#0B2A4A",
              tag: "SECTION",
            };
            const Icon = conf.icon;

            return (
              <div
                key={sec.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
                  sec.is_active ? "border-neutral-200/90" : "border-neutral-200 opacity-75 bg-neutral-50/40"
                }`}
              >
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:px-6 bg-gradient-to-r from-neutral-50 to-white border-b border-neutral-100">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm shrink-0"
                      style={{ backgroundColor: conf.accentColor }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-200/60 text-neutral-700">
                          {conf.tag}
                        </span>
                        <span className="font-mono text-[11px] text-neutral-400">
                          key: <span className="text-[#0B2A4A] font-semibold">{sec.section_key}</span>
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-[#0B2A4A] mt-0.5">
                        {conf.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-auto">
                    {/* Live / Draft status indicator */}
                    <button
                      onClick={() => toggleActiveStatus(sec)}
                      title="Click to toggle visibility"
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                        sec.is_active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${sec.is_active ? "bg-emerald-500" : "bg-neutral-400"}`} />
                      {sec.is_active ? "Live on Site" : "Draft / Hidden"}
                    </button>

                    <button
                      onClick={() => openEditModal(sec)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0B2A4A] hover:bg-[#143d6b] text-white rounded-lg text-xs font-medium transition-colors shadow-sm cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5 text-[#E2C785]" />
                      <span>Edit Content</span>
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className={`space-y-4 ${sec.image_url ? "lg:col-span-8" : "lg:col-span-12"}`}>
                    {sec.eyebrow_label && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                          Eyebrow Label
                        </span>
                        <span className="text-xs font-semibold text-[#b00f23] uppercase tracking-wider bg-red-50/70 border border-red-100 px-2 py-0.5 rounded">
                          {sec.eyebrow_label}
                        </span>
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                        Headline
                      </span>
                      <h4 className="text-base sm:text-lg font-serif font-bold text-[#0B2A4A] whitespace-pre-line leading-tight">
                        {sec.heading}
                      </h4>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                        Description / Copy
                      </span>
                      <p className="text-xs sm:text-sm text-neutral-700 font-light leading-relaxed whitespace-pre-line">
                        {sec.description}
                      </p>
                    </div>

                    {/* CTAs Summary */}
                    {(sec.primary_cta_label || sec.secondary_cta_label) && (
                      <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-4">
                        {sec.primary_cta_label && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-neutral-400">Primary CTA:</span>
                            <span className="text-xs font-semibold text-[#b00f23] bg-red-50 px-2 py-0.5 rounded border border-red-200">
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
                          Configured Parameters &amp; Sub-elements
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(sec.extra_data.cards) && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] bg-blue-50 text-blue-800 border border-blue-200">
                              <strong>{sec.extra_data.cards.length} Value Props</strong>
                            </span>
                          )}
                          {Array.isArray(sec.extra_data.bullet_points) && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <strong>{sec.extra_data.bullet_points.length} Pathway Bullets</strong>
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
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-inner group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sec.image_url}
                          alt={sec.heading}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400 mt-1 truncate">
                        {sec.image_url}
                      </span>
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
            <div className="px-6 py-4 bg-gradient-to-r from-[#0B2A4A] to-[#143d6b] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <TrendingUp className="h-5 w-5 text-[#E2C785]" />
                <div>
                  <h3 className="font-serif font-bold text-lg">
                    Edit: {SECTION_CONFIG[editingItem.section_key]?.title || editingItem.section_key}
                  </h3>
                  <p className="text-xs text-white/70">
                    Section Key: <span className="font-mono text-[#E2C785] font-semibold">{editingItem.section_key}</span>
                  </p>
                </div>
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
                    placeholder="e.g. Partnership Opportunities"
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
                  placeholder="Section headline"
                  className="w-full text-xs font-serif text-[#0B2A4A] font-semibold px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Description / Paragraphs <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Primary copy. Double linebreaks will separate paragraphs."
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] leading-relaxed"
                />
              </div>

              {/* Image Uploader */}
              <div>
                <ImageUploadField
                  label="Featured Image Asset"
                  value={form.image_url}
                  onChange={(url) => setForm({ ...form, image_url: url })}
                  folder="invest"
                  hint="Select or upload corporate/investor photography stored in /media/invest/."
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
                    placeholder="e.g. Request Investment Deck"
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
                    placeholder="e.g. modal:deck, modal:memorandum, /contact"
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
                    placeholder="e.g. Why Lamstone"
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
                    placeholder="e.g. #why-invest"
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  />
                </div>
              </div>

              {/* Section-Specific Form Fields */}
              {editingItem.section_key === "hero" && (
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B2A4A]">
                    <TrendingUp className="h-4 w-4 text-[#b00f23]" />
                    <span>Hero Subheadings &amp; Content</span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Hero Subheading
                      </label>
                      <input
                        type="text"
                        value={extraData.subheading || ""}
                        onChange={(e) => setExtraData({ ...extraData, subheading: e.target.value })}
                        placeholder="e.g. Join our rapidly expanding pharmacy chain and beauty ecosystem."
                        className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Secondary Description
                      </label>
                      <textarea
                        rows={2}
                        value={extraData.secondary_description || ""}
                        onChange={(e) => setExtraData({ ...extraData, secondary_description: e.target.value })}
                        placeholder="e.g. We offer transparent, secure, and lucrative partnership models..."
                        className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {editingItem.section_key === "why_invest" && (
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B2A4A]">
                      <ShieldCheck className="h-4 w-4 text-[#0B2A4A]" />
                      <span>Value Proposition Cards ({whyCards.length})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddWhyCard}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-white bg-[#0B2A4A] hover:bg-[#143d6b] transition-colors cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      Add Card
                    </button>
                  </div>

                  {whyCards.length === 0 ? (
                    <p className="text-xs text-neutral-400 italic py-2">
                      No value proposition cards yet. Click &quot;Add Card&quot; to create one.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {whyCards.map((card: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 bg-white rounded-lg border border-neutral-200 space-y-2 shadow-xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                              Card #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveWhyCard(idx)}
                              className="text-red-500 hover:text-red-700 text-xs p-1 cursor-pointer"
                              title="Delete Card"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[10px] font-semibold text-neutral-600 mb-0.5">
                                Icon
                              </label>
                              <select
                                value={card.icon || "TrendingUp"}
                                onChange={(e) => handleUpdateWhyCard(idx, "icon", e.target.value)}
                                className="w-full text-xs px-2 py-1.5 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0B2A4A] bg-white"
                              >
                                {ICON_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] font-semibold text-neutral-600 mb-0.5">
                                Card Title
                              </label>
                              <input
                                type="text"
                                value={card.title || ""}
                                onChange={(e) => handleUpdateWhyCard(idx, "title", e.target.value)}
                                placeholder="e.g. Proven Growth Trajectory"
                                className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0B2A4A] bg-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-neutral-600 mb-0.5">
                              Description
                            </label>
                            <textarea
                              rows={2}
                              value={card.description || ""}
                              onChange={(e) => handleUpdateWhyCard(idx, "description", e.target.value)}
                              placeholder="e.g. Lamstone is aggressively expanding through a strategic pharmacy acquisition plan..."
                              className="w-full text-xs px-2.5 py-1.5 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0B2A4A] bg-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {editingItem.section_key === "pathways" && (
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B2A4A]">
                      <Layers className="h-4 w-4 text-[#C9A24B]" />
                      <span>Investment Pathway Bullet Points ({pathwayBullets.length})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPathwayBullet}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-white bg-[#0B2A4A] hover:bg-[#143d6b] transition-colors cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      Add Bullet
                    </button>
                  </div>

                  {pathwayBullets.length === 0 ? (
                    <p className="text-xs text-neutral-400 italic py-2">
                      No pathway bullet points yet. Click &quot;Add Bullet&quot; to create one.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {pathwayBullets.map((bullet: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-xs text-neutral-400 font-mono w-5 shrink-0 text-right">
                            {idx + 1}.
                          </span>
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => handleUpdatePathwayBullet(idx, e.target.value)}
                            placeholder="e.g. Strategic pharmacy acquisition"
                            className="flex-1 text-xs px-3 py-1.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePathwayBullet(idx)}
                            className="text-red-500 hover:text-red-700 text-xs p-1.5 cursor-pointer"
                            title="Delete Bullet"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                  Active (Section is publicly rendered on the Invest page)
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
