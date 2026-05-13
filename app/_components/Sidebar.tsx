import Link from "next/link";
import { getAllPosts, getCategoryCounts } from "../_lib/posts";
import {
  HomeIcon, BlogIcon, ResearchIcon, ProjectsIcon, NotesIcon, AboutIcon,
  GithubIcon, TwitterIcon, MailIcon, RssIcon, LogoIcon,
} from "./icons";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/blog", label: "Blog", icon: BlogIcon },
  { href: "/research", label: "Research", icon: ResearchIcon },
  { href: "/projects", label: "Projects", icon: ProjectsIcon },
  { href: "/notes", label: "Notes", icon: NotesIcon },
  { href: "/about", label: "About", icon: AboutIcon },
];
const CATEGORY_ORDER = ["Machine Learning", "Deep Learning", "Optimization", "Theory", "Others"];

export async function Sidebar() {
  const [posts, counts] = await Promise.all([getAllPosts(), getCategoryCounts()]);
  const recent = posts.slice(0, 4);
  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-72 border-r flex-col bg-[var(--color-sidebar)] overflow-y-auto" style={{ borderColor: "var(--color-border)" }}>
      <div className="px-6 pt-6 pb-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[var(--color-accent)]"><LogoIcon /></span>
          <span className="text-xl font-bold tracking-tight">ai.explorer</span>
        </Link>
        <p className="text-sm text-[var(--color-fg-muted)] mt-3 leading-5">
          Thoughts, research, and experiments in AI.
        </p>
      </div>
      <nav className="px-3 mt-2 flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className="group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-fg)]">
            <Icon className="opacity-80 group-hover:opacity-100" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="px-6 mt-8">
        <h3 className="text-[11px] font-semibold tracking-[0.12em] text-[var(--color-fg-subtle)] uppercase mb-3">Categories</h3>
        <ul className="flex flex-col gap-2">
          {CATEGORY_ORDER.map((cat) => (
            <li key={cat} className="flex items-center justify-between text-[13.5px]">
              <Link href={`/blog?category=${encodeURIComponent(cat)}`} className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">{cat}</Link>
              <span className="text-[12px] text-[var(--color-fg-subtle)] tabular-nums">{counts.get(cat) ?? 0}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-6 mt-8">
        <h3 className="text-[11px] font-semibold tracking-[0.12em] text-[var(--color-fg-subtle)] uppercase mb-3">Recent Posts</h3>
        <ul className="flex flex-col gap-3">
          {recent.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="flex gap-3 group items-start">
                <div className="w-10 h-10 shrink-0 rounded-md flex items-center justify-center text-[var(--color-accent)]" style={{ background: "var(--color-accent-soft)" }}>
                  <LogoIcon width={18} height={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] leading-snug font-medium line-clamp-2 group-hover:text-[var(--color-accent-strong)]">{p.title}</div>
                  <div className="text-[11px] text-[var(--color-fg-subtle)] mt-1">{p.formattedDate}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto px-6 pt-8 pb-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 text-[var(--color-fg-muted)]">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-[var(--color-fg)]"><GithubIcon /></a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="hover:text-[var(--color-fg)]"><TwitterIcon /></a>
          <a href="mailto:hi@ai.explorer" aria-label="Email" className="hover:text-[var(--color-fg)]"><MailIcon /></a>
          <a href="/rss.xml" aria-label="RSS feed" className="hover:text-[var(--color-fg)]"><RssIcon /></a>
        </div>
        <p className="text-[11.5px] leading-5 text-[var(--color-fg-subtle)]">
          © {new Date().getFullYear()} ai.explorer<br />All rights reserved.
        </p>
        <ThemeToggle />
      </div>
    </aside>
  );
}
