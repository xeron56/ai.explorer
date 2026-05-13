import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllNotes, getNote } from "../../_lib/posts";
import { compileMdx } from "../../_lib/mdx";

export async function generateStaticParams() {
  const notes = await getAllNotes();
  return notes.map((n) => ({ slug: n.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = await getNote(slug);
  if (!n) return {};
  return { title: n.title, description: n.description };
}
export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = await getNote(slug);
  if (!n) notFound();
  const MDX = await compileMdx(n.content);
  return (
    <article className="max-w-2xl mx-auto pt-10 pb-20">
      <Link href="/notes" className="text-[13px] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">← All notes</Link>
      {n.category && <span className="block mt-4 text-[11.5px] font-semibold text-[var(--color-accent-strong)] uppercase tracking-wider">{n.category}</span>}
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 leading-[1.15]">{n.title}</h1>
      <div className="mt-3 text-[13px] text-[var(--color-fg-subtle)] border-b pb-5" style={{ borderColor: "var(--color-border)" }}>{n.formattedDate}</div>
      <div className="prose-post mt-6"><MDX /></div>
    </article>
  );
}
