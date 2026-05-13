import Link from "next/link";
import { getAllNotes } from "../_lib/posts";
import { FileTextIcon } from "../_components/icons";

export const metadata = { title: "Notes" };

export default async function NotesIndex() {
  const notes = await getAllNotes();
  return (
    <div className="max-w-3xl mx-auto pt-10 pb-16">
      <h1 className="text-4xl font-extrabold tracking-tight">Notes</h1>
      <p className="text-[var(--color-fg-muted)] mt-2">Short ideas, derivations, and observations.</p>
      <div className="mt-8 rounded-2xl border bg-[var(--color-bg)] divide-y" style={{ borderColor: "var(--color-border)" }}>
        {notes.map((n) => (
          <Link key={n.slug} href={`/notes/${n.slug}`} className="flex items-center gap-4 p-4 hover:bg-[var(--color-bg-elevated)] transition-colors group">
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
        {notes.length === 0 && <div className="p-6 text-[var(--color-fg-muted)] text-sm">No notes yet.</div>}
      </div>
    </div>
  );
}
