"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

interface FieldErrorProps {
  error?: string | string[];
  className?: string;
}

export function FieldError({ error, className = "" }: FieldErrorProps) {
  if (!error) return null;
  const message = Array.isArray(error) ? error[0] : error;
  if (!message) return null;

  return (
    <p
      role="alert"
      className={`text-xs text-[#b00f23] font-medium mt-1 flex items-center gap-1 animate-in fade-in duration-150 ${className}`}
    >
      <span>{message}</span>
    </p>
  );
}

interface FormAlertProps {
  message?: string | null;
  className?: string;
}

export function FormAlert({ message, className = "" }: FormAlertProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`rounded-xl bg-red-50 border border-red-200/80 px-4 py-3 text-sm text-red-700 flex items-start gap-2.5 shadow-xs animate-in fade-in duration-150 ${className}`}
    >
      <AlertCircle className="h-4 w-4 text-[#b00f23] shrink-0 mt-0.5" />
      <span className="leading-snug">{message}</span>
    </div>
  );
}

/**
 * Helper to get border and focus ring classes depending on whether the field has an error.
 */
export function getFieldInputClassName(hasError?: boolean, extraClasses = ""): string {
  if (hasError) {
    return `border-red-400 focus:border-red-600 focus:ring-1 focus:ring-red-600/25 ${extraClasses}`;
  }
  return `border-[var(--border,theme(colors.neutral.200))] focus:border-[var(--accent,#0B2A4A)] focus:ring-1 focus:ring-[var(--accent,#0B2A4A)]/30 ${extraClasses}`;
}
