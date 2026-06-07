"use client";

import { useAuth } from "./AuthProvider";

export function BookmarkButton({ slug, className }: { slug: string; className?: string }) {
  const { isBookmarked, toggleBookmark } = useAuth();
  const saved = isBookmarked(slug);

  return (
    <button
      type="button"
      aria-label={saved ? "Remove bookmark" : "Save tutorial"}
      aria-pressed={saved}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(slug);
      }}
      className={`transition ${saved ? "text-[#15924c]" : "text-[#6c7d8a] hover:text-[#15924c]"} ${className ?? ""}`}
    >
      {saved ? (
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
          <path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-3.98L6 21V4.75Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 4h12v16l-6-4-6 4V4Z" />
        </svg>
      )}
    </button>
  );
}
