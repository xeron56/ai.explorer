"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "./AuthProvider";

type ChapterActionsProps = {
  slug: string;
  title: string;
};

export function ChapterActions({ slug, title }: ChapterActionsProps) {
  const { isBookmarked, toggleBookmark, isCompleted, toggleCompleted, updateProgress } = useAuth();
  const bookmarked = isBookmarked(slug);
  const completed = isCompleted(slug);
  const lastSent = useRef(0);

  // Track how far the reader has scrolled and persist forward progress.
  useEffect(() => {
    let frame = 0;
    function onScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - window.innerHeight;
        const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 100;
        const rounded = Math.round(pct);
        // Persist in ~10% steps to limit writes.
        if (rounded - lastSent.current >= 10 || rounded >= 100) {
          lastSent.current = rounded;
          updateProgress(slug, rounded);
        }
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [slug, updateProgress]);

  async function shareChapter() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Fall back to clipboard when share is dismissed or unsupported.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      window.alert("Chapter link copied to clipboard.");
    } catch {
      window.prompt("Copy this chapter URL:", url);
    }
  }

  return (
    <div className="ml-auto flex items-center gap-2">
      <button
        type="button"
        onClick={() => toggleCompleted(slug)}
        aria-pressed={completed}
        className={`inline-flex h-11 items-center gap-2 rounded-[14px] border px-4 text-[14px] font-semibold shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 ${
          completed
            ? "border-[#bfe6cb] bg-[#169b52] text-white"
            : "border-[#dbe7de] bg-white text-[#44576a]"
        }`}
      >
        <CheckIcon />
        {completed ? "Completed" : "Mark complete"}
      </button>
      <button
        type="button"
        onClick={() => toggleBookmark(slug)}
        aria-pressed={bookmarked}
        aria-label={bookmarked ? "Remove bookmark" : "Bookmark chapter"}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-[14px] border shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 ${
          bookmarked
            ? "border-[#cfe3d5] bg-[#effaf2] text-[#15924c]"
            : "border-[#dbe7de] bg-white text-[#44576a]"
        }`}
      >
        <BookmarkIcon filled={bookmarked} />
      </button>
      <button
        type="button"
        onClick={shareChapter}
        className="inline-flex h-11 items-center gap-2 rounded-[14px] border border-[#dbe7de] bg-white px-4 text-[14px] font-semibold text-[#44576a] shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5"
      >
        <ShareIcon />
        Share
      </button>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 10 4 4 8-9" />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
        <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-3.98L6 21V4.75Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h12v16l-6-4-6 4V4Z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v10" />
      <path d="m8 9 4-4 4 4" />
      <path d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2" />
    </svg>
  );
}
