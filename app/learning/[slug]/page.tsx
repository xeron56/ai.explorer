import Link from "next/link";
import { notFound } from "next/navigation";
import { CandlestickTutorialChart } from "../../_components/CandlestickTutorialChart";
import { ChapterActions } from "../../_components/ChapterActions";
import { compileMdx } from "../../_lib/mdx";
import { getLearningChapters, getLearningSeriesBySlug } from "../../_lib/posts";
import { ClockIcon } from "../../_components/icons";

const learningMdxComponents = {
  CandlestickTutorialChart,
};

export async function generateStaticParams() {
  const chapters = await getLearningChapters();
  return chapters.map((chapter) => ({ slug: chapter.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = (await getLearningChapters()).find((item) => item.slug === slug);
  if (!chapter) return {};
  return { title: chapter.title, description: chapter.description };
}

export default async function LearningChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapters = await getLearningChapters();
  const chapter = chapters.find((item) => item.slug === slug);
  if (!chapter) notFound();

  const series = await getLearningSeriesBySlug(chapter.series);
  const contentWithAnchors = addHeadingAnchors(chapter.content);
  const MDX = await compileMdx(contentWithAnchors);
  const seriesChapters = chapters.filter((item) => item.series === chapter.series);
  const topicChapters = seriesChapters.filter((item) => item.topicSlug === chapter.topicSlug);
  const topicIndex = Math.max(0, topicChapters.findIndex((item) => item.slug === chapter.slug));
  const previous = topicChapters.length > 1
    ? topicChapters[topicIndex - 1]
    : seriesChapters.find((item) => item.order === chapter.order - 1);
  const next = topicChapters.length > 1
    ? topicChapters[topicIndex + 1]
    : seriesChapters.find((item) => item.order === chapter.order + 1);
  const relatedChapters = resolveRelatedChapters(seriesChapters, chapter.related, chapter.slug);
  const outline = extractHeadings(chapter.content);
  const lessons = chapter.lessons.length > 0 ? chapter.lessons : outline.map((item) => item.title);
  const progressTotal = topicChapters.length > 1 ? topicChapters.length : seriesChapters.length;
  const progressIndex = topicChapters.length > 1 ? topicIndex + 1 : chapter.order;
  const progress = Math.max(1, Math.round((progressIndex / Math.max(progressTotal, 1)) * 100));
  const topicHref = chapter.topicSlug === "candlestick-charts" ? "/learning/candlestick-charts" : "/learning";

  return (
    <div className="mx-auto max-w-[1240px] pb-12 pt-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
        <main className="min-w-0">
          <nav className="flex flex-wrap items-center gap-2 text-[13px] text-[#758290]">
            <Link href="/blog" className="transition hover:text-[#15924c]">Blog</Link>
            <span>›</span>
            <Link href="/learning" className="transition hover:text-[#15924c]">Tutorials</Link>
            <span>›</span>
            <Link href={topicHref} className="transition hover:text-[#15924c]">{chapter.topicTitle}</Link>
            <span>›</span>
            <span className="font-semibold text-[#1a2532]">{chapter.title}</span>
          </nav>

          <header className="mt-6">
            <div className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#15924c]">
              {chapter.topicTitle}
              <span className="mx-2 text-[#b1c0b7]">•</span>
              Chapter {progressIndex} of {progressTotal}
              <span className="mx-2 text-[#b1c0b7]">•</span>
              {chapter.chapterTitle}
            </div>
            <h1 className="mt-3 max-w-[14ch] text-[46px] font-extrabold leading-[1.03] tracking-[-0.05em] text-[#101924] md:text-[60px]">
              {chapter.title}
            </h1>
            <p className="mt-4 max-w-[760px] text-[18px] leading-8 text-[#506070]">
              {chapter.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-3 text-[13px] font-semibold text-[#2b3a49]">
                <span className="h-9 w-9 overflow-hidden rounded-full bg-[#eaf5ef]">
                  <img src="/img/profile/avatar.png" alt="" className="h-full w-full object-cover" />
                </span>
                <span>{chapter.author}</span>
                <span className="text-[#a6b3bd]">•</span>
                <span>{chapter.formattedDate}</span>
                <span className="text-[#a6b3bd]">•</span>
                <span className="inline-flex items-center gap-1.5"><ClockIcon width={14} height={14} />{chapter.readingTime} min read</span>
              </div>

              <ChapterActions slug={chapter.slug} title={chapter.title} />
            </div>

            {chapter.thumbnail.startsWith("/") && (
              <div className="mt-6 overflow-hidden rounded-[24px] border border-[#dfe9e1] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.04)]">
                <img src={chapter.thumbnail} alt="" className="aspect-[2.1] w-full object-cover" />
              </div>
            )}
          </header>

          {chapter.takeaways.length > 0 && (
            <section className="mt-8 rounded-[22px] border border-[#d9ecdf] bg-[linear-gradient(180deg,#f7fcf8_0%,#f1faf4_100%)] p-5 shadow-[0_10px_28px_rgba(15,23,42,0.03)]">
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#169b52] text-white">
                  <CheckCircleIcon />
                </span>
                <h2 className="text-[22px] font-extrabold tracking-[-0.03em] text-[#122131]">Key Takeaways</h2>
              </div>
              <ul className="mt-4 space-y-2.5">
                {chapter.takeaways.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[14px] leading-7 text-[#415264]">
                    <span className="mt-1.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#e8f7ee] text-[#169b52]">
                      <DotCheckIcon />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <article className="prose-post prose-finance mt-8">
            <MDX components={learningMdxComponents} />
          </article>

          <nav className="mt-8 flex flex-col gap-4 border-t border-[#e2ebe4] pt-8 md:flex-row md:items-center md:justify-between">
            {previous ? (
              <Link
                href={`/learning/${previous.slug}`}
                className="inline-flex h-12 items-center gap-2 rounded-[14px] border border-[#cfe3d5] bg-white px-5 text-[14px] font-semibold text-[#15924c] transition hover:-translate-y-0.5"
              >
                <ArrowLeftIcon />
                Previous: {previous.chapterTitle}
              </Link>
            ) : <span />}

            {next && (
              <Link
                href={`/learning/${next.slug}`}
                className="inline-flex h-12 items-center gap-2 rounded-[14px] bg-[#169b52] px-5 text-[14px] font-semibold text-white shadow-[0_14px_26px_rgba(22,163,74,0.18)] transition hover:-translate-y-0.5"
              >
                Next: {next.chapterTitle}
                <ArrowRightMiniIcon />
              </Link>
            )}
          </nav>

          <section className="mt-10 grid gap-4 rounded-[26px] border border-[#dfe9e1] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((item) => (
              <div key={item.title} className="flex items-start gap-4 px-2 py-2">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-[#ebf8ef] text-[#16914a]">
                  <ValueIcon variant={item.icon} />
                </span>
                <div>
                  <div className="text-[13px] font-extrabold text-[#15222f]">{item.title}</div>
                  <p className="mt-1 text-[12px] leading-5 text-[#405263]">{item.description}</p>
                </div>
              </div>
            ))}
          </section>

          <footer className="mt-6 flex flex-col gap-4 px-1 pb-2 pt-2 text-[13px] text-[#7a8895] md:flex-row md:items-center md:justify-between">
            <p>© 2026 Stock&amp;Trade. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-5">
              <Link href="#" className="transition hover:text-[#15924c]">About Us</Link>
              <Link href="#" className="transition hover:text-[#15924c]">Contact</Link>
              <Link href="#" className="transition hover:text-[#15924c]">Privacy Policy</Link>
              <Link href="#" className="transition hover:text-[#15924c]">Terms of Service</Link>
            </div>
          </footer>
        </main>

        <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
          <section className="rounded-[24px] border border-[#dfe9e1] bg-white p-5 shadow-[0_10px_32px_rgba(15,23,42,0.035)]">
            <h2 className="text-[18px] font-extrabold text-[#111a27]">Chapter Progress</h2>
            <div className="mt-4 text-[14px] font-medium text-[#5d6d7a]">{chapter.topicTitle}: Chapter {progressIndex} of {progressTotal}</div>
            <div className="mt-3 h-2.5 rounded-full bg-[#edf3ee]">
              <div className="h-full rounded-full bg-[#169b52]" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-1 text-right text-[12px] font-bold text-[#7b8a96]">{progress}%</div>
            <div className="mt-4 space-y-1.5">
              {lessons.slice(0, 7).map((item, index) => (
                <div
                  key={item}
                  className={`flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-[13px] ${
                    index === 0 ? "bg-[#effaf2] font-semibold text-[#15924c]" : "text-[#4e5f70]"
                  }`}
                >
                  <span className={`grid h-5 w-5 place-items-center rounded-full ${index === 0 ? "bg-white text-[#15924c]" : "bg-[#f3f7f4] text-[#7a8a96]"}`}>
                    <LessonIcon />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {outline.length > 0 && (
            <section className="rounded-[24px] border border-[#dfe9e1] bg-white p-5 shadow-[0_10px_32px_rgba(15,23,42,0.035)]">
              <h2 className="text-[18px] font-extrabold text-[#111a27]">On This Page</h2>
              <div className="mt-4 space-y-3">
                {outline.map((item, index) => (
                  <a key={item.id} href={`#${item.id}`} className="block text-[14px] leading-6 text-[#4c5e70] transition hover:text-[#15924c]">
                    {index + 1}. {item.title}
                  </a>
                ))}
              </div>
            </section>
          )}

          {relatedChapters.length > 0 && (
            <section className="rounded-[24px] border border-[#dfe9e1] bg-white p-5 shadow-[0_10px_32px_rgba(15,23,42,0.035)]">
              <h2 className="text-[18px] font-extrabold text-[#111a27]">Related Tutorials</h2>
              <div className="mt-4 space-y-4">
                {relatedChapters.map((item, index) => (
                  <Link key={item.slug} href={`/learning/${item.slug}`} className="flex items-center gap-3 rounded-[16px] transition hover:bg-[#f8fbf8]">
                    <img
                      src={item.thumbnail.startsWith("/") ? item.thumbnail : fallbackImages[index % fallbackImages.length]}
                      alt=""
                      className="h-[64px] w-[64px] shrink-0 rounded-[14px] object-cover"
                    />
                    <div className="min-w-0">
                      <div className="line-clamp-2 text-[14px] font-bold leading-5 text-[#17212c]">{item.title}</div>
                      <div className="mt-1 text-[12px] text-[#82919d]">{item.readingTime} min read</div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href="/learning"
                className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-[14px] border border-[#cfe3d5] bg-white text-[14px] font-semibold text-[#15924c]"
              >
                View All Tutorials
              </Link>
            </section>
          )}

          <section className="rounded-[24px] border border-[#cfe4d7] bg-[#eef8f2] p-5 shadow-[0_10px_32px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[18px] font-extrabold text-[#111a27]">Test Your Knowledge</h2>
                <p className="mt-2 text-[14px] leading-6 text-[#566674]">Take a quick quiz to reinforce what you&apos;ve learned.</p>
              </div>
              <span className="grid h-14 w-14 place-items-center rounded-[16px] bg-white text-[#15924c] shadow-sm">
                <QuizIcon />
              </span>
            </div>
            <button className="mt-4 inline-flex h-11 items-center justify-center rounded-[14px] bg-[#169b52] px-5 text-[14px] font-semibold text-white shadow-[0_14px_26px_rgba(22,163,74,0.18)]">
              Start Quiz
            </button>
          </section>

          <section className="rounded-[24px] border border-[#dfe9e1] bg-white p-5 shadow-[0_10px_32px_rgba(15,23,42,0.035)]">
            <h2 className="text-[18px] font-extrabold text-[#111a27]">Stay Ahead in Finance</h2>
            <p className="mt-3 text-[14px] leading-6 text-[#566674]">Get the latest tutorials and insights straight to your inbox.</p>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-4 h-11 w-full rounded-[14px] border border-[#d7e7db] bg-white px-4 text-[14px] text-[#17212c] outline-none focus:border-[#75d49c] focus:ring-4 focus:ring-[#c7f1d6]"
            />
            <button className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-[14px] bg-[#169b52] text-[14px] font-semibold text-white shadow-[0_14px_26px_rgba(22,163,74,0.18)]">
              Subscribe
            </button>
            <p className="mt-3 text-center text-[12px] text-[#7e8d99]">No spam, unsubscribe anytime.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}

const fallbackImages = [
  "/img/finance/bull-market.png",
  "/img/finance/diversified-portfolio.png",
  "/img/finance/trading-candles.png",
  "/img/finance/emergency-fund.png",
  "/img/finance/interest-rates.png",
  "/img/finance/crypto-bitcoin.png",
];

const valueProps = [
  { title: "Structured Learning", description: "Learn chapter-wise with built-in progress tracking.", icon: "book" },
  { title: "Practical Examples", description: "Real-life examples to help you understand better.", icon: "briefcase" },
  { title: "Expert Content", description: "Well-researched content by finance experts.", icon: "people" },
  { title: "Learn at Your Pace", description: "Study anytime, anywhere, at your own speed.", icon: "check" },
];

function extractHeadings(content: string) {
  const matches = [...content.matchAll(/^##\s+(.+)$/gm)];
  return matches.map((match) => {
    const title = match[1].trim();
    return { title, id: slugify(title) };
  });
}

function addHeadingAnchors(content: string) {
  return content.replace(/^##\s+(.+)$/gm, (_, rawTitle: string) => {
    const title = rawTitle.trim();
    return `## <span id="${slugify(title)}">${title}</span>`;
  });
}

function resolveRelatedChapters(
  chapters: Awaited<ReturnType<typeof getLearningChapters>>,
  relatedSlugs: string[],
  currentSlug: string,
) {
  const bySlug = new Map(chapters.map((item) => [item.slug, item]));
  const explicit = relatedSlugs
    .map((slug) => bySlug.get(slug))
    .filter((item): item is Awaited<ReturnType<typeof getLearningChapters>>[number] => Boolean(item));
  if (explicit.length > 0) return explicit.slice(0, 4);
  return chapters.filter((item) => item.slug !== currentSlug).slice(0, 4);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
      <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.54-9.96-4.25 4.25a.75.75 0 0 1-1.06 0L6.46 10.5a.75.75 0 0 1 1.06-1.06l1.24 1.24 3.72-3.72a.75.75 0 1 1 1.06 1.06Z" />
    </svg>
  );
}

function DotCheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor">
      <path d="m8.3 13.2-2.5-2.5 1.1-1.1 1.4 1.4 4-4 1.1 1.1-5.1 5.1Z" />
    </svg>
  );
}

function LessonIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="12" height="12" rx="2" />
      <path d="M7 10h6" />
      <path d="M7 7h4" />
    </svg>
  );
}

function QuizIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
      <path d="M9 2v4" />
      <path d="M15 2v4" />
    </svg>
  );
}

function ValueIcon({ variant }: { variant: string }) {
  if (variant === "briefcase") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="7" width="18" height="13" rx="3" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18" />
      </svg>
    );
  }
  if (variant === "people") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="3" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 4.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  if (variant === "check") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 12 4 4L19 6" />
        <rect x="3" y="3" width="18" height="18" rx="4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5V6.5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v13" />
      <path d="M8 4.5V19" />
      <path d="M8 8h8" />
      <path d="M8 12h6" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 10H4" />
      <path d="m9 5-5 5 5 5" />
    </svg>
  );
}

function ArrowRightMiniIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h12" />
      <path d="m11 5 5 5-5 5" />
    </svg>
  );
}
