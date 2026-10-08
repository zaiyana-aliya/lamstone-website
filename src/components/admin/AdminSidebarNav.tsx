"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Inbox,
  MapPin,
  Handshake,
  Grid,
  Sparkles,
  Sliders,
  Layers,
  LayoutTemplate,
  Megaphone,
  Briefcase,
  FileText,
  Image as ImageIcon,
  BookOpen,
  ShieldCheck,
  Milestone,
  Pill,
  ChevronRight,
  LucideIcon,
  TrendingUp,
  Building2,
  Users,
  Mail,
  PanelBottom,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

const NAV_GROUPS: { groupName?: string; items: NavItem[] }[] = [
  {
    groupName: "Overview & Inquiries",
    items: [
      { href: "/admin/submissions", label: "Submissions", icon: Inbox },
      { href: "/admin/pharmacy", label: "Pharmacy Locations", icon: MapPin },
    ],
  },
  {
    groupName: "Catalog & Brands",
    items: [
      { href: "/admin/partners", label: "Brand Partners", icon: Handshake },
      { href: "/admin/categories", label: "Product Categories", icon: Grid },
      { href: "/admin/lame-products", label: "Lamé Products", icon: Sparkles },
    ],
  },
  {
    groupName: "Page Content",
    items: [
      { href: "/admin/hero-slides", label: "Home Hero Slides", icon: Sliders },
      { href: "/admin/division-cards", label: "Home Division Cards", icon: Layers },
      { href: "/admin/core-divisions", label: "Core Divisions", icon: LayoutTemplate },
      { href: "/admin/home-promo-sections", label: "Home Promo Sections", icon: Megaphone },
      { href: "/admin/pharmacy-page", label: "Pharmacy Page — Content", icon: Pill },
      { href: "/admin/cosmetics-page", label: "Cosmetics Page — Content", icon: Sparkles },
      { href: "/admin/lame-page", label: "Lamé Page — Content", icon: Sparkles },
      { href: "/admin/about-page", label: "About Page — Core Sections", icon: BookOpen },
      { href: "/admin/about-values", label: "About Values", icon: ShieldCheck },
      { href: "/admin/about-milestones", label: "About Milestones", icon: Milestone },
      { href: "/admin/invest-page", label: "Invest Page — Content", icon: TrendingUp },
      { href: "/admin/investment-opportunities", label: "Investment Opportunities", icon: Building2 },
      { href: "/admin/careers-page", label: "Careers Page — Content", icon: Briefcase },
      { href: "/admin/careers-culture-values", label: "Careers Culture Values", icon: Users },
      { href: "/admin/contact-page", label: "Contact Page — Content", icon: Mail },
      { href: "/admin/contact-offices", label: "Contact Offices", icon: Building2 },
      { href: "/admin/blog-page", label: "Blogs Page — Content", icon: BookOpen },
      { href: "/admin/footer-content", label: "Footer Content", icon: PanelBottom },
      { href: "/admin/page-content", label: "Page Content (Global)", icon: LayoutTemplate },
    ],
  },
  {
    groupName: "Content & Publishing",
    items: [
      { href: "/admin/jobs", label: "Job Postings", icon: Briefcase },
      { href: "/admin/blog", label: "Blog Posts", icon: FileText },
      { href: "/admin/media", label: "Media Library", icon: ImageIcon },
    ],
  },
];

export default function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto custom-scrollbar">
      {NAV_GROUPS.map((group, groupIdx) => (
        <div key={groupIdx} className="space-y-1">
          {group.groupName && (
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/40 select-none">
              {group.groupName}
            </div>
          )}

          <div className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-white/[0.12] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] font-semibold"
                      : "text-white/70 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {/* Left Active Glow Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 rounded-r-full bg-[#E2C785] shadow-[0_0_8px_rgba(226,199,133,0.6)]" />
                  )}

                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        isActive
                          ? "bg-[#E2C785] text-[#0B2A4A] shadow-xs"
                          : "bg-white/[0.06] text-white/70 group-hover:bg-white/10 group-hover:text-white"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="truncate tracking-tight">{item.label}</span>
                  </div>

                  {/* Right Indicator: Chevron for active item or hover */}
                  <ChevronRight
                    className={`h-3 w-3 transition-transform duration-150 shrink-0 ${
                      isActive
                        ? "text-[#E2C785] translate-x-0 opacity-100"
                        : "text-white/20 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
