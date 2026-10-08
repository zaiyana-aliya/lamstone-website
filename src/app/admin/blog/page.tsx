"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit3, Trash2, Eye, RefreshCw, FileText, CheckCircle2, XCircle } from "lucide-react";

interface PostRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published: boolean;
  created_at: string;
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      const json = await res.json();
      if (res.ok) setPosts(json.posts ?? []);
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const togglePublish = async (post: PostRecord) => {
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, published: !post.published }),
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, published: !p.published } : p))
        );
      }
    } catch {
      // error
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      // error
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#0B2A4A] tracking-tight">
            Blog Posts &amp; Editorial
          </h1>
          <p className="text-sm text-neutral-500 font-light mt-1">
            Author and publish insights, clinical articles, and corporate updates for the live blog.
          </p>
        </div>

        <Link
          href="/admin/blog/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#b00f23] hover:bg-[#960d1e] text-white text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 shadow-[0_4px_16px_rgba(176,15,35,0.32)] hover:shadow-[0_8px_24px_rgba(176,15,35,0.48)] hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="h-4 w-4 text-[#E2C785]" />
          <span>Write New Article</span>
        </Link>
      </div>

      {/* Posts Table */}
      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-12 text-center text-sm text-neutral-400 flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-[#C9A227]" />
            <span>Loading publications…</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-16 text-center text-sm text-neutral-400 font-light space-y-3">
            <FileText className="h-10 w-10 text-neutral-300 mx-auto" />
            <p>No blog posts written yet.</p>
            <Link
              href="/admin/blog/new"
              className="inline-block text-xs font-semibold text-[#b00f23] hover:underline"
            >
              Start authoring your first post →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-700">
              <thead className="bg-[#FAFBFD] text-xs font-semibold uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="px-5 py-3.5">Title &amp; Excerpt</th>
                  <th className="px-5 py-3.5">Slug</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-5 py-4 max-w-sm">
                      <div className="font-semibold text-[#0B2A4A] truncate">{post.title}</div>
                      {post.excerpt && (
                        <div className="text-xs text-neutral-500 font-light truncate mt-0.5">
                          {post.excerpt}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 text-xs font-mono text-neutral-500 truncate max-w-[180px]">
                      /{post.slug}
                    </td>

                    <td className="px-5 py-4 text-xs">
                      <button
                        onClick={() => togglePublish(post)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold cursor-pointer transition-colors ${
                          post.published
                            ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                            : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                        }`}
                      >
                        {post.published ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 text-neutral-400" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="px-5 py-4 text-xs text-neutral-400">
                      {new Date(post.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-5 py-4 text-right space-x-2">
                      {post.published && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-600 text-xs font-semibold tracking-wide transition-all duration-200 shadow-2xs hover:shadow-xs"
                        >
                          <Eye className="h-3 w-3 text-neutral-400" />
                          <span>View</span>
                        </Link>
                      )}

                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#0B2A4A]/20 bg-white hover:bg-[#0B2A4A] text-[#0B2A4A] hover:text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-2xs hover:shadow-xs"
                      >
                        <Edit3 className="h-3 w-3" />
                        <span>Edit</span>
                      </Link>

                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200 bg-white hover:bg-red-600 text-red-600 hover:text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
