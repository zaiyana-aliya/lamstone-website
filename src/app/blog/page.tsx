import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import MotionReveal from "@/components/MotionReveal";
import BlogHeroSection from "@/components/blog/BlogHeroSection";
import { BookOpen } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Blogs & Perspectives — Lamstone HealthCare",
  description:
    "Insights, healthcare innovations, dermatological breakthroughs, and company perspectives from Lamstone HealthCare.",
};

export const revalidate = 60;

export default async function BlogPage() {
  let posts: any[] = [];
  try {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, cover_image_url, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });
    posts = data ?? [];
  } catch {
    posts = [];
  }

  return (
    <div data-theme="blogs" className="flex flex-col w-full bg-[#F1E2CC] text-[var(--body)] selection:bg-[#0F2A4A]/10 selection:text-[#0F2A4A]">
      {/* 1. Dynamic Blogs & Perspectives Hero (Warm Sand #F1E2CC) */}
      <BlogHeroSection />

      {/* 2. Solid Red Editorial Band (Solid Red #B31942, matching About's "Vision & Mission") */}
      <section className="relative w-full bg-[#B31942] py-20 sm:py-24 lg:py-28 border-y border-[#0F2A4A]/10 text-center select-none">
        <div className="relative z-10 mx-auto max-w-5xl w-full px-6 sm:px-8 lg:px-12 space-y-4 sm:space-y-5">
          <MotionReveal direction="up">
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-center justify-center gap-2.5 sm:gap-3">
                <span className="h-[1px] w-6 sm:w-10 bg-[#F0D9A0]/70" />
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-semibold text-white/90 font-sans">
                  Clinical Knowledge
                </span>
                <span className="h-[1px] w-6 sm:w-10 bg-[#F0D9A0]/70" />
              </div>

              <div className="space-y-3">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-[44px] font-bold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
                  Thought Leadership &amp; Medical Innovation — Perspectives from Industry Experts
                </h2>
                {/* Short gold line under the heading */}
                <div className="mx-auto w-24 sm:w-32 h-[2px] rounded-full bg-[#F0D9A0]" />
              </div>

              <p className="text-sm sm:text-base text-white/90 font-sans leading-[1.7] max-w-2xl mx-auto pt-1">
                Critical analyses and clinical updates shaping contemporary pharmacy practice and dermatological health.
              </p>
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* 3. Published Articles Grid vs. Clean Coming Soon State (Light Blue Tint #EAEFF5 matching About's "Our Story") */}
      {posts.length > 0 ? (
        <section id="articles" className="py-20 sm:py-28 bg-[#EAEFF5] border-b border-[#0F2A4A]/10 scroll-mt-24">
          <div className="mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-12 space-y-12">
            <MotionReveal direction="up">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="h-[1px] w-8 bg-[#B8934A]/50" />
                  <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-bold text-[#B8934A] font-sans">
                    Latest Publications
                  </span>
                  <span className="h-[1px] w-8 bg-[#B8934A]/50" />
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F2A4A] tracking-tight">
                  Recent Insights &amp; Clinical Articles
                </h2>
                <div className="flex items-center gap-1.5 mt-2" aria-hidden="true">
                  <span className="w-14 h-[1.5px] bg-[#B8934A]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8934A]" />
                </div>
              </div>
            </MotionReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {posts.map((post, idx) => (
                <MotionReveal key={post.id} delay={idx * 100} direction="up" className="h-full flex flex-col">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col justify-between rounded-2xl border border-[#0F2A4A]/10 border-t-2 border-t-[#B8934A] bg-white overflow-hidden shadow-[0_4px_20px_-4px_rgba(15,42,74,0.08)] hover:shadow-[0_16px_36px_-8px_rgba(15,42,74,0.16)] hover:border-[#B8934A]/50 hover:-translate-y-1 transition-all duration-300 h-full"
                  >
                    {post.cover_image_url && (
                      <div className="aspect-16/10 relative overflow-hidden bg-neutral-100">
                        <Image
                          src={post.cover_image_url}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6 sm:p-7 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[11px] text-[#B8934A] uppercase tracking-wider font-semibold">
                          Editorial
                        </span>
                        <h3 className="font-serif text-xl font-bold text-[#0F2A4A] group-hover:text-[#B8934A] transition-colors leading-snug">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-sm text-[#243E5E] font-normal leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-[#0F2A4A]/10 flex items-center justify-between text-xs text-[#243E5E]/70">
                        <span>
                          {new Date(post.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="font-semibold text-[#0F2A4A] group-hover:text-[#B8934A] inline-flex items-center gap-1">
                          Read Article →
                        </span>
                      </div>
                    </div>
                  </Link>
                </MotionReveal>
              ))}
            </div>
          </div>
        </section>
      ) : (
        /* Clean Coming Soon State (Light Blue Tint #EAEFF5 matching About's "Our Story") */
        <section id="articles" className="bg-[#EAEFF5] py-20 sm:py-28 border-b border-[#0F2A4A]/10 scroll-mt-24">
          <div className="mx-auto max-w-4xl w-full px-6 sm:px-8 lg:px-12">
            <MotionReveal delay={100} direction="up">
              <div className="relative overflow-hidden rounded-3xl border border-[#0F2A4A]/10 bg-white p-8 sm:p-12 lg:p-16 shadow-[0_12px_36px_-6px_rgba(15,42,74,0.08)] text-center">
                {/* Thin Gold Top Border */}
                <div className="absolute top-0 inset-x-0 h-[3px] bg-[#B8934A]" />

                {/* Book icon in a navy circular badge with a gold icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0F2A4A] shadow-[0_4px_16px_rgba(15,42,74,0.18)] ring-4 ring-[#B8934A]/20">
                  <BookOpen className="h-8 w-8 text-[#B8934A]" />
                </div>

                {/* "COMING SOON" eyebrow in gold */}
                <div className="mt-6 flex items-center justify-center gap-2.5">
                  <span className="h-[1px] w-6 sm:w-8 bg-[#B8934A]/50" />
                  <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-bold text-[#B8934A] font-sans">
                    Editorial Publications
                  </span>
                  <span className="h-[1px] w-6 sm:w-8 bg-[#B8934A]/50" />
                </div>

                {/* Main Heading in navy serif */}
                <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F2A4A] tracking-tight">
                  Healthcare Insights & Research Publications
                </h2>

                {/* Thin gold hairline with dot */}
                <div className="flex items-center justify-center gap-1.5 mt-3 mb-1" aria-hidden="true">
                  <span className="w-14 h-[1.5px] bg-[#B8934A]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8934A]" />
                </div>

                {/* Paragraph in muted navy */}
                <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-[#243E5E] font-normal leading-relaxed">
                  Our clinicians and pharmacologists regularly publish research-backed perspectives on modern medicine, dermatological science, wellness, and clinical innovation.
                </p>
              </div>
            </MotionReveal>
          </div>
        </section>
      )}
    </div>
  );
}
