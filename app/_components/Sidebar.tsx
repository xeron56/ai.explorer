"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GithubIcon,
  LogoIcon,
  MailIcon,
  ResearchIcon,
  RssIcon,
  TwitterIcon,
} from "./icons";
import { SidebarNav } from "./SidebarNav";

const categories = [
  { label: "Data Structures", count: 24, color: "text-amber-400" },
  { label: "Algorithms", count: 31, color: "text-emerald-400" },
  { label: "Dynamic Programming", count: 18, color: "text-lime-400" },
  { label: "Graphs", count: 16, color: "text-fuchsia-400" },
  { label: "Greedy", count: 12, color: "text-red-400" },
  { label: "Math", count: 9, color: "text-orange-400" },
  { label: "Implementation", count: 14, color: "text-green-400" },
  { label: "Strings", count: 10, color: "text-violet-400" },
  { label: "Binary Search", count: 8, color: "text-sky-400" },
];

const sidebarContext = {
  default: {
    recentTitle: "Recent Posts",
    recentItems: [
      { title: "My CP Journey: Lessons & Tips", meta: "May 16, 2024", art: "graph", href: "/blog" },
      { title: "Top 10 DP Patterns You Should Know", meta: "May 12, 2024", art: "flow", href: "/blog" },
      { title: "How I Improved from 1200 to 2000 Rating", meta: "May 8, 2024", art: "code", href: "/blog" },
    ],
    footer: "streak" as const,
  },
  snippets: {
    recentTitle: "Recent Snippets",
    recentItems: [
      { title: "Fast I/O (C++)", meta: "C++ • 2 days ago", art: "cpp", href: "/snippets" },
      { title: "Dijkstra's Algorithm", meta: "C++ • 3 days ago", art: "cpp", href: "/snippets" },
      { title: "Prime Check (Optimized)", meta: "Python • 5 days ago", art: "py", href: "/snippets" },
    ],
    footer: "streak" as const,
  },
  notes: {
    recentTitle: "Recent Notes",
    recentItems: [
      { title: "Top 10 DP Patterns", meta: "May 12, 2024", art: "note", href: "/notes" },
      { title: "BFS vs DFS", meta: "May 8, 2024", art: "flow", href: "/notes" },
      { title: "Two Pointers Technique", meta: "May 5, 2024", art: "code", href: "/notes" },
      { title: "Time Complexity Cheatsheet", meta: "May 2, 2024", art: "graph", href: "/notes" },
    ],
    footer: "streak" as const,
  },
  learning: {
    recentTitle: "Recent Tutorials",
    recentItems: [
      { title: "Understanding Time Complexity", meta: "May 16, 2024", art: "note", href: "/tutorials" },
      { title: "Top 5 DP Patterns", meta: "May 12, 2024", art: "flow", href: "/tutorials" },
      { title: "Graph Traversal: BFS vs DFS", meta: "May 8, 2024", art: "graph", href: "/tutorials" },
    ],
    footer: "streak" as const,
  },
  projects: {
    recentTitle: "Recent Problems",
    recentItems: [
      { title: "Two Sum", meta: "Easy", art: "code", href: "/problems" },
      { title: "Add Two Numbers", meta: "Medium", art: "flow", href: "/problems" },
      { title: "Longest Substring", meta: "Medium", art: "note", href: "/problems" },
      { title: "Surrounded Regions", meta: "Hard", art: "graph", href: "/problems" },
    ],
    footer: "streak" as const,
  },
  about: {
    recentTitle: "Recent Activity",
    recentItems: [
      { title: "Participated in Codeforces Round 957", meta: "2 hours ago", art: "trophy", href: "/about" },
      { title: 'Solved "Two Sum" problem', meta: "5 hours ago", art: "check", href: "/about" },
      { title: 'Bookmarked "Dijkstra\'s Algorithm"', meta: "Yesterday", art: "bookmark", href: "/about" },
    ],
    footer: "social" as const,
  },
};

export function Sidebar() {
  const pathname = usePathname();
  const context = pathname.startsWith("/snippets")
    ? sidebarContext.snippets
    : pathname.startsWith("/notes")
      ? sidebarContext.notes
      : pathname.startsWith("/learning") || pathname.startsWith("/tutorials")
        ? sidebarContext.learning
        : pathname.startsWith("/projects") || pathname.startsWith("/problems")
          ? sidebarContext.projects
          : pathname.startsWith("/about")
            ? sidebarContext.about
            : sidebarContext.default;

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-[246px] flex-col overflow-y-auto bg-[linear-gradient(180deg,#081225_0%,#071426_100%)] text-white shadow-[inset_-1px_0_0_rgba(255,255,255,0.06)] lg:flex">
      <div className="px-7 pb-4 pt-[31px]">
        <Link href="/" className="flex items-center gap-[13px]">
          <span className="text-[#714cff]">
            <LogoIcon width={42} height={42} />
          </span>
          <span className="text-[20px] font-bold tracking-[-0.02em]">code.explorer</span>
        </Link>
        <p className="mt-[42px] text-[14px] leading-[25px] text-slate-200">
          My space to write, learn and share everything about programming and contests.
        </p>
      </div>

      <SidebarNav />

      <div className="mx-7 mt-[26px] border-t border-white/[0.08] pt-[24px]">
        <h3 className="mb-[18px] text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">Categories</h3>
        <ul className="flex flex-col gap-[13px]">
          {categories.map((item) => (
            <li key={item.label}>
              <Link
                href="/blog"
                className="group flex items-center gap-[12px] text-[12.5px] font-semibold text-slate-200 transition-colors hover:text-white"
              >
                <ResearchIcon width={16} height={16} className={item.color} />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-200">{item.count}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/blog" className="mt-[18px] inline-flex text-[13px] font-semibold text-[#a78bfa] hover:text-white">
          View all categories
        </Link>
      </div>

      <div className="mx-7 mt-[25px] border-t border-white/[0.08] pt-[24px]">
        <h3 className="mb-[19px] text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">
          {context.recentTitle}
        </h3>
        <ul className="flex flex-col gap-[17px]">
          {context.recentItems.map((item) => (
            <li key={item.title}>
              <Link href={item.href} className="group flex items-start gap-[12px]">
                <RecentThumb variant={item.art} />
                <div className="min-w-0">
                  <div className="line-clamp-2 text-[12.5px] font-bold leading-[18px] text-white group-hover:text-[#b9adff]">
                    {item.title}
                  </div>
                  <div className="mt-[5px] text-[11.5px] text-slate-400">{item.meta}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-7 mt-[25px] border-t border-white/[0.08] pb-7 pt-[25px]">
        <div className="flex items-center gap-[23px] text-slate-300">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-white">
            <GithubIcon width={18} height={18} />
          </a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="hover:text-white">
            <TwitterIcon width={18} height={18} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-white">
            <LinkedInIcon />
          </a>
          <a href="mailto:hi@code.explorer" aria-label="Email" className="hover:text-white">
            <MailIcon width={18} height={18} />
          </a>
          <a href="/rss.xml" aria-label="RSS feed" className="sr-only">
            <RssIcon />
          </a>
        </div>

        {context.footer === "streak" ? <DailyStreakCard /> : <SocialFooterCard />}
      </div>
    </aside>
  );
}

function DailyStreakCard() {
  return (
    <div className="mt-[58px] rounded-[8px] border border-white/[0.07] bg-white/[0.045] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="text-[15px] font-extrabold">Daily Streak</div>
      <div className="mt-6 text-[31px] font-extrabold leading-none text-[#ff9c2f]">
        12 <span className="text-[16px] text-white">days</span>
      </div>
      <p className="mt-4 text-[12px] text-slate-300">Keep it up!</p>
      <div className="mt-6 grid grid-cols-7 gap-2 text-center text-[11px] text-slate-300">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
          <div key={`${day}-${index}`}>{day}</div>
        ))}
        {Array.from({ length: 7 }).map((_, index) => (
          <span
            key={index}
            className="mx-auto h-3 w-3 rounded-full border border-[#9b8cff] bg-[#714cff] shadow-[0_0_12px_rgba(113,76,255,0.8)]"
          />
        ))}
      </div>
      <button className="mt-6 h-10 w-full rounded-[7px] border border-white/15 text-[12px] font-bold text-white transition-colors hover:bg-white/10">
        View Progress
      </button>
    </div>
  );
}

function SocialFooterCard() {
  return (
    <div className="mt-[58px] rounded-[8px] border border-white/[0.07] bg-white/[0.045] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="text-[15px] font-extrabold">Stay Connected</div>
      <p className="mt-4 text-[12px] leading-6 text-slate-300">
        Follow the journey, catch new tutorials, and stay updated with community activity.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        {["GitHub", "X", "In", "Mail"].map((item) => (
          <button
            key={item}
            className="rounded-[7px] border border-white/12 px-3 py-2 text-[11px] font-bold text-white hover:bg-white/10"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function RecentThumb({ variant }: { variant: string }) {
  return (
    <div className="grid h-[50px] w-[50px] shrink-0 place-items-center overflow-hidden rounded-[7px] bg-white">
      {variant === "graph" && (
        <svg viewBox="0 0 50 50" className="h-full w-full bg-[#5f35f4]">
          <path d="M10 35 20 18 31 28 40 12" fill="none" stroke="#fff" strokeWidth="1.4" />
          {[10, 20, 31, 40].map((x, index) => (
            <circle key={x} cx={x} cy={[35, 18, 28, 12][index]} r="2.4" fill="#fff" />
          ))}
        </svg>
      )}
      {variant === "flow" && (
        <svg viewBox="0 0 50 50" className="h-full w-full bg-[#fff8ed]">
          <g stroke="#ff9a2f" strokeWidth="1.4" fill="none">
            <path d="M25 10v30M10 25h30M15 15l20 20M35 15 15 35" />
          </g>
          {[25, 10, 25, 40, 10, 25, 40, 25].map((value, index, arr) =>
            index % 2 === 0 ? <circle key={index} cx={value} cy={arr[index + 1]} r="3" fill="#ff9a2f" /> : null,
          )}
        </svg>
      )}
      {variant === "note" && (
        <svg viewBox="0 0 50 50" className="h-full w-full bg-[#f4f0ff]">
          <rect x="11" y="8" width="28" height="34" rx="5" fill="#fff" />
          <path d="M18 17h14M18 23h14M18 29h10" stroke="#7550ff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
      {variant === "cpp" && (
        <div className="grid h-full w-full place-items-center bg-[#efeaff] text-[14px] font-black text-[#5f35f4]">C++</div>
      )}
      {variant === "py" && (
        <div className="grid h-full w-full place-items-center bg-[#fff7de] text-[16px] font-black text-[#2370ea]">Py</div>
      )}
      {variant === "trophy" && (
        <div className="grid h-full w-full place-items-center bg-[#fff7de] text-[#f59e0b]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 21h8" />
            <path d="M12 17v4" />
            <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
            <path d="M17 6h3a2 2 0 0 1-2 2h-1" />
            <path d="M7 6H4a2 2 0 0 0 2 2h1" />
          </svg>
        </div>
      )}
      {variant === "check" && (
        <div className="grid h-full w-full place-items-center bg-[#edfdf3] text-[#16a34a]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="m8.5 12 2.5 2.5 4.5-5" />
          </svg>
        </div>
      )}
      {variant === "bookmark" && (
        <div className="grid h-full w-full place-items-center bg-[#f5f3ff] text-[#5b35f4]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4h12v17l-6-4-6 4z" />
          </svg>
        </div>
      )}
      {variant === "code" && (
        <div className="h-full w-full bg-[#111827] p-2 font-mono text-[5px] font-bold leading-[8px] text-[#7dd3fc]">
          {["const dp", "for (i)", "solve()", "return"].map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M6.94 8.98H3.75V20h3.19V8.98ZM5.35 4a1.85 1.85 0 1 0 0 3.7 1.85 1.85 0 0 0 0-3.7ZM20.25 13.68c0-3.04-1.62-5-4.25-5-1.95 0-2.82 1.07-3.31 1.82V8.98H9.64V20h3.18v-5.45c0-1.44.27-2.83 2.05-2.83 1.76 0 1.78 1.64 1.78 2.92V20h3.6v-6.32Z" />
    </svg>
  );
}
