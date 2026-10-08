"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, RefreshCw, Briefcase, MapPin, CheckCircle2, XCircle } from "lucide-react";

export interface JobPostingRecord {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: "full-time" | "part-time" | "internship" | "contract";
  description: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

const EMPLOYMENT_LABELS: Record<string, string> = {
  "full-time": "Full-Time",
  "part-time": "Part-Time",
  internship: "Internship",
  contract: "Contract",
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobPostingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<JobPostingRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    department: "Pharmacy",
    location: "Calicut, Kerala",
    employment_type: "full-time" as "full-time" | "part-time" | "internship" | "contract",
    description: "",
    is_active: true,
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/jobs");
      const json = await res.json();
      if (res.ok) setJobs(json.jobs ?? []);
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      title: "",
      department: "Pharmacy",
      location: "Calicut, Kerala",
      employment_type: "full-time",
      description: "",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: JobPostingRecord) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      department: item.department,
      location: item.location,
      employment_type: item.employment_type,
      description: item.description,
      is_active: item.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingItem) {
        const res = await fetch(`/api/admin/jobs/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, display_order: editingItem.display_order }),
        });
        if (res.ok) {
          setIsModalOpen(false);
          fetchJobs();
        }
      } else {
        const res = await fetch("/api/admin/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setIsModalOpen(false);
          fetchJobs();
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setJobs((prev) => prev.filter((item) => item.id !== id));
      }
    } catch {
      // error
    }
  };

  const handleToggleActive = async (item: JobPostingRecord) => {
    try {
      const newStatus = !item.is_active;
      const res = await fetch(`/api/admin/jobs/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, is_active: newStatus }),
      });
      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) => (j.id === item.id ? { ...j, is_active: newStatus } : j))
        );
      }
    } catch {
      // error
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= jobs.length) return;

    const current = jobs[index];
    const swapWith = jobs[targetIndex];

    const newJobs = [...jobs];
    newJobs[index] = { ...swapWith, display_order: current.display_order };
    newJobs[targetIndex] = { ...current, display_order: swapWith.display_order };
    setJobs(newJobs);

    try {
      await Promise.all([
        fetch(`/api/admin/jobs/${current.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...current, display_order: swapWith.display_order }),
        }),
        fetch(`/api/admin/jobs/${swapWith.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...swapWith, display_order: current.display_order }),
        }),
      ]);
    } catch {
      fetchJobs();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B2A4A]/10 text-[#0B2A4A]">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#0B2A4A]">Job Postings</h1>
            <p className="text-xs text-neutral-500">
              Manage live job postings shown on the Careers page ({jobs.length} total, {jobs.filter((j) => j.is_active).length} active)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchJobs}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 border border-neutral-200 transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#b00f23] hover:bg-[#960d1e] text-white text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 shadow-[0_4px_16px_rgba(176,15,35,0.32)] hover:shadow-[0_8px_24px_rgba(176,15,35,0.48)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-[#E2C785]" />
            <span>Add Job Posting</span>
          </button>
        </div>
      </div>

      {/* List Container */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-neutral-400">Loading postings...</div>
        ) : jobs.length === 0 ? (
          <div className="py-16 text-center">
            <Briefcase className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-neutral-600">No job postings created yet</p>
            <p className="text-xs text-neutral-400 mt-1">
              When there are no active postings, the Careers page gracefully displays the &quot;Join Our Healthcare &amp; Beauty Team&quot; card.
            </p>
            <button
              onClick={openAddModal}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0B2A4A] hover:bg-[#132a4e] transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add First Posting
            </button>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {jobs.map((item, index) => (
              <div
                key={item.id}
                className={`p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                  !item.is_active ? "bg-neutral-50/60 opacity-80" : "hover:bg-neutral-50/50"
                }`}
              >
                {/* Info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 shrink-0">
                    <Briefcase className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-[#0B2A4A] truncate">{item.title}</h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#0B2A4A]/10 text-[#0B2A4A]">
                        {item.department}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#C9A227]/15 text-[#8C6D14]">
                        {EMPLOYMENT_LABELS[item.employment_type] || item.employment_type}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                      <span>{item.location}</span>
                    </div>

                    <p className="text-xs text-neutral-600 line-clamp-2 font-light leading-relaxed pt-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Controls & Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Active status pill button */}
                  <button
                    onClick={() => handleToggleActive(item)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      item.is_active
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                        : "bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200"
                    }`}
                    title="Click to toggle active status"
                  >
                    {item.is_active ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        Active
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 text-neutral-400" />
                        Draft
                      </>
                    )}
                  </button>

                  {/* Move Up/Down */}
                  <div className="flex items-center gap-1 border-l border-neutral-200 pl-2">
                    <button
                      onClick={() => handleMove(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-[#0B2A4A] hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(index, "down")}
                      disabled={index === jobs.length - 1}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-[#0B2A4A] hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Edit / Delete */}
                  <div className="flex items-center gap-1.5 border-l border-neutral-200 pl-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#0B2A4A]/20 bg-white hover:bg-[#0B2A4A] text-[#0B2A4A] hover:text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-red-200 bg-white hover:bg-red-600 text-red-600 hover:text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0B2A4A]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="shrink-0 flex items-center justify-between border-b border-neutral-100 px-6 py-4 bg-white">
              <h2 className="font-serif text-xl font-bold text-[#0B2A4A]">
                {editingItem ? "Edit Job Posting" : "Add Job Posting"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer text-lg p-1 leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col min-h-0 flex-1 overflow-hidden">
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Registered Pharmacist"
                  className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#0B2A4A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    placeholder="Pharmacy / Cosmetics / Operations"
                    className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#0B2A4A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Employment Type *
                  </label>
                  <select
                    value={form.employment_type}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        employment_type: e.target.value as "full-time" | "part-time" | "internship" | "contract",
                      })
                    }
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#0B2A4A] bg-white"
                  >
                    <option value="full-time">Full-Time</option>
                    <option value="part-time">Part-Time</option>
                    <option value="internship">Internship</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Calicut, Kerala / Multiple Locations"
                  className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#0B2A4A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Role Description & Responsibilities *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Summarize key responsibilities, qualifications, and benefits..."
                  className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#0B2A4A]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="job-is-active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0B2A4A] focus:ring-[#0B2A4A]"
                />
                <label htmlFor="job-is-active" className="text-xs font-medium text-neutral-700 cursor-pointer">
                  Publish to Careers Page (Active)
                </label>
              </div>

              </div>

              <div className="shrink-0 flex justify-end gap-2.5 px-6 py-4 border-t border-neutral-100 bg-neutral-50/90">
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
                  <span>{editingItem ? "Save Changes" : "Create Posting"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
