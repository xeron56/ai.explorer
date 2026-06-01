import {
  FilterSelect,
  MetricTile,
  PageHeading,
  PageShell,
  PrimaryButton,
  RailCard,
  SearchField,
  Surface,
  Tabs,
  Tag,
  Toolbar,
} from "../_components/pagePrimitives";

const notes = [
  ["Top 10 Dynamic Programming Patterns", "A collection of the most important DP patterns with explanations and example problems.", "Public", "May 12, 2024", ["Dynamic Programming", "Patterns", "Algorithms"]],
  ["Graph Algorithms Cheatsheet", "Quick reference for common graph algorithms and their complexities.", "Private", "May 10, 2024", ["Graphs", "Algorithms", "Cheatsheet"]],
  ["Two Pointers Technique", "Complete guide to two pointers technique with patterns and problems.", "Public", "May 8, 2024", ["Algorithms", "Two Pointers", "Patterns"]],
  ["Time & Space Complexity", "Detailed notes on time complexity analysis with examples and common complexities.", "Unlisted", "May 6, 2024", ["Analysis", "Complexity", "Cheatsheet"]],
  ["Math for Competitive Programming", "Important mathematical concepts and formulas used in competitive programming.", "Public", "May 3, 2024", ["Math", "Number Theory", "Combinatorics"]],
  ["C++ STL Notes", "Quick notes on C++ STL containers, algorithms and useful functions.", "Private", "Apr 30, 2024", ["C++", "STL", "Reference"]],
  ["String Algorithms", "Important string algorithms and techniques with implementations.", "Public", "Apr 28, 2024", ["Strings", "Algorithms", "Patterns"]],
] as const;

const categories = [
  ["Dynamic Programming", "18"],
  ["Graphs", "16"],
  ["Algorithms", "15"],
  ["Math", "9"],
  ["Implementation", "8"],
];

const tags = [
  ["dp", "24"],
  ["graphs", "20"],
  ["algorithms", "19"],
  ["patterns", "18"],
  ["greedy", "12"],
  ["math", "11"],
  ["strings", "10"],
  ["binary-search", "9"],
];

export const metadata = { title: "Notes" };

export default function NotesPage() {
  return (
    <PageShell>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <main className="min-w-0">
          <PageHeading
            badge={
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#efeaff] text-[#5b35f4]">
                <BookIcon />
              </span>
            }
            title="Notes"
            description="Organize your knowledge and build your personal knowledge base."
            actions={
              <PrimaryButton>
                + New Note
                <ChevronDown />
              </PrimaryButton>
            }
          />

          <div className="mt-8">
            <Tabs items={["All Notes", "My Notes", "Shared with me", "Bookmarked", "Trash"]} active="All Notes" />
          </div>

          <Toolbar>
            <SearchField placeholder="Search notes..." className="flex-1" />
            <div className="flex flex-1 flex-wrap gap-3 lg:justify-end">
              <FilterSelect label="All Categories" />
              <FilterSelect label="All Tags" />
              <FilterSelect label="All Visibility" />
              <FilterSelect label="Latest Updated" wide />
            </div>
          </Toolbar>

          <div className="mt-5 space-y-4">
            {notes.map(([title, description, visibility, updated, noteTags]) => (
              <Surface key={title} className="p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start">
                  <div className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-[22px] bg-[#f4f0ff] text-[30px] font-black text-[#5b35f4]">
                    {title
                      .split(" ")
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[28px] font-extrabold tracking-[-0.03em] text-[#141b2d]">{title}</h2>
                    <p className="mt-2 text-[14px] leading-7 text-[#5a6781]">{description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {noteTags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-5 text-[14px]">
                    <span className={`font-bold ${visibilityTone(visibility)}`}>{visibility}</span>
                    <div className="text-right text-[#738199]">
                      <div className="font-semibold">Updated</div>
                      <div className="mt-1">{updated}</div>
                    </div>
                    <button className="text-[#71809b]">
                      <BookmarkIcon />
                    </button>
                    <button className="text-[#71809b]">...</button>
                  </div>
                </div>
              </Surface>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {["<", "1", "2", "3", "...", "12", ">"].map((item, index) => (
              <button
                key={item}
                className={`grid h-10 min-w-10 place-items-center rounded-[12px] border px-3 text-[14px] font-bold ${
                  index === 1
                    ? "border-transparent bg-gradient-to-r from-[#5b35f4] to-[#744dff] text-white shadow-[0_14px_24px_rgba(91,53,244,0.18)]"
                    : "border-[var(--color-border)] bg-white text-[#4f5d78]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </main>

        <aside className="space-y-5">
          <RailCard title="Notes Overview">
            <div className="grid grid-cols-2 gap-3">
              <MetricTile value="128" label="Total Notes" icon={<ClipboardIcon />} />
              <MetricTile value="56" label="Public Notes" icon={<GlobeIcon />} />
              <MetricTile value="42" label="Private Notes" icon={<LockIcon />} />
              <MetricTile value="30" label="Shared Notes" icon={<UsersIcon />} />
            </div>
          </RailCard>

          <RailCard title="Categories" action={<button className="text-[13px] font-bold text-[#5b35f4]">View all</button>}>
            <div className="space-y-4">
              {categories.map(([name, count]) => (
                <div key={name} className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#f5f4ff] text-[#5b35f4]">
                    <BookIcon />
                  </div>
                  <div className="flex-1 text-[14px] font-bold text-[#141b2d]">{name}</div>
                  <div className="text-[13px] font-semibold text-[#78849b]">{count}</div>
                </div>
              ))}
            </div>
            <button className="mt-5 inline-flex text-[14px] font-bold text-[#5b35f4]">More categories</button>
          </RailCard>

          <RailCard title="Popular Tags" action={<button className="text-[13px] font-bold text-[#5b35f4]">View all</button>}>
            <div className="flex flex-wrap gap-2">
              {tags.map(([name, count]) => (
                <Tag key={name} tone="slate">
                  {name} {count}
                </Tag>
              ))}
            </div>
            <button className="mt-5 inline-flex text-[14px] font-bold text-[#5b35f4]">More tags</button>
          </RailCard>

          <RailCard title="Quick Actions">
            <div className="space-y-3">
              {[
                ["Import Notes", "Import from Markdown or Notion"],
                ["Export Notes", "Export your notes as PDF or MD"],
              ].map(([title, desc]) => (
                <button
                  key={title}
                  className="flex w-full items-center justify-between rounded-[16px] border border-[var(--color-border)] px-4 py-4 text-left"
                >
                  <div>
                    <div className="text-[14px] font-bold text-[#141b2d]">{title}</div>
                    <div className="mt-1 text-[13px] text-[#7d889e]">{desc}</div>
                  </div>
                  <span className="text-[#5b35f4]">&gt;</span>
                </button>
              ))}
            </div>
          </RailCard>
        </aside>
      </div>
    </PageShell>
  );
}

function visibilityTone(visibility: string) {
  if (visibility === "Public") return "text-[#16a34a]";
  if (visibility === "Private") return "text-[#f59e0b]";
  return "text-[#2563eb]";
}

function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h12v17l-6-4-6 4z" />
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

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
