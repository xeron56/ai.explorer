import Link from "next/link";
import { getAllPosts, getLearningSeries } from "../_lib/posts";
import {
  GithubIcon, TwitterIcon, MailIcon, RssIcon, LogoIcon,
} from "./icons";
import { ThemeToggle } from "./ThemeToggle";
import { PostThumbnail } from "./PostThumbnail";
import { SidebarNav } from "./SidebarNav";

export async function Sidebar() {
  const [posts, series] = await Promise.all([getAllPosts(), getLearningSeries()]);
  const recent = posts.slice(0, 4);
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
        <h3 className="mb-[22px] text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">Topic Series</h3>
        <ul className="flex flex-col gap-[11px]">
          {series.slice(0, 4).map((item) => (
            <li key={item.slug}>
              <Link href={`/learning?series=${item.slug}`} className={`group flex h-[43px] items-center gap-[13px] rounded-[7px] px-[11px] text-[13px] font-semibold transition-colors ${item.slug === "deep-learning" ? "bg-[#23275c] text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}>
                <span className={seriesIconClass(item.tone)}>
                  <TopicIcon icon={item.icon} />
                </span>
                <span>{item.title}</span>
              </Link>
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

function seriesIconClass(tone: string) {
  if (tone === "green") return "text-emerald-400";
  if (tone === "amber") return "text-orange-400";
  if (tone === "red") return "text-red-400";
  return "text-[#8a6bff]";
}

function TopicIcon({ icon }: { icon: string }) {
  if (icon === "cube") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="M4 7.5 12 12l8-4.5" /><path d="M12 12v9" />
      </svg>
    );
  }
  if (icon === "tensorflow") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8.5 12 4l8 4.5" /><path d="M12 4v16" /><path d="M8 11v7" /><path d="M16 11v7" /><path d="m4 8.5 4 2.3" /><path d="m20 8.5-4 2.3" />
      </svg>
    );
  }
  if (icon === "flame") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c4 0 7-3 7-7 0-3-2-5-4-7 .2 2-1 3.5-2.2 4.4C13 9 11 6 8 4c.4 4-3 6-3 11 0 4 3 7 7 7z" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="5" width="14" height="14" rx="3" /><path d="M8 12h8M12 8v8" /><circle cx="5" cy="5" r="2" /><circle cx="19" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
    </svg>
  );
}
