import Link from "next/link";
import { FileTextIcon, ArrowRightIcon } from "./icons";
import { getAllNotes } from "../_lib/posts";

export async function LatestNotes() {
  const notes = (await getAllNotes()).slice(0, 4);
  if (notes.length === 0) return null;
  return (
    <section className="pb-14">
      <div className="flex items-baseline justify-between mb-1">
        <h2 className="text-2xl font-bold tracking-tight">Latest Notes</h2>
        <Link href="/notes" className="text-[13.5px] font-medium text-[var(--color-accent-strong)] hover:underline inline-flex items-center gap-1">
          View all notes <ArrowRightIcon width={14} height={14} />
        </Link>
      </div>
      <p className="text-[14px] text-[var(--color-fg-muted)] mt-1 mb-5">Quick notes and ideas.</p>
      <div className="rounded-2xl border bg-[var(--color-bg)] divide-y" style={{ borderColor: "var(--color-border)" }}>
        {notes.map((n) => (
          <Link key={n.slug} href={`/notes/${n.slug}`}
            className="flex items-center gap-4 p-4 hover:bg-[var(--color-bg-elevated)] transition-colors group">
            <div className="w-9 h-9 rounded-md bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)] flex items-center justify-center shrink-0">
              <FileTextIcon width={18} height={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[14.5px] group-hover:text-[var(--color-accent-strong)] truncate">{n.title}</div>
              {n.description && <div className="text-[12.5px] text-[var(--color-fg-muted)] mt-0.5 line-clamp-1">{n.description}</div>}
            </div>
            <div className="hidden sm:block text-[12px] text-[var(--color-fg-subtle)] whitespace-nowrap">{n.formattedDate}</div>
            {n.category && <span className="hidden sm:inline-block text-[11px] font-medium px-2 py-1 rounded-md bg-[var(--color-bg-elevated)] text-[var(--color-fg-muted)] whitespace-nowrap">{n.category}</span>}
          </Link>
        ))}
      </div>
    </section>
  );
}
