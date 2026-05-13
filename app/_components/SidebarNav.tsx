"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, BlogIcon, ResearchIcon, ProjectsIcon, NotesIcon, AboutIcon } from "./icons";

const NAV = [
  { href: "/", label: "Home", icon: HomeIcon, match: (path: string) => path === "/" },
  { href: "/blog", label: "Blog", icon: BlogIcon, match: (path: string) => path.startsWith("/blog") },
  { href: "/research", label: "Research", icon: ResearchIcon, match: (path: string) => path.startsWith("/research") },
  { href: "/projects", label: "Projects", icon: ProjectsIcon, match: (path: string) => path.startsWith("/projects") },
  { href: "/notes", label: "Notes", icon: NotesIcon, match: (path: string) => path.startsWith("/notes") },
  { href: "/about", label: "About", icon: AboutIcon, match: (path: string) => path.startsWith("/about") },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-[24px] flex flex-col gap-0 px-[18px]">
      {NAV.map(({ href, label, icon: Icon, match }) => {
        const active = match(pathname);

        return (
          <Link
            key={href}
            href={href}
            className={`group flex h-[55px] items-center gap-[18px] rounded-lg px-[15px] text-[14px] font-medium transition-colors ${
              active
                ? "bg-[#23275c] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
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
