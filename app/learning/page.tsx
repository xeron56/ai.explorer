import {
  FilterSelect,
  GhostButton,
  PageHeading,
  PageShell,
  RailCard,
  SearchField,
  Surface,
  Tabs,
  Tag,
  Toolbar,
} from "../_components/pagePrimitives";

const topics = [
  ["Data Structures", "Arrays, Linked List, Stack, Queue, Tree and more.", "24 tutorials", "blue"],
  ["Algorithms", "Sorting, Searching, Greedy, Recursion and more.", "31 tutorials", "green"],
  ["Dynamic Programming", "Learn DP concepts, patterns and problem solving.", "18 tutorials", "purple"],
  ["Graphs", "BFS, DFS, Shortest Path, Topological Sort and more.", "16 tutorials", "orange"],
  ["Strings", "Manipulation, Pattern Searching, Hashing.", "10 tutorials", "pink"],
  ["Math", "Number Theory, GCD, LCM, Prime, Combinatorics.", "9 tutorials", "amber"],
  ["Binary Search", "Binary Search, Search Space, Problems and more.", "8 tutorials", "teal"],
  ["Greedy", "Greedy Techniques, Proofs and Problems.", "12 tutorials", "red"],
  ["Implementation", "Simulation, Adhoc, Case Work and more.", "14 tutorials", "sky"],
  ["Bit Manipulation", "Bits, Masks, Shifts, XOR and more.", "7 tutorials", "violet"],
  ["Advanced Topics", "Advanced algorithms and specialized techniques.", "11 tutorials", "indigo"],
  ["Miscellaneous", "Misc concepts and quick guides.", "6 tutorials", "slate"],
] as const;

const latest = [
  ["Understanding Time Complexity", "Learn how time complexity works and how to analyze the efficiency of your code.", "May 16, 2024", "8 min read", "Beginner", "purple"],
  ["Top 5 Dynamic Programming Patterns you must know", "Master the most important DP patterns with examples and problems.", "May 12, 2024", "12 min read", "Intermediate", "green"],
  ["Graph Traversal: BFS vs DFS", "A complete comparison of BFS and DFS with examples and use cases.", "May 8, 2024", "10 min read", "Intermediate", "orange"],
] as const;

const pathSteps = [
  ["C++ Basics", "12 tutorials", "Completed"],
  ["Data Structures", "24 tutorials", "In Progress"],
  ["Algorithms", "18 tutorials", "Not Started"],
  ["Dynamic Programming", "15 tutorials", "Not Started"],
  ["Advanced Topics", "10 tutorials", "Not Started"],
];

const popular = [
  ["Two Pointers Technique", "24.5K views", "Easy"],
  ["Sliding Window Technique", "18.2K views", "Medium"],
  ["Topological Sort in Graph", "15.7K views", "Medium"],
  ["Segment Tree Explained", "12.1K views", "Hard"],
  ["Prime Number Algorithms", "10.3K views", "Easy"],
];

export const metadata = { title: "Tutorials" };

export default function TutorialsPage() {
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
            title="Tutorials"
            description="Learn concepts, explore tutorials and level up your programming skills."
          />

          <div className="mt-8">
            <Tabs
              items={["All Tutorials", "Learning Paths", "By Topics", "For Beginners", "Advanced"]}
              active="All Tutorials"
            />
          </div>

          <Toolbar>
            <SearchField placeholder="Search tutorials..." className="flex-1" />
            <div className="flex flex-1 flex-wrap gap-3 lg:justify-end">
              <FilterSelect label="All Levels" />
              <FilterSelect label="All Topics" />
              <FilterSelect label="All Languages" />
              <FilterSelect label="Latest" />
            </div>
          </Toolbar>

          <section className="mt-7">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#12182b]">Browse by Topics</h2>
              <button className="text-[14px] font-bold text-[#5b35f4]">View all topics</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
              {topics.map(([title, description, count, tone]) => (
                <Surface key={title} className="p-5">
                  <div className={`grid h-14 w-14 place-items-center rounded-[18px] ${toneBg(tone)} ${toneText(tone)}`}>
                    <TopicBadge tone={tone} />
                  </div>
                  <h3 className="mt-5 text-[20px] font-extrabold tracking-[-0.02em] text-[#141b2d]">{title}</h3>
                  <p className="mt-3 text-[14px] leading-7 text-[#5a6781]">{description}</p>
                  <div className={`mt-5 text-[14px] font-bold ${toneText(tone)}`}>{count}</div>
                </Surface>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#12182b]">Latest Tutorials</h2>
              <button className="text-[14px] font-bold text-[#5b35f4]">View all tutorials</button>
            </div>
            <div className="space-y-4">
              {latest.map(([title, description, date, read, level, tone]) => (
                <Surface key={title} className="p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className={`grid h-[92px] w-[92px] shrink-0 place-items-center rounded-[24px] ${toneBg(tone)} ${toneText(tone)}`}>
                      <TopicBadge tone={tone} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[26px] font-extrabold tracking-[-0.03em] text-[#141b2d]">{title}</h3>
                      <p className="mt-2 text-[14px] leading-7 text-[#596780]">{description}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px] text-[#738099]">
                        <span>{date}</span>
                        <span>{read}</span>
                        <Tag tone={level === "Beginner" ? "green" : "orange"}>{level}</Tag>
                      </div>
                    </div>
                    <button className="self-start text-[#70809a]">
                      <BookmarkIcon />
                    </button>
                  </div>
                </Surface>
              ))}
            </div>
          </section>
        </main>

        <aside className="space-y-5">
          <RailCard title="Learning Path" action={<button className="text-[13px] font-bold text-[#5b35f4]">View all</button>}>
            <div className="space-y-5">
              {pathSteps.map(([title, total, status], index) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`grid h-8 w-8 place-items-center rounded-full text-[13px] font-bold ${index < 2 ? "bg-[#5b35f4] text-white" : "bg-[#eef1f6] text-[#526078]"}`}>
                      {index + 1}
                    </div>
                    {index !== pathSteps.length - 1 ? <div className="mt-2 h-10 w-px bg-[#dde3ef]" /> : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-bold text-[#141b2d]">{title}</div>
                    <div className="mt-1 text-[13px] text-[#76839a]">{total}</div>
                  </div>
                  <span className={`text-[13px] font-bold ${status === "Completed" ? "text-[#16a34a]" : status === "In Progress" ? "text-[#5b35f4]" : "text-[#7d889d]"}`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </RailCard>

          <RailCard title="Popular Tutorials" action={<button className="text-[13px] font-bold text-[#5b35f4]">View all</button>}>
            <div className="space-y-4">
              {popular.map(([title, views, level], index) => (
                <div key={title} className="flex items-center gap-3">
                  <div className="text-[13px] font-bold text-[#7d889e]">{index + 1}</div>
                  <div className="grid h-12 w-12 place-items-center rounded-[14px] bg-[#f4f7ff] text-[#5b35f4]">
                    <BookIcon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-bold text-[#141b2d]">{title}</div>
                    <div className="mt-1 text-[13px] text-[#7d889e]">{views}</div>
                  </div>
                  <Tag tone={level === "Easy" ? "green" : level === "Hard" ? "red" : "orange"}>{level}</Tag>
                </div>
              ))}
            </div>
          </RailCard>

          <Surface className="overflow-hidden bg-[linear-gradient(180deg,#f7f3ff_0%,#fff_100%)] p-5">
            <div className="grid h-12 w-12 place-items-center rounded-[16px] bg-white text-[#5b35f4] shadow-sm">
              <BellIcon />
            </div>
            <h3 className="mt-5 text-[24px] font-extrabold tracking-[-0.03em] text-[#141b2d]">Stay in the loop!</h3>
            <p className="mt-3 text-[14px] leading-7 text-[#5d6b84]">
              Get the latest tutorials and resources straight to your inbox.
            </p>
            <input
              className="mt-5 h-[46px] w-full rounded-[14px] border border-[var(--color-border)] px-4 text-[14px] outline-none placeholder:text-[#7c879b]"
              placeholder="Enter your email"
            />
            <GhostButton className="mt-4 w-full border-transparent bg-gradient-to-r from-[#5b35f4] to-[#744dff] text-white">
              Subscribe
            </GhostButton>
          </Surface>
        </aside>
      </div>
    </PageShell>
  );
}

function toneBg(tone: string) {
  if (tone === "blue") return "bg-[#eef5ff]";
  if (tone === "green") return "bg-[#edfdf3]";
  if (tone === "purple") return "bg-[#f3efff]";
  if (tone === "orange") return "bg-[#fff4ea]";
  if (tone === "pink") return "bg-[#fff0f6]";
  if (tone === "amber") return "bg-[#fff7e9]";
  if (tone === "teal") return "bg-[#ecfeff]";
  if (tone === "red") return "bg-[#fff1f2]";
  if (tone === "sky") return "bg-[#eff6ff]";
  if (tone === "violet") return "bg-[#f5f3ff]";
  if (tone === "indigo") return "bg-[#eef2ff]";
  return "bg-[#f3f5f9]";
}

function toneText(tone: string) {
  if (tone === "blue" || tone === "sky") return "text-[#2370ea]";
  if (tone === "green") return "text-[#1f9c5c]";
  if (tone === "purple" || tone === "violet" || tone === "indigo") return "text-[#5b35f4]";
  if (tone === "orange" || tone === "amber") return "text-[#f18b1f]";
  if (tone === "pink" || tone === "red") return "text-[#db2777]";
  if (tone === "teal") return "text-[#0f766e]";
  return "text-[#64748b]";
}

function TopicBadge({ tone }: { tone: string }) {
  if (tone === "green") {
    return <FlowIcon />;
  }
  if (tone === "orange" || tone === "amber") {
    return <SigmaIcon />;
  }
  if (tone === "purple" || tone === "violet" || tone === "indigo") {
    return <GridIcon />;
  }
  if (tone === "pink" || tone === "red") {
    return <AaIcon />;
  }
  return <BookIcon />;
}

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}

function FlowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="M8 6h8M7.5 7.5 11 16M16.5 7.5 13 16" />
    </svg>
  );
}

function SigmaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 4H8l6 8-6 8h10" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M12 4v16M4 12h16" />
    </svg>
  );
}

function AaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 18 4-12 4 12" />
      <path d="M6.5 14h5" />
      <path d="M15 8h4M17 8v10M15 18h4" />
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

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}
