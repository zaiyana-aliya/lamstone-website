import React from "react";

interface BotanicalLeafWatermarkProps {
  className?: string;
  opacity?: number;
  color?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * Botanical Leaf Watermark
 * Delicate organic leaf branch SVG accent in gold (#B8934A).
 * Positioned behind content as a subtle decorative motif.
 */
export default function BotanicalLeafWatermark({
  className = "",
  opacity = 0.08,
  color = "#B8934A",
  width = 140,
  height = 240,
}: BotanicalLeafWatermarkProps) {
  const resolvedOpacity =
    (color.startsWith("rgba") || color.startsWith("hsla")) && opacity === 0.08 ? 1 : opacity;

  return (
    <svg
      viewBox="0 0 120 220"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity: resolvedOpacity }}
      aria-hidden="true"
    >
      {/* Graceful curving central stem */}
      <path
        d="M60 210 C58 150 54 85 70 15"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Botanical leaves paired along the stem */}
      <path
        d="M59 175 C38 170 28 154 33 138 C47 138 57 159 59 175 Z"
        fill={color}
      />
      <path
        d="M59 162 C80 157 90 141 85 125 C71 125 61 146 59 162 Z"
        fill={color}
      />
      <path
        d="M57 130 C36 125 26 109 31 93 C45 93 55 114 57 130 Z"
        fill={color}
      />
      <path
        d="M59 118 C80 113 90 97 85 81 C71 81 61 102 59 118 Z"
        fill={color}
      />
      <path
        d="M61 85 C40 80 30 64 35 48 C49 48 59 69 61 85 Z"
        fill={color}
      />
      <path
        d="M64 73 C85 68 95 52 90 36 C76 36 66 57 64 73 Z"
        fill={color}
      />
      {/* Terminal apex leaf */}
      <path
        d="M70 15 C65 4 75 0 75 0 C75 0 85 4 80 15 C75 22 72 20 70 15 Z"
        fill={color}
      />
    </svg>
  );
}
