"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  LayoutTemplate,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Building2,
  Eye,
  ImageIcon,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

export interface CoreDivisionRecord {
  id: string;
  badge_label: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  cta_label: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const BADGE_PRESETS = [
  "PHARMACY CHAIN",
  "COSMETICS DIVISION",
  "LAMÉ BRAND",
  "OVERALL HEALTHCARE",
  "DISTRIBUTION & LOGISTICS",
  "WELLNESS & BEAUTY",
];

const LINK_PRESETS = [
  { label: "Pharmacy Chain", url: "/pharmacy-chain", cta: "Our Pharmacies" },
  { label: "Cosmetics Division", url: "/cosmetics", cta: "Brand Collection" },
  { label: "Lamé", url: "/lame", cta: "Discover Lamé" },
  { label: "About Us", url: "/about", cta: "Learn More" },
  { label: "Invest", url: "/invest", cta: "Explore Investment" },
  { label: "Contact", url: "/contact", cta: "Get in Touch" },
];

export default function AdminCoreDivisionsPage() {
  const [divisions, setDivisions] = useState<CoreDivisionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<CoreDivisionRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [form, setForm] = useState({
    badge_label: "PHARMACY CHAIN",
    title: "",
    description: "",
    image_url: "/images/home/pharmacy-luxury-storefront.jpg",
    link_url: "/pharmacy-chain",
    cta_label: "Our Pharmacies",
    is_active: true,
  });

  const fetchDivisions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/core-divisions");
      const contentType = res.headers.get("content-type") || "";

      if (res.status === 401) {
        window.location.href = "/admin/login?callbackUrl=/admin/core-divisions";
        return;
      }

      if (!contentType.includes("application/json")) {
        throw new Error("Server returned an unexpected response. Please refresh or log in again.");
      }

      const data = await res.json();
      if (res.ok) {
        setDivisions(data.divisions || []);
      } else {
        setFeedback({ type: "error", msg: data.error || "Failed to load divisions" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message || "Network error loading divisions" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDivisions();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      badge_label: "PHARMACY CHAIN",
      title: "",
      description: "",
      image_url: "/images/home/pharmacy-luxury-storefront.jpg",
      link_url: "/pharmacy-chain",
      cta_label: "Our Pharmacies",
      is_active: true,
    });
    setFeedback(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: CoreDivisionRecord) => {
    setEditingItem(item);
    setForm({
      badge_label: item.badge_label || "",
      title: item.title || "",
      description: item.description || "",
      image_url: item.image_url || "",
      link_url: item.link_url || "/about",
      cta_label: item.cta_label || "Learn More",
      is_active: item.is_active ?? true,
    });
    setFeedback(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.image_url.trim()) {
      alert("Please fill in the title, description, and image URL.");
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const url = editingItem
        ? `/api/admin/core-divisions/${editingItem.id}`
        : "/api/admin/core-divisions";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save core division");
      }

      setIsModalOpen(false);
      fetchDivisions();
      setFeedback({
        type: "success",
        msg: editingItem
          ? "Division card updated successfully!"
          : "New division card added successfully!",
      });
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message || "Error saving division" });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (item: CoreDivisionRecord) => {
    try {
      const res = await fetch(`/api/admin/core-divisions/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !item.is_active }),
      });
      if (res.ok) {
        setDivisions((prev) =>
          prev.map((d) => (d.id === item.id ? { ...d, is_active: !d.is_active } : d))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const moveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= divisions.length) return;

    const currentItem = divisions[index];
    const targetItem = divisions[targetIndex];

    const newDivisions = [...divisions];
    newDivisions[index] = { ...targetItem, display_order: currentItem.display_order };
    newDivisions[targetIndex] = { ...currentItem, display_order: targetItem.display_order };
    setDivisions(newDivisions);

    try {
      await Promise.all([
        fetch(`/api/admin/core-divisions/${currentItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: targetItem.display_order }),
        }),
        fetch(`/api/admin/core-divisions/${targetItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: currentItem.display_order }),
        }),
      ]);
    } catch (err) {
      console.error("Failed to persist reordering", err);
      fetchDivisions();
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the division card "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/core-divisions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDivisions((prev) => prev.filter((d) => d.id !== id));
        setFeedback({ type: "success", msg: `Deleted "${title}".` });
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#0B2A4A] text-white flex items-center justify-center shadow-xs">
              <LayoutTemplate className="h-5 w-5 text-[#E2C785]" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#0B2A4A]">Our Core Divisions</h1>
          </div>
          <p className="text-sm text-neutral-500 font-light mt-1">
            Manage the large cards featured in Section 3 ("Our Core Divisions") on the Home page.
            Supports any number of divisions with custom photography, titles, descriptions, and CTA links.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={fetchDivisions}
            disabled={loading}
            className="p-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#b00f23] hover:bg-[#960d1e] text-white text-sm font-medium tracking-wide transition-all duration-300 shadow-[0_4px_16px_rgba(176,15,35,0.32)] hover:shadow-[0_8px_24px_rgba(176,15,35,0.48)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-[#E2C785]" />
            <span>Add Division Card</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between gap-3 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <span>{feedback.msg}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs opacity-60 hover:opacity-100 font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Content Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="h-8 w-8 text-[#0B2A4A] animate-spin" />
          <p className="text-sm font-light text-neutral-500">Loading core divisions...</p>
        </div>
      ) : divisions.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-neutral-200 rounded-2xl bg-white/50 space-y-4">
          <LayoutTemplate className="h-10 w-10 text-neutral-300 mx-auto" />
          <div>
            <h3 className="text-base font-semibold text-neutral-700">No division cards found</h3>
            <p className="text-sm text-neutral-500 font-light mt-1 max-w-md mx-auto">
              If you haven't run the migration yet, run{" "}
              <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-700 text-xs">
                005_core_divisions.sql
              </code>{" "}
              in Supabase and run the seed script.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B2A4A] text-white text-xs font-medium cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-[#E2C785]" />
            <span>Create First Card</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {divisions.map((item, index) => (
              <div
                key={item.id}
                className={`flex flex-col justify-between rounded-2xl border bg-white overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 ${
                  item.is_active ? "border-neutral-200" : "border-neutral-200 opacity-60 bg-neutral-50/50"
                }`}
              >
                {/* Image Banner */}
                <div className="relative aspect-[21/9] w-full bg-neutral-900 overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/40">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}

                  {/* Dark gradient for badge contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                  {/* Badge */}
                  <div className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#132a4e] shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-[#b00f23]" />
                    <span>{item.badge_label}</span>
                  </div>

                  {/* Order Tag & Active Status */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 text-white text-[11px] font-mono font-medium backdrop-blur-xs">
                      #{item.display_order}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-medium backdrop-blur-xs ${
                        item.is_active
                          ? "bg-emerald-500/90 text-white"
                          : "bg-neutral-500/80 text-white"
                      }`}
                    >
                      {item.is_active ? "Active" : "Draft"}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="block h-[2px] w-8 bg-[#b00f23]" />
                    <h3 className="font-serif text-xl font-medium text-[#132a4e]">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                    <span className="inline-flex items-center gap-1 text-[#b00f23] font-medium">
                      <span>{item.cta_label || "Learn More"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-mono text-[11px] text-neutral-400">
                      {item.link_url}
                    </span>
                  </div>
                </div>

                {/* Admin Toolbar Footer */}
                <div className="bg-neutral-50 px-5 py-3 border-t border-neutral-100 flex items-center justify-between gap-2 text-xs">
                  {/* Reordering */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveOrder(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-600 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => moveOrder(index, "down")}
                      disabled={index === divisions.length - 1}
                      className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-600 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Active Toggle Switch */}
                  <button
                    onClick={() => toggleActive(item)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                      item.is_active
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100"
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
                        <span>Hidden</span>
                      </>
                    )}
                  </button>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#0B2A4A]/20 bg-white hover:bg-[#0B2A4A] text-[#0B2A4A] hover:text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-red-200 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 text-xs font-medium transition-colors cursor-pointer"
                      title="Delete card"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span className="sr-only sm:not-sr-only sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-100 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0B2A4A] text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  {editingItem ? "Edit Division Card" : "Add New Core Division Card"}
                </h3>
                <p className="text-xs text-white/70 font-light mt-0.5">
                  Customize photography, badge, copy, and link for this core division.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-white/60 hover:text-white text-lg font-light cursor-pointer p-1 leading-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="flex flex-col min-h-0 flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Badge Label */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Badge Label
                </label>
                <input
                  type="text"
                  required
                  value={form.badge_label}
                  onChange={(e) => setForm({ ...form, badge_label: e.target.value })}
                  placeholder="e.g. PHARMACY CHAIN"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-light text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#0B2A4A] focus:ring-1 focus:ring-[#0B2A4A]/30 transition-colors uppercase tracking-wider text-xs font-bold"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {BADGE_PRESETS.map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => setForm({ ...form, badge_label: b })}
                      className="px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-[10px] text-neutral-600 cursor-pointer"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Card Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Lamstone Pharmacy Chain"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-light text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#0B2A4A] focus:ring-1 focus:ring-[#0B2A4A]/30 transition-colors font-medium"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Description Paragraph
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Comprehensive description of the division, its scale, ecosystem, or brand portfolio..."
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-light text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#0B2A4A] focus:ring-1 focus:ring-[#0B2A4A]/30 transition-colors resize-y leading-relaxed"
                />
              </div>

              {/* Image URL with Media Picker */}
              <ImageUploadField
                label="Division Card Image"
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
                required
                folder="home-cards"
                placeholder="e.g. /images/home-pharmacy-card.jpg"
                hint="Click 'Browse Media' to upload or pick images from Supabase Storage (/media/home-cards/)."
              />
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-neutral-400 font-light">Quick Presets:</span>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      image_url: "/images/home-pharmacy-card.jpg",
                    })
                  }
                  className="px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-[10px] text-neutral-600 cursor-pointer"
                >
                  Pharmacy Storefront
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      image_url: "/images/home-cosmetics-card.jpg",
                    })
                  }
                  className="px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-[10px] text-neutral-600 cursor-pointer"
                >
                  Cosmetics Division
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      image_url: "/images/lame/lame-banner-green.jpg",
                    })
                  }
                  className="px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-[10px] text-neutral-600 cursor-pointer"
                >
                  Lamé Products
                </button>
              </div>

              {/* Link URL & CTA Label */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                    Link URL
                  </label>
                  <input
                    type="text"
                    required
                    value={form.link_url}
                    onChange={(e) => setForm({ ...form, link_url: e.target.value })}
                    placeholder="e.g. /pharmacy-chain"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-light text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#0B2A4A] focus:ring-1 focus:ring-[#0B2A4A]/30 transition-colors font-mono text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    required
                    value={form.cta_label}
                    onChange={(e) => setForm({ ...form, cta_label: e.target.value })}
                    placeholder="e.g. Our Pharmacies"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-light text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#0B2A4A] focus:ring-1 focus:ring-[#0B2A4A]/30 transition-colors"
                  />
                </div>
              </div>

              {/* Quick link presets */}
              <div className="space-y-1">
                <span className="text-[11px] text-neutral-400 font-light">Quick Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {LINK_PRESETS.map((p) => (
                    <button
                      type="button"
                      key={p.url}
                      onClick={() => setForm({ ...form, link_url: p.url, cta_label: p.cta })}
                      className="px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-[10px] text-neutral-600 cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <label className="flex items-center gap-2.5 pt-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0B2A4A] focus:ring-[#0B2A4A]/30"
                />
                <span className="text-sm font-medium text-neutral-700">
                  Visible on Home Page (Active)
                </span>
              </label>

              {/* Live Preview Box */}
              <div className="pt-4 border-t border-neutral-100 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  <Eye className="h-3.5 w-3.5" />
                  <span>Card Live Preview</span>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50">
                  <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden max-w-sm mx-auto shadow-xs">
                    <div className="relative aspect-[21/9] bg-neutral-900 overflow-hidden">
                      {form.image_url ? (
                        <img
                          src={form.image_url}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/40">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                      <div className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#132a4e]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#b00f23]" />
                        <span>{form.badge_label || "BADGE"}</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <span className="block h-[2px] w-6 bg-[#b00f23]" />
                      <h4 className="font-serif text-base font-medium text-[#132a4e]">
                        {form.title || "Card Title"}
                      </h4>
                      <p className="text-xs text-neutral-600 font-light line-clamp-2">
                        {form.description || "Description preview text will show here..."}
                      </p>
                      <div className="pt-2 flex items-center gap-1 text-xs text-[#b00f23] font-semibold">
                        <span>{form.cta_label || "Learn More"}</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              </div>

              {/* Modal Buttons (Fixed Footer) */}
              <div className="shrink-0 border-t border-neutral-200 px-6 py-4 bg-neutral-50/90 flex items-center justify-end gap-3">
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
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#b00f23] hover:bg-[#960d1e] text-xs font-medium text-white tracking-wide transition-all duration-300 shadow-[0_4px_16px_rgba(176,15,35,0.32)] hover:shadow-[0_8px_24px_rgba(176,15,35,0.48)] disabled:opacity-50 cursor-pointer"
                >
                  {submitting && <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#E2C785]" />}
                  <span>{editingItem ? "Update Division Card" : "Create Division Card"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
