"use client";
import { MailIcon } from "./icons";
export function Newsletter() {
  return (
    <section className="pb-[23px]">
      <div className="flex min-h-[88px] flex-col gap-5 rounded-[8px] border bg-white p-[14px] shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:flex-row md:items-center" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex flex-1 items-center gap-[20px]">
          <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5a34f4] to-[#704cff] text-white shadow-[0_10px_22px_rgba(91,53,244,0.22)]">
            <MailIcon />
          </div>
          <div>
            <h3 className="text-[17px] font-bold text-[#10172d]">Stay in the loop</h3>
            <p className="mt-[7px] text-[14px] text-[#44516a]">Get notified about new posts and updates.</p>
          </div>
        </div>
        <form action="#" method="post" className="flex w-full gap-[12px] md:w-auto" onSubmit={(e) => e.preventDefault()}>
          <input type="email" required placeholder="you@example.com"
            className="h-[42px] min-w-0 flex-1 rounded-[7px] border bg-white px-[16px] text-[14px] outline-none focus:border-[var(--color-accent)] md:min-w-[242px]"
            style={{ borderColor: "var(--color-border)" }} />
          <button type="submit" className="h-[42px] whitespace-nowrap rounded-[7px] bg-gradient-to-r from-[#5a34f4] to-[#704cff] px-[26px] text-[14px] font-semibold text-white hover:brightness-105">Subscribe</button>
        </form>
      </div>
      <p className="mt-[33px] text-center text-[13px] text-[#44516a]">Made with ♥ for curiosity and the love of learning.</p>
    </section>
  );
}
