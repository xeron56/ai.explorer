import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRightIcon,
  ResearchIcon,
  SearchIcon,
  SparklesIcon,
} from "./_components/icons";

const posts = [
  {
    title: "Top 10 Dynamic Programming Patterns You Should Know",
    description: "A complete guide to the most common DP patterns with explanations and problems.",
    type: "Tutorial",
    tone: "purple",
    tags: ["Dynamic Programming", "Algorithms", "Patterns"],
    date: "May 12, 2024",
    read: "8 min read",
    stars: 124,
    art: "network",
  },
  {
    title: "My CP Journey: Lessons & Tips from 3 Years of Contests",
    description: "Sharing my journey, mistakes, learnings and tips that helped me grow in competitive programming.",
    type: "Contest Experience",
    tone: "green",
    tags: ["Contest", "Tips", "Journey"],
    date: "May 16, 2024",
    read: "10 min read",
    stars: 156,
    art: "path",
  },
  {
    title: "Understanding Binary Lifting with Practice Problems",
    description: "Learn binary lifting technique for LCA, k-th ancestor and more with code.",
    type: "Tutorial",
    tone: "purple",
    tags: ["Binary Lifting", "Trees", "Algorithms"],
    date: "May 9, 2024",
    read: "7 min read",
    stars: 98,
    art: "code",
  },
  {
    title: "Solution: Dijkstra's Algorithm (LeetCode 743)",
    description: "Step-by-step explanation and optimized solution.",
    type: "Problem Solution",
    tone: "orange",
    tags: ["Graphs", "Dijkstra", "LeetCode"],
    date: "May 7, 2024",
    read: "6 min read",
    stars: 72,
    art: "graph",
  },
  {
    title: "How I Improved from 1200 to 2000 Rating on Codeforces",
    description: "A detailed breakdown of my strategy, practice plan and mindset.",
    type: "Contest Experience",
    tone: "green",
    tags: ["Codeforces", "Rating", "Strategy"],
    date: "May 8, 2024",
    read: "9 min read",
    stars: 134,
    art: "quote",
  },
  {
    title: "5 C++ STL Tricks Every CP Coder Should Know",
    description: "Boost your coding speed with these handy STL tricks.",
    type: "Tips & Tricks",
    tone: "blue",
    tags: ["STL", "C++", "Tips"],
    date: "May 5, 2024",
    read: "5 min read",
    stars: 65,
    art: "code",
  },
];

const tabs = ["All Posts", "Tutorials", "Contest Experiences", "Problem Solutions", "Tips & Tricks"];

const topicRows = [
  ["Dynamic Programming", 18, "text-amber-500"],
  ["Graphs", 16, "text-emerald-500"],
  ["Greedy", 12, "text-lime-500"],
  ["Data Structures", 24, "text-orange-500"],
  ["Binary Search", 8, "text-red-500"],
] as const;

const contests = [
  ["Codeforces Round 958", "May 18, 2024", "17:05:00", "cf"],
  ["AtCoder Beginner Contest 345", "May 19, 2024", "14:00:00", "ac"],
  ["CodeChef Starters 121", "May 20, 2024", "20:00:00", "cc"],
] as const;

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[1280px] pb-8 pt-7">
      <Hero />
      <Toolbar />
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_270px]">
        <section className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.title} post={post} />
          ))}
          <Pagination />
        </section>
        <RightRail />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="grid min-h-[282px] items-center gap-6 border-b border-[var(--color-border)] pb-9 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <span className="inline-flex rounded-[6px] bg-[#efe9ff] px-3 py-2 text-[12px] font-extrabold uppercase leading-none text-[#673cff]">
          Programming Blog
        </span>
        <h1 className="mt-6 text-[34px] font-extrabold leading-[1.13] tracking-[-0.01em] text-[#12182b] md:text-[44px]">
          Code. Solve. <span className="text-[#6336f5]">Conquer.</span> <span aria-hidden>🚀</span>
        </h1>
        <p className="mt-5 max-w-[58ch] text-[15px] leading-8 text-[#34415d]">
          Thoughts, tutorials, and experiences from my coding journey and programming contests.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="inline-flex h-11 items-center gap-2 rounded-[7px] bg-gradient-to-r from-[#5a31f4] to-[#764fff] px-5 text-[14px] font-semibold text-white shadow-[0_14px_28px_rgba(91,53,244,0.2)] transition-transform hover:-translate-y-0.5"
          >
            <span className="text-xl leading-none">+</span> New Post
          </Link>
          <Link
            href="/learning"
            className="inline-flex h-11 items-center gap-2 rounded-[7px] border border-[#dbe1ec] bg-white px-5 text-[14px] font-semibold text-[#17213a] shadow-sm transition-colors hover:bg-[#f8f9fc]"
          >
            <SearchIcon width={17} height={17} /> Explore Topics
          </Link>
        </div>
      </div>
      <div className="relative hidden min-h-[245px] items-center justify-center lg:flex">
        <HeroArtwork />
      </div>
    </section>
  );
}

function Toolbar() {
  return (
    <div className="mt-5 flex flex-col gap-4 rounded-[8px] border border-[#dfe4ef] bg-white px-5 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.03)] lg:flex-row lg:items-center">
      <div className="flex min-w-0 flex-1 gap-8 overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`relative h-9 shrink-0 text-[13px] font-semibold ${
              index === 0 ? "text-[#6336f5]" : "text-[#33405c]"
            }`}
          >
            {tab}
            {index === 0 && <span className="absolute bottom-[-13px] left-0 h-[2px] w-full rounded-full bg-[#6336f5]" />}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 text-[13px] text-[#33405c]">
        <span>Sort by:</span>
        <button className="inline-flex h-9 items-center gap-3 rounded-[7px] border border-[#dfe4ef] px-4 font-semibold text-[#17213a]">
          Latest <span className="text-[10px]">⌄</span>
        </button>
        <div className="flex h-9 overflow-hidden rounded-[7px] border border-[#dfe4ef]">
          <IconButton active icon="list" />
          <IconButton active icon="grid4" purple />
          <IconButton icon="grid9" />
        </div>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: (typeof posts)[number] }) {
  return (
    <article className="grid gap-6 rounded-[8px] border border-[#dfe4ef] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.025)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(70,54,140,0.08)] md:grid-cols-[196px_1fr]">
      <div className="aspect-[1.18] overflow-hidden rounded-[7px] border border-[#e1e6f2] bg-[#f8f9ff]">
        <PostArt variant={post.art} />
      </div>
      <div className="relative min-w-0 pr-9">
        <Badge tone={post.tone}>{post.type}</Badge>
        <h2 className="mt-3 max-w-[620px] text-[19px] font-extrabold leading-[1.35] tracking-[-0.01em] text-[#111827]">
          <Link href="/blog" className="hover:text-[#6336f5]">{post.title}</Link>
        </h2>
        <p className="mt-3 max-w-[620px] text-[13.5px] leading-6 text-[#33405c]">{post.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-[#eeeaff] px-3 py-1 text-[11px] font-bold text-[#5635db]">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px] font-medium text-[#33405c]">
          <span>{post.date}</span>
          <span className="text-[#9aa4b7]">•</span>
          <span>{post.read}</span>
          <span className="text-[#9aa4b7]">•</span>
          <span className="inline-flex items-center gap-1 text-[#17213a]">
            <span className="text-[#ff9800]">☆</span> {post.stars}
          </span>
        </div>
        <button aria-label="Bookmark post" className="absolute right-6 top-1 text-[#17213a] hover:text-[#6336f5]">
          <BookmarkIcon />
        </button>
        <button aria-label="More options" className="absolute right-0 top-1 text-[#17213a] hover:text-[#6336f5]">
          <MoreIcon />
        </button>
      </div>
    </article>
  );
}

function RightRail() {
  return (
    <aside className="space-y-4">
      <RailCard title="About This Blog">
        <p className="text-[13px] leading-6 text-[#33405c]">
          This blog is where I write about programming, data structures, algorithms, and my experiences in competitive programming contests.
        </p>
        <ul className="mt-5 space-y-4 text-[13px] font-medium text-[#33405c]">
          {["Write tutorials", "Share solutions", "Document journeys", "Help others grow"].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <SparklesIcon width={16} height={16} className="text-[#6336f5]" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[13px] font-medium text-[#33405c]">Let's grow together! <span className="text-[#6336f5]">♥</span></p>
      </RailCard>
      <RailCard title="Top Topics">
        <div className="space-y-3">
          {topicRows.map(([topic, count, color]) => (
            <div key={topic} className="flex items-center gap-3 text-[13px] font-medium text-[#33405c]">
              <ResearchIcon width={15} height={15} className={color} />
              <span className="flex-1">{topic}</span>
              <span className="rounded-full bg-[#f0f3f9] px-2 py-0.5 text-[11px] font-bold text-[#33405c]">{count}</span>
            </div>
          ))}
        </div>
        <RailLink label="View all topics" />
      </RailCard>
      <RailCard title="Popular Tags">
        <div className="flex flex-wrap gap-2">
          {["dp", "graphs", "math", "greedy", "trees", "binary search", "bitmasks", "implementation", "strings", "stl", "contest", "tips"].map((tag) => (
            <span key={tag} className="rounded-full bg-[#eeeaff] px-3 py-1 text-[11px] font-bold text-[#5e39e8]">{tag}</span>
          ))}
        </div>
        <RailLink label="View all tags" />
      </RailCard>
      <RailCard title="Contest Calendar">
        <div className="space-y-4">
          {contests.map(([name, date, time, logo]) => (
            <div key={name} className="flex items-center gap-3">
              <ContestLogo logo={logo} />
              <div className="min-w-0">
                <div className="truncate text-[12px] font-extrabold text-[#111827]">{name}</div>
                <div className="mt-1 text-[11.5px] text-[#526079]">{date} <span className="px-1">•</span> {time}</div>
              </div>
            </div>
          ))}
        </div>
        <RailLink label="View all contests" />
      </RailCard>
      <RailCard title="Keep the streak alive! 🔥">
        <div className="flex items-end justify-between">
          <p className="max-w-[130px] text-[12px] leading-5 text-[#526079]">Solve daily. Write daily. Get better daily.</p>
          <div className="text-right">
            <div className="text-[34px] font-extrabold leading-none text-[#111827]">12</div>
            <div className="text-[11px] font-medium text-[#526079]">Day Streak</div>
          </div>
        </div>
        <StreakChart />
        <button className="mt-4 h-9 w-full rounded-[7px] border border-[#dfe4ef] text-[12px] font-bold text-[#6336f5]">View Stats</button>
      </RailCard>
    </aside>
  );
}

function RailCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[8px] border border-[#dfe4ef] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.025)]">
      <h3 className="mb-5 text-[17px] font-extrabold tracking-[-0.01em] text-[#111827]">{title}</h3>
      {children}
    </section>
  );
}

function RailLink({ label }: { label: string }) {
  return (
    <Link href="/blog" className="mt-5 inline-flex items-center gap-2 text-[13px] font-bold text-[#6336f5]">
      {label} <ArrowRightIcon width={14} height={14} />
    </Link>
  );
}

function Pagination() {
  return (
    <div className="flex items-center justify-center gap-2 pt-1">
      {["‹", "1", "2", "3", "...", "12", "›"].map((item) => (
        <button
          key={item}
          className={`h-9 min-w-9 rounded-[7px] border border-[#dfe4ef] px-3 text-[13px] font-bold ${
            item === "1" ? "bg-[#6336f5] text-white" : "bg-white text-[#17213a]"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function Badge({ tone, children }: { tone: string; children: ReactNode }) {
  const classes: Record<string, string> = {
    purple: "bg-[#eeeaff] text-[#5e39e8]",
    green: "bg-[#def9e9] text-[#087d42]",
    orange: "bg-[#fff0dc] text-[#f06b00]",
    blue: "bg-[#e9f0ff] text-[#315bea]",
  };
  return (
    <span className={`inline-flex rounded-[6px] px-2.5 py-1 text-[10px] font-extrabold uppercase leading-none ${classes[tone]}`}>
      {children}
    </span>
  );
}

function IconButton({ icon, active = false, purple = false }: { icon: "list" | "grid4" | "grid9"; active?: boolean; purple?: boolean }) {
  return (
    <button className={`grid w-10 place-items-center border-r border-[#dfe4ef] last:border-r-0 ${purple ? "bg-[#f2efff] text-[#6336f5]" : active ? "bg-white text-[#17213a]" : "bg-white text-[#526079]"}`}>
      <MiniToolbarIcon icon={icon} />
    </button>
  );
}

function MiniToolbarIcon({ icon }: { icon: "list" | "grid4" | "grid9" }) {
  if (icon === "list") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4.5 4h8M4.5 8h8M4.5 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M2.5 4h.01M2.5 8h.01M2.5 12h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }
  const cells = icon === "grid4" ? [3, 9] : [2.5, 7, 11.5];
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      {cells.flatMap((x) => cells.map((y) => <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" rx=".8" stroke="currentColor" strokeWidth="1.3" />))}
    </svg>
  );
}

function HeroArtwork() {
  return (
    <div className="relative h-[245px] w-[455px]">
      <div className="absolute left-[88px] top-[28px] h-[158px] w-[258px] rotate-[-4deg] rounded-[22px] border border-[#dce3f1] bg-white shadow-[0_22px_50px_rgba(58,74,122,0.16)]">
        <div className="flex h-8 items-center gap-1.5 border-b border-[#eef1f6] px-5">
          <span className="h-2 w-2 rounded-full bg-[#ff6f61]" />
          <span className="h-2 w-2 rounded-full bg-[#ffca3a]" />
          <span className="h-2 w-2 rounded-full bg-[#25c46b]" />
          <span className="ml-auto h-2 w-2 rounded-full bg-[#6336f5]" />
          <span className="h-2 w-2 rounded-full bg-[#6336f5]" />
          <span className="h-2 w-2 rounded-full bg-[#6336f5]" />
        </div>
        <div className="space-y-2 p-5 font-mono text-[8px] font-bold">
          <CodeLine w="72%" c="#6336f5" />
          <CodeLine w="58%" c="#ff7a00" />
          <CodeLine w="78%" c="#16a34a" />
          <CodeLine w="44%" c="#2f74ff" indent />
          <CodeLine w="68%" c="#ec4899" indent />
          <CodeLine w="52%" c="#6336f5" />
          <CodeLine w="74%" c="#16a34a" indent />
          <CodeLine w="38%" c="#ff7a00" />
        </div>
      </div>
      <div className="absolute left-[24px] top-[92px] grid h-[68px] w-[68px] rotate-[8deg] place-items-center rounded-[15px] bg-gradient-to-br from-[#17d568] to-[#08a94f] text-[28px] font-black text-white shadow-[0_18px_30px_rgba(17,173,83,0.25)]">
        {"{}"}
      </div>
      <div className="absolute bottom-[25px] right-[94px] grid h-[76px] w-[84px] rotate-[2deg] place-items-center rounded-[17px] border border-[#d8d0ff] bg-[#eeeaff] text-[34px] font-black text-[#6336f5] shadow-[0_16px_34px_rgba(91,53,244,0.18)]">
        &lt;/&gt;
      </div>
      <div className="absolute bottom-[22px] right-0 text-[102px] leading-none drop-shadow-[0_18px_22px_rgba(245,158,11,0.18)]">🏆</div>
      <span className="absolute right-[18px] top-[70px] text-[18px] text-[#ff8a00]">✧</span>
      <span className="absolute left-[30px] bottom-[72px] text-[22px] text-[#a78bfa]">✦</span>
      <span className="absolute right-[72px] top-[28px] text-[16px] text-[#c7ddff]">✦</span>
    </div>
  );
}

function CodeLine({ w, c, indent = false }: { w: string; c: string; indent?: boolean }) {
  return <div className={`h-2 rounded-full ${indent ? "ml-8" : ""}`} style={{ width: w, backgroundColor: c, opacity: 0.75 }} />;
}

function PostArt({ variant }: { variant: string }) {
  if (variant === "network") return <NetworkArt />;
  if (variant === "path") return <PathArt />;
  if (variant === "graph") return <GraphArt />;
  if (variant === "quote") return <QuoteArt />;
  return <CodeArt />;
}

function NetworkArt() {
  return (
    <svg viewBox="0 0 220 186" className="h-full w-full bg-[#110c35]">
      <defs>
        <radialGradient id="netGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#7c3cff" stopOpacity=".55" />
          <stop offset="100%" stopColor="#110c35" />
        </radialGradient>
      </defs>
      <rect width="220" height="186" fill="url(#netGlow)" />
      <g stroke="#bfb2ff" strokeWidth="1" opacity=".7">
        <path d="M42 84 78 42 124 49 160 83 148 130 96 146 50 120Z" />
        <path d="M78 42 96 146M124 49 50 120M160 83 42 84M148 130 78 42" />
        <path d="M70 77 112 67 137 105 104 126Z" />
      </g>
      {[42,84,78,42,124,49,160,83,148,130,96,146,50,120,70,77,112,67,137,105,104,126].map((v, i, a) =>
        i % 2 === 0 ? <circle key={i} cx={v} cy={a[i + 1]} r="3.4" fill="#fff" /> : null
      )}
      <circle cx="123" cy="128" r="5" fill="#28c7ff" />
    </svg>
  );
}

function PathArt() {
  return (
    <svg viewBox="0 0 220 186" className="h-full w-full bg-[#fbfaff]">
      <path d="M42 122c48 8 38-46 82-27 40 17 27-35 61-31" fill="none" stroke="#8b5cf6" strokeWidth="5" strokeLinecap="round" strokeDasharray="10 8" />
      <g fill="#8b5cf6">
        <path d="M52 58h28v18H52z" opacity=".85" /><path d="M80 58l18 9-18 9z" />
        <path d="M126 35h28v18h-28z" opacity=".85" /><path d="M154 35l18 9-18 9z" />
        <path d="M161 85h28v18h-28z" opacity=".85" /><path d="M189 85l18 9-18 9z" />
      </g>
      <g stroke="#d9d4ff" strokeWidth="1">
        <path d="M0 156h220M34 0v186M112 0v186M188 0v186" />
      </g>
      <circle cx="42" cy="122" r="12" fill="#8b5cf6" opacity=".18" />
      <circle cx="124" cy="95" r="12" fill="#8b5cf6" opacity=".18" />
      <circle cx="185" cy="64" r="12" fill="#8b5cf6" opacity=".18" />
    </svg>
  );
}

function CodeArt() {
  return (
    <div className="h-full w-full bg-[#fbfbff] p-5 font-mono text-[10px] font-bold leading-5">
      {["template<class T>", "void solve(){", "  vector<int> dist(n);", "  priority_queue<Node> pq;", "  while(!pq.empty()) {", "    auto u = pq.top();", "    relax(edges[u]);", "  }", "}"].map((line, index) => (
        <div key={line} className={index % 3 === 0 ? "text-[#ef4444]" : index % 3 === 1 ? "text-[#6336f5]" : "text-[#0891b2]"}>
          {line}
        </div>
      ))}
    </div>
  );
}

function GraphArt() {
  const nodes = [
    [42, 48, "A", "#5b6dff"],
    [162, 48, "B", "#ed3dbb"],
    [95, 90, "C", "#ef4444"],
    [42, 128, "C", "#5b6dff"],
    [162, 128, "D", "#ff6b4a"],
  ] as const;
  return (
    <svg viewBox="0 0 220 186" className="h-full w-full bg-[#fbfbff]">
      <g stroke="#cbd5e1" strokeWidth="2">
        <path d="M42 48 162 48 95 90 42 48 42 128 95 90 162 128 162 48" />
        <path d="M42 128 162 128" />
      </g>
      {nodes.map(([x, y, label, color]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="15" fill="#fff" stroke={color} strokeWidth="3" />
          <text x={x} y={y + 5} textAnchor="middle" fontSize="16" fontWeight="800" fill={color}>{label}</text>
        </g>
      ))}
    </svg>
  );
}

function QuoteArt() {
  return (
    <div className="grid h-full w-full place-items-center bg-[#fbfbff] text-center text-[32px] font-extrabold leading-[1.12] text-[#5f46f2]">
      <div>CODE<br />FAST<br />WIN<br />OFTEN</div>
    </div>
  );
}

function BookmarkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5.5 3.5h9v13l-4.5-2.8-4.5 2.8v-13Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
      <circle cx="9" cy="5" r="1.4" fill="currentColor" />
      <circle cx="9" cy="10" r="1.4" fill="currentColor" />
      <circle cx="9" cy="15" r="1.4" fill="currentColor" />
    </svg>
  );
}

function ContestLogo({ logo }: { logo: string }) {
  const classes: Record<string, string> = {
    cf: "bg-[#fff3e6] text-[#2f74ff]",
    ac: "bg-[#f2f5f9] text-[#111827]",
    cc: "bg-[#fff7ed] text-[#b45309]",
  };
  return (
    <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-[7px] text-[12px] font-black ${classes[logo]}`}>
      {logo}
    </div>
  );
}

function StreakChart() {
  return (
    <svg viewBox="0 0 220 86" className="mt-4 h-[86px] w-full">
      <path d="M10 66 36 48 62 28 88 56 114 22 140 18 166 64 192 50 214 42" fill="none" stroke="#7c3aed" strokeWidth="2" />
      <path d="M10 66 36 48 62 28 88 56 114 22 140 18 166 64 192 50 214 42 214 84 10 84Z" fill="#7c3aed" opacity=".08" />
      {[10,36,62,88,114,140,166,192,214].map((x, i) => (
        <circle key={x} cx={x} cy={[66,48,28,56,22,18,64,50,42][i]} r="3.4" fill="#7c3aed" />
      ))}
      {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
        <text key={`${d}-${i}`} x={18 + i * 31} y="84" fontSize="10" fontWeight="700" fill="#526079">{d}</text>
      ))}
    </svg>
  );
}
