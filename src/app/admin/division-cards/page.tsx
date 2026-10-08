"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Layers,
  Building2,
  Sparkles,
  ShieldCheck,
  Award,
  Cross,
  Droplets,
  Pill,
  Heart,
  Stethoscope,
  Activity,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

export interface DivisionCardRecord {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  link_url: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

const POPULAR_ICONS: { name: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { name: "Building2", label: "Building / Pharmacy", icon: Building2 },
  { name: "Sparkles", label: "Sparkles / Beauty", icon: Sparkles },
  { name: "ShieldCheck", label: "Shield / Clinical", icon: ShieldCheck },
  { name: "Award", label: "Award / Overall", icon: Award },
  { name: "Pill", label: "Pill / Medicine", icon: Pill },
  { name: "Cross", label: "Medical Cross", icon: Cross },
  { name: "Droplets", label: "Droplets / Skincare", icon: Droplets },
  { name: "Heart", label: "Heart / Wellness", icon: Heart },
  { name: "Stethoscope", label: "Stethoscope", icon: Stethoscope },
  { name: "Activity", label: "Activity / Pulse", icon: Activity },
  { name: "Layers", label: "Layers / Ecosystem", icon: Layers },
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Sparkles,
  ShieldCheck,
  Award,
  Pill,
  Cross,
  Droplets,
  Heart,
  Stethoscope,
  Activity,
  Layers,
};

function renderIcon(iconName: string, className = "h-5 w-5") {
  const IconComp = ICON_MAP[iconName];
  if (IconComp) {
    return <IconComp className={className} />;
  }
  if (iconName.startsWith("http") || iconName.startsWith("/")) {
    return <img src={iconName} alt="" className={`${className} object-contain`} />;
  }
  return <HelpCircle className={className} />;
}

const QUICK_LINKS = [
  { label: "Pharmacy Chain", url: "/pharmacy-chain" },
  { label: "Cosmetics Division", url: "/cosmetics" },
  { label: "Lamé Brand", url: "/lame" },
  { label: "About Us", url: "/about" },
  { label: "Invest", url: "/invest" },
];

export default function AdminDivisionCardsPage() {
  const [cards, setCards] = useState<DivisionCardRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<DivisionCardRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    icon: "Building2",
    link_url: "/pharmacy-chain",
    is_active: true,
  });

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/division-cards");
      const json = await res.json();
      if (res.ok) setCards(json.cards ?? []);
    } catch {
      // error fetching
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      title: "",
      subtitle: "",
      icon: "Building2",
      link_url: "/pharmacy-chain",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: DivisionCardRecord) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      subtitle: item.subtitle,
      icon: item.icon,
      link_url: item.link_url,
      is_active: item.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingItem) {
        const res = await fetch(`/api/admin/division-cards/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, display_order: editingItem.display_order }),
        });
        if (res.ok) {
          setIsModalOpen(false);
          fetchCards();
        }
      } else {
        const res = await fetch("/api/admin/division-cards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setIsModalOpen(false);
          fetchCards();
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/division-cards/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCards((prev) => prev.filter((item) => item.id !== id));
      }
    } catch {
      // error
    }
  };

  const handleToggleActive = async (item: DivisionCardRecord) => {
    try {
      const newStatus = !item.is_active;
      const res = await fetch(`/api/admin/division-cards/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: newStatus }),
      });
      if (res.ok) {
        setCards((prev) =>
          prev.map((c) => (c.id === item.id ? { ...c, is_active: newStatus } : c))
        );
      }
    } catch {
      // error
    }
  };

  const handleReorder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= cards.length) return;

    const currentItem = cards[index];
    const targetItem = cards[targetIndex];

    const currentOrder = currentItem.display_order;
    const targetOrder = targetItem.display_order;

    // Optimistic update
    const updated = [...cards];
    updated[index] = { ...targetItem, display_order: currentOrder };
    updated[targetIndex] = { ...currentItem, display_order: targetOrder };
    setCards(updated);

    try {
      await Promise.all([
        fetch(`/api/admin/division-cards/${currentItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: targetOrder }),
        }),
        fetch(`/api/admin/division-cards/${targetItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: currentOrder }),
        }),
      ]);
    } catch {
      fetchCards();
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-[2px] w-6 bg-[#b00f23]" />
            <span className="text-xs uppercase tracking-wider font-bold text-[#b00f23]">
              Homepage Content
            </span>
          </div>
          <h1 className="font-serif text-3xl font-semibold text-[#0B2A4A] tracking-tight mt-1">
            Home Division Cards
          </h1>
          <p className="text-sm text-neutral-500 font-light mt-1">
            Manage the category stat cards displayed in the dark navy editorial strip beneath the hero banner.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCards}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-[#0B2A4A] transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#b00f23] hover:bg-[#960d1e] text-white text-xs font-medium tracking-wide transition-all duration-300 shadow-[0_4px_16px_rgba(176,15,35,0.32)] hover:shadow-[0_8px_24px_rgba(176,15,35,0.48)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-[#E2C785]" />
            <span>Add Division Card</span>
          </button>
        </div>
      </div>

      {/* Cards Table */}
      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-16 text-center text-sm text-neutral-400 flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-[#C9A227]" />
            <span>Loading division cards…</span>
          </div>
        ) : cards.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
              <Layers className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-[#0B2A4A]">No Division Cards in Database</p>
            <p className="text-xs text-neutral-500 font-light max-w-sm mx-auto">
              If you haven't run the migration yet, execute <code>004_division_cards.sql</code> in Supabase or run <code>npx tsx scripts/seed-division-cards.ts</code>. The Home page is safely displaying the 4 fallback cards.
            </p>
            <button
              onClick={openAddModal}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B2A4A] text-xs font-semibold text-white hover:bg-[#143d6b] cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create First Card</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-700">
              <thead className="bg-[#FAFBFD] text-xs font-semibold uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="px-5 py-3.5 w-16 text-center">Order</th>
                  <th className="px-5 py-3.5">Card Preview</th>
                  <th className="px-5 py-3.5">Destination Link</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {cards.map((item, index) => (
                  <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                    {/* Reorder Arrows */}
                    <td className="px-5 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          disabled={index === 0}
                          onClick={() => handleReorder(index, "up")}
                          className="p-1 text-neutral-400 hover:text-[#0B2A4A] disabled:opacity-20 disabled:hover:text-neutral-400 cursor-pointer disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-[11px] font-mono font-semibold text-neutral-500">
                          {item.display_order}
                        </span>
                        <button
                          disabled={index === cards.length - 1}
                          onClick={() => handleReorder(index, "down")}
                          className="p-1 text-neutral-400 hover:text-[#0B2A4A] disabled:opacity-20 disabled:hover:text-neutral-400 cursor-pointer disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Card Preview Tile */}
                    <td className="px-5 py-4">
                      <div className="inline-flex items-center gap-3 p-3 rounded-xl bg-[#0B2A4A] text-white border border-white/10 shadow-xs max-w-sm">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 border border-white/15 text-white">
                          {renderIcon(item.icon, "h-5 w-5")}
                        </div>
                        <div className="min-w-0 pr-2">
                          <span className="block font-bold text-xs text-white leading-snug truncate">
                            {item.title}
                          </span>
                          <span className="block text-[11px] text-white/70 font-light leading-tight truncate">
                            {item.subtitle}
                          </span>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-white/40 shrink-0 ml-auto" />
                      </div>
                    </td>

                    {/* Link URL */}
                    <td className="px-5 py-4 text-xs">
                      <a
                        href={item.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 font-mono transition-colors"
                      >
                        <span>{item.link_url}</span>
                        <ExternalLink className="h-3 w-3 text-neutral-400" />
                      </a>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                          item.is_active
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100"
                            : "bg-neutral-100 text-neutral-500 border border-neutral-200 hover:bg-neutral-200/70"
                        }`}
                      >
                        {item.is_active ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5 text-neutral-400" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#0B2A4A]/20 bg-white hover:bg-[#0B2A4A] text-[#0B2A4A] hover:text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer"
                        title="Edit Card"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200 bg-white hover:bg-red-600 text-red-600 hover:text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer"
                        title="Delete Card"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0B2A4A]/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="shrink-0 flex items-center justify-between border-b border-neutral-100 px-6 py-4 bg-white">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#0B2A4A]">
                  {editingItem ? "Edit Division Card" : "Add New Division Card"}
                </h3>
                <p className="text-xs text-neutral-500 font-light mt-0.5">
                  Configure card content, visual icon, and navigation destination.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer text-lg p-1 leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col min-h-0 flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {/* Card Live Preview */}
              <div className="rounded-xl bg-[#0B2A4A] p-4 text-white border border-white/10 shadow-xs">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#C9A227] block mb-2">
                  Live Preview (Navy Band Style)
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white">
                    {renderIcon(form.icon, "h-5 w-5")}
                  </div>
                  <div className="min-w-0">
                    <span className="block font-bold text-sm text-white leading-snug">
                      {form.title || "Card Title"}
                    </span>
                    <span className="block text-xs text-white/70 font-light leading-snug">
                      {form.subtitle || "Card description or stat indicator"}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/40 ml-auto shrink-0" />
                </div>
              </div>

              {/* Title Input */}
              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-600">
                  Card Title *
                </span>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Pharmacy Chain"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-light text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#0B2A4A] focus:ring-1 focus:ring-[#0B2A4A]/30 transition-colors"
                />
              </label>

              {/* Subtitle Input */}
              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-600">
                  Subtitle / Indicator *
                </span>
                <input
                  type="text"
                  required
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="e.g. 500+ Pharmacies Statewide"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-light text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#0B2A4A] focus:ring-1 focus:ring-[#0B2A4A]/30 transition-colors"
                />
              </label>

              {/* Icon Selector */}
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-600 block">
                  Select Icon *
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {POPULAR_ICONS.map((ico) => {
                    const isSelected = form.icon === ico.name;
                    const IcoComp = ico.icon;
                    return (
                      <button
                        type="button"
                        key={ico.name}
                        onClick={() => setForm({ ...form, icon: ico.name })}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#0B2A4A] bg-[#0B2A4A] text-white shadow-xs"
                            : "border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700"
                        }`}
                        title={ico.label}
                      >
                        <IcoComp className="h-5 w-5" />
                        <span className="text-[9px] truncate max-w-[50px] mt-1 opacity-80">
                          {ico.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="pt-1">
                  <div className="pt-2">
                    <ImageUploadField
                      label="Custom Badge / Icon Photo"
                      value={form.icon.startsWith("http") || form.icon.startsWith("/") ? form.icon : ""}
                      onChange={(url) => setForm({ ...form, icon: url || "Building2" })}
                      folder="home-cards"
                      placeholder="e.g. https://... or /images/..."
                      hint="Or choose a custom badge/image from Supabase Storage (/media/home-cards/)."
                    />
                  </div>
                </div>
              </div>

              {/* Link URL */}
              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-600">
                  Target Link URL *
                </span>
                <input
                  type="text"
                  required
                  value={form.link_url}
                  onChange={(e) => setForm({ ...form, link_url: e.target.value })}
                  placeholder="e.g. /pharmacy-chain"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-light text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#0B2A4A] focus:ring-1 focus:ring-[#0B2A4A]/30 transition-colors font-mono text-xs"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {QUICK_LINKS.map((ql) => (
                    <button
                      type="button"
                      key={ql.url}
                      onClick={() => setForm({ ...form, link_url: ql.url })}
                      className="px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-[10px] text-neutral-600 cursor-pointer"
                    >
                      {ql.label}
                    </button>
                  ))}
                </div>
              </label>

              {/* Active Toggle Checkbox */}
              <label className="flex items-center gap-2.5 pt-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-neutral-300 text-[#b00f23] focus:ring-[#b00f23]"
                />
                <span className="text-xs font-medium text-neutral-700">
                  Card is active (visible on homepage)
                </span>
              </label>

              </div>

              {/* Form Buttons (Fixed Footer) */}
              <div className="shrink-0 border-t border-neutral-100 px-6 py-4 bg-neutral-50/90 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-neutral-200 bg-white text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#b00f23] hover:bg-[#960d1e] text-xs font-medium text-white tracking-wide transition-all duration-300 shadow-[0_4px_16px_rgba(176,15,35,0.32)] hover:shadow-[0_8px_24px_rgba(176,15,35,0.48)] disabled:opacity-60 cursor-pointer"
                >
                  {submitting && <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#E2C785]" />}
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
