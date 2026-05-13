import Link from "next/link";
import { ClockIcon, ArrowRightIcon } from "./icons";
import { getAllPosts } from "../_lib/posts";
import { PostThumbnail } from "./PostThumbnail";

export async function FeaturedPosts() {
  const posts = (await getAllPosts()).slice(0, 4);
  return (
    <section className="pb-[52px] pt-[39px]">
      <div className="mb-[27px] flex items-baseline justify-between">
        <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[#10172d]">Featured Posts</h2>
        <Link href="/blog" className="inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--color-accent-strong)] hover:underline">
          View all posts <ArrowRightIcon width={14} height={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((p, i) => (
          <article key={p.slug}
            className="flex min-h-[400px] flex-col overflow-hidden rounded-[8px] border bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
            style={{ borderColor: "var(--color-border)" }}>
            <div className="h-[168px] overflow-hidden border-b border-[var(--color-border)]">
              <PostThumbnail title={p.title} variant={(p.cardClassName as "rk" | "norm" | "diffusion" | "ssl") ?? (["rk","norm","diffusion","ssl"] as const)[i % 4]} />
            </div>
            <div className="flex flex-1 flex-col p-[17px]">
              {p.category && (
                <Link href={`/blog?category=${encodeURIComponent(p.category)}`} className="w-fit rounded-full bg-[var(--color-accent-soft)] px-[10px] py-[5px] text-[11px] font-semibold leading-none text-[var(--color-accent-strong)]">{p.category}</Link>
              )}
              <h3 className="mt-[17px] line-clamp-2 text-[16px] font-bold leading-[21px] tracking-[-0.01em] text-[#10172d]">
                <Link href={`/blog/${p.slug}`} className="hover:text-[var(--color-accent-strong)]">{p.title}</Link>
              </h3>
              {p.description && (
                <p className="mt-[11px] line-clamp-3 text-[13px] leading-[21px] text-[#44516a]">{p.description}</p>
              )}
              <div className="mt-auto flex items-center justify-between pt-5 text-[12px] text-[#59657b]">
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
