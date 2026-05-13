import Link from "next/link";
import { ArrowRightIcon } from "./icons";

export function Hero() {
  return (
    <section className="grid min-h-[424px] items-center gap-8 border-b border-[var(--color-border)] pb-[46px] pt-[52px] lg:grid-cols-[1.04fr_0.96fr]">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f1fa] px-[15px] py-[7px] text-[13px] font-medium leading-none text-[#6653b8]">
          Welcome back <span>👋</span>
        </span>
        <h1 className="mt-[28px] text-[46px] font-extrabold leading-[1.18] tracking-[-0.02em] text-[#10172d] md:text-[49px]">
          Exploring <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-strong)] bg-clip-text text-transparent">AI,</span><br />
          one idea at a time.
        </h1>
        <p className="mt-[17px] max-w-[46ch] text-[18px] leading-[31px] text-[#43506b]">
          Thoughts, research, and experiments on deep learning, mathematics, and the future of intelligence.
        </p>
        <div className="mt-[36px] flex flex-wrap gap-[21px]">
          <Link href="/blog" className="inline-flex h-[47px] items-center gap-2 rounded-[7px] bg-gradient-to-r from-[#5a34f4] to-[#704cff] px-[29px] text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(91,53,244,0.18)] transition-transform hover:-translate-y-0.5">
            Browse Latest Posts <ArrowRightIcon width={15} height={15} />
          </Link>
          <Link href="/about" className="inline-flex h-[47px] items-center rounded-[7px] border bg-white px-[29px] text-[14px] font-semibold text-[#10172d] shadow-sm transition-colors hover:bg-[#f8f9fc]" style={{ borderColor: "var(--color-border)" }}>
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
  const pts: [number, number, number][] = [
    [172,92,4],[205,82,3],[242,90,4],[279,108,3],[303,137,4],[312,170,3],
    [286,205,4],[249,221,3],[205,219,4],[169,199,3],[150,164,4],[151,125,3],
    [219,124,3],[254,144,5],[219,169,4],[260,181,3],[190,151,3],[287,82,3],
    [330,111,4],[344,158,3],[327,205,4],[274,240,3],[222,246,4],[178,231,3],
  ];
  return (
    <div className="relative h-[290px] w-[410px] md:h-[318px] md:w-[455px]">
      <svg viewBox="0 0 455 318" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="brainGlow" cx="58%" cy="48%" r="58%">
            <stop offset="0%" stopColor="#7d63ff" stopOpacity="0.34" />
            <stop offset="55%" stopColor="#b7a8ff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="brainLine" x1="120" y1="80" x2="340" y2="235">
            <stop stopColor="#c8bcff" />
            <stop offset="1" stopColor="#6d50ff" />
          </linearGradient>
          <linearGradient id="cubeFill" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#d5cdff" />
            <stop offset="1" stopColor="#6d50ff" />
          </linearGradient>
          <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        <g stroke="#eceefa" strokeWidth="1">
          <path d="M18 108 188 34 430 86" />
          <path d="M0 166 184 89 455 143" />
          <path d="M28 226 214 145 430 199" />
          <path d="M96 66 372 236" />
          <path d="M42 204 321 55" />
          <path d="M168 20 410 164" />
        </g>
        <ellipse cx="245" cy="154" rx="178" ry="124" fill="url(#brainGlow)" />
        <g filter="url(#softBlur)" opacity="0.55">
          <path d="M159 117c7-41 50-65 93-55 40 9 52 36 49 67 32 5 50 26 44 56-7 34-46 52-79 43-28 29-73 23-91-11-42 0-66-28-57-61 4-15 18-31 41-39z" fill="#8d76ff" />
        </g>
        <g fill="#fff" fillOpacity="0.38" stroke="url(#brainLine)" strokeWidth="1.2">
          <path d="M161 112c4-36 41-58 80-50 25 6 42 20 49 40 35 4 58 25 55 56-3 30-30 52-63 52-26 26-70 20-89-8-37 4-66-17-68-49-1-19 11-34 36-41z" />
          <path d="M186 96c14-11 39-15 58-5 17 9 24 25 20 42 18-14 48-10 61 9" />
          <path d="M171 135c27-12 57-7 78 14 19-20 45-24 77-8" />
          <path d="M166 169c29 2 56 17 75 41" />
          <path d="M254 103c-15 20-13 47 5 68 14 16 16 36 5 56" />
          <path d="M213 84c-16 21-15 49 4 70 15 17 16 37 3 56" />
          <path d="M295 125c-22 10-37 27-45 53" />
        </g>
        <g stroke="url(#brainLine)" strokeWidth="1.15" opacity="0.8">
          <path d="M172 92 219 124 254 144 303 137 330 111" />
          <path d="M150 164 190 151 219 169 260 181 312 170 344 158" />
          <path d="M169 199 205 219 249 221 286 205 327 205" />
          <path d="M205 82 219 124 219 169 205 219 222 246" />
          <path d="M242 90 254 144 260 181 274 240" />
        </g>
        {pts.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#7358ff" opacity={i % 3 === 0 ? 0.9 : 0.62} />
        ))}
        <g fill="url(#cubeFill)" opacity="0.58">
          <circle cx="48" cy="159" r="3" />
          <circle cx="78" cy="121" r="3" />
          <circle cx="394" cy="176" r="13" />
          <circle cx="356" cy="220" r="8" />
          <rect x="105" y="52" width="16" height="16" rx="3" transform="rotate(-13 113 60)" />
          <rect x="374" y="254" width="22" height="22" rx="3" transform="rotate(0 385 265)" />
          <rect x="422" y="174" width="19" height="19" rx="3" transform="rotate(-29 431 183)" />
          <rect x="334" y="58" width="13" height="13" rx="3" transform="rotate(15 341 65)" />
        </g>
      </svg>
    </div>
  );
}
