import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "../../_lib/posts";
import { compileMdx } from "../../_lib/mdx";
import { ClockIcon } from "../../_components/icons";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const MDX = await compileMdx(post.content);
  return (
    <article className="max-w-3xl mx-auto pt-10 pb-20">
      <div className="mb-6">
        <Link href="/blog" className="text-[13px] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">← All posts</Link>
      </div>
      {post.category && <span className="text-[11.5px] font-semibold text-[var(--color-accent-strong)] uppercase tracking-wider">{post.category}</span>}
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-2 leading-[1.1]">{post.title}</h1>
      {post.description && <p className="text-[var(--color-fg-muted)] mt-4 text-lg leading-7">{post.description}</p>}
      <div className="mt-5 flex items-center gap-4 text-[13px] text-[var(--color-fg-subtle)] border-b pb-6" style={{ borderColor: "var(--color-border)" }}>
        <span>{post.formattedDate}</span>
        <span className="inline-flex items-center gap-1.5"><ClockIcon width={14} height={14} /> {post.readingTime} min read</span>
      </div>
      <div className="prose-post mt-6">
        <MDX />
      </div>
    </article>
  );
}
