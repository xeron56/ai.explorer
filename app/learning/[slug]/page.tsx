import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMdx } from "../../_lib/mdx";
import { getLearningChapters, getLearningSeriesBySlug } from "../../_lib/posts";
import { ArrowRightIcon, ClockIcon } from "../../_components/icons";

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
  const MDX = await compileMdx(chapter.content);
  const previous = chapters.find((item) => item.order === chapter.order - 1);
  const next = chapters.find((item) => item.order === chapter.order + 1);

  return (
    <div className="mx-auto max-w-[820px] pb-14 pt-[39px]">
      <Link href="/learning" className="text-[13px] font-bold text-[var(--color-accent-strong)]">&larr; Back to learning</Link>
      <header className="mt-[28px] rounded-[10px] border bg-white p-[28px]" style={{ borderColor: "var(--color-border)" }}>
        <div className="text-[13px] font-bold text-[var(--color-accent-strong)]">{series?.title ?? "Learning"} / Chapter {chapter.order}</div>
        <h1 className="mt-[13px] text-[38px] font-extrabold leading-[1.12] tracking-[-0.03em] text-[#10172d]">{chapter.title}</h1>
        <p className="mt-[14px] max-w-[650px] text-[17px] leading-[28px] text-[#44516a]">{chapter.description}</p>
        <div className="mt-[23px] flex items-center gap-[18px] text-[13px] font-semibold text-[#59657b]">
          <span>{chapter.formattedDate}</span>
          <span className="inline-flex items-center gap-2"><ClockIcon width={15} height={15} />{chapter.readingTime} min read</span>
        </div>
      </header>
      <article className="prose-post mt-[34px]">
        <MDX />
      </article>
      <nav className="mt-[36px] grid gap-4 md:grid-cols-2">
        {previous ? <Pager href={`/learning/${previous.slug}`} label="Previous chapter" title={previous.title} /> : <span />}
        {next && <Pager href={`/learning/${next.slug}`} label="Next chapter" title={next.title} align="right" />}
      </nav>
    </div>
  );
}

function Pager({ href, label, title, align = "left" }: { href: string; label: string; title: string; align?: "left" | "right" }) {
  return (
    <Link href={href} className={`rounded-[8px] border bg-white p-[18px] ${align === "right" ? "text-right" : "text-left"}`} style={{ borderColor: "var(--color-border)" }}>
      <div className="text-[12px] text-[#7b849b]">{label} {align === "right" && <ArrowRightIcon className="ml-1 inline h-[13px] w-[13px]" />}</div>
      <div className={`mt-[8px] text-[14px] font-bold leading-[20px] text-[#10172d] ${align === "right" ? "ml-auto" : ""}`}>{title}</div>
    </Link>
  );
}
