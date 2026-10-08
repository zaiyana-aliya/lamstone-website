export interface MediaFolderConfig {
  id: string;
  name: string;
  folder: string;
  description: string;
}

export const MEDIA_FOLDERS: MediaFolderConfig[] = [
  {
    id: "home-cards",
    name: "Home Cards",
    folder: "home-cards",
    description: "Core division cards, promotional banners, and homepage assets",
  },
  {
    id: "home-slides",
    name: "Hero Slides",
    folder: "home-slides",
    description: "Cinematic full-width homepage hero carousel slide backgrounds",
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    folder: "pharmacy",
    description: "Pharmacy chain hero banner, storefront photos, and dispensary imagery",
  },
  {
    id: "pharmacy-partners",
    name: "Pharma Partners",
    folder: "pharmacy-partners",
    description: "Pharmaceutical supplier & healthcare brand partner logos (30+ brands)",
  },
  {
    id: "cosmetics",
    name: "Cosmetics",
    folder: "cosmetics",
    description: "Cosmetics division hero banner, product staging, and retail visuals",
  },
  {
    id: "cosmetics-brands",
    name: "Cosmetics Brands",
    folder: "cosmetics-brands",
    description: "Multi-brand cosmetic & skincare portfolio logos (Sebamed, Jovees, Lotus, etc.)",
  },
  {
    id: "cosmetics-categories",
    name: "Categories",
    folder: "cosmetics-categories",
    description: "Product category showcase photography for Cosmetics and Pharmacy",
  },
  {
    id: "lame",
    name: "Lamé",
    folder: "lame",
    description: "Signature dermocosmetics hero banners, editorial visuals, and brand assets",
  },
  {
    id: "lame-products",
    name: "Lamé Products",
    folder: "lame-products",
    description: "Signature Collection bottles, luxury formulations, and packaging photography",
  },
  {
    id: "about",
    name: "About Us",
    folder: "about",
    description: "Corporate history, story section, modern campus infrastructure, and executive leadership",
  },
  {
    id: "careers",
    name: "Careers",
    folder: "careers",
    description: "Careers hero, workplace culture, team environment, and recruitment imagery",
  },
  {
    id: "blogs",
    name: "Blogs",
    folder: "blogs",
    description: "Editorial hero banners and individual article featured cover photos",
  },
  {
    id: "invest",
    name: "Invest",
    folder: "invest",
    description: "Investment opportunity cards, transparent growth model, and corporate skyline visuals",
  },
  {
    id: "contact",
    name: "Contact",
    folder: "contact",
    description: "Contact hero photography, happiness center, and regional office locations",
  },
];

export type MediaFolderId =
  | "home-cards"
  | "home-slides"
  | "pharmacy"
  | "pharmacy-partners"
  | "cosmetics"
  | "cosmetics-brands"
  | "cosmetics-categories"
  | "lame"
  | "lame-products"
  | "about"
  | "careers"
  | "blogs"
  | "invest"
  | "contact";
