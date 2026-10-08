"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  Filter,
  CheckCircle,
  Eye,
  Mail,
  RefreshCw,
  Phone,
  Calendar,
  Building,
  Briefcase,
  FileText,
} from "lucide-react";

const TABS = [
  { id: "contact", label: "Contact Submissions" },
  { id: "newsletter", label: "Newsletter Subscribers" },
  { id: "investment", label: "Investment Requests" },
  { id: "lame", label: "Lamé Notify" },
  { id: "distribution", label: "Distribution Inquiries" },
  { id: "careers", label: "Careers Applications" },
  { id: "partnership", label: "Partnership Inquiries" },
];

export default function SubmissionsPage() {
  const [activeTab, setActiveTab] = useState("contact");
  const [statusFilter, setStatusFilter] = useState("all");
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/submissions", window.location.origin);
      url.searchParams.set("type", activeTab);
      if (statusFilter !== "all") {
        url.searchParams.set("status", statusFilter);
      }
      const res = await fetch(url.toString());
      const json = await res.json();
      if (res.ok) {
        setData(json.data ?? []);
        setTotal(json.total ?? 0);
      }
    } catch {
      // error fetching
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: activeTab, id, status }),
      });
      if (res.ok) {
        setData((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
        if (selectedItem?.id === id) {
          setSelectedItem((prev: any) => ({ ...prev, status }));
        }
      }
    } catch {
      // error
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#0B2A4A] tracking-tight">
            Submissions &amp; Inquiries
          </h1>
          <p className="text-sm text-neutral-500 font-light mt-1">
            Review and manage all incoming communications across every department.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-[#0B2A4A] transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <a
            href={`/api/admin/submissions/export?type=${activeTab}`}
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B2A4A] hover:bg-[#143d6b] text-xs font-semibold text-white transition-colors shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-[#C9A227]" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 flex overflow-x-auto gap-2 pb-px">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setStatusFilter("all");
              setSelectedItem(null);
            }}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? "bg-white text-[#0B2A4A] border border-b-white border-neutral-200 font-bold shadow-2xs"
                : "text-neutral-500 hover:text-[#0B2A4A]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Status Filter */}
      {activeTab !== "newsletter" && activeTab !== "lame" && (
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-neutral-400" />
          <span className="text-xs font-medium text-neutral-500">Filter Status:</span>
          {["all", "new", "read", "replied"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                statusFilter === st
                  ? "bg-[#0B2A4A] text-white"
                  : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {st}
            </button>
          ))}
          <span className="ml-auto text-xs text-neutral-400">Total: {total} records</span>
        </div>
      )}

      {/* Submissions Table / Grid */}
      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-12 text-center text-sm text-neutral-400 flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-[#C9A227]" />
            <span>Loading submissions…</span>
          </div>
        ) : data.length === 0 ? (
          <div className="p-16 text-center text-sm text-neutral-400 font-light">
            No submissions found for this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-700">
              <thead className="bg-[#FAFBFD] text-xs font-semibold uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="px-5 py-3.5">Details</th>
                  <th className="px-5 py-3.5">Contact Info</th>
                  {activeTab === "investment" && <th className="px-5 py-3.5">Opportunity</th>}
                  {activeTab === "distribution" && <th className="px-5 py-3.5">Category</th>}
                  {activeTab === "careers" && <th className="px-5 py-3.5">Position / Resume</th>}
                  {activeTab === "lame" && <th className="px-5 py-3.5">Product</th>}
                  {activeTab !== "newsletter" && activeTab !== "lame" && (
                    <th className="px-5 py-3.5">Status</th>
                  )}
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                    {/* Details / Name */}
                    <td className="px-5 py-4">
                      <div className="font-medium text-[#0B2A4A]">
                        {item.full_name || item.name || item.company || "Subscriber"}
                      </div>
                      {item.subject && (
                        <div className="text-xs text-neutral-500 font-light truncate max-w-xs">
                          {item.subject}
                        </div>
                      )}
                    </td>

                    {/* Email / Phone */}
                    <td className="px-5 py-4 text-xs">
                      <div className="flex items-center gap-1.5 text-neutral-700">
                        <Mail className="h-3 w-3 text-neutral-400" />
                        <a href={`mailto:${item.email}`} className="hover:text-[#b00f23]">
                          {item.email}
                        </a>
                      </div>
                      {item.phone && (
                        <div className="flex items-center gap-1.5 text-neutral-500 mt-1">
                          <Phone className="h-3 w-3 text-neutral-400" />
                          <a href={`tel:${item.phone}`} className="hover:text-[#b00f23]">
                            {item.phone}
                          </a>
                        </div>
                      )}
                    </td>

                    {/* Tab-Specific Columns */}
                    {activeTab === "investment" && (
                      <td className="px-5 py-4 text-xs">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-medium">
                          {item.request_type}
                        </span>
                        {item.opportunity_name && (
                          <div className="text-[11px] text-neutral-500 mt-1 truncate max-w-xs">
                            {item.opportunity_name}
                          </div>
                        )}
                      </td>
                    )}

                    {activeTab === "distribution" && (
                      <td className="px-5 py-4 text-xs">
                        <span className="capitalize px-2 py-0.5 rounded-md bg-gold/10 text-[#9A731E] font-medium">
                          {String(item.category).replace("_", " ")}
                        </span>
                        <div className="text-[11px] text-neutral-500 mt-0.5">{item.company}</div>
                      </td>
                    )}

                    {activeTab === "careers" && (
                      <td className="px-5 py-4 text-xs">
                        <div className="font-medium text-[#0B2A4A]">{item.position}</div>
                        {item.resume_url ? (
                          <a
                            href={`/api/admin/submissions/resume?id=${item.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#b00f23] hover:underline mt-1 font-semibold"
                          >
                            <FileText className="h-3 w-3" />
                            <span>Download CV</span>
                          </a>
                        ) : (
                          <span className="text-neutral-400 text-[11px]">No file attached</span>
                        )}
                      </td>
                    )}

                    {activeTab === "lame" && (
                      <td className="px-5 py-4 text-xs font-medium text-[#0B2A4A]">
                        {item.product_name}
                      </td>
                    )}

                    {/* Status Column */}
                    {activeTab !== "newsletter" && activeTab !== "lame" && (
                      <td className="px-5 py-4 text-xs">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                            item.status === "new"
                              ? "bg-amber-50 text-amber-800 border border-amber-200/60"
                              : item.status === "read"
                              ? "bg-blue-50 text-blue-800 border border-blue-200/60"
                              : "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              item.status === "new"
                                ? "bg-amber-500"
                                : item.status === "read"
                                ? "bg-blue-500"
                                : "bg-emerald-500"
                            }`}
                          />
                          {item.status}
                        </span>
                      </td>
                    )}

                    {/* Date */}
                    <td className="px-5 py-4 text-xs text-neutral-400">
                      {new Date(item.created_at || item.subscribed_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="inline-flex items-center gap-1 text-xs text-[#0B2A4A] hover:text-[#b00f23] font-medium cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </button>

                      {activeTab !== "newsletter" && activeTab !== "lame" && (
                        <button
                          onClick={() =>
                            updateStatus(item.id, item.status === "new" ? "read" : "replied")
                          }
                          className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-emerald-700 cursor-pointer"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>{item.status === "new" ? "Mark Read" : "Mark Replied"}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Slide-Over / Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0B2A4A]/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="shrink-0 flex items-center justify-between border-b border-neutral-100 px-6 py-4 bg-white">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#0B2A4A]">
                  Submission Details
                </h3>
                <span className="text-xs text-neutral-400 capitalize">
                  {activeTab.replace("_", " ")} record
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer text-lg p-1 leading-none"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3 text-xs sm:text-sm">
              <div>
                <span className="text-neutral-400 block text-[11px] uppercase">Name / Entity</span>
                <span className="font-semibold text-[#0B2A4A] text-base">
                  {selectedItem.full_name || selectedItem.name || selectedItem.company || "Subscriber"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-neutral-400 block text-[11px] uppercase">Email</span>
                  <a
                    href={`mailto:${selectedItem.email}`}
                    className="text-[#b00f23] font-medium break-all"
                  >
                    {selectedItem.email}
                  </a>
                </div>
                {selectedItem.phone && (
                  <div>
                    <span className="text-neutral-400 block text-[11px] uppercase">Phone</span>
                    <a href={`tel:${selectedItem.phone}`} className="font-medium text-neutral-800">
                      {selectedItem.phone}
                    </a>
                  </div>
                )}
              </div>

              {selectedItem.subject && (
                <div>
                  <span className="text-neutral-400 block text-[11px] uppercase">Subject</span>
                  <span className="text-neutral-800">{selectedItem.subject}</span>
                </div>
              )}

              {selectedItem.opportunity_name && (
                <div>
                  <span className="text-neutral-400 block text-[11px] uppercase">Opportunity</span>
                  <span className="text-neutral-800 font-medium">{selectedItem.opportunity_name}</span>
                </div>
              )}

              {selectedItem.product_name && (
                <div>
                  <span className="text-neutral-400 block text-[11px] uppercase">Product Name</span>
                  <span className="text-neutral-800 font-medium">{selectedItem.product_name}</span>
                </div>
              )}

              {selectedItem.resume_url && (
                <div className="pt-2">
                  <a
                    href={`/api/admin/submissions/resume?id=${selectedItem.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B2A4A] text-white text-xs font-semibold hover:bg-[#143d6b] transition-colors cursor-pointer"
                  >
                    <FileText className="h-4 w-4 text-[#C9A227]" />
                    <span>Download Attached Resume / CV</span>
                  </a>
                </div>
              )}

              {(selectedItem.message || selectedItem.cover_letter) && (
                <div>
                  <span className="text-neutral-400 block text-[11px] uppercase">Message / Note</span>
                  <div className="mt-1 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70 text-neutral-700 whitespace-pre-wrap leading-relaxed">
                    {selectedItem.message || selectedItem.cover_letter}
                  </div>
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-neutral-100 px-6 py-4 bg-neutral-50/90 flex items-center justify-between">
              {activeTab !== "newsletter" && activeTab !== "lame" ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateStatus(selectedItem.id, "read")}
                    className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                  >
                    Mark Read
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(selectedItem.id, "replied")}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-700 cursor-pointer"
                  >
                    Mark Replied
                  </button>
                </div>
              ) : <div />}

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl bg-neutral-200/80 hover:bg-neutral-200 text-neutral-700 font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
