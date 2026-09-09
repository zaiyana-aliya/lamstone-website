import type { Metadata } from "next";
import Image from "next/image";
import CTAButton from "@/components/CTAButton";
import MotionReveal from "@/components/MotionReveal";
import LameNotifySection from "@/components/LameNotifySection";
import { ShieldCheck, Heart, ExternalLink, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Lamé — Haute Dermocosmetics & Skincare",
  description:
    "Born from pharmaceutical expertise, Lamé bridges clinical efficacy and luxurious self-care with rigorously formulated skincare and fragrances.",
};

interface LameProduct {
  category: string;
  name: string;
  detail?: string;
  highlights: string[];
  imageUrl: string;
  imageAlt: string;
  isLive: boolean;
  storeUrl?: string;
}

const SIGNATURE_PRODUCTS: LameProduct[] = [
  {
    category: "Cleanser",
    name: "2% Salicylic Acid Gel Cleanser",
    highlights: ["Exfoliate dead skin", "Prevent acne formation"],
    imageUrl: "/images/products/facewash.jpeg",
    imageAlt: "Lamé 2% Salicylic Acid Gel Cleanser",
    isLive: false,
  },
  {
    category: "Body Care",
    name: "Derma Polish Body Scrub",
    highlights: ["Gentle Exfoliation & Pollution Removal", "For Smooth, Refreshed skin"],
    imageUrl: "/images/products/scrub.jpeg",
    imageAlt: "Lamé Derma Polish Body Scrub",
    isLive: false,
  },
  {
    category: "Fragrance",
    name: "Sugar DAYS Eau de Parfum",
    detail: "100ml Luxury Eau de Parfum",
    highlights: ["Long-lasting sensorial profile", "Artisanal fine fragrance blend"],
    imageUrl: "/images/products/sugardays.jpeg",
    imageAlt: "Lamé Sugar DAYS Eau de Parfum",
    isLive: false,
  },
  {
    category: "Moisturizer",
    name: "DermaBarrier Gel Moisturizer",
    detail: "Oil-Free Ceramides + Hyaluronic Acid",
    highlights: ["Barrier Repair & Deep Hydration", "Non-comedogenic clinical hydration"],
    imageUrl: "/images/products/moisturizer.jpeg",
    imageAlt: "Lamé DermaBarrier Gel Moisturizer",
    isLive: false,
  },
];

export default function LamePage() {
  return (
    <div className="flex flex-col w-full bg-lame-bg text-lame-charcoal selection:bg-lame-rose/30 selection:text-lame-charcoal">
      {/* 1. Luxury Hero — Full cinematic, blush-tinted */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center px-6 sm:px-8 lg:px-16">
        {/* Ken Burns Hero Image */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/lame/lameimage.png"
            alt="Lamé haute dermocosmetics brand showcase"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center animate-ken-burns opacity-30"
          />
          {/* Gradient: left-heavy for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-lame-bg via-lame-bg/90 to-lame-bg/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-lame-bg via-transparent to-transparent" />
        </div>

        {/* Ambient Blurred Rose Blob */}
        <div
          className="pointer-events-none absolute right-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-lame-rose/20 blur-3xl"
          aria-hidden="true"
        />

        {/* Foreground Content */}
        <div className="relative z-10 mx-auto max-w-7xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 space-y-8">
              <MotionReveal delay={100} direction="up">
                <div className="flex items-center gap-4">
                  <span className="h-[1.5px] w-12 bg-lame-rose" />
                  <span className="text-xs uppercase tracking-[0.35em] font-semibold text-lame-rose-dark">
                    Haute Dermocosmetics
                  </span>
                </div>
              </MotionReveal>
              <MotionReveal delay={250} direction="up">
                <div>
                  <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light tracking-wider text-lame-charcoal leading-[1.06]">
                    Lamé
                  </h1>
                  <h2 className="font-serif text-2xl sm:text-3xl text-lame-rose-dark font-normal mt-2">
                    Born from Expertise
                  </h2>
                </div>
              </MotionReveal>
              <MotionReveal delay={380} direction="up">
                <p className="text-base sm:text-lg text-neutral-700 font-light leading-relaxed">
                  Lamé is not just another cosmetic brand; it is the culmination of years of pharmaceutical expertise and a deep understanding of dermatological science. Created by Lamstone, Lamé bridges the gap between clinical efficacy and luxurious self-care.
                </p>
              </MotionReveal>
              <MotionReveal delay={460} direction="up">
                <p className="text-base sm:text-lg text-neutral-600 font-light leading-relaxed">
                  Every product in the Lamé lineup is rigorously formulated, tested, and refined to ensure it meets the highest standards of safety and visible results. We believe that true beauty is synonymous with health.
                </p>
              </MotionReveal>
              <MotionReveal delay={540} direction="up">
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-lame-border bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-lame-charcoal shadow-2xs">
                    <Heart className="h-4 w-4 text-lame-rose-dark" />
                    <span>Cruelty Free</span>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-lame-border bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-lame-charcoal shadow-2xs">
                    <ShieldCheck className="h-4 w-4 text-lame-rose-dark" />
                    <span>Clinically Tested</span>
                  </div>
                </div>
              </MotionReveal>
              <MotionReveal delay={620} direction="up">
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <CTAButton href="#collection" variant="lame" size="lg">
                    Explore Signature Collection
                  </CTAButton>
                  <a
                    href="https://mylamstone.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-lame-charcoal hover:text-lame-rose-dark px-5 py-3 rounded-lg border border-lame-rose/40 bg-white/70 hover:bg-white hover:scale-[1.02] transition-all duration-300"
                  >
                    <span>Shop Online</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </MotionReveal>
            </div>

            {/* Hero Side Image — "Born from Expertise" live site visual */}
            <MotionReveal className="lg:col-span-5" delay={150} direction="left">
              <div className="overflow-hidden rounded-2xl lame-floating-shadow aspect-4/5 relative group border border-lame-border/60 bg-white">
                <Image
                  src="/images/lame/lam3.jpeg"
                  alt="Lamé clinical expertise and formulation excellence"
                  fill
                  className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-lame-charcoal/20 via-transparent to-transparent" />
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* 2. Signature Collection — Maximum luxury spacing & floating cards */}
      <section
        id="collection"
        className="border-t border-lame-border/60 bg-lame-cream py-32 sm:py-44 px-6 sm:px-8 lg:px-16 scroll-mt-24"
      >
        <div className="mx-auto max-w-7xl space-y-20">
          <MotionReveal direction="up">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-lame-rose" />
                <span className="text-xs uppercase tracking-[0.25em] font-medium text-lame-rose-dark">
                  Formulated For Efficacy
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-lame-charcoal tracking-tight">
                Signature Collection
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 font-light leading-relaxed">
                Carefully curated active ingredients designed to replenish, refine, and harmonize skin health.
              </p>
            </div>
          </MotionReveal>

          {/* 4 Product Cards — extra breathing room, floating shadow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {SIGNATURE_PRODUCTS.map((product, idx) => (
              <MotionReveal key={idx} delay={idx * 150} direction="up">
                <div className="group flex flex-col justify-between rounded-2xl border border-lame-border/60 bg-white p-7 sm:p-9 lame-floating-shadow hover:scale-[1.03] hover:-translate-y-2.5 transition-all duration-500 ease-out">
                  <div className="space-y-6">
                    {/* Product Image — larger, floating shadow effect */}
                    <div className="overflow-hidden rounded-2xl lame-floating-shadow aspect-square relative group/img bg-lame-bg/50">
                      <Image
                        src={product.imageUrl}
                        alt={product.imageAlt}
                        fill
                        className="object-cover object-center group-hover:scale-[1.06] transition-transform duration-700 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-lame-charcoal/10 via-transparent to-transparent" />
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-lame-rose-dark block">
                        {product.category}
                      </span>
                      <h3 className="font-serif text-xl font-medium text-lame-charcoal mt-1 leading-snug">
                        {product.name}
                      </h3>
                      {product.detail && (
                        <p className="text-xs text-neutral-500 font-light mt-1">{product.detail}</p>
                      )}
                    </div>

                    <ul className="space-y-2.5 border-t border-lame-border/60 pt-4 text-xs text-neutral-600 font-light">
                      {product.highlights.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-lame-rose mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-7 mt-6 border-t border-lame-border/50 flex flex-col items-center gap-2">
                    {product.isLive && product.storeUrl ? (
                      <a
                        href={product.storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-lame-rose text-white hover:bg-lame-rose-dark transition-all shadow-xs"
                      >
                        <span>Shop Now</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <>
                        <button
                          type="button"
                          disabled
                          aria-disabled="true"
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-neutral-100/90 text-neutral-400 border border-neutral-200/80 cursor-not-allowed select-none flex items-center justify-center gap-2 transition-all shadow-none"
                        >
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Coming Soon</span>
                        </button>
                        <a
                          href="#notify"
                          className="text-[11px] text-lame-rose-dark hover:text-lame-charcoal font-medium transition-colors hover:underline pt-0.5"
                        >
                          Notify me on launch &rarr;
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>

          {/* Launch Notification Form */}
          <LameNotifySection />
        </div>
      </section>

      {/* 3. Closing Quote */}
      <section className="bg-white py-24 px-6 sm:px-8 lg:px-16 text-center border-t border-lame-border/60">
        <div className="mx-auto max-w-3xl space-y-6">
          <MotionReveal direction="up">
            <p className="font-serif text-2xl sm:text-3xl text-lame-charcoal font-light italic">
              &ldquo;True beauty is synonymous with health.&rdquo;
            </p>
            <div className="pt-6">
              <CTAButton href="/contact" variant="lame" size="md">
                Inquire About Lamé Retail Partnerships
              </CTAButton>
            </div>
          </MotionReveal>
        </div>
      </section>
    </div>
  );
}
