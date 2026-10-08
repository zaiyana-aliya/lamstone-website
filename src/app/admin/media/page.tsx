"use client";

import React from "react";
import MediaLibraryView from "@/components/admin/MediaLibraryView";

export default function MediaAdminPage() {
  return (
    <div className="space-y-6">
      {/* Page Title & Intro */}
      <div>
        <h1 className="font-serif text-3xl font-semibold text-[#0B2A4A] tracking-tight">
          Media Library &amp; Assets
        </h1>
        <p className="text-sm text-neutral-500 font-light mt-1">
          Visual asset management powered by Supabase Storage. Organize, upload, preview, and select photos across all website sections.
        </p>
      </div>

      {/* Main Tabbed Media Library View */}
      <div className="h-[750px] max-h-[82vh] w-full flex">
        <MediaLibraryView isModal={false} initialFolder="home-cards" />
      </div>
    </div>
  );
}
