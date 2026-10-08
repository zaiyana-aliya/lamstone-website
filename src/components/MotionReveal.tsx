"use client";

import React, { useEffect, useRef, useState } from "react";

interface MotionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay in milliseconds
  duration?: number; // Duration in seconds
  direction?: "up" | "down" | "left" | "right" | "none";
}

export default function MotionReveal({
  children,
  className = "",
  delay = 0,
  duration,
  direction = "up",
}: MotionRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isInstant, setIsInstant] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // 1. Immediate check: if element is already within (or near) the viewport on initial load,
    // reveal immediately so content already on screen is visible without requiring any scroll
    const checkInitialVisibility = () => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < windowHeight + 80 && rect.bottom > 0) {
        setIsInstant(true);
        setIsVisible(true);
        return true;
      }
      return false;
    };

    if (checkInitialVisibility()) {
      return;
    }

    // 2. IntersectionObserver for elements scrolled into view later
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0, rootMargin: "0px 0px 60px 0px" }
    );

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, []);

  const getDirectionClasses = () => {
    if (isInstant || isVisible) {
      switch (direction) {
        case "none":
          return "opacity-100 scale-100";
        default:
          return "opacity-100 translate-x-0 translate-y-0";
      }
    }

    switch (direction) {
      case "up":
        return "opacity-0 translate-y-8";
      case "down":
        return "opacity-0 -translate-y-8";
      case "left":
        return "opacity-0 translate-x-8";
      case "right":
        return "opacity-0 -translate-x-8";
      case "none":
        return "opacity-0 scale-95";
      default:
        return "opacity-0 translate-y-8";
    }
  };

  return (
    <div
      ref={elementRef}
      data-motion-reveal="true"
      style={
        isInstant
          ? undefined
          : {
              transitionDelay: `${delay}ms`,
              ...(duration !== undefined ? { transitionDuration: `${duration * 1000}ms` } : {}),
            }
      }
      className={`${
        isInstant
          ? "transition-opacity duration-200 ease-out"
          : "transition-all duration-700 ease-out will-change-transform"
      } ${getDirectionClasses()} ${className}`}
    >
      {children}
    </div>
  );
}
