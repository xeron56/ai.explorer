import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost, type Post } from "../../_lib/posts";
import { compileMdx } from "../../_lib/mdx";
import { ClockIcon, MoonIcon } from "../../_components/icons";
import { PostThumbnail } from "../../_components/PostThumbnail";

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
        <MdxArticle post={post} />
        <PostPager previous={previous} next={next} currentSlug={post.slug} />
      </main>
      <PostAside post={post} related={related} />
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

function PostAside({ post, related }: { post: Post; related: Post[] }) {
  const headings = extractHeadings(post.content).slice(0, 5);

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-[112px] space-y-[50px]">
        <SideCard>
          <h3 className="text-[13px] font-extrabold uppercase tracking-[0.02em] text-[#10172d]">On This Page</h3>
          <ol className="mt-[26px] grid gap-[24px] text-[14px] text-[#59657b]">
            {headings.map((heading, index) => (
              <li key={heading}>{index + 1}. {heading}</li>
            ))}
          </ol>
        </SideCard>

        {post.liveCode && <SideCard>
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-extrabold uppercase tracking-[0.02em] text-[#10172d]">Live Code (Python)</h3>
            <button className="inline-flex h-[32px] items-center gap-2 rounded-[7px] border border-[#d8d0ff] bg-[#f5f1ff] px-[12px] text-[13px] font-bold text-[var(--color-accent-strong)]">
              <span className="h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-[var(--color-accent-strong)]" />
              Run
            </button>
          </div>
          <pre className="mt-[18px] overflow-hidden rounded-[8px] bg-[#f8f9fd] p-[14px] text-[11.5px] leading-[22px] text-[#111827]"><code>{post.liveCode}</code></pre>
          {post.liveOutput && <>
            <div className="mt-[20px] text-[12px] font-bold text-[#10172d]">Output</div>
            <pre className="mt-[10px] overflow-hidden rounded-[7px] bg-[#101827] p-[13px] text-[11px] leading-[20px] text-white"><code>{post.liveOutput}</code></pre>
          </>}
        </SideCard>}

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
            {post.tags.map((tag) => (
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

function extractHeadings(content: string) {
  return content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => line.replace(/^##\s+/, "").replace(/[#*_`]/g, "").trim());
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
