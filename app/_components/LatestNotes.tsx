import Link from "next/link";
import { FileTextIcon, ArrowRightIcon } from "./icons";
import { getAllNotes } from "../_lib/posts";

export async function LatestNotes() {
  const notes = (await getAllNotes()).slice(0, 4);
  if (notes.length === 0) return null;
  return (
    <section className="pb-[27px]">
      <div className="mb-1 flex items-baseline justify-between">
        <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[#10172d]">Latest Notes</h2>
        <Link href="/notes" className="inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--color-accent-strong)] hover:underline">
          View all notes <ArrowRightIcon width={14} height={14} />
        </Link>
      </div>
      <p className="mb-[23px] mt-[7px] text-[13px] text-[#44516a]">Quick notes and ideas.</p>
      <div className="divide-y overflow-hidden rounded-[8px] border bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]" style={{ borderColor: "var(--color-border)" }}>
        {notes.map((n) => (
          <Link key={n.slug} href={`/notes/${n.slug}`}
            className="group flex min-h-[74px] items-center gap-[22px] px-[15px] py-[12px] transition-colors hover:bg-[#fafbff]">
            <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[7px] bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]">
              <FileTextIcon width={17} height={17} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate text-[13px] font-bold text-[#10172d] group-hover:text-[var(--color-accent-strong)]">{n.title}</div>
              {n.description && <div className="mt-[5px] line-clamp-1 text-[13px] text-[#44516a]">{n.description}</div>}
            </div>
            <div className="hidden whitespace-nowrap text-[12px] text-[#59657b] sm:block">{n.formattedDate}</div>
            {n.category && <span className="hidden whitespace-nowrap rounded-full bg-[var(--color-accent-soft)] px-[12px] py-[6px] text-[11px] font-semibold leading-none text-[var(--color-accent-strong)] sm:inline-block">{n.category}</span>}
          </Link>
        ))}
      </div>
    </section>
  );
}
