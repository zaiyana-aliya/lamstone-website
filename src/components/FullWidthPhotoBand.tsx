import React from "react";
import Image from "next/image";
import MotionReveal from "@/components/MotionReveal";

interface FullWidthPhotoBandProps {
  imageUrl: string;
  imageAlt: string;
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  overlayClass?: string;
  className?: string;
  objectPosition?: string;
  accentColor?: string;
  accentTextColor?: string;
  headlineColor?: string;
  subheadlineColor?: string;
  ornamentalDividerWidth?: string;
  contentPaddingClass?: string;
  minHeightClass?: string;
  textAlign?: "center" | "left";
  contentContainerClass?: string;
}

export default function FullWidthPhotoBand({
  imageUrl,
  imageAlt,
  eyebrow,
  headline,
  subheadline,
  overlayClass = "bg-[var(--primary)]/60",
  className = "",
  objectPosition = "center",
  accentColor = "bg-[#E0BE73]",
  accentTextColor = "text-[#F5DC9C]",
  headlineColor = "text-white",
  subheadlineColor = "text-white/90",
  ornamentalDividerWidth = "w-24 sm:w-32",
  contentPaddingClass = "py-20 sm:py-24 lg:py-28",
  minHeightClass = "min-h-[360px] sm:min-h-[400px] lg:min-h-[440px]",
  textAlign = "center",
  contentContainerClass,
}: FullWidthPhotoBandProps) {
  const isLeft = textAlign === "left";

  return (
    <section
      className={`relative w-full overflow-hidden ${minHeightClass} flex items-center ${isLeft ? "justify-start" : "justify-center"} select-none ${className}`}
    >
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        sizes="100vw"
        className="object-cover pointer-events-none"
        style={{ objectPosition }}
      />

      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayClass} pointer-events-none`} />

      {/* Editorial Content */}
      <div
        className={
          contentContainerClass ||
          `relative z-10 mx-auto max-w-5xl w-full px-6 sm:px-8 lg:px-12 ${contentPaddingClass} ${isLeft ? "text-left" : "text-center"}`
        }
      >
        <MotionReveal direction="up">
          <div className={`space-y-4 sm:space-y-5 ${isLeft ? "text-left" : "text-center"}`}>
            {eyebrow && (
              <div className={`flex items-center ${isLeft ? "justify-start" : "justify-center"} gap-3`}>
                <span className={`h-[1px] w-6 sm:w-10 ${accentColor}`} />
                <span className={`text-[11px] sm:text-xs uppercase tracking-[0.28em] font-semibold ${accentTextColor} font-sans`}>
                  {eyebrow}
                </span>
                <span className={`h-[1px] w-6 sm:w-10 ${accentColor}`} />
              </div>
            )}

            <div className="space-y-3">
              <h2
                className={`font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-[46px] font-bold ${headlineColor} tracking-tight leading-[1.12] ${
                  isLeft ? "max-w-2xl lg:max-w-3xl mr-auto" : "max-w-4xl mx-auto"
                }`}
              >
                {headline}
              </h2>
              <div
                className={`${isLeft ? "mr-auto ml-0" : "mx-auto"} ${ornamentalDividerWidth} h-[2px] rounded-full ${accentColor}`}
              />
            </div>

            {subheadline && (
              <p
                className={`text-sm sm:text-base ${subheadlineColor} font-sans leading-[1.7] ${
                  isLeft ? "max-w-xl mr-auto" : "max-w-2xl mx-auto"
                }`}
              >
                {subheadline}
              </p>
            )}
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
