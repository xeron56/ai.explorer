import Link from "next/link";
import { Suspense } from "react";
import { getAllPosts, getLearningSeries } from "../_lib/posts";
import {
  GithubIcon, TwitterIcon, MailIcon, RssIcon, LogoIcon,
} from "./icons";
import { ThemeToggle } from "./ThemeToggle";
import { PostThumbnail } from "./PostThumbnail";
import { SidebarNav } from "./SidebarNav";
import { TopicSeriesLinks } from "./TopicSeriesLinks";

export async function Sidebar() {
  const [posts, series] = await Promise.all([getAllPosts(), getLearningSeries()]);
  const recent = posts.slice(0, 4);

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-[260px] flex-col overflow-y-auto bg-[linear-gradient(180deg,#081225_0%,#071426_100%)] text-white shadow-[inset_-1px_0_0_rgba(255,255,255,0.06)] lg:flex">
      <div className="px-9 pb-4 pt-[46px]">
        <Link href="/" className="flex items-center gap-[18px]">
          <span className="text-[#714cff]"><LogoIcon width={42} height={42} /></span>
          <span className="text-[20px] font-bold tracking-[-0.02em]">ai.explorer</span>
        </Link>
        <p className="mt-[54px] text-[15px] leading-[26px] text-slate-300/90">
          Thoughts, research, and experiments in AI.
        </p>
      </div>

      <SidebarNav />

      <div className="mx-9 mt-[58px] border-t border-white/60 pt-[38px]">
        <h3 className="mb-[22px] text-[12px] font-medium uppercase tracking-[0.08em] text-slate-400">Topic Series</h3>
        <Suspense fallback={null}>
          <TopicSeriesLinks series={series.slice(0, 5).map(({ slug, title, icon, tone }) => ({ slug, title, icon, tone }))} />
        </Suspense>
      </div>

      <div className="mx-9 mt-[58px] border-t border-white/60 pt-[38px]">
        <h3 className="mb-[24px] text-[12px] font-medium uppercase tracking-[0.08em] text-slate-400">Recent Posts</h3>
        <ul className="flex flex-col gap-[38px]">
          {recent.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group flex items-start gap-[14px]">
                <div className="h-[52px] w-[52px] shrink-0 overflow-hidden rounded-md bg-white">
                  <PostThumbnail variant={(post.cardClassName as "rk" | "norm" | "diffusion" | "ssl") ?? "rk"} />
                </div>
                <div className="min-w-0">
                  <div className="line-clamp-3 text-[13.5px] font-medium leading-[19px] text-white group-hover:text-[#a99cff]">{post.title}</div>
                  <div className="mt-[9px] text-[12px] text-slate-400">{post.formattedDate}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-9 mt-[58px] border-t border-white/60 px-0 pb-7 pt-[35px]">
        <p className="text-[13px] leading-[22px] text-slate-400">
          © 2024 ai.explorer<br />All rights reserved.
        </p>
        <div className="mt-[31px] flex items-center gap-[21px] text-slate-300">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-white"><GithubIcon /></a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="hover:text-white"><TwitterIcon /></a>
          <a href="mailto:hi@ai.explorer" aria-label="Email" className="hover:text-white"><MailIcon /></a>
          <a href="/rss.xml" aria-label="RSS feed" className="hover:text-white"><RssIcon /></a>
        </div>

        <div className="mt-[33px]">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
