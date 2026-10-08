import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ArrowLeft, Calendar, User, BookOpen } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerSupabaseClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!post) return { title: "Article Not Found — Lamstone HealthCare" };

  return {
    title: `${post.title} — Lamstone HealthCare`,
    description: post.excerpt || "Editorial article from Lamstone HealthCare.",
  };
}

// Simple JSON to text/html renderer for Tiptap documents
function renderTiptapContent(node: any): string {
  if (!node) return "";
  if (typeof node === "string") return node;

  if (node.type === "text") {
    let text = node.text || "";
    if (node.marks) {
      for (const mark of node.marks) {
        if (mark.type === "bold") text = `<strong>${text}</strong>`;
        if (mark.type === "italic") text = `<em>${text}</em>`;
      }
    }
    return text;
  }

  const childrenHtml = (node.content || []).map(renderTiptapContent).join("");

  switch (node.type) {
    case "paragraph":
      return `<p class="mb-5 leading-relaxed text-[var(--body)] font-light text-base sm:text-lg">${childrenHtml}</p>`;
    case "heading":
      const level = node.attrs?.level || 2;
      return `<h${level} class="font-serif font-semibold text-[var(--heading)] mt-8 mb-4 text-2xl sm:text-3xl">${childrenHtml}</h${level}>`;
    case "bulletList":
      return `<ul class="list-disc list-inside space-y-2 mb-6 text-[var(--body)]">${childrenHtml}</ul>`;
    case "orderedList":
      return `<ol class="list-decimal list-inside space-y-2 mb-6 text-[var(--body)]">${childrenHtml}</ol>`;
    case "listItem":
      return `<li class="leading-relaxed">${childrenHtml}</li>`;
    case "blockquote":
      return `<blockquote class="border-l-4 border-[var(--accent)] pl-4 py-1 italic my-6 text-[var(--body)] bg-[var(--surface)] rounded-r-xl">${childrenHtml}</blockquote>`;
    default:
      return childrenHtml;
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createServerSupabaseClient();
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !post) {
    notFound();
  }

  const contentHtml = post.content ? renderTiptapContent(post.content) : "";

  return (
    <article data-theme="blogs" className="min-h-screen bg-[var(--bg)] text-[var(--body)]">
      {/* Header Container */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)] pt-16 pb-12 sm:pt-20 sm:pb-16">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--heading)] hover:text-[var(--accent-text)] mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Publications</span>
          </Link>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[var(--accent-text)]">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Editorial Insight</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[var(--heading)] tracking-tight leading-[1.15]">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-base sm:text-lg text-[var(--body)] font-light leading-relaxed pt-2">
                {post.excerpt}
              </p>
            )}

            <div className="pt-4 flex items-center gap-4 text-xs text-[var(--body)]/70 border-t border-[var(--border)]">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[var(--accent)]" />
                <span className="text-[var(--heading)] font-medium">Lamstone Editorial Team</span>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[var(--body)]/70" />
                <span>
                  {new Date(post.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Cover Image */}
      {post.cover_image_url && (
        <div className="mx-auto max-w-4xl px-6 sm:px-8 -mt-6">
          <div className="relative aspect-16/9 rounded-3xl overflow-hidden shadow-xl border border-[var(--border)] bg-[var(--surface)]">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Main Article Body */}
      <div className="mx-auto max-w-3xl px-6 sm:px-8 py-16 sm:py-20">
        <div
          className="prose prose-neutral max-w-none text-[var(--body)]"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Back Link */}
        <div className="mt-16 pt-8 border-t border-[var(--border)]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-text)] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Read more articles from Lamstone HealthCare</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
