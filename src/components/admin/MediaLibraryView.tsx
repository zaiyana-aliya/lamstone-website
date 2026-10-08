"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  UploadCloud,
  Copy,
  Check,
  Trash2,
  RefreshCw,
  Image as ImageIcon,
  Folder,
  Search,
  ExternalLink,
  X,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { MEDIA_FOLDERS, MediaFolderId } from "@/lib/constants/mediaFolders";

export interface MediaAsset {
  id: string;
  name: string;
  filename: string;
  folder: string;
  path: string;
  url: string;
  size_bytes: number;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

interface MediaLibraryViewProps {
  initialFolder?: MediaFolderId;
  onSelectImage?: (url: string) => void;
  selectedUrl?: string;
  isModal?: boolean;
  onClose?: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

export default function MediaLibraryView({
  initialFolder = "home-cards",
  onSelectImage,
  selectedUrl: externalSelectedUrl,
  isModal = false,
  onClose,
}: MediaLibraryViewProps) {
  const [activeFolder, setActiveFolder] = useState<MediaFolderId>(initialFolder);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [currentSelectedUrl, setCurrentSelectedUrl] = useState<string>(externalSelectedUrl || "");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync active folder if initialFolder changes
  useEffect(() => {
    if (initialFolder) {
      setActiveFolder(initialFolder);
    }
  }, [initialFolder]);

  // Fetch assets for currently active folder
  const fetchFolderAssets = useCallback(async (folderKey: MediaFolderId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/media?folder=${folderKey}`);
      const data = await res.json();
      if (res.ok) {
        setAssets(data.assets || []);
      } else {
        setError(data.error || "Failed to load media assets");
      }
    } catch (err: any) {
      setError(err.message || "Network error loading media folder");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFolderAssets(activeFolder);
  }, [activeFolder, fetchFolderAssets]);

  // If externalSelectedUrl matches an asset in current folder, select it
  useEffect(() => {
    if (currentSelectedUrl && assets.length > 0) {
      const match = assets.find((a) => a.url === currentSelectedUrl);
      if (match) setSelectedAsset(match);
    }
  }, [currentSelectedUrl, assets]);

  // File upload handler
  const handleUpload = async (file: File) => {
    // Client-side validations
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setError(`File size (${sizeMB} MB) exceeds the 5 MB limit. Please choose a smaller image.`);
      return;
    }

    const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
    const isMimeValid = ALLOWED_MIME_TYPES.includes(file.type.toLowerCase());
    const isExtValid = ALLOWED_EXTENSIONS.includes(ext);

    if (!isMimeValid && !isExtValid) {
      setError("Invalid file type. Only JPG, PNG, and WebP images are allowed.");
      return;
    }

    setUploading(true);
    setUploadProgress(15);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", activeFolder);

    try {
      // Simulate progress tick for better UX
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => (prev >= 85 ? prev : prev + 15));
      }, 200);

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressTimer);
      setUploadProgress(100);

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to upload image.");
      } else {
        // Automatically select the new asset
        setCurrentSelectedUrl(json.url);
        // Refresh folder listing
        await fetchFolderAssets(activeFolder);
      }
    } catch {
      setError("Network error while uploading file.");
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 400);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    handleUpload(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  // Thumbnail click
  const handleSelectAsset = (asset: MediaAsset) => {
    setSelectedAsset(asset);
    setCurrentSelectedUrl(asset.url);
  };

  // Copy URL to clipboard
  const handleCopyUrl = (urlToCopy: string) => {
    if (!urlToCopy) return;
    navigator.clipboard.writeText(urlToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Delete file
  const handleDeleteAsset = async (asset: MediaAsset, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${asset.filename}" from folder /media/${activeFolder}/?`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `/api/admin/media?path=${encodeURIComponent(asset.path || asset.filename)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setAssets((prev) => prev.filter((a) => a.id !== asset.id && a.path !== asset.path));
        if (selectedAsset?.path === asset.path) {
          setSelectedAsset(null);
          setCurrentSelectedUrl("");
        }
      } else {
        const json = await res.json();
        alert(json.error || "Failed to delete file.");
      }
    } catch {
      alert("Network error deleting file.");
    }
  };

  // Filter assets by search query
  const filteredAssets = assets.filter((asset) =>
    asset.filename.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const activeFolderMeta = MEDIA_FOLDERS.find((f) => f.id === activeFolder) || MEDIA_FOLDERS[0];

  return (
    <div className="flex flex-col h-full w-full bg-[#FAFAFA] rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
      {/* Top Header */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#0B2A4A]/10 text-[#0B2A4A] flex items-center justify-center font-serif text-lg font-bold">
            <Folder className="h-5 w-5 text-[#0B2A4A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-semibold text-[#0B2A4A] tracking-tight">
                Supabase Media Library
              </h2>
              <span className="text-[10px] font-mono uppercase bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full border border-neutral-200">
                /media/{activeFolder}/
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-light mt-0.5">
              {activeFolderMeta.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search filename…"
              className="pl-8 pr-3 py-1.5 text-xs rounded-full border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:border-[#0B2A4A] transition-colors w-40 sm:w-48"
            />
          </div>

          <button
            type="button"
            onClick={() => fetchFolderAssets(activeFolder)}
            className="p-2 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-[#0B2A4A] transition-colors cursor-pointer"
            title="Refresh folder"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-[#C9A227]" : ""}`} />
          </button>

          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer ml-1"
              title="Close picker"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Folder Tabs */}
      <div className="bg-white border-b border-neutral-200 px-4 py-2 overflow-x-auto scrollbar-none flex items-center gap-1.5">
        {MEDIA_FOLDERS.map((folder) => {
          const isActive = activeFolder === folder.id;
          return (
            <button
              key={folder.id}
              type="button"
              onClick={() => {
                setActiveFolder(folder.id as MediaFolderId);
                setSearchQuery("");
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-[#0B2A4A] text-white shadow-xs font-semibold"
                  : "bg-neutral-100/70 hover:bg-neutral-100 text-neutral-600 hover:text-[#0B2A4A]"
              }`}
            >
              <Folder
                className={`h-3.5 w-3.5 ${isActive ? "text-[#E2C785]" : "text-neutral-400"}`}
              />
              <span>{folder.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Error Alert */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-700 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-800 text-xs font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Upload Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer select-none ${
            dragOver
              ? "border-[#b00f23] bg-[#b00f23]/5 scale-[0.99]"
              : "border-neutral-300 hover:border-[#0B2A4A]/50 bg-white hover:bg-neutral-50/50 shadow-2xs"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            disabled={uploading}
            onChange={onFileInputChange}
            className="hidden"
          />

          {uploading ? (
            <div className="py-2 space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#0B2A4A]">
                <RefreshCw className="h-4 w-4 animate-spin text-[#C9A227]" />
                <span>Uploading to /media/{activeFolder}/…</span>
              </div>
              <div className="w-full max-w-xs mx-auto bg-neutral-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#b00f23] to-[#C9A227] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-neutral-400 font-light">
                Securing in Supabase Storage with public CDN delivery
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center text-[#0B2A4A] group-hover:scale-110 transition-transform">
                <UploadCloud className="h-5 w-5 text-[#b00f23]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-800">
                  <span className="text-[#b00f23] underline font-bold">Click to upload</span> or drag and drop image here
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Uploading to <strong className="text-neutral-600 font-medium">/{activeFolder}/</strong> &bull; JPG, PNG, WebP up to 5 MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="p-16 text-center text-sm text-neutral-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-[#C9A227]" />
            <span className="text-xs font-medium text-neutral-500">
              Loading {activeFolderMeta.name} assets…
            </span>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center text-neutral-400 space-y-3 shadow-2xs">
            <ImageIcon className="h-10 w-10 text-neutral-300 mx-auto" />
            <p className="text-sm font-medium text-neutral-600">
              {searchQuery
                ? `No images matching "${searchQuery}" in this folder.`
                : `No images in ${activeFolderMeta.name} folder yet.`}
            </p>
            <p className="text-xs text-neutral-400 font-light max-w-sm mx-auto">
              Upload images directly using the drop zone above. All files are securely saved in Supabase Storage.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredAssets.map((asset) => {
              const isSelected =
                selectedAsset?.id === asset.id || currentSelectedUrl === asset.url;

              return (
                <div
                  key={asset.id}
                  onClick={() => handleSelectAsset(asset)}
                  className={`group relative rounded-xl border bg-white overflow-hidden transition-all flex flex-col justify-between cursor-pointer select-none ${
                    isSelected
                      ? "ring-3 ring-[#b00f23] border-[#b00f23] shadow-md shadow-[#b00f23]/10"
                      : "border-neutral-200 hover:border-neutral-300 hover:shadow-md"
                  }`}
                >
                  {/* Selected check badge */}
                  {isSelected && (
                    <div className="absolute top-2 left-2 z-10 bg-[#b00f23] text-white p-1 rounded-full shadow-sm">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteAsset(asset, e)}
                    className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-white/90 hover:bg-red-50 text-neutral-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xs cursor-pointer"
                    title="Delete image from storage"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  {/* Thumbnail Image */}
                  <div className="aspect-square relative bg-neutral-100 overflow-hidden">
                    <Image
                      src={asset.url}
                      alt={asset.filename}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  </div>

                  {/* Filename and size info */}
                  <div className="p-2.5 bg-white border-t border-neutral-100">
                    <p
                      className="text-xs font-medium text-neutral-800 truncate"
                      title={asset.filename}
                    >
                      {asset.filename}
                    </p>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-neutral-400">
                      <span>
                        {asset.size_bytes
                          ? `${Math.round(asset.size_bytes / 1024)} KB`
                          : "Image"}
                      </span>
                      <span className="uppercase">{asset.mime_type.split("/")[1] || "IMG"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Bar: Selected Image Details, Copy URL & Insert */}
      <div className="bg-white border-t border-neutral-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {selectedAsset || currentSelectedUrl ? (
          <div className="flex items-center gap-3 w-full sm:w-auto flex-1 min-w-0">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50 shrink-0">
              <Image
                src={selectedAsset?.url || currentSelectedUrl}
                alt="Selected preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Public CDN URL:
                </span>
                {copied && (
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Copied!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  readOnly
                  value={selectedAsset?.url || currentSelectedUrl}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full text-xs font-mono text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 select-all focus:outline-none focus:border-[#0B2A4A]"
                />
                <button
                  type="button"
                  onClick={() => handleCopyUrl(selectedAsset?.url || currentSelectedUrl)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-medium text-neutral-700 hover:text-[#0B2A4A] transition-colors shrink-0 cursor-pointer"
                  title="Copy full public URL"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-neutral-500" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
                <a
                  href={selectedAsset?.url || currentSelectedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-500 hover:text-[#0B2A4A] transition-colors shrink-0"
                  title="Open image in new tab"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-neutral-400 font-light italic">
            Select an image above to copy its public CDN URL or insert into card.
          </div>
        )}

        {/* Modal Insert Action */}
        {isModal && onSelectImage && (
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              disabled={!currentSelectedUrl}
              onClick={() => {
                if (currentSelectedUrl) {
                  onSelectImage(currentSelectedUrl);
                  if (onClose) onClose();
                }
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#b00f23] hover:bg-[#960d1e] text-xs font-semibold text-white tracking-wide transition-all shadow-[0_4px_12px_rgba(176,15,35,0.25)] hover:shadow-[0_6px_16px_rgba(176,15,35,0.4)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Select &amp; Insert Image</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
