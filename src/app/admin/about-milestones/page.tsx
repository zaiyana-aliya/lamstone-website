"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Milestone,
  Sparkles,
} from "lucide-react";

export interface AboutMilestoneRecord {
  id: string;
  year: string;
  milestone_label: string;
  title: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export default function AdminAboutMilestonesPage() {
  const [milestones, setMilestones] = useState<AboutMilestoneRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<AboutMilestoneRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [form, setForm] = useState({
    year: "",
    milestone_label: "MILESTONE 01",
    title: "",
    description: "",
    is_active: true,
  });

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/about-milestones");
      const contentType = res.headers.get("content-type") || "";

      if (res.status === 401) {
        window.location.href = "/admin/login?callbackUrl=/admin/about-milestones";
        return;
      }

      if (!contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response.");
      }

      const data = await res.json();
      if (res.ok) {
        setMilestones(data.milestones || []);
      } else {
        setFeedback({ type: "error", msg: data.error || "Failed to load milestones" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message || "Network error loading milestones" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    const nextIdx = milestones.length + 1;
    setForm({
      year: new Date().getFullYear().toString(),
      milestone_label: `MILESTONE ${String(nextIdx).padStart(2, "0")}`,
      title: "",
      description: "",
      is_active: true,
    });
    setFeedback(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: AboutMilestoneRecord) => {
    setEditingItem(item);
    setForm({
      year: item.year,
      milestone_label: item.milestone_label,
      title: item.title,
      description: item.description,
      is_active: item.is_active,
    });
    setFeedback(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setFeedback(null);

      if (editingItem) {
        const res = await fetch(`/api/admin/about-milestones/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update milestone");
        setFeedback({ type: "success", msg: `Updated "${form.title}" successfully!` });
      } else {
        const res = await fetch("/api/admin/about-milestones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create milestone");
        setFeedback({ type: "success", msg: `Added "${form.title}" successfully!` });
      }

      setIsModalOpen(false);
      fetchMilestones();
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message || "Failed to save milestone" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to remove the milestone "${title}"?`)) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/admin/about-milestones/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      setFeedback({ type: "success", msg: `Deleted "${title}"` });
      fetchMilestones();
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message || "Failed to delete milestone" });
      setLoading(false);
    }
  };

  const toggleActive = async (item: AboutMilestoneRecord) => {
    try {
      const res = await fetch(`/api/admin/about-milestones/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !item.is_active }),
      });
      if (res.ok) {
        setMilestones((prev) =>
          prev.map((m) => (m.id === item.id ? { ...m, is_active: !m.is_active } : m))
        );
      }
    } catch {
      // error
    }
  };

  const moveOrder = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= milestones.length) return;

    const list = [...milestones];
    const current = list[index];
    const target = list[targetIdx];

    const currentOrder = current.display_order;
    current.display_order = target.display_order;
    target.display_order = currentOrder;

    list[index] = target;
    list[targetIdx] = current;
    setMilestones(list);

    await Promise.all([
      fetch(`/api/admin/about-milestones/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_order: current.display_order }),
      }),
      fetch(`/api/admin/about-milestones/${target.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_order: target.display_order }),
      }),
    ]);
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-[#0B2A4A]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B2A4A]">
              Page Content
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-neutral-900 mt-1">
            About Milestones
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Manage growth roadmap timeline cards shown in the &quot;Our Growth Roadmap&quot; section on /about.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/about#roadmap"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-medium text-neutral-700 transition-colors shadow-xs"
          >
            <ExternalLink className="h-3.5 w-3.5 text-neutral-500" />
            <span>View Section</span>
          </a>
          <button
            onClick={fetchMilestones}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-medium text-neutral-700 transition-colors shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B2A4A] hover:bg-[#143d6b] text-xs font-semibold text-white transition-all shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Milestone</span>
          </button>
        </div>
      </div>

      {/* Global Feedback Alert */}
      {feedback && (
        <div
          className={`flex items-start gap-3 p-4 rounded-2xl border text-xs sm:text-sm ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          )}
          <span className="font-medium">{feedback.msg}</span>
        </div>
      )}

      {/* Milestones Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-60 rounded-3xl bg-neutral-100 animate-pulse border border-neutral-200" />
          ))}
        </div>
      ) : milestones.length === 0 ? (
        <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
            <Milestone className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-serif text-lg font-medium text-neutral-900">
              No Milestones Found
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500">
              Run the seed script or click &quot;Add Milestone&quot; to create your first card.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((step, index) => {
            const displayStepNum = String(index + 1).padStart(2, "0");

            return (
              <div
                key={step.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs hover:shadow-md hover:border-neutral-300 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Top Badges & Actions */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-[#0B2A4A] px-3 py-0.5 text-xs font-bold text-white shadow-xs">
                        {step.year}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[#FAF1DC] border border-[#C9A227]/40 px-2.5 py-0.5 text-xs font-bold text-[#7A5B0B]">
                        {displayStepNum}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveOrder(index, "up")}
                        disabled={index === 0}
                        title="Move Left/Up"
                        className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => moveOrder(index, "down")}
                        disabled={index === milestones.length - 1}
                        title="Move Right/Down"
                        className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => openEditModal(step)}
                        title="Edit Milestone"
                        className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 ml-1"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(step.id, step.title)}
                        title="Delete Milestone"
                        className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-neutral-900 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs text-neutral-600 font-light leading-relaxed mt-2">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-2 text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                    {step.milestone_label}
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-5 pt-3.5 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-neutral-400">Order: #{step.display_order}</span>
                  <button
                    onClick={() => toggleActive(step)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-colors ${
                      step.is_active
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        step.is_active ? "bg-emerald-500" : "bg-neutral-400"
                      }`}
                    />
                    <span>{step.is_active ? "Active" : "Disabled"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="shrink-0 flex items-center justify-between px-6 py-4 sm:px-8 border-b border-neutral-100 bg-white">
              <h3 className="font-serif text-lg font-semibold text-neutral-900">
                {editingItem ? "Edit Milestone" : "Add New Milestone"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col min-h-0 flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8 space-y-4">
              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <div>
                  <span className="text-xs font-semibold text-neutral-800 block">Active Status</span>
                  <span className="text-[11px] text-neutral-500">
                    Controls whether this milestone card renders on /about.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0B2A4A] focus:ring-[#0B2A4A]"
                />
              </div>

              {/* Year & Milestone Label */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="font-semibold text-neutral-700 uppercase tracking-wider text-[10px]">
                    Milestone Year
                  </span>
                  <input
                    type="text"
                    required
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className="rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:border-[#0B2A4A]"
                    placeholder="e.g. 2019, 2024"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="font-semibold text-neutral-700 uppercase tracking-wider text-[10px]">
                    Milestone Label
                  </span>
                  <input
                    type="text"
                    required
                    value={form.milestone_label}
                    onChange={(e) => setForm({ ...form, milestone_label: e.target.value })}
                    className="rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:border-[#0B2A4A]"
                    placeholder="e.g. MILESTONE 01"
                  />
                </label>
              </div>

              {/* Title */}
              <label className="flex flex-col gap-1.5">
                <span className="font-semibold text-neutral-700 uppercase tracking-wider text-[10px]">
                  Milestone Title
                </span>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:border-[#0B2A4A]"
                  placeholder="e.g. Inception of Lamstone, LAMÉ Brand Launch"
                />
              </label>

              {/* Description */}
              <label className="flex flex-col gap-1.5">
                <span className="font-semibold text-neutral-700 uppercase tracking-wider text-[10px]">
                  Description
                </span>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:border-[#0B2A4A]"
                  placeholder="Details of the achievements and expansion..."
                />
              </label>

              </div>

              <div className="shrink-0 flex items-center justify-end gap-3 px-6 py-4 sm:px-8 border-t border-neutral-100 bg-neutral-50/90">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-medium text-neutral-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#0B2A4A] hover:bg-[#143d6b] text-xs font-semibold text-white transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {submitting && <RefreshCw className="h-3 w-3 animate-spin text-white" />}
                  <span>{editingItem ? "Save Changes" : "Create Milestone"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
