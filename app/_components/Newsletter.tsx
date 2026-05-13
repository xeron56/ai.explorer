"use client";
import { MailIcon } from "./icons";
export function Newsletter() {
  return (
    <section className="pb-10">
      <div className="rounded-2xl border bg-[var(--color-bg)] p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-5" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-4 flex-1">
          <div className="w-11 h-11 rounded-full bg-[var(--color-accent-strong)] text-white flex items-center justify-center shrink-0">
            <MailIcon />
          </div>
          <div>
            <h3 className="font-semibold text-[15.5px]">Stay in the loop</h3>
            <p className="text-[13px] text-[var(--color-fg-muted)] mt-0.5">Get notified about new posts and updates.</p>
          </div>
        </div>
        <form action="#" method="post" className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
          <input type="email" required placeholder="you@example.com"
            className="px-4 py-2.5 rounded-lg border text-[14px] bg-[var(--color-bg-elevated)] outline-none focus:border-[var(--color-accent)] flex-1 min-w-0 md:min-w-[260px]"
            style={{ borderColor: "var(--color-border)" }} />
          <button type="submit" className="px-5 py-2.5 rounded-lg bg-[var(--color-accent-strong)] hover:bg-[var(--color-accent)] text-white text-[14px] font-semibold whitespace-nowrap">Subscribe</button>
        </form>
      </div>
      <p className="text-center text-[12.5px] text-[var(--color-fg-subtle)] mt-6">Made with 💜 for curiosity and the love of learning.</p>
    </section>
  );
}
