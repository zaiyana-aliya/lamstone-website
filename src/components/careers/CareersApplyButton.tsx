"use client";

import React, { useState } from "react";
import { Mail } from "lucide-react";
import CareersModal from "@/components/modals/CareersModal";

export default function CareersApplyButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[image:var(--btn-solid-gradient)] text-white px-7 py-3.5 text-sm font-semibold tracking-wide shadow-[0_4px_16px_var(--shadow-color)] hover:shadow-[0_10px_26px_var(--shadow-color)] hover:brightness-[1.08] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
      >
        <Mail className="h-4 w-4 mr-1.5" />
        <span>Send Resume / Connect</span>
      </button>

      <CareersModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
