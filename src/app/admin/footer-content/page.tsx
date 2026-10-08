"use client";

import React, { useState, useEffect } from "react";
import {
  PanelBottom,
  Save,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Plus,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Share2,
  Link as LinkIcon,
  ShieldCheck,
} from "lucide-react";

interface QuickLinkItem {
  href: string;
  label: string;
}

interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
}

interface FooterContentRecord {
  id?: string;
  section_key?: string;
  company_description: string;
  phone: string;
  email: string;
  office_address: string;
  corporate_office_address: string;
  social_links: SocialLinks;
  copyright_text: string;
  quick_links: QuickLinkItem[];
  newsletter_heading?: string;
  newsletter_description?: string;
  is_active: boolean;
  updated_at?: string;
}

const DEFAULT_FOOTER_STATE: FooterContentRecord = {
  company_description:
    "A trusted healthcare and beauty ecosystem dedicated to enhancing wellness and confidence through premium pharmacy chains and cosmetic brands.",
  phone: "+91 9746397686",
  email: "mail@lamstonehealthcare.com",
  office_address:
    "Lamstone HealthCare Pvt Ltd\nZ Avenue, 10/20/E-10/20/G, NH 66, Mangalapuram, Kerala, India - 695317",
  corporate_office_address:
    "Alverstone Healthcare Pvt Ltd\nBio 360 Kerala Life Sciences Industries Park, Trivandrum, Kerala, India - 695317",
  social_links: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  },
  copyright_text: "© 2026 Lamstone HealthCare Pvt Ltd. All rights reserved.",
  quick_links: [
    { href: "/about", label: "About Us" },
    { href: "/pharmacy-chain", label: "Our Pharmacies" },
    { href: "/cosmetics", label: "Cosmetics Division" },
    { href: "/lame", label: "Lamé Brand" },
    { href: "/invest", label: "Invest With Us" },
  ],
  newsletter_heading: "Newsletter",
  newsletter_description:
    "Subscribe for the latest healthcare insights and product updates.",
  is_active: true,
};

export default function AdminFooterContentPage() {
  const [data, setData] = useState<FooterContentRecord>(DEFAULT_FOOTER_STATE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const fetchFooter = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/footer-content");
      const json = await res.json();
      if (json.footer) {
        setData({
          ...DEFAULT_FOOTER_STATE,
          ...json.footer,
          social_links: {
            ...DEFAULT_FOOTER_STATE.social_links,
            ...(json.footer.social_links || {}),
          },
          quick_links: Array.isArray(json.footer.quick_links) && json.footer.quick_links.length > 0
            ? json.footer.quick_links
            : DEFAULT_FOOTER_STATE.quick_links,
        });
      }
    } catch (err: any) {
      console.error("Error fetching footer data:", err);
      setFeedback({ type: "error", msg: "Failed to load footer content from backend." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setFeedback(null);

      const res = await fetch("/api/admin/footer-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Failed to save footer content.");
      }

      setFeedback({ type: "success", msg: "Site-wide footer content saved and live!" });
      if (json.footer) {
        setData((prev) => ({ ...prev, ...json.footer }));
      }
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message || "Failed to update footer." });
    } finally {
      setSaving(false);
    }
  };

  // Quick links helpers
  const handleAddQuickLink = () => {
    setData((prev) => ({
      ...prev,
      quick_links: [...prev.quick_links, { label: "New Page", href: "/" }],
    }));
  };

  const handleUpdateQuickLink = (index: number, field: "label" | "href", value: string) => {
    const updated = [...data.quick_links];
    updated[index] = { ...updated[index], [field]: value };
    setData((prev) => ({ ...prev, quick_links: updated }));
  };

  const handleRemoveQuickLink = (index: number) => {
    setData((prev) => ({
      ...prev,
      quick_links: prev.quick_links.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#b00f23]">
            <PanelBottom className="h-4 w-4 text-[#b00f23]" />
            <span>Site-Wide Page Content</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B2A4A] tracking-tight mt-1">
            Footer Content
          </h1>
          <p className="text-sm text-neutral-600 mt-1 max-w-2xl">
            Configure the brand description, contact numbers, corporate addresses, social links, quick navigation links, and copyright text displayed across all public pages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchFooter}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#0B2A4A] bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-[#b00f23]" : ""}`} />
            <span>Refresh</span>
          </button>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-[#0B2A4A] rounded-lg hover:bg-[#143d6b] shadow-2xs transition-colors cursor-pointer"
          >
            <ExternalLink className="h-3.5 w-3.5 text-[#E2C785]" />
            <span>View Live Site</span>
          </a>
        </div>
      </div>

      {/* Feedback Bar */}
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

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-neutral-200 shadow-2xs text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-[#b00f23] mb-3" />
          <p className="text-sm font-medium text-[#0B2A4A]">Loading site footer configuration...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Card 1: Brand & Company Overview */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-neutral-50 to-white border-b border-neutral-100 flex items-center gap-2.5">
              <Globe className="h-4 w-4 text-[#0B2A4A]" />
              <h2 className="text-sm font-serif font-bold text-[#0B2A4A]">
                1. Brand Description &amp; Copyright
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Company Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={data.company_description}
                  onChange={(e) => setData({ ...data, company_description: e.target.value })}
                  placeholder="A trusted healthcare and beauty ecosystem dedicated to enhancing wellness..."
                  className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] leading-relaxed"
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  Displayed in column 1 of the footer under the brand logo.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Copyright Notice
                </label>
                <input
                  type="text"
                  required
                  value={data.copyright_text}
                  onChange={(e) => setData({ ...data, copyright_text: e.target.value })}
                  placeholder="© 2026 Lamstone HealthCare Pvt Ltd. All rights reserved."
                  className="w-full text-xs px-3.5 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Contact Numbers & Addresses */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-neutral-50 to-white border-b border-neutral-100 flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-[#b00f23]" />
              <h2 className="text-sm font-serif font-bold text-[#0B2A4A]">
                2. Contact Information &amp; Office Locations
              </h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Primary Phone / WhatsApp
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3 h-3.5 w-3.5 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={data.phone}
                      onChange={(e) => setData({ ...data, phone: e.target.value })}
                      placeholder="+91 9746397686"
                      className="w-full text-xs pl-9 pr-3.5 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Official Email
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 h-3.5 w-3.5 text-neutral-400" />
                    <input
                      type="email"
                      required
                      value={data.email}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      placeholder="mail@lamstonehealthcare.com"
                      className="w-full text-xs pl-9 pr-3.5 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Registered Office Address
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={data.office_address}
                    onChange={(e) => setData({ ...data, office_address: e.target.value })}
                    placeholder="Lamstone HealthCare Pvt Ltd&#10;Z Avenue, 10/20/E-10/20/G, NH 66, Mangalapuram..."
                    className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] leading-relaxed"
                  />
                  <p className="text-[11px] text-neutral-400 mt-0.5">Use line breaks to separate address lines.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Corporate Head Office Address
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={data.corporate_office_address}
                    onChange={(e) => setData({ ...data, corporate_office_address: e.target.value })}
                    placeholder="Alverstone Healthcare Pvt Ltd&#10;Bio 360 Kerala Life Sciences Industries Park..."
                    className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] leading-relaxed"
                  />
                  <p className="text-[11px] text-neutral-400 mt-0.5">Use line breaks to separate address lines.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Social Media Profiles */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-neutral-50 to-white border-b border-neutral-100 flex items-center gap-2.5">
              <Share2 className="h-4 w-4 text-[#C9A24B]" />
              <h2 className="text-sm font-serif font-bold text-[#0B2A4A]">
                3. Social Media Links
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Facebook URL
                </label>
                <input
                  type="text"
                  value={data.social_links.facebook || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      social_links: { ...data.social_links, facebook: e.target.value },
                    })
                  }
                  placeholder="https://facebook.com/..."
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Instagram URL
                </label>
                <input
                  type="text"
                  value={data.social_links.instagram || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      social_links: { ...data.social_links, instagram: e.target.value },
                    })
                  }
                  placeholder="https://instagram.com/..."
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  value={data.social_links.linkedin || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      social_links: { ...data.social_links, linkedin: e.target.value },
                    })
                  }
                  placeholder="https://linkedin.com/company/..."
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Quick Navigation Links */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-neutral-50 to-white border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <LinkIcon className="h-4 w-4 text-[#0B2A4A]" />
                <h2 className="text-sm font-serif font-bold text-[#0B2A4A]">
                  4. Quick Links List ({data.quick_links.length})
                </h2>
              </div>
              <button
                type="button"
                onClick={handleAddQuickLink}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-white bg-[#0B2A4A] hover:bg-[#143d6b] transition-colors cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                Add Link
              </button>
            </div>
            <div className="p-6 space-y-3">
              {data.quick_links.length === 0 ? (
                <p className="text-xs text-neutral-400 italic py-2">
                  No quick links configured. Click &quot;Add Link&quot; to create one.
                </p>
              ) : (
                <div className="space-y-2">
                  {data.quick_links.map((link, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/80"
                    >
                      <span className="text-xs text-neutral-400 font-mono w-5 shrink-0 text-center">
                        {idx + 1}.
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                        <input
                          type="text"
                          required
                          value={link.label}
                          onChange={(e) => handleUpdateQuickLink(idx, "label", e.target.value)}
                          placeholder="Link Label (e.g. About Us)"
                          className="text-xs px-3 py-1.5 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0B2A4A]"
                        />
                        <input
                          type="text"
                          required
                          value={link.href}
                          onChange={(e) => handleUpdateQuickLink(idx, "href", e.target.value)}
                          placeholder="Link URL (e.g. /about)"
                          className="text-xs px-3 py-1.5 bg-white border border-neutral-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#0B2A4A]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuickLink(idx)}
                        className="text-red-500 hover:text-red-700 p-1.5 cursor-pointer"
                        title="Delete Link"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card 5: Newsletter Texts */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-neutral-50 to-white border-b border-neutral-100 flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-[#0B2A4A]" />
              <h2 className="text-sm font-serif font-bold text-[#0B2A4A]">
                5. Newsletter Callout Headings
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Newsletter Box Heading
                </label>
                <input
                  type="text"
                  value={data.newsletter_heading || "Newsletter"}
                  onChange={(e) => setData({ ...data, newsletter_heading: e.target.value })}
                  placeholder="Newsletter"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Newsletter Description
                </label>
                <input
                  type="text"
                  value={data.newsletter_description || ""}
                  onChange={(e) => setData({ ...data, newsletter_description: e.target.value })}
                  placeholder="Subscribe for the latest healthcare insights..."
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                />
              </div>
            </div>
          </div>

          {/* Save Action Bar */}
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-200 shadow-xs">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="footer_is_active"
                checked={data.is_active}
                onChange={(e) => setData({ ...data, is_active: e.target.checked })}
                className="h-4 w-4 rounded border-neutral-300 text-[#0B2A4A] focus:ring-[#0B2A4A] cursor-pointer"
              />
              <label htmlFor="footer_is_active" className="text-xs font-medium text-neutral-700 select-none cursor-pointer">
                Active (Footer is published and visible on public pages)
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#0B2A4A] hover:bg-[#b00f23] rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Footer Content</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
