import React from "react";
import Link from "next/link";

export type CTAButtonVariant =
  | "primary"
  | "outline"
  | "outline-light"
  | "green"
  | "navy"
  | "lame"
  | "red"
  | "theme-solid"
  | "theme-gold"
  | "theme-accent"
  | "theme-outline"
  | "theme-outline-light";
export type CTAButtonSize = "sm" | "md" | "lg";

export interface CTAButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CTAButtonVariant;
  size?: CTAButtonSize;
  href?: string;
  children: React.ReactNode;
  className?: string;
  fixed?: boolean;
}

export default function CTAButton({
  variant = "primary",
  size = "md",
  href,
  children,
  className = "",
  fixed = false,
  ...props
}: CTAButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer tracking-wide";

  const sizeStyles: Record<CTAButtonSize, string> = {
    sm: "text-xs px-3.5 py-1.5 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-2.5",
  };

  const variantStyles: Record<CTAButtonVariant, string> = {
    primary:
      "bg-gradient-to-b from-[#E0BE73] via-[#C9A24B] to-[#AE872E] text-white border border-[#E2C785]/40 shadow-[0_4px_14px_0_rgba(201,162,75,0.38),inset_0_1px_0_0_rgba(255,255,255,0.4)] hover:shadow-[0_8px_24px_0_rgba(201,162,75,0.52),inset_0_1px_0_0_rgba(255,255,255,0.5)] hover:brightness-[1.03] focus-visible:ring-gold",
    outline:
      "border border-[#0B2A4A]/25 bg-transparent text-[#0B2A4A] hover:bg-[#0B2A4A]/5 hover:border-[#0B2A4A] focus-visible:ring-[#0B2A4A] shadow-2xs hover:shadow-xs",
    "outline-light":
      "border border-white/60 bg-transparent text-white hover:bg-white hover:text-[#0B2A4A] hover:border-white shadow-2xs hover:shadow-[0_6px_20px_0_rgba(255,255,255,0.25)] focus-visible:ring-white",
    green:
      "bg-primary text-white shadow-xs hover:bg-primary-light hover:shadow-md focus-visible:ring-primary",
    navy:
      "bg-[#0B2A4A] text-white shadow-xs hover:bg-[#132a4e] hover:shadow-md focus-visible:ring-[#0B2A4A]",
    lame:
      "bg-[#b00f23] hover:bg-[#960d1e] text-white shadow-[0_4px_16px_rgba(176,15,35,0.32)] hover:shadow-[0_10px_26px_rgba(176,15,35,0.48)] focus-visible:ring-[#b00f23]",
    red:
      "bg-[#b00f23] hover:bg-[#960d1e] text-white shadow-[0_4px_16px_rgba(176,15,35,0.32)] hover:shadow-[0_10px_26px_rgba(176,15,35,0.48)] focus-visible:ring-[#b00f23]",
    "theme-solid":
      "bg-[image:var(--btn-solid-gradient)] text-white shadow-[0_4px_16px_var(--shadow-color)] hover:brightness-110 hover:shadow-md focus-visible:ring-[var(--primary)]",
    "theme-gold":
      "border-2 border-[var(--accent)] bg-transparent text-[var(--accent-text)] hover:bg-[var(--accent)] hover:text-white shadow-xs hover:shadow-sm font-semibold focus-visible:ring-[var(--accent)] transition-all duration-300",
    "theme-accent":
      "border-2 border-[var(--accent)] bg-transparent text-[var(--accent-text)] hover:bg-[var(--accent)] hover:text-white shadow-xs hover:shadow-sm font-semibold focus-visible:ring-[var(--accent)] transition-all duration-300",
    "theme-outline":
      "border-2 border-[var(--accent)] bg-transparent text-[var(--accent-text)] hover:bg-[var(--accent)] hover:text-white shadow-xs hover:shadow-sm focus-visible:ring-[var(--accent)] transition-all duration-300 font-medium",
    "theme-outline-light":
      "border-2 border-white/80 bg-transparent text-white hover:bg-white hover:text-[var(--primary-deep)] hover:border-white shadow-xs hover:shadow-[0_6px_20px_0_rgba(255,255,255,0.25)] focus-visible:ring-white transition-all duration-300",
  };

  const combinedStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={combinedStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedStyles} {...props}>
      {children}
    </button>
  );
}
