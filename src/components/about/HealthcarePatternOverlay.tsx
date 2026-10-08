import React from "react";

interface HealthcarePatternOverlayProps {
  opacity?: number;
  className?: string;
  mask?: string;
  variant?: "navy" | "white";
}

/**
 * Healthcare Pattern Overlay
 * Repeating seamless 560x400 line-icon medical pattern.
 * Rendered behind section content at z-0 with radial gradient edge-mask.
 */
export default function HealthcarePatternOverlay({
  opacity = 0.07,
  className = "",
  mask = "radial-gradient(ellipse at center, transparent 20%, #000 75%)",
  variant = "navy",
}: HealthcarePatternOverlayProps) {
  const patternUrl =
    variant === "white"
      ? "/patterns/healthcare-white.svg"
      : "/patterns/healthcare.svg";

  return (
    <div
      className={`healthcare-pattern-overlay absolute inset-0 pointer-events-none select-none z-0 ${className}`}
      style={
        {
          backgroundImage: `url('${patternUrl}')`,
          backgroundRepeat: "repeat",
          backgroundSize: "560px 400px",
          opacity: `var(--pattern-opacity, ${opacity})`,
          WebkitMaskImage: mask,
          maskImage: mask,
        } as React.CSSProperties
      }
      aria-hidden="true"
    />
  );
}
