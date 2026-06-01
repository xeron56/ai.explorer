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

const snippets = [
  ["Fast I/O (C++)", "Fast input/output for competitive programming in C++.", "C++", "2 days ago", ["io", "fast-io", "optimization"], ["ios::sync_with_stdio(false);", "cin.tie(NULL);", "cout.tie(NULL);"]],
  ["Dijkstra's Algorithm", "Shortest path from source to all nodes in a weighted graph.", "C++", "3 days ago", ["graph", "dijkstra", "shortest-path"], ["using pii = pair<int, int>;", "priority_queue<pii, vector<pii>,", "greater<pii>> pq;"]],
  ["Prime Check (Optimized)", "Check if a number is prime in O(sqrt(n)) time.", "Python", "5 days ago", ["math", "prime", "optimization"], ["if n < 2: return False", "for i in range(2, int(sqrt(n)) + 1):", "    if n % i == 0: return False"]],
  ["Debounce Function (JavaScript)", "Debounce a function call in JavaScript.", "JavaScript", "1 week ago", ["javascript", "debounce", "utility"], ["function debounce(func, delay) {", "  let timer;", "  return function(...args) {"]],
  ["Segment Tree (Range Sum)", "Segment Tree for range sum queries and point updates.", "C", "1 week ago", ["segment-tree", "data-structure", "range-query"], ["void build(int node, int l, int r) {", "  if (l == r) {", "    tree[node] = arr[l];"]],
  ["Union Find (Disjoint Set)", "Disjoint Set Union (Union Find) with path compression.", "Java", "2 weeks ago", ["dsu", "union-find", "disjoint-set"], ["int find(int x) {", "  if (parent[x] != x)", "    parent[x] = find(parent[x]);"]],
  ["Topological Sort (Kahn's Algorithm)", "Topological sorting using Kahn's algorithm (BFS).", "C++", "2 weeks ago", ["graph", "topological-sort", "bfs"], ["queue<int> q;", "vector<int> topo;", "for (int i = 1; i <= n; i++)"]],
] as const;

const collections = [
  ["Favorite Snippets", "23 snippets"],
  ["Graph Algorithms", "12 snippets"],
  ["DP Templates", "18 snippets"],
  ["Useful Utilities", "15 snippets"],
];

const languages = [
  ["C++", "166", "bg-[#5b35f4]"],
  ["Python", "98", "bg-[#2370ea]"],
  ["JavaScript", "67", "bg-[#f59e0b]"],
  ["Java", "45", "bg-[#f97316]"],
  ["C", "39", "bg-[#22c55e]"],
];

export const metadata = { title: "Snippets" };

export default function SnippetsPage() {
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
            title="Snippets"
            description="Organize and reuse your code snippets. Save time, write better code."
            actions={
              <PrimaryButton>
                + New Snippet
                <ChevronDown />
              </PrimaryButton>
            }
          />

          <div className="mt-8">
            <Tabs items={["All Snippets", "My Snippets", "Public Snippets", "Bookmarked"]} active="All Snippets" />
          </div>

          <Toolbar>
            <SearchField placeholder="Search snippets..." className="flex-1" />
            <div className="flex flex-1 flex-wrap gap-3 lg:justify-end">
              <FilterSelect label="All Languages" />
              <FilterSelect label="All Categories" />
              <FilterSelect label="All Tags" />
              <FilterSelect label="Latest" />
            </div>
          </Toolbar>

          <div className="mt-5 space-y-4">
            {snippets.map(([title, description, language, updated, tags, preview]) => (
              <Surface key={title} className="p-4">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px_120px]">
                  <div className="flex gap-4">
                    <div className={`grid h-[72px] w-[72px] shrink-0 place-items-center rounded-[20px] ${languageBg(language)} text-[26px] font-black ${languageText(language)}`}>
                      {languageShort(language)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-[26px] font-extrabold tracking-[-0.03em] text-[#141b2d]">{title}</h2>
                        <span className="text-[#93a0b6]">
                          {language === "C++" || language === "JavaScript" ? <LockIcon /> : <GlobeIcon />}
                        </span>
                      </div>
                      <p className="mt-2 text-[14px] leading-7 text-[#5a6781]">{description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[18px] border border-[var(--color-border)] bg-[#fbfbfe] px-4 py-3">
                    <pre className="overflow-x-auto text-[13px] leading-8 text-[#3a4964]">
                      <code>{preview.join("\n")}</code>
                    </pre>
                  </div>
                  <div className="flex items-start justify-between gap-4 lg:flex-col lg:items-end">
                    <div className="text-right">
                      <div className={`text-[14px] font-bold ${languageText(language)}`}>{language}</div>
                      <div className="mt-2 text-[13px] text-[#7d889e]">{updated}</div>
                    </div>
                    <div className="flex items-center gap-4 text-[#738099]">
                      <BookmarkIcon />
                      <span className="text-[18px]">...</span>
                    </div>
                  </div>
                </div>
              </Surface>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {["<", "1", "2", "3", "...", "15", ">"].map((item, index) => (
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
          <RailCard title="My Collections" action={<button className="text-[13px] font-bold text-[#5b35f4]">View all</button>}>
            <div className="space-y-4">
              {collections.map(([name, count]) => (
                <div key={name} className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#f7f5ff] text-[#5b35f4]">
                    <StarIcon />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#141b2d]">{name}</div>
                    <div className="text-[13px] text-[#7d889e]">{count}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-5 inline-flex text-[14px] font-bold text-[#5b35f4]">+ New Collection</button>
          </RailCard>

          <RailCard title="Popular Languages" action={<button className="text-[13px] font-bold text-[#5b35f4]">View all</button>}>
            <div className="space-y-4">
              {languages.map(([language, count, color]) => (
                <div key={language}>
                  <div className="mb-2 flex items-center justify-between text-[14px] font-bold text-[#141b2d]">
                    <span>{language}</span>
                    <span className="text-[13px] text-[#7d889e]">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#edf1f7]">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${Number(count) / 1.66}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </RailCard>

          <RailCard title="Snippet Stats">
            <div className="grid grid-cols-2 gap-3">
              <MetricTile value="236" label="Total Snippets" icon={<CodeIcon />} />
              <MetricTile value="89" label="Bookmarked" icon={<BookmarkIcon />} />
              <MetricTile value="147" label="Public Snippets" icon={<GlobeIcon />} />
              <MetricTile value="89" label="Private Snippets" icon={<LockIcon />} />
            </div>
          </RailCard>

          <RailCard title="Recent Activity">
            <div className="space-y-4 text-[14px] leading-6 text-[#516078]">
              <div>You created "Fast I/O (C++)" 2 days ago</div>
              <div>You updated "Dijkstra's Algorithm" 3 days ago</div>
              <div>You created "Prime Check (Optimized)" 5 days ago</div>
            </div>
            <button className="mt-5 inline-flex text-[14px] font-bold text-[#5b35f4]">View all activity</button>
          </RailCard>
        </aside>
      </div>
    </PageShell>
  );
}

function languageShort(language: string) {
  if (language === "JavaScript") return "JS";
  if (language === "Python") return "Py";
  return language[0];
}

function languageBg(language: string) {
  if (language === "C++") return "bg-[#efeaff]";
  if (language === "Python") return "bg-[#fff7de]";
  if (language === "JavaScript") return "bg-[#fff5c7]";
  if (language === "Java") return "bg-[#ffedd9]";
  return "bg-[#eafaf1]";
}

function languageText(language: string) {
  if (language === "C++") return "text-[#5b35f4]";
  if (language === "Python") return "text-[#2370ea]";
  if (language === "JavaScript") return "text-[#be8a00]";
  if (language === "Java") return "text-[#ea580c]";
  return "text-[#16a34a]";
}

function CodeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" />
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

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="m12 3.8 2.6 5.3 5.9.9-4.2 4.1 1 5.9L12 17.2 6.7 20l1-5.9L3.5 10l5.9-.9L12 3.8Z" />
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
