import Link from "next/link";
import { ArrowRightIcon, FileTextIcon, SparklesIcon } from "../_components/icons";
import { getAllNotes, type Post } from "../_lib/posts";

export const metadata = { title: "Notes" };

export default async function NotesIndex() {
  const notes = await getAllNotes();
  const pinned = notes.filter((note) => note.pinned).slice(0, 4);
  const recent = notes.slice(0, 5);
  const tags = countBy(notes.flatMap((note) => note.tags));
  const collections = countBy(notes.map((note) => note.collection).filter((value): value is string => Boolean(value)));

  return (
    <div className="mx-auto max-w-[946px] pb-[56px] pt-[44px]">
      <NotesHero />
      <NotesToolbar />
      <div className="mt-[33px] grid gap-[38px] xl:grid-cols-[minmax(0,1fr)_226px]">
        <main>
          <PinnedNotes notes={pinned} />
          <AllNotes notes={notes} />
        </main>
        <NotesSidebar recent={recent} tags={tags} collections={collections} notes={notes} />
      </div>
    </div>
  );
}

function NotesHero() {
  return (
    <section className="grid min-h-[190px] items-center gap-8 lg:grid-cols-[1fr_390px]">
      <div>
        <h1 className="text-[42px] font-extrabold leading-tight tracking-[-0.025em] text-[#10172d]">Notes</h1>
        <p className="mt-[15px] max-w-[530px] text-[18px] leading-[31px] text-[#263458]">
          My personal knowledge base for ideas, concepts, formulas, and things I want to remember.
        </p>
        <div className="mt-[35px] flex flex-wrap gap-[12px]">
          <button className="inline-flex h-[42px] items-center gap-[10px] rounded-[7px] bg-gradient-to-r from-[#5a34f4] to-[#704cff] px-[24px] text-[14px] font-bold text-white shadow-[0_10px_22px_rgba(91,53,244,0.18)]">
            <PlusIcon /> New Note
          </button>
          <button className="inline-flex h-[42px] items-center gap-[10px] rounded-[7px] border bg-white px-[20px] text-[13px] font-bold text-[#10172d]" style={{ borderColor: "var(--color-border)" }}>
            <UploadIcon /> Import / Upload
          </button>
        </div>
      </div>
      <NotesArtwork />
    </section>
  );
}

function NotesToolbar() {
  const tabs = [
    ["All Notes", "file"],
    ["Favorites", "star"],
    ["Recent", "clock"],
    ["Uncategorized", "folder"],
  ];

  return (
    <div className="mt-[28px] flex flex-wrap items-center gap-[26px] border-t pt-[19px]" style={{ borderColor: "var(--color-border)" }}>
      {tabs.map(([label, icon], index) => (
        <button key={label} className={`inline-flex h-[34px] items-center gap-[8px] rounded-[7px] px-[11px] text-[13px] font-semibold ${index === 0 ? "bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]" : "text-[#44516a]"}`}>
          <ToolbarIcon type={icon} /> {label}
        </button>
      ))}
      <div className="ml-auto flex items-center gap-[12px] text-[12px] text-[#59657b]">
        Sort by:
        <button className="inline-flex h-[34px] items-center gap-[14px] rounded-[7px] border bg-white px-[13px] text-[12px] font-bold text-[#10172d]" style={{ borderColor: "var(--color-border)" }}>
          Updated <ChevronDownIcon />
        </button>
        <button className="flex h-[34px] w-[34px] items-center justify-center rounded-[7px] border bg-white text-[#10172d]" style={{ borderColor: "var(--color-border)" }}><ListIcon /></button>
        <button className="flex h-[34px] w-[34px] items-center justify-center rounded-[7px] border bg-white text-[#10172d]" style={{ borderColor: "var(--color-border)" }}><GridIcon /></button>
      </div>
    </div>
  );
}

function PinnedNotes({ notes }: { notes: Post[] }) {
  return (
    <section>
      <h2 className="flex items-center gap-[9px] text-[20px] font-bold tracking-[-0.01em] text-[#10172d]"><PinIcon /> Pinned Notes</h2>
      <div className="mt-[24px] grid gap-[15px] md:grid-cols-4">
        {notes.map((note) => (
          <article key={note.title} className="min-h-[254px] rounded-[8px] border bg-white p-[16px] shadow-[0_8px_24px_rgba(15,23,42,0.03)]" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between">
              <span className={`flex h-[30px] w-[30px] items-center justify-center rounded-[7px] ${softBg(note.accent)} ${textColor(note.accent)}`}>
                <FileTextIcon width={16} height={16} />
              </span>
              {note.favorite ? <span className="text-yellow-400">★</span> : note.noteKind === "checklist" ? <ChevronDownIcon /> : null}
            </div>
            <h3 className="mt-[18px] min-h-[42px] text-[14px] font-bold leading-[21px] text-[#10172d]">{note.title}</h3>
            <PinnedBody kind={note.noteKind ?? "bullets"} />
            {note.category && <span className={`mt-[21px] inline-block rounded-[7px] px-[10px] py-[6px] text-[11px] font-semibold leading-none ${categoryClass(note.category)}`}>{note.category}</span>}
            <div className="mt-[18px] text-[12px] text-[#59657b]">Updated {note.formattedDate}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AllNotes({ notes }: { notes: Post[] }) {
  return (
    <section className="mt-[39px]">
      <h2 className="text-[20px] font-bold tracking-[-0.01em] text-[#10172d]">All Notes</h2>
      <div className="relative mt-[17px]">
        <SearchSmallIcon className="absolute left-[14px] top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-[#59657b]" />
        <input className="h-[38px] w-full rounded-[7px] border bg-white pl-[42px] pr-[14px] text-[13px] outline-none placeholder:text-[#7b849b]" placeholder="Search notes..." style={{ borderColor: "var(--color-border)" }} />
      </div>
      <div className="mt-[18px] overflow-hidden rounded-[8px] border bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]" style={{ borderColor: "var(--color-border)" }}>
        {notes.map((note) => (
          <Link href={`/notes/${note.slug}`} key={note.slug} className="grid min-h-[72px] grid-cols-[42px_1fr_120px_96px_20px] items-center gap-[16px] border-b px-[14px] last:border-b-0 hover:bg-[#fafbff]" style={{ borderColor: "var(--color-border)" }}>
            <span className={`flex h-[38px] w-[38px] items-center justify-center rounded-[7px] ${softBg(note.accent)} ${textColor(note.accent)}`}>
              <FileTextIcon width={18} height={18} />
            </span>
            <span>
              <span className="block text-[13px] font-bold leading-[19px] text-[#10172d]">{note.title}{note.favorite ? " ★" : ""}</span>
              {note.description && <span className="mt-[4px] block text-[12px] leading-[18px] text-[#44516a]">{note.description}</span>}
            </span>
            <span className={`w-fit rounded-[7px] px-[10px] py-[6px] text-[11px] font-semibold leading-none ${categoryClass(note.category ?? "Other")}`}>{note.category}</span>
            <span className="text-[12px] text-[#263458]">{note.formattedDate}</span>
            <span className="text-[#10172d]"><DotsIcon /></span>
          </Link>
        ))}
      </div>
      <div className="mt-[31px] flex justify-center gap-[9px]">
        {["‹", "1", "2", "3", "...", "8", "›"].map((item) => (
          <button key={item} className={`h-[36px] min-w-[36px] rounded-[7px] border px-[10px] text-[13px] font-semibold ${item === "1" ? "border-transparent bg-gradient-to-r from-[#5a34f4] to-[#704cff] text-white" : "bg-white text-[#263458]"}`} style={{ borderColor: item === "1" ? "transparent" : "var(--color-border)" }}>
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}

function NotesSidebar({
  recent,
  tags,
  collections,
  notes,
}: {
  recent: Post[];
  tags: Record<string, number>;
  collections: Record<string, number>;
  notes: Post[];
}) {
  const wordCount = notes.reduce((sum, note) => sum + note.content.split(/\s+/).filter(Boolean).length, 0);

  return (
    <aside className="hidden xl:block">
      <div className="space-y-[23px]">
        <SideCard>
          <h3 className="text-[12px] font-extrabold uppercase tracking-[0.02em] text-[#10172d]">Recently Edited</h3>
          <div className="mt-[25px] grid gap-[21px]">
            {recent.map((note) => (
              <Link href={`/notes/${note.slug}`} key={note.slug} className="grid grid-cols-[36px_1fr] gap-[13px]">
                <span className={`flex h-[36px] w-[36px] items-center justify-center rounded-[7px] ${softBg(note.accent)} ${textColor(note.accent)}`}><FileTextIcon width={17} height={17} /></span>
                <span>
                  <span className="line-clamp-2 text-[13px] font-bold leading-[18px] text-[#10172d]">{note.title}</span>
                  <span className="mt-[5px] block text-[12px] text-[#59657b]">{note.recentLabel ?? note.formattedDate}</span>
                </span>
              </Link>
            ))}
          </div>
        </SideCard>
        <SideCard>
          <h3 className="text-[12px] font-extrabold uppercase tracking-[0.02em] text-[#10172d]">Top Tags</h3>
          <div className="mt-[24px] flex flex-wrap gap-[10px]">
            {Object.entries(tags).map(([tag, count]) => (
              <span key={tag} className="inline-flex items-center gap-[9px] rounded-full bg-[var(--color-accent-soft)] px-[11px] py-[7px] text-[12px] font-semibold text-[var(--color-accent-strong)]">
                {tag}
                <span className="rounded-full bg-white/70 px-[7px] py-[2px] text-[10px] text-[#59657b]">{count}</span>
              </span>
            ))}
          </div>
          <Link href="#" className="mt-[20px] inline-flex items-center gap-2 text-[13px] font-bold text-[var(--color-accent-strong)]">View all tags <ArrowRightIcon width={14} height={14} /></Link>
        </SideCard>
        <SideCard>
          <h3 className="text-[12px] font-extrabold uppercase tracking-[0.02em] text-[#10172d]">Collections</h3>
          <div className="mt-[24px] grid gap-[17px]">
            {Object.entries(collections).map(([title, count]) => (
              <div key={title} className="flex items-center gap-[10px] text-[13px] text-[#263458]">
                <FolderIcon />
                <span>{title}</span>
                <span className="ml-auto rounded-full bg-[#f0f1f7] px-[8px] py-[3px] text-[10px] font-bold text-[#7b849b]">{count}</span>
              </div>
            ))}
          </div>
          <Link href="#" className="mt-[20px] inline-flex items-center gap-2 text-[13px] font-bold text-[var(--color-accent-strong)]">New Collection <ArrowRightIcon width={14} height={14} /></Link>
        </SideCard>
        <SideCard>
          <h3 className="text-[12px] font-extrabold uppercase tracking-[0.02em] text-[#10172d]">Stats</h3>
          <div className="mt-[25px] grid gap-[20px]">
            <StatBox icon="file" label="Total Notes" value={String(notes.length)} />
            <StatBox icon="text" label="Words Written" value={formatNumber(wordCount)} />
            <StatBox icon="calendar" label="Days Active" value={String(new Set(notes.map((note) => note.date)).size)} />
          </div>
        </SideCard>
      </div>
    </aside>
  );
}

function SideCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-[8px] border bg-white p-[20px] shadow-[0_8px_24px_rgba(15,23,42,0.04)]" style={{ borderColor: "var(--color-border)" }}>
      {children}
    </section>
  );
}

function PinnedBody({ kind }: { kind: string }) {
  if (kind === "formula") {
    return (
      <div className="mt-[30px] text-center font-serif text-[17px] italic text-[#10172d]">
        Attention(Q, K, V)
        <div className="mt-[18px] text-[15px]">= softmax( QK<sup>T</sup> / sqrt(d<sub>k</sub>) ) V</div>
      </div>
    );
  }
  if (kind === "checklist") {
    return (
      <div className="mt-[19px] grid gap-[8px] text-[12px] text-[#44516a]">
        {["Gradient Descent", "Adam", "RMSProp", "Nesterov Momentum"].map((item, index) => (
          <label key={item} className="flex items-center gap-[8px]"><span className="h-[11px] w-[11px] rounded-[2px] border border-[#a8b0c2]">{index === 1 ? "✓" : ""}</span>{item}</label>
        ))}
      </div>
    );
  }
  const items = kind === "ideas" ? ["Sparse Attention", "Learnable Activations", "RLHF for Code Gen"] : ["Linear Algebra", "Probability", "Calculus", "Information Theory"];
  return (
    <ul className="mt-[20px] grid gap-[8px] pl-[16px] text-[12px] leading-[18px] text-[#263458]">
      {items.map((item) => <li key={item} className="list-disc">{item}</li>)}
    </ul>
  );
}

function NotesArtwork() {
  return (
    <svg viewBox="0 0 390 190" className="h-[190px] w-full" fill="none">
      <defs>
        <filter id="noteShadow" x="-20%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="16" stdDeviation="14" floodColor="#765cff" floodOpacity="0.22" />
        </filter>
      </defs>
      <g filter="url(#noteShadow)">
        <rect x="106" y="24" width="132" height="132" rx="9" fill="#fbfaff" stroke="#dfd8ff" transform="rotate(-10 172 90)" />
        {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M132 ${58 + i * 13}h82`} stroke="#c7bdff" strokeWidth="2" transform="rotate(-10 172 90)" />)}
        <circle cx="164" cy="105" r="19" stroke="#8a75ff" transform="rotate(-10 172 90)" />
        <path d="M164 86v38M145 105h38" stroke="#8a75ff" transform="rotate(-10 172 90)" />
        <rect x="246" y="45" width="18" height="96" rx="6" fill="#765cff" transform="rotate(72 255 93)" />
        <path d="M259 45 267 38" stroke="#3f28c9" strokeWidth="4" strokeLinecap="round" transform="rotate(72 255 93)" />
        <rect x="291" y="54" width="78" height="72" rx="2" fill="#fff1c8" transform="rotate(8 330 90)" />
        <text x="312" y="80" fontSize="11" fill="#263458" transform="rotate(8 330 90)">Ideas</text>
        <text x="309" y="101" fontSize="11" fill="#263458" transform="rotate(8 330 90)">→ Research</text>
        <text x="309" y="120" fontSize="11" fill="#263458" transform="rotate(8 330 90)">→ Impact</text>
      </g>
    </svg>
  );
}

function StatBox({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="grid grid-cols-[38px_1fr] items-center gap-[13px]">
      <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[7px] bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]">
        <ToolbarIcon type={icon} />
      </span>
      <span>
        <span className="block text-[12px] text-[#59657b]">{label}</span>
        <span className="mt-[3px] block text-[17px] font-extrabold text-[#10172d]">{value}</span>
      </span>
    </div>
  );
}

function softBg(accent?: string) {
  if (accent === "green") return "bg-emerald-50";
  if (accent === "blue") return "bg-sky-50";
  if (accent === "amber") return "bg-orange-50";
  if (accent === "pink") return "bg-pink-50";
  if (accent === "dark") return "bg-[#101827]";
  return "bg-[var(--color-accent-soft)]";
}

function textColor(accent?: string) {
  if (accent === "green") return "text-emerald-600";
  if (accent === "blue") return "text-sky-600";
  if (accent === "amber") return "text-orange-500";
  if (accent === "pink") return "text-pink-500";
  if (accent === "dark") return "text-white";
  return "text-[var(--color-accent-strong)]";
}

function categoryClass(category: string) {
  if (category === "Optimization") return "bg-emerald-50 text-emerald-600";
  if (category === "Math") return "bg-sky-50 text-sky-600";
  if (category === "Ideas" || category === "Tools") return "bg-orange-50 text-orange-500";
  if (category === "Machine Learning") return "bg-sky-50 text-sky-600";
  return "bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]";
}
function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}
function formatNumber(value: number) {
  return value >= 1000 ? `${Number((value / 1000).toFixed(1))}k` : String(value);
}

function ToolbarIcon({ type }: { type: string }) {
  if (type === "star") return <StarIcon />;
  if (type === "clock") return <ClockMiniIcon />;
  if (type === "folder") return <FolderIcon />;
  if (type === "calendar") return <CalendarIcon />;
  if (type === "text") return <span className="font-bold">Aa</span>;
  return <FileTextIcon width={15} height={15} />;
}

function PlusIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>; }
function UploadIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15V3M7 8l5-5 5 5M5 15v4h14v-4" /></svg>; }
function SearchSmallIcon(props: React.SVGProps<SVGSVGElement>) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.3-4.3" /></svg>; }
function ChevronDownIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>; }
function ListIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" /></svg>; }
function GridIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><rect x="14" y="14" width="6" height="6" /></svg>; }
function StarIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z" /></svg>; }
function ClockMiniIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>; }
function FolderIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 7h7l2 2h9v10H3z" /></svg>; }
function PinIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="#10172d"><path d="M14 3 21 10l-3 1-4 4v5l-2 2-3-7-7-3 2-2h5l4-4z" /></svg>; }
function DotsIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="12" cy="19" r="1.8" /></svg>; }
function CalendarIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></svg>; }
