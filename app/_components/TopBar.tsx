"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "./icons";
import { ThemeToggle } from "./ThemeToggle";
export function TopBar() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-[color-mix(in_srgb,var(--color-bg)_82%,transparent)] border-b" style={{ borderColor: "var(--color-border)" }}>
      <div className="flex items-center gap-4 px-6 md:px-10 lg:px-14 h-16">
        <form onSubmit={(e) => { e.preventDefault(); if (query.trim()) router.push(`/blog?q=${encodeURIComponent(query.trim())}`); }} className="relative w-full max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-fg-subtle)]" />
          <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-10 pr-14 py-2.5 text-[14px] rounded-full border bg-[var(--color-bg-elevated)] text-[var(--color-fg)] placeholder:text-[var(--color-fg-subtle)] outline-none focus:border-[var(--color-accent)] transition-colors"
            style={{ borderColor: "var(--color-border)" }} />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[11px] font-medium bg-[var(--color-bg)] border text-[var(--color-fg-muted)]" style={{ borderColor: "var(--color-border)" }}>⌘K</kbd>
        </form>
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle minimal />
          <div className="w-9 h-9 rounded-full bg-[var(--color-accent-soft)] border overflow-hidden flex items-center justify-center text-[var(--color-accent-strong)] font-semibold text-sm" style={{ borderColor: "var(--color-border)" }}>AE</div>
        </div>
      </div>
    </header>
  );
}
