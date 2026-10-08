import React from "react";

interface HexNetworkOverlayProps {
  className?: string;
  opacity?: number;
}

/**
 * HexNetworkOverlay
 * Refined regular honeycomb lattice pattern for Our Values section.
 * - Single consistent 100px hexagon grid with hairline 0.8px strokes (#173A6B).
 * - Scattered round nodes (2-3px) and 5-7 gold accents (#B8934A).
 * - 2-3 thin gold outline hexagons.
 * - Dual clusters on left (24% width) and right (mirrored), densest at edge and fading inwards.
 * - Center 50%+ completely clear.
 * - Top & bottom edges faded smoothly.
 * - Overall opacity ~4-5% for faint watermark elegance on ivory.
 */
export default function HexNetworkOverlay({
  className = "",
  opacity = 0.14,
}: HexNetworkOverlayProps) {
  const leftMask =
    "linear-gradient(to right, #000 0%, #000 25%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)";
  const rightMask =
    "linear-gradient(to left, #000 0%, #000 25%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)";

  return (
    <div
      className={`pointer-events-none absolute inset-0 select-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      {/* Left Cluster: Densest at screen edge, smooth fade toward center */}
      <div
        className="hex-network-cluster absolute top-0 bottom-0 left-0 w-[24%] max-w-[420px]"
        style={
          {
            backgroundImage: "url('/patterns/hex-network.svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left center",
            backgroundSize: "cover",
            opacity: `var(--hex-network-opacity, ${opacity})`,
            WebkitMaskImage: leftMask,
            WebkitMaskComposite: "source-in",
            maskImage: leftMask,
            maskComposite: "intersect",
          } as React.CSSProperties
        }
      />

      {/* Right Cluster: Mirrored copy (flipped horizontally), densest at right screen edge */}
      <div
        className="hex-network-cluster absolute top-0 bottom-0 right-0 w-[24%] max-w-[420px] scale-x-[-1]"
        style={
          {
            backgroundImage: "url('/patterns/hex-network.svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left center",
            backgroundSize: "cover",
            opacity: `var(--hex-network-opacity, ${opacity})`,
            WebkitMaskImage: rightMask,
            WebkitMaskComposite: "source-in",
            maskImage: rightMask,
            maskComposite: "intersect",
          } as React.CSSProperties
        }
      />
    </div>
  );
}
