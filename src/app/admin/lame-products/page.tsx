"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, RefreshCw, CheckCircle2, Clock, X } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

interface LameProductRecord {
  id: string;
  name: string;
  category_label: string;
  descriptor: string | null;
  description: string;
  image_url: string;
  features_json: string[];
  status: "coming_soon" | "available";
  store_url: string | null;
  display_order: number;
}

export default function AdminLameProductsPage() {
  const [products, setProducts] = useState<LameProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<LameProductRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category_label: "Cleanser",
    descriptor: "",
    description: "",
    image_url: "",
    features_json: [] as string[],
    status: "available" as "coming_soon" | "available",
    store_url: "",
  });
  const [newBullet, setNewBullet] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/lame-products");
      const json = await res.json();
      if (res.ok) setProducts(json.products ?? []);
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      name: "",
      category_label: "Cleanser",
      descriptor: "",
      description: "",
      image_url: "",
      features_json: [],
      status: "available",
      store_url: "",
    });
    setNewBullet("");
    setIsModalOpen(true);
  };

  const openEditModal = (prod: LameProductRecord) => {
    setEditingItem(prod);
    setForm({
      name: prod.name,
      category_label: prod.category_label,
      descriptor: prod.descriptor || "",
      description: prod.description,
      image_url: prod.image_url,
      features_json: Array.isArray(prod.features_json) ? prod.features_json : [],
      status: prod.status,
      store_url: prod.store_url || "",
    });
    setNewBullet("");
    setIsModalOpen(true);
  };

  const addBullet = () => {
    if (!newBullet.trim()) return;
    setForm((prev) => ({
      ...prev,
      features_json: [...prev.features_json, newBullet.trim()],
    }));
    setNewBullet("");
  };

  const removeBullet = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features_json: prev.features_json.filter((_, i) => i !== index),
    }));
  };

  const toggleStatus = async (prod: LameProductRecord) => {
    const newStatus = prod.status === "coming_soon" ? "available" : "coming_soon";
    try {
      const res = await fetch(`/api/admin/lame-products/${prod.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...prod, status: newStatus }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === prod.id ? { ...p, status: newStatus } : p))
        );
      }
    } catch {
      // error
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await fetch(`/api/admin/lame-products/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, display_order: editingItem.display_order }),
        });
        if (res.ok) {
          setIsModalOpen(false);
          fetchProducts();
        }
      } else {
        const res = await fetch("/api/admin/lame-products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setIsModalOpen(false);
          fetchProducts();
        }
      }
    } catch {
      // error
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete Lamé formulation "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/lame-products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      // error
    }
  };

  const moveOrder = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= products.length) return;

    const list = [...products];
    const current = list[index];
    const target = list[targetIdx];

    const currentOrder = current.display_order;
    current.display_order = target.display_order;
    target.display_order = currentOrder;

    list[index] = target;
    list[targetIdx] = current;
    setProducts(list);

    await Promise.all([
      fetch(`/api/admin/lame-products/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current),
      }),
      fetch(`/api/admin/lame-products/${target.id}`, {
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
            Lamé Signature Products
          </h1>
          <p className="text-sm text-neutral-500 font-light mt-1">
            Manage formulation cards on the Lamé Haute Dermocosmetics page, toggle Coming Soon vs Available, and upload product packaging photos.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#b00f23] hover:bg-[#960d1e] text-white text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 shadow-[0_4px_16px_rgba(176,15,35,0.32)] hover:shadow-[0_8px_24px_rgba(176,15,35,0.48)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Plus className="h-4 w-4 text-[#E2C785]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-12 text-center text-sm text-neutral-400 flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-[#C9A227]" />
            <span>Loading formulations…</span>
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center text-sm text-neutral-400 font-light">
            No Lamé products found. Click &quot;Add New Formulation&quot; or run the seed script.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-700">
              <thead className="bg-[#FAFBFD] text-xs font-semibold uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="px-5 py-3.5 w-16">Order</th>
                  <th className="px-5 py-3.5 w-24">Photo</th>
                  <th className="px-5 py-3.5">Formulation Name</th>
                  <th className="px-5 py-3.5">Category &amp; Descriptor</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {products.map((prod, idx) => (
                  <tr key={prod.id} className="hover:bg-neutral-50/60 transition-colors">
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
                          disabled={idx === products.length - 1}
                          onClick={() => moveOrder(idx, "down")}
                          className="p-1 rounded text-neutral-400 hover:text-[#0B2A4A] disabled:opacity-20 cursor-pointer"
                          aria-label="Move Down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-neutral-100 bg-neutral-50">
                        <Image
                          src={prod.image_url}
                          alt={prod.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold text-[#0B2A4A] block">{prod.name}</span>
                      <span className="text-xs text-neutral-400 line-clamp-1 mt-0.5">{prod.description}</span>
                    </td>

                    <td className="px-5 py-4 text-xs">
                      <span className="px-2 py-0.5 rounded bg-[#b00f23]/10 text-[#b00f23] font-semibold uppercase tracking-wider block w-max mb-1">
                        {prod.category_label}
                      </span>
                      <span className="text-neutral-500 font-light">{prod.descriptor || "—"}</span>
                    </td>

                    <td className="px-5 py-4 text-xs">
                      <button
                        onClick={() => toggleStatus(prod)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold cursor-pointer transition-colors ${
                          prod.status === "available"
                            ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-800 hover:bg-amber-100"
                        }`}
                        title="Click to toggle status"
                      >
                        {prod.status === "available" ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Available Now</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-3.5 w-3.5 text-amber-600" />
                            <span>Coming Soon</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#0B2A4A]/20 bg-white hover:bg-[#0B2A4A] text-[#0B2A4A] hover:text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200 bg-white hover:bg-red-600 text-red-600 hover:text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer"
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
              <h3 className="font-serif text-xl font-semibold text-[#0B2A4A]">
                {editingItem ? "Edit Formulation" : "Add New Formulation"}
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
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-neutral-600 uppercase">Product Name *</span>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. 2% Salicylic Acid Gel Cleanser"
                  className="rounded-xl border border-neutral-200 px-3.5 py-2 text-xs outline-none focus:border-[#0B2A4A]"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">Category Label *</span>
                  <input
                    type="text"
                    required
                    value={form.category_label}
                    onChange={(e) => setForm({ ...form, category_label: e.target.value })}
                    placeholder="e.g. Cleanser, Body Care, Fragrance"
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-xs outline-none focus:border-[#0B2A4A]"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">Descriptor</span>
                  <input
                    type="text"
                    value={form.descriptor}
                    onChange={(e) => setForm({ ...form, descriptor: e.target.value })}
                    placeholder="e.g. Active BHA Exfoliant"
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-xs outline-none focus:border-[#0B2A4A]"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-neutral-600 uppercase">Clinical Description *</span>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="In-depth formulation description and clinical benefits…"
                  className="rounded-xl border border-neutral-200 px-3.5 py-2 text-xs outline-none focus:border-[#0B2A4A] resize-none"
                />
              </label>

              {/* Highlights Bullets */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-neutral-600 uppercase">
                  Product Highlights ({form.features_json.length})
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBullet}
                    onChange={(e) => setNewBullet(e.target.value)}
                    placeholder="Add bullet (e.g. Barrier Repair & Deep Hydration)…"
                    className="flex-1 rounded-xl border border-neutral-200 px-3 py-1.5 text-xs outline-none focus:border-[#0B2A4A]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addBullet();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addBullet}
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
                        onClick={() => removeBullet(i)}
                        className="text-neutral-400 hover:text-red-600 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Photo Uploader */}
              <ImageUploadField
                label="Product Bottle / Packaging Photo"
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
                required
                folder="lame-products"
                hint="Upload or select clean formulation & packaging image from Supabase Storage (/media/lame-products/)."
              />

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">Availability Status *</span>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-xs outline-none focus:border-[#0B2A4A]"
                  >
                    <option value="available">Available Now (Direct Shop Link)</option>
                    <option value="coming_soon">Available on Order (Enquiry Concierge)</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">Shop URL (When Available)</span>
                  <input
                    type="url"
                    value={form.store_url}
                    onChange={(e) => setForm({ ...form, store_url: e.target.value })}
                    placeholder="https://..."
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
                  <span>{editingItem ? "Save Changes" : "Create Formulation"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
