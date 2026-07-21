"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineAcademicCap,
  HiOutlineFolderOpen,
  HiOutlineHome,
  HiOutlineInformationCircle,
  HiOutlinePencilSquare,
  HiOutlineRectangleStack,
  HiOutlineSparkles,
} from "react-icons/hi2";

const NAV = [
  { href: "/", label: "Home", icon: HiOutlineHome, match: (path: string) => path === "/" },
  { href: "/blog", label: "Blog", icon: HiOutlineRectangleStack, match: (path: string) => path.startsWith("/blog") },
  { href: "/research", label: "Research", icon: HiOutlineSparkles, match: (path: string) => path.startsWith("/research") },
  { href: "/projects", label: "Projects", icon: HiOutlineFolderOpen, match: (path: string) => path.startsWith("/projects") },
  { href: "/learning", label: "Learning", icon: HiOutlineAcademicCap, match: (path: string) => path.startsWith("/learning") },
  { href: "/notes", label: "Notes", icon: HiOutlinePencilSquare, match: (path: string) => path.startsWith("/notes") },
  { href: "/about", label: "About", icon: HiOutlineInformationCircle, match: (path: string) => path.startsWith("/about") },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-[42px] flex flex-col gap-0 px-[26px]">
      {NAV.map(({ href, label, icon: Icon, match }) => {
        const active = match(pathname);

        return (
          <Link
            key={href}
            href={href}
            className={`group flex h-[56px] items-center gap-[18px] rounded-[8px] px-[15px] text-[15px] font-medium transition-colors ${
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
