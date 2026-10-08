"use client";

import React, { useState, useEffect } from "react";
import { X, Send, CheckCircle2 } from "lucide-react";
import { FieldError, FormAlert, getFieldInputClassName } from "@/components/form/FormError";

interface FormField {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: string;
  fields: FormField[];
  apiEndpoint: string;
  extraPayload?: Record<string, string>;
  successMessage?: string;
}

export default function FormModal({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  fields,
  apiEndpoint,
  extraPayload = {},
  successMessage = "Your submission has been received. Our team will be in touch shortly.",
}: BaseModalProps) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setForm({});
      setFieldErrors({});
      setSubmitted(false);
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...extraPayload }),
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[var(--primary-deep)]/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[0_24px_60px_-12px_var(--shadow-color)] overflow-hidden z-10 my-auto">
        {/* Top Accent */}
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--accent-light)]" />

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[var(--body)]/70 hover:text-[var(--heading)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
          aria-label="Close modal"
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
                <h3 className="font-serif text-2xl font-medium text-[var(--heading)]">Received!</h3>
                <p className="text-sm text-[var(--body)] font-light leading-relaxed max-w-sm">
                  {successMessage}
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
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
              {/* Header */}
              <div className="space-y-1.5 pr-8">
                {badge && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-[2px] w-6 bg-[var(--accent)]" />
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--accent-text)]">
                      {badge}
                    </span>
                  </div>
                )}
                <h3 className="font-serif text-2xl font-medium text-[var(--heading)]">{title}</h3>
                {subtitle && <p className="text-sm text-[var(--body)]/80 font-light">{subtitle}</p>}
              </div>

              {/* Server / General Error Alert */}
              <FormAlert message={error} />

              {/* Fields */}
              {fields.map((field) => {
                const hasFieldError = Boolean(fieldErrors[field.name]);
                const inputClasses = getFieldInputClassName(
                  hasFieldError,
                  "w-full rounded-xl bg-[var(--bg)] border border-[var(--border)] px-3.5 py-2.5 text-sm font-light text-[var(--heading)] placeholder-[var(--body)]/50 outline-none transition-colors"
                );

                return (
                  <label key={field.name} className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[var(--body)]">
                      {field.label} {field.required && "*"}
                    </span>
                    {field.rows ? (
                      <textarea
                        name={field.name}
                        required={field.required}
                        value={form[field.name] ?? ""}
                        onChange={handleChange}
                        rows={field.rows}
                        placeholder={field.placeholder}
                        className={`${inputClasses} resize-none`}
                      />
                    ) : (
                      <input
                        name={field.name}
                        type={field.type ?? "text"}
                        required={field.required}
                        value={form[field.name] ?? ""}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className={inputClasses}
                      />
                    )}
                    <FieldError error={fieldErrors[field.name]} />
                  </label>
                );
              })}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-[image:var(--btn-solid-gradient)] px-7 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_var(--shadow-color)] hover:brightness-[1.08] hover:shadow-[0_10px_26px_var(--shadow-color)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <span>Submitting…</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit</span>
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
