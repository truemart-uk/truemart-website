"use client";

import { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { cloudinaryUrl } from "@/lib/cloudinary";

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  category: string;
  tags: string[];
  author_name: string;
  published_at: string;
  reading_time_minutes: number;
};

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: { full_name: string } | null;
};

type RelatedPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image?: string;
  category: string;
  published_at: string;
  reading_time_minutes: number;
};

type RelatedProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  badge?: string;
};

// ── SOCIAL SHARE ──────────────────────────────────────────────────────────────

function SocialShare({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/blog/${slug}` : "";

  function copy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const encodedUrl   = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm font-semibold text-gray-500">Share:</span>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 bg-[#25D366] text-white text-xs font-semibold px-3 py-2 rounded-xl hover:opacity-90 transition"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        WhatsApp
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 bg-[#1877F2] text-white text-xs font-semibold px-3 py-2 rounded-xl hover:opacity-90 transition"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Facebook
      </a>

      {/* Twitter/X */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 bg-black text-white text-xs font-semibold px-3 py-2 rounded-xl hover:opacity-80 transition"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        X
      </a>

      {/* Copy link */}
      <button
        onClick={copy}
        className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-gray-200 transition"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}

// ── COMMENTS SECTION ──────────────────────────────────────────────────────────

function CommentsSection({ blogId, initialComments }: { blogId: string; initialComments: Comment[] }) {
  const { user } = useAuth();
  const supabase  = createClient();

  const [comments, setComments]     = useState<Comment[]>(initialComments);
  const [text, setText]             = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !text.trim()) return;
    setSubmitting(true);
    setError("");

    const { data: newComment, error: insertError } = await supabase
      .from("blog_comments")
      .insert({ blog_id: blogId, user_id: user.id, content: text.trim(), is_approved: true })
      .select("id, content, created_at, user_id")
      .single();

    if (insertError) {
      setError("Failed to post comment. Please try again.");
      setSubmitting(false);
      return;
    }

    // Add comment with user's name from auth metadata
    const commentWithProfile = {
      ...newComment,
      profiles: { full_name: user.user_metadata?.full_name ?? user.email ?? "You" },
    };
    setComments(prev => [...prev, commentWithProfile as Comment]);
    setText("");
    setSubmitting(false);
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        💬 Comments
        {comments.length > 0 && (
          <span className="text-sm font-normal text-gray-400">({comments.length})</span>
        )}
      </h2>

      {/* Existing comments */}
      {comments.length === 0 ? (
        <p className="text-gray-400 text-sm mb-8">No comments yet. Be the first to share your thoughts!</p>
      ) : (
        <div className="space-y-4 mb-8">
          {comments.map(comment => (
            <div key={comment.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-brand-orange text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {(comment.profiles?.full_name?.[0] ?? "U").toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{comment.profiles?.full_name ?? "Anonymous"}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(comment.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Comment form */}
      {!user ? (
        <div className="bg-orange-50 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-600 mb-3">Sign in to leave a comment</p>
          <Link
            href="/account/login"
            className="bg-brand-orange text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-orange-500 transition"
          >
            Sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Leave a comment</h3>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            required
            rows={4}
            placeholder="Share your thoughts..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange resize-none mb-3"
          />
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="bg-brand-orange hover:bg-orange-500 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition"
          >
            {submitting ? "Posting..." : "Post comment"}
          </button>
        </form>
      )}
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function BlogPostClient({
  blog, comments, relatedPosts, relatedProducts,
}: {
  blog: Blog;
  comments: Comment[];
  relatedPosts: RelatedPost[];
  relatedProducts: RelatedProduct[];
}) {
  const date = new Date(blog.published_at).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric"
  });

  return (
    <div className="bg-background min-h-screen">

      {/* Cover image */}
      {blog.cover_image && (
        <div className="w-full h-64 md:h-80 bg-gray-100 overflow-hidden">
          <img
            src={`https://res.cloudinary.com/truemart/image/upload/w_1200,h_500,c_fill,g_auto,f_auto,q_80/${blog.cover_image}`}
            alt={blog.title}
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Back link */}
        <Link href="/blog" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-brand-orange transition mb-8">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to blog
        </Link>

        {/* Post header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-brand-orange">
              {blog.category}
            </span>
            {blog.tags.map(tag => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            {blog.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="w-8 h-8 rounded-full bg-brand-orange text-white text-xs font-bold flex items-center justify-center">
              {blog.author_name[0].toUpperCase()}
            </div>
            <span className="font-medium text-gray-700">{blog.author_name}</span>
            <span>·</span>
            <span>{date}</span>
            <span>·</span>
            <span>{blog.reading_time_minutes} min read</span>
          </div>
        </div>

        {/* Social share — top */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <SocialShare title={blog.title} slug={blog.slug} />
        </div>

        {/* Markdown content */}
        <div className="prose prose-orange max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-brand-orange prose-a:no-underline hover:prose-a:underline prose-hr:border-gray-100">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blog.content}
          </ReactMarkdown>
        </div>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-8 pt-8 border-t border-gray-100">
            {blog.tags.map(tag => (
              <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Social share — bottom */}
        <div className="mt-8 pt-8 border-t border-gray-100">
          <SocialShare title={blog.title} slug={blog.slug} />
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              🛍️ Products mentioned in this post
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {relatedProducts.map((product: RelatedProduct) => (
                <Link key={product.id} href={`/products/${product.slug}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition p-4 block">
                  <div className="h-24 bg-gray-50 rounded-xl mb-3 overflow-hidden flex items-center justify-center">
                    {product.images?.[0] ? (
                      <img
                        src={cloudinaryUrl(product.images[0], "card")}
                        alt={product.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-3xl">📦</span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1">{product.name}</p>
                  <p className="text-sm font-bold text-brand-orange">£{product.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <CommentsSection blogId={blog.id} initialComments={comments} />

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">More from {blog.category}</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {relatedPosts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition">
                    <div className="h-32 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                      {post.cover_image ? (
                        <img
                          src={`https://res.cloudinary.com/truemart/image/upload/w_300,h_150,c_fill,f_auto,q_80/${post.cover_image}`}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl opacity-20">📖</span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-brand-orange transition line-clamp-2 leading-snug mb-1">
                        {post.title}
                      </p>
                      <p className="text-xs text-gray-400">{post.reading_time_minutes} min read</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
