import type { ReactNode } from "react";
import {
  FilterSelect,
  MetricTile,
  PageHeading,
  PageShell,
  RailCard,
  SearchField,
  Surface,
  Tabs,
  Tag,
  Toolbar,
} from "../_components/pagePrimitives";

const problems = [
  ["Two Sum", "Easy", ["Array", "Hash Table"], "53.21%", "bookmark"],
  ["Add Two Numbers", "Medium", ["Linked List", "Math"], "45.67%", "solved"],
  ["Longest Substring Without Repeating Characters", "Medium", ["Hash Table", "String", "Sliding Window"], "33.58%", "bookmark"],
  ["Median of Two Sorted Arrays", "Hard", ["Array", "Binary Search", "Divide & Conquer"], "35.97%", "bookmark"],
  ["Reverse Integer", "Easy", ["Math"], "40.12%", "bookmark"],
  ["Zigzag Conversion", "Medium", ["String"], "32.85%", "bookmark"],
  ["Maximum Subarray", "Medium", ["Array", "Divide & Conquer", "DP"], "48.76%", "solved"],
  ["Container With Most Water", "Medium", ["Array", "Two Pointers"], "54.92%", "bookmark"],
  ["3Sum", "Medium", ["Array", "Two Pointers", "Sorting"], "27.31%", "bookmark"],
  ["Trapping Rain Water", "Hard", ["Array", "Two Pointers", "Stack"], "43.68%", "bookmark"],
] as const;

const topicCounts = [
  ["Array", "312"],
  ["Dynamic Programming", "198"],
  ["Graph", "142"],
  ["String", "136"],
  ["Binary Search", "98"],
];

export const metadata = { title: "Problems" };

export default function ProblemsPage() {
  return (
    <PageShell>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <main className="min-w-0">
          <PageHeading
            badge={
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#efeaff] text-[#5b35f4]">
                <CodeIcon />
              </span>
            }
            title="Problems"
            description="Practice coding problems and improve your problem solving skills."
          />

          <div className="mt-8">
            <Tabs
              items={["All Problems", "By Topics", "By Tags", "By Difficulty", "By Companies"]}
              active="All Problems"
            />
          </div>

          <Toolbar>
            <SearchField placeholder="Search problems..." className="flex-1" />
            <div className="flex flex-1 flex-wrap gap-3 lg:justify-end">
              <FilterSelect label="All Difficulty" />
              <FilterSelect label="All Topics" />
              <FilterSelect label="All Companies" />
              <FilterSelect label="All Status" />
              <FilterSelect label="Newest" />
            </div>
          </Toolbar>

          <Surface className="mt-5 overflow-hidden">
            <div className="grid grid-cols-[60px_minmax(220px,1.5fr)_120px_1fr_120px_80px] gap-4 border-b border-[var(--color-border)] px-5 py-4 text-[13px] font-bold text-[#73819a]">
              <span>#</span>
              <span>Problem</span>
              <span>Difficulty</span>
              <span>Topics</span>
              <span>Acceptance</span>
              <span>Status</span>
            </div>
            {problems.map(([title, difficulty, tags, acceptance, status], index) => (
              <div
                key={title}
                className="grid grid-cols-[60px_minmax(220px,1.5fr)_120px_1fr_120px_80px] gap-4 border-b border-[var(--color-border)] px-5 py-5 last:border-b-0"
              >
                <div className="text-[15px] font-semibold text-[#60708a]">{index + 1}</div>
                <div>
                  <div className="flex items-center gap-2 text-[17px] font-bold text-[#141b2d]">
                    {title}
                    <OpenIcon />
                  </div>
                </div>
                <div>
                  <Tag tone={difficulty === "Easy" ? "green" : difficulty === "Hard" ? "red" : "orange"}>
                    {difficulty}
                  </Tag>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Tag key={tag} tone="slate">
                      {tag}
                    </Tag>
                  ))}
                </div>
                <div className="text-[15px] font-semibold text-[#42506b]">{acceptance}</div>
                <div className="flex justify-center">
                  {status === "solved" ? <SolvedIcon /> : <BookmarkOutlineIcon />}
                </div>
              </div>
            ))}
          </Surface>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <PagerButton>&lt;</PagerButton>
            <PagerButton active>1</PagerButton>
            <PagerButton>2</PagerButton>
            <PagerButton>3</PagerButton>
            <PagerButton>...</PagerButton>
            <PagerButton>120</PagerButton>
            <PagerButton>&gt;</PagerButton>
          </div>
        </main>

        <aside className="space-y-5">
          <RailCard title="Problem Stats">
            <div className="grid grid-cols-2 gap-3">
              <MetricTile value="812" label="Total Problems" icon={<ClipboardIcon />} />
              <MetricTile value="128" label="Solved" icon={<SolvedIcon />} />
              <MetricTile value="56" label="Bookmarked" icon={<BookmarkOutlineIcon />} />
              <MetricTile value="12" label="Daily Streak" icon={<FlameIcon />} />
            </div>
          </RailCard>

          <RailCard title="Difficulty Breakdown">
            <div className="flex items-center gap-5">
              <div className="relative h-36 w-36 rounded-full bg-[conic-gradient(#22c55e_0_34%,#f59e0b_34%_85%,#ef4444_85%_100%)]">
                <div className="absolute inset-[22px] rounded-full bg-white" />
              </div>
              <div className="space-y-3 text-[14px] text-[#516078]">
                <Legend color="bg-[#22c55e]" label="Easy" value="276 (34.0%)" />
                <Legend color="bg-[#f59e0b]" label="Medium" value="412 (50.7%)" />
                <Legend color="bg-[#ef4444]" label="Hard" value="124 (15.3%)" />
              </div>
            </div>
          </RailCard>

          <RailCard title="Top Topics" action={<button className="text-[13px] font-bold text-[#5b35f4]">View all</button>}>
            <div className="space-y-4">
              {topicCounts.map(([label, count]) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#f4f7ff] text-[#5b35f4]">
                    <TopicIcon />
                  </div>
                  <div className="flex-1">
                    <div className="text-[14px] font-bold text-[#141b2d]">{label}</div>
                    <div className="text-[13px] text-[#7d889e]">{count} problems</div>
                  </div>
                </div>
              ))}
            </div>
          </RailCard>

          <Surface className="overflow-hidden bg-[linear-gradient(180deg,#f7f3ff_0%,#fff_100%)] p-5">
            <h3 className="text-[24px] font-extrabold tracking-[-0.03em] text-[#5b35f4]">Daily Challenge</h3>
            <p className="mt-3 text-[14px] leading-7 text-[#5d6b84]">
              Solve a problem daily and keep your streak going.
            </p>
            <button className="mt-5 inline-flex h-[46px] w-full items-center justify-center rounded-[14px] bg-gradient-to-r from-[#5b35f4] to-[#744dff] text-[14px] font-bold text-white">
              Solve Challenge
            </button>
          </Surface>
        </aside>
      </div>
    </PageShell>
  );
}

function PagerButton({
  children,
  active,
}: {
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className={`grid h-10 min-w-10 place-items-center rounded-[12px] border px-3 text-[14px] font-bold ${
        active
          ? "border-transparent bg-gradient-to-r from-[#5b35f4] to-[#744dff] text-white shadow-[0_14px_24px_rgba(91,53,244,0.18)]"
          : "border-[var(--color-border)] bg-white text-[#4f5d78]"
      }`}
    >
      {children}
    </button>
  );
}

function Legend({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <span className="min-w-[70px]">{label}</span>
      <span className="font-semibold text-[#7b879c]">{value}</span>
    </div>
  );
}

function CodeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" />
    </svg>
  );
}

function OpenIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#8f9ab0]">
      <path d="M14 4h6v6" />
      <path d="M10 14 20 4" />
      <path d="M20 14v6H4V4h6" />
    </svg>
  );
}

function BookmarkOutlineIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h12v17l-6-4-6 4z" />
    </svg>
  );
}

function SolvedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="5" width="12" height="16" rx="2" />
      <path d="M9 3h6v4H9z" />
      <path d="M9 12h6M9 16h6" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c2 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-5 0 3 2 3 2 5 0-4 2-5 2-8Z" />
      <path d="M9 14a3 3 0 1 0 6 0c0-1.2-.6-2.1-1.4-2.9-.1 1.3-.8 2.2-1.6 2.9-.3-.9-.9-1.7-1.7-2.4C9.7 12.4 9 13 9 14Z" />
    </svg>
  );
}

function TopicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 8h8M8 12h5M8 16h6" />
    </svg>
  );
}
