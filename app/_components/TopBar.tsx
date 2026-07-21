"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { ThemeToggle } from "./ThemeToggle";

export function TopBar() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const placeholder = pathname.startsWith("/research")
    ? "Search posts, topics, papers..."
    : pathname.startsWith("/projects")
      ? "Search projects, tools, topics..."
      : pathname.startsWith("/learning")
        ? "Search topics, chapters, notes..."
        : pathname.startsWith("/about")
          ? "Search topics, notes, equations..."
          : pathname.startsWith("/notes")
            ? "Search notes, topics, equations..."
            : "Search posts...";

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b bg-white/92 backdrop-blur-xl dark:bg-[rgba(10,16,36,0.9)]" style={{ borderColor: "var(--color-border)" }}>
      <div className="flex h-[90px] items-center gap-4 px-6 md:px-10 lg:px-[64px] xl:px-[78px]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const term = query.trim();
            if (!term) return;
            const target = pathname.startsWith("/learning") ? "/learning" : "/blog";
            router.push(`${target}?q=${encodeURIComponent(term)}`);
          }}
          className="relative w-full max-w-[308px]"
        >
          <FiSearch className="absolute left-[14px] top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-[#9aa3b8]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            className="h-[40px] w-full rounded-[10px] border bg-white pl-[39px] pr-[58px] text-[13px] font-medium text-[var(--color-fg)] shadow-[0_8px_18px_rgba(15,23,42,0.03)] outline-none transition-colors placeholder:text-[#95a0b6] focus:border-[#cfc7ff] dark:bg-[var(--color-bg)]"
            style={{ borderColor: "var(--color-border)" }}
          />
          <kbd className="absolute right-[9px] top-1/2 -translate-y-1/2 rounded-md bg-[#f4f5f9] px-[7px] py-[3px] text-[11px] font-semibold leading-none text-[#727b91] dark:bg-[var(--color-bg-elevated)]">
            ⌘ K
          </kbd>
        </form>

        <div className="ml-auto flex items-center gap-[18px]">
          <ThemeToggle minimal />
          <div aria-label="Profile" className="overflow-hidden rounded-full border border-[#e3e7f0] shadow-[0_10px_18px_rgba(15,23,42,0.05)]">
            <Image src="/learning-icons/avatar.png" alt="Profile avatar" width={36} height={36} />
          </div>
        </div>
      </div>
    </header>
  );
}
