"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SearchIcon } from "./icons";
import { ThemeToggle } from "./ThemeToggle";
export function TopBar() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { placeholder, target } = getTopBarConfig(pathname);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur-xl" style={{ borderColor: "var(--color-border)" }}>
      <div className="flex h-[86px] items-center gap-4 px-6 md:px-10 lg:px-[50px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) {
              router.push(`${target}?q=${encodeURIComponent(query.trim())}`);
            }
          }}
          className="relative w-full max-w-[460px]"
        >
          <SearchIcon className="absolute left-[14px] top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#263458]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="h-[38px] w-full rounded-[7px] border bg-white pl-[41px] pr-[53px] text-[13px] text-[var(--color-fg)] shadow-sm shadow-slate-100 outline-none transition-colors placeholder:text-[#6f778e] focus:border-[var(--color-accent)]"
            style={{ borderColor: "var(--color-border)" }}
          />
          <kbd className="absolute right-[7px] top-1/2 -translate-y-1/2 rounded-md bg-[#f0f1f5] px-[7px] py-[3px] text-[11px] font-semibold leading-none text-[#727b91]">⌘ K</kbd>
        </form>
        <div className="ml-auto flex items-center gap-[28px]">
          <ThemeToggle minimal />
          <button aria-label="Notifications" className="text-[#2b3854]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
              <path d="M10 21a2 2 0 0 0 4 0" />
            </svg>
          </button>
          <div aria-label="Profile" className="relative h-[34px] w-[34px] overflow-hidden rounded-full border border-[#d7dce8] bg-[#d6e4ff] shadow-sm">
            <div className="absolute left-1/2 top-[7px] h-[11px] w-[11px] -translate-x-1/2 rounded-full bg-[#c98952]" />
            <div className="absolute left-[9px] top-[5px] h-[7px] w-[16px] rounded-t-full bg-[#111827]" />
            <div className="absolute bottom-[3px] left-1/2 h-[17px] w-[22px] -translate-x-1/2 rounded-t-[10px] bg-[#253a68]" />
            <div className="absolute left-[12px] top-[12px] h-[2px] w-[2px] rounded-full bg-[#111827]" />
            <div className="absolute right-[12px] top-[12px] h-[2px] w-[2px] rounded-full bg-[#111827]" />
          </div>
        </div>
      </div>
    </header>
  );
}

function getTopBarConfig(pathname: string) {
  if (pathname.startsWith("/research")) {
    return { placeholder: "Search contests, platforms, or topics...", target: "/contests" };
  }
  if (pathname.startsWith("/projects")) {
    return { placeholder: "Search problems, topics, or tags...", target: "/problems" };
  }
  if (pathname.startsWith("/learning")) {
    return { placeholder: "Search tutorials, topics, or keywords...", target: "/tutorials" };
  }
  if (pathname.startsWith("/contests")) {
    return { placeholder: "Search contests, platforms, or topics...", target: "/contests" };
  }
  if (pathname.startsWith("/problems")) {
    return { placeholder: "Search problems, topics, or tags...", target: "/problems" };
  }
  if (pathname.startsWith("/tutorials")) {
    return { placeholder: "Search tutorials, topics, or keywords...", target: "/tutorials" };
  }
  if (pathname.startsWith("/snippets")) {
    return { placeholder: "Search snippets, languages, or tags...", target: "/snippets" };
  }
  if (pathname.startsWith("/notes")) {
    return { placeholder: "Search notes, topics, or tags...", target: "/notes" };
  }
  if (pathname.startsWith("/about")) {
    return { placeholder: "Search topics, features, or anything...", target: "/about" };
  }
  return { placeholder: "Search articles, topics, problems...", target: "/blog" };
}
