import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lamstone Healthcare | Pharmacy, Cosmetics & Perfumes",
    template: "%s | Lamstone Healthcare",
  },
  description:
    "Lamstone Healthcare — Advancing clinical innovation, state-of-the-art pharmacy chains, premium cosmetics, and haute perfumery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${cormorant.variable} ${manrope.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800;1,900&display=swap"
        />
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/devil-breeze" />
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/bimbo" />
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/poppins" />
      </head>
      <body className="min-h-full flex flex-col bg-offwhite text-charcoal selection:bg-gold/20 selection:text-primary">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
