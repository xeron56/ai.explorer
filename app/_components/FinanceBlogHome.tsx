import Link from "next/link";
import { BookmarkButton } from "./BookmarkButton";
import {
  getAllPosts,
  getLearningChapters,
  getLearningSeriesBySlug,
  type LearningChapter,
  type Post,
} from "../_lib/posts";

const toolbarItems = [
  "All Content",
  "Tutorials",
  "Guides",
  "Concepts",
  "Case Studies",
  "Glossary",
  "Books",
  "More",
];

const valueProps = [
  {
    title: "Structured Learning",
    description: "Chapter-wise tutorials for easy understanding.",
    icon: "book",
  },
  {
    title: "Practical Examples",
    description: "Real-life examples and case studies.",
    icon: "briefcase",
  },
  {
    title: "Expert Insights",
    description: "Learn from experienced finance professionals.",
    icon: "people",
  },
  {
    title: "Regular Updates",
    description: "New content added every week.",
    icon: "check",
  },
];

const postImages: Record<string, string> = {
  "understanding-transformer-attention": "/img/finance/bull-market.png",
  "how-layernorm-stabilizes-transformers": "/img/finance/diversified-portfolio.png",
  "gentle-intro-to-diffusion-models": "/img/finance/trading-candles.png",
  "why-self-supervised-learning-works": "/img/finance/emergency-fund.png",
  "understanding-interest-rates": "/img/finance/interest-rates.png",
  "crypto-investing-for-beginners": "/img/finance/crypto-bitcoin.png",
};

const fallbackImages = [
  "/img/finance/bull-market.png",
  "/img/finance/diversified-portfolio.png",
  "/img/finance/trading-candles.png",
  "/img/finance/emergency-fund.png",
  "/img/finance/interest-rates.png",
  "/img/finance/crypto-bitcoin.png",
  "/img/finance/etf-comparison.png",
  "/img/finance/compounding.png",
  "/img/finance/finance-asset-atlas.png",
];

type FinanceBlogHomeProps = {
  query?: string;
};

export async function FinanceBlogHome({ query }: FinanceBlogHomeProps) {
  const [posts, series, allChapters] = await Promise.all([
    getAllPosts(),
    getLearningSeriesBySlug("finance-education"),
    getLearningChapters("finance-education"),
  ]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const filteredChapters = normalizedQuery
    ? allChapters.filter((chapter) => matchesTutorialQuery(chapter, normalizedQuery))
    : allChapters;
  const chapters = filteredChapters.length > 0 ? filteredChapters : allChapters;
  const visibleChapters = chapters.slice(0, 6);
  const popularPosts = posts.slice(0, 5);
  const topicStats = buildTopicStats(posts, allChapters);
  const firstChapter = chapters[0] ?? allChapters[0];

  return (
    <div className="mx-auto max-w-[1240px] pb-10 pt-8">
      <Hero firstChapterHref={firstChapter ? `/learning/${firstChapter.slug}` : "/learning"} />
      <TopicToolbar />

      {normalizedQuery && (
        <div className="mt-5 rounded-[22px] border border-[#d8e8dc] bg-white px-5 py-4 text-[14px] text-[#52606d] shadow-[0_12px_34px_rgba(15,23,42,0.04)]">
          Showing chapter results for <span className="font-bold text-[#162330]">&quot;{query}&quot;</span>.
          {filteredChapters.length === 0 && (
            <span className="ml-2 text-[#7a8a96]">No direct matches found, so the full learning path is shown.</span>
          )}
        </div>
      )}

      <div className="mt-7 grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)_288px]">
        <aside className="space-y-4">
          <section className="rounded-[26px] border border-[#dfe9e1] bg-white p-4 shadow-[0_10px_32px_rgba(15,23,42,0.035)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-extrabold text-[#111a27]">Chapters</h2>
              {series && (
                <span className="rounded-full bg-[#eef8f2] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#15924c]">
                  {series.chapterCount} total
                </span>
              )}
            </div>
            <div className="mt-4 space-y-2.5">
              {allChapters.map((chapter, index) => (
                <Link
                  key={chapter.slug}
                  href={`/learning/${chapter.slug}`}
                  className={`group flex items-center gap-3 rounded-[18px] border px-3 py-3 transition ${
                    index === 0
                      ? "border-[#d2ead9] bg-[#f3fbf6] shadow-[0_10px_22px_rgba(22,163,74,0.08)]"
                      : "border-transparent hover:border-[#e0ebe2] hover:bg-[#f8fbf8]"
                  }`}
                >
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-[14px] ${chapterToneBg(chapter.tone)} ${chapterToneText(chapter.tone)}`}>
                    <ChapterIcon />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#7b8a96]">Chapter {chapter.order}</div>
                    <div className="mt-1 text-[14px] font-bold leading-5 text-[#18222e]">{chapter.chapterTitle}</div>
                    <div className="mt-1 text-[12px] text-[#778692]">{chapter.topicCount} topics</div>
                  </div>
                  <span className="text-[#91a09b] transition group-hover:text-[#15924c]">
                    <ArrowMiniIcon />
                  </span>
                </Link>
              ))}
            </div>
            <Link
              href="/learning"
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-[16px] border border-[#cfe3d5] bg-[#f7fcf8] text-[14px] font-bold text-[#15924c] transition hover:-translate-y-0.5"
            >
              View All Chapters
            </Link>
          </section>
        </aside>

        <main className="min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-[26px] font-extrabold tracking-[-0.03em] text-[#111a27]">Tutorials by Chapter</h2>
              <p className="mt-1 text-[14px] text-[#62717d]">
                {series?.description ?? "A structured path from the basics to advanced finance topics."}
              </p>
            </div>
            <Link href="/learning" className="inline-flex items-center gap-2 text-[14px] font-bold text-[#167aef]">
              View All Tutorials
              <ArrowMiniIcon />
            </Link>
          </div>

          <div className="mt-4 space-y-4">
            {visibleChapters.map((chapter) => (
              <TutorialCard key={chapter.slug} chapter={chapter} />
            ))}
          </div>

          <div className="mt-5 flex justify-center">
            <Link
              href="/learning"
              className="inline-flex h-12 items-center gap-2 rounded-[18px] border border-[#d9e5db] bg-white px-6 text-[14px] font-semibold text-[#405263] shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5"
            >
              Browse Full Learning Path
              <ChevronDownIcon />
            </Link>
          </div>
        </main>

        <aside className="space-y-5">
          <PopularPostsCard posts={popularPosts} />
          <SubscribeCard />
          <TopicCountCard topics={topicStats} />
        </aside>
      </div>

      <ValueStrip />
      <Footer />
    </div>
  );
}

function Hero({ firstChapterHref }: { firstChapterHref: string }) {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-[#deebe0] bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.12),transparent_32%),linear-gradient(135deg,#ffffff_0%,#f6fbf7_46%,#ffffff_100%)] px-5 py-7 shadow-[0_22px_60px_rgba(15,23,42,0.05)] md:px-8 lg:px-10 lg:py-8">
      <div className="absolute right-[-70px] top-[-50px] h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.16),rgba(34,197,94,0)_68%)]" />
      <div className="grid items-center gap-10 lg:grid-cols-[0.94fr_1.06fr]">
        <div>
          <span className="inline-flex text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#15924c]">
            Finance Education
          </span>
          <h1 className="mt-3 max-w-[620px] text-[48px] font-extrabold leading-[0.98] tracking-[-0.05em] text-[#101924] md:text-[64px]">
            Learn Finance.
            <br />
            Build Your <span className="text-[#18a052]">Future.</span>
          </h1>
          <p className="mt-5 max-w-[520px] text-[18px] leading-8 text-[#435363]">
            Chapter-wise tutorials, practical examples, and expert insights to help you master finance step by step.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href={firstChapterHref}
              className="inline-flex h-12 items-center rounded-[14px] bg-[#169b52] px-6 text-[15px] font-bold text-white shadow-[0_16px_28px_rgba(22,163,74,0.22)] transition hover:-translate-y-0.5"
            >
              Start Learning
            </Link>
            <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#304252]">
              New tutorials every week
              <CalendarIcon />
            </span>
          </div>
        </div>

        <div className="relative min-h-[320px]">
          <div className="absolute right-[40px] top-[18px] h-[210px] w-[210px] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.14),rgba(34,197,94,0)_68%)]" />
          <div className="absolute left-[54px] top-[120px] h-[146px] w-[206px] rotate-[-10deg] rounded-[18px] bg-[linear-gradient(180deg,#8ee3ab_0%,#1a9f55_88%)] shadow-[0_24px_44px_rgba(16,152,72,0.18)]" />
          <div className="absolute left-[34px] top-[154px] h-[146px] w-[206px] rotate-[-10deg] rounded-[18px] bg-[linear-gradient(180deg,#d7f8e2_0%,#74cf93_88%)] shadow-[0_20px_34px_rgba(16,152,72,0.12)]" />
          <div className="absolute left-[70px] top-[86px] h-[148px] w-[210px] rotate-[-10deg] rounded-[18px] bg-[linear-gradient(180deg,#c2f2d1_0%,#27b567_90%)] shadow-[0_26px_46px_rgba(16,152,72,0.15)]" />
          <div className="absolute left-[88px] top-[36px] h-[78px] w-[172px] rounded-[18px] bg-[linear-gradient(180deg,#39424f_0%,#111827_100%)] shadow-[0_22px_44px_rgba(15,23,42,0.22)]" />
          <div className="absolute left-[118px] top-[18px] h-[34px] w-[112px] rounded-[12px] bg-[linear-gradient(180deg,#303947_0%,#111827_100%)]" />
          <div className="absolute left-[252px] top-[108px] w-[160px] rounded-[28px] border border-[#dbe8df] bg-white/94 p-5 shadow-[0_22px_44px_rgba(15,23,42,0.07)] backdrop-blur">
            <div className="h-2.5 w-20 rounded-full bg-[#4dbf79]" />
            <div className="mt-4 flex items-end gap-2">
              {[30, 46, 40, 58, 72].map((height) => (
                <span key={height} className="w-4 rounded-t-full bg-[#e1f5e7]" style={{ height }} />
              ))}
            </div>
            <svg viewBox="0 0 120 60" className="mt-[-56px] h-[72px] w-full">
              <path d="M6 46 28 40 46 46 64 28 82 24 102 11" fill="none" stroke="#1aa152" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m97 11 5 0-2-5" fill="none" stroke="#1aa152" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-3 h-20 rounded-[20px] bg-[radial-gradient(circle_at_68%_36%,#d9f5e3_0%,#d9f5e3_24%,transparent_26%),linear-gradient(180deg,#f6fbf7_0%,#edf7f0_100%)]" />
          </div>
          <div className="absolute bottom-[28px] right-[14px] h-[88px] w-[66px] rounded-[24px] bg-[linear-gradient(180deg,#fefefe_0%,#f3f7f4_100%)] shadow-[0_18px_34px_rgba(15,23,42,0.08)]">
            <div className="absolute left-[28px] top-[-24px] h-9 w-1.5 rounded-full bg-[#6ab887]" />
            <div className="absolute left-[10px] top-[-14px] h-10 w-10 rounded-full bg-[#d9f5e3]" />
            <div className="absolute right-[6px] top-[-8px] h-8 w-8 rounded-full bg-[#b7ecc8]" />
          </div>
        </div>
      </div>
    </section>
  );
}

function TopicToolbar() {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 rounded-[20px] border border-[#dfe9e1] bg-white px-5 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
      {toolbarItems.map((item, index) => (
        <button
          key={item}
          className={`inline-flex h-10 items-center gap-2 rounded-[14px] px-4 text-[13px] font-semibold transition ${
            index === 0 ? "bg-[#effaf2] text-[#15924c] shadow-[inset_0_0_0_1px_#cef0d8]" : "text-[#233247] hover:bg-[#f4f8f4]"
          }`}
        >
          {index === 0 && <ToolbarGridIcon />}
          {item}
          {item === "More" && <ChevronDownIcon />}
        </button>
      ))}
    </div>
  );
}

function TutorialCard({ chapter }: { chapter: LearningChapter }) {
  return (
    <article className="grid gap-4 rounded-[24px] border border-[#dfe9e1] bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:grid-cols-[210px_minmax(0,1fr)]">
      <Link href={`/learning/${chapter.slug}`} className="overflow-hidden rounded-[18px]">
        <ArticleImage src={chapterImage(chapter)} alt="" />
      </Link>
      <div className="flex min-w-0 flex-col justify-center py-1">
        <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#16914a]">
          Chapter {chapter.order} <span className="mx-1 text-[#a4b8aa]">•</span> {chapter.chapterTitle}
        </div>
        <Link
          href={`/learning/${chapter.slug}`}
          className="mt-2 max-w-[32ch] text-[20px] font-extrabold leading-[1.22] text-[#101924] transition hover:text-[#15924c]"
        >
          {chapter.title}
        </Link>
        <p className="mt-2 max-w-[58ch] text-[14px] leading-6 text-[#334155]">{chapter.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px] text-[#70808d]">
          <AuthorBadge name={chapter.author} compact />
          <span>{chapter.formattedDate}</span>
          <span className="text-[#adc0b2]">•</span>
          <span>{chapter.readingTime} min read</span>
          <BookmarkButton slug={chapter.slug} className="ml-auto" />
        </div>
      </div>
    </article>
  );
}

function PopularPostsCard({ posts }: { posts: Post[] }) {
  return (
    <section className="rounded-[26px] border border-[#dfe9e1] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
      <h2 className="text-[18px] font-extrabold text-[#111a27]">Popular Posts</h2>
      <div className="mt-4 space-y-3">
        {posts.map((post, index) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="flex items-center gap-3 rounded-[16px] p-1.5 transition hover:bg-[#f6faf7]">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#eaf8ee] text-[#16914a]">
              <ArrowMiniIcon />
            </span>
            <div className="h-[56px] w-[56px] shrink-0 overflow-hidden rounded-[14px]">
              <img src={imageForPost(post, index)} alt="" className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="min-w-0">
              <div className="line-clamp-2 text-[13px] font-bold leading-5 text-[#17212c]">{post.title}</div>
              <div className="mt-1 text-[12px] text-[#82919d]">{post.formattedDate}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function SubscribeCard() {
  return (
    <section className="rounded-[26px] border border-[#cfe4d7] bg-[#eef8f2] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-white text-[#15924c] shadow-sm">
          <MailIcon />
        </span>
        <h2 className="text-[18px] font-extrabold text-[#111a27]">Stay Ahead in Finance</h2>
      </div>
      <p className="mt-3 text-[13px] leading-6 text-[#405263]">
        Subscribe to get the latest tutorials, guides, and expert insights straight to your inbox.
      </p>
      <input
        type="email"
        placeholder="Enter your email"
        className="mt-4 h-10 w-full rounded-[12px] border border-[#d7e7db] bg-white px-3 text-[12px] text-[#17212c] outline-none focus:border-[#75d49c] focus:ring-4 focus:ring-[#c7f1d6]"
      />
      <button className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-[12px] bg-[#169b52] text-[13px] font-bold text-white shadow-[0_12px_22px_rgba(22,163,74,0.18)]">
        Subscribe
      </button>
      <p className="mt-3 text-center text-[12px] text-[#7e8d99]">No spam, unsubscribe anytime.</p>
    </section>
  );
}

function TopicCountCard({ topics }: { topics: Array<{ label: string; count: number }> }) {
  return (
    <section className="rounded-[26px] border border-[#dfe9e1] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
      <h2 className="text-[18px] font-extrabold text-[#111a27]">Explore Topics</h2>
      <div className="mt-4 space-y-2">
        {topics.map((topic) => (
          <div key={topic.label} className="flex items-center gap-3 rounded-[14px] px-1 py-1">
            <span className="grid h-6 w-6 place-items-center rounded-[8px] bg-[#edf8f1] text-[#16914a]">
              <ToolbarGridIcon small />
            </span>
            <span className="flex-1 text-[13px] font-medium text-[#304252]">{topic.label}</span>
            <span className="rounded-full bg-[#f3f7f4] px-2.5 py-1 text-[12px] font-bold text-[#728391]">{topic.count}</span>
          </div>
        ))}
      </div>
      <Link href="/learning" className="mt-5 inline-flex items-center gap-2 text-[14px] font-bold text-[#15924c]">
        View all topics
        <ArrowMiniIcon />
      </Link>
    </section>
  );
}

function ValueStrip() {
  return (
    <section className="mt-10 grid gap-4 rounded-[28px] border border-[#dfe9e1] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:grid-cols-2 lg:grid-cols-4">
      {valueProps.map((item) => (
        <div key={item.title} className="flex items-start gap-4 px-2 py-2">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-[#ebf8ef] text-[#16914a]">
            <FeatureIcon variant={item.icon} />
          </span>
          <div>
            <div className="text-[13px] font-extrabold text-[#15222f]">{item.title}</div>
            <p className="mt-1 text-[12px] leading-5 text-[#405263]">{item.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-6 flex flex-col gap-4 px-1 pb-2 pt-2 text-[13px] text-[#7a8895] md:flex-row md:items-center md:justify-between">
      <p>© 2026 Stock&amp;Trade. All rights reserved.</p>
      <div className="flex flex-wrap items-center gap-5">
        <Link href="#" className="transition hover:text-[#15924c]">About Us</Link>
        <Link href="#" className="transition hover:text-[#15924c]">Contact</Link>
        <Link href="#" className="transition hover:text-[#15924c]">Privacy Policy</Link>
        <Link href="#" className="transition hover:text-[#15924c]">Terms of Service</Link>
      </div>
    </footer>
  );
}

function AuthorBadge({ name, compact = false }: { name: string; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#253444]">
      <span className={`${compact ? "h-7 w-7" : "h-8 w-8"} overflow-hidden rounded-full bg-[#eaf5ef]`}>
        <img src="/img/profile/avatar.png" alt="" className="h-full w-full object-cover" />
      </span>
      {name}
    </span>
  );
}

function ArticleImage({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} className="aspect-[1.28] w-full object-cover" loading="lazy" />;
}

function chapterImage(chapter: LearningChapter) {
  return chapter.thumbnail.startsWith("/") ? chapter.thumbnail : fallbackImages[(chapter.order - 1) % fallbackImages.length];
}

function matchesTutorialQuery(chapter: LearningChapter, query: string) {
  return [
    chapter.title,
    chapter.chapterTitle,
    chapter.description,
    chapter.author,
    chapter.tags.join(" "),
  ].some((value) => value.toLowerCase().includes(query));
}

function imageForPost(post: Post, index: number) {
  return postImages[post.slug] ?? fallbackImages[index % fallbackImages.length];
}

function buildTopicStats(posts: Post[], chapters: LearningChapter[]) {
  const counts = new Map<string, number>();

  for (const chapter of chapters) {
    counts.set(chapter.chapterTitle, (counts.get(chapter.chapterTitle) ?? 0) + Math.max(1, chapter.topicCount));
  }

  for (const post of posts) {
    if (post.category) counts.set(post.category, (counts.get(post.category) ?? 0) + 2);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 7)
    .map(([label, count]) => ({ label, count }));
}

function chapterToneBg(tone: string) {
  if (tone === "green" || tone === "emerald") return "bg-[#edfdf3]";
  if (tone === "teal") return "bg-[#ecfeff]";
  if (tone === "blue") return "bg-[#eef5ff]";
  return "bg-[#f3f5f9]";
}

function chapterToneText(tone: string) {
  if (tone === "green" || tone === "emerald") return "text-[#1f9c5c]";
  if (tone === "teal") return "text-[#0f766e]";
  if (tone === "blue") return "text-[#2370ea]";
  return "text-[#64748b]";
}

function FeatureIcon({ variant }: { variant: string }) {
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

function ToolbarGridIcon({ small = false }: { small?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className={small ? "h-4 w-4" : "h-4 w-4"} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="5" height="5" rx="1.2" />
      <rect x="12" y="3" width="5" height="5" rx="1.2" />
      <rect x="3" y="12" width="5" height="5" rx="1.2" />
      <rect x="12" y="12" width="5" height="5" rx="1.2" />
    </svg>
  );
}

function ChapterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v15.5a.5.5 0 0 1-.5.5H6.5A2.5 2.5 0 0 0 4 22" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m5 8 7 5 7-5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#169b52]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function ArrowMiniIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h12" />
      <path d="m10 4 6 6-6 6" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 7.5 5 5 5-5" />
    </svg>
  );
}
