import Link from "next/link";
import { ArrowRightIcon } from "./icons";
import { GhostButton, PageHeading, PageShell, RailCard, Surface, Tag } from "./pagePrimitives";

const sections = [
  {
    title: "1. Fibonacci Pattern",
    idea: "dp[i] = dp[i-1] + dp[i-2]",
    code: `// Bottom-up approach
int fib(int n) {
    vector<int> dp(n + 1);
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`,
    example: "Example: n = 5",
    answer: "Answer: 0, 1, 1, 2, 3, 5",
  },
  {
    title: "2. 0/1 Knapsack Pattern",
    idea: "dp[i][w] = max(dp[i-1][w], value[i] + dp[i-1][w-weight[i]])",
    code: `int knapsack(int n, int W, vector<int>& wt, vector<int>& val) {
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= n; ++i) {
        for (int w = 0; w <= W; ++w) {
            dp[i][w] = dp[i - 1][w];
            if (wt[i - 1] <= w) {
                dp[i][w] = max(dp[i][w], val[i - 1] + dp[i - 1][w - wt[i - 1]]);
            }
        }
    }
    return dp[n][W];
}`,
    example: "Example: n = 3, W = 4",
    answer: "Answer: 5",
  },
];

const onThisPage = [
  "Introduction",
  "Fibonacci Pattern",
  "0/1 Knapsack Pattern",
  "Longest Increasing Subsequence",
  "Longest Common Subsequence",
  "Matrix Chain Multiplication",
  "Coin Change",
  "Edit Distance",
  "Partition Equal Subset Sum",
  "DP on Grids",
  "Bitmask DP",
  "Conclusion",
];

const relatedPosts = [
  { title: "DP vs Greedy: How to Choose?", date: "May 5, 2024", color: "bg-[#ede9ff]" },
  { title: "DP Optimizations You Should Know", date: "Apr 28, 2024", color: "bg-[#fff0f2]" },
  { title: "Memoization vs Tabulation in DP", date: "Apr 20, 2024", color: "bg-[#edfdf3]" },
];

const tags = ["dp", "algorithms", "patterns", "competitive programming", "dynamic programming", "tutorial"];

export function BlogArticleScreen() {
  return (
    <PageShell>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0">
          <div className="mb-6 flex items-center gap-3 text-[13px] font-semibold text-[#7a879b]">
            <Link href="/" className="hover:text-[#5b35f4]">
              Blog
            </Link>
            <span>&gt;</span>
            <span className="text-[#5b35f4]">Dynamic Programming</span>
          </div>

          <div className="grid gap-8 border-b border-[var(--color-border)] pb-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <PageHeading
                badge={<Tag>Tutorial</Tag>}
                title="Top 10 Dynamic Programming Patterns You Should Know"
                description="A complete guide to the most common DP patterns with explanations and problems."
              />
              <div className="mt-7 flex flex-wrap items-center gap-4 text-[14px] text-[#516078]">
                <div className="flex items-center gap-3">
                  <Avatar />
                  <div>
                    <div className="font-bold text-[#12182b]">code.explorer</div>
                    <div className="text-[13px]">May 12, 2024</div>
                  </div>
                </div>
                <span className="text-[#9ba6ba]">•</span>
                <span>8 min read</span>
                <span className="text-[#9ba6ba]">•</span>
                <span className="font-semibold text-[#f59e0b]">124 stars</span>
              </div>
            </div>
            <Surface className="hidden min-h-[280px] items-center justify-center overflow-hidden p-8 lg:flex">
              <ArticleArtwork />
            </Surface>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-b border-[var(--color-border)] py-6">
            <Tag>Dynamic Programming</Tag>
            <Tag tone="blue">Algorithms</Tag>
            <Tag tone="slate">Patterns</Tag>
            <div className="ml-auto flex flex-wrap gap-3">
              <GhostButton className="h-[42px] px-4">Bookmark</GhostButton>
              <GhostButton className="h-[42px] px-4">Share</GhostButton>
              <GhostButton className="h-[42px] w-[42px] px-0">...</GhostButton>
            </div>
          </div>

          <section className="grid gap-10 pt-10 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0">
              <article className="space-y-8">
                <div>
                  <h2 className="text-[34px] font-extrabold tracking-[-0.03em] text-[#12182b]">Introduction</h2>
                  <p className="mt-5 text-[15px] leading-8 text-[#4d5c76]">
                    Dynamic Programming (DP) is an algorithmic technique used to solve problems by
                    breaking them down into overlapping subproblems and storing their solutions to
                    avoid redundant computations.
                  </p>
                  <p className="mt-5 text-[15px] leading-8 text-[#4d5c76]">
                    In this post, we&apos;ll explore 10 essential DP patterns that every competitive
                    programmer should know.
                  </p>
                </div>

                {sections.map((section) => (
                  <div key={section.title} className="border-t border-[var(--color-border)] pt-8">
                    <h3 className="text-[32px] font-extrabold tracking-[-0.03em] text-[#12182b]">
                      {section.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-8 text-[#4d5c76]">
                      {section.title.includes("Fibonacci")
                        ? "The simplest DP pattern. Each state depends on the previous one or two states."
                        : "Used when you have choices (take or not take) and want to maximize value within a constraint."}
                    </p>
                    <Surface className="mt-5 overflow-hidden">
                      <div className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[#fbfaff] px-5 py-4 text-[14px] font-semibold text-[#5b35f4]">
                        <IdeaIcon />
                        <span>Key Idea:</span>
                        <code className="font-mono text-[13px] text-[#41506c]">{section.idea}</code>
                      </div>
                      <div className="border-b border-[var(--color-border)] px-5 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-[#75839a]">
                        C++
                      </div>
                      <div className="relative px-5 py-4">
                        <button className="absolute right-5 top-4 text-[13px] font-semibold text-[#5b35f4]">
                          Copy
                        </button>
                        <pre className="overflow-x-auto pr-16 pt-7 text-[13px] leading-7 text-[#30405a]">
                          <code>{section.code}</code>
                        </pre>
                      </div>
                    </Surface>
                    <div className="mt-5 rounded-[20px] border border-[#dbf1e4] bg-[#f4fbf7] px-5 py-4 text-[14px] leading-7 text-[#426153]">
                      <div className="font-bold text-[#15803d]">{section.example}</div>
                      <div className="mt-2">{section.answer}</div>
                    </div>
                  </div>
                ))}
              </article>

              <div className="mt-8 flex flex-wrap justify-between gap-4 border-t border-[var(--color-border)] pt-8">
                <GhostButton>Previous Post</GhostButton>
                <GhostButton>
                  Next Pattern: LIS <ArrowRightIcon width={14} height={14} />
                </GhostButton>
              </div>
            </div>

            <aside className="space-y-5 xl:hidden">
              <BlogRail />
            </aside>
          </section>
        </main>

        <aside className="hidden space-y-5 xl:block">
          <BlogRail />
        </aside>
      </div>
    </PageShell>
  );
}

function BlogRail() {
  return (
    <>
      <RailCard title="On This Page">
        <ol className="space-y-4 text-[14px] text-[#495871]">
          {onThisPage.map((item, index) => (
            <li
              key={item}
              className={index === 1 ? "rounded-[14px] border border-[#e8e2ff] bg-[#f8f5ff] px-3 py-2 text-[#5b35f4]" : ""}
            >
              {index + 1}. {item}
            </li>
          ))}
        </ol>
      </RailCard>

      <Surface className="overflow-hidden bg-[linear-gradient(180deg,#f7f3ff_0%,#fff_100%)] p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[18px] font-extrabold text-[#141b2d]">Practice What You Learn</h3>
            <p className="mt-2 text-[14px] leading-6 text-[#58667f]">
              Solve problems on these patterns and level up.
            </p>
          </div>
          <span className="grid h-12 w-12 place-items-center rounded-[16px] bg-white text-[#f59e0b] shadow-sm">
            <TrophyMiniIcon />
          </span>
        </div>
        <button className="mt-5 inline-flex h-[46px] w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#5b35f4] to-[#744dff] text-[14px] font-bold text-white shadow-[0_18px_32px_rgba(91,53,244,0.2)]">
          Solve Problems <ArrowRightIcon width={15} height={15} />
        </button>
      </Surface>

      <RailCard title="Related Posts">
        <div className="space-y-4">
          {relatedPosts.map((post) => (
            <div key={post.title} className="flex items-start gap-3">
              <div className={`h-12 w-12 shrink-0 rounded-[14px] ${post.color}`} />
              <div>
                <div className="text-[14px] font-bold leading-6 text-[#141b2d]">{post.title}</div>
                <div className="mt-1 text-[13px] text-[#7d889e]">{post.date}</div>
              </div>
            </div>
          ))}
        </div>
        <Link href="/blog" className="mt-5 inline-flex text-[14px] font-bold text-[#5b35f4]">
          View all posts
        </Link>
      </RailCard>

      <RailCard title="Tags">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </RailCard>

      <RailCard title="Stay Updated">
        <p className="text-[14px] leading-6 text-[#5c6983]">
          Get notified when I publish new articles.
        </p>
        <label className="mt-5 block">
          <input
            className="h-[46px] w-full rounded-[14px] border border-[var(--color-border)] px-4 text-[14px] outline-none placeholder:text-[#7c879b]"
            placeholder="Enter your email"
          />
        </label>
        <button className="mt-4 inline-flex h-[46px] w-full items-center justify-center rounded-[14px] bg-gradient-to-r from-[#5b35f4] to-[#744dff] text-[14px] font-bold text-white">
          Subscribe
        </button>
      </RailCard>
    </>
  );
}

function Avatar() {
  return (
    <div className="relative h-11 w-11 overflow-hidden rounded-full border border-[#d6dbe7] bg-[#dce8ff]">
      <div className="absolute left-1/2 top-[8px] h-[12px] w-[12px] -translate-x-1/2 rounded-full bg-[#c98a54]" />
      <div className="absolute left-[11px] top-[5px] h-[8px] w-[18px] rounded-t-full bg-[#121827]" />
      <div className="absolute bottom-[2px] left-1/2 h-[19px] w-[24px] -translate-x-1/2 rounded-t-[11px] bg-[#253a68]" />
    </div>
  );
}

function ArticleArtwork() {
  return (
    <svg viewBox="0 0 460 280" className="h-full w-full" fill="none">
      <defs>
        <linearGradient id="panelPurple" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ede7ff" />
          <stop offset="1" stopColor="#6d49ff" />
        </linearGradient>
      </defs>
      <rect x="76" y="36" width="208" height="162" rx="14" fill="#fbfaff" stroke="#e7e1ff" />
      <rect x="132" y="62" width="92" height="40" rx="10" fill="url(#panelPurple)" />
      <text x="168" y="87" fill="white" fontSize="22" fontWeight="700">
        dp(i)
      </text>
      {([
        [96, 118, 26, 26, "#7b57ff"],
        [96, 156, 26, 26, "#825fff"],
        [96, 194, 26, 26, "#e8e2ff"],
        [140, 118, 26, 26, "#f0edff"],
        [140, 156, 26, 26, "#d9d0ff"],
        [140, 194, 26, 26, "#eee9ff"],
        [184, 118, 26, 26, "#f0edff"],
        [184, 156, 26, 26, "#7752ff"],
        [184, 194, 26, 26, "#ede8ff"],
        [228, 118, 26, 26, "#7550ff"],
        [228, 156, 26, 26, "#f0edff"],
      ] as const).map(([x, y, w, h, fill], index) => (
        <rect key={index} x={x} y={y} width={w} height={h} rx="5" fill={fill} />
      ))}
      <rect x="276" y="114" width="140" height="62" rx="12" fill="#ffffff" stroke="#ded7ff" />
      <text x="298" y="151" fill="#7684a0" fontSize="20" fontWeight="600">
        f(n) = f(n-1) + f(n-2)
      </text>
      <circle cx="246" cy="28" r="4" fill="#c4b9ff" />
      <circle cx="262" cy="28" r="4" fill="#7d59ff" />
      <circle cx="278" cy="28" r="4" fill="#6d49ff" />
      <circle cx="294" cy="28" r="4" fill="#5b35f4" />
      <path d="M338 52h32" stroke="#efeaff" strokeWidth="8" strokeLinecap="round" />
      <path d="M62 190c12-17 34-18 45-1" stroke="#efeaff" strokeWidth="5" strokeLinecap="round" />
      <path d="M318 80l12 12" stroke="#efeaff" strokeWidth="5" strokeLinecap="round" />
      <path d="M330 80l-12 12" stroke="#efeaff" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function IdeaIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4z" />
    </svg>
  );
}

function TrophyMiniIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M17 6h3a2 2 0 0 1-2 2h-1" />
      <path d="M7 6H4a2 2 0 0 0 2 2h1" />
    </svg>
  );
}
