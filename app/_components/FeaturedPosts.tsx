import Link from "next/link";
import { ClockIcon, ArrowRightIcon } from "./icons";
import { getAllPosts } from "../_lib/posts";
import { PostThumbnail } from "./PostThumbnail";

export async function FeaturedPosts() {
  const posts = (await getAllPosts()).slice(0, 4);
  return (
    <section className="pb-14">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="text-2xl font-bold tracking-tight">Featured Posts</h2>
        <Link href="/blog" className="text-[13.5px] font-medium text-[var(--color-accent-strong)] hover:underline inline-flex items-center gap-1">
          View all posts <ArrowRightIcon width={14} height={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {posts.map((p, i) => (
          <article key={p.slug}
            className="rounded-2xl border bg-[var(--color-bg)] overflow-hidden flex flex-col hover:shadow-lg hover:shadow-black/5 transition-all hover:-translate-y-0.5"
            style={{ borderColor: "var(--color-border)" }}>
            <div className="aspect-[5/4] overflow-hidden">
              <PostThumbnail title={p.title} variant={(p.cardClassName as "rk" | "norm" | "diffusion" | "ssl") ?? (["rk","norm","diffusion","ssl"] as const)[i % 4]} />
            </div>
            <div className="p-4 flex flex-col flex-1">
              {p.category && (
                <Link href={`/blog?category=${encodeURIComponent(p.category)}`} className="text-[11.5px] font-semibold text-[var(--color-accent-strong)] uppercase tracking-wider">{p.category}</Link>
              )}
              <h3 className="mt-2 text-[15.5px] font-semibold leading-snug line-clamp-2">
                <Link href={`/blog/${p.slug}`} className="hover:text-[var(--color-accent-strong)]">{p.title}</Link>
              </h3>
              {p.description && (
                <p className="mt-2 text-[13px] text-[var(--color-fg-muted)] leading-5 line-clamp-3">{p.description}</p>
              )}
              <div className="mt-auto pt-4 flex items-center justify-between text-[12px] text-[var(--color-fg-subtle)]">
                <span className="inline-flex items-center gap-1.5"><ClockIcon width={14} height={14} />{p.readingTime} min read</span>
                <span>{p.formattedDate}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
