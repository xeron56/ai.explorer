import Link from "next/link";
import { AuthMenu } from "./AuthMenu";

const navItems = [
  { label: "Dashboard", href: "#" },
  { label: "Markets", href: "#" },
  { label: "Watchlist", href: "#" },
  { label: "Portfolio", href: "#" },
  { label: "Blog", href: "/blog", active: true },
  { label: "News", href: "#" },
  { label: "Screener", href: "#" },
];

export function FinanceHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e6ebe8] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[58px] max-w-[1160px] items-center gap-4 px-4 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3 text-[#102117]">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-[#e9f8ee] text-[#16a34a]">
            <LogoMark />
          </span>
          <span className="text-[18px] font-extrabold">Stock&amp;Trade</span>
        </Link>

        <nav className="ml-5 hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`relative text-[13px] font-semibold transition-colors ${
                item.active ? "text-[#13924a]" : "text-[#425466] hover:text-[#0f1728]"
              }`}
            >
              {item.label}
              {item.active && <span className="absolute -bottom-[20px] left-0 h-[2px] w-full rounded-full bg-[#22a35f]" />}
            </Link>
          ))}
        </nav>

        <form action="/blog" className="ml-auto hidden min-w-0 md:block">
          <label className="relative block w-[210px] lg:w-[250px]">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-[#91a09a]" />
            <input
              type="search"
              name="q"
              placeholder="Search blog..."
              className="h-9 w-full rounded-md border border-[#dbe2df] bg-[#fbfcfb] pl-9 pr-3 text-[13px] text-[#17212c] outline-none transition focus:border-[#75d49c] focus:ring-4 focus:ring-[#c7f1d6]"
            />
          </label>
        </form>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            aria-label="Notifications"
            className="grid h-9 w-9 place-items-center rounded-md text-[#385166]"
          >
            <BellIcon />
          </button>
          <AuthMenu />
        </div>
      </div>

      <div className="border-t border-[#eef2ef] lg:hidden">
        <nav className="mx-auto flex max-w-[1160px] items-center gap-6 overflow-x-auto px-4 py-2 text-[12px] font-semibold md:px-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`whitespace-nowrap ${item.active ? "text-[#13924a]" : "text-[#546476]"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 36 36" className="h-5 w-5 text-[#16a34a]" fill="none">
      <path d="M5 26.5h26" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="7" y="18" width="4.5" height="8.5" rx="1.4" fill="currentColor" opacity="0.85" />
      <rect x="14.5" y="13" width="4.5" height="13.5" rx="1.4" fill="currentColor" opacity="0.92" />
      <rect x="22" y="8.5" width="4.5" height="18" rx="1.4" fill="currentColor" />
      <path d="M6.5 17.5 14 12l4.2 2.6L29.5 6.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9a6 6 0 1 1 12 0v4.2c0 .6.24 1.18.66 1.6L20 16.5H4l1.34-1.7c.42-.42.66-1 .66-1.6Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}
