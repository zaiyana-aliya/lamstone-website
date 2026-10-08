"use client";

import React, { useState } from "react";
import FormModal from "@/components/modals/FormModal";
import { ArrowRight } from "lucide-react";

export function RequestDeckButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative inline-flex items-center justify-center gap-2.5 rounded-full bg-[image:var(--btn-solid-gradient)] text-white px-7 py-3.5 text-xs sm:text-sm font-medium tracking-wide shadow-[0_6px_22px_var(--shadow-color)] hover:shadow-[0_14px_32px_var(--shadow-color)] hover:brightness-[1.08] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 cursor-pointer overflow-hidden"
      >
        <span
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-22deg] transition-transform duration-700 ease-out group-hover:translate-x-full"
          aria-hidden="true"
        />
        <span className="relative z-10">Request Investment Deck</span>
        <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
      </button>

      <FormModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Request Investment Deck"
        subtitle="Receive our comprehensive investor deck and company financial performance prospectus."
        badge="Investor Relations"
        apiEndpoint="/api/invest"
        extraPayload={{ request_type: "deck" }}
        fields={[
          { name: "name", label: "Full Name", required: true, placeholder: "Your full name" },
          { name: "email", label: "Corporate / Personal Email", type: "email", required: true, placeholder: "you@email.com" },
          { name: "phone", label: "Phone Number", type: "tel", required: true, placeholder: "+91 XXXXX XXXXX" },
          {
            name: "message",
            label: "Investment Profile / Background",
            required: true,
            rows: 3,
            placeholder: "Please outline your investment focus or questions for our investor relations team…",
          },
        ]}
        successMessage="Your investment deck request has been dispatched to our Investor Relations desk. You will receive the document within 24 hours."
      />
    </>
  );
}

export function RequestMemorandumButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[image:var(--btn-solid-gradient)] text-white px-8 py-4 text-sm sm:text-base font-semibold tracking-wide shadow-[0_6px_22px_var(--shadow-color)] hover:shadow-[0_12px_28px_var(--shadow-color)] hover:brightness-[1.08] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
      >
        <span>Request Information Memorandum</span>
      </button>

      <FormModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Information Memorandum"
        subtitle="Request the detailed Information Memorandum covering corporate governance, asset holdings, and projected unit economics."
        badge="Confidential Prospectus"
        apiEndpoint="/api/invest"
        extraPayload={{ request_type: "memorandum" }}
        fields={[
          { name: "name", label: "Full Name", required: true, placeholder: "Your full name" },
          { name: "email", label: "Email Address", type: "email", required: true, placeholder: "you@email.com" },
          { name: "phone", label: "Phone Number", type: "tel", required: true, placeholder: "+91 XXXXX XXXXX" },
          {
            name: "message",
            label: "Entity / Entity Details",
            required: true,
            rows: 3,
            placeholder: "Family office, institutional, or private high-net-worth investor profile…",
          },
        ]}
        successMessage="Thank you. Our investor relations director will review your request and dispatch the Information Memorandum under NDA."
      />
    </>
  );
}

export function RequestPartnershipDetailsButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[image:var(--btn-solid-gradient)] text-white px-6 py-3 text-sm font-semibold tracking-wide shadow-[0_4px_16px_var(--shadow-color)] hover:shadow-[0_8px_24px_var(--shadow-color)] hover:brightness-[1.08] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
      >
        <span>Request Partnership Details</span>
      </button>

      <FormModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Partnership Details"
        subtitle="Connect regarding structured co-investment, retail acquisition, or co-branding."
        badge="Strategic Partnership"
        apiEndpoint="/api/invest"
        extraPayload={{ request_type: "opportunity_inquiry", opportunity_name: "Strategic Partnership Details" }}
        fields={[
          { name: "name", label: "Full Name", required: true, placeholder: "Your full name" },
          { name: "email", label: "Email Address", type: "email", required: true, placeholder: "you@email.com" },
          { name: "phone", label: "Phone Number", type: "tel", required: true, placeholder: "+91 XXXXX XXXXX" },
          {
            name: "message",
            label: "Partnership Objectives",
            required: true,
            rows: 3,
            placeholder: "Describe the nature of partnership you are interested in exploring…",
          },
        ]}
        successMessage="Thank you. Our corporate strategy team will contact you shortly with the partnership prospectus."
      />
    </>
  );
}
