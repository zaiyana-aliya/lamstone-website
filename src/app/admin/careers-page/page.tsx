"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Users,
  Edit2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Award,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

export interface CareersSectionRecord {
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
    title: "Careers Hero Banner",
    subtitle:
      "Section 1 — Main headline, dual-tier narrative copy, team collaboration visual, 'View Open Roles' CTA, and 3 trust / culture badges (Equal Opportunity, Growth Ecosystem, Expanding Network).",
    icon: Briefcase,
    accentColor: "#b00f23",
    tag: "HERO BANNER",
  },
  culture_intro: {
    title: "Opportunities & Culture Intro",
    subtitle:
      "Section 2 — Header shown for opportunities and team values. Displays the opportunities eyebrow, headline, descriptive copy, and CTA buttons.",
    icon: Users,
    accentColor: "#0B2A4A",
    tag: "OPPORTUNITIES & CULTURE",
  },
};

const CAREER_ICON_OPTIONS = [
  "Briefcase",
  "Users",
  "Sparkles",
  "TrendingUp",
  "Award",
  "CheckCircle2",
];

export default function AdminCareersPage() {
  const [sections, setSections] = useState<CareersSectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<CareersSectionRecord | null>(null);
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
      const res = await fetch("/api/admin/careers-page");
      const data = await res.json();
      if (data.sections) {
        setSections(data.sections);
      }
    } catch (err: any) {
      console.error("Error fetching careers sections:", err);
      setFeedback({ type: "error", msg: "Failed to load sections from database." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const openEditModal = (sec: CareersSectionRecord) => {
    setSelectedSection(sec);
    setForm({
      eyebrow_label: sec.eyebrow_label || "",
      heading: sec.heading || "",
      description: sec.description || "",
      image_url: sec.image_url || "",
      primary_cta_label: sec.primary_cta_label || "",
      primary_cta_url: sec.primary_cta_url || "",
      secondary_cta_label: sec.secondary_cta_label || "",
      secondary_cta_url: sec.secondary_cta_url || "",
      is_active: sec.is_active !== undefined ? sec.is_active : true,
    });
    setExtraData(sec.extra_data ? JSON.parse(JSON.stringify(sec.extra_data)) : {});
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSection) return;

    try {
      setSubmitting(true);
      setFeedback(null);

      const res = await fetch(`/api/admin/careers-page/${selectedSection.id}`, {
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
        throw new Error(errJson.error || "Failed to save section changes.");
      }

      setFeedback({
        type: "success",
        msg: `Section "${selectedSection.section_key}" updated successfully.`,
      });
      setIsModalOpen(false);
      fetchSections();
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message || "Failed to update section." });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (sec: CareersSectionRecord) => {
    try {
      const res = await fetch(`/api/admin/careers-page/${sec.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_active: !sec.is_active,
        }),
      });

      if (res.ok) {
        setSections((prev) =>
          prev.map((s) => (s.id === sec.id ? { ...s, is_active: !sec.is_active } : s))
        );
        setFeedback({
          type: "success",
          msg: `Section "${sec.section_key}" status updated.`,
        });
      }
    } catch (err) {
      setFeedback({ type: "error", msg: "Failed to update status." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#b00f23] uppercase tracking-wider mb-1">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Page Content CMS</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#0B2A4A]">Careers Page — Content</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage hero headline, culture introductions, and badge highlights on <code className="text-[#0B2A4A] bg-neutral-100 px-1 py-0.5 rounded">/careers</code>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchSections}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-[#b00f23]" : ""}`} />
            <span>Refresh</span>
          </button>
          <a
            href="/careers"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#0B2A4A] hover:bg-[#b00f23] rounded-lg transition-colors cursor-pointer"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View Live Page</span>
          </a>
        </div>
      </div>

      {/* Alert Bar */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between border transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.msg}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="font-semibold underline cursor-pointer ml-4 text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Section Content Cards */}
      {loading && sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-neutral-200 shadow-sm text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-[#b00f23] mb-3" />
          <p className="text-sm font-medium text-[#0B2A4A]">Loading careers page content...</p>
        </div>
      ) : sections.length === 0 ? (
        <div className="p-8 bg-amber-50/70 border border-amber-200 rounded-2xl text-center space-y-2">
          <p className="text-sm font-medium text-amber-900">No Careers Page Sections Found</p>
          <p className="text-xs text-amber-700">
            Please make sure migration <code className="bg-white px-1 py-0.5 rounded font-mono">014_careers_page.sql</code> and the seed script have been run.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((sec) => {
            const conf = SECTION_CONFIG[sec.section_key] || {
              title: sec.section_key.toUpperCase(),
              subtitle: "Careers section content",
              icon: Briefcase,
              accentColor: "#0B2A4A",
              tag: "SECTION",
            };
            const Icon = conf.icon;

            return (
              <div
                key={sec.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
                  sec.is_active ? "border-neutral-200" : "border-neutral-200/60 opacity-70 bg-neutral-50/50"
                }`}
              >
                {/* Strip */}
                <div className="px-5 py-3.5 bg-gradient-to-r from-neutral-50 to-white border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: conf.accentColor }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 font-mono">
                          {sec.section_key}
                        </span>
                        <h2 className="text-sm font-serif font-bold text-[#0B2A4A]">
                          {conf.title}
                        </h2>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{conf.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(sec)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
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
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#0B2A4A] bg-neutral-50 hover:bg-[#0B2A4A] hover:text-white border border-neutral-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-3">
                      {sec.eyebrow_label && (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#b00f23] block">
                            Eyebrow Label
                          </span>
                          <span className="text-xs font-semibold text-neutral-700">
                            {sec.eyebrow_label}
                          </span>
                        </div>
                      )}

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                          Headline
                        </span>
                        <h3 className="text-base font-serif font-bold text-[#0B2A4A] whitespace-pre-line mt-0.5">
                          {sec.heading}
                        </h3>
                      </div>

                      {sec.description && (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                            Body Description
                          </span>
                          <p className="text-xs text-neutral-600 whitespace-pre-line mt-0.5 leading-relaxed bg-neutral-50/70 p-3 rounded-lg border border-neutral-100">
                            {sec.description}
                          </p>
                        </div>
                      )}

                      {(sec.primary_cta_label || sec.secondary_cta_label) && (
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          {sec.primary_cta_label && (
                            <div className="px-3 py-1 rounded-lg bg-neutral-100 text-[11px] text-neutral-700 flex items-center gap-1.5 font-medium">
                              <span className="text-[9px] uppercase tracking-wider text-neutral-400">Primary:</span>
                              <span>{sec.primary_cta_label}</span>
                              {sec.primary_cta_url && (
                                <span className="font-mono text-[9px] text-neutral-400">({sec.primary_cta_url})</span>
                              )}
                            </div>
                          )}
                          {sec.secondary_cta_label && (
                            <div className="px-3 py-1 rounded-lg bg-neutral-100 text-[11px] text-neutral-700 flex items-center gap-1.5 font-medium">
                              <span className="text-[9px] uppercase tracking-wider text-neutral-400">Secondary:</span>
                              <span>{sec.secondary_cta_label}</span>
                              {sec.secondary_cta_url && (
                                <span className="font-mono text-[9px] text-neutral-400">({sec.secondary_cta_url})</span>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Formatted Badges / Parameters Preview */}
                      {sec.extra_data && Object.keys(sec.extra_data).length > 0 && (
                        <div className="pt-3 border-t border-neutral-100">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                            Configured Badges &amp; Subheadings
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {sec.extra_data.badge1_title && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] bg-red-50 text-[#b00f23] border border-red-200">
                                <span className="text-red-700/80">{sec.extra_data.badge1_label}:</span>
                                <strong>{sec.extra_data.badge1_title}</strong>
                              </span>
                            )}
                            {sec.extra_data.badge2_title && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] bg-blue-50 text-blue-800 border border-blue-200">
                                <span className="text-blue-600/80">{sec.extra_data.badge2_label}:</span>
                                <strong>{sec.extra_data.badge2_title}</strong>
                              </span>
                            )}
                            {sec.extra_data.badge3_title && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <strong>{sec.extra_data.badge3_title}</strong>
                                {sec.extra_data.badge3_subtitle && (
                                  <span className="text-emerald-700/80">({sec.extra_data.badge3_subtitle})</span>
                                )}
                              </span>
                            )}
                            {sec.extra_data.icon && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] bg-amber-50 text-amber-800 border border-amber-200">
                                <span className="text-amber-600">Icon:</span>
                                <strong>{sec.extra_data.icon}</strong>
                              </span>
                            )}
                            {sec.extra_data.subheading && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] bg-neutral-100 text-neutral-700 border border-neutral-200">
                                <span className="text-neutral-400">Subheading:</span>
                                <span className="truncate max-w-xs">{sec.extra_data.subheading}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 bg-neutral-50/70 p-4 rounded-xl border border-neutral-100 text-xs">
                      {sec.image_url ? (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                            Media Asset
                          </span>
                          <div className="relative h-28 w-full rounded-lg overflow-hidden border border-neutral-200">
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
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Section Modal */}
      {isModalOpen && selectedSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#0B2A4A] text-white flex items-center justify-center">
                  <Edit2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0B2A4A]">
                    Edit Section: {selectedSection.section_key}
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    ID: {selectedSection.id}
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
              <div className="p-6 space-y-5 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Eyebrow Label
                  </label>
                  <input
                    type="text"
                    value={form.eyebrow_label}
                    onChange={(e) => setForm({ ...form, eyebrow_label: e.target.value })}
                    placeholder="e.g. Join Our Team"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Main Heading <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.heading}
                    onChange={(e) => setForm({ ...form, heading: e.target.value })}
                    placeholder="e.g. Careers at Lamstone"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Description / Body Copy <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Enter descriptive copy..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                />
              </div>

              {/* Image Upload Component */}
              <div>
                <ImageUploadField
                  label="Hero / Background Image"
                  value={form.image_url}
                  onChange={(url) => setForm({ ...form, image_url: url })}
                  folder="careers"
                  hint="Suggested: 1920x1080 high quality photography stored in /media/careers/."
                />
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Primary CTA Label
                  </label>
                  <input
                    type="text"
                    value={form.primary_cta_label}
                    onChange={(e) => setForm({ ...form, primary_cta_label: e.target.value })}
                    placeholder="e.g. View Open Roles"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
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
                    placeholder="e.g. #careers-notice or modal:apply"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Secondary CTA Label
                  </label>
                  <input
                    type="text"
                    value={form.secondary_cta_label}
                    onChange={(e) => setForm({ ...form, secondary_cta_label: e.target.value })}
                    placeholder="e.g. Learn About Lamstone"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Secondary CTA URL
                  </label>
                  <input
                    type="text"
                    value={form.secondary_cta_url}
                    onChange={(e) => setForm({ ...form, secondary_cta_url: e.target.value })}
                    placeholder="e.g. /about"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  />
                </div>
              </div>

              {/* Section-Specific Form Fields */}
              {selectedSection.section_key === "hero" && (
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B2A4A]">
                    <Sparkles className="h-4 w-4 text-[#b00f23]" />
                    <span>Hero Badges &amp; Subheadings</span>
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
                        placeholder="e.g. Be part of a growing healthcare, pharmaceutical, and beauty ecosystem."
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white"
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
                        placeholder="e.g. Join our passionate team across retail pharmacies..."
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-200">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Badge 1 Label
                      </label>
                      <input
                        type="text"
                        value={extraData.badge1_label || ""}
                        onChange={(e) => setExtraData({ ...extraData, badge1_label: e.target.value })}
                        placeholder="e.g. Equal"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Badge 1 Title
                      </label>
                      <input
                        type="text"
                        value={extraData.badge1_title || ""}
                        onChange={(e) => setExtraData({ ...extraData, badge1_title: e.target.value })}
                        placeholder="e.g. Opportunity"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-200">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Badge 2 Label
                      </label>
                      <input
                        type="text"
                        value={extraData.badge2_label || ""}
                        onChange={(e) => setExtraData({ ...extraData, badge2_label: e.target.value })}
                        placeholder="e.g. Growth"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Badge 2 Title
                      </label>
                      <input
                        type="text"
                        value={extraData.badge2_title || ""}
                        onChange={(e) => setExtraData({ ...extraData, badge2_title: e.target.value })}
                        placeholder="e.g. Ecosystem"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-200">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Badge 3 Title
                      </label>
                      <input
                        type="text"
                        value={extraData.badge3_title || ""}
                        onChange={(e) => setExtraData({ ...extraData, badge3_title: e.target.value })}
                        placeholder="e.g. Expanding Network"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Badge 3 Subtitle
                      </label>
                      <input
                        type="text"
                        value={extraData.badge3_subtitle || ""}
                        onChange={(e) => setExtraData({ ...extraData, badge3_subtitle: e.target.value })}
                        placeholder="e.g. Kerala & South India"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedSection.section_key === "culture_intro" && (
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B2A4A]">
                    <Users className="h-4 w-4 text-[#0B2A4A]" />
                    <span>Culture Intro Parameters</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Header Icon
                    </label>
                    <select
                      value={extraData.icon || "Briefcase"}
                      onChange={(e) => setExtraData({ ...extraData, icon: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white"
                    >
                      {CAREER_ICON_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Subheading
                    </label>
                    <input
                      type="text"
                      value={extraData.subheading || ""}
                      onChange={(e) => setExtraData({ ...extraData, subheading: e.target.value })}
                      placeholder="e.g. Join our team — open roles will be posted here soon."
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white"
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
                      placeholder="e.g. We are actively expanding our retail pharmacy network..."
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                <input
                  type="checkbox"
                  id="careers_is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0B2A4A] focus:ring-[#0B2A4A] cursor-pointer"
                />
                <label htmlFor="careers_is_active" className="text-xs font-medium text-neutral-700 select-none cursor-pointer">
                  Active (visible on public site)
                </label>
              </div>

              </div>

              {/* Modal Buttons (Fixed Footer) */}
              <div className="shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 bg-neutral-50/90">
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
