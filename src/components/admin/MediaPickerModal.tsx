"use client";

import React, { useEffect } from "react";
import MediaLibraryView from "./MediaLibraryView";
import { MediaFolderId } from "@/lib/constants/mediaFolders";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  initialFolder?: MediaFolderId;
  currentUrl?: string;
  title?: string;
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  initialFolder = "home-cards",
  currentUrl,
}: MediaPickerModalProps) {
  // Listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Window */}
      <div className="relative z-10 w-full max-w-5xl h-[90vh] max-h-[850px] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">
        <MediaLibraryView
          isModal={true}
          initialFolder={initialFolder}
          selectedUrl={currentUrl}
          onSelectImage={(url) => {
            onSelect(url);
            onClose();
          }}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
