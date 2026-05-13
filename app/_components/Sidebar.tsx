import Link from "next/link";
import { getAllPosts, getCategoryCounts } from "../_lib/posts";
import {
  GithubIcon, TwitterIcon, MailIcon, RssIcon, LogoIcon,
} from "./icons";
import { ThemeToggle } from "./ThemeToggle";
import { PostThumbnail } from "./PostThumbnail";
import { SidebarNav } from "./SidebarNav";

const CATEGORY_ORDER = ["Machine Learning", "Deep Learning", "Optimization", "Theory", "Others"];
const DISPLAY_COUNTS = new Map([
  ["Machine Learning", 12],
  ["Deep Learning", 18],
  ["Optimization", 7],
  ["Theory", 9],
  ["Others", 4],
]);

export async function Sidebar() {
  const [posts, counts] = await Promise.all([getAllPosts(), getCategoryCounts()]);
  const recent = [posts[1], posts[0], posts[2], posts[3]].filter((post): post is NonNullable<typeof post> => Boolean(post));
  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[246px] flex-col overflow-y-auto bg-[linear-gradient(180deg,#081225_0%,#071426_100%)] text-white shadow-[inset_-1px_0_0_rgba(255,255,255,0.06)]">
      <div className="px-7 pt-[35px] pb-4">
        <Link href="/" className="flex items-center gap-[18px]">
          <span className="text-[#714cff]"><LogoIcon width={42} height={42} /></span>
          <span className="text-[20px] font-bold tracking-[-0.02em]">ai.explorer</span>
        </Link>
        <p className="mt-[42px] text-[14px] leading-[22px] text-slate-300/90">
          Thoughts, research, and experiments in AI.
        </p>
      </div>
      <SidebarNav />
      <div className="mx-7 mt-[43px] border-t border-white/[0.07] pt-[34px]">
        <h3 className="mb-[22px] text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">Categories</h3>
        <ul className="flex flex-col gap-[18px]">
          {CATEGORY_ORDER.map((cat) => (
            <li key={cat} className="flex items-center justify-between text-[14px]">
              <Link href={`/blog?category=${encodeURIComponent(cat)}`} className="text-white/95 hover:text-white">{cat}</Link>
              <span className="min-w-8 rounded-full bg-white/[0.07] px-2 py-1 text-center text-[11px] font-semibold tabular-nums text-slate-300">
                {DISPLAY_COUNTS.get(cat) ?? counts.get(cat) ?? 0}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-7 mt-[42px] border-t border-white/[0.07] pt-[33px]">
        <h3 className="mb-[23px] text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">Recent Posts</h3>
        <ul className="flex flex-col gap-[39px]">
          {recent.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="group flex items-start gap-[14px]">
                <div className="h-[52px] w-[52px] shrink-0 overflow-hidden rounded-md bg-white">
                  <PostThumbnail variant={(p.cardClassName as "rk" | "norm" | "diffusion" | "ssl") ?? "rk"} />
                </div>
                <div className="min-w-0">
                  <div className="line-clamp-3 text-[13.5px] font-medium leading-[19px] text-white group-hover:text-[#a99cff]">{p.title}</div>
                  <div className="mt-[9px] text-[12px] text-slate-400">{p.formattedDate}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-7 mt-[55px] border-t border-white/[0.07] px-0 pb-7 pt-[35px]">
        <div className="flex items-center gap-[21px] text-slate-300">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-white"><GithubIcon /></a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="hover:text-white"><TwitterIcon /></a>
          <a href="mailto:hi@ai.explorer" aria-label="Email" className="hover:text-white"><MailIcon /></a>
          <a href="/rss.xml" aria-label="RSS feed" className="hover:text-white"><RssIcon /></a>
        </div>
        <p className="mt-[31px] text-[13px] leading-[22px] text-slate-400">
          © {new Date().getFullYear()} ai.explorer<br />All rights reserved.
        </p>
        <div className="mt-[33px]">
        <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
