import Link from "next/link";
import { getAllPosts, type Post } from "../_lib/posts";

const readerOffsets = ["50% 34%", "58% 32%", "44% 36%", "52% 30%"];
const financeTopics = [
  "All Articles",
  "Investing",
  "Trading",
  "Personal Finance",
  "Economy",
  "Stock Market",
  "Crypto",
  "More",
];

const valueProps = [
  {
    title: "Data-Driven Insights",
    description: "In-depth analysis backed by real market data.",
    icon: "grid",
  },
  {
    title: "Expert Contributors",
    description: "Learn from experienced investors and market operators.",
    icon: "people",
  },
  {
    title: "Actionable Advice",
    description: "Practical takes you can apply to your next decision.",
    icon: "check",
  },
  {
    title: "Updated Regularly",
    description: "Fresh articles and market perspectives every week.",
    icon: "clock",
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
];

type FinanceBlogHomeProps = {
  query?: string;
};

export async function FinanceBlogHome({ query }: FinanceBlogHomeProps) {
  const posts = await getAllPosts();
  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const filteredPosts = normalizedQuery
    ? posts.filter((post) => matchesQuery(post, normalizedQuery))
    : posts;

  const primaryPosts = filteredPosts.length > 0 ? filteredPosts : posts;
  const [featuredPost, ...latestPosts] = primaryPosts;
  const popularPosts = primaryPosts.slice(1, 5);
  const topicCounts = buildTopicCounts(posts);

  return (
    <div className="mx-auto max-w-[1120px] pb-10 pt-8">
      <Hero />
      <TopicToolbar />

      <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <section className="min-w-0">
          {normalizedQuery && (
            <div className="mb-5 rounded-[28px] border border-[#dbe7de] bg-white/80 px-5 py-4 text-[14px] text-[#52606d] shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
              Showing results for <span className="font-bold text-[#14212c]">&quot;{query}&quot;</span>
              {filteredPosts.length === 0 && <span className="ml-2 text-[#7a8a96]">No matches found. Showing all posts instead.</span>}
            </div>
          )}

          {featuredPost && (
            <>
              <SectionLabel label="Featured Article" />
              <FeaturedArticleCard post={featuredPost} />
            </>
          )}

          <div className="mt-8">
            <SectionLabel label="Latest Articles" />
            <div className="mt-4 space-y-4">
              {(latestPosts.length > 0 ? latestPosts : primaryPosts).map((post, index) => (
                <LatestArticleCard key={post.slug} post={post} index={index + 1} />
              ))}
            </div>
            <div className="mt-5 flex justify-center">
              <button className="inline-flex h-12 items-center gap-2 rounded-2xl border border-[#d9e5db] bg-white px-6 text-[14px] font-semibold text-[#405263] shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5">
                Load More Articles
                <ChevronDownIcon />
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <PopularPostsCard posts={popularPosts.length > 0 ? popularPosts : primaryPosts.slice(0, 4)} />
          <SubscribeCard />
          <TopicCountCard topics={topicCounts} />
        </aside>
      </div>

      <ValueStrip />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-0 pb-5 pt-1">
      <div className="absolute right-0 top-8 h-[260px] w-[520px] bg-[radial-gradient(circle,rgba(34,197,94,0.14),transparent_64%)]" />

      <div className="relative grid min-h-[235px] items-center gap-10 lg:grid-cols-[0.98fr_1.02fr]">
        <div>
          <span className="inline-flex text-[12px] font-extrabold uppercase text-[#179852]">
            Finance Blog
          </span>
          <h1 className="mt-3 max-w-[560px] text-[35px] font-extrabold leading-[1.03] text-[#0e1724] md:text-[41px]">
            Insights. Analysis. <span className="text-[#18a052]">Smarter</span> Decisions.
          </h1>
          <p className="mt-4 max-w-[470px] text-[15px] leading-6 text-[#26364a]">
            Actionable insights on investing, trading, and the forces shaping markets so readers can move with more clarity.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Link
              href="/blog"
              className="inline-flex h-[43px] items-center rounded-md bg-[#169b52] px-6 text-[14px] font-bold text-white shadow-[0_12px_24px_rgba(22,163,74,0.2)] transition hover:-translate-y-0.5"
            >
              Start Reading
            </Link>
            <span className="text-[15px] font-semibold text-[#223043]">Join 25,000+ readers</span>
            <div className="flex items-center">
              {readerOffsets.map((objectPosition, index) => (
                <span
                  key={objectPosition}
                  className="-ml-2 block h-7 w-7 overflow-hidden rounded-full border-[2px] border-white bg-[#eaf5ef] shadow-sm first:ml-0"
                  style={{ zIndex: readerOffsets.length - index }}
                >
                  <img
                    src="/img/finance/avatar-investor.png"
                    alt=""
                    className="h-full w-full scale-125 object-cover"
                    style={{ objectPosition }}
                  />
                </span>
              ))}
              <span className="-ml-2 grid h-7 w-7 place-items-center rounded-full border-[2px] border-white bg-[#18a052] text-[15px] text-white shadow-sm">
                +
              </span>
            </div>
          </div>
        </div>

        <div className="relative min-h-[220px]">
          <div className="absolute left-6 top-6 w-[56%] rounded-lg border border-[#e0e6e4] bg-white p-5 shadow-[0_18px_42px_rgba(15,23,42,0.12)] backdrop-blur">
            <div className="text-[12px] font-bold text-[#162432]">Market Overview</div>
            <div className="mt-4 flex items-end gap-5">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase text-[#7e8d99]">
                  <span className="h-2 w-2 rounded-full bg-[#16a34a]" />
                  S&amp;P 500
                </div>
                <div className="mt-2 text-[20px] font-extrabold text-[#10212b]">$5,278.40</div>
                <div className="mt-1 text-[12px] font-bold text-[#16a34a]">+1.23%</div>
              </div>
              <ChartLine />
            </div>
          </div>

          <div className="absolute right-3 top-2 flex h-full items-end gap-3">
            {[86, 122, 152, 184].map((height, index) => (
              <div
                key={height}
                className="relative w-8 rounded-t-md bg-[linear-gradient(180deg,rgba(34,197,94,0.8)_0%,rgba(22,163,74,0.7)_100%)] shadow-[0_18px_32px_rgba(34,197,94,0.14)]"
                style={{ height }}
              >
                {index === 2 && (
                  <div className="absolute inset-x-0 bottom-[36%] h-8 rounded-t-[14px] bg-white/22" />
                )}
              </div>
            ))}
          </div>

          <div className="absolute bottom-1 right-[88px] grid h-[104px] w-[104px] place-items-center rounded-full bg-[conic-gradient(from_220deg,#18a052_0deg,#27d36e_255deg,#dff8e8_255deg,#dff8e8_360deg)] shadow-[0_18px_42px_rgba(22,163,74,0.18)]">
            <div className="h-[36px] w-[36px] rounded-full bg-white/90 shadow-inner" />
          </div>
        </div>
      </div>
    </section>
  );
}

function TopicToolbar() {
  return (
    <div className="mt-0 flex flex-wrap items-center gap-3 rounded-lg border border-[#dfe9e1] bg-white px-5 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
      {financeTopics.map((topic, index) => (
        <button
          key={topic}
          className={`inline-flex h-8 items-center gap-2 rounded-md px-3 text-[13px] font-semibold transition ${
            index === 0 ? "bg-[#effaf2] text-[#15924c] shadow-[inset_0_0_0_1px_#cef0d8]" : "text-[#233247] hover:bg-[#f4f8f4]"
          }`}
        >
          {index === 0 && <TopicGridIcon />}
          {topic}
          {topic === "More" && <ChevronDownIcon />}
        </button>
      ))}
    </div>
  );
}

function FeaturedArticleCard({ post }: { post: Post }) {
  return (
    <article className="mt-3 grid gap-5 rounded-lg border border-[#dfe9e1] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.035)] md:grid-cols-[285px_minmax(0,1fr)]">
      <div className="overflow-hidden rounded-md">
        <ArticleImage src={imageForPost(post, 0)} alt="" />
      </div>
      <div className="flex min-w-0 flex-col justify-center">
        <span className="inline-flex w-fit rounded-full bg-[#eaf8ee] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#16914a]">
          Featured
        </span>
        <Link
          href={`/blog/${post.slug}`}
          className="mt-3 max-w-[32ch] text-[20px] font-extrabold leading-[1.2] text-[#101924] transition hover:text-[#15924c]"
        >
          {post.title}
        </Link>
        <p className="mt-3 max-w-[54ch] text-[14px] leading-6 text-[#334155]">
          {post.description ?? "Long-form analysis and clear takeaways from the latest market developments."}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-[14px] text-[#70808d]">
          <AuthorBadge name="Rahul Mehta" />
          <span>{post.formattedDate}</span>
          <span className="text-[#adc0b2]">•</span>
          <span>{post.readingTime} min read</span>
          <button aria-label="Save article" className="ml-auto text-[#6c7d8a] transition hover:text-[#15924c]">
            <BookmarkIcon />
          </button>
        </div>
      </div>
    </article>
  );
}

function LatestArticleCard({ post, index }: { post: Post; index: number }) {
  return (
    <article className="grid gap-4 rounded-lg border border-[#dfe9e1] bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:grid-cols-[190px_minmax(0,1fr)]">
      <div className="overflow-hidden rounded-md">
        <ArticleImage src={imageForPost(post, index)} alt="" />
      </div>
      <div className="flex min-w-0 flex-col justify-center">
        <Link
          href={`/blog/${post.slug}`}
          className="max-w-[32ch] text-[18px] font-extrabold leading-[1.25] text-[#101924] transition hover:text-[#15924c]"
        >
          {post.title}
        </Link>
        <p className="mt-2 max-w-[58ch] text-[13px] leading-6 text-[#334155]">
          {post.description ?? "Perspective, context, and the practical implications readers should pay attention to."}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px] text-[#70808d]">
          <AuthorBadge name={authorNameForIndex(index)} compact />
          <span>{post.formattedDate}</span>
          <span className="text-[#adc0b2]">•</span>
          <span>{post.readingTime} min read</span>
          <button aria-label="Save article" className="ml-auto text-[#6c7d8a] transition hover:text-[#15924c]">
            <BookmarkIcon />
          </button>
        </div>
      </div>
    </article>
  );
}

function PopularPostsCard({ posts }: { posts: Post[] }) {
  return (
    <section className="rounded-lg border border-[#dfe9e1] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
      <h2 className="text-[18px] font-extrabold text-[#111a27]">Popular Posts</h2>
      <div className="mt-4 space-y-3">
        {posts.map((post, index) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="flex items-center gap-3 rounded-md p-1.5 transition hover:bg-[#f6faf7]">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#eaf8ee] text-[#16914a]">
              <ArrowMiniIcon />
            </span>
            <div className="h-[56px] w-[56px] shrink-0 overflow-hidden rounded-md">
              <ArticleImage src={imageForPost(post, index)} alt="" compact />
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
    <section className="rounded-lg border border-[#cfe4d7] bg-[#eef8f2] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-white text-[#15924c] shadow-sm">
          <MailIcon />
        </span>
        <h2 className="text-[18px] font-extrabold text-[#111a27]">Stay Ahead in Finance</h2>
      </div>
      <p className="mt-3 text-[13px] leading-6 text-[#405263]">
        Subscribe to get the latest insights, market updates, and expert analysis straight to your inbox.
      </p>
      <input
        type="email"
        placeholder="Enter your email"
        className="mt-4 h-9 w-full rounded-md border border-[#d7e7db] bg-white px-3 text-[12px] text-[#17212c] outline-none focus:border-[#75d49c] focus:ring-4 focus:ring-[#c7f1d6]"
      />
      <button className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-md bg-[#169b52] text-[13px] font-bold text-white shadow-[0_12px_22px_rgba(22,163,74,0.18)]">
        Subscribe
      </button>
      <p className="mt-3 text-center text-[12px] text-[#7e8d99]">No spam. Unsubscribe anytime.</p>
    </section>
  );
}

function TopicCountCard({ topics }: { topics: Array<{ label: string; count: number }> }) {
  return (
    <section className="rounded-lg border border-[#dfe9e1] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
      <h2 className="text-[18px] font-extrabold text-[#111a27]">Explore Topics</h2>
      <div className="mt-4 space-y-2">
        {topics.map((topic) => (
          <div key={topic.label} className="flex items-center gap-3 rounded-md px-1 py-1">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-[#edf8f1] text-[#16914a]">
              <TopicGridIcon small />
            </span>
            <span className="flex-1 text-[13px] font-medium text-[#304252]">{topic.label}</span>
            <span className="rounded-full bg-[#f3f7f4] px-2.5 py-1 text-[12px] font-bold text-[#728391]">{topic.count}</span>
          </div>
        ))}
      </div>
      <Link href="/blog" className="mt-5 inline-flex items-center gap-2 text-[14px] font-bold text-[#15924c]">
        View all topics
        <ArrowMiniIcon />
      </Link>
    </section>
  );
}

function ValueStrip() {
  return (
    <section className="mt-10 grid gap-4 rounded-lg border border-[#dfe9e1] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:grid-cols-2 lg:grid-cols-4">
      {valueProps.map((item) => (
        <div key={item.title} className="flex items-start gap-4 px-2 py-2">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#ebf8ef] text-[#16914a]">
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

function SectionLabel({ label }: { label: string }) {
  return <h2 className="text-[18px] font-extrabold text-[#101924]">{label}</h2>;
}

function AuthorBadge({ name, compact = false }: { name: string; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#253444]">
      <span className={`${compact ? "h-7 w-7" : "h-8 w-8"} overflow-hidden rounded-full bg-[#eaf5ef]`}>
        <img src="/img/finance/avatar-investor.png" alt="" className="h-full w-full object-cover" />
      </span>
      {name}
    </span>
  );
}

function ArticleImage({ src, alt, compact = false }: { src: string; alt: string; compact?: boolean }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`${compact ? "h-full" : "aspect-[1.62]"} w-full object-cover`}
      loading="lazy"
    />
  );
}

function ChartLine() {
  return (
    <svg viewBox="0 0 180 100" className="h-[70px] w-[128px]">
      <path d="M6 86c16-1 18-18 32-18s18 10 30 8 18-26 34-25 19 20 33 17 21-29 37-47" fill="none" stroke="#cdf0d8" strokeWidth="18" strokeLinecap="round" opacity="0.34" />
      <path d="M8 84c15 0 20-16 31-16s18 8 29 6 17-24 33-23 19 18 31 16 20-27 40-45" fill="none" stroke="#1ea95a" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeatureIcon({ variant }: { variant: string }) {
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
  if (variant === "clock") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21V9" />
      <path d="M9 21V3" />
      <path d="M15 21v-8" />
      <path d="M21 21v-4" />
    </svg>
  );
}

function TopicGridIcon({ small = false }: { small?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className={small ? "h-4 w-4" : "h-4 w-4"} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="5" height="5" rx="1.2" />
      <rect x="12" y="3" width="5" height="5" rx="1.2" />
      <rect x="3" y="12" width="5" height="5" rx="1.2" />
      <rect x="12" y="12" width="5" height="5" rx="1.2" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h12v16l-6-4-6 4V4Z" />
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

function matchesQuery(post: Post, query: string) {
  return [
    post.title,
    post.description,
    post.category,
    post.tags.join(" "),
  ]
    .filter(Boolean)
    .some((value) => value!.toLowerCase().includes(query));
}

function imageForPost(post: Post, index: number) {
  return postImages[post.slug] ?? fallbackImages[index % fallbackImages.length];
}

function buildTopicCounts(posts: Post[]) {
  const counts = new Map<string, number>();

  for (const post of posts) {
    const labels = post.tags.length > 0 ? post.tags.slice(0, 2) : post.category ? [post.category] : [];
    for (const label of labels) {
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 6)
    .map(([label, count]) => ({ label, count }));
}

function authorNameForIndex(index: number) {
  const names = ["Priya Sharma", "Arjun Patel", "Neha Verma", "Vikram Iyer", "Ananya Rao"];
  return names[index % names.length];
}
