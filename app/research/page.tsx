import Link from "next/link";
import { ArrowRightIcon, FileTextIcon, SparklesIcon } from "../_components/icons";
import {
  getResearchCollections,
  getResearchItems,
  getResearchPapers,
  type ResearchCollection,
  type ResearchItem,
  type ResearchPaper,
} from "../_lib/posts";

export const metadata = { title: "Research" };

export default async function ResearchPage() {
  const [ongoing, papers, collections] = await Promise.all([
    getResearchItems(),
    getResearchPapers(),
    getResearchCollections(),
  ]);
  const filters = ["All", ...Array.from(new Set([...ongoing.map((item) => item.topic), ...papers.map((paper) => paper.topic)]))];

  return (
    <div className="mx-auto max-w-[946px] pb-[48px] pt-[46px]">
      <ResearchHero />
      <FilterBar filters={filters} />
      <OngoingResearch items={ongoing} />
      <ReadingList papers={papers} />
      <Collections collections={collections} />
      <ProjectCta />
    </div>
  );
}

function ResearchHero() {
  return (
    <section className="grid min-h-[190px] items-center gap-8 lg:grid-cols-[1fr_390px]">
      <div>
        <h1 className="text-[42px] font-extrabold leading-tight tracking-[-0.025em] text-[#10172d]">Research</h1>
        <p className="mt-[15px] max-w-[555px] text-[18px] leading-[31px] text-[#263458]">
          A collection of in-depth research notes, surveys, and reading lists on topics I&apos;m exploring.
        </p>
      </div>
      <ResearchArtwork />
    </section>
  );
}

function FilterBar({ filters }: { filters: string[] }) {
  return (
    <div className="mt-[28px] flex flex-wrap items-center gap-[11px] border-b pb-[26px]" style={{ borderColor: "var(--color-border)" }}>
      {filters.map((filter, index) => (
        <button
          key={filter}
          className={`h-[36px] rounded-full border px-[15px] text-[12px] font-semibold ${
            index === 0
              ? "border-transparent bg-gradient-to-r from-[#5a34f4] to-[#704cff] text-white shadow-[0_10px_22px_rgba(91,53,244,0.18)]"
              : "border-[var(--color-border)] bg-white text-[#263458]"
          }`}
        >
          {filter}
        </button>
      ))}
      <button className="ml-auto inline-flex h-[36px] items-center gap-[8px] rounded-[7px] border bg-white px-[14px] text-[13px] font-semibold text-[#263458]" style={{ borderColor: "var(--color-border)" }}>
        <FilterIcon />
        Filters
      </button>
    </div>
  );
}

function OngoingResearch({ items }: { items: ResearchItem[] }) {
  return (
    <section className="pt-[29px]">
      <SectionHeader title="Ongoing Research" subtitle="Topics I'm currently diving deep into." link="View all ongoing" />
      <div className="mt-[26px] grid gap-[20px] md:grid-cols-3">
        {items.map((item) => (
          <article key={item.title} className="rounded-[8px] border bg-white p-[20px] shadow-[0_8px_24px_rgba(15,23,42,0.03)]" style={{ borderColor: "var(--color-border)" }}>
            <div className="grid grid-cols-[64px_1fr] gap-[17px]">
              <ResearchThumb tone={item.tone} />
              <h3 className="text-[16px] font-bold leading-[24px] text-[#10172d]">{item.title}</h3>
            </div>
            <span className={`mt-[20px] inline-block rounded-[7px] px-[10px] py-[6px] text-[12px] font-semibold ${topicClass(item.topic)}`}>{item.topic}</span>
            <p className="mt-[17px] text-[14px] leading-[24px] text-[#263458]">{item.description}</p>
            <div className="mt-[28px] flex items-center justify-between text-[12px] text-[#59657b]">
              <span>In Progress</span>
              <span>{item.progress}%</span>
            </div>
            <div className="mt-[12px] h-[4px] rounded-full bg-[#e5e7f0]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#5a34f4] to-[#704cff]" style={{ width: `${item.progress}%` }} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReadingList({ papers }: { papers: ResearchPaper[] }) {
  return (
    <section className="pt-[52px]">
      <SectionHeader title="Research Papers / Reading List" subtitle="Curated papers and resources I'm studying." link="View all papers" />
      <div className="mt-[27px] overflow-hidden rounded-[8px] border bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]" style={{ borderColor: "var(--color-border)" }}>
        <div className="grid h-[45px] grid-cols-[1fr_150px_128px_118px_32px] items-center border-b px-[24px] text-[12px] font-semibold text-[#4c5871]" style={{ borderColor: "var(--color-border)" }}>
          <span>Paper</span>
          <span>Topic</span>
          <span>Added</span>
          <span>Status</span>
          <span />
        </div>
        {papers.map((paper) => (
          <div key={paper.slug} className="grid min-h-[72px] grid-cols-[1fr_150px_128px_118px_32px] items-center border-b px-[24px] last:border-b-0" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center gap-[18px]">
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[7px] bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]">
                <FileTextIcon width={17} height={17} />
              </span>
              <div>
                <div className="text-[13px] font-bold text-[#10172d]">{paper.title}</div>
                <div className="mt-[5px] text-[12px] text-[#59657b]">{paper.authors}</div>
              </div>
            </div>
            <span className={`w-fit rounded-full px-[12px] py-[6px] text-[11px] font-semibold leading-none ${topicClass(paper.topic)}`}>{paper.topic}</span>
            <span className="text-[12px] text-[#59657b]">{paper.formattedDate}</span>
            <span className={`w-fit rounded-full px-[12px] py-[6px] text-[11px] font-semibold leading-none ${statusClass(paper.status)}`}>{paper.status}</span>
            <BookmarkIcon />
          </div>
        ))}
      </div>
    </section>
  );
}

function Collections({ collections }: { collections: ResearchCollection[] }) {
  return (
    <section className="pt-[54px]">
      <SectionHeader title="Research Notes Collections" subtitle="Organized notes for complex topics." link="View all collections" />
      <div className="mt-[28px] grid gap-[20px] md:grid-cols-4">
        {collections.map((collection) => {
          const tone = collectionTone(collection.tone);
          return (
          <article key={collection.title} className="rounded-[8px] border bg-white p-[18px] shadow-[0_8px_24px_rgba(15,23,42,0.03)]" style={{ borderColor: "var(--color-border)" }}>
            <div className="grid grid-cols-[48px_1fr] items-start gap-[16px]">
              <span className={`flex h-[48px] w-[48px] items-center justify-center rounded-[7px] ${tone.bg} ${tone.color}`}>
                <SparklesIcon />
              </span>
              <h3 className="text-[14px] font-bold leading-[21px] text-[#10172d]">{collection.title}</h3>
            </div>
            <div className="mt-[20px] text-[13px] text-[#263458]">{collection.count}</div>
            <p className="mt-[18px] min-h-[90px] text-[13px] leading-[22px] text-[#263458]">{collection.description}</p>
            <Link href="/notes" className={`mt-[20px] inline-flex items-center gap-2 text-[13px] font-bold ${tone.color}`}>
              Open Collection <ArrowRightIcon width={14} height={14} />
            </Link>
          </article>
        );
        })}
      </div>
    </section>
  );
}

function ProjectCta() {
  return (
    <section className="mt-[37px] flex min-h-[78px] items-center gap-[20px] rounded-[8px] border border-[#d7cdff] bg-[#f8f5ff] px-[24px] py-[17px]">
      <span className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[10px] text-[var(--color-accent-strong)]">
        <FlaskIcon />
      </span>
      <div className="flex-1">
        <h3 className="text-[15px] font-bold text-[#10172d]">Curious about my experiments?</h3>
        <p className="mt-[7px] text-[14px] text-[#44516a]">Check out projects where I implement and test these ideas.</p>
      </div>
      <Link href="/projects" className="inline-flex h-[38px] items-center gap-2 rounded-[6px] bg-gradient-to-r from-[#5a34f4] to-[#704cff] px-[28px] text-[13px] font-bold text-white">
        View Projects <ArrowRightIcon width={14} height={14} />
      </Link>
    </section>
  );
}

function SectionHeader({ title, subtitle, link }: { title: string; subtitle: string; link: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-[20px] font-bold tracking-[-0.01em] text-[#10172d]">{title}</h2>
        <p className="mt-[9px] text-[13px] text-[#44516a]">{subtitle}</p>
      </div>
      <Link href="#" className="inline-flex items-center gap-2 text-[13px] font-bold text-[var(--color-accent-strong)]">
        {link} <ArrowRightIcon width={14} height={14} />
      </Link>
    </div>
  );
}

function ResearchArtwork() {
  return (
    <div className="relative h-[190px]">
      <svg viewBox="0 0 390 190" className="h-full w-full" fill="none">
        <defs>
          <linearGradient id="researchPurple" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#d9d2ff" />
            <stop offset="1" stopColor="#6748f5" />
          </linearGradient>
          <filter id="researchShadow" x="-20%" y="-20%" width="160%" height="160%">
            <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#6d50ff" floodOpacity="0.24" />
          </filter>
        </defs>
        <g stroke="#dfe3f4" strokeWidth="1">
          <path d="M20 130 102 76 350 33" />
          <path d="M48 50 160 91 378 112" />
          <path d="M8 92 138 20 300 62" />
        </g>
        {[30, 70, 130, 194, 270, 336, 372].map((x, i) => (
          <circle key={x} cx={x} cy={i % 2 ? 45 : 88} r="3" fill="#765cff" opacity="0.58" />
        ))}
        <g filter="url(#researchShadow)">
          <rect x="122" y="50" width="118" height="92" rx="8" fill="#f7f5ff" stroke="#e6e1ff" transform="rotate(-10 181 96)" />
          <rect x="135" y="64" width="90" height="8" rx="4" fill="#d8d0ff" transform="rotate(-10 181 96)" />
          <path d="M142 95c25-18 51 8 77-13" stroke="#b7a9ff" strokeWidth="4" strokeLinecap="round" transform="rotate(-10 181 96)" />
          <path d="M146 120c20-12 46 6 68-9" stroke="#c9c0ff" strokeWidth="4" strokeLinecap="round" transform="rotate(-10 181 96)" />
          <circle cx="247" cy="82" r="42" stroke="url(#researchPurple)" strokeWidth="12" />
          <path d="M276 111 326 157" stroke="url(#researchPurple)" strokeWidth="17" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

function ResearchThumb({ tone }: { tone: string }) {
  const color = tone === "green" ? "#42c793" : tone === "amber" ? "#f2a139" : "#7358ff";

  return (
    <svg viewBox="0 0 64 64" className="h-[64px] w-[64px] rounded-[7px]" fill="none">
      <rect x="1" y="1" width="62" height="62" rx="7" fill={`${color}12`} stroke={color} />
      {tone === "green" ? (
        <path d="M9 31c14-19 31 18 46-2M9 22c14-19 31 18 46-2M9 40c14-19 31 18 46-2" stroke={color} strokeWidth="1.5" />
      ) : tone === "amber" ? (
        <g stroke={color} strokeWidth="1.5">
          <circle cx="32" cy="32" r="5" />
          {[12, 20, 32, 44, 52].map((x, i) => <circle key={x} cx={x} cy={i % 2 ? 16 : 48} r="2.5" />)}
          <path d="M32 32 12 48M32 32 20 16M32 32 44 16M32 32 52 48" />
        </g>
      ) : (
        <g stroke={color} strokeWidth="1.4">
          {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M4 ${8 + i * 9}H60`} />)}
          {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${8 + i * 9} 4V60`} />)}
        </g>
      )}
    </svg>
  );
}

function topicClass(topic: string) {
  if (topic === "Optimization") return "bg-emerald-50 text-emerald-600";
  if (topic === "Theory") return "bg-orange-50 text-orange-500";
  return "bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]";
}
function collectionTone(tone: string) {
  if (tone === "green") return { bg: "bg-emerald-50", color: "text-emerald-600" };
  if (tone === "amber") return { bg: "bg-orange-50", color: "text-orange-500" };
  if (tone === "blue") return { bg: "bg-sky-50", color: "text-sky-600" };
  return { bg: "bg-[var(--color-accent-soft)]", color: "text-[var(--color-accent-strong)]" };
}

function statusClass(status: string) {
  if (status === "Finished") return "bg-emerald-50 text-emerald-600";
  if (status === "Reading") return "bg-orange-50 text-orange-500";
  if (status === "In Review") return "bg-sky-50 text-sky-600";
  return "bg-slate-100 text-slate-500";
}

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5h16l-6 7v5l-4 2v-7z" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#10172d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 4h12v17l-6-4-6 4z" />
    </svg>
  );
}

function FlaskIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M25 8h14" />
      <path d="M28 8v19L14 51c-2 4 1 7 5 7h26c4 0 7-3 5-7L36 27V8" />
      <path d="M22 45h20" />
      <circle cx="27" cy="51" r="2" fill="currentColor" stroke="none" />
      <circle cx="38" cy="48" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}
