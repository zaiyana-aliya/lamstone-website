import React from "react";
import Link from "next/link";

export type CTAButtonVariant = "primary" | "outline" | "outline-light" | "green" | "navy" | "lame";
export type CTAButtonSize = "sm" | "md" | "lg";

export interface CTAButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CTAButtonVariant;
  size?: CTAButtonSize;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export default function CTAButton({
  variant = "primary",
  size = "md",
  href,
  children,
  className = "",
  ...props
}: CTAButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 hover:scale-[1.025] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer tracking-wide";

  const sizeStyles: Record<CTAButtonSize, string> = {
    sm: "text-xs px-3.5 py-1.5 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-2.5",
  };

  const variantStyles: Record<CTAButtonVariant, string> = {
    primary:
      "bg-gradient-to-b from-[#D8B76E] via-[#C9A24B] to-[#B8923A] text-white border border-[#E2C785]/30 shadow-[0_4px_14px_0_rgba(201,162,75,0.35),inset_0_1px_0_0_rgba(255,255,255,0.3)] hover:shadow-[0_6px_20px_0_rgba(201,162,75,0.48),inset_0_1px_0_0_rgba(255,255,255,0.4)] hover:brightness-[1.03] focus-visible:ring-gold",
    outline:
      "border border-primary/25 bg-transparent text-primary hover:bg-primary/5 hover:border-primary focus-visible:ring-primary shadow-2xs hover:shadow-xs",
    "outline-light":
      "border border-white/40 bg-transparent text-white hover:bg-white/10 hover:border-white focus-visible:ring-white shadow-2xs hover:shadow-xs",
    green:
      "bg-primary text-white shadow-xs hover:bg-primary-light hover:shadow-md focus-visible:ring-primary",
    navy:
      "bg-primary text-white shadow-xs hover:bg-primary-light hover:shadow-md focus-visible:ring-primary",
    lame:
      "bg-lame-rose text-white shadow-xs hover:bg-lame-rose-dark hover:shadow-md focus-visible:ring-lame-rose",
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
