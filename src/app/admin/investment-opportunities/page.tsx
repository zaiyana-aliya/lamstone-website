"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Sparkles,
  Pill,
  TrendingUp,
  Briefcase,
  Layers,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MapPin,
  ArrowRight,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

export interface OpportunityRecord {
  id: string;
  icon: string;
  category_tag: string;
  title: string;
  location: string;
  description: string;
  cta_url?: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const AVAILABLE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Sparkles,
  Pill,
  TrendingUp,
  Briefcase,
  Layers,
};

export default function AdminInvestmentOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<OpportunityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<OpportunityRecord | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [form, setForm] = useState({
    icon: "Building2",
    category_tag: "",
    title: "",
    location: "",
    description: "",
    cta_url: "modal:inquiry",
    display_order: 0,
    is_active: true,
  });

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/investment-opportunities");
      const contentType = res.headers.get("content-type") || "";
      if (res.status === 401 || !contentType.includes("application/json")) {
        setFeedback({
          type: "error",
          msg: "Session expired or database table not yet initialized. Please verify migration 013_invest_page.sql is run.",
        });
        setOpportunities([]);
        return;
      }
      const data = await res.json();
      if (data.opportunities) {
        setOpportunities(data.opportunities);
      }
    } catch (err: any) {
      console.error("Error fetching investment opportunities:", err);
      setFeedback({ type: "error", msg: "Failed to connect to backend service." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const openCreateModal = () => {
    setIsNew(true);
    setEditingItem(null);
    setForm({
      icon: "Building2",
      category_tag: "",
      title: "",
      location: "",
      description: "",
      cta_url: "modal:inquiry",
      display_order: opportunities.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: OpportunityRecord) => {
    setIsNew(false);
    setEditingItem(item);
    setForm({
      icon: item.icon || "Building2",
      category_tag: item.category_tag || "",
      title: item.title || "",
      location: item.location || "",
      description: item.description || "",
      cta_url: item.cta_url || "modal:inquiry",
      display_order: item.display_order ?? 0,
      is_active: item.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setFeedback(null);

      const url = isNew
        ? "/api/admin/investment-opportunities"
        : `/api/admin/investment-opportunities/${editingItem?.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          icon: form.icon,
          category_tag: form.category_tag.trim(),
          title: form.title.trim(),
          location: form.location.trim(),
          description: form.description.trim(),
          cta_url: form.cta_url.trim() || "modal:inquiry",
          display_order: Number(form.display_order),
          is_active: form.is_active,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to save opportunity.");
      }

      setFeedback({
        type: "success",
        msg: isNew ? "Investment opportunity created successfully." : "Investment opportunity updated successfully.",
      });
      setIsModalOpen(false);
      fetchOpportunities();
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message || "Failed to save opportunity." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete opportunity "${title}"?`)) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/investment-opportunities/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to delete opportunity.");
      }

      setFeedback({ type: "success", msg: `Opportunity "${title}" deleted successfully.` });
      setOpportunities((prev) => prev.filter((o) => o.id !== id));
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message || "Failed to delete opportunity." });
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActiveStatus = async (item: OpportunityRecord) => {
    try {
      const res = await fetch(`/api/admin/investment-opportunities/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_active: !item.is_active,
        }),
      });
      if (res.ok) {
        setOpportunities((prev) =>
          prev.map((o) => (o.id === item.id ? { ...o, is_active: !item.is_active } : o))
        );
        setFeedback({
          type: "success",
          msg: `Opportunity "${item.title}" is now ${!item.is_active ? "Active (Live)" : "Draft (Hidden)"}.`,
        });
      }
    } catch (err) {
      setFeedback({ type: "error", msg: "Could not toggle opportunity visibility." });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#b00f23]">
            <Building2 className="h-4 w-4 text-[#b00f23]" />
            <span>Investment Portfolio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B2A4A] tracking-tight mt-1">
            Investment Opportunities
          </h1>
          <p className="text-sm text-charcoal-muted mt-1 max-w-2xl">
            Manage the repeatable cards on the public Invest page (<code className="text-xs bg-neutral-100 px-1.5 py-0.5 rounded text-[#0B2A4A]">/invest#opportunities</code>). Add new projects, reorder, adjust categories, or toggle visibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOpportunities}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#0B2A4A] bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-[#b00f23]" : ""}`} />
            Refresh
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#b00f23] hover:bg-[#960d1e] rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Opportunity
          </button>
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

      {/* Opportunities List */}
      {loading && opportunities.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-neutral-200 shadow-sm text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-[#b00f23] mb-3" />
          <p className="text-sm font-medium text-[#0B2A4A]">Loading investment opportunities...</p>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 sm:p-8 text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800 mb-1">
            <Building2 className="h-6 w-6" />
          </div>
          <h3 className="text-base font-serif font-bold text-[#0B2A4A]">No Investment Opportunities Found</h3>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-lg mx-auto">
            The database table <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[11px]">investment_opportunities</code> is currently empty. Run the seed script or click &ldquo;Add Opportunity&rdquo; above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.map((opp) => {
            const Icon = AVAILABLE_ICONS[opp.icon] || Building2;

            return (
              <div
                key={opp.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md flex flex-col justify-between ${
                  opp.is_active ? "border-neutral-200/90" : "border-neutral-200 opacity-70 bg-neutral-50/50"
                }`}
              >
                {/* Card Header Strip */}
                <div className="p-5 bg-gradient-to-r from-neutral-50 to-white border-b border-neutral-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#143d6b] via-[#0B2A4A] to-[#071d34] text-white shadow-xs shrink-0">
                      <Icon className="h-5 w-5 stroke-[2] text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#b00f23]">
                        {opp.category_tag}
                      </span>
                      <h3 className="text-base font-serif font-bold text-[#0B2A4A] line-clamp-1">
                        {opp.title}
                      </h3>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded border border-neutral-200">
                    #{opp.display_order}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 text-xs text-neutral-500 font-medium bg-neutral-50 px-2.5 py-1 rounded-full border border-neutral-200/60">
                      <MapPin className="h-3.5 w-3.5 text-[#C9A227] shrink-0" />
                      <span>{opp.location}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-700 font-light leading-relaxed line-clamp-3">
                      {opp.description}
                    </p>
                  </div>

                  {/* Actions & Status */}
                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => toggleActiveStatus(opp)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                        opp.is_active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${opp.is_active ? "bg-emerald-500" : "bg-neutral-400"}`} />
                      {opp.is_active ? "Live" : "Draft"}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(opp)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B2A4A] hover:bg-[#143d6b] text-white rounded-lg text-xs font-medium transition-colors shadow-xs cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3 text-[#E2C785]" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(opp.id, opp.title)}
                        disabled={deletingId === opp.id}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Opportunity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create or Edit Opportunity */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-neutral-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#0B2A4A] to-[#143d6b] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Building2 className="h-5 w-5 text-[#E2C785]" />
                <h3 className="font-serif font-bold text-lg">
                  {isNew ? "Add Investment Opportunity" : `Edit: ${form.title || "Opportunity"}`}
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
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Opportunity Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Attingal Healthcare Hypermarket"
                    className="w-full text-xs font-serif text-[#0B2A4A] font-semibold px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  />
                </div>

                {/* Category Tag */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Category Tag <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.category_tag}
                    onChange={(e) => setForm({ ...form, category_tag: e.target.value })}
                    placeholder="e.g. Healthcare Retail Hypermarket"
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Attingal, Thiruvananthapuram"
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Preset Icon Symbol
                  </label>
                  <select
                    value={Object.keys(AVAILABLE_ICONS).includes(form.icon) ? form.icon : "Building2"}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] bg-white cursor-pointer"
                  >
                    {Object.keys(AVAILABLE_ICONS).map((ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Card Visual / Media Picker */}
                <div className="sm:col-span-2 pt-2">
                  <ImageUploadField
                    label="Custom Opportunity Visual / Icon Photo"
                    value={form.icon.startsWith("http") || form.icon.startsWith("/") ? form.icon : ""}
                    onChange={(url) => setForm({ ...form, icon: url || "Building2" })}
                    folder="invest"
                    placeholder="e.g. https://... or /images/..."
                    hint="Choose or upload an image from Supabase Storage (/media/invest/) to display as the card visual, or use the preset icon symbol above."
                  />
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  />
                </div>

                {/* CTA URL */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    CTA Action / URL
                  </label>
                  <input
                    type="text"
                    value={form.cta_url}
                    onChange={(e) => setForm({ ...form, cta_url: e.target.value })}
                    placeholder="modal:inquiry or custom URL"
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  />
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    Use <code className="text-[#b00f23]">modal:inquiry</code> to trigger the inquiry modal with this opportunity auto-selected.
                  </span>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Provide details about prospectus, equity, catchment area, and timeline..."
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A] leading-relaxed"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2 border-t border-neutral-100">
                <input
                  type="checkbox"
                  id="modal_is_active_opp"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0B2A4A] focus:ring-[#0B2A4A] cursor-pointer"
                />
                <label htmlFor="modal_is_active_opp" className="text-xs font-semibold text-neutral-700 cursor-pointer">
                  Active (Opportunity card is visible on public Invest page)
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
                    isNew ? "Create Opportunity" : "Save Changes"
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
