"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default function BlogEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === "new";

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start writing your article here…</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none min-h-[320px] p-4 sm:p-6 outline-none focus:outline-none text-neutral-800",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/blog/${resolvedParams.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.post) {
            setTitle(data.post.title || "");
            setSlug(data.post.slug || "");
            setExcerpt(data.post.excerpt || "");
            setCoverImageUrl(data.post.cover_image_url || "");
            setPublished(data.post.published || false);
            if (editor && data.post.content) {
              editor.commands.setContent(data.post.content);
            }
          }
        })
        .catch(() => setError("Failed to load post"))
        .finally(() => setLoading(false));
    }
  }, [isNew, resolvedParams.id, editor]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (isNew) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const payload = {
      title,
      slug,
      excerpt,
      cover_image_url: coverImageUrl || null,
      published,
      content: editor ? editor.getJSON() : null,
    };

    try {
      if (isNew) {
        const res = await fetch("/api/admin/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? "Failed to create post");
        } else {
          setSuccess(true);
          router.push(`/admin/blog/${json.post.id}`);
        }
      } else {
        const res = await fetch(`/api/admin/blog/${resolvedParams.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? "Failed to save post");
        } else {
          setSuccess(true);
        }
      }
    } catch {
      setError("Network error saving post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-neutral-400">Loading article…</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-[#0B2A4A] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Articles</span>
        </Link>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded border-neutral-300 text-[#b00f23] focus:ring-0"
            />
            <span className="text-xs font-semibold text-neutral-700">Publish to Live Site</span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#b00f23] hover:bg-[#960d1e] text-xs font-semibold text-white transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving…" : isNew ? "Create Post" : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Post saved successfully!</span>
        </div>
      )}

      {/* Main Metadata Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4 shadow-2xs">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-neutral-600 uppercase">Article Title *</span>
          <input
            type="text"
            required
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g. Modern Pharmaceutical Retail in South India"
            className="rounded-xl border border-neutral-200 px-4 py-2.5 text-base sm:text-lg font-serif font-medium text-[#0B2A4A] outline-none focus:border-[#0B2A4A]"
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-neutral-600 uppercase">URL Slug *</span>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. modern-pharmaceutical-retail"
              className="rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-mono outline-none focus:border-[#0B2A4A]"
            />
          </label>

          <div className="flex flex-col">
            <ImageUploadField
              label="Cover Image URL (Optional)"
              value={coverImageUrl}
              onChange={(url) => setCoverImageUrl(url)}
              folder="blogs"
              placeholder="https://... or /images/..."
              hint="Select or upload article cover image from Supabase Storage (/media/blogs/)."
            />
          </div>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-neutral-600 uppercase">Summary / Excerpt</span>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A brief 1-2 sentence overview shown on the blog index cards…"
            className="rounded-xl border border-neutral-200 px-3.5 py-2 text-xs outline-none focus:border-[#0B2A4A] resize-none"
          />
        </label>
      </div>

      {/* Rich Text Editor Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-2xs">
        {/* Editor Toolbar */}
        {editor && (
          <div className="flex flex-wrap items-center gap-1 border-b border-neutral-200 bg-[#FAFBFD] p-2 text-neutral-700">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded hover:bg-neutral-200 ${
                editor.isActive("bold") ? "bg-neutral-200 text-[#0B2A4A]" : ""
              }`}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded hover:bg-neutral-200 ${
                editor.isActive("italic") ? "bg-neutral-200 text-[#0B2A4A]" : ""
              }`}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-1.5 rounded hover:bg-neutral-200 ${
                editor.isActive("heading", { level: 2 }) ? "bg-neutral-200 text-[#0B2A4A]" : ""
              }`}
              title="Heading 2"
            >
              <Heading1 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-1.5 rounded hover:bg-neutral-200 ${
                editor.isActive("heading", { level: 3 }) ? "bg-neutral-200 text-[#0B2A4A]" : ""
              }`}
              title="Heading 3"
            >
              <Heading2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded hover:bg-neutral-200 ${
                editor.isActive("bulletList") ? "bg-neutral-200 text-[#0B2A4A]" : ""
              }`}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded hover:bg-neutral-200 ${
                editor.isActive("orderedList") ? "bg-neutral-200 text-[#0B2A4A]" : ""
              }`}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-1.5 rounded hover:bg-neutral-200 ${
                editor.isActive("blockquote") ? "bg-neutral-200 text-[#0B2A4A]" : ""
              }`}
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </button>
            <div className="h-4 w-[1px] bg-neutral-300 mx-1" />
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              className="p-1.5 rounded hover:bg-neutral-200"
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              className="p-1.5 rounded hover:bg-neutral-200"
              title="Redo"
            >
              <Redo className="h-4 w-4" />
            </button>
          </div>
        )}

        <EditorContent editor={editor} />
      </div>
    </form>
  );
}
