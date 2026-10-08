"use client";

import React, { useState, useEffect } from "react";
import { X, Send, CheckCircle2, UploadCloud, FileText } from "lucide-react";
import { FieldError, FormAlert, getFieldInputClassName } from "@/components/form/FormError";

interface CareersModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPosition?: string;
}

export default function CareersModal({ isOpen, onClose, defaultPosition }: CareersModalProps) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    position: defaultPosition || "General Application",
    cover_letter: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setForm({
        full_name: "",
        email: "",
        phone: "",
        position: defaultPosition || "General Application",
        cover_letter: "",
      });
      setFile(null);
      setFieldErrors({});
      setSubmitted(false);
      setError(null);
      setLoading(false);
    }
  }, [isOpen, defaultPosition]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 5 * 1024 * 1024) {
        setFieldErrors((prev) => ({ ...prev, resume: ["File must be under 5 MB"] }));
        return;
      }
      setFile(selected);
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.resume;
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    if (file && file.size > 5 * 1024 * 1024) {
      setFieldErrors({ resume: ["File must be under 5 MB"] });
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("full_name", form.full_name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("position", form.position);
      formData.append("cover_letter", form.cover_letter);
      if (file) {
        formData.append("resume", file);
      }

      const res = await fetch("/api/careers", {
        method: "POST",
        body: formData,
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.fields && Object.keys(json.fields).length > 0) {
          setFieldErrors(json.fields);
        } else {
          setError(
            json.error ?? "Something went wrong submitting your form — please try again"
          );
        }
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Something went wrong submitting your form — please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        className="fixed inset-0 bg-[var(--primary-deep)]/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[0_24px_60px_-12px_var(--shadow-color)] overflow-hidden z-10 my-auto">
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-light)]" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[var(--body)]/70 hover:text-[var(--heading)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-soft)] ring-8 ring-[var(--accent-soft)]">
                <CheckCircle2 className="h-9 w-9 text-[var(--accent-text)]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-medium text-[var(--heading)]">
                  Application Received!
                </h3>
                <p className="text-sm text-[var(--body)] font-light leading-relaxed max-w-sm">
                  Thank you for your interest in joining Lamstone HealthCare. Our talent acquisition
                  team will review your profile and reach out if there is a match.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 inline-flex items-center justify-center rounded-xl bg-[var(--primary)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-deep)] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5 pr-8">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-[2px] w-6 bg-[var(--accent)]" />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--accent-text)]">
                    Careers at Lamstone
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-medium text-[var(--heading)]">
                  Send Resume / Connect
                </h3>
                <p className="text-xs text-[var(--body)] font-light">
                  Submit your details and CV for upcoming opportunities across our ecosystem.
                </p>
              </div>

              {/* Server / General Error Alert */}
              <FormAlert message={error} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[var(--body)]">
                    Full Name *
                  </span>
                  <input
                    name="full_name"
                    type="text"
                    required
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={getFieldInputClassName(
                      Boolean(fieldErrors.full_name),
                      "w-full rounded-xl bg-[var(--bg)] border border-[var(--border)] px-3.5 py-2.5 text-sm font-light text-[var(--heading)] placeholder-[var(--body)]/50 outline-none transition-colors"
                    )}
                  />
                  <FieldError error={fieldErrors.full_name} />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[var(--body)]">
                    Email Address *
                  </span>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    className={getFieldInputClassName(
                      Boolean(fieldErrors.email),
                      "w-full rounded-xl bg-[var(--bg)] border border-[var(--border)] px-3.5 py-2.5 text-sm font-light text-[var(--heading)] placeholder-[var(--body)]/50 outline-none transition-colors"
                    )}
                  />
                  <FieldError error={fieldErrors.email} />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[var(--body)]">
                    Phone Number *
                  </span>
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className={getFieldInputClassName(
                      Boolean(fieldErrors.phone),
                      "w-full rounded-xl bg-[var(--bg)] border border-[var(--border)] px-3.5 py-2.5 text-sm font-light text-[var(--heading)] placeholder-[var(--body)]/50 outline-none transition-colors"
                    )}
                  />
                  <FieldError error={fieldErrors.phone} />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[var(--body)]">
                    Desired Role / Department *
                  </span>
                  <input
                    name="position"
                    type="text"
                    required
                    value={form.position}
                    onChange={handleChange}
                    placeholder="e.g. Pharmacist, Store Manager"
                    className={getFieldInputClassName(
                      Boolean(fieldErrors.position),
                      "w-full rounded-xl bg-[var(--bg)] border border-[var(--border)] px-3.5 py-2.5 text-sm font-light text-[var(--heading)] placeholder-[var(--body)]/50 outline-none transition-colors"
                    )}
                  />
                  <FieldError error={fieldErrors.position} />
                </label>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-[var(--body)]">
                  Cover Letter / Brief Intro *
                </span>
                <textarea
                  name="cover_letter"
                  required
                  value={form.cover_letter}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Share a short summary of your background and experience…"
                  className={getFieldInputClassName(
                    Boolean(fieldErrors.cover_letter),
                    "w-full rounded-xl bg-[var(--bg)] border border-[var(--border)] px-3.5 py-2.5 text-sm font-light text-[var(--heading)] placeholder-[var(--body)]/50 outline-none resize-none transition-colors"
                  )}
                />
                <FieldError error={fieldErrors.cover_letter} />
              </label>

              {/* Resume File Upload */}
              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-[var(--body)]">
                  Upload Resume (PDF, DOCX max 5MB)
                </span>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                    fieldErrors.resume
                      ? "border-red-400 bg-red-50/20"
                      : "border-[var(--border)] hover:border-[var(--accent)]/50 bg-[var(--bg)]"
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {file ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-[var(--heading)] font-medium">
                      <FileText className="h-5 w-5 text-[var(--accent)]" />
                      <span className="truncate max-w-[260px]">{file.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1 text-[var(--body)]/70">
                      <UploadCloud className="h-6 w-6 text-[var(--body)]/50" />
                      <span className="text-xs font-light">Click or drag file to attach resume</span>
                    </div>
                  )}
                </div>
                <FieldError error={fieldErrors.resume} />
              </label>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-[image:var(--btn-solid-gradient)] px-7 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_var(--shadow-color)] hover:shadow-[0_10px_26px_var(--shadow-color)] hover:brightness-[1.08] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <span>Submitting Application…</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
