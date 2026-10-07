import type { Metadata } from "next";
import Image from "next/image";
import CTAButton from "@/components/CTAButton";
import HeroBanner from "@/components/HeroBanner";
import MotionReveal from "@/components/MotionReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import { TrendingUp, ShieldCheck, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Invest in Lamstone — Healthcare Investment Opportunities",
  description:
    "Join our rapidly expanding pharmacy chain and beauty ecosystem. Transparent, secure, and lucrative investment partnership models for forward-thinking investors.",
};

const VALUE_PROPS = [
  {
    Icon: TrendingUp,
    title: "Proven Growth Trajectory",
    description:
      "Lamstone is aggressively expanding through a strategic pharmacy acquisition plan, with each integrated pharmacy representing an existing revenue-generating asset.",
  },
  {
    Icon: ShieldCheck,
    title: "Recession-Resistant Industry",
    description:
      "Healthcare is a fundamental, non-discretionary market. The pharmacy sector remains resilient across economic cycles, providing stable, long-term returns.",
  },
  {
    Icon: Users,
    title: "Expert Management &amp; Operations",
    description:
      "Our team combines deep pharmaceutical knowledge with modern retail management, brand building, and supply chain optimization expertise.",
  },
];

export default function InvestPage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Cinematic Hero — Abstract Growth Architecture Visual */}
      <HeroBanner
        eyebrow="Partnership Opportunities"
        title="Invest in Lamstone"
        description="Join our rapidly expanding pharmacy chain and beauty ecosystem. We offer transparent, secure, and lucrative partnership models for forward-thinking investors."
        imageUrl="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=85"
        imageAlt="Modern upward architectural geometric perspective representing sustainable corporate growth"
        theme="green"
        heightClassName="min-h-[75vh]"
      >
        <CTAButton href="/contact" variant="primary" size="lg">
          Request Investment Deck
        </CTAButton>
        <CTAButton href="#why-invest" variant="outline" size="lg">
          Why Lamstone
        </CTAButton>
      </HeroBanner>

      {/* 2. Investment Stats */}
      <section className="bg-primary border-y border-white/10 py-12 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            {[
              { value: 500, suffix: "+", label: "Target Pharmacy Locations" },
              { value: 14, suffix: "", label: "Kerala Districts" },
              { value: 9, suffix: "+", label: "Premium Brand Partners" },
              { value: 100, suffix: "%", label: "Authentic Inventory" },
            ].map((stat, i) => (
              <MotionReveal key={i} delay={i * 120} direction="up">
                <div className="space-y-1.5">
                  <div className="font-serif text-4xl sm:text-5xl font-semibold text-gold">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-xs uppercase tracking-widest text-emerald-100/70 font-medium">
                    {stat.label}
                  </p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why Invest — Value Props with Small Icons */}
      <section id="why-invest" className="bg-white py-24 sm:py-32 px-6 sm:px-8 lg:px-12 scroll-mt-24">
        <div className="mx-auto max-w-7xl space-y-16">
          <MotionReveal direction="up">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold-dark uppercase tracking-wider">
                The Investment Case
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-primary tracking-tight">
                Why Invest in Lamstone?
              </h2>
              <p className="text-base sm:text-lg text-charcoal-muted font-light leading-relaxed">
                Healthcare retail is one of the most defensible, scalable industries in emerging markets — and Lamstone is positioned at its frontier.
              </p>
            </div>
          </MotionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUE_PROPS.map(({ Icon, title, description }, i) => (
              <MotionReveal key={i} delay={i * 140} direction="up">
                <div className="group flex flex-col justify-between rounded-2xl border border-border-subtle bg-ivory p-8 sm:p-10 shadow-xs hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300">
                  <div className="space-y-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-gold transition-all duration-300 shadow-2xs">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-medium text-primary">{title}</h3>
                    <p
                      className="text-sm sm:text-base text-charcoal-muted font-light leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Strategic Growth Model — Executive Architecture Space */}
      <section className="bg-cream py-20 sm:py-28 px-6 sm:px-8 lg:px-12 border-t border-border-subtle">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <MotionReveal delay={100} direction="right">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="h-px w-6 bg-gold" />
                  <span className="text-xs uppercase tracking-widest font-semibold text-gold-dark">
                    Partnership Model
                  </span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-medium text-primary tracking-tight">
                  Transparent &amp; Structured Investment Pathways
                </h2>
                <p className="text-base sm:text-lg text-charcoal-muted font-light leading-relaxed">
                  We believe that informed investors are long-term partners. Our investor relations team provides clear financial projections, regular reporting, and direct access to operations leadership.
                </p>
                <div className="space-y-3">
                  {["Strategic pharmacy acquisition", "Brand distribution equity", "Lamé co-branding opportunities"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-charcoal">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-dark shrink-0" />
                      <span className="font-light">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <CTAButton href="/contact" variant="primary">
                    Request Partnership Details
                  </CTAButton>
                </div>
              </div>
            </MotionReveal>

            <MotionReveal delay={80} direction="left">
              <div className="overflow-hidden rounded-2xl shadow-xl aspect-4/3 relative group">
                <Image
                  src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85"
                  alt="Modern architectural executive workspace and strategic boardroom"
                  fill
                  className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/15 via-transparent to-transparent rounded-2xl" />
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* 5. CTA Banner with Subtle Dot-Grid Texture */}
      <section className="relative bg-primary py-20 px-6 sm:px-8 lg:px-12 text-center overflow-hidden bg-dot-white">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/70 via-transparent to-primary/80" />
        <div
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[300px] w-[500px] rounded-full bg-gold/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-3xl space-y-6">
          <MotionReveal direction="up">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white">
              Ready to Grow With Lamstone?
            </h2>
            <p className="text-base text-emerald-100/70 font-light leading-relaxed mt-3">
              Connect with our investor relations team to explore partnership opportunities and access our detailed investment prospectus.
            </p>
            <div className="pt-4">
              <CTAButton href="/contact" variant="primary" size="lg">
                Schedule Investment Consultation
              </CTAButton>
            </div>
          </MotionReveal>
        </div>
      </section>
    </div>
  );
}
