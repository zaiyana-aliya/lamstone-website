"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";

export interface ContactOfficeRecord {
  id: string;
  label: string;
  company_name?: string | null;
  address: string;
  phone: string;
  email: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function AdminContactOfficesPage() {
  const [offices, setOffices] = useState<ContactOfficeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ContactOfficeRecord | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [form, setForm] = useState({
    label: "",
    company_name: "",
    address: "",
    phone: "+91 9746397686",
    email: "mail@lamstonehealthcare.com",
    display_order: 0,
    is_active: true,
  });

  const fetchOffices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/contact-offices");
      const data = await res.json();
      if (data.offices) {
        setOffices(data.offices);
      }
    } catch (err: any) {
      console.error("Error fetching offices:", err);
      setFeedback({ type: "error", msg: "Failed to load offices." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  const openNewModal = () => {
    setIsNew(true);
    setEditingItem(null);
    setForm({
      label: "",
      company_name: "Lamstone HealthCare Pvt Ltd",
      address: "",
      phone: "+91 9746397686",
      email: "mail@lamstonehealthcare.com",
      display_order: offices.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: ContactOfficeRecord) => {
    setIsNew(false);
    setEditingItem(item);
    setForm({
      label: item.label,
      company_name: item.company_name || "",
      address: item.address,
      phone: item.phone,
      email: item.email,
      display_order: item.display_order,
      is_active: item.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.label.trim() || !form.address.trim() || !form.phone.trim() || !form.email.trim()) {
      setFeedback({ type: "error", msg: "Label, address, phone, and email are required." });
      return;
    }

    try {
      setSubmitting(true);
      setFeedback(null);

      const url = isNew
        ? "/api/admin/contact-offices"
        : `/api/admin/contact-offices/${editingItem?.id}`;

      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: form.label.trim(),
          company_name: form.company_name.trim() || null,
          address: form.address.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          display_order: Number(form.display_order) || 0,
          is_active: form.is_active,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to save office.");
      }

      setFeedback({
        type: "success",
        msg: isNew ? "Office location card created successfully!" : "Office location card updated successfully!",
      });

      setIsModalOpen(false);
      fetchOffices();
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this office location card?")) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/contact-offices/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to delete item.");
      }

      setFeedback({ type: "success", msg: "Office location card removed." });
      fetchOffices();
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message });
    } finally {
      setDeletingId(null);
    }
  };

  const toggleStatus = async (item: ContactOfficeRecord) => {
    try {
      const res = await fetch(`/api/admin/contact-offices/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !item.is_active }),
      });
      if (res.ok) {
        fetchOffices();
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#b00f23]">
            <span>Page Content</span>
            <span>•</span>
            <span>Contact Offices</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B2A4A] mt-1">
            Contact Offices
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Manage repeatable office location cards displayed on{" "}
            <code className="text-[#0B2A4A] font-mono font-medium">/contact</code> (e.g. Office, Corporate Head Office, Customer Happiness Center).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/contact#contact-form"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#0B2A4A] bg-white border border-neutral-200 hover:border-[#0B2A4A]/30 hover:bg-neutral-50 transition-all shadow-2xs"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View Section</span>
          </a>
          <button
            onClick={fetchOffices}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 transition-all shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={openNewModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0B2A4A] hover:bg-[#b00f23] transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Office Card</span>
          </button>
        </div>
      </div>

      {/* Status Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-center justify-between shadow-2xs transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <XCircle className="h-4 w-4 shrink-0 text-rose-600" />
            )}
            <span>{feedback.msg}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-neutral-400 hover:text-neutral-700 text-xs ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Offices Cards List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-neutral-200/80 shadow-2xs">
          <RefreshCw className="h-8 w-8 text-[#0B2A4A] animate-spin mb-3" />
          <p className="text-xs text-neutral-500 font-medium">Loading offices...</p>
        </div>
      ) : offices.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200 shadow-2xs">
          <Building2 className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-semibold text-[#0B2A4A]">No offices found</h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1 mb-4">
            Add your first office card or run the seed script to populate defaults.
          </p>
          <button
            onClick={openNewModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0B2A4A] hover:bg-[#b00f23] transition-colors shadow-2xs"
          >
            <Plus className="h-4 w-4" />
            <span>Create First Card</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offices.map((item) => (
            <div
              key={item.id}
              className={`relative bg-white rounded-2xl border shadow-[0_2px_12px_rgba(11,42,74,0.04)] hover:shadow-md transition-all flex flex-col justify-between overflow-hidden ${
                item.is_active ? "border-neutral-200/80" : "border-neutral-200 bg-neutral-50/70 opacity-70"
              }`}
            >
              {/* Card Top Accent Line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0B2A4A] via-[#C9A227] to-[#E2C785]" />

              <div className="p-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs uppercase tracking-wider font-bold text-[#b00f23]">
                    {item.label}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                      #{item.display_order}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleStatus(item)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                        item.is_active
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
                      }`}
                    >
                      {item.is_active ? "Active" : "Inactive"}
                    </button>
                  </div>
                </div>

                {item.company_name && (
                  <h4 className="font-serif text-sm font-semibold text-[#0B2A4A] mb-2">
                    {item.company_name}
                  </h4>
                )}

                <div className="space-y-2 text-xs text-neutral-600 font-light mt-3">
                  <p className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 shrink-0 text-[#C9A227] mt-0.5" />
                    <span className="whitespace-pre-line leading-relaxed">{item.address}</span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 shrink-0 text-[#C9A227]" />
                    <span className="font-mono text-neutral-700">{item.phone}</span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 shrink-0 text-[#C9A227]" />
                    <span className="font-mono text-neutral-700">{item.email}</span>
                  </p>
                </div>
              </div>

              <div className="px-6 py-3.5 bg-neutral-50/70 border-t border-neutral-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-[#0B2A4A] hover:bg-neutral-200/60 transition-colors cursor-pointer"
                  title="Edit Office"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                  title="Delete Office"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#0B2A4A] text-white flex items-center justify-center">
                  {isNew ? <Plus className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0B2A4A]">
                    {isNew ? "Add Office Location Card" : "Edit Office Location Card"}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-lg font-medium p-1 cursor-pointer leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col min-h-0 flex-1 overflow-hidden">
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Card Tag / Label <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="e.g. Office or Corporate Head Office"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  placeholder="e.g. Lamstone HealthCare Pvt Ltd"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Address (Street, City, PIN) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="e.g. Z Avenue, 10/20/E-10/20/G, NH 66&#10;Mangalapuram, Kerala, India - 695317"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 9746397686"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="mail@lamstonehealthcare.com"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]/20 focus:border-[#0B2A4A]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="office_is_active"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="h-4 w-4 rounded border-neutral-300 text-[#0B2A4A] focus:ring-[#0B2A4A]"
                  />
                  <label htmlFor="office_is_active" className="text-xs font-medium text-neutral-700 select-none">
                    Active on public site
                  </label>
                </div>
              </div>

              </div>

              {/* Modal Actions (Fixed Footer) */}
              <div className="shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 bg-neutral-50/90">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#0B2A4A] hover:bg-[#b00f23] rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  <span>{isNew ? "Create Office" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
