import Link from "next/link";
import { getLearningChapters } from "../../_lib/posts";

export const metadata = {
  title: "Candlestick Charts",
  description: "A screenshot-based topic path for reading candlesticks, trends, ranges, pullbacks, and momentum.",
};

const coverage = [
  "Candle anatomy: body, wick, open, high, low, close, red and green candles.",
  "Timeframes and OHLC reading: how one candle changes meaning on 1H, 1D, and weekly charts.",
  "Support and resistance: repeated reactions, zones, breaks, and retests.",
  "Market structure: higher highs, higher lows, lower highs, lower lows, and trend change.",
  "Sideways markets: mixed candles, range boundaries, consolidation, and false signals.",
  "Momentum: tight movement, growing candle size, shrinking candle size, color change, and reversal risk.",
];

export default async function CandlestickChartsTopicPage() {
  const chapters = (await getLearningChapters("finance-education"))
    .filter((chapter) => chapter.topicSlug === "candlestick-charts")
    .sort((a, b) => a.order - b.order);
  const totalLessons = chapters.reduce((sum, chapter) => sum + Math.max(chapter.lessons.length, 1), 0);
  const totalReadTime = chapters.reduce((sum, chapter) => sum + chapter.readingTime, 0);

  return (
    <div className="mx-auto max-w-[1260px] pb-12 pt-7">
      <nav className="flex flex-wrap items-center gap-2 text-[13px] text-[#758290]">
        <Link href="/blog" className="transition hover:text-[#15924c]">Blog</Link>
        <span>›</span>
        <Link href="/learning" className="transition hover:text-[#15924c]">Topics</Link>
        <span>›</span>
        <span className="font-semibold text-[#1a2532]">Candlestick Charts</span>
      </nav>

      <section className="mt-8 overflow-hidden rounded-[30px] border border-[#dce9e0] bg-[radial-gradient(circle_at_20%_10%,rgba(34,197,94,0.14),transparent_32%),linear-gradient(135deg,#ffffff_0%,#f6fbf7_58%,#ffffff_100%)] p-7 shadow-[0_22px_60px_rgba(15,23,42,0.055)] lg:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            <div className="inline-flex rounded-full bg-[#eaf8ef] px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#15924c]">
              Technical Analysis Topic
            </div>
            <h1 className="mt-4 max-w-[760px] text-[48px] font-extrabold leading-[0.98] tracking-[-0.055em] text-[#101924] md:text-[62px]">
              Candlestick Charts
            </h1>
            <p className="mt-5 max-w-[720px] text-[18px] leading-8 text-[#435363]">
              A chapter-wise tutorial path built from the candlestick screenshots. Start with one candle, then move into levels, ranges, trend structure, pullbacks, and momentum shifts.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 text-[13px] font-bold text-[#33485f]">
              <span className="rounded-full border border-[#cfe4d7] bg-white px-4 py-2">{chapters.length} Chapters</span>
              <span className="rounded-full border border-[#cfe4d7] bg-white px-4 py-2">{totalLessons} Lessons</span>
              <span className="rounded-full border border-[#cfe4d7] bg-white px-4 py-2">{totalReadTime} min Total Length</span>
              <span className="rounded-full border border-[#cfe4d7] bg-white px-4 py-2">Beginner to Intermediate</span>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#d6e8db] bg-white/85 p-4 shadow-[0_18px_42px_rgba(15,23,42,0.06)]">
            <img
              src="/img/finance/trading-candles.png"
              alt=""
              className="aspect-[1.35] w-full rounded-[18px] object-cover"
            />
            <div className="mt-4 rounded-[16px] bg-[#102118] px-4 py-3 text-[13px] font-semibold leading-6 text-white">
              Screenshot coverage: anatomy, 1D candle reading, support zones, trend direction, uptrend/downtrend shifts, sideways markets, and momentum gain/loss.
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-[26px] font-extrabold tracking-[-0.03em] text-[#111a27]">Chapters in Candlestick Charts</h2>
              <p className="mt-1 text-[14px] text-[#62717d]">Read these in order. Each chapter covers a major screenshot section in detail.</p>
            </div>
            {chapters[0] && (
              <Link href={`/learning/${chapters[0].slug}`} className="hidden h-11 items-center rounded-[13px] bg-[#169b52] px-5 text-[14px] font-bold text-white shadow-[0_14px_26px_rgba(22,163,74,0.18)] md:inline-flex">
                Start Topic
              </Link>
            )}
          </div>

          <div className="mt-4 space-y-4">
            {chapters.map((chapter, index) => (
              <Link
                key={chapter.slug}
                href={`/learning/${chapter.slug}`}
                className="grid gap-4 rounded-[22px] border border-[#dfe9e1] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.035)] transition hover:-translate-y-0.5 hover:border-[#bfe6cc] md:grid-cols-[88px_minmax(0,1fr)_120px]"
              >
                <span className="grid h-16 w-16 place-items-center rounded-[18px] bg-[#eaf8ef] text-[24px] font-extrabold text-[#15924c]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#15924c]">{chapter.chapterTitle}</div>
                  <h3 className="mt-1 text-[22px] font-extrabold tracking-[-0.03em] text-[#15222f]">{chapter.title}</h3>
                  <p className="mt-2 max-w-[690px] text-[14px] leading-6 text-[#566674]">{chapter.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {chapter.lessons.slice(0, 4).map((lesson) => (
                      <span key={lesson} className="rounded-full bg-[#f0f6f2] px-3 py-1 text-[12px] font-semibold text-[#506070]">
                        {lesson}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-start gap-2 text-[13px] font-semibold text-[#647486] md:flex-col md:items-end md:justify-center">
                  <span>{chapter.readingTime} min read</span>
                  <span>{Math.max(chapter.lessons.length, 1)} lessons</span>
                </div>
              </Link>
            ))}
          </div>
        </main>

        <aside className="space-y-5 xl:sticky xl:top-20 xl:self-start">
          <section className="rounded-[22px] border border-[#dfe9e1] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.035)]">
            <h2 className="text-[18px] font-extrabold text-[#111a27]">What This Topic Covers</h2>
            <ul className="mt-4 space-y-3">
              {coverage.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14px] leading-6 text-[#405263]">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#15924c]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[22px] border border-[#cfe4d7] bg-[#eef8f2] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.03)]">
            <h2 className="text-[18px] font-extrabold text-[#111a27]">Best Reading Order</h2>
            <p className="mt-3 text-[14px] leading-6 text-[#566674]">
              Do not jump straight to trend-change signals. Read candle anatomy first, then levels and ranges, then trend structure and momentum.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
