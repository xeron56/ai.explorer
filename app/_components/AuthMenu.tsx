"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";

export function AuthMenu() {
  const { user, loading, signInWithGoogle, signOutUser, bookmarks, completed } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function handleSignIn() {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <span className="h-8 w-8 animate-pulse rounded-full bg-[#e7efe9]" aria-hidden />;
  }

  if (!user) {
    return (
      <div className="relative flex flex-col items-end">
        <button
          type="button"
          onClick={handleSignIn}
          disabled={busy}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-[#dbe2df] bg-white px-3 text-[13px] font-semibold text-[#17402a] shadow-sm transition hover:border-[#75d49c] hover:bg-[#f3fbf6] disabled:opacity-60"
        >
          <GoogleIcon />
          {busy ? "Signing in…" : "Sign in"}
        </button>
        {error && (
          <span className="absolute top-11 right-0 z-50 w-56 rounded-md border border-[#f2cccc] bg-[#fff5f5] px-3 py-2 text-[11px] font-medium text-[#9b2c2c] shadow-lg">
            {error}
          </span>
        )}
      </div>
    );
  }

  const name = user.displayName ?? user.email ?? "Account";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Account menu"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-2 rounded-md px-1.5 transition hover:bg-[#f3fbf6]"
      >
        <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-[#dbe2df] bg-[#eaf5ef] text-[12px] font-bold text-[#16a34a]">
          {user.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
          ) : (
            initials || "U"
          )}
        </span>
        <ChevronDown />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-60 overflow-hidden rounded-xl border border-[#e6ebe8] bg-white shadow-[0_20px_45px_rgba(15,42,26,0.16)]">
          <div className="border-b border-[#eef2ef] px-4 py-3">
            <p className="truncate text-[13px] font-bold text-[#102117]">{name}</p>
            {user.email && <p className="truncate text-[11px] text-[#6b7c72]">{user.email}</p>}
          </div>
          <div className="grid grid-cols-2 gap-px bg-[#eef2ef] text-center">
            <div className="bg-white px-3 py-2">
              <p className="text-[16px] font-extrabold text-[#16a34a]">{completed.length}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#6b7c72]">Completed</p>
            </div>
            <div className="bg-white px-3 py-2">
              <p className="text-[16px] font-extrabold text-[#16a34a]">{bookmarks.length}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#6b7c72]">Saved</p>
            </div>
          </div>
          <nav className="p-1.5 text-[13px] font-semibold text-[#27402f]">
            <Link href="/learning" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 hover:bg-[#f3fbf6]">
              My learning
            </Link>
            <Link href="/about" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 hover:bg-[#f3fbf6]">
              About
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                void signOutUser();
              }}
              className="mt-0.5 block w-full rounded-md px-3 py-2 text-left text-[#b4452f] hover:bg-[#fdf2ef]"
            >
              Sign out
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 18 18" className="h-[15px] w-[15px]" aria-hidden>
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.05l3.01-2.33Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-[#748292]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5.5 7.5 4.5 5 4.5-5" />
    </svg>
  );
}
