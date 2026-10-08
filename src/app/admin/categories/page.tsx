"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, RefreshCw, X, PlusCircle } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

interface CategoryRecord {
  id: string;
  page_name: "pharmacy" | "cosmetics";
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  features_json: string[];
  cta_label: string | null;
  cta_link: string | null;
  display_order: number;
}

export default function AdminCategoriesPage() {
  const [activePage, setActivePage] = useState<"cosmetics" | "pharmacy">("cosmetics");
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<CategoryRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    page_name: "cosmetics" as "pharmacy" | "cosmetics",
    title: "",
    subtitle: "",
    description: "",
    image_url: "",
    features_json: [] as string[],
    cta_label: "",
    cta_link: "",
  });
  const [newFeatureText, setNewFeatureText] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/product-categories?page=${activePage}`);
      const json = await res.json();
      if (res.ok) setCategories(json.categories ?? []);
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [activePage]);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      page_name: activePage,
      title: "",
      subtitle: "",
      description: "",
      image_url: "",
      features_json: [],
      cta_label: activePage === "cosmetics" ? "Inquire Distribution" : "Locate Dispensary",
      cta_link: activePage === "cosmetics" ? "/contact" : "/pharmacy-chain#locations",
    });
    setNewFeatureText("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryRecord) => {
    setEditingItem(cat);
    setForm({
      page_name: cat.page_name,
      title: cat.title,
      subtitle: cat.subtitle || "",
      description: cat.description || "",
      image_url: cat.image_url || "",
      features_json: Array.isArray(cat.features_json) ? cat.features_json : [],
      cta_label: cat.cta_label || "",
      cta_link: cat.cta_link || "",
    });
    setNewFeatureText("");
    setIsModalOpen(true);
  };

  const addFeature = () => {
    if (!newFeatureText.trim()) return;
    setForm((prev) => ({
      ...prev,
      features_json: [...prev.features_json, newFeatureText.trim()],
    }));
    setNewFeatureText("");
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features_json: prev.features_json.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await fetch(`/api/admin/product-categories/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, display_order: editingItem.display_order }),
        });
        if (res.ok) {
          setIsModalOpen(false);
          fetchCategories();
        }
      } else {
        const res = await fetch("/api/admin/product-categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setIsModalOpen(false);
          fetchCategories();
        }
      }
    } catch {
      // error
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete category "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/product-categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } catch {
      // error
    }
  };

  const moveOrder = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= categories.length) return;

    const list = [...categories];
    const current = list[index];
    const target = list[targetIdx];

    const currentOrder = current.display_order;
    current.display_order = target.display_order;
    target.display_order = currentOrder;

    list[index] = target;
    list[targetIdx] = current;
    setCategories(list);

    await Promise.all([
      fetch(`/api/admin/product-categories/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current),
      }),
      fetch(`/api/admin/product-categories/${target.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(target),
      }),
    ]);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#0B2A4A] tracking-tight">
            Product Categories Manager
          </h1>
          <p className="text-sm text-neutral-500 font-light mt-1">
            Configure the 3-category showcase on Cosmetics Division or the stock categories on Pharmacy Chain.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#b00f23] hover:bg-[#960d1e] text-white text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 shadow-[0_4px_16px_rgba(176,15,35,0.32)] hover:shadow-[0_8px_24px_rgba(176,15,35,0.48)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Plus className="h-4 w-4 text-[#E2C785]" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Page Tabs */}
      <div className="border-b border-neutral-200 flex gap-2 pb-px">
        <button
          onClick={() => setActivePage("cosmetics")}
          className={`px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors cursor-pointer ${
            activePage === "cosmetics"
              ? "bg-white text-[#0B2A4A] border border-b-white border-neutral-200 shadow-2xs font-bold"
              : "text-neutral-500 hover:text-[#0B2A4A]"
          }`}
        >
          Cosmetics Categories (3)
        </button>
        <button
          onClick={() => setActivePage("pharmacy")}
          className={`px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors cursor-pointer ${
            activePage === "pharmacy"
              ? "bg-white text-[#0B2A4A] border border-b-white border-neutral-200 shadow-2xs font-bold"
              : "text-neutral-500 hover:text-[#0B2A4A]"
          }`}
        >
          Pharmacy Stock Categories (5)
        </button>
      </div>

      {/* Categories Table */}
      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-12 text-center text-sm text-neutral-400 flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-[#C9A227]" />
            <span>Loading categories…</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-16 text-center text-sm text-neutral-400 font-light">
            No categories found for this page. Click &quot;Add New Category&quot; or run the seed script.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-700">
              <thead className="bg-[#FAFBFD] text-xs font-semibold uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="px-5 py-3.5 w-16">Order</th>
                  {activePage === "cosmetics" && <th className="px-5 py-3.5 w-24">Image</th>}
                  <th className="px-5 py-3.5">Category Title</th>
                  <th className="px-5 py-3.5">Subtitle / Description</th>
                  <th className="px-5 py-3.5">Bullets</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {categories.map((cat, idx) => (
                  <tr key={cat.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => moveOrder(idx, "up")}
                          className="p-1 rounded text-neutral-400 hover:text-[#0B2A4A] disabled:opacity-20 cursor-pointer"
                          aria-label="Move Up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          disabled={idx === categories.length - 1}
                          onClick={() => moveOrder(idx, "down")}
                          className="p-1 rounded text-neutral-400 hover:text-[#0B2A4A] disabled:opacity-20 cursor-pointer"
                          aria-label="Move Down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>

                    {activePage === "cosmetics" && (
                      <td className="px-5 py-4">
                        {cat.image_url ? (
                          <div className="relative h-12 w-16 rounded-lg overflow-hidden border border-neutral-100 bg-neutral-100">
                            <Image
                              src={cat.image_url}
                              alt={cat.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-neutral-300">No image</span>
                        )}
                      </td>
                    )}

                    <td className="px-5 py-4 font-semibold text-[#0B2A4A]">
                      {cat.title}
                    </td>

                    <td className="px-5 py-4 text-xs text-neutral-600 max-w-xs">
                      {cat.subtitle && <span className="font-medium block text-neutral-800">{cat.subtitle}</span>}
                      {cat.description && <span className="line-clamp-2 text-neutral-500 font-light mt-0.5">{cat.description}</span>}
                    </td>

                    <td className="px-5 py-4 text-xs">
                      <span className="inline-block px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-medium">
                        {(cat.features_json || []).length} items
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="inline-flex items-center gap-1 text-xs text-[#0B2A4A] hover:text-[#b00f23] cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(cat.id, cat.title)}
                        className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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
              <h3 className="font-serif text-xl font-semibold text-[#0B2A4A]">
                {editingItem ? "Edit Product Category" : "Add New Product Category"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer text-lg p-1 leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col min-h-0 flex-1 overflow-hidden text-sm">
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">Page *</span>
                  <select
                    value={form.page_name}
                    onChange={(e) => setForm({ ...form, page_name: e.target.value as any })}
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-xs outline-none focus:border-[#0B2A4A]"
                  >
                    <option value="cosmetics">Cosmetics Division</option>
                    <option value="pharmacy">Pharmacy Chain</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">Category Title *</span>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Skincare"
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-xs outline-none focus:border-[#0B2A4A]"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-neutral-600 uppercase">Subtitle</span>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="e.g. Facial Care & Dermatological Formulations"
                  className="rounded-xl border border-neutral-200 px-3.5 py-2 text-xs outline-none focus:border-[#0B2A4A]"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-neutral-600 uppercase">Description</span>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Overview of this product category…"
                  className="rounded-xl border border-neutral-200 px-3.5 py-2 text-xs outline-none focus:border-[#0B2A4A] resize-none"
                />
              </label>

              {/* Bullets Manager */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-neutral-600 uppercase">
                  Bullet Points / Features ({form.features_json.length})
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    placeholder="Add bullet highlight (e.g. Clinical Sunscreens & UV Protection)…"
                    className="flex-1 rounded-xl border border-neutral-200 px-3 py-1.5 text-xs outline-none focus:border-[#0B2A4A]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-[#0B2A4A] cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {form.features_json.map((feat, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 text-xs text-neutral-700 font-light"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(i)}
                        className="text-neutral-400 hover:text-red-600 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Image Uploader */}
              <ImageUploadField
                label="Category Cover Photo"
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
                folder="cosmetics-categories"
                hint="Used prominently on division showcase cards. Stored in /media/cosmetics-categories/."
              />

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">CTA Label</span>
                  <input
                    type="text"
                    value={form.cta_label}
                    onChange={(e) => setForm({ ...form, cta_label: e.target.value })}
                    placeholder="Inquire Distribution"
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-xs outline-none focus:border-[#0B2A4A]"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">CTA Link</span>
                  <input
                    type="text"
                    value={form.cta_link}
                    onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
                    placeholder="/contact"
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-xs outline-none focus:border-[#0B2A4A]"
                  />
                </label>
              </div>

              </div>

              <div className="shrink-0 border-t border-neutral-100 px-6 py-4 bg-neutral-50/90 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-neutral-200 bg-white text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#b00f23] hover:bg-[#960d1e] text-xs font-medium text-white tracking-wide transition-all duration-300 shadow-[0_4px_16px_rgba(176,15,35,0.32)] hover:shadow-[0_8px_24px_rgba(176,15,35,0.48)] cursor-pointer"
                >
                  <span>{editingItem ? "Save Changes" : "Create Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
