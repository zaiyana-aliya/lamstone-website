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
  theme?: "green" | "lame" | "ivory";
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
  heightClassName = "py-32 sm:py-44",
}: HeroBannerProps) {
  const isLame = theme === "lame";
  const isIvory = theme === "ivory";

  return (
    <section
      className={`relative overflow-hidden ${heightClassName} px-6 sm:px-8 lg:px-12 flex items-center ${
        isLame
          ? "bg-lame-bg text-lame-charcoal"
          : isIvory
          ? "bg-ivory text-charcoal"
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
            className="object-cover object-center animate-ken-burns opacity-35"
          />

          {/* Soft Gradient Overlay for Readability and Depth */}
          {isLame ? (
            <div className="absolute inset-0 bg-gradient-to-r from-lame-bg via-lame-bg/85 to-lame-bg/50" />
          ) : isIvory ? (
            <div className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/90 to-ivory/60" />
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
                : "from-primary via-transparent to-transparent"
            }`}
          />
        </div>
      )}

      {/* 2. Soft Ambient Blurred Glow behind headlines */}
      <div
        className={`pointer-events-none absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[550px] rounded-full blur-3xl opacity-20 ${
          isLame ? "bg-lame-rose" : "bg-gold"
        }`}
        aria-hidden="true"
      />

      {/* 3. Foreground Content with Staggered Motion */}
      <div className="relative z-10 mx-auto max-w-7xl w-full">
        <div className="max-w-3xl space-y-7">
          {/* Eyebrow */}
          {eyebrow && (
            <MotionReveal delay={100} direction="up">
              <div className="flex items-center gap-3">
                <span
                  className={`h-[1.5px] w-8 ${
                    isLame ? "bg-lame-rose" : "bg-gold"
                  }`}
                />
                <span
                  className={`text-xs uppercase tracking-[0.28em] font-semibold ${
                    isLame ? "text-lame-rose-dark" : "text-gold"
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
