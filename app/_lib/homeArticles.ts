import type { Post } from "./posts";

export type HomeArticle = {
  slug: string;
  title: string;
  description: string;
  href: string;
  image: string;
  author: string;
  avatar: string;
  date: string;
  readTime: string;
  category: string;
};

type RankedArticle = HomeArticle & {
  detailScore: number;
  isDemo: boolean;
};

const AUTHOR_NAME = "Md Shahidul Islam";
const AUTHOR_AVATAR = "/img/profile/profile_picture.png";
const FEATURED_POST_SLUG = "bond-investing-for-beginners";

const postImages: Record<string, string> = {
  "60-essential-candlestick-patterns-trading-guide-for-beginners": "/img/finance/trading-candles.png",
  "bond-investing-for-beginners": "/img/finance/interest-rates.png",
  "the-equation-that-beat-wall-street": "/img/finance/trading-candles.png",
  "demo-60-essential-candlestick-patterns": "/img/finance/diversified-portfolio.png",
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

export function buildHomeArticles(posts: Post[]): HomeArticle[] {
  return posts
    .filter((post) => !post.hideFromListings)
    .map((post, index): RankedArticle => {
      const wordCount = post.content.split(/\s+/).filter(Boolean).length;
      const category = normalizeCategory(post.category);
      const isDemo = isDemoPost(post);

      return {
        slug: post.slug,
        title: post.title,
        description: post.description ?? "Read the full market guide and practical examples.",
        href: `/blog/${post.slug}`,
        image: post.cover ?? postImages[post.slug] ?? fallbackImages[index % fallbackImages.length],
        author: AUTHOR_NAME,
        avatar: AUTHOR_AVATAR,
        date: post.formattedDate,
        readTime: `${post.readingTime} min read`,
        category,
        detailScore: wordCount + post.readingTime * 220,
        isDemo,
      };
    })
    .sort((a, b) => {
      if (a.slug === FEATURED_POST_SLUG && b.slug !== FEATURED_POST_SLUG) return -1;
      if (b.slug === FEATURED_POST_SLUG && a.slug !== FEATURED_POST_SLUG) return 1;
      if (a.isDemo !== b.isDemo) return a.isDemo ? 1 : -1;
      if (b.detailScore !== a.detailScore) return b.detailScore - a.detailScore;
      return a.title.localeCompare(b.title);
    })
    .map(({ detailScore: _detailScore, isDemo: _isDemo, ...article }) => article);
}

function normalizeCategory(category?: string) {
  if (category === "Markets") return "Stock Market";
  if (category === "Fixed Income") return "Investing";
  return category ?? "Investing";
}

function isDemoPost(post: Post) {
  const haystack = [
    post.slug,
    post.title,
    post.description ?? "",
    post.category ?? "",
    post.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes("demo");
}
