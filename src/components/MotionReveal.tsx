"use client";

import React, { useEffect, useRef, useState } from "react";

interface MotionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay in milliseconds
  direction?: "up" | "down" | "left" | "right" | "none";
}

export default function MotionReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: MotionRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const el = elementRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, []);

  const getDirectionClasses = () => {
    switch (direction) {
      case "up":
        return isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8";
      case "down":
        return isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8";
      case "left":
        return isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8";
      case "right":
        return isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8";
      case "none":
        return isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95";
      default:
        return isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8";
    }
  };

  return (
    <div
      ref={elementRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${getDirectionClasses()} ${className}`}
    >
      {children}
    </div>
  );
}
