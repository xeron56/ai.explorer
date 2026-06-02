import Link from "next/link";
import { getLearningChapters, getLearningSeriesBySlug } from "../_lib/posts";

export const metadata = { title: "Learning" };

const fallbackImages = [
  "/img/finance/bull-market.png",
  "/img/finance/diversified-portfolio.png",
  "/img/finance/trading-candles.png",
  "/img/finance/emergency-fund.png",
  "/img/finance/interest-rates.png",
  "/img/finance/crypto-bitcoin.png",
  "/img/finance/etf-comparison.png",
  "/img/finance/compounding.png",
];

export default async function LearningPage() {
  const [series, chapters] = await Promise.all([
    getLearningSeriesBySlug("finance-education"),
    getLearningChapters("finance-education"),
  ]);

  const firstChapter = chapters[0];

  return (
    <div className="mx-auto max-w-[1180px] pb-14 pt-8">
      <section className="rounded-[34px] border border-[#deebe0] bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.12),transparent_32%),linear-gradient(135deg,#ffffff_0%,#f6fbf7_46%,#ffffff_100%)] px-6 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.05)] md:px-8 md:py-10">
        <span className="inline-flex text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#15924c]">
          {series?.category ?? "Finance Education"}
        </span>
        <h1 className="mt-3 max-w-[12ch] text-[46px] font-extrabold leading-[0.98] tracking-[-0.05em] text-[#101924] md:text-[58px]">
          Learn Finance Chapter by Chapter
        </h1>
        <p className="mt-5 max-w-[720px] text-[18px] leading-8 text-[#435363]">
          {series?.description ?? "A structured path from the basics of money to investing, analysis, and long-term planning."}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-[14px] font-semibold text-[#314252]">
          <span>{series?.chapterCount ?? chapters.length} chapters</span>
          <span className="text-[#adc0b2]">•</span>
          <span>{series?.difficulty ?? "Beginner to Intermediate"}</span>
          <span className="text-[#adc0b2]">•</span>
          <span>{series?.totalReadTime ?? "Self-paced"}</span>
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Link
            href={firstChapter ? `/learning/${firstChapter.slug}` : "/blog"}
            className="inline-flex h-12 items-center rounded-[14px] bg-[#169b52] px-6 text-[15px] font-bold text-white shadow-[0_16px_28px_rgba(22,163,74,0.22)] transition hover:-translate-y-0.5"
          >
            Start with Chapter 1
          </Link>
          <Link href="/blog" className="inline-flex h-12 items-center rounded-[14px] border border-[#cfe3d5] bg-white px-6 text-[15px] font-bold text-[#15924c]">
            Back to blog
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-extrabold tracking-[-0.03em] text-[#111a27]">All Chapters</h2>
            <p className="mt-2 text-[15px] text-[#62717d]">Move through the series in order or jump to the topic you need right now.</p>
          </div>
          <span className="rounded-full bg-[#effaf2] px-4 py-2 text-[12px] font-bold uppercase tracking-[0.12em] text-[#15924c]">
            Updated {series?.formattedLastUpdated ?? "recently"}
          </span>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {chapters.map((chapter, index) => (
            <Link
              key={chapter.slug}
              href={`/learning/${chapter.slug}`}
              className="group overflow-hidden rounded-[24px] border border-[#dfe9e1] bg-white shadow-[0_10px_32px_rgba(15,23,42,0.035)] transition hover:-translate-y-0.5"
            >
              <img
                src={chapter.thumbnail.startsWith("/") ? chapter.thumbnail : fallbackImages[index % fallbackImages.length]}
                alt=""
                className="aspect-[1.9] w-full object-cover"
              />
              <div className="p-5">
                <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#16914a]">
                  Chapter {chapter.order} <span className="mx-1 text-[#a4b8aa]">•</span> {chapter.chapterTitle}
                </div>
                <h3 className="mt-2 text-[22px] font-extrabold leading-[1.18] tracking-[-0.03em] text-[#111a27] transition group-hover:text-[#15924c]">
                  {chapter.title}
                </h3>
                <p className="mt-3 text-[14px] leading-7 text-[#475869]">{chapter.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px] font-semibold text-[#70808d]">
                  <span>{chapter.author}</span>
                  <span>{chapter.formattedDate}</span>
                  <span>{chapter.readingTime} min read</span>
                  <span>{chapter.topicCount} topics</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
