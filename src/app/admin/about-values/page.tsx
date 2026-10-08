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
  ShieldCheck,
  Lightbulb,
  Users,
  Heart,
  Sparkles,
  Leaf,
  Target,
  Eye,
  Award,
  LucideIcon,
} from "lucide-react";

export interface AboutValueRecord {
  id: string;
  icon: string;
  title: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

const AVAILABLE_ICONS: { name: string; icon: LucideIcon; label: string }[] = [
  { name: "ShieldCheck", icon: ShieldCheck, label: "Shield Check (Quality)" },
  { name: "Lightbulb", icon: Lightbulb, label: "Lightbulb (Innovation)" },
  { name: "Users", icon: Users, label: "Users (People & Community)" },
  { name: "Heart", icon: Heart, label: "Heart (Care & Loyalty)" },
  { name: "Sparkles", icon: Sparkles, label: "Sparkles (Excellence)" },
  { name: "Leaf", icon: Leaf, label: "Leaf (Sustainability / Natural)" },
  { name: "Target", icon: Target, label: "Target (Mission / Precision)" },
  { name: "Eye", icon: Eye, label: "Eye (Vision)" },
  { name: "Award", icon: Award, label: "Award (Trust / Certified)" },
];

const ICON_COMPONENTS: Record<string, LucideIcon> = {
  ShieldCheck,
  Lightbulb,
  Users,
  Heart,
  Sparkles,
  Leaf,
  Target,
  Eye,
  Award,
};

export default function AdminAboutValuesPage() {
  const [values, setValues] = useState<AboutValueRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<AboutValueRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [form, setForm] = useState({
    icon: "ShieldCheck",
    title: "",
    description: "",
    is_active: true,
  });

  const fetchValues = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/about-values");
      const contentType = res.headers.get("content-type") || "";

      if (res.status === 401) {
        window.location.href = "/admin/login?callbackUrl=/admin/about-values";
        return;
      }

      if (!contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response.");
      }

      const data = await res.json();
      if (res.ok) {
        setValues(data.values || []);
      } else {
        setFeedback({ type: "error", msg: data.error || "Failed to load values" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message || "Network error loading values" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchValues();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      icon: "ShieldCheck",
      title: "",
      description: "",
      is_active: true,
    });
    setFeedback(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: AboutValueRecord) => {
    setEditingItem(item);
    setForm({
      icon: item.icon || "ShieldCheck",
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
        const res = await fetch(`/api/admin/about-values/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update value");
        setFeedback({ type: "success", msg: `Updated "${form.title}" successfully!` });
      } else {
        const res = await fetch("/api/admin/about-values", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create value");
        setFeedback({ type: "success", msg: `Added "${form.title}" successfully!` });
      }

      setIsModalOpen(false);
      fetchValues();
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message || "Failed to save value" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to remove the value "${title}"?`)) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/admin/about-values/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      setFeedback({ type: "success", msg: `Deleted "${title}"` });
      fetchValues();
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message || "Failed to delete value" });
      setLoading(false);
    }
  };

  const toggleActive = async (item: AboutValueRecord) => {
    try {
      const res = await fetch(`/api/admin/about-values/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !item.is_active }),
      });
      if (res.ok) {
        setValues((prev) =>
          prev.map((v) => (v.id === item.id ? { ...v, is_active: !v.is_active } : v))
        );
      }
    } catch {
      // error
    }
  };

  const moveOrder = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= values.length) return;

    const list = [...values];
    const current = list[index];
    const target = list[targetIdx];

    const currentOrder = current.display_order;
    current.display_order = target.display_order;
    target.display_order = currentOrder;

    list[index] = target;
    list[targetIdx] = current;
    setValues(list);

    await Promise.all([
      fetch(`/api/admin/about-values/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_order: current.display_order }),
      }),
      fetch(`/api/admin/about-values/${target.id}`, {
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
            About Values
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Manage repeatable value pillars shown in the &quot;Explore How Lamstone Shapes Us&quot; section on /about.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/about#values"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-medium text-neutral-700 transition-colors shadow-xs"
          >
            <ExternalLink className="h-3.5 w-3.5 text-neutral-500" />
            <span>View Section</span>
          </a>
          <button
            onClick={fetchValues}
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
            <span>Add Value Card</span>
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

      {/* Cards List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-56 rounded-3xl bg-neutral-100 animate-pulse border border-neutral-200" />
          ))}
        </div>
      ) : values.length === 0 ? (
        <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-serif text-lg font-medium text-neutral-900">
              No Values Found
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500">
              Run the seed script or click &quot;Add Value Card&quot; to create your first card.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, index) => {
            const IconComp = ICON_COMPONENTS[val.icon] || ShieldCheck;

            return (
              <div
                key={val.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs hover:shadow-md hover:border-neutral-300 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Top Bar: Icon + Reorder & Action buttons */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B2A4A] text-white shadow-xs">
                      <IconComp className="h-6 w-6 stroke-[2]" />
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
                        disabled={index === values.length - 1}
                        title="Move Right/Down"
                        className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => openEditModal(val)}
                        title="Edit Value"
                        className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 ml-1"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(val.id, val.title)}
                        title="Delete Value"
                        className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-neutral-900 leading-snug">
                      {val.title}
                    </h3>
                    <p className="text-xs text-neutral-600 font-light leading-relaxed mt-2">
                      {val.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Bar: Active Toggle & Order */}
                <div className="mt-5 pt-3.5 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-neutral-400">Order: #{val.display_order}</span>
                  <button
                    onClick={() => toggleActive(val)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-colors ${
                      val.is_active
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        val.is_active ? "bg-emerald-500" : "bg-neutral-400"
                      }`}
                    />
                    <span>{val.is_active ? "Active" : "Disabled"}</span>
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
                {editingItem ? "Edit Value Card" : "Add New Value Card"}
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
                    Controls whether this value card renders on /about.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0B2A4A] focus:ring-[#0B2A4A]"
                />
              </div>

              {/* Icon Selector */}
              <label className="flex flex-col gap-1.5">
                <span className="font-semibold text-neutral-700 uppercase tracking-wider text-[10px]">
                  Select Card Icon
                </span>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {AVAILABLE_ICONS.map((item) => {
                    const Icon = item.icon;
                    const isSelected = form.icon === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setForm({ ...form, icon: item.name })}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                          isSelected
                            ? "border-[#0B2A4A] bg-[#0B2A4A]/5 text-[#0B2A4A] font-semibold"
                            : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </label>

              {/* Title */}
              <label className="flex flex-col gap-1.5">
                <span className="font-semibold text-neutral-700 uppercase tracking-wider text-[10px]">
                  Value Title
                </span>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:border-[#0B2A4A]"
                  placeholder="e.g. Quality First, Sustainable Impact"
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
                  placeholder="Explain this core organizational value..."
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
                  <span>{editingItem ? "Save Changes" : "Create Card"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
