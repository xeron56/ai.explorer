"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";

export function ThemeToggle({ minimal = false }: { minimal?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  if (minimal) {
    return (
      <button
        aria-label="Toggle theme"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="rounded-full p-2 text-[#707c95] transition-colors hover:text-[#1f2940] dark:text-[var(--color-fg-muted)] dark:hover:text-[var(--color-fg)]"
      >
        {isDark ? <FiMoon className="h-[18px] w-[18px]" /> : <FiSun className="h-[18px] w-[18px]" />}
      </button>
    );
  }

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center gap-2 text-[13px] font-medium text-[#92a0b9] transition-colors hover:text-white dark:text-[var(--color-fg-muted)]"
    >
      <span className="flex h-7 w-12 items-center rounded-full bg-[#5c43f5] px-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
        <span className="flex h-5 w-5 items-center justify-center text-white/80">
          <FiSun className="h-[12px] w-[12px]" />
        </span>
        <span
          className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#5c43f5] shadow-sm transition-transform"
          style={{ transform: isDark ? "translateX(0)" : "translateX(14px)" }}
        >
          {isDark ? <FiMoon className="h-[11px] w-[11px]" /> : null}
        </span>
      </span>
    </button>
  );
}
