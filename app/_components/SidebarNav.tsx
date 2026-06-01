"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, BlogIcon, ResearchIcon, ProjectsIcon, LearningIcon, NotesIcon, AboutIcon, FileTextIcon } from "./icons";

const NAV = [
  { href: "/", label: "Home", icon: HomeIcon, match: (path: string) => path === "/" },
  { href: "/blog", label: "Blog", icon: BlogIcon, match: (path: string) => path.startsWith("/blog") },
  { href: "/contests", label: "Contests", icon: ResearchIcon, match: (path: string) => path.startsWith("/research") || path.startsWith("/contests") },
  { href: "/problems", label: "Problems", icon: ProjectsIcon, match: (path: string) => path.startsWith("/projects") || path.startsWith("/problems") },
  { href: "/tutorials", label: "Tutorials", icon: LearningIcon, match: (path: string) => path.startsWith("/learning") || path.startsWith("/tutorials") },
  { href: "/snippets", label: "Snippets", icon: FileTextIcon, match: (path: string) => path.startsWith("/snippets") },
  { href: "/notes", label: "Notes", icon: NotesIcon, match: (path: string) => path.startsWith("/notes") },
  { href: "/about", label: "About", icon: AboutIcon, match: (path: string) => path.startsWith("/about") },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-[24px] flex flex-col gap-[2px] px-[18px]">
      {NAV.map(({ href, label, icon: Icon, match }) => {
        const active = match(pathname);

        return (
          <Link
            key={label}
            href={href}
            className={`group flex h-[45px] items-center gap-[18px] rounded-lg px-[15px] text-[13px] font-bold transition-colors ${
              active
                ? "bg-gradient-to-r from-[#4b2ac6] to-[#38217f] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-5 w-5 opacity-95" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
