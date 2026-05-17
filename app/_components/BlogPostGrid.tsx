"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ClockIcon } from "./icons";
import { PostThumbnail } from "./PostThumbnail";

type BlogListPost = {
  slug: string;
  title: string;
  description?: string;
  category?: string;
  readingTime: number;
  formattedDate: string;
  cardClassName?: string;
};

const fallbackVariants = ["rk", "norm", "diffusion", "ssl"] as const;

export function BlogPostGrid({ posts }: { posts: BlogListPost[] }) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const query = searchParams.get("q")?.trim().toLowerCase();

  const visiblePosts = posts.filter((post) => {
    if (category && post.category !== category) return false;
    if (!query) return true;
    return post.title.toLowerCase().includes(query) || (post.description?.toLowerCase().includes(query) ?? false);
  });

  return (
    <>
      <p className="mt-2 text-[var(--color-fg-muted)]">
        Long-form essays, tutorials, and explorations.
        {category && (
          <>
            {" "}filtered by <span className="font-medium text-[var(--color-fg)]">{category}</span>.{" "}
            <Link className="text-[var(--color-accent-strong)] hover:underline" href="/blog">clear</Link>
          </>
        )}
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visiblePosts.map((post, index) => (
          <article key={post.slug} className="flex flex-col overflow-hidden rounded-2xl border bg-[var(--color-bg)] transition-all hover:shadow-md" style={{ borderColor: "var(--color-border)" }}>
            <div className="aspect-[5/4]">
              <PostThumbnail title={post.title} variant={(post.cardClassName as "rk" | "norm" | "diffusion" | "ssl") ?? fallbackVariants[index % fallbackVariants.length]} />
            </div>
            <div className="flex flex-1 flex-col p-4">
              {post.category && <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[var(--color-accent-strong)]">{post.category}</span>}
              <h3 className="mt-2 line-clamp-2 text-[15.5px] font-semibold leading-snug">
                <Link href={`/blog/${post.slug}`} className="hover:text-[var(--color-accent-strong)]">{post.title}</Link>
              </h3>
              {post.description && <p className="mt-2 line-clamp-3 text-[13px] leading-5 text-[var(--color-fg-muted)]">{post.description}</p>}
              <div className="mt-auto flex items-center justify-between pt-4 text-[12px] text-[var(--color-fg-subtle)]">
                <span className="inline-flex items-center gap-1.5"><ClockIcon width={14} height={14} />{post.readingTime} min read</span>
                <span>{post.formattedDate}</span>
              </div>
            </div>
          </article>
        ))}
        {visiblePosts.length === 0 && <div className="col-span-full text-sm text-[var(--color-fg-muted)]">No posts found.</div>}
      </div>
    </>
  );
}
