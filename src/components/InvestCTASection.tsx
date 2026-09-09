"use client";

import React, { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import CTAButton from "./CTAButton";
import MotionReveal from "./MotionReveal";

const subscribePointerMedia = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(pointer: fine)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
};

const getPointerSnapshot = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
};

const getServerSnapshot = () => false;

export default function InvestCTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const hasPointer = useSyncExternalStore(
    subscribePointerMedia,
    getPointerSnapshot,
    getServerSnapshot
  );

  // Smooth lerp / damped coords for desktop mouse parallax
  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const currentOffsetRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  const shape1Ref = useRef<HTMLDivElement>(null);
  const shape2Ref = useRef<HTMLDivElement>(null);
  const shape3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasPointer) return;

    const section = sectionRef.current;
    if (!section) return;

    // Animation loop using lerp for smooth damped motion
    const animate = () => {
      // Lerp factor (0.08 provides graceful, damped easing)
      currentOffsetRef.current.x +=
        (targetOffsetRef.current.x - currentOffsetRef.current.x) * 0.08;
      currentOffsetRef.current.y +=
        (targetOffsetRef.current.y - currentOffsetRef.current.y) * 0.08;

      const { x, y } = currentOffsetRef.current;

      // Shape 1: Brand Green Blob (18px max travel, factor 1.0)
      if (shape1Ref.current) {
        shape1Ref.current.style.transform = `translate3d(${x * 18}px, ${y * 18}px, 0)`;
      }

      // Shape 2: Warm Gold Subtle Blob (12px max travel, inverse factor -0.7)
      if (shape2Ref.current) {
        shape2Ref.current.style.transform = `translate3d(${-x * 12}px, ${-y * 12}px, 0)`;
      }

      // Shape 3: Soft Emerald/Gold Leaf Motif (15px max travel, factor 0.85)
      if (shape3Ref.current) {
        shape3Ref.current.style.transform = `translate3d(${x * 15}px, ${y * 15}px, 0)`;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // Mouse movement listener on section (relative -1 to +1 coordinates)
    let rafThrottled = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (rafThrottled) return;
      rafThrottled = true;

      requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        // Normalized from -1 (left/top) to +1 (right/bottom)
        const relX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const relY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

        // Clamp between -1 and 1
        targetOffsetRef.current = {
          x: Math.max(-1, Math.min(1, relX)),
          y: Math.max(-1, Math.min(1, relY)),
        };
        rafThrottled = false;
      });
    };

    const handleMouseLeave = () => {
      // Return gently to center when cursor exits
      targetOffsetRef.current = { x: 0, y: 0 };
    };

    section.addEventListener("mousemove", handleMouseMove, { passive: true });
    section.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [hasPointer]);

  // Determine whether to apply touch auto-drift animations
  // When hasPointer is false (touch device or mobile), enable auto-drift keyframe classes
  const isTouchDevice = hasPointer === false;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-ivory pt-10 sm:pt-14 pb-10 sm:pb-12 border-t border-border-subtle"
    >
      {/* Decorative Parallax / Auto-drift Background Shapes */}
      {/* 1. Large Brand Green Ambient Glow / Blob (Top Left to Center) */}
      <div
        ref={shape1Ref}
        aria-hidden="true"
        className={`pointer-events-none absolute -top-16 -left-16 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-primary/8 blur-3xl will-change-transform z-0 ${
          isTouchDevice ? "animate-drift-blob1" : ""
        }`}
      />

      {/* 2. Warm Gold Subtle Glow / Blob (Bottom Right) */}
      <div
        ref={shape2Ref}
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-20 -right-16 w-88 h-88 sm:w-[420px] sm:h-[420px] rounded-full bg-gold/12 blur-3xl will-change-transform z-0 ${
          isTouchDevice ? "animate-drift-blob2" : ""
        }`}
      />

      {/* 3. Soft Brand Green & Gold Floating Motif (Center / Left Behind Card) */}
      <div
        ref={shape3Ref}
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/3 left-1/4 w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-primary/5 via-gold/8 to-transparent blur-2xl will-change-transform z-0 ${
          isTouchDevice ? "animate-drift-blob3" : ""
        }`}
      >
        {/* Subtle decorative leaf watermark inside blob */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute inset-0 m-auto w-40 h-40 text-primary/10 select-none opacity-60"
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      </div>

      {/* Main Content Container (z-10 ensures content stays 100% stable, unmoving, and accessible) */}
      <div className="relative mx-auto max-w-5xl px-6 sm:px-8 lg:px-12 z-10 w-full">
        <MotionReveal direction="none">
          <div className="rounded-3xl border border-border-subtle bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center p-6 sm:p-9 lg:p-10">
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold-dark text-xs font-semibold tracking-wider uppercase">
                  Strategic Investment
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-primary tracking-tight">
                  Invest in Growth with Lamstone
                </h2>
                <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed font-light">
                  Join our rapidly expanding pharmacy chain and beauty ecosystem. We offer transparent, secure, and lucrative partnership models for forward-thinking investors.
                </p>
                <div className="pt-1">
                  <CTAButton href="/contact" variant="primary" size="md">
                    Talk to Us
                  </CTAButton>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="relative overflow-hidden rounded-2xl aspect-16/10 sm:aspect-16/10 lg:aspect-[4/3] max-h-56 sm:max-h-64 lg:max-h-60 shadow-md group">
                  <Image
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85"
                    alt="Modern upward architectural geometric perspective representing corporate growth"
                    fill
                    className="object-cover object-center group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
