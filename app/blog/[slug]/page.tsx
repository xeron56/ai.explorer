import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost, type Post } from "../../_lib/posts";
import { compileMdx } from "../../_lib/mdx";
import { ClockIcon, FileTextIcon, MoonIcon, SparklesIcon } from "../../_components/icons";
import { PostThumbnail } from "../../_components/PostThumbnail";

const TAGS = ["transformer", "normalization", "layernorm", "deep-learning", "optimization"];

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getPost(slug), getAllPosts()]);
  if (!post) notFound();

  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const previous = allPosts[0]?.slug === post.slug ? allPosts[1] : allPosts[0];
  const next = allPosts.find((p) => p.slug !== post.slug && p.date <= post.date) ?? related[0];

  return (
    <div className="mx-auto grid max-w-[946px] gap-[60px] pb-8 pt-[39px] xl:grid-cols-[minmax(0,624px)_256px]">
      <main>
        <ArticleHeader post={post} />
        {post.slug === "how-layernorm-stabilizes-transformers" ? (
          <LayerNormArticle />
        ) : (
          <MdxArticle post={post} />
        )}
        <PostPager previous={previous} next={next} currentSlug={post.slug} />
      </main>
      <PostAside related={related} />
    </div>
  );
}

function ArticleHeader({ post }: { post: Post }) {
  return (
    <header>
      <Link href="/blog" className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#17213a] hover:text-[var(--color-accent-strong)]">
        <span aria-hidden="true">&larr;</span> Back to all posts
      </Link>
      {post.category && (
        <div className="mt-[27px] w-fit rounded-full bg-[var(--color-accent-soft)] px-[12px] py-[7px] text-[13px] font-semibold leading-none text-[var(--color-accent-strong)]">
          {post.category}
        </div>
      )}
      <h1 className="mt-[17px] max-w-[560px] text-[38px] font-extrabold leading-[1.15] tracking-[-0.025em] text-[#10172d]">
        {post.title}
      </h1>
      {post.description && (
        <p className="mt-[14px] max-w-[555px] text-[18px] leading-[30px] text-[#44516a]">{post.description}</p>
      )}
      <div className="mt-[31px] flex flex-wrap items-center gap-[23px] text-[14px] text-[#263458]">
        <span className="inline-flex items-center gap-[10px]">
          <span className="relative h-[26px] w-[26px] overflow-hidden rounded-full bg-[#d7e5ff]">
            <span className="absolute left-1/2 top-[5px] h-[8px] w-[8px] -translate-x-1/2 rounded-full bg-[#c98952]" />
            <span className="absolute bottom-[2px] left-1/2 h-[13px] w-[17px] -translate-x-1/2 rounded-t-[8px] bg-[#253a68]" />
          </span>
          Arjun
        </span>
        <span>{post.formattedDate}</span>
        <span className="inline-flex items-center gap-2"><ClockIcon width={16} height={16} />{post.readingTime} min read</span>
        <span className="ml-auto flex items-center gap-[25px] text-[#111a31]">
          <ShareIcon />
          <BookmarkIcon />
          <MoonIcon width={20} height={20} />
        </span>
      </div>
    </header>
  );
}

async function MdxArticle({ post }: { post: Post }) {
  const MDX = await compileMdx(post.content);

  return (
    <div className="prose-post mt-[44px]">
      <MDX />
    </div>
  );
}

function LayerNormArticle() {
  return (
    <article className="mt-[44px] text-[#10172d]">
      <section id="motivation" className="scroll-mt-28">
        <h2 className="text-[20px] font-bold tracking-[-0.01em]">1. Motivation</h2>
        <p className="mt-[17px] text-[15.5px] leading-[27px] text-[#17213a]">
          Transformers stack many layers. Without proper normalization, the activations can explode or vanish, making optimization difficult.
        </p>
        <p className="mt-[18px] text-[15.5px] leading-[27px] text-[#17213a]">
          Layer Normalization (LayerNorm) normalizes across the features of a single example (i.e., across the last dimension).
        </p>
      </section>

      <section id="mathematics" className="mt-[31px] rounded-[8px] border bg-white p-[20px] shadow-[0_8px_24px_rgba(15,23,42,0.03)] scroll-mt-28" style={{ borderColor: "var(--color-border)" }}>
        <h2 className="text-[20px] font-bold tracking-[-0.01em]">2. The Mathematics</h2>
        <p className="mt-[18px] text-[15px] text-[#17213a]">
          Given an input vector <MathText>x in R<sup>d</sup></MathText>, LayerNorm computes:
        </p>
        <div className="mt-[26px] grid gap-[22px] text-[15px]">
          <FormulaRow index="1" label="Mean:" formula={<><MathText>&mu; = 1 / d &sum;<sub>i=1</sub><sup>d</sup> x<sub>i</sub></MathText></>} />
          <FormulaRow index="2" label="Variance:" formula={<><MathText>&sigma;<sup>2</sup> = 1 / d &sum;<sub>i=1</sub><sup>d</sup> (x<sub>i</sub> - &mu;)<sup>2</sup></MathText></>} />
          <FormulaRow index="3" label="Normalize:" formula={<><MathText>x&#770;<sub>i</sub> = (x<sub>i</sub> - &mu;) / &radic;(&sigma;<sup>2</sup> + &epsilon;)</MathText></>} />
          <FormulaRow index="4" label="Scale and shift:" formula={<><MathText>y<sub>i</sub> = &gamma;<sub>i</sub> x&#770;<sub>i</sub> + &beta;<sub>i</sub></MathText></>} />
        </div>
        <p className="mt-[25px] text-[14px] leading-[24px] text-[#17213a]">
          where gamma, beta in R<sup>d</sup> are learnable parameters and epsilon is a small constant.
        </p>
      </section>

      <section id="intuition" className="mt-[39px] scroll-mt-28">
        <h2 className="text-[20px] font-bold tracking-[-0.01em]">3. Intuition</h2>
        <div className="mt-[18px] grid gap-[13px]">
          <Insight text="Per-sample normalization: Each token (position) is normalized independently." />
          <Insight text="Stable gradients: Keeps the distribution of activations consistent across layers." />
          <Insight text="More robust training: Less sensitive to initialization and learning rate." />
        </div>
      </section>

      <section id="demo" className="mt-[38px] scroll-mt-28">
        <h2 className="text-[20px] font-bold tracking-[-0.01em]">4. Interactive Demo</h2>
        <p className="mt-[10px] text-[15px] text-[#44516a]">See how LayerNorm normalizes an input vector.</p>
        <div className="mt-[19px] grid overflow-hidden rounded-[8px] border bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:grid-cols-[270px_1fr]" style={{ borderColor: "var(--color-border)" }}>
          <div className="border-b p-[20px] md:border-b-0 md:border-r" style={{ borderColor: "var(--color-border)" }}>
            <div className="text-[12px] font-bold text-[#10172d]">Input vector (d = 8)</div>
            <div className="mt-[18px] grid grid-cols-4 gap-[8px]">
              {["1.2", "-0.7", "0.3", "2.1", "-1.4", "0.0", "0.8", "-0.3"].map((value) => (
                <span key={value} className="rounded-[5px] border bg-[#fbfcff] px-[8px] py-[7px] text-center text-[12px]" style={{ borderColor: "var(--color-border)" }}>{value}</span>
              ))}
            </div>
            <div className="mt-[32px] flex items-center justify-between text-[12px] font-bold text-[#10172d]">
              Epsilon (eps)
              <span className="rounded-[5px] border px-[8px] py-[5px] text-[12px] font-semibold text-[#44516a]" style={{ borderColor: "var(--color-border)" }}>1e-5</span>
            </div>
            <div className="mt-[16px] h-[5px] rounded-full bg-[#e3e4ea]">
              <div className="h-full w-[10px] rounded-full bg-[var(--color-accent-strong)]" />
            </div>
          </div>
          <DemoChart />
        </div>
        <div className="mt-[12px] flex items-center gap-[13px] rounded-[8px] border border-[#d8d0ff] bg-[#f8f5ff] px-[20px] py-[17px] text-[13px] text-[#5b4aa0]">
          <SparklesIcon width={19} height={19} />
          Try changing the values or epsilon to see how the normalized output changes!
        </div>
      </section>

      <section id="takeaways" className="mt-[39px] border-b pb-[31px] scroll-mt-28" style={{ borderColor: "var(--color-border)" }}>
        <h2 className="text-[20px] font-bold tracking-[-0.01em]">5. Key Takeaways</h2>
        <div className="mt-[18px] grid gap-[14px] text-[14px] text-[#17213a]">
          <CheckItem text="LayerNorm normalizes across features for each example." />
          <CheckItem text="It helps stabilize training of deep Transformer models." />
          <CheckItem text="Learnable scale and shift allow the model to recover representation power." />
        </div>
      </section>
    </article>
  );
}

function PostAside({ related }: { related: Post[] }) {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-[112px] space-y-[50px]">
        <SideCard>
          <h3 className="text-[13px] font-extrabold uppercase tracking-[0.02em] text-[#10172d]">On This Page</h3>
          <ol className="mt-[26px] grid gap-[24px] text-[14px] text-[#59657b]">
            <li>1. Motivation</li>
            <li><a href="#mathematics" className="text-[var(--color-accent-strong)]">2. The Mathematics</a></li>
            <li>3. Intuition</li>
            <li>4. Interactive Demo</li>
            <li>5. Key Takeaways</li>
          </ol>
        </SideCard>

        <SideCard>
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-extrabold uppercase tracking-[0.02em] text-[#10172d]">Live Code (Python)</h3>
            <button className="inline-flex h-[32px] items-center gap-2 rounded-[7px] border border-[#d8d0ff] bg-[#f5f1ff] px-[12px] text-[13px] font-bold text-[var(--color-accent-strong)]">
              <span className="h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-[var(--color-accent-strong)]" />
              Run
            </button>
          </div>
          <pre className="mt-[18px] overflow-hidden rounded-[8px] bg-[#f8f9fd] p-[14px] text-[11.5px] leading-[22px] text-[#111827]"><code>{`import torch
import torch.nn as nn

ln = nn.LayerNorm(8)
x = torch.tensor([[1.2, -0.7,
                   0.3, 2.1,
                  -1.4, 0.0,
                   0.8, -0.3]])

y = ln(x)
print(y)`}</code></pre>
          <div className="mt-[20px] text-[12px] font-bold text-[#10172d]">Output</div>
          <pre className="mt-[10px] overflow-hidden rounded-[7px] bg-[#101827] p-[13px] text-[11px] leading-[20px] text-white"><code>{`tensor([[ 0.9981, -1.1933, -0.0391,
          1.6650, -1.3380, -0.6531,
          0.4568,  0.0394]],
       grad_fn=<NativeLayerNor...>)`}</code></pre>
        </SideCard>

        <SideCard>
          <h3 className="text-[13px] font-extrabold uppercase tracking-[0.02em] text-[#10172d]">Related Posts</h3>
          <div className="mt-[27px] grid gap-[28px]">
            {related.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="grid grid-cols-[58px_1fr] gap-[14px]">
                <div className="h-[58px] overflow-hidden rounded-[6px]">
                  <PostThumbnail variant={(post.cardClassName as "rk" | "norm" | "diffusion" | "ssl") ?? "rk"} />
                </div>
                <div>
                  <div className="line-clamp-2 text-[14px] font-bold leading-[20px] text-[#10172d]">{post.title}</div>
                  <div className="mt-[7px] text-[12px] text-[#59657b]">{post.formattedDate}</div>
                </div>
              </Link>
            ))}
          </div>
        </SideCard>

        <SideCard>
          <h3 className="text-[13px] font-extrabold uppercase tracking-[0.02em] text-[#10172d]">Tags</h3>
          <div className="mt-[27px] flex flex-wrap gap-[10px]">
            {TAGS.map((tag) => (
              <span key={tag} className="rounded-[7px] bg-[var(--color-accent-soft)] px-[11px] py-[8px] text-[12px] font-semibold text-[var(--color-accent-strong)]">{tag}</span>
            ))}
          </div>
        </SideCard>
      </div>
    </aside>
  );
}

function SideCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-[12px] border bg-white p-[20px] shadow-[0_14px_32px_rgba(15,23,42,0.06)]" style={{ borderColor: "var(--color-border)" }}>
      {children}
    </section>
  );
}

function PostPager({ previous, next, currentSlug }: { previous?: Post; next?: Post; currentSlug: string }) {
  return (
    <nav className="mt-[23px] grid gap-4 md:grid-cols-2">
      {previous && previous.slug !== currentSlug ? (
        <Link href={`/blog/${previous.slug}`} className="rounded-[8px] border bg-white p-[18px] text-left" style={{ borderColor: "var(--color-border)" }}>
          <div className="text-[12px] text-[#7b849b]">&larr; Previous post</div>
          <div className="mt-[8px] max-w-[190px] text-[14px] font-bold leading-[20px] text-[#10172d]">{previous.title}</div>
        </Link>
      ) : <span />}
      {next && next.slug !== currentSlug && (
        <Link href={`/blog/${next.slug}`} className="rounded-[8px] border bg-white p-[18px] text-right" style={{ borderColor: "var(--color-border)" }}>
          <div className="text-[12px] text-[#7b849b]">Next post &rarr;</div>
          <div className="ml-auto mt-[8px] max-w-[190px] text-[14px] font-bold leading-[20px] text-[#10172d]">{next.title}</div>
        </Link>
      )}
    </nav>
  );
}

function FormulaRow({ index, label, formula }: { index: string; label: string; formula: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[24px_120px_1fr] items-center gap-[10px]">
      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[var(--color-accent-strong)] text-[11px] font-bold text-white">{index}</span>
      <span className="text-[13px] font-bold text-[#10172d]">{label}</span>
      <span className="text-[18px] text-[#10172d]">{formula}</span>
    </div>
  );
}

function MathText({ children }: { children: React.ReactNode }) {
  return <span className="font-serif italic">{children}</span>;
}

function Insight({ text }: { text: string }) {
  const [lead, rest] = text.split(": ");
  return (
    <div className="flex items-start gap-[13px] text-[14px] leading-[23px]">
      <span className="mt-[1px] flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-[6px] bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]">
        <FileTextIcon width={14} height={14} />
      </span>
      <p><strong>{lead}:</strong> {rest}</p>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-[11px]">
      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[var(--color-accent-strong)] text-[11px] font-bold text-white">✓</span>
      <span>{text}</span>
    </div>
  );
}

function DemoChart() {
  const bars = [
    { x: 29, h: 12, y: 84 },
    { x: 49, h: 36, y: 60 },
    { x: 77, h: 0, y: 96 },
    { x: 98, h: 31, y: 96 },
    { x: 132, h: 12, y: 84 },
    { x: 162, h: 34, y: 96 },
    { x: 194, h: 42, y: 54 },
    { x: 226, h: 32, y: 96 },
    { x: 256, h: 44, y: 96 },
    { x: 287, h: 24, y: 72 },
  ];

  return (
    <div className="p-[18px]">
      <svg viewBox="0 0 330 185" className="h-full min-h-[210px] w-full">
        <g fontSize="12" fill="#10172d">
          <text x="5" y="38">2</text>
          <text x="5" y="76">1</text>
          <text x="5" y="114">0</text>
          <text x="1" y="151">-1</text>
          <text x="1" y="178">-2</text>
        </g>
        <path d="M28 25V174H315" stroke="#dfe3ec" fill="none" />
        {[52, 84, 116, 148, 180, 212, 244, 276].map((x) => (
          <path key={x} d={`M${x} 25V174`} stroke="#dfe3ec" strokeDasharray="4 4" fill="none" />
        ))}
        <path d="M28 108H315" stroke="#dfe3ec" fill="none" />
        {bars.map((bar, index) => (
          <g key={index}>
            <rect x={bar.x + 7} y="50" width="11" height="58" fill="none" stroke="#a9b0c2" strokeDasharray="5 4" />
            {bar.y >= 96 ? (
              <rect x={bar.x} y="108" width="11" height={bar.h} fill="#6753e9" opacity="0.9" />
            ) : (
              <rect x={bar.x} y={bar.y} width="11" height={108 - bar.y} fill="#6753e9" opacity="0.9" />
            )}
          </g>
        ))}
        {["1", "2", "3", "4", "6", "7", "8"].map((label, i) => (
          <text key={label} x={47 + i * 38} y="184" fontSize="12" fill="#10172d">{label}</text>
        ))}
        <rect x="118" y="8" width="26" height="9" fill="#a9b0c2" />
        <text x="150" y="17" fontSize="12" fill="#10172d">Before</text>
        <rect x="210" y="8" width="26" height="9" fill="#6753e9" />
        <text x="242" y="17" fontSize="12" fill="#10172d">After LayerNorm</text>
      </svg>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12" />
      <path d="m7 8 5-5 5 5" />
      <path d="M5 13v7h14v-7" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 4h12v17l-6-4-6 4z" />
    </svg>
  );
}
