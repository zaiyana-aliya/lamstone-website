import React from "react";
import Image from "next/image";
import MotionReveal from "./MotionReveal";

interface HeroBannerProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode; // CTAs or actions
  imageUrl?: string;
  imageAlt?: string;
  theme?: "green" | "lame" | "ivory" | "navy";
  eyebrowTheme?: "red" | "gold";
  heightClassName?: string;
}

export default function HeroBanner({
  eyebrow,
  title,
  description,
  children,
  imageUrl = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000&q=85",
  imageAlt = "Lamstone HealthCare hero background",
  theme = "green",
  eyebrowTheme,
  heightClassName = "py-32 sm:py-44",
}: HeroBannerProps) {
  const isLame = theme === "lame";
  const isIvory = theme === "ivory";
  const isNavy = theme === "navy";

  return (
    <section
      className={`relative overflow-hidden ${heightClassName} flex items-center ${
        isLame
          ? "bg-lame-bg text-lame-charcoal"
          : isIvory
          ? "bg-ivory text-charcoal"
          : isNavy
          ? "bg-[var(--primary)] text-white"
          : "bg-primary text-white"
      }`}
    >
      {/* 1. Cinematic Background with Ken Burns Pan/Zoom */}
      {imageUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className={`object-cover object-center animate-ken-burns ${isNavy ? "opacity-40" : "opacity-35"}`}
          />

          {/* Soft Gradient Overlay for Readability and Depth */}
          {isLame ? (
            <div className="absolute inset-0 bg-gradient-to-r from-lame-bg via-lame-bg/85 to-lame-bg/50" />
          ) : isIvory ? (
            <div className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/90 to-ivory/60" />
          ) : isNavy ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] via-[var(--primary)]/90 to-[var(--primary)]/55" />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 18% 45%, var(--primary) 0%, rgba(11,42,74,0.65) 55%, transparent 100%)",
                }}
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/50" />
          )}

          {/* Vignette / Bottom fade into page */}
          <div
            className={`absolute inset-0 bg-gradient-to-t ${
              isLame
                ? "from-lame-bg via-transparent to-transparent"
                : isIvory
                ? "from-ivory via-transparent to-transparent"
                : isNavy
                ? "from-[var(--primary)] via-[var(--primary)]/25 to-transparent"
                : "from-primary via-transparent to-transparent"
            }`}
          />
        </div>
      )}

      {/* Foreground Content with Staggered Motion */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl space-y-7">
          {/* Eyebrow */}
          {eyebrow && (
            <MotionReveal delay={100} direction="up">
              <div className="flex items-center gap-3">
                <span
                  className={`h-[2px] w-7 ${
                    eyebrowTheme === "red"
                      ? "bg-[var(--accent)]"
                      : isLame
                      ? "bg-lame-rose"
                      : "bg-[var(--accent-secondary)]"
                  }`}
                />
                <span
                  className={`text-xs uppercase tracking-[0.28em] ${
                    eyebrowTheme === "red"
                      ? "font-bold text-[var(--accent-light)] font-sans drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                      : isLame
                      ? "font-semibold text-lame-rose-dark"
                      : "font-semibold text-[var(--accent-secondary)]"
                  }`}
                >
                  {eyebrow}
                </span>
              </div>
            </MotionReveal>
          )}

          {/* Title */}
          <MotionReveal delay={250} direction="up">
            <h1
              className={`font-serif text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.08] ${
                isLame
                  ? "text-lame-charcoal"
                  : isIvory
                  ? "text-primary"
                  : "text-white drop-shadow-xs"
              }`}
            >
              {title}
            </h1>
          </MotionReveal>

          {/* Description */}
          {description && (
            <MotionReveal delay={400} direction="up">
              <p
                className={`text-lg sm:text-xl font-light leading-relaxed max-w-2xl ${
                  isLame
                    ? "text-neutral-700"
                    : isIvory
                    ? "text-charcoal-muted"
                    : isNavy
                    ? "text-white/80"
                    : "text-emerald-50/90"
                }`}
              >
                {description}
              </p>
            </MotionReveal>
          )}

          {/* Actions / Children */}
          {children && (
            <MotionReveal delay={550} direction="up">
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {children}
              </div>
            </MotionReveal>
          )}
        </div>
      </div>
    </section>
  );
}
