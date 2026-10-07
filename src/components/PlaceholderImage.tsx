import React from "react";
import { Image as ImageIcon } from "lucide-react";

interface PlaceholderImageProps {
  alt: string;
  className?: string;
  aspectRatio?: string; // e.g. "aspect-video", "aspect-square", "aspect-4/3"
  label?: string;
}

export default function PlaceholderImage({
  alt,
  className = "",
  aspectRatio = "aspect-video",
  label,
}: PlaceholderImageProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative w-full ${aspectRatio} flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-100/80 p-6 text-center text-neutral-500 transition-colors dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-400 ${className}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-200/80 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 mb-2">
        <ImageIcon className="h-5 w-5" />
      </div>
      <span className="text-xs font-medium tracking-wide uppercase text-neutral-400 dark:text-neutral-500">
        Placeholder Image
      </span>
      <span className="mt-1 text-xs text-neutral-600 dark:text-neutral-300 max-w-[80%] line-clamp-2">
        {label || alt}
      </span>
    </div>
  );
}
