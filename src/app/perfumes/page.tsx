import type { Metadata } from "next";
import PerfumesPageClient from "@/components/perfumes/PerfumesPageClient";

export const metadata: Metadata = {
  title: {
    absolute: "Lamé Perfumes | Lamstone Healthcare",
  },
  description:
    "Discover Lamé Haute Parfumerie by Lamstone Healthcare. Signature artisanal fragrances crafted with precious oud, amber, and rare florals. Now available.",
  keywords: [
    "Lamé Perfumes",
    "Lamstone Healthcare",
    "haute parfumerie",
    "fragrances",
    "oud perfume",
    "luxury perfumes UAE",
    "Kerala perfumes",
    "Barqat perfume",
    "artisanal fragrances",
  ],
  openGraph: {
    title: "Lamé Perfumes | Lamstone Healthcare",
    description:
      "Discover Lamé Haute Parfumerie by Lamstone Healthcare. Signature artisanal fragrances crafted with precious oud, amber, and rare florals. Now available.",
    url: "https://www.lamstonehealthcare.com/perfumes",
    siteName: "Lamstone Healthcare",
    images: [
      {
        url: "/images/perfumes/bottle.png",
        width: 864,
        height: 1468,
        alt: "Lamé Barqat Eau De Parfum Flacon",
      },
    ],
    locale: "en_AE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lamé Perfumes | Lamstone Healthcare",
    description:
      "Discover Lamé Haute Parfumerie by Lamstone Healthcare. Signature artisanal fragrances crafted with precious oud, amber, and rare florals. Now available.",
    images: ["/images/perfumes/bottle.png"],
  },
  alternates: {
    canonical: "https://www.lamstonehealthcare.com/perfumes",
  },
};

export default function PerfumesPage() {
  return <PerfumesPageClient />;
}
