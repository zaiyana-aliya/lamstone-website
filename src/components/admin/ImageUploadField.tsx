"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  UploadCloud,
  X,
  RefreshCw,
  FolderOpen,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import MediaPickerModal from "./MediaPickerModal";
import { MediaFolderId } from "@/lib/constants/mediaFolders";

interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  folder?: MediaFolderId;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ImageUploadField({
  label = "Image / Photo Asset",
  value,
  onChange,
  required = false,
  hint,
  placeholder = "e.g. https://... or /images/...",
  folder = "home-cards",
}: ImageUploadFieldProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Direct file upload fallback (uploads to selected folder)
  const handleQuickUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds 5 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
      return;
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      setError("Invalid file type. Only JPG, PNG, and WebP are allowed.");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to upload image.");
      } else {
        onChange(json.url);
      }
    } catch {
      setError("Network error while uploading.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <span className="text-[10px] text-neutral-400 font-mono">
          Folder: /media/{folder}/
        </span>
      </div>

      {error && (
        <span className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
          {error}
        </span>
      )}

      {/* Editable Text Field + Browse Media Library + Quick Upload Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-mono text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#0B2A4A] focus:ring-1 focus:ring-[#0B2A4A]/30 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Browse Media Library Button */}
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#0B2A4A] hover:bg-[#13375e] text-white text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer select-none"
            title={`Browse Media Library (/media/${folder}/)`}
          >
            <FolderOpen className="h-3.5 w-3.5 text-[#E2C785]" />
            <span>Browse Media</span>
          </button>

          {/* Quick Direct Upload Button */}
          <label className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer select-none">
            {uploading ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#C9A227]" />
            ) : (
              <UploadCloud className="h-3.5 w-3.5 text-neutral-500" />
            )}
            <span>{uploading ? "Uploading…" : "Upload"}</span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              disabled={uploading}
              onChange={handleQuickUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Image Preview & Details Card */}
      {value ? (
        <div className="relative flex items-center gap-3 p-2.5 rounded-xl border border-neutral-200 bg-neutral-50/70">
          <div className="relative h-14 w-14 rounded-lg overflow-hidden border border-neutral-200 bg-white shrink-0">
            <Image
              src={value}
              alt="Field preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Current URL
              </span>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-[#0B2A4A]"
                title="Open image in new tab"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="text-xs font-mono text-neutral-700 truncate" title={value}>
              {value}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Clear image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-neutral-200 bg-neutral-50/40 text-neutral-400 text-xs font-light">
          <ImageIcon className="h-3.5 w-3.5 text-neutral-300" />
          <span>No image selected. Click &quot;Browse Media&quot; or type an image URL.</span>
        </div>
      )}

      {hint && <span className="text-[11px] text-neutral-400 font-light">{hint}</span>}

      {/* Modal Picker */}
      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        initialFolder={folder}
        currentUrl={value}
        onSelect={(newUrl) => onChange(newUrl)}
      />
    </div>
  );
}
