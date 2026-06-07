import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMdx } from "../../_lib/mdx";
import { getAllPosts, getPost } from "../../_lib/posts";
import { EquationChart } from "../../_components/EquationCharts";
import { GaltonBoard } from "../../_components/GaltonBoard";

const blogMdxComponents = {
  EquationChart,
  GaltonBoard,
};

const postImages: Record<string, string> = {
  "understanding-transformer-attention": "/img/finance/bull-market.png",
  "how-layernorm-stabilizes-transformers": "/img/finance/diversified-portfolio.png",
  "gentle-intro-to-diffusion-models": "/img/finance/trading-candles.png",
  "why-self-supervised-learning-works": "/img/finance/emergency-fund.png",
  "understanding-interest-rates": "/img/finance/interest-rates.png",
  "crypto-investing-for-beginners": "/img/finance/crypto-bitcoin.png",
  "the-equation-that-beat-wall-street": "/img/finance/trading-candles.png",
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

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const posts = await getAllPosts();
  const relatedPosts = posts.filter((item) => item.slug !== post.slug).slice(0, 3);
  const MDX = await compileMdx(post.content);

  return (
    <div className="mx-auto max-w-[1180px] pb-14 pt-8 md:pt-10">
      <Link href="/blog" className="inline-flex items-center gap-2 text-[14px] font-bold text-[#15924c]">
        <ArrowLeftIcon />
        Back to blog
      </Link>

      <section className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="min-w-0">
          <header className="overflow-hidden rounded-[34px] border border-[#dfe9e1] bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(242,250,244,0.96)_100%)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] md:p-8">
            <span className="inline-flex rounded-full bg-[#eaf8ee] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#16914a]">
              {post.category ?? "Market Insight"}
            </span>
            <h1 className="mt-5 max-w-[15ch] text-[42px] font-extrabold leading-[1.02] tracking-[-0.05em] text-[#0f1724] md:text-[60px]">
              {post.title}
            </h1>
            {post.description && (
              <p className="mt-5 max-w-[58ch] text-[18px] leading-8 text-[#5d6e79]">
                {post.description}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-[14px] text-[#6d7d89]">
              <AuthorBadge />
              <span>{post.formattedDate}</span>
              <span className="text-[#adc0b2]">•</span>
              <span>{post.readingTime} min read</span>
            </div>
            <div className="mt-8 overflow-hidden rounded-[28px]">
              <ArticleImage src={imageForSlug(post.slug, 0)} alt="" />
            </div>
          </header>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {(post.tags.length > 0 ? post.tags : [post.category ?? "Finance"]).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#d8e8dc] bg-white/92 px-3 py-1.5 text-[12px] font-semibold text-[#4d6272]"
              >
                {tag}
              </span>
            ))}
          </div>

          <article className="prose-post mt-8 rounded-[34px] border border-[#dfe9e1] bg-white/92 px-6 py-7 shadow-[0_20px_60px_rgba(15,23,42,0.04)] md:px-10 md:py-10">
            <MDX components={blogMdxComponents} />
          </article>
        </article>

        <aside className="space-y-5">
          <section className="rounded-[28px] border border-[#dfe9e1] bg-white/92 p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
            <h2 className="text-[26px] font-extrabold tracking-[-0.04em] text-[#111a27]">Article Summary</h2>
            <ul className="mt-5 space-y-3 text-[14px] leading-7 text-[#5d6e79]">
              <li className="rounded-2xl bg-[#f5faf6] px-4 py-3">Clear structure optimized for long-form MDX writing.</li>
              <li className="rounded-2xl bg-[#f5faf6] px-4 py-3">Consistent finance styling without breaking the Markdown workflow.</li>
              <li className="rounded-2xl bg-[#f5faf6] px-4 py-3">Direct links to related articles to keep readers exploring.</li>
            </ul>
          </section>

          <section className="rounded-[28px] border border-[#dfe9e1] bg-white/92 p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
            <h2 className="text-[26px] font-extrabold tracking-[-0.04em] text-[#111a27]">Related Posts</h2>
            <div className="mt-5 space-y-4">
              {relatedPosts.map((item, index) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="flex items-center gap-3 rounded-[22px] p-2 transition hover:bg-[#f6faf7]"
                >
                  <div className="h-[68px] w-[68px] shrink-0 overflow-hidden rounded-[18px]">
                    <ArticleImage src={imageForSlug(item.slug, index)} alt="" compact />
                  </div>
                  <div className="min-w-0">
                    <div className="line-clamp-2 text-[15px] font-bold leading-6 text-[#17212c]">{item.title}</div>
                    <div className="mt-1 text-[13px] text-[#82919d]">{item.formattedDate}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-[#dfe9e1] bg-[linear-gradient(180deg,#f3fbf5_0%,#eef9f1_100%)] p-5 shadow-[0_16px_44px_rgba(15,23,42,0.045)]">
            <h2 className="text-[26px] font-extrabold tracking-[-0.04em] text-[#111a27]">Stay Ahead in Finance</h2>
            <p className="mt-4 text-[15px] leading-7 text-[#62717d]">
              Keep the finance layout and your MDX publishing flow aligned with a simple email capture block.
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-5 h-12 w-full rounded-2xl border border-[#d7e7db] bg-white px-4 text-[14px] text-[#17212c] outline-none focus:border-[#75d49c] focus:ring-4 focus:ring-[#c7f1d6]"
            />
            <button className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_100%)] text-[15px] font-bold text-white shadow-[0_16px_30px_rgba(22,163,74,0.2)]">
              Subscribe
            </button>
          </section>
        </aside>
      </section>
    </div>
  );
}

function AuthorBadge() {
  return (
    <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#253444]">
      <span className="h-8 w-8 overflow-hidden rounded-full bg-[#eaf5ef]">
        <img src="/img/profile/avatar.png" alt="" className="h-full w-full object-cover" />
      </span>
      MD Shahidul Islam
    </span>
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

function ArticleImage({ src, alt, compact = false }: { src: string; alt: string; compact?: boolean }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`${compact ? "h-full" : "aspect-[1.8]"} w-full object-cover`}
      loading="lazy"
    />
  );
}

function imageForSlug(slug: string, index: number) {
  return postImages[slug] ?? fallbackImages[index % fallbackImages.length];
}
