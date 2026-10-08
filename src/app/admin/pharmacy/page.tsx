"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, MapPin, Phone, ArrowUp, ArrowDown, RefreshCw } from "lucide-react";

interface LocationRecord {
  id: string;
  name: string;
  area: string;
  district: string;
  status: "open_dispensing" | "closed";
  phone: string | null;
  map_url: string | null;
  display_order: number;
}

const DISTRICT_OPTIONS = [
  "Calicut",
  "Malappuram",
  "Kasaragod",
  "Kannur",
  "Ernakulam",
  "Thiruvananthapuram",
  "Thrissur",
  "Kollam",
  "Palakkad",
  "Kottayam",
  "Alappuzha",
  "Idukki",
  "Pathanamthitta",
  "Wayanad",
];

export default function PharmacyAdminPage() {
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLoc, setEditingLoc] = useState<LocationRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    area: "",
    district: "Calicut",
    status: "open_dispensing" as "open_dispensing" | "closed",
    phone: "",
    map_url: "",
  });

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pharmacy");
      const json = await res.json();
      if (res.ok) setLocations(json.locations ?? []);
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const openAddModal = () => {
    setEditingLoc(null);
    setForm({
      name: "",
      area: "",
      district: "Calicut",
      status: "open_dispensing",
      phone: "+91 9746397686",
      map_url: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (loc: LocationRecord) => {
    setEditingLoc(loc);
    setForm({
      name: loc.name,
      area: loc.area,
      district: loc.district,
      status: loc.status,
      phone: loc.phone || "",
      map_url: loc.map_url || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLoc) {
        // Update
        const res = await fetch(`/api/admin/pharmacy/${editingLoc.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, display_order: editingLoc.display_order }),
        });
        if (res.ok) {
          setIsModalOpen(false);
          fetchLocations();
        }
      } else {
        // Create
        const res = await fetch("/api/admin/pharmacy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setIsModalOpen(false);
          fetchLocations();
        }
      }
    } catch {
      // error
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/pharmacy/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLocations((prev) => prev.filter((loc) => loc.id !== id));
      }
    } catch {
      // error
    }
  };

  const moveOrder = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= locations.length) return;

    const newLocs = [...locations];
    const current = newLocs[index];
    const target = newLocs[targetIdx];

    const currentOrder = current.display_order;
    current.display_order = target.display_order;
    target.display_order = currentOrder;

    newLocs[index] = target;
    newLocs[targetIdx] = current;
    setLocations(newLocs);

    // Save both to DB
    await Promise.all([
      fetch(`/api/admin/pharmacy/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current),
      }),
      fetch(`/api/admin/pharmacy/${target.id}`, {
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
            Pharmacy Branches &amp; Locations
          </h1>
          <p className="text-sm text-neutral-500 font-light mt-1">
            Manage your network of dispensaries displayed on the live pharmacy store locator.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#b00f23] hover:bg-[#960d1e] text-white text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 shadow-[0_4px_16px_rgba(176,15,35,0.32)] hover:shadow-[0_8px_24px_rgba(176,15,35,0.48)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Plus className="h-4 w-4 text-[#E2C785]" />
          <span>Add New Location</span>
        </button>
      </div>

      {/* Locations Table */}
      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-12 text-center text-sm text-neutral-400 flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-[#C9A227]" />
            <span>Loading branch network…</span>
          </div>
        ) : locations.length === 0 ? (
          <div className="p-16 text-center text-sm text-neutral-400 font-light">
            No pharmacy branches configured. Click &quot;Add New Location&quot; or run the seed script to populate default locations.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-700">
              <thead className="bg-[#FAFBFD] text-xs font-semibold uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="px-5 py-3.5 w-16">Order</th>
                  <th className="px-5 py-3.5">Pharmacy Name</th>
                  <th className="px-5 py-3.5">Area / Locality</th>
                  <th className="px-5 py-3.5">District</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Phone</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {locations.map((loc, idx) => (
                  <tr key={loc.id} className="hover:bg-neutral-50/60 transition-colors">
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
                          disabled={idx === locations.length - 1}
                          onClick={() => moveOrder(idx, "down")}
                          className="p-1 rounded text-neutral-400 hover:text-[#0B2A4A] disabled:opacity-20 cursor-pointer"
                          aria-label="Move Down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-semibold text-[#0B2A4A]">{loc.name}</td>
                    <td className="px-5 py-4 text-xs text-neutral-600">{loc.area}</td>
                    <td className="px-5 py-4 text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-gold/15 text-[#8C6D23] font-medium">
                        {loc.district}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold ${
                          loc.status === "open_dispensing"
                            ? "bg-emerald-50 text-emerald-800"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            loc.status === "open_dispensing" ? "bg-emerald-500" : "bg-neutral-400"
                          }`}
                        />
                        {loc.status === "open_dispensing" ? "Open & Dispensing" : "Closed"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-neutral-600">{loc.phone || "—"}</td>

                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(loc)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#0B2A4A]/20 bg-white hover:bg-[#0B2A4A] text-[#0B2A4A] hover:text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(loc.id, loc.name)}
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
          <div className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="shrink-0 flex items-center justify-between border-b border-neutral-100 px-6 py-4 bg-white">
              <h3 className="font-serif text-xl font-semibold text-[#0B2A4A]">
                {editingLoc ? "Edit Pharmacy Location" : "Add New Pharmacy Location"}
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
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3.5">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-neutral-600 uppercase">Pharmacy Name *</span>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Meditech Medicals"
                  className="rounded-xl border border-neutral-200 px-3.5 py-2 text-sm outline-none focus:border-[#0B2A4A]"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-neutral-600 uppercase">Area / Locality *</span>
                <input
                  type="text"
                  required
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  placeholder="e.g. East Fort, Trivandrum"
                  className="rounded-xl border border-neutral-200 px-3.5 py-2 text-sm outline-none focus:border-[#0B2A4A]"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">District *</span>
                  <select
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#0B2A4A]"
                  >
                    {DISTRICT_OPTIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-neutral-600 uppercase">Status *</span>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#0B2A4A]"
                  >
                    <option value="open_dispensing">Open &amp; Dispensing</option>
                    <option value="closed">Temporarily Closed</option>
                  </select>
                </label>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-neutral-600 uppercase">Phone (Optional)</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 9746397686"
                  className="rounded-xl border border-neutral-200 px-3.5 py-2 text-sm outline-none focus:border-[#0B2A4A]"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-neutral-600 uppercase">Google Maps URL (Optional)</span>
                <input
                  type="url"
                  value={form.map_url}
                  onChange={(e) => setForm({ ...form, map_url: e.target.value })}
                  placeholder="https://maps.google.com/..."
                  className="rounded-xl border border-neutral-200 px-3.5 py-2 text-sm outline-none focus:border-[#0B2A4A]"
                />
              </label>
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
                  <span>{editingLoc ? "Save Changes" : "Create Location"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
