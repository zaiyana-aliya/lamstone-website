"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Edit2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
  Layers,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

export interface BlogSectionRecord {
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
    title: "Blogs & Perspectives Hero Banner",
    subtitle: "Section 1 — Editorial journal backdrop, headline, lead statements, Explore CTA, and 3 curated insight badges.",
    icon: BookOpen,
    accentColor: "#0B2A4A",
    tag: "HERO BANNER",
  },
};

export default function AdminBlogPageContentPage() {
  const [sections, setSections] = useState<BlogSectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<BlogSectionRecord | null>(null);
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
      const res = await fetch("/api/admin/blog-page");
      const contentType = res.headers.get("content-type") || "";
      if (res.status === 401 || !contentType.includes("application/json")) {
        setFeedback({
          type: "error",
          msg: "Session expired or database table not yet initialized. Please verify migration 012_blog_page.sql is run.",
        });
        setSections([]);
        return;
      }
      const data = await res.json();
      if (data.sections) {
        setSections(data.sections);
      }
    } catch (err: any) {
      console.error("Error fetching blog page sections:", err);
      setFeedback({ type: "error", msg: "Failed to connect to backend service." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const openEditModal = (item: BlogSectionRecord) => {
    setEditingItem(item);
    setForm({
      eyebrow_label: item.eyebrow_label || "",
      heading: item.heading || "",
      description: item.description || "",
      image_url: item.image_url || "",
      primary_cta_label: item.primary_cta_label || "",
      primary_cta_url: item.primary_cta_url || "",
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

      const res = await fetch(`/api/admin/blog-page/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eyebrow_label: form.eyebrow_label.trim() || null,
          heading: form.heading.trim(),
          description: form.description.trim(),
          image_url: form.image_url.trim() || null,
          primary_cta_label: form.primary_cta_label.trim() || null,
          primary_cta_url: form.primary_cta_url.trim() || null,
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

  const toggleActiveStatus = async (item: BlogSectionRecord) => {
    try {
      const res = await fetch(`/api/admin/blog-page/${item.id}`, {
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
            <BookOpen className="h-4 w-4 text-[#b00f23]" />
            <span>Page Editorial Content</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B2A4A] tracking-tight mt-1">
            Blogs Page — Content
          </h1>
          <p className="text-sm text-charcoal-muted mt-1 max-w-2xl">
            Manage the hero banner, copywriting, editorial visuals, and insight badges on the public Blogs &amp; Perspectives page (<code className="text-xs bg-neutral-100 px-1.5 py-0.5 rounded text-[#0B2A4A]">/blog</code>).
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
            href="/blog"
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
          <p className="text-sm font-medium text-[#0B2A4A]">Loading blog page sections...</p>
        </div>
      ) : sections.length === 0 ? (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 sm:p-8 text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800 mb-1">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-base font-serif font-bold text-[#0B2A4A]">No Blog Page Content Found</h3>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-lg mx-auto">
            The database table <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[11px]">blog_page_content</code> has not been seeded yet. Please run migration <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[11px]">012_blog_page.sql</code> in Supabase and run the seed script.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sections.map((sec) => {
            const conf = SECTION_CONFIG[sec.section_key] || {
              title: sec.section_key.toUpperCase(),
              subtitle: "Custom page section content.",
              icon: BookOpen,
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
                    {sec.primary_cta_label && (
                      <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-4">
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
                      </div>
                    )}

                    {/* Extra data badges preview */}
                    {sec.extra_data && Object.keys(sec.extra_data).length > 0 && (
                      <div className="pt-3 border-t border-neutral-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                          Insight Badges &amp; Subheadings
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {(sec.extra_data.badge_1_value || sec.extra_data.badge_1_label) && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] bg-neutral-100 text-[#0B2A4A] border border-neutral-200">
                              <BookOpen className="h-3 w-3 text-[#E2C785]" />
                              <span className="text-neutral-500">{sec.extra_data.badge_1_label || "Curated"}:</span>
                              <strong>{sec.extra_data.badge_1_value || "Insights"}</strong>
                            </span>
                          )}
                          {(sec.extra_data.badge_2_value || sec.extra_data.badge_2_label) && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] bg-red-50 text-[#b00f23] border border-red-200">
                              <Layers className="h-3 w-3 text-[#b00f23]" />
                              <strong>{sec.extra_data.badge_2_value || "3"}</strong>
                              <span className="text-red-700/80">{sec.extra_data.badge_2_label || "Core Pillars"}</span>
                            </span>
                          )}
                          {(sec.extra_data.badge_3_title || sec.extra_data.badge_3_sub) && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] bg-amber-50 text-amber-800 border border-amber-200">
                              <Sparkles className="h-3 w-3 text-amber-600" />
                              <strong>{sec.extra_data.badge_3_title || "Regular Edition"}</strong>
                              {sec.extra_data.badge_3_sub && (
                                <span className="text-amber-700/80">({sec.extra_data.badge_3_sub})</span>
                              )}
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
            <div className="px-6 py-4 bg-[#0B2A4A] text-white flex items-center justify-between shrink-0">
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
              <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
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
                    placeholder="e.g. Insights & Perspectives"
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
                  placeholder="Section headline (line breaks supported)"
                  className="w-full text-xs font-serif text-[#0B2A4A] font-semibold px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Description / Paragraphs
                </label>
                <textarea
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
                  label="Hero Image Asset"
                  value={form.image_url}
                  onChange={(url) => setForm({ ...form, image_url: url })}
                  folder="blogs"
                  hint="Select or upload an editorial photograph from Supabase Storage (/media/blogs/)."
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
                    placeholder="e.g. Explore Topics"
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
                    placeholder="e.g. #articles or #coming-soon"
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  />
                </div>
              </div>

              {/* Section-Specific Form Fields */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B2A4A]">
                  <Sparkles className="h-4 w-4 text-[#C9A24B]" />
                  <span>Blog Subheadings &amp; Highlight Badges</span>
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
                      placeholder="e.g. Thought leadership, healthcare innovations, skincare science..."
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
                      placeholder="e.g. Explore in-depth articles, scientific perspectives..."
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-200/60">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Badge 1 Label
                    </label>
                    <input
                      type="text"
                      value={extraData.badge_1_label || ""}
                      onChange={(e) => setExtraData({ ...extraData, badge_1_label: e.target.value })}
                      placeholder="e.g. Curated"
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Badge 1 Value
                    </label>
                    <input
                      type="text"
                      value={extraData.badge_1_value || ""}
                      onChange={(e) => setExtraData({ ...extraData, badge_1_value: e.target.value })}
                      placeholder="e.g. Insights"
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-200/60">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Badge 2 Value
                    </label>
                    <input
                      type="text"
                      value={extraData.badge_2_value || ""}
                      onChange={(e) => setExtraData({ ...extraData, badge_2_value: e.target.value })}
                      placeholder="e.g. 3"
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Badge 2 Label
                    </label>
                    <input
                      type="text"
                      value={extraData.badge_2_label || ""}
                      onChange={(e) => setExtraData({ ...extraData, badge_2_label: e.target.value })}
                      placeholder="e.g. Core Pillars"
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-200/60">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Badge 3 Title
                    </label>
                    <input
                      type="text"
                      value={extraData.badge_3_title || ""}
                      onChange={(e) => setExtraData({ ...extraData, badge_3_title: e.target.value })}
                      placeholder="e.g. Regular Edition"
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Badge 3 Subtitle
                    </label>
                    <input
                      type="text"
                      value={extraData.badge_3_sub || ""}
                      onChange={(e) => setExtraData({ ...extraData, badge_3_sub: e.target.value })}
                      placeholder="e.g. Healthcare & Science"
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white"
                    />
                  </div>
                </div>
              </div>

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
                  Active (Section is publicly rendered on the Blog page)
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
