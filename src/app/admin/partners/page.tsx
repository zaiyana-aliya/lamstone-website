"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, RefreshCw, Handshake } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

interface PartnerRecord {
  id: string;
  name: string;
  logo_url: string | null;
  category_label: string;
  partner_type: "pharmacy" | "cosmetics";
  display_order: number;
}

export default function AdminPartnersPage() {
  const [activeType, setActiveType] = useState<"pharmacy" | "cosmetics">("pharmacy");
  const [partners, setPartners] = useState<PartnerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<PartnerRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category_label: "",
    logo_url: "",
    partner_type: "pharmacy" as "pharmacy" | "cosmetics",
  });

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/brand-partners?type=${activeType}`);
      const json = await res.json();
      if (res.ok) setPartners(json.partners ?? []);
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [activeType]);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      name: "",
      category_label: activeType === "pharmacy" ? "Formulations" : "Botanical & Natural",
      logo_url: "",
      partner_type: activeType,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: PartnerRecord) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      category_label: item.category_label,
      logo_url: item.logo_url || "",
      partner_type: item.partner_type,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await fetch(`/api/admin/brand-partners/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, display_order: editingItem.display_order }),
        });
        if (res.ok) {
          setIsModalOpen(false);
          fetchPartners();
        }
      } else {
        const res = await fetch("/api/admin/brand-partners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setIsModalOpen(false);
          fetchPartners();
        }
      }
    } catch {
      // error
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/brand-partners/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPartners((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      // error
    }
  };

  const moveOrder = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= partners.length) return;

    const list = [...partners];
    const current = list[index];
    const target = list[targetIdx];

    const currentOrder = current.display_order;
    current.display_order = target.display_order;
    target.display_order = currentOrder;

    list[index] = target;
    list[targetIdx] = current;
    setPartners(list);

    await Promise.all([
      fetch(`/api/admin/brand-partners/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current),
      }),
      fetch(`/api/admin/brand-partners/${target.id}`, {
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
            Brand &amp; Pharmaceutical Partners
          </h1>
          <p className="text-sm text-neutral-500 font-light mt-1">
            Manage partner logos and badges displayed across Pharmacy Chain and Cosmetics Division pages.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#b00f23] hover:bg-[#960d1e] text-white text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 shadow-[0_4px_16px_rgba(176,15,35,0.32)] hover:shadow-[0_8px_24px_rgba(176,15,35,0.48)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Plus className="h-4 w-4 text-[#E2C785]" />
          <span>Add New Partner</span>
        </button>
      </div>

      {/* Type Toggle Tabs */}
      <div className="border-b border-neutral-200 flex gap-2 pb-px">
        <button
          onClick={() => setActiveType("pharmacy")}
          className={`px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors cursor-pointer ${
            activeType === "pharmacy"
              ? "bg-white text-[#0B2A4A] border border-b-white border-neutral-200 shadow-2xs font-bold"
              : "text-neutral-500 hover:text-[#0B2A4A]"
          }`}
        >
          Pharmacy Partners (30)
        </button>
        <button
          onClick={() => setActiveType("cosmetics")}
          className={`px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors cursor-pointer ${
            activeType === "cosmetics"
              ? "bg-white text-[#0B2A4A] border border-b-white border-neutral-200 shadow-2xs font-bold"
              : "text-neutral-500 hover:text-[#0B2A4A]"
          }`}
        >
          Cosmetics Multi-Brand Portfolio (9)
        </button>
      </div>

      {/* Partners List Table */}
      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-12 text-center text-sm text-neutral-400 flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-[#C9A227]" />
            <span>Loading partners…</span>
          </div>
        ) : partners.length === 0 ? (
          <div className="p-16 text-center text-sm text-neutral-400 font-light">
            No brand partners found. Click &quot;Add New Partner&quot; or run the seed script.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-700">
              <thead className="bg-[#FAFBFD] text-xs font-semibold uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="px-5 py-3.5 w-16">Order</th>
                  <th className="px-5 py-3.5 w-24">Logo</th>
                  <th className="px-5 py-3.5">Partner / Brand Name</th>
                  <th className="px-5 py-3.5">Category Label</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {partners.map((partner, idx) => (
                  <tr key={partner.id} className="hover:bg-neutral-50/60 transition-colors">
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
                          disabled={idx === partners.length - 1}
                          onClick={() => moveOrder(idx, "down")}
                          className="p-1 rounded text-neutral-400 hover:text-[#0B2A4A] disabled:opacity-20 cursor-pointer"
                          aria-label="Move Down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {partner.logo_url ? (
                        <div className="relative h-10 w-20 rounded-md border border-neutral-100 bg-white p-1 overflow-hidden">
                          <Image
                            src={partner.logo_url}
                            alt={partner.name}
                            fill
                            className="object-contain p-0.5"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-300">No logo</span>
                      )}
                    </td>

                    <td className="px-5 py-4 font-semibold text-[#0B2A4A]">{partner.name}</td>

                    <td className="px-5 py-4 text-xs">
                      <span className="px-2.5 py-1 rounded-md bg-gold/15 text-[#8C6D23] font-medium uppercase tracking-wider">
                        {partner.category_label}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(partner)}
                        className="inline-flex items-center gap-1 text-xs text-[#0B2A4A] hover:text-[#b00f23] cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(partner.id, partner.name)}
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
          <div className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="shrink-0 flex items-center justify-between border-b border-neutral-100 px-6 py-4 bg-white">
              <h3 className="font-serif text-xl font-semibold text-[#0B2A4A]">
                {editingItem ? "Edit Brand Partner" : "Add New Brand Partner"}
              </h3>
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
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-neutral-600 uppercase">Partner Name *</span>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Cipla or Lotus"
                  className="rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#0B2A4A]"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">Partner Type *</span>
                  <select
                    value={form.partner_type}
                    onChange={(e) => setForm({ ...form, partner_type: e.target.value as any })}
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#0B2A4A]"
                  >
                    <option value="pharmacy">Pharmacy</option>
                    <option value="cosmetics">Cosmetics</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">Category Label *</span>
                  <input
                    type="text"
                    required
                    value={form.category_label}
                    onChange={(e) => setForm({ ...form, category_label: e.target.value })}
                    placeholder="e.g. Formulations"
                    className="rounded-xl border border-neutral-200 px-3.5 py-2 text-sm outline-none focus:border-[#0B2A4A]"
                  />
                </label>
              </div>

              {/* Direct Image / Logo Uploader */}
              <ImageUploadField
                label="Partner Logo"
                value={form.logo_url}
                onChange={(url) => setForm({ ...form, logo_url: url })}
                folder={form.partner_type === "pharmacy" ? "pharmacy-partners" : "cosmetics-brands"}
                hint={`Upload brand/partner logo stored in /media/${form.partner_type === "pharmacy" ? "pharmacy-partners" : "cosmetics-brands"}/.`}
              />

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
                  <span>{editingItem ? "Save Changes" : "Add Partner"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
