import Link from "next/link";
import { getAllPosts, getLearningChapters, getLearningSeriesBySlug, type LearningChapter } from "../_lib/posts";

export const metadata = { title: "Learning" };

const topicTabs = [
  "All Topics",
  "Personal Finance",
  "Investing",
  "Markets",
  "Analysis",
  "Economy",
  "Planning",
  "Advanced",
  "More",
];

const bundleProgress = [75, 45, 30, 20, 10, 15, 25, 20, 35, 40];

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

const valueProps = [
  {
    title: "Structured Learning",
    description: "Chapter-wise tutorials to build solid concepts.",
    icon: "book",
  },
  {
    title: "Practical Examples",
    description: "Real-life examples to make learning easy.",
    icon: "briefcase",
  },
  {
    title: "Expert Insights",
    description: "Learn from experienced finance professionals.",
    icon: "people",
  },
  {
    title: "Track Progress",
    description: "Monitor your learning and stay consistent.",
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

export default async function LearningPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const query = params.q?.trim().toLowerCase() ?? "";

  const [series, chapters, posts] = await Promise.all([
    getLearningSeriesBySlug("finance-education"),
    getLearningChapters("finance-education"),
    getAllPosts(),
  ]);

  const filteredChapters = query
    ? chapters.filter((chapter) => matchesQuery(chapter, query))
    : chapters;
  const bundles = (filteredChapters.length > 0 ? filteredChapters : chapters).map((chapter, index) =>
    buildBundle(chapter, index),
  );
  const totalLessons = chapters.reduce((sum, chapter) => sum + Math.max(chapter.topicCount, chapter.lessons.length, 1), 0);
  const completedCount = bundles.filter((bundle) => bundle.progress >= 70).length;
  const overallProgress = Math.round(bundles.reduce((sum, bundle) => sum + bundle.progress, 0) / Math.max(bundles.length, 1));
  const continueLearning = bundles.filter((bundle) => bundle.progress > 0).slice(0, 3);
  const popularPosts = posts.slice(0, 3);
  const topicCounts = buildTopicCounts(chapters);

  return (
    <div className="mx-auto max-w-[1260px] pb-12 pt-8">
      <Hero />

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <form action="/learning" className="flex min-w-0 flex-1 items-center gap-3">
          <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-[16px] border border-[#dfe9e1] bg-white px-4 shadow-[0_10px_30px_rgba(15,23,42,0.03)]">
            <SearchIcon />
            <input
              type="search"
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Search topics or chapters..."
              className="w-full min-w-0 bg-transparent text-[14px] text-[#15222f] outline-none placeholder:text-[#7d8a96]"
            />
          </label>
          <button className="inline-flex h-12 items-center gap-2 rounded-[14px] border border-[#dfe9e1] bg-white px-4 text-[14px] font-semibold text-[#425364] shadow-[0_10px_30px_rgba(15,23,42,0.03)]">
            <FilterIcon />
            Filter
            <ChevronDownIcon />
          </button>
        </form>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-[20px] border border-[#dfe9e1] bg-white px-5 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
        {topicTabs.map((tab, index) => (
          <button
            key={tab}
            className={`inline-flex h-10 items-center gap-2 rounded-[14px] px-4 text-[13px] font-semibold transition ${
              index === 0 ? "bg-[#effaf2] text-[#15924c] shadow-[inset_0_0_0_1px_#cef0d8]" : "text-[#233247] hover:bg-[#f4f8f4]"
            }`}
          >
            {index === 0 && <GeneratedIcon name="all-topics" className="h-5 w-5" />}
            {tab}
            {tab === "More" && <ChevronDownIcon />}
          </button>
        ))}
      </div>

      {query && (
        <div className="mt-5 rounded-[18px] border border-[#d8e8dc] bg-white px-5 py-4 text-[14px] text-[#52606d] shadow-[0_12px_34px_rgba(15,23,42,0.04)]">
          Showing topic bundles for <span className="font-bold text-[#162330]">&quot;{params.q}&quot;</span>.
          {filteredChapters.length === 0 && <span className="ml-2 text-[#7a8a96]">No direct matches found, so the full topic catalog is shown.</span>}
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[190px_minmax(0,1fr)_300px]">
        <aside className="space-y-4">
          <section className="rounded-[22px] border border-[#dfe9e1] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.03)]">
            <h2 className="text-[18px] font-extrabold text-[#111a27]">All Topics</h2>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-3 rounded-[14px] bg-[#effaf2] px-3 py-2.5 text-[13px] font-semibold text-[#15924c]">
                <span className="grid h-7 w-7 place-items-center rounded-[10px] bg-white text-[#15924c]">
                  <GeneratedIcon name="all-topics" className="h-5 w-5" />
                </span>
                <span className="flex-1">All Topics</span>
                <span>{topicCounts.reduce((sum, topic) => sum + topic.count, 0)}</span>
              </div>
              {topicCounts.map((topic) => (
                <div key={topic.label} className="flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-[13px] text-[#314252]">
                  <span className="grid h-7 w-7 place-items-center rounded-[10px] bg-[#f4f8f4] text-[#5c6d78]">
                    <TopicIcon label={topic.label} />
                  </span>
                  <span className="flex-1">{topic.label}</span>
                  <span className="font-semibold text-[#7a8a96]">{topic.count}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-[22px] border border-[#dfe9e1] bg-[linear-gradient(180deg,#f8fcf9_0%,#edf8f0_100%)] p-4 shadow-[0_10px_30px_rgba(15,23,42,0.03)]">
            <h2 className="text-[18px] font-extrabold text-[#111a27]">Not sure where to start?</h2>
            <p className="mt-3 text-[14px] leading-6 text-[#5a6876]">
              Take our quick quiz and we&apos;ll recommend the perfect path for you.
            </p>
            <div className="mt-5 flex items-end justify-between gap-3">
              <button className="inline-flex h-11 items-center rounded-[14px] bg-[#169b52] px-5 text-[14px] font-semibold text-white shadow-[0_14px_26px_rgba(22,163,74,0.18)]">
                Find My Path
              </button>
              <span className="grid h-20 w-20 place-items-center rounded-full bg-white/70 text-[#169b52] shadow-[0_12px_24px_rgba(22,163,74,0.12)]">
                <CompassIcon />
              </span>
            </div>
          </section>
        </aside>

        <main className="min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-[26px] font-extrabold tracking-[-0.03em] text-[#111a27]">All Topic Bundles</h2>
              <p className="mt-1 text-[14px] text-[#62717d]">
                Build practical finance knowledge through structured topic tracks.
              </p>
            </div>
            <div className="text-[13px] font-semibold text-[#5d6d7a]">
              {bundles.length} Bundles <span className="mx-1.5 text-[#afbcc4]">•</span> {totalLessons}+ Lessons
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {bundles.map((bundle) => (
              <TopicBundleCard key={bundle.slug} bundle={bundle} />
            ))}
          </div>

          <div className="mt-5 flex justify-center">
            <button className="inline-flex h-11 items-center gap-2 rounded-[14px] border border-[#d9e5db] bg-white px-6 text-[14px] font-semibold text-[#405263] shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5">
              View More Topic Bundles
              <ChevronDownIcon />
            </button>
          </div>
        </main>

        <aside className="space-y-5">
          <section className="rounded-[22px] border border-[#dfe9e1] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.03)]">
            <h2 className="text-[18px] font-extrabold text-[#111a27]">Your Learning Journey</h2>
            <div className="mt-5 flex items-center gap-4">
              <ProgressRing value={overallProgress} size={88} />
              <div className="space-y-3 text-[14px] text-[#4e5f70]">
                <StatRow icon="book" label={`${completedCount} / ${chapters.length}`} value="Bundles started" />
                <StatRow icon="clock" label={`${series?.totalReadTime ?? "18.5 hrs"}`} value="Total learning time" />
                <StatRow icon="award" label={`${Math.max(1, Math.round(overallProgress / 12))}`} value="Milestones reached" />
              </div>
            </div>
            <Link
              href="/blog"
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-[14px] bg-[#169b52] text-[14px] font-semibold text-white shadow-[0_14px_26px_rgba(22,163,74,0.18)]"
            >
              Go to Dashboard
            </Link>
          </section>

          <section className="rounded-[22px] border border-[#dfe9e1] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.03)]">
            <h2 className="text-[18px] font-extrabold text-[#111a27]">Continue Learning</h2>
            <div className="mt-4 space-y-4">
              {continueLearning.map((bundle, index) => (
                <Link key={bundle.slug} href={bundle.href} className="flex items-start gap-3 rounded-[14px] transition hover:bg-[#f8fbf8]">
                  <img
                    src={bundle.image || fallbackImages[index % fallbackImages.length]}
                    alt=""
                    className="h-[58px] w-[58px] shrink-0 rounded-[12px] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 text-[14px] font-bold text-[#17212c]">{bundle.previewLessons[0] ?? bundle.title}</div>
                    <div className="mt-1 text-[12px] text-[#7b8a96]">Chapter {bundle.order} • {bundle.title}</div>
                    <div className="mt-2 h-1.5 rounded-full bg-[#edf3ee]">
                      <div className="h-full rounded-full bg-[#169b52]" style={{ width: `${bundle.progress}%` }} />
                    </div>
                  </div>
                  <div className="text-[12px] font-semibold text-[#7b8a96]">{bundle.progress}%</div>
                </Link>
              ))}
            </div>
            <Link href="/learning" className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-[#15924c]">
              View All In Progress
              <ArrowMiniIcon />
            </Link>
          </section>

          <section className="rounded-[22px] border border-[#dfe9e1] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.03)]">
            <h2 className="text-[18px] font-extrabold text-[#111a27]">Popular in Blog</h2>
            <div className="mt-4 space-y-4">
              {popularPosts.map((post, index) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="flex items-center gap-3 rounded-[14px] transition hover:bg-[#f8fbf8]">
                  <img src={postImages[post.slug] ?? fallbackImages[index % fallbackImages.length]} alt="" className="h-[58px] w-[58px] shrink-0 rounded-[12px] object-cover" />
                  <div className="min-w-0">
                    <div className="line-clamp-2 text-[14px] font-bold leading-5 text-[#17212c]">{post.title}</div>
                    <div className="mt-1 text-[12px] text-[#7b8a96]">{post.formattedDate}</div>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/blog" className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-[#15924c]">
              Read More Articles
              <ArrowMiniIcon />
            </Link>
          </section>

          <section className="rounded-[22px] border border-[#dfe9e1] bg-[linear-gradient(180deg,#f6fbf7_0%,#eef8f2_100%)] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[18px] font-extrabold text-[#111a27]">Stay Ahead in Finance</h2>
                <p className="mt-2 text-[14px] leading-6 text-[#566674]">
                  Get weekly tutorials, guides, and insights straight to your inbox.
                </p>
              </div>
              <span className="grid h-16 w-16 place-items-center rounded-[18px] bg-white/80 text-[#16914a] shadow-sm">
                <MailIcon />
              </span>
            </div>
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

      <section className="mt-10 grid gap-4 rounded-[24px] border border-[#dfe9e1] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:grid-cols-2 lg:grid-cols-4">
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
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[34px] border border-[#deebe0] bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.12),transparent_34%),linear-gradient(135deg,#ffffff_0%,#f6fbf7_44%,#ffffff_100%)] px-6 py-8 shadow-[0_22px_60px_rgba(15,23,42,0.05)] md:px-8 lg:px-10 lg:py-10">
      <div className="absolute right-[-60px] top-[-40px] h-[240px] w-[240px] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.14),rgba(34,197,94,0)_68%)]" />
      <div className="grid items-center gap-10 lg:grid-cols-[0.96fr_1.04fr]">
        <div>
          <span className="inline-flex text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#15924c]">
            Finance Education
          </span>
          <h1 className="mt-3 max-w-[650px] text-[48px] font-extrabold leading-[0.98] tracking-[-0.05em] text-[#101924] md:text-[62px]">
            Learn by Topics.
            <br />
            Master Finance <span className="text-[#18a052]">Step by Step.</span>
          </h1>
          <p className="mt-5 max-w-[520px] text-[18px] leading-8 text-[#435363]">
            Explore structured tutorial bundles to build strong financial knowledge from the ground up.
          </p>
        </div>

        <div className="relative min-h-[290px]">
          <img
            src="/img/finance/learning-topics-hero.png"
            alt="Graduation cap above stacked finance books with market chart and portfolio pie graphic"
            className="mx-auto w-full max-w-[620px] mix-blend-multiply drop-shadow-[0_20px_40px_rgba(34,197,94,0.06)]"
          />
        </div>
      </div>
    </section>
  );
}

function TopicBundleCard({ bundle }: { bundle: ReturnType<typeof buildBundle> }) {
  return (
    <article className="grid gap-4 rounded-[22px] border border-[#dfe9e1] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.03)] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_120px]">
      <div className="flex min-w-0 gap-4">
        <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-[18px] ${bundle.tintBg} ${bundle.tintText}`}>
          <BundleIcon slug={bundle.slug} title={bundle.title} />
        </span>
        <div className="min-w-0">
          <div className="text-[22px] font-extrabold tracking-[-0.03em] text-[#15222f]">{bundle.index}. {bundle.title}</div>
          <p className="mt-2 text-[14px] leading-6 text-[#566674]">{bundle.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-[13px] font-semibold text-[#758290]">
            <span className="inline-flex items-center gap-2"><BookMiniIcon />{bundle.chapterCount} Chapters</span>
            <span className="inline-flex items-center gap-2"><BadgeMiniIcon />{bundle.level}</span>
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <ul className="space-y-2 text-[13px] leading-6 text-[#425364]">
          {bundle.previewLessons.map((lesson) => (
            <li key={lesson} className="flex items-start gap-2">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#16a34a]" />
              <span>{lesson}</span>
            </li>
          ))}
          <li className="flex items-start gap-2 text-[#7c8a96]">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#dbe7de]" />
            <span>...</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col items-end justify-between gap-3">
        <ProgressRing value={bundle.progress} size={72} />
        <Link
          href={bundle.href}
          className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#d9e5db] bg-white px-4 text-[13px] font-semibold text-[#44576a] transition hover:-translate-y-0.5"
        >
          View All Chapters
        </Link>
      </div>
    </article>
  );
}

function ProgressRing({ value, size = 78 }: { value: number; size?: number }) {
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(#16a34a 0deg ${value * 3.6}deg, #e6f1e8 ${value * 3.6}deg 360deg)`,
      }}
    >
      <div
        className="grid place-items-center rounded-full bg-white text-center leading-none"
        style={{ width: size - 10, height: size - 10 }}
      >
        <div className="text-[18px] font-extrabold leading-none text-[#14212c]">{value}%</div>
        <div className="mt-1 text-[8.5px] font-semibold uppercase tracking-[0.06em] text-[#7b8a96]">Complete</div>
      </div>
    </div>
  );
}

function StatRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-[12px] bg-[#effaf2] text-[#15924c]">
        <ValueIcon variant={icon} />
      </span>
      <div>
        <div className="text-[15px] font-bold text-[#18222e]">{label}</div>
        <div className="text-[12px] text-[#7b8a96]">{value}</div>
      </div>
    </div>
  );
}

function buildBundle(chapter: LearningChapter, index: number) {
  const progress = bundleProgress[index % bundleProgress.length];
  const previewLessons = chapter.lessons.length > 0
    ? chapter.lessons.slice(0, 3)
    : extractPreviewLessons(chapter.content);
  const chapterCount = Math.max(1, Math.round(chapter.topicCount / 2));

  return {
    index: index + 1,
    slug: chapter.slug,
    href: chapter.slug === "personal-finance-budgeting" ? "/learning/personal-finance" : `/learning/${chapter.slug}`,
    order: chapter.order,
    title: chapter.chapterTitle,
    description: chapter.description,
    chapterCount,
    level: difficultyFor(chapter.order),
    previewLessons,
    progress,
    image: chapter.thumbnail.startsWith("/") ? chapter.thumbnail : fallbackImages[index % fallbackImages.length],
    tone: chapter.tone,
    tintBg: tintBg(chapter.tone),
    tintText: tintText(chapter.tone),
  };
}

function extractPreviewLessons(content: string) {
  const headings = [...content.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1].trim());
  return headings.slice(0, 3);
}

function difficultyFor(order: number) {
  if (order <= 2) return "Beginner";
  if (order <= 5) return "Beginner to Intermediate";
  if (order <= 8) return "Intermediate";
  return "Intermediate to Advanced";
}

function tintBg(tone: string) {
  if (tone === "green" || tone === "emerald") return "bg-[#edfdf3]";
  if (tone === "teal") return "bg-[#ecfeff]";
  if (tone === "blue") return "bg-[#eef5ff]";
  return "bg-[#f4f7f4]";
}

function tintText(tone: string) {
  if (tone === "green" || tone === "emerald") return "text-[#1f9c5c]";
  if (tone === "teal") return "text-[#0f766e]";
  if (tone === "blue") return "text-[#2370ea]";
  return "text-[#64748b]";
}

function buildTopicCounts(chapters: LearningChapter[]) {
  return chapters.map((chapter) => ({
    label: chapter.chapterTitle,
    count: Math.max(chapter.lessons.length, Math.ceil(chapter.topicCount / 2), 1),
  }));
}

function matchesQuery(chapter: LearningChapter, query: string) {
  return [
    chapter.title,
    chapter.chapterTitle,
    chapter.description,
    chapter.tags.join(" "),
    chapter.lessons.join(" "),
  ].some((value) => value.toLowerCase().includes(query));
}

function BundleIcon({ slug, title }: { slug: string; title: string }) {
  if (slug.includes("personal-finance")) {
    return <GeneratedIcon name="personal-finance" className="h-10 w-10" />;
  }
  if (slug.includes("invest")) {
    return <GeneratedIcon name="investing" className="h-10 w-10" />;
  }
  if (slug.includes("stock-market")) {
    return <GeneratedIcon name="markets" className="h-10 w-10" />;
  }
  if (slug.includes("mutual-funds")) {
    return <GeneratedIcon name="mutual-funds" className="h-10 w-10" />;
  }
  if (slug.includes("fixed-income")) {
    return <GeneratedIcon name="fixed-income" className="h-10 w-10" />;
  }
  if (slug.includes("derivatives")) {
    return <GeneratedIcon name="derivatives" className="h-10 w-10" />;
  }
  if (slug.includes("analysis")) {
    return <GeneratedIcon name="analysis" className="h-10 w-10" />;
  }
  if (slug.includes("corporate-finance")) {
    return <GeneratedIcon name="economy" className="h-10 w-10" />;
  }
  if (slug.includes("financial-planning")) {
    return <GeneratedIcon name="planning" className="h-10 w-10" />;
  }
  if (title.includes("Finance")) {
    return <GeneratedIcon name="structured-learning" className="h-10 w-10" />;
  }
  return <GeneratedIcon name="all-topics" className="h-10 w-10" />;
}

function TopicIcon({ label }: { label: string }) {
  if (label.includes("Invest")) return <GeneratedIcon name="investing" className="h-5 w-5" />;
  if (label.includes("Stock")) return <GeneratedIcon name="markets" className="h-5 w-5" />;
  if (label.includes("Finance")) return <GeneratedIcon name="personal-finance" className="h-5 w-5" />;
  if (label.includes("Mutual")) return <GeneratedIcon name="mutual-funds" className="h-5 w-5" />;
  if (label.includes("Fixed")) return <GeneratedIcon name="fixed-income" className="h-5 w-5" />;
  if (label.includes("Derivative")) return <GeneratedIcon name="derivatives" className="h-5 w-5" />;
  if (label.includes("Analysis")) return <GeneratedIcon name="analysis" className="h-5 w-5" />;
  if (label.includes("Planning")) return <GeneratedIcon name="planning" className="h-5 w-5" />;
  return <GeneratedIcon name="all-topics" className="h-5 w-5" />;
}

function GeneratedIcon({ name, className }: { name: string; className: string }) {
  return (
    <img
      src={`/img/finance/generated-icons/${name}.png`}
      alt=""
      aria-hidden="true"
      className={`object-contain ${className}`}
      loading="eager"
    />
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-[#7d8a96]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="5.5" />
      <path d="m14 14 4 4" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5h14" />
      <path d="M6 10h8" />
      <path d="M8 15h4" />
    </svg>
  );
}

function GridIcon({ small = false }: { small?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className={small ? "h-4 w-4" : "h-4 w-4"} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="5" height="5" rx="1.2" />
      <rect x="12" y="3" width="5" height="5" rx="1.2" />
      <rect x="3" y="12" width="5" height="5" rx="1.2" />
      <rect x="12" y="12" width="5" height="5" rx="1.2" />
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

function ArrowMiniIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h12" />
      <path d="m10 4 6 6-6 6" />
    </svg>
  );
}

function BookMiniIcon() {
  return <GeneratedIcon name="structured-learning" className="h-4 w-4" />;
}

function BadgeMiniIcon() {
  return <GeneratedIcon name="track-progress" className="h-4 w-4" />;
}

function ValueIcon({ variant }: { variant: string }) {
  if (variant === "briefcase") return <GeneratedIcon name="practical-examples" className="h-5 w-5" />;
  if (variant === "people") return <GeneratedIcon name="expert-insights" className="h-5 w-5" />;
  if (variant === "check") return <GeneratedIcon name="track-progress" className="h-5 w-5" />;
  if (variant === "clock") return <GeneratedIcon name="planning" className="h-5 w-5" />;
  if (variant === "award") return <GeneratedIcon name="fixed-income" className="h-5 w-5" />;
  return <GeneratedIcon name="structured-learning" className="h-5 w-5" />;
}

function BookBundleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5V6.5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v13" />
      <path d="M8 4.5V19" />
      <path d="M8 8h8" />
      <path d="M8 12h6" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="3" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="3" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 4.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CheckSquareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 4 4L19 6" />
      <rect x="3" y="3" width="18" height="18" rx="4" />
    </svg>
  );
}

function ClockMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function AwardMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5" />
      <path d="m8.5 14.5-2 6 5.5-3 5.5 3-2-6" />
    </svg>
  );
}

function ChartMiniIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17h14" />
      <path d="M6 14V9" />
      <path d="M10 14V5" />
      <path d="M14 14v-7" />
    </svg>
  );
}

function MarketMiniIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14 7 10l3 3 7-8" />
      <path d="M14 5h3v3" />
    </svg>
  );
}

function WalletMiniIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5.5A2.5 2.5 0 0 1 3 13.5v-7Z" />
      <path d="M13 10h.01" />
    </svg>
  );
}

function PieMiniIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v8h8" />
      <path d="M18 11A8 8 0 1 1 9 2" />
    </svg>
  );
}

function TrendMiniIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14 7 10l3 3 7-8" />
      <path d="M14 5h3v3" />
      <path d="M3 17h14" />
    </svg>
  );
}

function SearchMiniIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="5.5" />
      <path d="m14 14 4 4" />
    </svg>
  );
}

function CalendarMiniIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="14" height="13" rx="2" />
      <path d="M6 2v4" />
      <path d="M14 2v4" />
      <path d="M3 8h14" />
    </svg>
  );
}

function CompassIcon() {
  return <GeneratedIcon name="find-path" className="h-12 w-12" />;
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m5 8 7 5 7-5" />
    </svg>
  );
}
