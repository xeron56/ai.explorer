"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "./icons";
export function ThemeToggle({ minimal = false }: { minimal?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";
  if (minimal) {
    return (
      <button aria-label="Toggle theme" onClick={() => setTheme(isDark ? "light" : "dark")}
        className="p-2 rounded-md text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-bg-elevated)]">
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
    );
  }
  return (
    <button aria-label="Toggle theme" onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center gap-2 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
      <SunIcon className="opacity-80" />
      <span className="relative w-10 h-5 rounded-full border"
        style={{ background: isDark ? "var(--color-accent)" : "var(--color-bg-elevated)", borderColor: "var(--color-border)" }}>
        <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
          style={{ transform: isDark ? "translateX(20px)" : "translateX(2px)" }} />
      </span>
    </button>
  );
}
