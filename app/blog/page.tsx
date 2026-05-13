import Link from "next/link";
import { getAllPosts } from "../_lib/posts";
import { ClockIcon } from "../_components/icons";
import { PostThumbnail } from "../_components/PostThumbnail";

export const metadata = { title: "Blog" };

export default async function BlogIndex({
  searchParams,
}: { searchParams: Promise<{ category?: string; q?: string }>; }) {
  const { category, q } = await searchParams;
  let posts = await getAllPosts();
  if (category) posts = posts.filter((p) => p.category === category);
  if (q) {
    const needle = q.toLowerCase();
    posts = posts.filter((p) => p.title.toLowerCase().includes(needle) || (p.description?.toLowerCase().includes(needle) ?? false));
  }
  return (
    <div className="max-w-5xl mx-auto pt-10 pb-16">
      <h1 className="text-4xl font-extrabold tracking-tight">Blog</h1>
      <p className="text-[var(--color-fg-muted)] mt-2">
        Long-form essays, tutorials, and explorations.
        {category && (<> — filtered by <span className="font-medium text-[var(--color-fg)]">{category}</span>. <Link className="text-[var(--color-accent-strong)] hover:underline" href="/blog">clear</Link></>)}
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => (
          <article key={p.slug} className="rounded-2xl border bg-[var(--color-bg)] overflow-hidden flex flex-col hover:shadow-md transition-all" style={{ borderColor: "var(--color-border)" }}>
            <div className="aspect-[5/4]">
              <PostThumbnail title={p.title} variant={(p.cardClassName as "rk" | "norm" | "diffusion" | "ssl") ?? (["rk","norm","diffusion","ssl"] as const)[i % 4]} />
            </div>
            <div className="p-4 flex flex-col flex-1">
              {p.category && <span className="text-[11.5px] font-semibold text-[var(--color-accent-strong)] uppercase tracking-wider">{p.category}</span>}
              <h3 className="mt-2 text-[15.5px] font-semibold leading-snug line-clamp-2">
                <Link href={`/blog/${p.slug}`} className="hover:text-[var(--color-accent-strong)]">{p.title}</Link>
              </h3>
              {p.description && <p className="mt-2 text-[13px] text-[var(--color-fg-muted)] leading-5 line-clamp-3">{p.description}</p>}
              <div className="mt-auto pt-4 flex items-center justify-between text-[12px] text-[var(--color-fg-subtle)]">
                <span className="inline-flex items-center gap-1.5"><ClockIcon width={14} height={14} />{p.readingTime} min read</span>
                <span>{p.formattedDate}</span>
              </div>
            </div>
          </article>
        ))}
        {posts.length === 0 && <div className="col-span-full text-[var(--color-fg-muted)] text-sm">No posts found.</div>}
      </div>
    </div>
  );
}
