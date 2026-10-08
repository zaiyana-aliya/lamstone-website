"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, Save, CheckCircle2, RotateCcw, LayoutTemplate } from "lucide-react";

interface ContentSection {
  id?: string;
  page_name: string;
  section_key: string;
  content_json: Record<string, any>;
  updated_at?: string;
}

const DEFAULT_SECTIONS = [
  {
    page: "home",
    key: "hero_banner",
    label: "Home — Hero Banner Text",
    description: "Main headline, supporting narrative, and tagline shown on the homepage hero.",
    fields: [
      { key: "headline", label: "Headline", type: "text" },
      { key: "subheadline", label: "Subheadline / Narrative", type: "textarea" },
      { key: "tagline", label: "Tagline", type: "text" },
    ],
    defaults: {
      headline: "Excellence in Healthcare & Dermo-Cosmetics",
      subheadline: "A trusted healthcare and beauty ecosystem across South India.",
      tagline: "Healthcare · Pharmaceuticals · Cosmetics",
    },
  },
  {
    page: "about",
    key: "md_quote",
    label: "About — Managing Director Message",
    description: "Executive quote, speaker name, and corporate title.",
    fields: [
      { key: "quote", label: "Quote Statement", type: "textarea" },
      { key: "author", label: "Author / Speaker Name", type: "text" },
      { key: "title", label: "Professional Title", type: "text" },
    ],
    defaults: {
      quote: "Our mission is to make premium pharmaceutical care and clinical skincare accessible to every community.",
      author: "Rijas Rehman",
      title: "Founder & Managing Director",
    },
  },
  {
    page: "pharmacy",
    key: "hero_stats",
    label: "Pharmacy Chain — Banner Stats",
    description: "High-level summary counters displayed on the pharmacy chain banner.",
    fields: [
      { key: "target_stores", label: "Target Stores", type: "text" },
      { key: "districts_covered", label: "Districts Covered", type: "text" },
      { key: "daily_patients", label: "Daily Patients", type: "text" },
    ],
    defaults: {
      target_stores: "500+",
      districts_covered: "14",
      daily_patients: "10,000+",
    },
  },
];

export default function PageContentAdminPage() {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(DEFAULT_SECTIONS[0]);
  const [formData, setFormData] = useState<Record<string, any>>(DEFAULT_SECTIONS[0].defaults);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/page-content");
      const data = await res.json();
      if (res.ok) {
        setSections(data.content ?? []);
        const found = data.content?.find(
          (s: ContentSection) =>
            s.page_name === selectedSection.page &&
            s.section_key === selectedSection.key
        );
        if (found && found.content_json) {
          setFormData({ ...selectedSection.defaults, ...found.content_json });
        } else {
          setFormData(selectedSection.defaults);
        }
      }
    } catch {
      // error handling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const selectSection = (sec: typeof DEFAULT_SECTIONS[0]) => {
    setSelectedSection(sec);
    setSuccess(false);
    setError(null);
    const existing = sections.find(
      (s) => s.page_name === sec.page && s.section_key === sec.key
    );
    if (existing && existing.content_json) {
      setFormData({ ...sec.defaults, ...existing.content_json });
    } else {
      setFormData(sec.defaults);
    }
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/page-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_name: selectedSection.page,
          section_key: selectedSection.key,
          content_json: formData,
        }),
      });

      if (!res.ok) {
        setError("Failed to save content");
      } else {
        setSuccess(true);
        fetchContent();
      }
    } catch {
      setError("Network error saving content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#b00f23]">
            <span>Page Content</span>
            <span>•</span>
            <span>Global</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B2A4A] tracking-tight mt-1">
            Page Content (Global)
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Edit dynamic headlines, leadership quotes, and stat callouts across public pages.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B2A4A] hover:bg-[#b00f23] text-xs font-semibold text-white tracking-wide transition-all shadow-2xs cursor-pointer disabled:opacity-60"
        >
          {saving ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#E2C785]" />
          ) : (
            <Save className="h-4 w-4 text-[#E2C785]" />
          )}
          <span>{saving ? "Saving…" : "Save Section Content"}</span>
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Content section saved successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Section List */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 space-y-2 shadow-2xs">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block px-2 pb-1">
            Configurable Sections
          </span>
          {DEFAULT_SECTIONS.map((sec) => (
            <button
              key={`${sec.page}-${sec.key}`}
              onClick={() => selectSection(sec)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${
                selectedSection.page === sec.page && selectedSection.key === sec.key
                  ? "bg-[#0B2A4A] text-white font-semibold shadow-xs"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <span>{sec.label}</span>
              <span className="text-[10px] opacity-60 uppercase font-mono">{sec.page}</span>
            </button>
          ))}
        </div>

        {/* Structured Form Field Editor */}
        <div className="md:col-span-2 rounded-2xl border border-neutral-200/80 bg-white p-6 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h3 className="font-serif font-bold text-base text-[#0B2A4A]">{selectedSection.label}</h3>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Key: {selectedSection.page}.{selectedSection.key}
              </p>
            </div>
            <button
              onClick={() => setFormData(selectedSection.defaults)}
              className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-[#b00f23] transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset to default</span>
            </button>
          </div>

          <p className="text-xs text-neutral-500 font-light">
            {selectedSection.description}
          </p>

          <div className="space-y-4">
            {selectedSection.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    rows={4}
                    value={formData[field.key] ?? ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] leading-relaxed"
                  />
                ) : (
                  <input
                    type="text"
                    value={formData[field.key] ?? ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400 font-light">
            <span>Stored as JSONB in <code className="text-neutral-600 font-mono">page_content</code> table.</span>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="text-[#0B2A4A] hover:text-[#b00f23] font-semibold transition-colors cursor-pointer"
            >
              Save Changes →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
