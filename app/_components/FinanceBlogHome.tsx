"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import type { HomeArticle } from "../_lib/homeArticles";
import { BookmarkButton } from "./BookmarkButton";

type Topic = {
  label: string;
  count: number;
  icon: IconName;
};

type IconName =
  | "article"
  | "investing"
  | "trading"
  | "personal"
  | "economy"
  | "stock"
  | "crypto"
  | "more"
  | "mail"
  | "data"
  | "expert"
  | "advice"
  | "regular"
  | "retirement"
  | "tax";

type FinanceBlogHomeProps = {
  query?: string;
  articles?: HomeArticle[];
};

const categories: Array<{ label: string; icon: IconName }> = [
  { label: "All Articles", icon: "article" },
  { label: "Investing", icon: "investing" },
  { label: "Trading", icon: "trading" },
  { label: "Personal Finance", icon: "personal" },
  { label: "Economy", icon: "economy" },
  { label: "Stock Market", icon: "stock" },
  { label: "Crypto", icon: "crypto" },
  { label: "More", icon: "more" },
];

const AUTHOR_AVATAR = "/img/profile/profile_picture.png";

const readerAvatars = [
  "/img/profile/readers/reader-1.svg",
  "/img/profile/readers/reader-2.svg",
  "/img/profile/readers/reader-3.svg",
  "/img/profile/readers/reader-4.svg",
];

const topics: Topic[] = [
  { label: "Investing", count: 42, icon: "investing" },
  { label: "Trading", count: 38, icon: "trading" },
  { label: "Personal Finance", count: 35, icon: "personal" },
  { label: "Economy", count: 27, icon: "economy" },
  { label: "Stock Market", count: 31, icon: "stock" },
  { label: "Crypto", count: 24, icon: "crypto" },
  { label: "Retirement", count: 18, icon: "retirement" },
  { label: "Tax & Planning", count: 16, icon: "tax" },
];

const valueProps = [
  {
    title: "Data-Driven Insights",
    description: "In-depth analysis backed by real market data.",
    icon: "data" as const,
  },
  {
    title: "Expert Contributors",
    description: "Learn from experienced investors and market experts.",
    icon: "expert" as const,
  },
  {
    title: "Actionable Advice",
    description: "Practical tips you can apply to your investments.",
    icon: "advice" as const,
  },
  {
    title: "Updated Regularly",
    description: "New articles and market insights every week.",
    icon: "regular" as const,
  },
];

export function FinanceBlogHome({ query, articles = [] }: FinanceBlogHomeProps) {
  const [activeCategory, setActiveCategory] = useState("All Articles");
  const [search, setSearch] = useState(query ?? "");
  const [subscribed, setSubscribed] = useState(false);
  const featuredArticle = articles[0];
  const articleRows = articles.slice(1);

  const visibleArticles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return articleRows.filter((article) => {
      const categoryMatch = activeCategory === "All Articles" || activeCategory === "More" || article.category === activeCategory;
      const searchMatch =
        !normalizedSearch ||
        [article.title, article.description, article.category, article.author].some((value) =>
          value.toLowerCase().includes(normalizedSearch),
        );
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, articleRows, search]);

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribed(true);
  }

  return (
    <div className="mx-auto max-w-[1160px] pb-10 pt-0">
      <Hero search={search} setSearch={setSearch} />
      <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <main className="min-w-0">
          <section>
            <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-[#07101f]">Featured Article</h2>
            {featuredArticle ? <FeaturedArticle article={featuredArticle} /> : <EmptyArticleState />}
          </section>

          <section id="latest-articles" className="mt-7">
            <h2 className="text-[20px] font-extrabold tracking-[-0.02em] text-[#07101f]">Latest Articles</h2>
            <div className="mt-3 space-y-4">
              {visibleArticles.length > 0 ? (
                visibleArticles.map((article) => <ArticleRow key={article.title} article={article} />)
              ) : (
                <div className="rounded-[10px] border border-[#e0e8e4] bg-white px-5 py-8 text-center text-[14px] font-semibold text-[#64748b]">
                  No articles found for this filter.
                </div>
              )}
            </div>
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                className="inline-flex h-10 items-center gap-3 rounded-[7px] border border-[#dbe5df] bg-white px-8 text-[13px] font-semibold text-[#334155] shadow-sm transition hover:border-[#9fd7b4] hover:text-[#0f8b45]"
              >
                Load More Articles
                <Icon name="more" className="h-4 w-4" />
              </button>
            </div>
          </section>
        </main>

        <aside className="space-y-5">
          <PopularPosts articles={articles.slice(0, 5)} />
          <SubscribeCard onSubmit={handleSubscribe} subscribed={subscribed} />
          <ExploreTopics />
        </aside>
      </div>

      <ValueStrip />
      <Footer />
    </div>
  );
}

function Hero({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (value: string) => void;
}) {
  return (
    <section className="grid min-h-[340px] items-center gap-8 py-9 lg:grid-cols-[0.97fr_1.03fr] lg:py-11">
      <div>
        <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#0f9650]">Finance Blog</p>
        <h1 className="mt-4 max-w-[620px] text-[44px] font-extrabold leading-[1.08] tracking-[-0.055em] text-[#07101f] md:text-[50px]">
          Insights. Analysis.
          <br />
          <span className="whitespace-nowrap">
            <span className="text-[#159b50]">Smarter</span>{" "}
            Decisions.
          </span>
        </h1>
        <p className="mt-6 max-w-[510px] text-[16px] leading-7 text-[#263244]">
          Actionable insights on investing, trading, personal finance, and market trends to help you grow your wealth.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-5">
          <Link
            href="#latest-articles"
            className="inline-flex h-11 items-center justify-center rounded-[5px] bg-[#169b52] px-7 text-[14px] font-bold text-white shadow-[0_14px_24px_rgba(22,155,82,0.22)] transition hover:-translate-y-0.5 hover:bg-[#118746]"
          >
            Start Reading
          </Link>
          <Link
            href="/learning"
            className="inline-flex h-11 items-center justify-center rounded-[5px] border border-[#cfe3d8] bg-white px-6 text-[14px] font-bold text-[#0f8f49] shadow-sm transition hover:-translate-y-0.5 hover:border-[#9fd7b4] hover:bg-[#f4fbf7]"
          >
            Chapter-wise Learning
          </Link>
          <div className="flex items-center gap-3 text-[14px] font-bold text-[#07101f]">
            <span>Join 10+ readers</span>
            <div className="flex -space-x-2">
              {readerAvatars.map((avatar, index) => (
                <span key={avatar} className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-[#e9f5ee]">
                  <img src={avatar} alt={`Reader ${index + 1}`} className="h-full w-full object-cover" />
                </span>
              ))}
              <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-[#17a65a] text-[16px] font-bold leading-none text-white">
                +
              </span>
            </div>
          </div>
        </div>
        <label className="sr-only" htmlFor="home-search">
          Search articles
        </label>
        <input
          id="home-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="sr-only"
          aria-hidden
          tabIndex={-1}
        />
      </div>

      <div className="relative hidden min-h-[260px] lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_44%,rgba(33,181,103,0.22),transparent_36%)]" />
        <img
          src="/img/finance/home-hero-market-overview.png"
          alt="Market overview card with rising chart and green analytics graphics"
          className="absolute right-[-8px] top-[-18px] h-[330px] w-[560px] object-contain"
        />
      </div>
    </section>
  );
}

function CategoryTabs({
  activeCategory,
  setActiveCategory,
}: {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}) {
  return (
    <div className="flex min-h-[57px] flex-nowrap items-center gap-1 overflow-x-auto rounded-[9px] border border-[#e0e8e4] bg-white px-4 py-2 shadow-[0_8px_20px_rgba(15,23,42,0.035)]">
      {categories.map((category) => {
        const active = activeCategory === category.label;
        return (
          <button
            key={category.label}
            type="button"
            onClick={() => setActiveCategory(category.label)}
            className={`relative inline-flex h-10 shrink-0 items-center gap-2 rounded-[8px] px-2.5 text-[13px] font-semibold transition ${
              active ? "bg-[#edf9f2] text-[#0f8f49]" : "text-[#263244] hover:bg-[#f6faf8] hover:text-[#0f8f49]"
            }`}
          >
            <Icon name={category.icon} className="h-4 w-4" />
            {category.label}
            {category.label === "More" && <Icon name="more" className="h-3.5 w-3.5" />}
            {active && <span className="absolute bottom-[-8px] left-3 right-3 h-[2px] rounded-full bg-[#15a45a]" />}
          </button>
        );
      })}
    </div>
  );
}

function FeaturedArticle({ article }: { article: HomeArticle }) {
  return (
    <article className="mt-2 grid overflow-hidden rounded-[10px] border border-[#e1e8e4] bg-white p-3 shadow-[0_5px_18px_rgba(15,23,42,0.025)] md:grid-cols-[292px_minmax(0,1fr)]">
      <Link href={article.href} className="overflow-hidden rounded-[8px] bg-[#06140e]">
        <img src={article.image} alt="" className="h-[210px] w-full object-cover" />
      </Link>
      <div className="flex min-w-0 flex-col justify-center px-5 py-4">
        <span className="w-fit rounded-full bg-[#dff7e8] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#169b52]">
          Featured
        </span>
        <Link
          href={article.href}
          className="mt-4 max-w-[360px] text-[20px] font-extrabold leading-[1.25] tracking-[-0.025em] text-[#07101f] transition hover:text-[#13944b]"
        >
          {article.title}
        </Link>
        <p className="mt-3 max-w-[560px] text-[14px] leading-6 text-[#45556a]">
          {article.description}
        </p>
        <div className="mt-5 flex items-center gap-3 text-[12px] text-[#66788a]">
          <AuthorAvatar src={article.avatar} />
          <div>
            <div className="font-bold text-[#1c2938]">{article.author}</div>
            <div>{article.date} <span className="mx-2 text-[#a3b0bd]">•</span> {article.readTime}</div>
          </div>
          <BookmarkButton slug={article.slug} className="ml-auto" />
        </div>
      </div>
    </article>
  );
}

function EmptyArticleState() {
  return (
    <div className="mt-2 rounded-[10px] border border-[#e1e8e4] bg-white px-5 py-8 text-center text-[14px] font-semibold text-[#64748b]">
      No posts are available yet.
    </div>
  );
}

function ArticleRow({ article }: { article: HomeArticle }) {
  return (
    <article className="grid min-h-[130px] overflow-hidden rounded-[10px] border border-[#e2e9e5] bg-white p-0 shadow-[0_4px_14px_rgba(15,23,42,0.02)] md:grid-cols-[210px_minmax(0,1fr)]">
      <Link href={article.href} className="m-3 overflow-hidden rounded-[7px] bg-[#08140f]">
        <img src={article.image} alt="" className="h-full min-h-[105px] w-full object-cover" loading="lazy" />
      </Link>
      <div className="flex min-w-0 flex-col justify-center px-3 py-4 md:py-3">
        <Link href={article.href} className="max-w-[420px] text-[18px] font-extrabold leading-[1.24] tracking-[-0.02em] text-[#07101f] transition hover:text-[#15924c]">
          {article.title}
        </Link>
        <p className="mt-2 max-w-[520px] text-[14px] leading-6 text-[#45556a]">{article.description}</p>
        <div className="mt-4 flex items-center gap-3 text-[12px] text-[#66788a]">
          <AuthorAvatar src={article.avatar} />
          <span className="font-bold text-[#1c2938]">{article.author}</span>
          <span>{article.date}</span>
          <span className="text-[#a3b0bd]">•</span>
          <span>{article.readTime}</span>
          <BookmarkButton slug={article.slug} className="ml-auto" />
        </div>
      </div>
    </article>
  );
}

function PopularPosts({ articles }: { articles: HomeArticle[] }) {
  return (
    <section className="rounded-[10px] border border-[#e0e8e4] bg-white p-5 shadow-[0_5px_18px_rgba(15,23,42,0.025)]">
      <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-[#07101f]">Popular Posts</h2>
      <div className="mt-4 space-y-4">
        {articles.map((article) => (
          <Link key={article.slug} href={article.href} className="grid grid-cols-[20px_58px_minmax(0,1fr)] items-center gap-3 rounded-[8px] transition hover:bg-[#f7fbf8]">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#e4f7eb] text-[#159b50]">
              <Icon name="regular" className="h-3.5 w-3.5" />
            </span>
            <span className="h-[58px] w-[58px] overflow-hidden rounded-[6px] bg-[#08140f]">
              <img src={article.image} alt="" className="h-full w-full object-cover" loading="lazy" />
            </span>
            <span className="min-w-0">
              <span className="line-clamp-2 block text-[13px] font-bold leading-5 text-[#07101f]">{article.title}</span>
              <span className="mt-1 block text-[12px] text-[#738195]">{article.date}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function SubscribeCard({
  onSubmit,
  subscribed,
}: {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  subscribed: boolean;
}) {
  return (
    <section className="rounded-[10px] border border-[#d5e9dd] bg-[linear-gradient(135deg,#eefaf3_0%,#f8fffb_100%)] p-5 shadow-[0_5px_18px_rgba(15,23,42,0.025)]">
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-[#ddf5e6] text-[#159b50]">
          <Icon name="mail" className="h-4.5 w-4.5" />
        </span>
        <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-[#07101f]">Stay Ahead in Finance</h2>
      </div>
      <p className="mt-3 text-[14px] leading-6 text-[#405064]">
        Subscribe to get the latest insights, market updates, and expert analysis straight to your inbox.
      </p>
      <form onSubmit={onSubmit} className="mt-4">
        <input
          required
          type="email"
          placeholder="Enter your email"
          className="h-10 w-full rounded-[5px] border border-[#dce7e1] bg-white px-3 text-[13px] text-[#17212c] outline-none transition focus:border-[#75d49c] focus:ring-4 focus:ring-[#c7f1d6]"
        />
        <button className="mt-3 h-10 w-full rounded-[5px] bg-[#169b52] text-[13px] font-bold text-white shadow-[0_12px_22px_rgba(22,163,74,0.16)] transition hover:bg-[#118746]">
          {subscribed ? "Subscribed" : "Subscribe"}
        </button>
      </form>
      <p className="mt-3 text-center text-[11px] text-[#7e8d99]">No spam. Unsubscribe anytime.</p>
    </section>
  );
}

function ExploreTopics() {
  return (
    <section className="rounded-[10px] border border-[#e0e8e4] bg-white p-5 shadow-[0_5px_18px_rgba(15,23,42,0.025)]">
      <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-[#07101f]">Explore Topics</h2>
      <div className="mt-4 space-y-2.5">
        {topics.map((topic) => (
          <button key={topic.label} className="flex w-full items-center gap-3 rounded-[7px] py-0.5 text-left transition hover:bg-[#f7fbf8]">
            <Icon name={topic.icon} className="h-4 w-4 text-[#159b50]" />
            <span className="flex-1 text-[13px] font-semibold text-[#334155]">{topic.label}</span>
            <span className="rounded-full bg-[#f1f5f4] px-2 py-0.5 text-[11px] font-bold text-[#738195]">{topic.count}</span>
          </button>
        ))}
      </div>
      <Link href="/learning" className="mt-5 inline-flex items-center gap-2 text-[13px] font-bold text-[#0f8f49]">
        View all topics
        <Icon name="regular" className="h-3.5 w-3.5" />
      </Link>
    </section>
  );
}

function ValueStrip() {
  return (
    <section className="mt-10 grid gap-4 rounded-[8px] border border-[#e0e8e4] bg-[linear-gradient(135deg,#f8fffb_0%,#f0faf4_100%)] p-6 md:grid-cols-2 lg:grid-cols-4">
      {valueProps.map((item) => (
        <div key={item.title} className="flex items-start gap-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-[#ddf5e6] text-[#159b50]">
            <Icon name={item.icon} className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-[13px] font-extrabold text-[#07101f]">{item.title}</h3>
            <p className="mt-1 text-[12px] leading-5 text-[#405064]">{item.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-8 flex flex-col gap-4 pb-2 text-[12px] text-[#556274] md:flex-row md:items-center md:justify-between">
      <p>© 2024 Stock&amp;Trade. All rights reserved.</p>
      <nav className="flex flex-wrap items-center gap-8">
        {["About Us", "Contact", "Privacy Policy", "Terms of Service"].map((item) => (
          <Link key={item} href="#" className="transition hover:text-[#159b50]">
            {item}
          </Link>
        ))}
      </nav>
    </footer>
  );
}

function AuthorAvatar({ src }: { src: string }) {
  return (
    <span className="h-8 w-8 overflow-hidden rounded-full bg-[#eaf5ef]">
      <img src={src} alt="" className="h-full w-full object-cover" />
    </span>
  );
}

function Icon({ name, className = "h-4 w-4" }: { name: IconName; className?: string }) {
  if (name === "article") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="5" width="14" height="14" rx="2" />
        <path d="M9 9h6" />
        <path d="M9 13h4" />
      </svg>
    );
  }
  if (name === "investing") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="m7 15 4-4 3 3 5-7" />
        <path d="M16 7h3v3" />
      </svg>
    );
  }
  if (name === "trading") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 7v10" />
        <path d="M17 7v10" />
        <path d="M4 12h6" />
        <path d="M14 12h6" />
        <path d="m9 9 3-3 3 3" />
        <path d="m9 15 3 3 3-3" />
      </svg>
    );
  }
  if (name === "personal") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 7h12v13H6z" />
        <path d="M9 7V5h6v2" />
        <path d="M9 12h6" />
        <path d="M9 16h4" />
      </svg>
    );
  }
  if (name === "economy") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h16" />
        <path d="M6 10v7" />
        <path d="M11 10v7" />
        <path d="M16 10v7" />
        <path d="M3 10h18L12 4 3 10Z" />
      </svg>
    );
  }
  if (name === "stock") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="12" width="3" height="7" rx="1" />
        <rect x="10.5" y="8" width="3" height="11" rx="1" />
        <rect x="17" y="5" width="3" height="14" rx="1" />
        <path d="m4 9 5-4 4 2 6-5" />
      </svg>
    );
  }
  if (name === "crypto") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <path d="M10 8h3.2a2 2 0 0 1 0 4H10h3.8a2 2 0 1 1 0 4H10" />
        <path d="M10 6v12" />
      </svg>
    );
  }
  if (name === "mail") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <path d="m6 9 6 4 6-4" />
      </svg>
    );
  }
  if (name === "data") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18" />
        <path d="M3 12h18" />
        <circle cx="12" cy="12" r="3" />
        <path d="M6 6h.01M18 6h.01M6 18h.01M18 18h.01" />
      </svg>
    );
  }
  if (name === "expert") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M6 21v-2a6 6 0 0 1 12 0v2" />
      </svg>
    );
  }
  if (name === "advice") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="4" width="14" height="16" rx="2" />
        <path d="m9 12 2 2 4-5" />
      </svg>
    );
  }
  if (name === "regular") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    );
  }
  if (name === "retirement") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 20h10" />
        <path d="M9 20v-5h6v5" />
        <path d="M6 15h12l-2-8H8l-2 8Z" />
        <path d="M10 7V4h4v3" />
      </svg>
    );
  }
  if (name === "tax") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="4" width="12" height="16" rx="2" />
        <path d="M9 9h6" />
        <path d="M9 13h6" />
        <path d="M9 17h2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7 9 5 5 5-5" />
    </svg>
  );
}
