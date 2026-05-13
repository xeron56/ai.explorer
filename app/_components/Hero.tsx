import Link from "next/link";
import { ArrowRightIcon } from "./icons";

export function Hero() {
  return (
    <section className="grid lg:grid-cols-[1.1fr_1fr] items-center gap-10 pt-10 pb-12">
      <div>
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-fg-muted)] bg-[var(--color-bg-elevated)] border rounded-full px-3 py-1" style={{ borderColor: "var(--color-border)" }}>
          Welcome back <span>👋</span>
        </span>
        <h1 className="mt-5 text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
          Exploring <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-strong)] bg-clip-text text-transparent">AI,</span><br />
          one idea at a time.
        </h1>
        <p className="mt-5 text-[var(--color-fg-muted)] text-[17px] leading-7 max-w-[44ch]">
          Thoughts, research, and experiments on deep learning, mathematics, and the future of intelligence.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/blog" className="inline-flex items-center gap-2 bg-[var(--color-accent-strong)] text-white px-5 py-2.5 rounded-lg text-[14px] font-semibold hover:bg-[var(--color-accent)] transition-colors">
            Browse Latest Posts <ArrowRightIcon width={16} height={16} />
          </Link>
          <Link href="/about" className="inline-flex items-center px-5 py-2.5 rounded-lg text-[14px] font-semibold border text-[var(--color-fg)] hover:bg-[var(--color-bg-elevated)]" style={{ borderColor: "var(--color-border)" }}>
            About Me
          </Link>
        </div>
      </div>
      <div className="relative flex justify-center lg:justify-end">
        <BrainArtwork />
      </div>
    </section>
  );
}

function BrainArtwork() {
  const pts: [number, number][] = [
    [150,130],[200,110],[260,110],[310,130],[350,150],[140,200],[200,240],
    [280,220],[330,210],[370,200],[180,90],[220,140],[250,200],[270,250],
    [280,290],[120,170],[220,150],[320,100],[360,240],[80,220],[60,150],
    [410,100],[420,220],[80,90],[400,290],
  ];
  return (
    <div className="relative w-[380px] h-[300px] md:w-[460px] md:h-[360px]">
      <svg viewBox="0 0 460 360" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="g1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b7dff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#8b7dff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a89bff" />
            <stop offset="100%" stopColor="#6d5cff" />
          </linearGradient>
        </defs>
        <circle cx="240" cy="180" r="150" fill="url(#g1)" />
        <g stroke="url(#g2)" strokeWidth="1.2" opacity="0.85">
          <path d="M150 130 Q200 90 260 110 T350 150" />
          <path d="M140 200 Q200 240 280 220 T370 200" />
          <path d="M180 90 Q220 140 250 200 T280 290" />
          <path d="M120 170 Q180 180 220 150 T320 100" />
          <path d="M150 240 Q190 200 250 220 T360 240" />
        </g>
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 5 : 3.2} fill="url(#g2)" opacity={i % 4 === 0 ? 0.95 : 0.7} />
        ))}
        <g fill="#6d5cff" opacity="0.5">
          <rect x="50" y="280" width="14" height="14" rx="2" transform="rotate(20 57 287)" />
          <rect x="395" y="50" width="12" height="12" rx="2" transform="rotate(15 401 56)" />
          <rect x="370" y="310" width="16" height="16" rx="2" transform="rotate(-10 378 318)" />
        </g>
      </svg>
    </div>
  );
}
